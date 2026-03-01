// Firebase Configuration - ARK Games 2.0
const firebaseConfig = {
  apiKey: "AIzaSyBxYLAaFJqFxHkZ2CVU3sFwUCEp60gis2U",
  databaseURL: "https://copilota-6d94a-default-rtdb.firebaseio.com",
  projectId: "copilota-6d94a"
};

// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, get, push, update, remove, onValue, off } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Database helpers
const DB = {
  ref: (path) => ref(db, `ark2/${path}`),
  set: (path, data) => set(ref(db, `ark2/${path}`), data),
  get: async (path) => {
    const snap = await get(ref(db, `ark2/${path}`));
    return snap.exists() ? snap.val() : null;
  },
  push: (path, data) => push(ref(db, `ark2/${path}`), data),
  update: (path, data) => update(ref(db, `ark2/${path}`), data),
  remove: (path) => remove(ref(db, `ark2/${path}`)),
  listen: (path, callback) => {
    const r = ref(db, `ark2/${path}`);
    onValue(r, snap => callback(snap.val()));
    return () => off(r);
  }
};

export { db, DB, ref, set, get, push, update, remove, onValue, off };
