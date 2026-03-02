import React, { useState } from 'react';
import RatingStars from './RatingStars';
import { reviewHelpers } from '../utils/reviewHelpers';
import '../styles/ReviewForm.css';

/**
 * ReviewForm Component
 * Modal form for submitting a new review
 */

const ReviewForm = ({ listingId, currentUserId, currentUserName, onClose, onSuccess }) => {
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [verifiedPurchase, setVerifiedPurchase] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (rating === 0) {
            setError('Please select a rating');
            return;
        }
        if (title.trim().length < 3) {
            setError('Title must be at least 3 characters');
            return;
        }
        if (text.trim().length < 10) {
            setError('Review must be at least 10 characters');
            return;
        }

        setLoading(true);

        try {
            await reviewHelpers.submitReview(
                listingId,
                currentUserId,
                currentUserName,
                {
                    rating,
                    title: title.trim(),
                    text: text.trim(),
                    verified_purchase: verifiedPurchase
                }
            );

            if (onSuccess) {
                onSuccess();
            }

            // Close form
            if (onClose) {
                onClose();
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="review-form-overlay">
            <div className="review-form-modal">
                {/* Header */}
                <div className="form-header">
                    <h2>Write a Review</h2>
                    <button
                        className="close-btn"
                        onClick={onClose}
                        disabled={loading}
                        title="Close"
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="review-form">
                    {error && <div className="error-message">{error}</div>}

                    {/* Rating */}
                    <div className="form-group">
                        <label className="form-label">Rating *</label>
                        <div className="rating-input">
                            <RatingStars
                                rating={rating}
                                onRatingChange={setRating}
                                size="large"
                                showText={true}
                            />
                        </div>
                    </div>

                    {/* Title */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="title">
                            Title *
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Summarize your experience..."
                            maxLength={100}
                            disabled={loading}
                            className="form-input"
                        />
                        <span className="char-count">
                            {title.length} / 100
                        </span>
                    </div>

                    {/* Review Text */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="text">
                            Your Review *
                        </label>
                        <textarea
                            id="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Tell us about your experience with this item..."
                            rows={5}
                            maxLength={500}
                            disabled={loading}
                            className="form-textarea"
                        />
                        <span className="char-count">
                            {text.length} / 500
                        </span>
                    </div>

                    {/* Verified Purchase */}
                    <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={verifiedPurchase}
                                onChange={(e) => setVerifiedPurchase(e.target.checked)}
                                disabled={loading}
                            />
                            <span>I purchased this item</span>
                        </label>
                    </div>

                    {/* Info Text */}
                    <p className="form-info">
                        Your review will be posted after admin approval. Please follow our community guidelines.
                    </p>

                    {/* Buttons */}
                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="cancel-btn"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="submit-btn"
                        >
                            {loading ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewForm;
