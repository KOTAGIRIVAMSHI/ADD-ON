import React, { useState } from 'react';
import RatingStars from './RatingStars';
import { reviewHelpers } from '../utils/reviewHelpers';
import '../styles/ReviewCard.css';

/**
 * ReviewCard Component
 * Displays a single review with helpful/unhelpful voting
 */

const ReviewCard = ({
    review,
    listingId,
    currentUserId,
    onDelete = null,
    onApprove = null,
    isAdminView = false
}) => {
    const [isHelpful, setIsHelpful] = useState(false);
    const [isUnhelpful, setIsUnhelpful] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        try {
            const date = timestamp.toDate?.() || new Date(timestamp);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return 'N/A';
        }
    };

    const handleHelpful = async () => {
        if (isHelpful) return;
        setLoading(true);
        setError('');
        try {
            await reviewHelpers.markReviewHelpful(listingId, review.id, currentUserId);
            setIsHelpful(true);
            setSuccessMessage('Thanks for your feedback!');
            setTimeout(() => setSuccessMessage(''), 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUnhelpful = async () => {
        if (isUnhelpful) return;
        setLoading(true);
        setError('');
        try {
            await reviewHelpers.markReviewUnhelpful(listingId, review.id, currentUserId);
            setIsUnhelpful(true);
            setSuccessMessage('Thanks for your feedback!');
            setTimeout(() => setSuccessMessage(''), 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;

        setLoading(true);
        setError('');
        try {
            await reviewHelpers.deleteReview(listingId, review.id, currentUserId);
            if (onDelete) onDelete(review.id);
            setSuccessMessage('Review deleted successfully');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        setLoading(true);
        setError('');
        try {
            await reviewHelpers.approveReview(listingId, review.id);
            if (onApprove) onApprove(review.id);
            setSuccessMessage('Review approved');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const isOwnReview = review.reviewerId === currentUserId;
    const isApproved = review.status === 'APPROVED';
    const isPending = review.status === 'PENDING';

    return (
        <div className={`review-card ${!isApproved && !isAdminView ? 'hidden' : ''}`}>
            {/* Review Header */}
            <div className="review-header">
                <div className="reviewer-info">
                    <h4 className="reviewer-name">{review.reviewerName}</h4>
                    <span className="review-date">{formatDate(review.createdAt)}</span>
                    {review.verified_purchase && (
                        <span className="verified-badge">✓ Verified Purchase</span>
                    )}
                    {isPending && (
                        <span className="pending-badge">Pending Approval</span>
                    )}
                </div>

                <RatingStars
                    rating={review.rating}
                    readOnly={true}
                    showText={true}
                    size="small"
                />
            </div>

            {/* Review Title & Text */}
            <div className="review-content">
                <h3 className="review-title">{review.title}</h3>
                <p className="review-text">{review.text}</p>
            </div>

            {/* Messages */}
            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

            {/* Review Footer - Actions */}
            <div className="review-footer">
                <div className="helpful-section">
                    <span className="helpful-label">Was this helpful?</span>
                    <button
                        className={`helpful-btn ${isHelpful ? 'active' : ''}`}
                        onClick={handleHelpful}
                        disabled={loading || isHelpful}
                        title="Mark as helpful"
                    >
                        👍 ({review.helpful || 0})
                    </button>
                    <button
                        className={`unhelpful-btn ${isUnhelpful ? 'active' : ''}`}
                        onClick={handleUnhelpful}
                        disabled={loading || isUnhelpful}
                        title="Mark as unhelpful"
                    >
                        👎 ({review.unhelpful || 0})
                    </button>
                </div>

                <div className="action-buttons">
                    {isOwnReview && isApproved && (
                        <button
                            className="delete-btn"
                            onClick={handleDelete}
                            disabled={loading}
                            title="Delete this review"
                        >
                            Delete
                        </button>
                    )}

                    {isAdminView && isPending && (
                        <>
                            <button
                                className="approve-btn"
                                onClick={handleApprove}
                                disabled={loading}
                            >
                                Approve
                            </button>
                            <button
                                className="reject-btn"
                                onClick={handleDelete}
                                disabled={loading}
                            >
                                Reject
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewCard;
