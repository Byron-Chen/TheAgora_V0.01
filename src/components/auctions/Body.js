import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { AddAuction } from './AddAuction'
import { ProgressBar } from './ProgressBar';
import { useFirestore } from '../../hooks/useFirestore';
import { AuctionCard } from './AuctionCard';
import { SearchBar} from './SearchBar';
import { Alert } from 'react-bootstrap';
import { FunctionBar } from './FunctionBar';



export const AuctionBody = () => {
    const [auction, setAuction] = useState(null);
    const [searchItem, setSearchItem] = useState("")
    const {currentUser, globalMsg} = useContext(AuthContext);
    const {docs} = useFirestore('auctions');

    const handleSearchItem = (item) => {
      setSearchItem(item);
    };

    const returnDisplayAuctions = (docs) =>{
      if (searchItem ==="" ){
        return docs
      }
      let returnDocs = []
      for (let i = 0; i < docs.length; i++) {
        for (let j = 0; j < docs[i].hashTag.length; j++){
          if (searchItem.toLowerCase() === docs[i].hashTag[j]){
            returnDocs.push(docs[i])
          }
          
        }
      }
      return returnDocs
    }
  


  return <div className="py-5 ">
    <div className="container ">
      <SearchBar setSearchItem = {handleSearchItem}/>
        {auction && <ProgressBar auction={auction} setAuction={setAuction}/>}

        {globalMsg && <Alert variant="info">{globalMsg}</Alert>}
        {currentUser && <AddAuction setAuction={setAuction} />}

        <div className="col">
          {/* <FunctionBar/> */}
        {returnDisplayAuctions(docs) && (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
            {returnDisplayAuctions(docs).map((doc) =>{
              return <AuctionCard item ={doc} key={doc.id} />
            })}
          </div>
          )}
        </div>
        


    </div>
  </div>
}
