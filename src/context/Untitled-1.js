const functions = require("firebase-functions").region("australia-southeast1");
const { db, admin } = require("./db");

exports.bidProcess = functions.https.onCall(async (data, context) => {
  if (!context?.auth) {
    return { message: "Authentication Required!", code: 401 };
  }

  //   Getting user Info
  var users = await admin
    .firestore()
    .collection("Users")
    .doc(context.auth.uid)
    .get();

  var client = users.data;

  if (data.command == "place") {
    console.log({
      command: data.command,
      auction: data.auction,
      amount: data.amount,
      price: data.price,
      acceptPartOrder: data.acceptPartOrder,
    });

    // current auction
    var curAuction = await admin
      .firestore()
      .collection("Auctions")
      .doc(data.auction)
      .get();


    //order the list so lowest prio first
    var allocate = await admin
    .firestore()
    .collection("Auctions")
    .doc(data.auction)
    .collection("Bids")
    .orderBy("price", "asc")//lowest first
    .orderBy("placed", "desc")//lastest first
    .orderBy("amount", "asc") //highest should be last cos low prio?
    .get();

    //Bids Splitting 
    //Price > time > amount
    //when a new bid is added with a higher price
    //an amount will be taken off the bid with the highest amount ordered by the lastest first
    //
    // Update auction start
    var then = await admin
      .firestore()
      .collection("Auctions")
      .doc(data.auction)
      .collection("Bids")
      .get();

    then.docs.forEach((bid) => {
      const weightedPercentage = calculateWeightedPercentage(
        bid.data().placed,
        1,
        bid.data().price,
        bid.data().amount
      );
      console.log(`Weighted Percentage: ${weightedPercentage.toFixed(2)}%`);
    });

    var positions = [];

    var highestPrice = data.price;

    then.docs.forEach((bid) => {
      positions.push({
        user: context.auth.uid,
        amount: data.amount,
        price: data.price,
      });

      if (bid.data().price > highestPrice) {
        highestPrice = bid.data().price;
      }
    });

    var percentageIncrease =
      ((highestPrice - curAuction.data().price) / curAuction.data().price) *
      100;

    if (percentageIncrease > 100) {
      percentageIncrease = 100;
    }

    // work out order positions

    await admin.firestore().collection("Auctions").doc(data.auction).update({
      percentage: percentageIncrease,
      price: highestPrice,
      positions: positions,
    });
    // Update auction end

    sumAmount = 0
    //lowestPrice = 0
    allocate.docs.forEach((bid) =>{
      //lowestAmount = bid.data().price
      sumAmount += bid.data().amount;
    });
    //check if amount will go over
    if (sumAmount + data.amount < curAuction.data().amount) {
      //add bid normally
      await admin
      .firestore()
      .collection("Auctions")
      .doc(data.auction)
      .collection("Bids")
      .add({
        user: context.auth.uid,
        amount: data.amount,
        price: data.price,
        placed: admin.firestore.FieldValue.serverTimestamp(),
        acceptPartOrder: data.acceptPartOrder,
        color: generateRandomColor(),
        outBid: false,
      });
    } else {

      //need to remove bid amounts
      amountToRemove = data.amount
      while (amountToRemove != 0){
        allocate.docs.forEach((bid)=>{
          let bidupdate = bid.data().amount
          if (bid.data().amount > amountToRemove){
            bidupdate -= amountToRemove
            amountToRemove = 0
            bid.update({amount: bidupdate }) //???
          }else{
            amountToRemove -= bid.data().amount
            allocate.docs.remove(bid)
          }
          
        })

        //allocate.docs.forEach((bid) =>{
          //if (bid.data().price == lowestPrice){
            //update bid 
            //bid.update({amount: })
          //}

        //});
        //amountToRemove -= 1
      }
    }

    
    

   


    // Update auction start
    var then = await admin
      .firestore()
      .collection("Auctions")
      .doc(data.auction)
      .collection("Bids")
      .get();

    var highestPrice = 0;

    then.docs.forEach((bid) => {
      if (bid.data().price > highestPrice) {
        highestPrice = bid.data().price;
      }
    });

    var percentageIncrease =
      ((highestPrice - curAuction.data().price) / curAuction.data().price) *
      100;

    if (percentageIncrease > 100) {
      percentageIncrease = 100;
    }

    await admin.firestore().collection("Auctions").doc(data.auction).update({
      percentage: percentageIncrease,
      price: highestPrice,
    });
    // Update auction end

    return true;
  }

  //   else if (client.seller) {
  //     // Process image with storage
  //     var processedImage = "";

  //     //  Creating auction
  //     var then = await admin
  //       .firestore()
  //       .collection("Auctions")
  //       .add({
  //         owner: context.auth.uid,
  //         createdAt: admin.firestore.FieldValue.serverTimestamp(),

  //         dueTime: data.dueTime,
  //         amount: data.amount,
  //         title: data.title,
  //         description: data.description,
  //         hasTag: data.hasTags,
  //         image: processedImage,
  //         status: "Underway",
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         return { message: "Error creating auction!", code: 401 };
  //       });

  //     //    Updating users data
  //     await admin
  //       .firestore()
  //       .collection("Users")
  //       .doc(context.auth.uid)
  //       .collection("Auctions")
  //       .doc(then.id)
  //       .set({
  //         createdAt: admin.firestore.FieldValue.serverTimestamp(),
  //         title: data.title,
  //         dueTime: data.dueTime,
  //         description: data.description,
  //         owner: true,
  //         status: "Underway",
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   } else {
  //     return { message: "Not a seller!", code: 401 };
  //   }
});

function generateRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "0xff"; // Alpha value for full opacity

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
}
