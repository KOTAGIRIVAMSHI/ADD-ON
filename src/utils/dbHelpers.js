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
    Timestamp,
    increment
} from 'firebase/firestore';

const COLLECTIONS = {
    USERS: 'users',
    LISTINGS: 'listings',
    WISHLIST: 'wishlist',
    MATERIALS: 'materials',
    EVENTS: 'events',
    RIDES: 'rides',
    CHATS: 'chats',
    NOTIFICATIONS: 'notifications'
};

export const dbHelpers = {
    // ==================== USERS ====================
    async getUserProfile(uid) {
        const docRef = doc(db, COLLECTIONS.USERS, uid);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    },

    async updateUserProfile(uid, data) {
        const docRef = doc(db, COLLECTIONS.USERS, uid);
        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp()
        });
    },

    // ==================== LISTINGS ====================
    async createListing(data) {
        return await addDoc(collection(db, COLLECTIONS.LISTINGS), {
            ...data,
            status: 'active',
            views: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
    },

    async getListing(listingId) {
        const docRef = doc(db, COLLECTIONS.LISTINGS, listingId);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return null;
        
        await updateDoc(docRef, { views: increment(1) });
        return { id: docSnap.id, ...docSnap.data() };
    },

    async getListingsByUser(userId) {
        const q = query(
            collection(db, COLLECTIONS.LISTINGS),
            where('sellerId', '==', userId)
        );
        const snapshot = await getDocs(q);
        let results = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        
        // Sort by createdAt descending in memory
        results.sort((a, b) => {
            const aTime = a.createdAt?.toMillis?.() || 0;
            const bTime = b.createdAt?.toMillis?.() || 0;
            return bTime - aTime;
        });
        
        return results;
    },

    async getActiveListings(category = null, pageSize = 20) {
        let q;
        
        if (category && category !== 'All') {
            q = query(
                collection(db, COLLECTIONS.LISTINGS),
                where('status', '==', 'active'),
                where('category', '==', category)
            );
        } else {
            q = query(
                collection(db, COLLECTIONS.LISTINGS),
                where('status', '==', 'active')
            );
        }
        
        const snapshot = await getDocs(q);
        let results = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        
        // Sort by createdAt descending in memory
        results.sort((a, b) => {
            const aTime = a.createdAt?.toMillis?.() || 0;
            const bTime = b.createdAt?.toMillis?.() || 0;
            return bTime - aTime;
        });
        
        return results.slice(0, pageSize);
    },

    async markListingSold(listingId) {
        const docRef = doc(db, COLLECTIONS.LISTINGS, listingId);
        await updateDoc(docRef, {
            status: 'sold',
            updatedAt: serverTimestamp()
        });
    },

    async deleteListing(listingId) {
        await deleteDoc(doc(db, COLLECTIONS.LISTINGS, listingId));
    },

    // ==================== WISHLIST ====================
    async addToWishlist(userId, listing) {
        const q = query(
            collection(db, COLLECTIONS.WISHLIST),
            where('userId', '==', userId),
            where('listingId', '==', listing.id)
        );
        const existing = await getDocs(q);
        
        if (!existing.empty) {
            throw new Error('Item already in wishlist');
        }

        return await addDoc(collection(db, COLLECTIONS.WISHLIST), {
            userId,
            listingId: listing.id,
            title: listing.title,
            price: listing.price,
            image: listing.image,
            category: listing.category,
            seller: listing.sellerName,
            createdAt: serverTimestamp()
        });
    },

    async removeFromWishlist(userId, listingId) {
        const q = query(
            collection(db, COLLECTIONS.WISHLIST),
            where('userId', '==', userId),
            where('listingId', '==', listingId)
        );
        const snapshot = await getDocs(q);
        const deletePromises = snapshot.docs.map(d => deleteDoc(d.ref));
        await Promise.all(deletePromises);
    },

    async getUserWishlist(userId) {
        const q = query(
            collection(db, COLLECTIONS.WISHLIST),
            where('userId', '==', userId)
        );
        const snapshot = await getDocs(q);
        let results = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        
        // Sort by createdAt descending in memory
        results.sort((a, b) => {
            const aTime = a.createdAt?.toMillis?.() || 0;
            const bTime = b.createdAt?.toMillis?.() || 0;
            return bTime - aTime;
        });
        
        return results;
    },

    // ==================== MATERIALS ====================
    async uploadMaterial(data) {
        return await addDoc(collection(db, COLLECTIONS.MATERIALS), {
            ...data,
            upvotes: [],
            views: 0,
            downloads: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
    },

    async toggleUpvote(materialId, userId, currentUpvotes) {
        const docRef = doc(db, COLLECTIONS.MATERIALS, materialId);
        const hasUpvoted = currentUpvotes?.includes(userId);
        
        await updateDoc(docRef, {
            upvotes: hasUpvoted
                ? currentUpvotes.filter(uid => uid !== userId)
                : [...(currentUpvotes || []), userId]
        });
    },

    async getMaterials(filters = {}) {
        let q;
        
        if (filters.year && filters.year !== 'All' && filters.branch && filters.branch !== 'All') {
            q = query(
                collection(db, COLLECTIONS.MATERIALS),
                where('year', '==', filters.year),
                where('branch', '==', filters.branch)
            );
        } else if (filters.year && filters.year !== 'All') {
            q = query(
                collection(db, COLLECTIONS.MATERIALS),
                where('year', '==', filters.year)
            );
        } else if (filters.branch && filters.branch !== 'All') {
            q = query(
                collection(db, COLLECTIONS.MATERIALS),
                where('branch', '==', filters.branch)
            );
        } else {
            q = query(collection(db, COLLECTIONS.MATERIALS));
        }
        
        const snapshot = await getDocs(q);
        let results = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        
        // Sort by createdAt descending in memory
        results.sort((a, b) => {
            const aTime = a.createdAt?.toMillis?.() || 0;
            const bTime = b.createdAt?.toMillis?.() || 0;
            return bTime - aTime;
        });
        
        return results;
    },

    // ==================== EVENTS ====================
    async createEvent(data) {
        return await addDoc(collection(db, COLLECTIONS.EVENTS), {
            ...data,
            registeredUsers: [],
            createdAt: serverTimestamp()
        });
    },

    async registerForEvent(eventId, userId) {
        const docRef = doc(db, COLLECTIONS.EVENTS, eventId);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) throw new Error('Event not found');
        
        const event = docSnap.data();
        if (event.registeredUsers?.includes(userId)) {
            throw new Error('Already registered');
        }
        
        const seats = event.seats || 0;
        if (seats > 0 && (event.registeredUsers?.length || 0) >= seats) {
            throw new Error('Event is full');
        }
        
        await updateDoc(docRef, {
            registeredUsers: [...(event.registeredUsers || []), userId]
        });
    },

    async unregisterFromEvent(eventId, userId) {
        const docRef = doc(db, COLLECTIONS.EVENTS, eventId);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) throw new Error('Event not found');
        
        const event = docSnap.data();
        if (!event.registeredUsers?.includes(userId)) {
            throw new Error('Not registered');
        }
        
        await updateDoc(docRef, {
            registeredUsers: event.registeredUsers.filter(id => id !== userId)
        });
    },

    async getEventRegistrations(eventId) {
        const docRef = doc(db, COLLECTIONS.EVENTS, eventId);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) return [];
        
        const event = docSnap.data();
        return event.registeredUsers || [];
    },

    async getUpcomingEvents(limitCount = 10) {
        // Get all events and filter/sort in memory since date is stored as string
        const q = query(collection(db, COLLECTIONS.EVENTS));
        const snapshot = await getDocs(q);
        let results = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        
        // Filter and sort by date in memory
        const now = new Date();
        results = results.filter(event => {
            if (!event.date) return false;
            // Try to parse the date string (e.g., "Oct 20, 2024" or "Oct 20")
            const eventDate = new Date(event.date);
            return eventDate >= now;
        });
        
        // Sort by parsed date ascending
        results.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA - dateB;
        });
        
        return results.slice(0, limitCount);
    },

    // ==================== RIDES ====================
    async createRide(data) {
        return await addDoc(collection(db, COLLECTIONS.RIDES), {
            ...data,
            passengers: [],
            status: 'active',
            createdAt: serverTimestamp()
        });
    },

    async bookRide(rideId, userId) {
        const docRef = doc(db, COLLECTIONS.RIDES, rideId);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) throw new Error('Ride not found');
        
        const ride = docSnap.data();
        if (ride.passengers?.includes(userId)) {
            throw new Error('Already booked');
        }
        
        const seats = parseInt(ride.seatsAvailable) || 0;
        if (seats > 0 && (ride.passengers?.length || 0) >= seats) {
            throw new Error('No seats available');
        }
        
        await updateDoc(docRef, {
            passengers: [...(ride.passengers || []), userId]
        });
    },

    async cancelRideBooking(rideId, userId) {
        const docRef = doc(db, COLLECTIONS.RIDES, rideId);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) throw new Error('Ride not found');
        
        const ride = docSnap.data();
        if (!ride.passengers?.includes(userId)) {
            throw new Error('Not booked');
        }
        
        await updateDoc(docRef, {
            passengers: ride.passengers.filter(id => id !== userId)
        });
    },

    async findRides(from, to, date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const q = query(
            collection(db, COLLECTIONS.RIDES),
            where('from', '==', from),
            where('to', '==', to),
            where('date', '>=', Timestamp.fromDate(startOfDay)),
            where('date', '<=', Timestamp.fromDate(endOfDay)),
            where('status', '==', 'active'),
            orderBy('date', 'asc')
        );
        
        const snapshot = await getDocs(q);
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    async getAllRides() {
        const q = query(
            collection(db, COLLECTIONS.RIDES),
            where('status', '==', 'active')
        );
        const snapshot = await getDocs(q);
        let results = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        
        // Sort by createdAt descending in memory
        results.sort((a, b) => {
            const aTime = a.createdAt?.toMillis?.() || 0;
            const bTime = b.createdAt?.toMillis?.() || 0;
            return bTime - aTime;
        });
        
        return results;
    },

    // ==================== CHATS ====================
    async getOrCreateChat(buyerId, sellerId, itemId, itemName) {
        const q = query(
            collection(db, COLLECTIONS.CHATS),
            where('itemId', '==', itemId),
            where('buyerId', '==', buyerId),
            where('sellerId', '==', sellerId)
        );
        
        const existing = await getDocs(q);
        if (!existing.empty) {
            return existing.docs[0].id;
        }
        
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const docRef = await addDoc(collection(db, COLLECTIONS.CHATS), {
            itemId,
            itemName,
            buyerId,
            sellerId,
            lastMessage: '',
            lastMessageAt: serverTimestamp(),
            expiresAt: Timestamp.fromDate(expiresAt),
            createdAt: serverTimestamp()
        });
        
        return docRef.id;
    },

    async sendMessage(chatId, senderId, senderName, text) {
        const chatRef = doc(db, COLLECTIONS.CHATS, chatId);
        
        await addDoc(collection(db, COLLECTIONS.CHATS, chatId, 'messages'), {
            senderId,
            senderName,
            text,
            read: false,
            createdAt: serverTimestamp()
        });
        
        await updateDoc(chatRef, {
            lastMessage: text,
            lastMessageAt: serverTimestamp()
        });
    },

    async getUserChats(userId) {
        const q1 = query(
            collection(db, COLLECTIONS.CHATS),
            where('buyerId', '==', userId),
            orderBy('lastMessageAt', 'desc')
        );
        const q2 = query(
            collection(db, COLLECTIONS.CHATS),
            where('sellerId', '==', userId),
            orderBy('lastMessageAt', 'desc')
        );
        
        const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
        
        const chats = [
            ...snap1.docs.map(d => ({ id: d.id, ...d.data() })),
            ...snap2.docs.map(d => ({ id: d.id, ...d.data() }))
        ];
        
        return chats.sort((a, b) => 
            (b.lastMessageAt?.toDate() || 0) - (a.lastMessageAt?.toDate() || 0)
        );
    },

    // ==================== NOTIFICATIONS ====================
    async createNotification(userId, type, title, body, link = null) {
        return await addDoc(collection(db, COLLECTIONS.NOTIFICATIONS), {
            userId,
            type,
            title,
            body,
            link,
            read: false,
            createdAt: serverTimestamp()
        });
    },

    async markNotificationRead(notificationId) {
        const docRef = doc(db, COLLECTIONS.NOTIFICATIONS, notificationId);
        await updateDoc(docRef, { read: true });
    },

    async getUserNotifications(userId, limitCount = 20) {
        const q = query(
            collection(db, COLLECTIONS.NOTIFICATIONS),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    }
};

export default dbHelpers;
