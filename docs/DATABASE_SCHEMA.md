// Campus Marketplace - Firestore Database Schema
// ==============================================

// COLLECTION: users
// Stores user profile data
users/{userId}
{
  uid: string,              // Firebase Auth UID (same as document ID)
  email: string,            // User email
  name: string,             // Display name
  avatar: string,           // Profile photo URL
  branch: string,           // e.g., "Computer Science", "ECE"
  year: string,             // e.g., "1st Year", "2nd Year"
  bio: string,              // Optional bio
  phone: string,            // Optional phone
  linkedin: string,         // Optional LinkedIn URL
  github: string,           // Optional GitHub URL
  twitter: string,          // Optional Twitter URL
  website: string,          // Optional personal website
  createdAt: timestamp,     // Account creation time
  updatedAt: timestamp      // Last profile update
}

// COLLECTION: listings
// Marketplace item listings
listings/{listingId}
{
  title: string,            // Item title
  description: string,     // Item description
  price: number,            // Price in INR
  category: string,         // "Books", "Tech & Gear", "Furniture", "Clothing"
  condition: string,        // "New", "Like New", "Good", "Fair"
  image: string,            // Image URL
  images: string[],        // Multiple images (optional)
  
  // Seller info (denormalized for performance)
  sellerId: string,        // Owner UID
  sellerName: string,      // Owner display name
  sellerAvatar: string,    // Owner avatar
  
  // Status
  status: string,          // "active", "sold", "expired"
  
  // Metadata
  views: number,           // View count
  createdAt: timestamp,
  updatedAt: timestamp,
  expiresAt: timestamp     // Auto-expiry (optional)
}

// COLLECTION: wishlist
// User saved items
wishlist/{wishlistId}
{
  userId: string,          // UID of saving user
  listingId: string,       // Reference to listing
  title: string,           // Denormalized
  price: number,           // Denormalized
  image: string,           // Denormalized
  category: string,        // Denormalized
  seller: string,          // Seller name
  createdAt: timestamp
}

// COLLECTION: materials
// Study materials shared by students
materials/{materialId}
{
  title: string,           // Document title
  description: string,    // Optional description
  year: string,           // "1st Year", "2nd Year", "3rd Year", "4th Year", "All"
  branch: string,         // "CSE", "ECE", "Civil", "Mech", "AIML", "All"
  type: string,           // "PDF Document", "Notes", "Question Paper", "Assignment"
  size: string,           // "Community" (user upload) or "External" (scraped)
  
  // Uploader info
  author: string,         // Display name
  uploaderId: string,     // UID (null for external)
  
  // Content
  url: string,            // PDF URL, Drive link, or forum link
  
  // Engagement
  upvotes: string[],      // Array of UIDs who upvoted
  views: number,          // View count
  downloads: number,      // Download count (legacy)
  
  createdAt: timestamp,
  updatedAt: timestamp
}

// COLLECTION: events
// Campus events
events/{eventId}
{
  title: string,          // Event title
  description: string,   // Full description
  date: timestamp,        // Event date
  time: string,          // Event time string
  location: string,      // Venue
  image: string,         // Event image
  
  // Organizer
  organizerId: string,    // Organizer UID
  organizerName: string,  // Organizer name
  
  // Details
  category: string,       // "Academic", "Cultural", "Sports", "Technical", "Social"
  entryFee: number,       // 0 for free
  seats: number,         // Max attendees (0 = unlimited)
  registeredUsers: string[], // Array of UIDs
  
  createdAt: timestamp
}

// COLLECTION: rides
// Ride sharing
rides/{rideId}
{
  from: string,           // Pickup location
  to: string,             // Destination (usually campus)
  date: timestamp,       // Travel date
  time: string,          // Departure time
  
  // Driver info
  driverId: string,       // Driver UID
  driverName: string,     // Driver name
  driverAvatar: string,   // Driver photo
  
  // Vehicle
  vehicleType: string,    // "Car", "Bike", "Auto"
  vehicleNumber: string,  // Vehicle number (optional, for verified)
  seatsAvailable: number, // Available seats
  
  // Details
  price: number,         // Price per seat
  notes: string,         // Additional notes
  
  // Passengers
  passengers: string[],   // Array of passenger UIDs
  
  status: string,        // "active", "completed", "cancelled"
  
  createdAt: timestamp
}

// COLLECTION: chats
// Messaging - conversations
chats/{chatId}
{
  // Related item (for marketplace chats)
  itemId: string,        // Listing ID (optional)
  itemName: string,     // Item title
  
  // Participants
  buyerId: string,       // Buyer UID
  buyerName: string,
  sellerId: string,      // Seller UID
  sellerName: string,
  
  // Last message
  lastMessage: string,
  lastMessageAt: timestamp,
  
  // Expiry (24hr for marketplace)
  expiresAt: timestamp,
  
  createdAt: timestamp
}

// SUB-COLLECTION: chats/{chatId}/messages
messages/{messageId}
{
  senderId: string,      // Sender UID
  senderName: string,    // Sender name
  text: string,         // Message text
  read: boolean,        // Read status
  createdAt: timestamp
}

// COLLECTION: notifications
// User notifications
notifications/{notificationId}
{
  userId: string,        // Recipient UID
  type: string,          // "message", "wishlist", "upvote", "event", "system"
  title: string,         // Notification title
  body: string,         // Notification body
  link: string,         // Optional link to navigate
  read: boolean,        // Read status
  
  createdAt: timestamp
}

// ==============================================
// INDEXES NEEDED (create in Firebase Console)
// ==============================================
/*
1. listings: 
   - sellerId (asc), createdAt (desc)
   - category (asc), createdAt (desc)
   - status (asc), createdAt (desc)

2. materials:
   - year (asc), branch (asc), createdAt (desc)

3. rides:
   - from (asc), date (asc)
   - driverId (asc), createdAt (desc)

4. events:
   - date (asc), category (asc)
   - organizerId (asc), createdAt (desc)

5. chats:
   - buyerId (asc), lastMessageAt (desc)
   - sellerId (asc), lastMessageAt (desc)

6. wishlist:
   - userId (asc), createdAt (desc)
*/

// ==============================================
// SECURITY RULES (firestore.rules)
// ==============================================
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can read any profile, only update own
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Listings - anyone can read, only owner can write
    match /listings/{listingId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.sellerId;
    }
    
    // Wishlist - only owner can access
    match /wishlist/{wishlistId} {
      allow read, write: if request.auth != null && request.auth.uid == data.userId;
    }
    
    // Materials - anyone can read, auth users can create
    match /materials/{materialId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == data.uploaderId;
    }
    
    // Events
    match /events/{eventId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && request.auth.uid == data.organizerId;
    }
    
    // Rides
    match /rides/{rideId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
    }
    
    // Chats - participants only
    match /chats/{chatId} {
      allow read: if request.auth != null && 
        (request.auth.uid == data.buyerId || request.auth.uid == data.sellerId);
      allow create: if request.auth != null;
    }
    
    // Messages in chats - participants only
    match /chats/{chatId}/messages/{messageId} {
      allow read, write: if request.auth != null;
    }
  }
}
*/
