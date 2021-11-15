import React, { useState, useEffect, Fragment } from 'react';
import awsExports from "../aws-exports";

import {
  Typography,
  Container,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@material-ui/core';

import Item from '../components/item';
import NewItem from '../components/newitem';
import { Amplify, Auth } from 'aws-amplify';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
Amplify.configure(awsExports);



const Items = (user) => {
  const [isEmpty, setIsEmpty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems ] = useState();
  const [inauthentic, setInauthentic ] = useState();

  const [token, setToken] = useState();


  async function fetchItems() {
    console.log('fetch')
    if (typeof token != 'undefined') {
      // make the the request with fetch
      console.log(process.env.REACT_APP_API_URL)
      let url = encodeURI(`https://${process.env.REACT_APP_API_DOMAIN}.${process.env.REACT_APP_ROOT_DOMAIN}/items/createdBy`)
      console.log(url)
      const response = await fetch(url, {
        headers: {
          Authorization: `${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        redirect: 'follow'
      });

      // handle the followup with another await
      const res = await response
          .json()
          .then((json) => {
            // work here with the json response object
            if (json.Items.length > 0){
              setItems(json.Items);
              setIsEmpty(false)
            } else {
              setIsEmpty(true)
            }

            setIsLoading(false);
          })
          .catch((err) => console.log(err));
    }

  };

  async function newItem(title, body ) {
    let url = encodeURI(`https://${process.env.REACT_APP_API_DOMAIN}.${process.env.REACT_APP_ROOT_DOMAIN}/items?title=${title}`)
    console.log('url: ', url)

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `${token}`
        },
      body: body,
      redirect: 'follow'
    });

    const res = await resp
      .json()
      .then((json) => {

        setIsLoading(true);
        setIsEmpty(false);
        console.log(res)
      })
      .catch((err) => console.log(err));

      fetchItems();
  };

  async function deleteItem(itemId){

    let url = encodeURI(`https://${process.env.REACT_APP_API_DOMAIN}.${process.env.REACT_APP_ROOT_DOMAIN}/items/${itemId}`)

    if (typeof token != 'undefined') {
      // make the the request with fetch
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      // handle the followup with another await
      const res = await response
          .json()
          .then((json) => {
            // work here with the json response object

            setIsLoading(false);

          })
          .catch((err) => console.log(err));
          fetchItems();
    }
  }

  async function updateItem(itemId, title, body ) {


    let url = encodeURI(`https://${process.env.REACT_APP_API_DOMAIN}.${process.env.REACT_APP_ROOT_DOMAIN}/items/${itemId}?title=${title}`)

    console.log('updating: ', itemId, title, body )

    const resp = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `${token}`,
        Accept: 'application/json',
      },
      body: body,
      redirect: 'follow',
    });

    const res = await resp
      .json()
      .then((json) => {
          setIsLoading(true);
      })
      .catch((err) => console.log(err));

      fetchItems();
  };

  async function handleChange(item) {
        // Here, we invoke the callback with the new value


      console.log('change: ', item)
      // a new call to fetch data will get the updated list from the server after it is submitted
      setIsLoading(true);

  };

  useEffect(() => {
  Auth.currentAuthenticatedUser()
      .then(authuser => {
        setToken(authuser.signInUserSession.idToken.jwtToken)
        fetchItems()
      }, reason => {
        console.log('need follow-through for un-authenticated')
        setInauthentic(true)
        setIsLoading(false)
      })

}, [user, token, isLoading]);


  if (isLoading) {
    return <Typography>Loading ...</Typography>
  }

  if (inauthentic) {
    return <Typography>Must Sign In to See Items ...</Typography>
  }

  if (isEmpty) {
    return (
      <Fragment>
      <Typography>No Items Returned</Typography>
      <NewItem items={ items } newItem={ newItem } updateItem={ updateItem } />
    </Fragment>
    );

  }

  return (
      <Container className="container">
            <Grid container direction="column" justifyContent="space-between" spacing={8} >

            {items.map((item, i) =>
                <Grid item key={i} >
                  <Accordion TransitionProps={{ unmountOnExit: true }} >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2a-content"
                      id="panel2a-header"

                    >
                      <Typography variant="h5">{item.itemTitle}</Typography>
                      </AccordionSummary>
                      <AccordionDetails >

                          <Item item={item} token={token} onChange={handleChange} deleteItem={deleteItem} updateItem={ updateItem } />

                          </AccordionDetails>
                    </Accordion>
                </Grid>
            )}


              <Grid>
            <NewItem items={ items } newItem={ newItem } updateItem={ updateItem } />
              </Grid>

            </Grid>

      </Container>
  );
};

export default Items;
