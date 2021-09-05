import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
const AuthProvider = React.createContext();

export const useAuth = () => {
  return useContext(AuthProvider);
};

export const AuthContext = ({ children }) => {
  const [login, setLogin] = useState(true);
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const auth = getAuth();
    const subject = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLogin(false);
    });
    return subject;
  }, []);

  const signup = (email, password, userName) => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        updateProfile(userCredential.user, {
          displayName: userName,
        });
        const user = userCredential.user;
        setCurrentUser(user);
        // ...
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };

  const loginApp = (email, password) => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setCurrentUser(user);
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };

  const signOuts = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        setCurrentUser({});
      })
      .catch((error) => {});
  };

  const value = {
    currentUser,
    signup,
    loginApp,
    signOuts,
  };

  return (
    <AuthProvider.Provider value={value}>
      {!login && children}{" "}
    </AuthProvider.Provider>
  );
};
