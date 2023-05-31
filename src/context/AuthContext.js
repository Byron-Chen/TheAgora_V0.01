import { createContext, useEffect, useState} from "react";
import { authApp, firestoreApp } from "../config/firebase";
import React from 'react';

export const AuthContext = createContext();
export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [globalMsg, setGlobalMsg] = useState('')

    const login = (email, password) =>{
        return authApp.signInWithEmailAndPassword(email, password);
    }

    const register = (email, password) =>{
        return authApp.createUserWithEmailAndPassword(email, password)
    }

    const logout = () =>{
        return authApp.signOut();
    }

    const bidAuction = (auctionId, price) =>{ 
        if(!currentUser){
            return setGlobalMsg("Please Login First")
        }
        let newPrice = ((price /100) *110).toFixed(2);
        const db = firestoreApp.collection('auctions');

        return db.doc(auctionId).update({
            curPrice: newPrice,
            curWinner:currentUser.email,
        })
    };
    const endAuction = (auctionId) =>{
        const db = firestoreApp.collection('auctions');
        return db.doc(auctionId).delete();
    };

    useEffect(()=>{
        const subscribe = authApp.onAuthStateChanged((user) =>{
            setCurrentUser(user);
            setLoading(false);
        });
        return subscribe;
    }, []);

    useEffect(()=>{
        const interval = setTimeout(() => setGlobalMsg(''), 3000);
        return () => clearTimeout(interval)
    }, [globalMsg])    

    return (
        <AuthContext.Provider value={{currentUser, register, login, logout, bidAuction, endAuction, globalMsg}}>
            {!loading && children}
        </AuthContext.Provider>
    );
}