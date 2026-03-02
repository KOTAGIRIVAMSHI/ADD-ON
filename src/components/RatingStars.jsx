import React, { useState } from 'react';
import '../styles/RatingStars.css';

/**
 * RatingStars Component
 * Interactive star rating selector (1-5 stars)
 * Can be used in review forms or as read-only display
 */

const RatingStars = ({
    rating = 0,
    onRatingChange = null,
    size = 'medium',
    readOnly = false,
    showText = true,
    count = null
}) => {
    const [hoverRating, setHoverRating] = useState(0);

    const handleStarClick = (newRating) => {
        if (!readOnly && onRatingChange) {
            onRatingChange(newRating);
        }
    };

    const handleStarHover = (newRating) => {
        if (!readOnly) {
            setHoverRating(newRating);
        }
    };

    const handleMouseLeave = () => {
        setHoverRating(0);
    };

    const currentRating = hoverRating || rating;
    const displayRating = currentRating.toFixed(1);

    const getSizeClass = () => {
        switch (size) {
            case 'small':
                return 'stars-small';
            case 'large':
                return 'stars-large';
            case 'medium':
            default:
                return 'stars-medium';
        }
    };

    const getRatingText = () => {
        if (rating === 0) return 'No rating';
        if (rating <= 1.5) return 'Poor';
        if (rating <= 2.5) return 'Fair';
        if (rating <= 3.5) return 'Good';
        if (rating <= 4.2) return 'Very Good';
        return 'Excellent';
    };

    return (
        <div
            className={`rating-stars ${getSizeClass()} ${readOnly ? 'read-only' : 'interactive'}`}
            onMouseLeave={handleMouseLeave}
        >
            <div className="stars-container">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        className={`star ${
                            star <= currentRating ? 'filled' : 'empty'
                        } ${!readOnly ? 'clickable' : ''}`}
                        onClick={() => handleStarClick(star)}
                        onMouseEnter={() => handleStarHover(star)}
                        disabled={readOnly}
                        aria-label={`Rate ${star} stars`}
                        title={`Rate ${star} stars`}
                    >
                        ★
                    </button>
                ))}
            </div>

            <div className="rating-info">
                {showText && (
                    <>
                        <span className="rating-value">{displayRating}</span>
                        <span className="rating-text">{getRatingText()}</span>
                        {count !== null && (
                            <span className="rating-count">({count} {count === 1 ? 'review' : 'reviews'})</span>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default RatingStars;
