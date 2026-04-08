import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

export type Saree = {
  id: string;
  imageUri: string;
  costPrice: string;
  sellingPrice: string;
  createdAt: number;
};

export function useSarees() {
  const [sarees, setSarees] = useState<Saree[]>([]);
  const [loading, setLoading] = useState(true);

  // Instantly listen for changes across all devices
  useFocusEffect(
    useCallback(() => {
      const q = query(collection(db, "sarees"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data: Saree[] = [];
        snapshot.forEach((document) => {
          data.push({ id: document.id, ...document.data() } as Saree);
        });
        setSarees(data);
        setLoading(false);
      }, (error) => {
        console.error("Firestore error:", error);
        setLoading(false);
      });

      return () => unsubscribe();
    }, [])
  );

  const addSaree = async (saree: Omit<Saree, 'id' | 'createdAt'>) => {
    try {
      // 3. Save directly to Firebase Database (base64 image bypasses storage)
      await addDoc(collection(db, "sarees"), {
        imageUri: saree.imageUri,
        costPrice: saree.costPrice,
        sellingPrice: saree.sellingPrice,
        createdAt: Date.now(),
      });
    } catch (e) {
       console.error("Failed to save saree:", e);
       alert("Failed to upload. Make sure Firestore is enabled in test mode.");
    }
  };

  const removeSaree = async (id: string) => {
    try {
      await deleteDoc(doc(db, "sarees", id));
    } catch (e) {
       console.error("Failed to remove saree:", e);
    }
  };

  return { sarees, loading, addSaree, removeSaree };
}

