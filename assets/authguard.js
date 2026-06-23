/* GXY Auth Guard — Firebase-backed page protection.
   Include on protected pages with:
     <script type="module" src="[root]assets/authguard.js" data-root="[root]"></script>
   It verifies the visitor is signed in via Firebase. If not, it redirects to the login page.
   It also keeps the legacy sessionStorage 'bpw_auth' flag in sync so older inline checks still pass.
*/
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCN4mEtGMjSxdgsTlthhzX6FXIjxltJKHQ",
  authDomain: "gxyhockey.firebaseapp.com",
  projectId: "gxyhockey",
  storageBucket: "gxyhockey.firebasestorage.app",
  messagingSenderId: "474584991663",
  appId: "1:474584991663:web:b8986544418d6b85fa115a",
  measurementId: "G-1S6M1F62RE"
};

const me = document.currentScript || document.querySelector('script[src*="authguard.js"]');
const root = (me && me.getAttribute('data-root')) || '';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

onAuthStateChanged(auth, (user)=>{
  if(user){
    sessionStorage.setItem('bpw_auth','1');   // keep legacy checks happy
  } else {
    sessionStorage.removeItem('bpw_auth');
    window.location.href = root + 'login.html';
  }
});

// Expose a logout helper any page can call: window.gxyLogout()
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
window.gxyLogout = function(){
  signOut(auth).finally(()=>{
    sessionStorage.removeItem('bpw_auth');
    window.location.href = root + 'login.html';
  });
};
