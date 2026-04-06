import { db } from "./firebase";
import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore/lite";

// import { signInAnonymously } from "firebase/auth";

/**
 * generate a unique key to store users access token
 */
const generateDataKey = () => {
  const id = "auth" + Math.floor(Math.random() * 10000);
  localStorage.setItem("id", id);

  return id;
};

/**
 * store user access token on firestore
 */
export const storeToken = async (token: string) => {
  try {
    const id = generateDataKey();

    await setDoc(doc(db, "authData", id), { token });

    localStorage.setItem("id", id);
  } catch (error) {
    console.log(error);
  }
};

/**
 * get a token from the firestore
 */
export const getToken = async () => {
  try {
    const id = localStorage.getItem("id");

    if (id) {
      const docRef = doc(db, "authData", id);

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data()["token"];
      }
    }
  } catch (error) {
    console.log(error);
  }
};
/**
 * delete token from the firestore
 */
export const deleteToken = async () => {
  try {
    const id = localStorage.getItem("id");

    if (id) {
      const docRef = doc(db, "authData", id);
      await deleteDoc(docRef);

      localStorage.removeItem("id");
      console.log("Document deleted successfully");
    }
  } catch (error) {
    console.error(error);
  }
};

/**
 * update token on fire store
 */
export const updateToken = async (token: string) => {
  try {
    const id = localStorage.getItem("id");

    if (id) {
      const docRef = doc(db, "authData", id);

      await updateDoc(docRef, {
        token,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
