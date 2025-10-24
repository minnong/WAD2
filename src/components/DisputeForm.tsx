import { useState } from 'react';
import { X, AlertTriangle, Upload } from 'lucide-react';
import { disputesService } from '../services/conditionTracking';
import { imageUploadService } from '../services/firebase';
import type { Dispute } from '../types/conditionTracking';

interface DisputeFormProps {
  rentalRequestId: string;
  listingId: string;
  listingName: string;
  listingImage: string;
  raisedBy: string;
  raisedByName: string;
  raisedByRole: 'owner' | 'renter';
  againstUser: string;
  againstUserName: string;
  preRentalReportId?: string;
  postRentalReportId?: string;
  onSuccess: (disputeId: string) => void;
  onCancel: () => void;
}

export default function DisputeForm({
  rentalRequestId,
  listingId,
  listingName,
  listingImage,
  raisedBy,
  raisedByName,
  raisedByRole,
  againstUser,
  againstUserName,
  preRentalReportId,
  postRentalReportId,
  onSuccess,
  onCancel
}: DisputeFormProps) {
  const [type, setType] = useState<Dispute['type']>('damage');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const disputeTypes: Array<{ value: Dispute['type']; label: string; description: string }> = [
    { value: 'damage', label: 'Damage', description: 'Item was damaged during rental' },
    { value: 'condition-mismatch', label: 'Condition Mismatch', description: 'Item condition does not match description' },
    { value: 'missing-items', label: 'Missing Items', description: 'Item or parts are missing' },
    { value: 'other', label: 'Other', description: 'Other dispute reason' }
  ];

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate file types
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    if (validFiles.length !== files.length) {
      setError('Some files were not images and have been excluded.');
    }

    // Limit to 10 images total
    const remainingSlots = 10 - images.length;
    const filesToAdd = validFiles.slice(0, remainingSlots);

    if (filesToAdd.length < validFiles.length) {
      setError(`Maximum 10 images allowed. Only ${filesToAdd.length} images will be added.`);
    }

    // Create previews
    const newPreviews: string[] = [];
    filesToAdd.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === filesToAdd.length) {
          setImagePreviews(prev => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setImages(prev => [...prev, ...filesToAdd]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate
      if (description.trim().length < 20) {
        throw new Error('Please provide a detailed description (at least 20 characters).');
      }

      if (images.length === 0) {
        throw new Error('Please upload at least one photo as evidence.');
      }

      // Upload images
      const imageUrls = await imageUploadService.uploadImages(
        images,
        `disputes/${rentalRequestId}`
      );

      // Create dispute
      const disputeData: Omit<Dispute, 'id' | 'createdAt' | 'updatedAt'> = {
        rentalRequestId,
        listingId,
        listingName,
        listingImage,
        raisedBy,
        raisedByName,
        raisedByRole,
        againstUser,
        againstUserName,
        type,
        description: description.trim(),
        evidence: {
          images: imageUrls,
          preRentalReportId,
          postRentalReportId
        },
        status: 'open'
      };

      const disputeId = await disputesService.createDispute(disputeData);
      onSuccess(disputeId);
    } catch (err) {
      console.error('Error submitting dispute:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit dispute. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <AlertTriangle className="text-red-600 dark:text-red-400" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Raise a Dispute
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Item Info */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dispute Details
            </h3>
            <div className="flex items-start gap-3">
              <img
                src={listingImage}
                alt={listingName}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{listingName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Against: {againstUserName}
                </p>
              </div>
            </div>
          </div>

          {/* Dispute Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Dispute Type *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {disputeTypes.map((disputeType) => (
                <button
                  key={disputeType.value}
                  type="button"
                  onClick={() => setType(disputeType.value)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    type === disputeType.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="font-medium text-gray-900 dark:text-white">
                    {disputeType.label}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {disputeType.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Detailed Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide a detailed description of the issue, including what happened, when it occurred, and any relevant details..."
              rows={6}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {description.length} / 20 characters minimum
            </p>
          </div>

          {/* Evidence Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Evidence Photos * (Maximum 10)
            </label>

            {/* Upload Button */}
            <label className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer transition-all">
              <Upload size={20} />
              <span>Upload Evidence Photos</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="hidden"
                disabled={images.length >= 10}
              />
            </label>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Evidence ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {images.length} / 10 photos uploaded
            </p>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              <strong>Note:</strong> Raising a dispute will make this item unavailable for rent until the dispute is resolved.
              Please ensure you have provided accurate information and evidence.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || images.length === 0 || description.trim().length < 20}
              className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <AlertTriangle size={20} />
                  <span>Submit Dispute</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
