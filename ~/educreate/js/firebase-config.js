import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDp6eJ0sn8Ll1Q0acwKJT1y81wopsOmWb4",
    authDomain: "educreate-babff.firebaseapp.com",
    projectId: "educreate-babff",
    storageBucket: "educreate-babff.firebasestorage.app",
    messagingSenderId: "144375294184",
    appId: "1:144375294184:web:12b009909b8c071f87015d",
    measurementId: "G-3G066RR640"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUserUid = null;

// Initialize Authentication (Anonymous)
export function initAuth(statusElementId) {
    const statusEl = document.getElementById(statusElementId);
    
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            currentUserUid = user.uid;
            statusEl.textContent = "🟢 متصل (Anonymous UID: " + user.uid.substring(0,6) + "...)";
            
            // Save/Update user document
            try {
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    lastActive: serverTimestamp(),
                    createdAt: user.metadata.creationTime ? new Date(user.metadata.creationTime) : serverTimestamp()
                }, { merge: true });
            } catch (e) {
                console.error("Firestore user save error:", e);
            }
        } else {
            // Auto login anonymously
            statusEl.textContent = "🟠 جاري تسجيل الدخول...";
            signInAnonymously(auth).catch((error) => {
                console.error("Auth Error:", error);
                statusEl.textContent = "🔴 خطأ في الاتصال";
            });
        }
    });
}

// Save Generated Document
export async function saveDocument(data) {
    if (!currentUserUid) return null;
    
    try {
        const docRef = await addDoc(collection(db, "documents"), {
            uid: currentUserUid,
            topic: data.topic,
            type: data.type,
            language: data.language,
            dataset: data.dataset || null,
            output: data.output,
            theme: data.theme,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        return null;
    }
}

// Save Dataset (if provided)
export async function saveDataset(content, source = "text") {
    if (!currentUserUid || !content) return null;
    
    try {
        const docRef = await addDoc(collection(db, "datasets"), {
            uid: currentUserUid,
            content: content,
            source: source,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (e) {
        console.error("Error adding dataset: ", e);
        return null;
    }
}
