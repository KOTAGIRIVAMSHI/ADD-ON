import React, { useState, useEffect } from 'react';
import ReviewCard from './ReviewCard';
import { reviewHelpers } from '../utils/reviewHelpers';
import '../styles/ReviewList.css';

/**
 * ReviewList Component
 * Displays all approved reviews for a listing with sorting options
 */

const ReviewList = ({ listingId, currentUserId, onReviewDeleted = null }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [ratingStats, setRatingStats] = useState(null);

    useEffect(() => {
        loadReviews();
    }, [listingId]);

    const loadReviews = async () => {
        try {
            setLoading(true);
            setError('');

            // Load approved reviews
            const reviewsData = await reviewHelpers.getListingReviews(listingId, 'APPROVED');
            setReviews(reviewsData);

            // Load rating stats
            const stats = await reviewHelpers.getListingRatingStats(listingId);
            setRatingStats(stats);
        } catch (err) {
            setError('Failed to load reviews');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleReviewDeleted = (reviewId) => {
        setReviews(reviews.filter(r => r.id !== reviewId));
        loadReviews(); // Reload to update stats
        if (onReviewDeleted) onReviewDeleted(reviewId);
    };

    const getSortedReviews = () => {
        const sorted = [...reviews];

        switch (sortBy) {
            case 'newest':
                sorted.sort((a, b) => {
                    const aTime = a.createdAt?.toDate?.()?.getTime?.() || 0;
                    const bTime = b.createdAt?.toDate?.()?.getTime?.() || 0;
                    return bTime - aTime;
                });
                break;
            case 'oldest':
                sorted.sort((a, b) => {
                    const aTime = a.createdAt?.toDate?.()?.getTime?.() || 0;
                    const bTime = b.createdAt?.toDate?.()?.getTime?.() || 0;
                    return aTime - bTime;
                });
                break;
            case 'highest':
                sorted.sort((a, b) => b.rating - a.rating);
                break;
            case 'lowest':
                sorted.sort((a, b) => a.rating - b.rating);
                break;
            case 'helpful':
                sorted.sort((a, b) => (b.helpful || 0) - (a.helpful || 0));
                break;
            default:
                break;
        }

        return sorted;
    };

    const getRatingDistribution = () => {
        if (!ratingStats) return null;

        return [
            { stars: 5, count: ratingStats.distribution?.[5] || 0 },
            { stars: 4, count: ratingStats.distribution?.[4] || 0 },
            { stars: 3, count: ratingStats.distribution?.[3] || 0 },
            { stars: 2, count: ratingStats.distribution?.[2] || 0 },
            { stars: 1, count: ratingStats.distribution?.[1] || 0 }
        ];
    };

    const sortedReviews = getSortedReviews();
    const distribution = getRatingDistribution();

    return (
        <div className="review-list-container">
            <h2 className="reviews-title">Customer Reviews</h2>

            {error && <div className="error-message">{error}</div>}

            {/* Rating Summary */}
            {ratingStats && (
                <div className="rating-summary">
                    <div className="rating-overview">
                        <div className="avg-rating">
                            <span className="avg-value">{ratingStats.avgRating}</span>
                            <span className="avg-label">out of 5</span>
                        </div>
                        <span className="total-reviews">
                            Based on {ratingStats.totalReviews} {ratingStats.totalReviews === 1 ? 'review' : 'reviews'}
                        </span>
                    </div>

                    {/* Rating Distribution */}
                    <div className="rating-distribution">
                        {distribution?.map(({ stars, count }) => (
                            <div key={stars} className="distribution-bar">
                                <span className="stars-label">{stars} ★</span>
                                <div className="bar-container">
                                    <div
                                        className="bar-fill"
                                        style={{
                                            width: `${ratingStats.totalReviews > 0
                                                ? (count / ratingStats.totalReviews) * 100
                                                : 0
                                                }%`
                                        }}
                                    ></div>
                                </div>
                                <span className="bar-count">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Reviews Section */}
            <div className="reviews-section">
                {/* Sort Control */}
                {reviews.length > 0 && (
                    <div className="sort-controls">
                        <label htmlFor="sort-select">Sort by:</label>
                        <select
                            id="sort-select"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="sort-select"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="highest">Highest Rating</option>
                            <option value="lowest">Lowest Rating</option>
                            <option value="helpful">Most Helpful</option>
                        </select>
                    </div>
                )}

                {/* Reviews List */}
                {loading ? (
                    <div className="loading-state">Loading reviews...</div>
                ) : reviews.length === 0 ? (
                    <div className="empty-state">
                        <p>No reviews yet. Be the first to review this item!</p>
                    </div>
                ) : (
                    <div className="reviews-list">
                        {sortedReviews.map((review) => (
                            <ReviewCard
                                key={review.id}
                                review={review}
                                listingId={listingId}
                                currentUserId={currentUserId}
                                onDelete={handleReviewDeleted}
                                isAdminView={false}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewList;
