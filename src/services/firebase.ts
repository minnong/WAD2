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
    try {
      // Try both ownerContact and userId approaches
      // First try by ownerContact (for backward compatibility)
      const emailQuery = query(
        this.collection,
        where('ownerContact', '==', userEmail)
      );
      const emailSnapshot = await getDocs(emailQuery);
      
      let listings = emailSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirebaseListing[];
      
      // Also try to find by userId if we can find the user's UID
      try {
        const usersRef = collection(db, 'users');
        const userQuery = query(usersRef, where('email', '==', userEmail));
        const userSnapshot = await getDocs(userQuery);
        
        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0];
          const userId = userData.id; // The document ID is the user's UID
          
          const uidQuery = query(
            this.collection,
            where('userId', '==', userId)
          );
          const uidSnapshot = await getDocs(uidQuery);
          
          const uidListings = uidSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as FirebaseListing[];
          
          // Combine and deduplicate listings
          const allListings = [...listings, ...uidListings];
          const uniqueListings = allListings.filter((listing, index, self) => 
            index === self.findIndex(l => l.id === listing.id)
          );
          
          listings = uniqueListings;
        }
      } catch (userError) {
        // Fall back to email-based listings only
      }
      
      // Sort in memory by createdAt descending
      listings.sort((a, b) => {
        const aDate = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const bDate = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return bDate.getTime() - aDate.getTime();
      });
      
      return listings;
    } catch (error) {
      console.error('Error in getUserListings:', error);
      throw error;
    }
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
    try {
      const docRef = await addDoc(this.collection, {
        ...review,
        comment: review.comment || '', // Ensure comment is never undefined
        createdAt: serverTimestamp()
      });

      // Update listing rating
      await this.updateListingRating(review.listingId);

      return docRef.id;
    } catch (error) {
      console.error('Error in createReview:', error);
      throw error;
    }
  }

  async getListingReviews(listingId: string): Promise<FirebaseReview[]> {
    try {
      // Use simple query without orderBy to avoid composite index requirement
      const q = query(
        this.collection,
        where('listingId', '==', listingId)
      );
      const querySnapshot = await getDocs(q);
      const reviews = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirebaseReview[];
      
      // Sort in memory by createdAt descending
      reviews.sort((a, b) => {
        const aDate = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const bDate = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return bDate.getTime() - aDate.getTime();
      });
      
      return reviews;
    } catch (error) {
      console.error('Error in getListingReviews:', error);
      throw error;
    }
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
  async uploadImages(files: File[], _path: string): Promise<string[]> {
    if (!files || files.length === 0) {
      throw new Error('No files provided for upload');
    }

    console.log(`Converting ${files.length} files to base64 (Firebase Storage bypass mode)`);

    try {
      const uploadPromises = files.map(async (file, index) => {
        // Validate file
        if (!file) {
          throw new Error(`File at index ${index} is null or undefined`);
        }

        if (!file.type.startsWith('image/')) {
          throw new Error(`File "${file.name}" is not an image file`);
        }

        console.log(`Converting file: ${file.name}, size: ${file.size} bytes, type: ${file.type}`);

        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = () => {
            const base64String = reader.result as string;
            console.log(`Converted ${file.name} to base64`);
            resolve(base64String);
          };

          reader.onerror = () => {
            reject(new Error(`Failed to convert ${file.name} to base64`));
          };

          reader.readAsDataURL(file);
        });
      });

      console.log('Converting all images to base64...');
      const urls = await Promise.all(uploadPromises);
      console.log('All images converted successfully');
      return urls;

    } catch (error) {
      console.error('Error converting images:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(errorMessage || 'Failed to process images. Please try again.');
    }
  }

  async deleteImage(imageUrl: string): Promise<void> {
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
      console.log('Image deleted successfully:', imageUrl);
    } catch (error) {
      console.error('Error deleting image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to delete image: ${errorMessage}`);
    }
  }
}

// Export service instances
export const listingsService = new ListingsService();
export const rentalRequestsService = new RentalRequestsService();
export const reviewsService = new ReviewsService();
export const imageUploadService = new ImageUploadService();