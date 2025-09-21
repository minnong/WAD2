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
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { db, storage } from '../config/firebase';

// Interfaces
export interface FirebaseListing {
  id?: string;
  name: string;
  description: string;
  category: string;
  price: number;
  period: string;
  location: string;
  condition: string;
  availability: string;
  imageUrls: string[];
  owner: string;
  ownerContact: string;
  coordinates: { lat: number; lng: number };
  rating: number;
  reviews: number;
  createdAt: any;
  updatedAt: any;
}

export interface FirebaseRentalRequest {
  id?: string;
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
  location: string;
  createdAt: any;
  updatedAt: any;
}

export interface FirebaseReview {
  id?: string;
  listingId: string;
  reviewerName: string;
  reviewerEmail: string;
  rating: number;
  comment: string;
  createdAt: any;
}

// Listings Services
export class ListingsService {
  private collection = collection(db, 'listings');

  async createListing(listing: Omit<FirebaseListing, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviews'>): Promise<string> {
    const docRef = await addDoc(this.collection, {
      ...listing,
      rating: 0,
      reviews: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  }

  async getAllListings(): Promise<FirebaseListing[]> {
    const q = query(this.collection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FirebaseListing[];
  }

  async getListingById(id: string): Promise<FirebaseListing | null> {
    const docRef = doc(db, 'listings', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as FirebaseListing;
    }
    return null;
  }

  async getUserListings(userEmail: string): Promise<FirebaseListing[]> {
    const q = query(
      this.collection,
      where('ownerContact', '==', userEmail),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FirebaseListing[];
  }

  async updateListing(id: string, updates: Partial<FirebaseListing>): Promise<void> {
    const docRef = doc(db, 'listings', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }

  async deleteListing(id: string): Promise<void> {
    const docRef = doc(db, 'listings', id);
    await deleteDoc(docRef);
  }

  async searchListings(searchTerm: string, category?: string): Promise<FirebaseListing[]> {
    let q = query(this.collection, orderBy('createdAt', 'desc'));

    if (category && category !== 'All') {
      q = query(this.collection, where('category', '==', category), orderBy('createdAt', 'desc'));
    }

    const querySnapshot = await getDocs(q);
    const allListings = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FirebaseListing[];

    // Client-side filtering for search term (Firestore doesn't support text search natively)
    if (searchTerm) {
      return allListings.filter(listing =>
        listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return allListings;
  }
}

// Rental Requests Services
export class RentalRequestsService {
  private collection = collection(db, 'rentalRequests');

  async createRentalRequest(request: Omit<FirebaseRentalRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(this.collection, {
      ...request,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  }

  async getUserRentalRequests(userEmail: string): Promise<FirebaseRentalRequest[]> {
    const q = query(
      this.collection,
      where('renterEmail', '==', userEmail),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FirebaseRentalRequest[];
  }

  async getOwnerRentalRequests(ownerEmail: string): Promise<FirebaseRentalRequest[]> {
    const q = query(
      this.collection,
      where('ownerEmail', '==', ownerEmail),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FirebaseRentalRequest[];
  }

  async updateRentalRequestStatus(id: string, status: FirebaseRentalRequest['status']): Promise<void> {
    const docRef = doc(db, 'rentalRequests', id);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp()
    });
  }

  async deleteRentalRequest(id: string): Promise<void> {
    const docRef = doc(db, 'rentalRequests', id);
    await deleteDoc(docRef);
  }
}

// Reviews Services
export class ReviewsService {
  private collection = collection(db, 'reviews');

  async createReview(review: Omit<FirebaseReview, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(this.collection, {
      ...review,
      createdAt: serverTimestamp()
    });

    // Update listing rating
    await this.updateListingRating(review.listingId);

    return docRef.id;
  }

  async getListingReviews(listingId: string): Promise<FirebaseReview[]> {
    const q = query(
      this.collection,
      where('listingId', '==', listingId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FirebaseReview[];
  }

  private async updateListingRating(listingId: string): Promise<void> {
    const reviews = await this.getListingReviews(listingId);
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    const listingRef = doc(db, 'listings', listingId);
    await updateDoc(listingRef, {
      rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      reviews: reviews.length,
      updatedAt: serverTimestamp()
    });
  }
}

// Image Upload Services
export class ImageUploadService {
  async uploadImages(files: File[], path: string): Promise<string[]> {
    const uploadPromises = files.map(async (file, index) => {
      const timestamp = Date.now();
      const filename = `${timestamp}_${index}_${file.name}`;
      const storageRef = ref(storage, `${path}/${filename}`);

      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    });

    return await Promise.all(uploadPromises);
  }

  async deleteImage(imageUrl: string): Promise<void> {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  }
}

// Export service instances
export const listingsService = new ListingsService();
export const rentalRequestsService = new RentalRequestsService();
export const reviewsService = new ReviewsService();
export const imageUploadService = new ImageUploadService();