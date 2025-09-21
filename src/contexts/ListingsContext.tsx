import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

interface Listing {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  period: string;
  location: string;
  condition: string;
  availability: string;
  image: string;
  owner: string;
  ownerContact: string;
  coordinates: { lat: number; lng: number };
  rating: number;
  reviews: number;
  createdAt: Timestamp | Date;
  userId: string;
}

interface ListingsContextType {
  listings: Listing[];
  loading: boolean;
  addListing: (listing: Omit<Listing, 'id' | 'rating' | 'reviews' | 'createdAt' | 'userId'>) => Promise<void>;
  updateListing: (id: string, updates: Partial<Listing>) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
}

const ListingsContext = createContext<ListingsContextType | null>(null);

export function useListings() {
  const context = useContext(ListingsContext);
  if (!context) {
    throw new Error('useListings must be used within a ListingsProvider');
  }
  return context;
}

interface ListingsProviderProps {
  children: ReactNode;
}

export function ListingsProvider({ children }: ListingsProviderProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Subscribe to listings in real-time
  useEffect(() => {
    const listingsCollection = collection(db, 'listings');
    const listingsQuery = query(listingsCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(listingsQuery, (snapshot) => {
      const listingsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Listing[];

      setListings(listingsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching listings:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addListing = async (listingData: Omit<Listing, 'id' | 'rating' | 'reviews' | 'createdAt' | 'userId'>) => {
    if (!currentUser) {
      throw new Error('User must be authenticated to create listings');
    }

    try {
      const newListing = {
        ...listingData,
        rating: 0,
        reviews: 0,
        createdAt: serverTimestamp(),
        userId: currentUser.uid,
      };

      await addDoc(collection(db, 'listings'), newListing);
    } catch (error) {
      console.error('Error adding listing:', error);
      throw error;
    }
  };

  const updateListing = async (id: string, updates: Partial<Listing>) => {
    try {
      const listingRef = doc(db, 'listings', id);
      await updateDoc(listingRef, updates);
    } catch (error) {
      console.error('Error updating listing:', error);
      throw error;
    }
  };

  const deleteListing = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'listings', id));
    } catch (error) {
      console.error('Error deleting listing:', error);
      throw error;
    }
  };

  return (
    <ListingsContext.Provider
      value={{
        listings,
        loading,
        addListing,
        updateListing,
        deleteListing,
      }}
    >
      {children}
    </ListingsContext.Provider>
  );
}