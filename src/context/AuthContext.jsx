import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    signInWithPopup,
    GoogleAuthProvider
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { collection, query, where, onSnapshot, getDocs, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchUserProfile = async (uid) => {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            return userSnap.data();
        }
        return null;
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const profileData = await fetchUserProfile(firebaseUser.uid);
                setUser({
                    uid: firebaseUser.uid,
                    name: firebaseUser.displayName || 'Campus User',
                    email: firebaseUser.email,
                    avatar: firebaseUser.photoURL || `https://i.pravatar.cc/150?u=${firebaseUser.uid}`,
                    branch: profileData?.branch || 'Student',
                    year: profileData?.year || 'Unknown',
                    bio: profileData?.bio || '',
                    phone: profileData?.phone || '',
                    linkedin: profileData?.linkedin || '',
                    github: profileData?.github || '',
                    twitter: profileData?.twitter || '',
                    website: profileData?.website || ''
                });
            } else {
                setUser(null);
                setUnreadCount(0);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Listen for unread messages - simplified without index
    useEffect(() => {
        if (!user) return;

        const chatsRef = collection(db, 'chats');
        const q1 = query(chatsRef, where('buyerId', '==', user.uid));
        const q2 = query(chatsRef, where('sellerId', '==', user.uid));

        const updateUnreadCount = async () => {
            try {
                const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
                const allChats = [...snap1.docs.map(d => ({ id: d.id })), ...snap2.docs.map(d => ({ id: d.id }))];
                
                let totalUnread = 0;
                // Count all messages from others (simplified - doesn't need index)
                for (const chat of allChats) {
                    const messagesRef = collection(db, 'chats', chat.id, 'messages');
                    const q = query(messagesRef, where('senderId', '!=', user.uid));
                    const snapshot = await getDocs(q);
                    totalUnread += snapshot.docs.filter(d => d.data().read === false).length;
                }
                setUnreadCount(totalUnread);
            } catch (err) {
                console.error('Error calculating unread:', err);
                setUnreadCount(0);
            }
        };

        // Initial load
        updateUnreadCount();

        // Listen for chat changes
        const unsub1 = onSnapshot(q1, updateUnreadCount);
        const unsub2 = onSnapshot(q2, updateUnreadCount);

        return () => { unsub1(); unsub2(); };
    }, [user?.uid]);

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const register = async (email, password, name) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
            displayName: name
        });
        return userCredential;
    };

    const logout = () => {
        return signOut(auth);
    };

    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    };

    const updateUserProfile = async (updates) => {
        const firebaseUser = auth.currentUser;
        if (!firebaseUser) throw new Error('No user logged in');

        if (updates.name || updates.avatar) {
            await updateProfile(firebaseUser, {
                displayName: updates.name || firebaseUser.displayName,
                photoURL: updates.avatar || firebaseUser.photoURL
            });
        }

        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
            await updateDoc(userRef, updates);
        } else {
            await setDoc(userRef, {
                ...updates,
                email: firebaseUser.email,
                createdAt: new Date().toISOString()
            });
        }

        setUser(prev => ({ ...prev, ...updates }));
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout,
            signInWithGoogle,
            updateUserProfile,
            isAuthModalOpen,
            setIsAuthModalOpen,
            unreadCount,
            setUnreadCount
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
