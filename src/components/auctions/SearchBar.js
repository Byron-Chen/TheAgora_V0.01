import React, { useRef} from "react";
import {InputGroup, Form, Button} from 'react-bootstrap'

export const SearchBar = ({setSearchItem}) => {

    const searchString = useRef()
    const searchItem = () =>{
        const item = searchString.current.value;
        setSearchItem(item);
    }
  return (
    <InputGroup className="mb-3" >
        <Form.Control
          placeholder="Search for items"
          aria-label="Search for items"
          aria-describedby="search bar"
          required ref={searchString}
          
        />
        <Button variant="info" id="searchbutton" onClick={searchItem}>
          Search
        </Button>
      </InputGroup>
  );
};
