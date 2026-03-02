import { db } from '../firebase';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    writeBatch
} from 'firebase/firestore';
import { logActivity, ACTIVITY_TYPES, ACTIVITY_SEVERITY } from './activityLogger';

/**
 * Review Management Helpers
 * Handles all review and rating operations
 */

export const reviewHelpers = {
    /**
     * Submit a new review for a listing
     */
    async submitReview(listingId, reviewerId, reviewerName, reviewData) {
        try {
            // Create review document
            const reviewRef = await addDoc(
                collection(db, 'listings', listingId, 'reviews'),
                {
                    reviewerId,
                    reviewerName,
                    rating: reviewData.rating,
                    title: reviewData.title,
                    text: reviewData.text,
                    helpful: 0,
                    unhelpful: 0,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    status: 'PENDING', // Admin approval
                    verified_purchase: reviewData.verified_purchase || false
                }
            );

            // Also store in user's reviews for quick access
            await addDoc(
                collection(db, 'users', reviewerId, 'reviews'),
                {
                    listingId,
                    reviewId: reviewRef.id,
                    rating: reviewData.rating,
                    title: reviewData.title,
                    text: reviewData.text,
                    createdAt: serverTimestamp(),
                    status: 'PENDING'
                }
            );

            // Update or create listing rating stats
            await this.updateListingRatingStats(listingId);

            // Log activity
            await logActivity(
                reviewerId,
                ACTIVITY_TYPES.USER_REPORT, // Reusing for review for now
                {
                    listingId,
                    rating: reviewData.rating,
                    reviewType: 'REVIEW_POSTED'
                },
                ACTIVITY_SEVERITY.INFO
            );

            return {
                success: true,
                reviewId: reviewRef.id,
                message: 'Review submitted successfully. Awaiting admin approval.'
            };
        } catch (error) {
            console.error('Error submitting review:', error);
            throw new Error(`Failed to submit review: ${error.message}`);
        }
    },

    /**
     * Get all reviews for a listing
     */
    async getListingReviews(listingId, filterStatus = 'APPROVED') {
        try {
            let q;
            if (filterStatus) {
                q = query(
                    collection(db, 'listings', listingId, 'reviews'),
                    where('status', '==', filterStatus),
                    orderBy('createdAt', 'desc')
                );
            } else {
                q = query(
                    collection(db, 'listings', listingId, 'reviews'),
                    orderBy('createdAt', 'desc')
                );
            }

            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error fetching reviews:', error);
            return [];
        }
    },

    /**
     * Get reviews for a specific user (all their reviews)
     */
    async getUserReviews(userId) {
        try {
            const q = query(
                collection(db, 'users', userId, 'reviews'),
                orderBy('createdAt', 'desc')
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error fetching user reviews:', error);
            return [];
        }
    },

    /**
     * Get listing rating statistics
     */
    async getListingRatingStats(listingId) {
        try {
            const statsDoc = await getDoc(doc(db, 'listings', listingId, 'stats', 'ratings'));
            if (statsDoc.exists()) {
                return statsDoc.data();
            }
            return null;
        } catch (error) {
            console.error('Error fetching rating stats:', error);
            return null;
        }
    },

    /**
     * Update listing rating statistics (called after review submission/approval)
     */
    async updateListingRatingStats(listingId) {
        try {
            const reviews = await this.getListingReviews(listingId, 'APPROVED');

            if (reviews.length === 0) {
                return;
            }

            // Calculate statistics
            const ratings = reviews.map(r => r.rating);
            const avgRating = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
            const distribution = {
                1: ratings.filter(r => r === 1).length,
                2: ratings.filter(r => r === 2).length,
                3: ratings.filter(r => r === 3).length,
                4: ratings.filter(r => r === 4).length,
                5: ratings.filter(r => r === 5).length
            };

            // Update stats document
            const statsRef = doc(db, 'listings', listingId, 'stats', 'ratings');
            await updateDoc(statsRef, {
                listingId,
                avgRating: parseFloat(avgRating),
                totalReviews: reviews.length,
                distribution,
                updatedAt: serverTimestamp()
            }).catch(async (error) => {
                // If document doesn't exist, create it
                if (error.code === 'not-found') {
                    await addDoc(collection(db, 'listings', listingId, 'stats'), {
                        ratings: {
                            listingId,
                            avgRating: parseFloat(avgRating),
                            totalReviews: reviews.length,
                            distribution,
                            createdAt: serverTimestamp(),
                            updatedAt: serverTimestamp()
                        }
                    });
                }
            });

            return { avgRating, totalReviews: reviews.length, distribution };
        } catch (error) {
            console.error('Error updating rating stats:', error);
            throw error;
        }
    },

    /**
     * Mark review as helpful
     */
    async markReviewHelpful(listingId, reviewId, userId) {
        try {
            const reviewRef = doc(db, 'listings', listingId, 'reviews', reviewId);
            const reviewDoc = await getDoc(reviewRef);

            if (!reviewDoc.exists()) {
                throw new Error('Review not found');
            }

            const review = reviewDoc.data();
            // Prevent duplicate helpful votes (basic check)
            if (!review.helpfulVoters) {
                review.helpfulVoters = [];
            }

            if (review.helpfulVoters.includes(userId)) {
                throw new Error('You already voted on this review');
            }

            await updateDoc(reviewRef, {
                helpful: (review.helpful || 0) + 1,
                helpfulVoters: [...(review.helpfulVoters || []), userId]
            });

            return { success: true };
        } catch (error) {
            console.error('Error marking review helpful:', error);
            throw error;
        }
    },

    /**
     * Mark review as unhelpful
     */
    async markReviewUnhelpful(listingId, reviewId, userId) {
        try {
            const reviewRef = doc(db, 'listings', listingId, 'reviews', reviewId);
            const reviewDoc = await getDoc(reviewRef);

            if (!reviewDoc.exists()) {
                throw new Error('Review not found');
            }

            const review = reviewDoc.data();
            if (!review.unhelpfulVoters) {
                review.unhelpfulVoters = [];
            }

            if (review.unhelpfulVoters.includes(userId)) {
                throw new Error('You already voted on this review');
            }

            await updateDoc(reviewRef, {
                unhelpful: (review.unhelpful || 0) + 1,
                unhelpfulVoters: [...(review.unhelpfulVoters || []), userId]
            });

            return { success: true };
        } catch (error) {
            console.error('Error marking review unhelpful:', error);
            throw error;
        }
    },

    /**
     * Admin: Approve a review
     */
    async approveReview(listingId, reviewId) {
        try {
            const reviewRef = doc(db, 'listings', listingId, 'reviews', reviewId);
            await updateDoc(reviewRef, {
                status: 'APPROVED',
                updatedAt: serverTimestamp()
            });

            // Update rating stats
            await this.updateListingRatingStats(listingId);

            return { success: true };
        } catch (error) {
            console.error('Error approving review:', error);
            throw error;
        }
    },

    /**
     * Admin: Reject a review
     */
    async rejectReview(listingId, reviewId, reason = '') {
        try {
            const reviewRef = doc(db, 'listings', listingId, 'reviews', reviewId);
            await updateDoc(reviewRef, {
                status: 'REJECTED',
                rejectionReason: reason,
                updatedAt: serverTimestamp()
            });

            return { success: true };
        } catch (error) {
            console.error('Error rejecting review:', error);
            throw error;
        }
    },

    /**
     * Admin: Get all pending reviews for moderation (from all listings)
     */
    async getPendingReviews(limitCount = 50) {
        try {
            const allListings = await getDocs(collection(db, 'listings'));
            let allPendingReviews = [];

            for (const listing of allListings.docs) {
                const q = query(
                    collection(db, 'listings', listing.id, 'reviews'),
                    where('status', '==', 'PENDING'),
                    orderBy('createdAt', 'desc')
                );

                const snapshot = await getDocs(q);
                allPendingReviews = [
                    ...allPendingReviews,
                    ...snapshot.docs.map(doc => ({
                        id: doc.id,
                        listingId: listing.id,
                        listingTitle: listing.data().title,
                        ...doc.data()
                    }))
                ];
            }

            return allPendingReviews
                .sort((a, b) => {
                    const aTime = a.createdAt?.toDate?.()?.getTime?.() || 0;
                    const bTime = b.createdAt?.toDate?.()?.getTime?.() || 0;
                    return bTime - aTime;
                })
                .slice(0, limitCount);
        } catch (error) {
            console.error('Error fetching pending reviews:', error);
            return [];
        }
    },

    /**
     * Admin: Get all approved reviews (from all listings)
     */
    async getApprovedReviews(limitCount = 50) {
        try {
            const allListings = await getDocs(collection(db, 'listings'));
            let allApprovedReviews = [];

            for (const listing of allListings.docs) {
                const q = query(
                    collection(db, 'listings', listing.id, 'reviews'),
                    where('status', '==', 'APPROVED'),
                    orderBy('createdAt', 'desc')
                );

                const snapshot = await getDocs(q);
                allApprovedReviews = [
                    ...allApprovedReviews,
                    ...snapshot.docs.map(doc => ({
                        id: doc.id,
                        listingId: listing.id,
                        listingTitle: listing.data().title,
                        ...doc.data()
                    }))
                ];
            }

            return allApprovedReviews
                .sort((a, b) => {
                    const aTime = a.createdAt?.toDate?.()?.getTime?.() || 0;
                    const bTime = b.createdAt?.toDate?.()?.getTime?.() || 0;
                    return bTime - aTime;
                })
                .slice(0, limitCount);
        } catch (error) {
            console.error('Error fetching approved reviews:', error);
            return [];
        }
    },

    /**
     * Admin: Get all rejected reviews (from all listings)
     */
    async getRejectedReviews(limitCount = 50) {
        try {
            const allListings = await getDocs(collection(db, 'listings'));
            let allRejectedReviews = [];

            for (const listing of allListings.docs) {
                const q = query(
                    collection(db, 'listings', listing.id, 'reviews'),
                    where('status', '==', 'REJECTED'),
                    orderBy('createdAt', 'desc')
                );

                const snapshot = await getDocs(q);
                allRejectedReviews = [
                    ...allRejectedReviews,
                    ...snapshot.docs.map(doc => ({
                        id: doc.id,
                        listingId: listing.id,
                        listingTitle: listing.data().title,
                        ...doc.data()
                    }))
                ];
            }

            return allRejectedReviews
                .sort((a, b) => {
                    const aTime = a.createdAt?.toDate?.()?.getTime?.() || 0;
                    const bTime = b.createdAt?.toDate?.()?.getTime?.() || 0;
                    return bTime - aTime;
                })
                .slice(0, limitCount);
        } catch (error) {
            console.error('Error fetching rejected reviews:', error);
            return [];
        }
    },

    /**
     * Delete a review (admin or user)
     */
    async deleteReview(listingId, reviewId, userId) {
        try {
            const reviewRef = doc(db, 'listings', listingId, 'reviews', reviewId);
            const reviewDoc = await getDoc(reviewRef);

            if (!reviewDoc.exists()) {
                throw new Error('Review not found');
            }

            const review = reviewDoc.data();

            // Only allow deletion by review author or admin
            if (review.reviewerId !== userId) {
                throw new Error('Unauthorized: Can only delete your own reviews');
            }

            // Delete review
            await deleteDoc(reviewRef);

            // Update rating stats
            await this.updateListingRatingStats(listingId);

            return { success: true };
        } catch (error) {
            console.error('Error deleting review:', error);
            throw error;
        }
    },

    /**
     * Calculate average rating for a user (seller rating)
     */
    async getUserAverageRating(userId) {
        try {
            // This would need a more complex query structure
            // For now, return mock data
            const userReviews = await this.getUserReviews(userId);
            if (userReviews.length === 0) return null;

            const ratings = userReviews.map(r => r.rating);
            const avgRating = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);

            return {
                avgRating: parseFloat(avgRating),
                totalReviews: userReviews.length,
                ratings
            };
        } catch (error) {
            console.error('Error calculating user average rating:', error);
            return null;
        }
    },

    /**
     * Check if user can leave a review (verified purchase)
     */
    async canUserReview(listingId, userId) {
        try {
            // Check if user has purchased/interacted with this listing
            // This is a simplified check - in production, verify via messages or transactions
            const q = query(
                collection(db, 'chats'),
                where('itemId', '==', listingId),
                where('buyerId', '==', userId)
            );

            const snapshot = await getDocs(q);
            return snapshot.docs.length > 0;
        } catch (error) {
            console.error('Error checking review eligibility:', error);
            return false;
        }
    }
};

export default reviewHelpers;
