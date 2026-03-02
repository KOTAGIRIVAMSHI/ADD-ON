import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { ArrowLeft, MessageSquare, Heart, Share2, Loader2, X, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dbHelpers } from '../utils/dbHelpers';
import { reviewHelpers } from '../utils/reviewHelpers';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import RatingBadge from '../components/RatingBadge';
import EmptyState from '../components/EmptyState';
import '../styles/ListingDetail.css';

const ListingDetail = () => {
    const { listingId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [ratingStats, setRatingStats] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [sellerRating, setSellerRating] = useState(null);
    const [canReview, setCanReview] = useState(false);

    useEffect(() => {
        loadListing();
    }, [listingId]);

    useEffect(() => {
        if (listing) {
            loadReviews();
            loadSellerRating();
            checkCanReview();
        }
    }, [listing?.id]);

    useEffect(() => {
        if (user && listing) {
            checkIfSaved();
        }
    }, [user?.uid, listing?.id]);

    const loadListing = async () => {
        try {
            setLoading(true);
            const listingData = await dbHelpers.getListing(listingId, user?.uid);
            if (listingData) {
                setListing(listingData);
            } else {
                console.error('Listing not found');
            }
        } catch (err) {
            console.error('Error loading listing:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadReviews = async () => {
        try {
            setReviewsLoading(true);
            
            // Get reviews
            const listingReviews = await reviewHelpers.getListingReviews(listing.id, 'APPROVED');
            setReviews(listingReviews || []);

            // Get rating stats
            const stats = await reviewHelpers.getListingRatingStats(listing.id);
            setRatingStats(stats);
        } catch (err) {
            console.error('Error loading reviews:', err);
        } finally {
            setReviewsLoading(false);
        }
    };

    const loadSellerRating = async () => {
        try {
            const rating = await reviewHelpers.getUserAverageRating(listing.sellerId);
            setSellerRating(rating);
        } catch (err) {
            console.error('Error loading seller rating:', err);
        }
    };

    const checkCanReview = async () => {
        if (!user) {
            setCanReview(false);
            return;
        }

        try {
            const userCanReview = await reviewHelpers.canUserReview(listing.id, user.uid);
            setCanReview(userCanReview && user.uid !== listing.sellerId);
        } catch (err) {
            console.error('Error checking review eligibility:', err);
            setCanReview(false);
        }
    };

    const checkIfSaved = async () => {
        try {
            const wishlist = await dbHelpers.getUserWishlist(user.uid);
            setIsSaved(wishlist.some(w => w.listingId === listing.id));
        } catch (err) {
            console.error('Error checking saved status:', err);
        }
    };

    const handleToggleSave = async () => {
        if (!user) {
            alert('Please sign in to save items!');
            return;
        }

        try {
            if (isSaved) {
                await dbHelpers.removeFromWishlist(user.uid, listing.id);
            } else {
                await dbHelpers.addToWishlist(user.uid, {
                    id: listing.id,
                    title: listing.title,
                    price: listing.price,
                    sellerName: listing.sellerName,
                    image: listing.image,
                    category: listing.category
                });
            }
            setIsSaved(!isSaved);
        } catch (err) {
            console.error('Error toggling save:', err);
        }
    };

    const handleContactSeller = async () => {
        if (!user) {
            alert('Please sign in to message the seller!');
            return;
        }

        if (listing.sellerId === user.uid) {
            alert('This is your own listing!');
            return;
        }

        try {
            const chatId = await dbHelpers.getOrCreateChat(
                user.uid,
                listing.sellerId,
                listing.id,
                listing.title
            );
            navigate('/messages', { state: { selectedChatId: chatId } });
        } catch (err) {
            console.error('Error starting chat:', err);
            alert('Failed to start chat. Try again.');
        }
    };

    const handleReviewSubmit = async (reviewData) => {
        try {
            const result = await reviewHelpers.submitReview(
                listing.id,
                user.uid,
                user.name,
                reviewData
            );

            if (result.success) {
                alert('Review submitted successfully! Awaiting admin approval.');
                setShowReviewForm(false);
                // Reload reviews to show pending status
                await loadReviews();
            }
        } catch (err) {
            console.error('Error submitting review:', err);
            alert(`Failed to submit review: ${err.message}`);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 size={48} className="text-primary animate-spin" />
            </div>
        );
    }

    if (!listing) {
        return (
            <EmptyState
                icon={AlertCircle}
                title="Listing not found"
                description="The listing you're looking for doesn't exist or has been removed."
                actionLabel="Back to Marketplace"
                onAction={() => navigate('/marketplace')}
            />
        );
    }

    return (
        <div className="w-full flex-grow flex flex-col py-12 px-6 fade-in container mx-auto max-w-6xl">
            {/* Header */}
            <div className="mb-8 flex items-center gap-4">
                <button
                    onClick={() => navigate('/marketplace')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back
                </button>
                <h1 className="text-3xl md:text-4xl font-bold text-white flex-1">{listing.title}</h1>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left: Image & Details */}
                <div className="md:col-span-2 space-y-6">
                    {/* Image */}
                    <div className="relative w-full h-96 rounded-xl overflow-hidden card-glass">
                        <img
                            src={listing.image}
                            alt={listing.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4 flex gap-2">
                            <span className="bg-black/70 backdrop-blur-md text-white text-sm font-semibold px-4 py-2 rounded-full border border-white/10">
                                {listing.condition}
                            </span>
                            <span className="bg-primary/90 text-black text-sm font-bold px-4 py-2 rounded-full">
                                {listing.category}
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="card-glass p-6">
                        <h2 className="text-xl font-bold text-white mb-3">Description</h2>
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {listing.description || 'No description provided.'}
                        </p>
                    </div>

                    {/* Reviews Section */}
                    <div className="card-glass p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Reviews & Ratings</h2>
                            {canReview && !showReviewForm && (
                                <button
                                    onClick={() => setShowReviewForm(true)}
                                    className="btn-primary text-sm px-4 py-2"
                                >
                                    Write a Review
                                </button>
                            )}
                        </div>

                        {reviewsLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 size={32} className="text-primary animate-spin" />
                            </div>
                        ) : (
                            <>
                                {ratingStats && (
                                    <div className="mb-6 p-4 bg-black/30 rounded-xl border border-white/10">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <div className="text-4xl font-bold text-primary">
                                                    {ratingStats.avgRating}
                                                </div>
                                                <p className="text-gray-400 text-sm">
                                                    Based on {ratingStats.totalReviews} reviews
                                                </p>
                                            </div>
                                            <div className="flex-1">
                                                {[5, 4, 3, 2, 1].map(star => (
                                                    <div key={star} className="flex items-center gap-2 text-sm mb-1">
                                                        <span className="text-gray-500 w-3">{star}★</span>
                                                        <div className="flex-1 h-2 bg-black/50 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-primary"
                                                                style={{
                                                                    width: `${((ratingStats.distribution[star] || 0) / ratingStats.totalReviews) * 100}%`
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="text-gray-500 text-xs w-6 text-right">
                                                            {ratingStats.distribution[star] || 0}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {showReviewForm && (
                                    <div className="mb-6 p-4 bg-black/30 rounded-xl border border-primary/20">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-semibold text-white">Share your experience</h3>
                                            <button
                                                onClick={() => setShowReviewForm(false)}
                                                className="text-gray-400 hover:text-white"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                        <ReviewForm
                                            onSubmit={handleReviewSubmit}
                                            onCancel={() => setShowReviewForm(false)}
                                        />
                                    </div>
                                )}

                                {reviews.length > 0 ? (
                                    <ReviewList reviews={reviews} />
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-gray-400">No reviews yet. Be the first to review!</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Right: Sidebar */}
                <div className="space-y-6">
                    {/* Price & Actions */}
                    <div className="card-glass p-6 sticky top-24">
                        <div className="mb-6">
                            <p className="text-gray-400 text-sm mb-1">Price</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-primary">₹{listing.price}</span>
                                {listing.negotiable && (
                                    <span className="text-sm text-gray-500">(Negotiable)</span>
                                )}
                            </div>
                        </div>

                        {/* Rating Badge */}
                        {ratingStats && (
                            <div className="mb-6 p-4 bg-black/30 rounded-xl border border-white/10 text-center">
                                <p className="text-gray-400 text-sm mb-2">Listing Rating</p>
                                <RatingBadge rating={ratingStats.avgRating} count={ratingStats.totalReviews} />
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 mb-6">
                            <button
                                onClick={handleContactSeller}
                                className="flex-1 btn-primary flex items-center justify-center gap-2 py-3"
                            >
                                <MessageSquare size={18} />
                                Contact Seller
                            </button>
                            <button
                                onClick={handleToggleSave}
                                className={`w-12 h-12 rounded-lg border flex items-center justify-center transition-all ${
                                    isSaved
                                        ? 'bg-rose-500/20 border-rose-500/30 text-rose-400'
                                        : 'border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                                }`}
                            >
                                <Heart size={20} className={isSaved ? 'fill-current' : ''} />
                            </button>
                        </div>

                        {/* Seller Info */}
                        <div className="p-4 bg-black/30 rounded-xl border border-white/10 space-y-3">
                            <h3 className="font-semibold text-white text-sm">Seller Information</h3>
                            <div className="flex items-center gap-3">
                                <img
                                    src={listing.sellerAvatar || `https://i.pravatar.cc/150?u=${listing.sellerId}`}
                                    alt={listing.sellerName}
                                    className="w-12 h-12 rounded-full"
                                />
                                <div className="flex-1">
                                    <p className="font-medium text-white text-sm">{listing.sellerName}</p>
                                    {sellerRating && (
                                        <p className="text-xs text-gray-500">
                                            ★ {sellerRating.avgRating} ({sellerRating.totalReviews} reviews)
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="mt-6 space-y-3 text-sm">
                            {listing.location && (
                                <div className="flex items-start gap-3">
                                    <span className="text-gray-500">📍</span>
                                    <div>
                                        <p className="text-gray-400">Location</p>
                                        <p className="text-white font-medium">{listing.location}</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-start gap-3">
                                <span className="text-gray-500">📅</span>
                                <div>
                                    <p className="text-gray-400">Posted</p>
                                    <p className="text-white font-medium">
                                        {listing.createdAt?.toDate?.()?.toLocaleDateString?.() || 'Recently'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingDetail;
