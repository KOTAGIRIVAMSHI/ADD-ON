import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    where,
    orderBy,
    getDocs,
    serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";
import { useState, useEffect } from "react";

export const useFirestore = (collectionName, queryConstraints = []) => {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch documents with real-time updates
    useEffect(() => {
        let q = query(
            collection(db, collectionName),
            ...queryConstraints
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const results = [];
            snapshot.docs.forEach(doc => {
                results.push({ ...doc.data(), id: doc.id });
            });
            setDocs(results);
            setLoading(false);
        }, (err) => {
            console.error(err);
            setError(err.message);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [collectionName]);

    // Add a document
    const addDocument = async (data) => {
        setError(null);
        try {
            const docRef = await addDoc(collection(db, collectionName), {
                ...data,
                createdAt: serverTimestamp()
            });
            return docRef;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    // Delete a document
    const deleteDocument = async (id) => {
        setError(null);
        try {
            await deleteDoc(doc(db, collectionName, id));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    // Update a document
    const updateDocument = async (id, data) => {
        setError(null);
        try {
            const docRef = doc(db, collectionName, id);
            await updateDoc(docRef, data);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    return { docs, loading, error, addDocument, deleteDocument, updateDocument };
};
