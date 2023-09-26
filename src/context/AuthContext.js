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

    const findMinPrice = (list) => {
        if (list.length == 0){
            return 0
        }
        let minPrice = list[0].price
            for (let k = 0; k < list.length; k++) {
                if (list[k].price < minPrice){
                    minPrice = list[k].price
                }
            }
        return minPrice
    }

    const findMinPriceAmount = (list, minAmount) =>{
        if (list.length == 0){
            return 0
        }
        let count = 0
        for (let i = 0; i < list.length; i++) {
            if (list[i].price == minAmount){
                count += parseFloat(list[i].amount)
            }
        }
        return count
    }

    const updateWinnerList = (auctionRef, email, price, amount, date, autoBid = 0, powerBuy = false) => {
        return auctionRef.get().then((doc) => {
            let winnerList = doc.data().currentWinner || [];
            let currentWinnerAmount = parseFloat(doc.data().currentWinnerAmount)

            let powerBuyActive = doc.data().powerBuyActive  
            let currentCatchupList = doc.data().currentCatchup || [];
            let currentCatchupAmount = parseFloat(doc.data().currentCatchupAmount)
            const winnerObject = { email: email, amount: amount, price: price, autoBid: autoBid, date:date}

            //auto add no checks
            if (powerBuy) {
                powerBuyActive = true
                winnerList = [winnerObject]
            }else if(powerBuyActive){
                currentCatchupList.push(winnerObject)
                currentCatchupList.sort((a,b) => b.price - a.price || a.amount - b.amount ||a.date - b.date)
                currentCatchupAmount += parseFloat(amount)

                // if (currentCatchupAmount > parseFloat(doc.data().amount)){
                //     let i = currentCatchupList.length - 1
                //     while( currentCatchupAmount - parseFloat(doc.data().amount) > 0){
                //         if (currentCatchupList[i].amount <= currentCatchupAmount - parseFloat(doc.data().amount)){
                //             currentCatchupAmount -= currentCatchupList[i].amount
                //             currentCatchupList.splice(i, 1)
                //         } else {
                            
                //             currentCatchupList[i].amount -= (currentCatchupAmount - parseFloat(doc.data().amount))
                //             currentCatchupAmount = parseFloat(doc.data().amount)
                //         }
                //         currentCatchupList.sort((a,b) => b.price - a.price || a.amount - b.amount ||a.date - b.date)
                //         i -= 1
                //     }
                // }
                if (currentCatchupAmount == parseFloat(doc.data().amount)){
                    powerBuyActive = false
                    winnerList = currentCatchupList
                    currentCatchupList = []
                    currentCatchupAmount = 0
                }
            } else {    
                //read through list to determine if it can fit

                winnerList.push(winnerObject)

                winnerList.sort((a,b) => parseFloat(b.price) - parseFloat(a.price) || a.amount - b.amount ||a.date - b.date)
                currentWinnerAmount += parseFloat(amount)

                if (currentWinnerAmount > parseFloat(doc.data().amount)){
                    let i = winnerList.length - 1
                    while( currentWinnerAmount - parseFloat(doc.data().amount) > 0){
                        while (parseFloat(winnerList[i].autoBid) != 0){
                            winnerList[i].price += doc.data().minBidIncrement
                            //console.log(winnerList[i].price, parseFloat(winnerList[i].autoBid))
                            if (winnerList[i].price >= parseFloat(winnerList[i].autoBid)){
                                winnerList[i].autoBid = 0
                            }
                            winnerList.sort((a,b) => b.price - a.price || a.amount - b.amount ||a.date - b.date)
                        }

                        if (winnerList[i].amount <= currentWinnerAmount - parseFloat(doc.data().amount)){
                            currentWinnerAmount -= winnerList[i].amount
                            winnerList.splice(i, 1)
                        } else {
                            winnerList[i].amount -= (currentWinnerAmount - parseFloat(doc.data().amount))
                            currentWinnerAmount = parseFloat(doc.data().amount)
                        }
                        
                        
                        winnerList.sort((a,b) => b.price - a.price || a.amount - b.amount ||a.date - b.date)
                        i -= 1
                    }
                }
            }

            let minPrice = doc.data().minimumBid
            if (currentWinnerAmount != parseFloat(doc.data().amount)){
                minPrice = findMinPrice(winnerList)
            }
            
            let minPriceAmount = findMinPriceAmount(winnerList, minPrice)
            //console.log(minPriceAmount)
           
            return auctionRef.update({
                currentWinner: winnerList,
                currentWinnerAmount: currentWinnerAmount,
                currentCatchup: currentCatchupList,
                currentCatchupAmount: currentCatchupAmount,
                curPrice: price,
                minimumBidAmount: minPriceAmount,
                minimumBid: minPrice,
                powerBuyActive: powerBuyActive,
            })
        })
    }

    const addBid = (auctionId, email, price, autoBid, amount, powerBuy = false) => {
        const db = firestoreApp.collection('auctions');
        const auctionRef = db.doc(auctionId);

        return auctionRef.get().then((doc) => {
            const bidsList = doc.data().bidsList || [];
            let currentDate = new Date();
            //if (parseFloat(doc.data().amount) == parseFloat(doc.data().currentWWinnerAmount))
            if (parseFloat(price) >= parseFloat(doc.data().minimumBid) && parseFloat(amount) <= parseFloat(doc.data().amount)) {
                if (powerBuy){
                    //check if amount over certain increment
                    if (parseFloat(price) >= (parseFloat(doc.data().curPrice) + parseFloat(doc.data().minBidIncrement)) && parseFloat(amount) == parseFloat(doc.data().amount)){
                        bidsList.unshift({ email: email, amount: amount, price: price , date: currentDate });
                        updateWinnerList(auctionRef, email, price, amount, currentDate, 0,  powerBuy)
                    }else{
                        alert("Powerbid Failed. Make sure max amount and check price")
                    }
                    
                }else{
                    if (parseFloat(price) == parseFloat(doc.data().minimumBid) && parseFloat(doc.data().amount) == parseFloat(doc.data().currentWinnerAmount)){
                        alert("Check bid price/amount correct")
                    }else{
                        if(autoBid){
                            if (doc.data().currentWinner[0] != undefined){
                                var minPrice = parseFloat(doc.data().currentWinner[0].price) + parseFloat(doc.data().minBidIncrement)
                            }else{
                                var minPrice = doc.data().minimumBid + parseFloat(doc.data().minBidIncrement)
                            }
                            
                            updateWinnerList(auctionRef, email, minPrice, amount,  currentDate, price)
                        }else{            
                            updateWinnerList(auctionRef, email, price, amount,  currentDate, 0)
                        }
                        bidsList.unshift({ email: email, amount: amount, price: price , date: currentDate });
                    }
             
                }
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
        <AuthContext.Provider value={{isFriend, addFriend, currentUser, register, addUsertoDb, login, logout, bidAuction, endAuction, addBid, checkBid, addComment, globalMsg }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}