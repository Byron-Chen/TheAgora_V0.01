import { createContext, useEffect, useState } from "react";
import { authApp, firestoreApp } from "../config/firebase";
import React from 'react';

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [globalMsg, setGlobalMsg] = useState('')

    const login = (email, password) => {
        return authApp.signInWithEmailAndPassword(email, password);
    }

    const register = (email, password) => {    
        return authApp.createUserWithEmailAndPassword(email, password)
    }

    const addUsertoDb = (email) => {
        const userDb = firestoreApp.collection('users')
        userDb.doc(email).set({email, username: "test", friendsList: []})
    }


    const isFriend = (friend) =>{
        const userDb = firestoreApp.collection('users')
        const userRef = userDb.doc(currentUser.email)
        return userRef.get().then((doc) =>{
            let friendsList = doc.data().friendsList;
            for (let i = 0; i < friendsList.length; i++) {
                if (friend == friendsList[i]){
                    return true
                }
            }
            return false
        })
    }

    const addFriend = (friendId) =>{
        const userDb = firestoreApp.collection('users')
        const userRef = userDb.doc(currentUser.email)
        return userRef.get().then((doc)=>{
            let friendsList = doc.data().friendsList || [];
            friendsList.push(friendId)
            return userRef.update({
                friendsList: friendsList,
            })
        })
    }

    const logout = () => {
        return authApp.signOut();
    }

    const checkBid = () => {
        //check min bid maybe?
        return "b"
    }

    

    const addComment = (auction, comment, email) =>{
        const db = firestoreApp.collection('auctions');
        const auctionRef = db.doc(auction.id);
        return auctionRef.get().then((doc) => {
            let commentList = doc.data().comment || [];
            commentList.unshift({email: email, comment: comment})
            return auctionRef.update({
                comment: commentList,
            })
        })
    }


    const updateWinnerList = (auctionRef, email, price, amount, date, powerBuy = false) => {
        return auctionRef.get().then((doc) => {
            let winnerList = doc.data().currentWinner || [];
            let currentWinnerAmount = parseFloat(doc.data().currentWinnerAmount)
            const winnerObject = { email: email, amount: amount, price: price, date: date }
            //auto add no checks
            if (powerBuy) {
                winnerList = [winnerObject]
            } else {
                if (winnerList.length !== 0) {
                    winnerList.push(winnerObject)
                }
                //sortlist by price then time
                winnerList.sort((a,b) => b.price - a.price || a.date - b.date)

                //then split 
                currentWinnerAmount += parseFloat(amount)

                if (currentWinnerAmount > parseFloat(doc.data().amount)){
                    let i = winnerList.length - 1   
                    console.log(currentWinnerAmount, doc.data().amount, i, winnerList[i].amount)
                    while( currentWinnerAmount - parseFloat(doc.data().amount) > 0){
                        if (winnerList[i].amount <= currentWinnerAmount - parseFloat(doc.data().amount)){
                            currentWinnerAmount -= winnerList[i].amount
                            winnerList.splice(i, 1)
                        } else {
                            winnerList[i].amount -= (currentWinnerAmount - parseFloat(doc.data().amount))
                            currentWinnerAmount = parseFloat(doc.data().amount)
                        }

                        i -= 1
                    }
                }

                //check if over amount
            }
            return auctionRef.update({
                currentWinner: winnerList,
                currentWinnerAmount: currentWinnerAmount,
                curPrice: price,
            })
        })
    }

    const addBid = (auctionId, email, price, amount) => {
        const db = firestoreApp.collection('auctions');
        const auctionRef = db.doc(auctionId);

        //console.log(auctionRef.get())

        return auctionRef.get().then((doc) => {
            const bidsList = doc.data().bidsList || [];

            if (parseFloat(price) >= parseFloat(doc.data().curPrice) && parseFloat(amount) <= parseFloat(doc.data().amount)) {
                let currentDate = new Date();
                bidsList.unshift({ email: email, amount: amount, price: price , date: currentDate});
                updateWinnerList(auctionRef, email, price, amount, currentDate)

                return auctionRef.update({
                    bidsList: bidsList,
                    
                });
            } else {
                alert("Check bid price/amount correct")
            }

        });
    };

    const bidAuction = (auctionId, price) => {
        //if (!currentUser) {
        //    return setGlobalMsg("Please Login First")
        //}
        let newPrice = 0//((price / 100) * 110).toFixed(2);
        const db = firestoreApp.collection('auctions');

        return db.doc(auctionId).update({
            curPrice: newPrice,
            curWinner: currentUser.email,
        })
    };
    const endAuction = (auctionId) => {
        const db = firestoreApp.collection('auctions');
        return db.doc(auctionId).delete();
    };

    useEffect(() => {
        const subscribe = authApp.onAuthStateChanged((user) => {
            setCurrentUser(user);
            setLoading(false);
        });
        return subscribe;
    }, []);

    useEffect(() => {
        const interval = setTimeout(() => setGlobalMsg(''), 3000);
        return () => clearTimeout(interval)
    }, [globalMsg])

    return (
        <AuthContext.Provider value={{isFriend, addFriend, currentUser, register, addUsertoDb, login, logout, bidAuction, endAuction, addBid, checkBid, addComment, globalMsg }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}