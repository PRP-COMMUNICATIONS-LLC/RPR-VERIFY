import { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

export const useEscalationStream = () => {
  const [records, setRecords] = useState<any[]>([]);
  useEffect(() => {
    const q = query(collection(db, "customer_intake"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecords(data);
    }, (error) => console.error("Sentinel Stream Blocked:", error));
    return () => unsubscribe();
  }, []);
  return { records };
};