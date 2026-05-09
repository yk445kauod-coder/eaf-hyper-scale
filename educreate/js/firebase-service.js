// Firebase Service - Production Grade
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, serverTimestamp, doc, updateDoc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDp6eJ0sn8Ll1Q0acwKJT1y81wopsOmWb4",
    authDomain: "educreate-babff.firebaseapp.com",
    projectId: "educreate-babff",
    storageBucket: "educreate-babff.firebasestorage.app",
    messagingSenderId: "144375294184",
    appId: "1:144375294184:web:12b009909b8c071f87015d",
    measurementId: "G-3G066RR640"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Authentication & User Management ---
export const initAuth = () => {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                await updateUserActivity(user.uid);
                resolve(user);
            } else {
                try {
                    const userCredential = await signInAnonymously(auth);
                    await createNewUser(userCredential.user.uid);
                    resolve(userCredential.user);
                } catch (error) {
                    console.error("Critical Auth Error:", error);
                    reject(error);
                }
            }
        });
    });
};

const createNewUser = async (uid) => {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, {
        uid: uid,
        createdAt: serverTimestamp(),
        lastActive: serverTimestamp()
    }, { merge: true });
};

const updateUserActivity = async (uid) => {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, {
        lastActive: serverTimestamp()
    }, { merge: true }).catch(e => console.warn("Could not update activity", e));
};

// --- Documents Management ---
export const saveDocument = async (docData) => {
    const docRef = await addDoc(collection(db, "documents"), {
        ...docData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
    return docRef.id;
};

export const updateDocument = async (docId, updates) => {
    const docRef = doc(db, "documents", docId);
    await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
    });
};

export const getUserDocuments = async (uid) => {
    const q = query(collection(db, "documents"), where("uid", "==", uid));
    const snapshot = await getDocs(q);
    return snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => {
            const timeA = a.updatedAt?.toMillis() || 0;
            const timeB = b.updatedAt?.toMillis() || 0;
            return timeB - timeA;
        });
};

// --- Datasets Management ---
export const saveDataset = async (uid, content, source = 'text') => {
    const docRef = await addDoc(collection(db, "datasets"), {
        uid,
        content,
        source,
        createdAt: serverTimestamp()
    });
    return docRef.id;
};
