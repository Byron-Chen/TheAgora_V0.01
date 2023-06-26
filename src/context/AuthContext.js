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

    const logout = () => {
        return authApp.signOut();
    }

    const checkBid = () => {
        //check min bid maybe?
        return "b"
    }

    const updateWinnerList = (auctionRef, email, price, amount, powerBuy = false) => {
        return auctionRef.get().then((doc) => {
            let winnerList = doc.data().currentWinner || [];
            let currentWinnerAmount = parseFloat(doc.data().currentWinnerAmount)
            const winnerObject = { email: email, amount: amount, price: price}
            //auto add no checks
            if (powerBuy) {
                winnerList = [{ email: email, amount: amount, price: price }]
            } else {
                //read through list to determine ifit can fit
                //price > time > amount
                if (winnerList.length !== 0) {
                    if (parseFloat(doc.data().currentWinnerAmount) + parseFloat(amount) <= parseFloat(doc.data().amount)) {
                        for (let i = 0; i < winnerList.length; i++) {
                            if (winnerList[i].price < price) {
                                winnerList.splice(i, 0, winnerObject);
                                break
                            } else if (winnerList[i].price == price) {
                                winnerList.push(winnerObject);
                                break
                            }
                        }
                        //winnerList.push(winnerObject)
                        //currentWinnerAmount += parseFloat(amount)
                    } else if (parseFloat(price) >= parseFloat(doc.data().curPrice)){
                        //check price higher then add to winnerlist
                        for (let i = 0; i < winnerList.length; i++) {
                            if (parseFloat(price) > parseFloat(winnerList[i].price) ) {
                                winnerList.splice(i, 0, winnerObject);
                                break
                            }else if (i == winnerList.length -1){
                                //or this
                                winnerList.push(winnerObject)
                                break
                            }
                        }
                    }
                } else {
                    winnerList.push(winnerObject)
                }
                currentWinnerAmount += parseFloat(amount)

                if (currentWinnerAmount > parseFloat(doc.data().amount)){
                    let i = winnerList.length - 1
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

        return auctionRef.get().then((doc) => {
            const bidsList = doc.data().bidsList || [];

            if (parseFloat(price) >= parseFloat(doc.data().curPrice) && parseFloat(amount) <= parseFloat(doc.data().amount)) {
                bidsList.unshift({ email: email, amount: amount, price: price });
                updateWinnerList(auctionRef, email, price, amount)

                return auctionRef.update({
                    bidsList: bidsList,
                    
                });
            } else {
                alert("Check bid price/amount correct")
            }

        });
    };

    const bidAuction = (auctionId, price) => {
        if (!currentUser) {
            return setGlobalMsg("Please Login First")
        }
        let newPrice = ((price / 100) * 110).toFixed(2);
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
        <AuthContext.Provider value={{ currentUser, register, login, logout, bidAuction, endAuction, addBid, checkBid, globalMsg }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}