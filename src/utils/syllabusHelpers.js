import { db } from '../firebase';
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    serverTimestamp,
    increment
} from 'firebase/firestore';

const SYLLABI_COLLECTION = 'syllabi';

export const syllabusHelpers = {
    // ==================== SYLLABI ====================
    async uploadSyllabus(data) {
        return await addDoc(collection(db, SYLLABI_COLLECTION), {
            ...data,
            upvotes: [],
            downloads: 0,
            type: "Syllabus",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
    },

    async getSyllabi(filters = {}) {
        let q;
        
        // Build query based on filters
        const whereConditions = [];
        
        if (filters.regulation && filters.regulation !== 'All Regulations') {
            whereConditions.push(where('regulation', '==', filters.regulation));
        }
        
        if (filters.branch && filters.branch !== 'All Branches') {
            whereConditions.push(where('branch', '==', filters.branch));
        }
        
        if (filters.year && filters.year !== 'All Years') {
            whereConditions.push(where('year', '==', filters.year));
        }

        if (whereConditions.length > 0) {
            q = query(collection(db, SYLLABI_COLLECTION), ...whereConditions);
        } else {
            q = query(collection(db, SYLLABI_COLLECTION));
        }
        
        const snapshot = await getDocs(q);
        let results = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        
        // Sort by createdAt descending
        results.sort((a, b) => {
            const aTime = a.createdAt?.toMillis?.() || 0;
            const bTime = b.createdAt?.toMillis?.() || 0;
            return bTime - aTime;
        });
        
        return results;
    },

    async getSyllabusByRegulation(regulation) {
        const q = query(
            collection(db, SYLLABI_COLLECTION),
            where('regulation', '==', regulation)
        );
        
        const snapshot = await getDocs(q);
        let results = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        
        results.sort((a, b) => {
            const aTime = a.createdAt?.toMillis?.() || 0;
            const bTime = b.createdAt?.toMillis?.() || 0;
            return bTime - aTime;
        });
        
        return results;
    },

    async toggleUpvote(syllabuId, userId, currentUpvotes) {
        const docRef = doc(db, SYLLABI_COLLECTION, syllabuId);
        const hasUpvoted = currentUpvotes?.includes(userId);
        
        await updateDoc(docRef, {
            upvotes: hasUpvoted
                ? currentUpvotes.filter(uid => uid !== userId)
                : [...(currentUpvotes || []), userId]
        });
    },

    async incrementDownloads(syllabuId) {
        const docRef = doc(db, SYLLABI_COLLECTION, syllabuId);
        await updateDoc(docRef, {
            downloads: increment(1)
        });
    },

    async deleteSyllabus(syllabuId) {
        await deleteDoc(doc(db, SYLLABI_COLLECTION, syllabuId));
    }
};

export default syllabusHelpers;
