import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase.js";

async function testFirestore() {
  try {
    await addDoc(collection(db, "leads"), { name: "Test", email: "test@example.com" });
    console.log("Saved to Firestore!");
  } catch (err) {
    console.error("Error saving:", err);
  }
}

testFirestore();
