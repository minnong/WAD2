import { Timestamp } from 'firebase/firestore';

// Condition status for listings
export type ConditionStatus = 'available' | 'faulty' | 'under-repair' | 'disputed';

// Condition report for before/after rental
export interface ConditionReport {
  id: string;
  rentalRequestId: string;
  listingId: string;
  reportType: 'pre-rental' | 'post-rental-renter' | 'post-rental-owner';
  reportedBy: string; // User email
  reportedByName: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  notes: string;
  images: string[]; // Array of image URLs or base64
  createdAt: Timestamp | Date;
  verifiedBy?: string; // For owner verification
  verifiedAt?: Timestamp | Date;
}

// Dispute between renter and owner
export interface Dispute {
  id: string;
  rentalRequestId: string;
  listingId: string;
  listingName: string;
  listingImage: string;
  raisedBy: string; // User email who raised the dispute
  raisedByName: string;
  raisedByRole: 'owner' | 'renter';
  againstUser: string; // Email of the other party
  againstUserName: string;
  type: 'damage' | 'condition-mismatch' | 'missing-items' | 'other';
  description: string;
  evidence: {
    images: string[];
    preRentalReportId?: string;
    postRentalReportId?: string;
  };
  status: 'open' | 'under-review' | 'resolved' | 'closed';
  resolution?: {
    resolvedBy: string; // Admin or system
    resolvedAt: Timestamp | Date;
    outcome: string;
    compensationAmount?: number;
  };
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  messages?: DisputeMessage[];
}

// Messages within a dispute for communication
export interface DisputeMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'owner' | 'renter' | 'admin';
  content: string;
  createdAt: Timestamp | Date;
}

// Extended RentalRequest fields for condition tracking
export interface RentalConditionTracking {
  preRentalReportId?: string;
  postRentalRenterReportId?: string;
  postRentalOwnerReportId?: string;
  hasActiveDispute?: boolean;
  conditionVerified?: boolean;
}
