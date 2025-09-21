import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

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
  status: 'pending' | 'approved' | 'declined' | 'active' | 'completed' | 'cancelled';
  requestDate: Timestamp | Date;
  location: string;
  userId: string;
}

interface UserListing {
  id: number;
  name: string;
  price: number;
  period: string;
  listedDate: string;
  status: 'available' | 'rented' | 'maintenance';
  views: number;
  inquiries: number;
  image: string;
  imageUrl?: string;
  totalEarnings: number;
  currentRenter?: string;
  returnDate?: string;
}

interface RentalsContextType {
  rentalRequests: RentalRequest[];
  userListings: UserListing[];
  loading: boolean;
  addRentalRequest: (request: Omit<RentalRequest, 'id' | 'requestDate' | 'userId'>) => Promise<void>;
  addUserListing: (listing: UserListing) => void;
  updateRentalStatus: (id: string, status: RentalRequest['status']) => Promise<void>;
  updateListingStatus: (id: number, status: UserListing['status']) => void;
  getUserRentals: (userEmail: string) => RentalRequest[];
  getUserListings: (userEmail: string) => UserListing[];
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
  const [rentalRequests, setRentalRequests] = useState<RentalRequest[]>([]);
  const [userListings, setUserListings] = useState<UserListing[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Subscribe to rental requests in real-time
  useEffect(() => {
    const rentalsCollection = collection(db, 'rentalRequests');
    const rentalsQuery = query(rentalsCollection, orderBy('requestDate', 'desc'));

    const unsubscribe = onSnapshot(rentalsQuery, (snapshot) => {
      const rentalsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as RentalRequest[];

      setRentalRequests(rentalsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching rental requests:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addRentalRequest = async (requestData: Omit<RentalRequest, 'id' | 'requestDate' | 'userId'>) => {
    if (!currentUser) {
      throw new Error('User must be authenticated to create rental requests');
    }

    try {
      const newRequest = {
        ...requestData,
        requestDate: serverTimestamp(),
        userId: currentUser.uid,
      };

      await addDoc(collection(db, 'rentalRequests'), newRequest);
    } catch (error) {
      console.error('Error adding rental request:', error);
      throw error;
    }
  };

  const addUserListing = (listing: UserListing) => {
    setUserListings(prev => [...prev, listing]);
  };

  const updateRentalStatus = async (id: string, status: RentalRequest['status']) => {
    try {
      const rentalRef = doc(db, 'rentalRequests', id);
      await updateDoc(rentalRef, { status });
    } catch (error) {
      console.error('Error updating rental status:', error);
      throw error;
    }
  };

  const updateListingStatus = (id: number, status: UserListing['status']) => {
    setUserListings(prev =>
      prev.map(listing =>
        listing.id === id ? { ...listing, status } : listing
      )
    );
  };

  const getUserRentals = (userEmail: string) => {
    return rentalRequests.filter(request => request.renterEmail === userEmail);
  };

  const getUserListings = () => {
    // For now, we'll return all user listings since we don't have owner email tracking
    // In a real app, you'd filter by owner email
    return userListings;
  };

  return (
    <RentalsContext.Provider
      value={{
        rentalRequests,
        userListings,
        loading,
        addRentalRequest,
        addUserListing,
        updateRentalStatus,
        updateListingStatus,
        getUserRentals,
        getUserListings,
      }}
    >
      {children}
    </RentalsContext.Provider>
  );
}