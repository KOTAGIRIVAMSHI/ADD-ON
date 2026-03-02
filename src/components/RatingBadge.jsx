import React, { useState, useEffect } from 'react';
import { reviewHelpers } from '../utils/reviewHelpers';
import '../styles/RatingBadge.css';

/**
 * RatingBadge Component
 * Compact rating display for listing cards
 * Can be used with either listingId (fetches stats) or rating/count (pre-calculated stats)
 */

const RatingBadge = ({ listingId = null, rating = null, count = null, size = 'small', clickable = false, onClick = null }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(listingId ? true : false);

    useEffect(() => {
        if (listingId) {
            loadStats();
        } else if (rating !== null && count !== null) {
            setStats({ avgRating: rating, totalReviews: count });
        }
    }, [listingId, rating, count]);

    const loadStats = async () => {
        try {
            const ratingStats = await reviewHelpers.getListingRatingStats(listingId);
            setStats(ratingStats);
        } catch (error) {
            console.error('Error loading rating stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !stats) {
        return (
            <div className={`rating-badge ${size} no-rating`}>
                <span className="no-rating-text">No ratings</span>
            </div>
        );
    }

    const getSizeClass = () => {
        switch (size) {
            case 'large':
                return 'rating-badge-large';
            case 'small':
            default:
                return 'rating-badge-small';
        }
    };

    const getRatingColor = (rating) => {
        if (rating >= 4.5) return 'excellent';
        if (rating >= 3.5) return 'good';
        if (rating >= 2.5) return 'fair';
        return 'poor';
    };

    return (
        <div
            className={`rating-badge ${getSizeClass()} ${getRatingColor(stats.avgRating)} ${
                clickable ? 'clickable' : ''
            }`}
            onClick={clickable ? onClick : null}
            role={clickable ? 'button' : 'status'}
            tabIndex={clickable ? 0 : -1}
        >
            <span className="badge-stars">
                ★ {stats.avgRating.toFixed(1)}
            </span>
            <span className="badge-count">
                ({stats.totalReviews})
            </span>
        </div>
    );
};

export default RatingBadge;
