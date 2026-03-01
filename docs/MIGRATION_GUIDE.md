# Data Migration Guide

## Overview
This guide helps migrate your existing Firestore data to match the new schema structure.

## Field Mappings

### listings Collection
| Old Field | New Field | Notes |
|-----------|-----------|-------|
| `seller` | `sellerName` | Rename |
| - | `sellerAvatar` | New - fetch from user profile |
| `attendees` | `registeredUsers` | Rename to array |

### events Collection
| Old Field | New Field | Notes |
|-----------|-----------|-------|
| `organizer` | `organizerName` | Rename |
| `attendees` | `registeredUsers` | Change to array of UIDs |

### rides Collection
| Old Field | New Field | Notes |
|-----------|-----------|-------|
| `user` | `driverName` | Rename |
| `userId` | `driverId` | Rename |
| `avatar` | `driverAvatar` | Rename |
| `seats` | `seatsAvailable` | Rename |
| `vehicle` | `vehicleType` | Rename |
| - | `status` | Add field with value "active" |
| - | `passengers` | Add empty array |
| - | `notes` | Add empty field |

### wishlist Collection
| Old Field | New Field | Notes |
|-----------|-----------|-------|
| `seller` | `seller` | Keep (denormalized) |

### materials Collection
No major changes needed. Ensure `upvotes` is an array of UIDs.

## Migration Steps

### Step 1: Deploy Security Rules
```bash
# Go to Firebase Console > Firestore > Rules
# Copy content from firestore.rules
```

### Step 2: Create Indexes
In Firebase Console → Firestore → Indexes, create:

```
Collection    | Fields                      | Type
--------------|-----------------------------|-------
listings      | sellerId (asc), createdAt  | Composite
listings      | category (asc), createdAt   | Composite
materials     | year (asc), branch (asc)    | Composite
chats         | buyerId (asc), lastMessageAt | Composite
chats         | sellerId (asc), lastMessageAt| Composite
rides         | status (asc), createdAt     | Composite
events        | date (asc), category (asc)  | Composite
```

### Step 3: Migrate Existing Data (One-time)

You can run a migration script or do manual updates in Firebase Console.

#### Option A: Firebase Console (Manual)
1. Go to Firestore → Data
2. Update each document to match new schema

#### Option B: Migration Script
Create `migrate.js`:

```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const firebaseConfig = { /* your config */ };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrateListings() {
    const snapshot = await getDocs(collection(db, 'listings'));
    const batch = [];
    
    for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const updates = {};
        
        if (data.seller && !data.sellerName) {
            updates.sellerName = data.seller;
        }
        if (!data.sellerAvatar) {
            updates.sellerAvatar = `https://i.pravatar.cc/150?u=${data.sellerId}`;
        }
        if (!data.status) {
            updates.status = 'active';
        }
        
        if (Object.keys(updates).length > 0) {
            await updateDoc(doc(db, 'listings', docSnap.id), updates);
            console.log(`Updated listing: ${docSnap.id}`);
        }
    }
}

async function migrateRides() {
    const snapshot = await getDocs(collection(db, 'rides'));
    
    for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const updates = {};
        
        if (data.user && !data.driverName) {
            updates.driverName = data.user;
            updates.driverId = data.userId;
            updates.driverAvatar = data.avatar;
        }
        if (data.seats && !data.seatsAvailable) {
            updates.seatsAvailable = data.seats;
        }
        if (data.vehicle && !data.vehicleType) {
            updates.vehicleType = data.vehicle;
        }
        if (!data.status) {
            updates.status = 'active';
        }
        if (!data.passengers) {
            updates.passengers = [];
        }
        
        if (Object.keys(updates).length > 0) {
            await updateDoc(doc(db, 'rides', docSnap.id), updates);
            console.log(`Updated ride: ${docSnap.id}`);
        }
    }
}

async function migrateEvents() {
    const snapshot = await getDocs(collection(db, 'events'));
    
    for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const updates = {};
        
        if (data.organizer && !data.organizerName) {
            updates.organizerName = data.organizer;
        }
        if (data.attendees && !Array.isArray(data.registeredUsers)) {
            updates.registeredUsers = [data.organizerId]; // Convert to array
        }
        
        if (Object.keys(updates).length > 0) {
            await updateDoc(doc(db, 'events', docSnap.id), updates);
            console.log(`Updated event: ${docSnap.id}`);
        }
    }
}

// Run migrations
migrateListings().then(() => migrateRides()).then(() => migrateEvents());
```

### Step 4: Verify Migration
1. Check a few documents in each collection
2. Test creating new listings/rides/events
3. Test the app functionality

## New Features Available

After migration, you can use:
- `dbHelpers.getActiveListings(category)` - Filter by category
- `dbHelpers.getListingsByUser(uid)` - Get user's listings
- `dbHelpers.toggleUpvote(materialId, userId, currentUpvotes)` - Toggle upvotes
- `dbHelpers.getOrCreateChat()` - Get or create chat
- `dbHelpers.registerForEvent()` - Register for events
- `dbHelpers.bookRide()` - Book a ride

## Rollback Plan
If issues arise:
1. Keep old field names as aliases temporarily
2. Use Firestore export to backup data before migration
3. Can add compatibility layer in dbHelpers if needed
