import React, { useEffect } from 'react'; 
import {
  MDBContainer,
  MDBBtn
} from "mdb-react-ui-kit";

export default function Virtual(props) {

  useEffect(() => {
  }, []);

  return (
    <MDBContainer>
      <MDBBtn>Click me</MDBBtn>
    </MDBContainer>
  );
}