import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { ConditionReport, Dispute, DisputeMessage } from '../types/conditionTracking';

// Condition Reports Service
export class ConditionReportsService {
  private collection = collection(db, 'conditionReports');

  async createReport(report: Omit<ConditionReport, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(this.collection, {
        ...report,
        createdAt: serverTimestamp()
      });
      console.log('Condition report created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating condition report:', error);
      throw error;
    }
  }

  async getReportById(id: string): Promise<ConditionReport | null> {
    try {
      const docRef = doc(db, 'conditionReports', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as ConditionReport;
      }
      return null;
    } catch (error) {
      console.error('Error getting condition report:', error);
      throw error;
    }
  }

  async getReportsByRental(rentalRequestId: string): Promise<ConditionReport[]> {
    try {
      const q = query(
        this.collection,
        where('rentalRequestId', '==', rentalRequestId)
      );
      const querySnapshot = await getDocs(q);
      const reports = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ConditionReport[];

      // Sort by createdAt ascending to maintain chronological order
      reports.sort((a, b) => {
        const aDate = a.createdAt && typeof a.createdAt === 'object' && 'toDate' in a.createdAt
          ? a.createdAt.toDate()
          : new Date(a.createdAt);
        const bDate = b.createdAt && typeof b.createdAt === 'object' && 'toDate' in b.createdAt
          ? b.createdAt.toDate()
          : new Date(b.createdAt);
        return aDate.getTime() - bDate.getTime();
      });

      return reports;
    } catch (error) {
      console.error('Error getting condition reports by rental:', error);
      throw error;
    }
  }

  async getReportsByListing(listingId: string): Promise<ConditionReport[]> {
    try {
      const q = query(
        this.collection,
        where('listingId', '==', listingId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ConditionReport[];
    } catch (error) {
      console.error('Error getting condition reports by listing:', error);
      throw error;
    }
  }

  async verifyReport(reportId: string, verifiedBy: string): Promise<void> {
    try {
      const docRef = doc(db, 'conditionReports', reportId);
      await updateDoc(docRef, {
        verifiedBy,
        verifiedAt: serverTimestamp()
      });
      console.log('Condition report verified');
    } catch (error) {
      console.error('Error verifying condition report:', error);
      throw error;
    }
  }

  async updateReport(id: string, updates: Partial<ConditionReport>): Promise<void> {
    try {
      const docRef = doc(db, 'conditionReports', id);
      await updateDoc(docRef, updates);
      console.log('Condition report updated');
    } catch (error) {
      console.error('Error updating condition report:', error);
      throw error;
    }
  }

  async deleteReport(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'conditionReports', id);
      await deleteDoc(docRef);
      console.log('Condition report deleted');
    } catch (error) {
      console.error('Error deleting condition report:', error);
      throw error;
    }
  }
}

// Disputes Service
export class DisputesService {
  private collection = collection(db, 'disputes');

  async createDispute(dispute: Omit<Dispute, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(this.collection, {
        ...dispute,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log('Dispute created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating dispute:', error);
      throw error;
    }
  }

  async getDisputeById(id: string): Promise<Dispute | null> {
    try {
      const docRef = doc(db, 'disputes', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Dispute;
      }
      return null;
    } catch (error) {
      console.error('Error getting dispute:', error);
      throw error;
    }
  }

  async getDisputesByUser(userEmail: string): Promise<Dispute[]> {
    try {
      // Get disputes where user is either the one who raised it or the one it's against
      const raisedByQuery = query(
        this.collection,
        where('raisedBy', '==', userEmail)
      );
      const againstQuery = query(
        this.collection,
        where('againstUser', '==', userEmail)
      );

      const [raisedBySnapshot, againstSnapshot] = await Promise.all([
        getDocs(raisedByQuery),
        getDocs(againstQuery)
      ]);

      const raisedByDisputes = raisedBySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Dispute[];

      const againstDisputes = againstSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Dispute[];

      // Combine and deduplicate
      const allDisputes = [...raisedByDisputes, ...againstDisputes];
      const uniqueDisputes = allDisputes.filter((dispute, index, self) =>
        index === self.findIndex(d => d.id === dispute.id)
      );

      // Sort by updatedAt descending
      uniqueDisputes.sort((a, b) => {
        const aDate = a.updatedAt && typeof a.updatedAt === 'object' && 'toDate' in a.updatedAt
          ? a.updatedAt.toDate()
          : new Date(a.updatedAt);
        const bDate = b.updatedAt && typeof b.updatedAt === 'object' && 'toDate' in b.updatedAt
          ? b.updatedAt.toDate()
          : new Date(b.updatedAt);
        return bDate.getTime() - aDate.getTime();
      });

      return uniqueDisputes;
    } catch (error) {
      console.error('Error getting disputes by user:', error);
      throw error;
    }
  }

  async getDisputesByRental(rentalRequestId: string): Promise<Dispute[]> {
    try {
      const q = query(
        this.collection,
        where('rentalRequestId', '==', rentalRequestId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Dispute[];
    } catch (error) {
      console.error('Error getting disputes by rental:', error);
      throw error;
    }
  }

  async getDisputesByListing(listingId: string): Promise<Dispute[]> {
    try {
      const q = query(
        this.collection,
        where('listingId', '==', listingId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Dispute[];
    } catch (error) {
      console.error('Error getting disputes by listing:', error);
      throw error;
    }
  }

  async updateDisputeStatus(id: string, status: Dispute['status']): Promise<void> {
    try {
      const docRef = doc(db, 'disputes', id);
      await updateDoc(docRef, {
        status,
        updatedAt: serverTimestamp()
      });
      console.log('Dispute status updated to:', status);
    } catch (error) {
      console.error('Error updating dispute status:', error);
      throw error;
    }
  }

  async resolveDispute(
    id: string,
    resolvedBy: string,
    outcome: string,
    compensationAmount?: number
  ): Promise<void> {
    try {
      const docRef = doc(db, 'disputes', id);
      await updateDoc(docRef, {
        status: 'resolved',
        resolution: {
          resolvedBy,
          resolvedAt: serverTimestamp(),
          outcome,
          ...(compensationAmount !== undefined && { compensationAmount })
        },
        updatedAt: serverTimestamp()
      });
      console.log('Dispute resolved');
    } catch (error) {
      console.error('Error resolving dispute:', error);
      throw error;
    }
  }

  async addDisputeMessage(
    disputeId: string,
    message: Omit<DisputeMessage, 'id' | 'createdAt'>
  ): Promise<void> {
    try {
      const docRef = doc(db, 'disputes', disputeId);
      const disputeSnap = await getDoc(docRef);

      if (!disputeSnap.exists()) {
        throw new Error('Dispute not found');
      }

      const dispute = disputeSnap.data() as Dispute;
      const messages = dispute.messages || [];
      const newMessage: DisputeMessage = {
        ...message,
        id: `msg_${Date.now()}`,
        createdAt: serverTimestamp()
      };

      messages.push(newMessage);

      await updateDoc(docRef, {
        messages,
        updatedAt: serverTimestamp()
      });
      console.log('Dispute message added');
    } catch (error) {
      console.error('Error adding dispute message:', error);
      throw error;
    }
  }

  async updateDispute(id: string, updates: Partial<Dispute>): Promise<void> {
    try {
      const docRef = doc(db, 'disputes', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      console.log('Dispute updated');
    } catch (error) {
      console.error('Error updating dispute:', error);
      throw error;
    }
  }

  async deleteDispute(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'disputes', id);
      await deleteDoc(docRef);
      console.log('Dispute deleted');
    } catch (error) {
      console.error('Error deleting dispute:', error);
      throw error;
    }
  }

  async checkActiveDisputeForRental(rentalRequestId: string): Promise<boolean> {
    try {
      const q = query(
        this.collection,
        where('rentalRequestId', '==', rentalRequestId),
        where('status', 'in', ['open', 'under-review'])
      );
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking active dispute:', error);
      return false;
    }
  }
}

// Export service instances
export const conditionReportsService = new ConditionReportsService();
export const disputesService = new DisputesService();
