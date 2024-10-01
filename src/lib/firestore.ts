import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase'; // Reuse the initialized Firestore instance
import { auth } from './firebase'; // Import the auth instance

export async function getFirestoreData(from: Date, to: Date) {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User is not authenticated');
  }

  const userId = user.uid;
  console.log(`Fetching data for user: ${userId} from: ${from} to: ${to}`);

  const fromString = from.toISOString();
  const toString = to.toISOString();
  console.log(`Converted date strings - from: ${fromString}, to: ${toString}`);

  const q = query(
    collection(db, `users/${userId}/meals`), // Access the correct path
    where('loggedAt', '>=', fromString),
    where('loggedAt', '<=', toString)
  );

  const querySnapshot = await getDocs(q);
  const data = querySnapshot.docs.map(doc => doc.data());
  console.log('Fetched data:', data);
  return data;
}