import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  increment,
  getDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';
import { emailService } from '../services/emailService';
import { updateGamification } from '../services/gamificationService';


interface RentalRequest {
  id: string;
  toolId: string;
  toolName: string;
  toolImage: string;
  renterName: string;
  renterEmail: string;
  ownerEmail: string;
  ownerName: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  message: string;
  totalCost: number;
  depositAmount?: number;
  totalWithDeposit?: number;
  status: 'pending' | 'approved' | 'declined' | 'active' | 'completed' | 'cancelled';
  requestDate: Timestamp | Date;
  location: string;
  hasReview?: boolean;
  paymentStatus?: 'unpaid' | 'paid';
  paymentDate?: string;
  // payment tracking
  paidAmount?: number;                  // how much Stripe actually took (rental + deposit)
  stripePaymentIntentId?: string;       // set by webhook later
  stripeChargeId?: string;              // set by webhook later
  // deposit lifecycle
  completionDate?: string;              // ISO when owner marked as completed
  reportWindowActive?: boolean;         // true for 24h after completion
  depositRefundDeadline?: string;       // ISO = completionDate + 24h
  depositForfeited?: boolean;           // owner reported issue → keep deposit
  depositRefunded?: boolean;            // auto-refunded after 24h no report


}


interface RentalsContextType {
  userRentalRequests: RentalRequest[]; // Requests made BY the current user
  receivedRentalRequests: RentalRequest[]; // Requests received by the current user (for their listings)
  loading: boolean;
  addRentalRequest: (request: Omit<RentalRequest, 'id' | 'requestDate'>) => Promise<{ emailsSent: boolean }>;
  updateRentalStatus: (id: string, status: RentalRequest['status']) => Promise<void>;
  updateRentalData: (id: string, data: Partial<RentalRequest>) => Promise<void>;
  getUserRentals: () => RentalRequest[];
  checkDateConflict: (toolId: string, startDate: string, endDate: string, excludeRequestId?: string) => boolean;
  getUnavailableDates: (toolId: string) => Array<{ start: string; end: string; status: string }>;
  markAsPaid: (id: string) => Promise<void>;
}

const RentalsContext = createContext<RentalsContextType | null>(null);

export function useRentals() {
  const context = useContext(RentalsContext);
  if (!context) {
    throw new Error('useRentals must be used within a RentalsProvider');
  }
  return context;
}

interface RentalsProviderProps {
  children: ReactNode;
}

export function RentalsProvider({ children }: RentalsProviderProps) {
  const [userRentalRequests, setUserRentalRequests] = useState<RentalRequest[]>([]);
  const [receivedRentalRequests, setReceivedRentalRequests] = useState<RentalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Subscribe to rental requests made BY the current user
  useEffect(() => {
    if (!currentUser) {
      setUserRentalRequests([]);
      setReceivedRentalRequests([]);
      setLoading(false);
      return;
    }

    const rentalsCollection = collection(db, 'rentalRequests');

    // Get requests made BY the current user (where they are the renter)
    const userRequestsQuery = query(
      rentalsCollection,
      where('renterEmail', '==', currentUser.email || '')
    );

    const unsubscribeUserRequests = onSnapshot(userRequestsQuery, async (snapshot) => {
      const userRequestsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as RentalRequest[];

      setUserRentalRequests(userRequestsData);
      // 🔄 Auto-refund deposits after 24 hours if not reported
      const now = new Date();
      const expiredRentals = userRequestsData.filter(rental =>
        rental.status === 'completed' &&
        rental.reportWindowActive &&
        rental.depositRefundDeadline &&
        !rental.depositForfeited &&
        new Date(rental.depositRefundDeadline) < now
      );

      for (const rental of expiredRentals) {
        console.log(`Auto-refunding deposit for rental ${rental.id}`);
        await updateRentalData(rental.id, {
          reportWindowActive: false,
          depositRefunded: true,
        });
      }

      setLoading(false);
    }, (error) => {
      console.error('Error fetching user rental requests:', error);
      setLoading(false);
    });

    // Get requests received BY the current user (where they are the owner)
    const receivedRequestsQuery = query(
      rentalsCollection,
      where('ownerEmail', '==', currentUser.email || '')
    );

    const unsubscribeReceivedRequests = onSnapshot(receivedRequestsQuery, async (snapshot) => {
      const receivedRequestsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as RentalRequest[];

      setReceivedRentalRequests(receivedRequestsData);
      // 🔄 Auto-refund deposits after 24 hours if not reported
      const now = new Date();
      const expiredRentals = receivedRequestsData.filter(rental =>
        rental.status === 'completed' &&
        rental.reportWindowActive &&
        rental.depositRefundDeadline &&
        !rental.depositForfeited &&
        new Date(rental.depositRefundDeadline) < now
      );

      for (const rental of expiredRentals) {
        console.log(`Auto-refunding deposit for rental ${rental.id}`);
        await updateRentalData(rental.id, {
          reportWindowActive: false,
          depositRefunded: true,
        });
        try {
          await updateGamification(rental.renterEmail, 'renter', 'rent_success');
          console.log(`🎯 Gamification: renter ${rental.renterEmail} +25 pts (no forfeit)`);
        } catch (err) {
          console.error('❌ Failed to update renter gamification:', err);
        }
      }
    }, (error) => {
      console.error('Error fetching received rental requests:', error);
    });

    return () => {
      unsubscribeUserRequests();
      unsubscribeReceivedRequests();
    };
  }, [currentUser]);

  const checkDateConflict = (toolId: string, startDate: string, endDate: string, excludeRequestId?: string) => {
    // Get all approved/active rentals for this tool
    const approvedRentals = [...userRentalRequests, ...receivedRentalRequests].filter(
      rental =>
        rental.toolId === toolId &&
        (rental.status === 'approved' || rental.status === 'active') &&
        rental.id !== excludeRequestId // Exclude the current request when checking
    );

    const newStart = new Date(startDate);
    const newEnd = new Date(endDate);

    // Check for overlaps with existing rentals
    return approvedRentals.some(rental => {
      const existingStart = new Date(rental.startDate);
      const existingEnd = new Date(rental.endDate);

      // Check if dates overlap
      return (newStart <= existingEnd) && (newEnd >= existingStart);
    });
  };

  const getUnavailableDates = (toolId: string) => {
    // Get all approved/active rentals for this tool
    const approvedRentals = [...userRentalRequests, ...receivedRentalRequests].filter(
      rental =>
        rental.toolId === toolId &&
        (rental.status === 'approved' || rental.status === 'active')
    );

    return approvedRentals.map(rental => ({
      start: rental.startDate,
      end: rental.endDate,
      status: rental.status
    }));
  };

  const addRentalRequest = async (requestData: Omit<RentalRequest, 'id' | 'requestDate'>) => {
  if (!currentUser) {
    throw new Error('User must be authenticated to create rental requests');
  }

  // ✅ Check for date conflicts before creating the request
  if (checkDateConflict(requestData.toolId, requestData.startDate, requestData.endDate)) {
    throw new Error('The selected dates conflict with an existing rental. Please choose different dates.');
  }

  try {
    // ✅ Add default payment fields here
    const newRequest = {
      ...requestData,
      depositAmount: requestData.depositAmount ?? Math.round(requestData.totalCost * 0.2 * 100) / 100,
      totalWithDeposit: requestData.totalWithDeposit ?? Math.round(requestData.totalCost * 1.2 * 100) / 100,
      requestDate: serverTimestamp(),
      paymentStatus: "unpaid",      // 👈 new field: ensures “Make Payment” shows later
      paymentDate: null,            // 👈 for tracking
      // deposit lifecycle defaults
      reportWindowActive: false,
      depositForfeited: false,
      depositRefunded: false,
      paidAmount: 0,
    };

    // ✅ Add rental request to Firestore
    await addDoc(collection(db, 'rentalRequests'), newRequest);

    // ✅ Send email notifications (keep your original emailService code)
    const emailData = {
      ownerName: requestData.ownerName,
      ownerEmail: requestData.ownerEmail,
      renterName: requestData.renterName,
      renterEmail: requestData.renterEmail,
      itemName: requestData.toolName,
      startDate: requestData.startDate,
      endDate: requestData.endDate,
      totalCost: requestData.totalCost,
      message: requestData.message,
    };

    const [ownerEmailResult, renterEmailResult] = await Promise.all([
      emailService.sendRentalRequestToOwner(emailData),
      emailService.sendRentalRequestConfirmationToRenter(emailData),
    ]);

    const emailsSent = ownerEmailResult.success && renterEmailResult.success;

    return { emailsSent };
  } catch (error) {
    console.error('Error adding rental request:', error);
    throw error;
  }
};


  const updateRentalStatus = async (id: string, status: RentalRequest['status']) => {
    if (!currentUser) {
      throw new Error('User must be authenticated to update rental status');
    }

    try {
      // Verify the user has permission to update this rental
      const canUpdate = [...userRentalRequests, ...receivedRentalRequests].some(
        request => request.id === id &&
        (request.renterEmail === currentUser.email || request.ownerEmail === currentUser.email)
      );

      if (!canUpdate) {
        throw new Error('You can only update rentals you are involved in');
      }

      const rentalRef = doc(db, 'rentalRequests', id);
      await updateDoc(rentalRef, { status });
    } catch (error) {
      console.error('Error updating rental status:', error);
      throw error;
    }
  };

  const updateRentalData = async (id: string, data: Partial<RentalRequest>) => {
    if (!currentUser) {
      throw new Error('User must be authenticated to update rental data');
    }

    try {
      // Verify the user has permission to update this rental
      const canUpdate = [...userRentalRequests, ...receivedRentalRequests].some(
        request => request.id === id &&
        (request.renterEmail === currentUser.email || request.ownerEmail === currentUser.email)
      );

      if (!canUpdate) {
        throw new Error('You can only update rentals you are involved in');
      }

      const rentalRef = doc(db, 'rentalRequests', id);
      await updateDoc(rentalRef, data);
    } catch (error) {
      console.error('Error updating rental data:', error);
      throw error;
    }
  };
    // ✅ Mark rental as paid (used after Stripe success)
  const markAsPaid = async (id: string) => {
    if (!currentUser) {
      throw new Error("User must be authenticated to mark payment");
    }

    try {
      const rentalRef = doc(db, "rentalRequests", id);

      await updateDoc(rentalRef, {
        paymentStatus: "paid",
        paymentDate: new Date().toISOString(),
      });

      console.log(`✅ Rental ${id} marked as paid.`);
    } catch (error) {
      console.error("Error marking rental as paid:", error);
      throw error;
    }
  };


  const getUserRentals = () => {
    // Return the user's rental requests (already filtered by current user)
    return userRentalRequests;
  };

  /**
 * 🎯 Centralized gamification updater
 * Handles points & badges for owners/renters after each action
 */
  const updateGamification = async (userEmail: string, role: "owner" | "renter", action: string) => {
    try {
      const userRef = doc(db, "users", userEmail);
      const snap = await getDoc(userRef);
      const data = snap.data() || {};

      const pointsField = role === "owner" ? "ownerPoints" : "renterPoints";
      let incrementValue = 0;

      // 🎮 point logic
      switch (action) {
        case "rent_success": // renter completes rental
          incrementValue = 25;
          data.successfulRentals = (data.successfulRentals || 0) + 1;
          break;
        case "leave_review_renter":
          incrementValue = 5;
          data.reviewsWritten = (data.reviewsWritten || 0) + 1;
          break;
        case "receive_positive_review":
          incrementValue = 10;
          break;
        case "list_item":
          incrementValue = 10;
          break;
        case "approve_rental":
          incrementValue = 20;
          break;
        case "complete_rental":
          incrementValue = 30;
          data.successfulRentals = (data.successfulRentals || 0) + 1;
          break;
        case "leave_review_owner":
          incrementValue = 5;
          break;
        default:
          incrementValue = 0;
      }

      // 🧮 update points
      await updateDoc(userRef, {
        [pointsField]: increment(incrementValue),
        successfulRentals: data.successfulRentals || 0,
        reviewsWritten: data.reviewsWritten || 0,
      });

      // 🏅 badge logic
      const newBadges = new Set(data.badges || []);
      if ((data.successfulRentals || 0) >= 3) newBadges.add("Reliable Renter");
      if ((data.reviewsWritten || 0) >= 5) newBadges.add("Engaged Reviewer");
      if ((data.avgRating || 0) >= 4.5) newBadges.add("Perfect Partner");

      await updateDoc(userRef, { badges: Array.from(newBadges) });

      console.log(`✅ Gamification updated for ${userEmail}: +${incrementValue} pts`);
    } catch (error) {
      console.error("❌ Error updating gamification:", error);
    }
  };


  return (
    <RentalsContext.Provider
      value={{
        userRentalRequests,
        receivedRentalRequests,
        loading,
        addRentalRequest,
        updateRentalStatus,
        updateRentalData,
        getUserRentals,
        checkDateConflict,
        getUnavailableDates,
        markAsPaid,
      }}
    >
      {children}
    </RentalsContext.Provider>
  );
}