import React, { useState, useEffect } from 'react';
import { Check, X, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { reviewHelpers } from '../utils/reviewHelpers';
import { activityLogger, ACTIVITY_TYPES } from '../utils/activityLogger';
import '../styles/AdminReviewModeration.css';

const AdminReviewModeration = () => {
    const [pendingReviews, setPendingReviews] = useState([]);
    const [approvedReviews, setApprovedReviews] = useState([]);
    const [rejectedReviews, setRejectedReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pending');
    const [actioningReview, setActioningReview] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showReasonInput, setShowReasonInput] = useState(null);
    const [stats, setStats] = useState({
        pending: 0,
        approved: 0,
        rejected: 0,
        avgRating: 0
    });

    useEffect(() => {
        loadReviews();
    }, []);

    const loadReviews = async () => {
        try {
            setLoading(true);
            
            // Get all pending reviews
            const pending = await reviewHelpers.getPendingReviews();
            
            // Get approved and rejected reviews (limit to recent 50 each)
            const approved = await reviewHelpers.getApprovedReviews(50);
            const rejected = await reviewHelpers.getRejectedReviews(50);
            
            setPendingReviews(pending || []);
            setApprovedReviews(approved || []);
            setRejectedReviews(rejected || []);
            
            // Update stats
            setStats({
                pending: pending?.length || 0,
                approved: approved?.length || 0,
                rejected: rejected?.length || 0,
                avgRating: approved?.length > 0 
                    ? (approved.reduce((sum, r) => sum + r.rating, 0) / approved.length).toFixed(1)
                    : 0
            });
        } catch (err) {
            console.error('Error loading reviews:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveReview = async (review) => {
        try {
            setActioningReview(review.id);
            await reviewHelpers.approveReview(review.listingId, review.id);
            
            // Log the action
            await activityLogger.logActivity(ACTIVITY_TYPES.REVIEW_APPROVED, {
                reviewId: review.id,
                listingId: review.listingId,
                reviewerId: review.reviewerId,
                rating: review.rating
            });

            // Refresh list
            await loadReviews();
        } catch (err) {
            console.error('Error approving review:', err);
            alert(`Failed to approve review: ${err.message}`);
        } finally {
            setActioningReview(null);
        }
    };

    const handleRejectReview = async (review) => {
        try {
            setActioningReview(review.id);
            const reason = rejectionReason.trim() || 'Violates community guidelines';
            
            await reviewHelpers.rejectReview(review.listingId, review.id, reason);
            
            // Log the action
            await activityLogger.logActivity(ACTIVITY_TYPES.REVIEW_REJECTED, {
                reviewId: review.id,
                listingId: review.listingId,
                reviewerId: review.reviewerId,
                reason
            });

            setRejectionReason('');
            setShowReasonInput(null);
            await loadReviews();
        } catch (err) {
            console.error('Error rejecting review:', err);
            alert(`Failed to reject review: ${err.message}`);
        } finally {
            setActioningReview(null);
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        try {
            const date = timestamp.toDate?.() || new Date(timestamp);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'N/A';
        }
    };

    const getRatingColor = (rating) => {
        if (rating >= 4.5) return '#10b981';
        if (rating >= 3.5) return '#3b82f6';
        if (rating >= 2.5) return '#f59e0b';
        return '#ef4444';
    };

    const ReviewItem = ({ review, showActions = false, status = 'pending' }) => (
        <div className="review-item card-glass p-4 mb-3 border-l-4" style={{ borderLeftColor: getRatingColor(review.rating) }}>
            <div className="flex items-start justify-between mb-3">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <img
                            src={`https://i.pravatar.cc/150?u=${review.reviewerId}`}
                            alt={review.reviewerName}
                            className="w-8 h-8 rounded-full"
                        />
                        <div>
                            <p className="font-semibold text-white text-sm">{review.reviewerName}</p>
                            <p className="text-gray-500 text-xs">{review.listingTitle}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <span
                                    key={i}
                                    style={{ color: i < review.rating ? getRatingColor(review.rating) : '#6b7280' }}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <span className="text-xs text-gray-400 font-medium">
                            {review.rating.toFixed(1)} - {formatDate(review.createdAt)}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {review.verified_purchase && (
                        <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/30">
                            Verified Purchase
                        </span>
                    )}
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                        'bg-red-500/20 text-red-400'
                    }`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                </div>
            </div>

            <div className="mb-3">
                {review.title && (
                    <h4 className="font-semibold text-white text-sm mb-1">{review.title}</h4>
                )}
                <p className="text-gray-300 text-sm leading-relaxed">{review.text}</p>
            </div>

            {review.rejectionReason && status === 'rejected' && (
                <div className="mb-3 p-2 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-400">
                    <span className="font-semibold">Rejection Reason: </span>
                    {review.rejectionReason}
                </div>
            )}

            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                <span className="bg-white/5 px-2 py-1 rounded">
                    👍 {review.helpful || 0} helpful
                </span>
                <span className="bg-white/5 px-2 py-1 rounded">
                    👎 {review.unhelpful || 0} unhelpful
                </span>
            </div>

            {showActions && status === 'pending' && (
                <div className="space-y-2">
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleApproveReview(review)}
                            disabled={actioningReview === review.id}
                            className="flex-1 btn-primary text-xs py-2 flex items-center justify-center gap-1 disabled:opacity-50"
                        >
                            {actioningReview === review.id ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    Approving...
                                </>
                            ) : (
                                <>
                                    <Check size={14} />
                                    Approve
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => setShowReasonInput(showReasonInput === review.id ? null : review.id)}
                            className="flex-1 btn-secondary text-xs py-2 flex items-center justify-center gap-1"
                        >
                            {showReasonInput === review.id ? (
                                <>
                                    <EyeOff size={14} />
                                    Hide
                                </>
                            ) : (
                                <>
                                    <X size={14} />
                                    Reject
                                </>
                            )}
                        </button>
                    </div>
                    
                    {showReasonInput === review.id && (
                        <div className="space-y-2 p-2 bg-black/30 rounded border border-white/10">
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Optional: Enter reason for rejection (e.g., Inappropriate language, Spam, etc.)"
                                className="w-full bg-black/50 border border-white/10 text-white text-xs rounded py-2 px-3 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none"
                                rows={2}
                            />
                            <button
                                onClick={() => handleRejectReview(review)}
                                disabled={actioningReview === review.id}
                                className="w-full btn-secondary text-xs py-2 flex items-center justify-center gap-1 disabled:opacity-50"
                            >
                                {actioningReview === review.id ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin" />
                                        Rejecting...
                                    </>
                                ) : (
                                    <>
                                        <X size={14} />
                                        Confirm Rejection
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 size={48} className="text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="admin-review-moderation space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="card-glass p-4 border-t-2 border-yellow-500">
                    <p className="text-gray-400 text-xs font-semibold uppercase mb-1">Pending</p>
                    <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
                </div>
                <div className="card-glass p-4 border-t-2 border-emerald-500">
                    <p className="text-gray-400 text-xs font-semibold uppercase mb-1">Approved</p>
                    <p className="text-2xl font-bold text-emerald-400">{stats.approved}</p>
                </div>
                <div className="card-glass p-4 border-t-2 border-red-500">
                    <p className="text-gray-400 text-xs font-semibold uppercase mb-1">Rejected</p>
                    <p className="text-2xl font-bold text-red-400">{stats.rejected}</p>
                </div>
                <div className="card-glass p-4 border-t-2 border-primary">
                    <p className="text-gray-400 text-xs font-semibold uppercase mb-1">Avg Rating</p>
                    <p className="text-2xl font-bold text-primary">{stats.avgRating}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-white/10">
                {['pending', 'approved', 'rejected'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
                            activeTab === tab
                                ? 'text-primary border-primary'
                                : 'text-gray-400 border-transparent hover:text-white'
                        }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        {tab === 'pending' && stats.pending > 0 && (
                            <span className="ml-2 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                                {stats.pending}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="space-y-2">
                {activeTab === 'pending' && (
                    <>
                        {pendingReviews.length === 0 ? (
                            <div className="text-center py-12">
                                <AlertCircle size={48} className="mx-auto text-gray-500 mb-4" />
                                <p className="text-gray-400 font-medium">No pending reviews</p>
                                <p className="text-gray-500 text-sm">All reviews have been moderated!</p>
                            </div>
                        ) : (
                            pendingReviews.map(review => (
                                <ReviewItem
                                    key={review.id}
                                    review={review}
                                    showActions={true}
                                    status="pending"
                                />
                            ))
                        )}
                    </>
                )}

                {activeTab === 'approved' && (
                    <>
                        {approvedReviews.length === 0 ? (
                            <div className="text-center py-12">
                                <AlertCircle size={48} className="mx-auto text-gray-500 mb-4" />
                                <p className="text-gray-400 font-medium">No approved reviews yet</p>
                            </div>
                        ) : (
                            approvedReviews.map(review => (
                                <ReviewItem
                                    key={review.id}
                                    review={review}
                                    showActions={false}
                                    status="approved"
                                />
                            ))
                        )}
                    </>
                )}

                {activeTab === 'rejected' && (
                    <>
                        {rejectedReviews.length === 0 ? (
                            <div className="text-center py-12">
                                <AlertCircle size={48} className="mx-auto text-gray-500 mb-4" />
                                <p className="text-gray-400 font-medium">No rejected reviews</p>
                            </div>
                        ) : (
                            rejectedReviews.map(review => (
                                <ReviewItem
                                    key={review.id}
                                    review={review}
                                    showActions={false}
                                    status="rejected"
                                />
                            ))
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminReviewModeration;
