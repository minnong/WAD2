import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Clock, CheckCircle, XCircle, MessageSquare, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { disputesService } from '../services/conditionTracking';
import type { Dispute } from '../types/conditionTracking';
import LiquidGlassNav from './LiquidGlassNav';

export default function DisputesPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');

  useEffect(() => {
    if (!currentUser?.email) {
      navigate('/auth');
      return;
    }

    loadDisputes();
  }, [currentUser, navigate]);

  const loadDisputes = async () => {
    if (!currentUser?.email) return;

    try {
      setLoading(true);
      const userDisputes = await disputesService.getDisputesByUser(currentUser.email);
      setDisputes(userDisputes);
    } catch (error) {
      console.error('Error loading disputes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDisputes = disputes.filter(dispute => {
    if (filter === 'all') return true;
    if (filter === 'open') return dispute.status === 'open' || dispute.status === 'under-review';
    if (filter === 'resolved') return dispute.status === 'resolved' || dispute.status === 'closed';
    return true;
  });

  const getStatusIcon = (status: Dispute['status']) => {
    switch (status) {
      case 'open':
        return <AlertTriangle className="text-red-500" size={20} />;
      case 'under-review':
        return <Clock className="text-yellow-500" size={20} />;
      case 'resolved':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'closed':
        return <XCircle className="text-gray-500" size={20} />;
    }
  };

  const getStatusBadgeColor = (status: Dispute['status']) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'under-review':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'resolved':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'closed':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getDisputeTypeLabel = (type: Dispute['type']) => {
    const labels: Record<Dispute['type'], string> = {
      'damage': 'Damage',
      'condition-mismatch': 'Condition Mismatch',
      'missing-items': 'Missing Items',
      'other': 'Other'
    };
    return labels[type];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <LiquidGlassNav />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              My Disputes
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              View and manage your rental disputes
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {[
              { key: 'all' as const, label: 'All Disputes' },
              { key: 'open' as const, label: 'Active' },
              { key: 'resolved' as const, label: 'Resolved' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-6 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  filter === tab.key
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredDisputes.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
              <AlertTriangle className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No disputes found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filter === 'all'
                  ? "You don't have any disputes yet."
                  : `You don't have any ${filter} disputes.`}
              </p>
            </div>
          )}

          {/* Disputes List */}
          {!loading && filteredDisputes.length > 0 && (
            <div className="space-y-4">
              {filteredDisputes.map(dispute => (
                <div
                  key={dispute.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Item Image */}
                      <img
                        src={dispute.listingImage}
                        alt={dispute.listingName}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />

                      {/* Dispute Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                              {dispute.listingName}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                                {getDisputeTypeLabel(dispute.type)}
                              </span>
                              <span>•</span>
                              <span>
                                {dispute.raisedBy === currentUser?.email
                                  ? `Against ${dispute.againstUserName}`
                                  : `Raised by ${dispute.raisedByName}`}
                              </span>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="flex items-center gap-2">
                            {getStatusIcon(dispute.status)}
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(dispute.status)}`}>
                              {dispute.status.replace('-', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                            </span>
                          </div>
                        </div>

                        {/* Description Preview */}
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                          {dispute.description}
                        </p>

                        {/* Evidence Count */}
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>{dispute.evidence.images.length} evidence photos</span>
                          {dispute.messages && dispute.messages.length > 0 && (
                            <>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <MessageSquare size={14} />
                                <span>{dispute.messages.length} messages</span>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Resolution (if resolved) */}
                        {dispute.resolution && (
                          <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <p className="text-sm text-green-800 dark:text-green-300 font-medium">
                              Resolution: {dispute.resolution.outcome}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* View Details Button */}
                      <button className="text-blue-500 hover:text-blue-600 flex-shrink-0">
                        <ChevronRight size={24} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
