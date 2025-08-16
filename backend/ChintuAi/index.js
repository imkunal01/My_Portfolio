// import { db } from "./firebaseOrigins.js";
// import { collection, addDoc } from "firebase/firestore";

// const saveLead = async () => {
//   try {
//     const docRef = await addDoc(collection(db, "leads"), {
//       name: "Test User",
//       email: "test@example.com",
//       message: "Interested in website",
//     });
//     console.log("Lead saved with ID:", docRef.id);
//   } catch (e) {
//     console.error("Error saving:", e);
//   }
// };
// saveLead();



import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

// Example: adding a document
const addLead = async () => {
  await addDoc(collection(db, "leads"), {
    name: "John Doe",
    email: "john@example.com"
  });
};

addLead();