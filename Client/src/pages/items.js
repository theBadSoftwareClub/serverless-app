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
import { useTheme } from '@material-ui/core/styles';
import { Amplify, Auth } from 'aws-amplify';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
Amplify.configure(awsExports);



const Items = () => {
  const [isEmpty, setIsEmpty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showcreator, setShowCreator] = useState(true);
  const [items, setItems ] = useState();
  const [user, setUser ] = useState();
  const [token, setToken] = useState();
  const app_theme = useTheme();


  async function fetchItems() {
    console.log('fetch')
    if (typeof token != 'undefined') {
      // make the the request with fetch
      console.log(process.env.REACT_APP_API_URL)
      let url = encodeURI(`https://${process.env.REACT_APP_API_Domain}.${process.env.REACT_APP_ROOT_Domain}/items/createdBy`)
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



            console.log('scan results: ', json.Items)
            setIsLoading(false);
          })
          .catch((err) => console.log(err));
    }

  };

  async function newItem(title, body ) {
    let url = encodeURI(`https://${process.env.REACT_APP_API_Domain}.${process.env.REACT_APP_ROOT_Domain}/items?title=${title}`)
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
      })
      .catch((err) => console.log(err));

      fetchItems();
  };

  async function deleteItem(itemId){

    let url = encodeURI(`https://${process.env.REACT_APP_API_Domain}.${process.env.REACT_APP_ROOT_Domain}/items/${itemId}`)

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
            console.log(json)
            setIsLoading(false);

          })
          .catch((err) => console.log(err));
          fetchItems();
    }
  }

  async function updateItem(itemId, title, body ) {


    let url = encodeURI(`https://${process.env.REACT_APP_API_Domain}.${process.env.REACT_APP_ROOT_Domain}/items/${itemId}?title=${title}`)

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
      })

}, [token, isLoading]);


  if (isLoading) {
    return <Typography>Loading ...</Typography>
  }

  if (isEmpty) {
    return (
      <Fragment>
      <Typography>No Items Returned</Typography>
      {showcreator && (
      <NewItem items={ items } newItem={ newItem } updateItem={ updateItem } />
      )}
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

            {showcreator && (
              <Grid>
            <NewItem items={ items } newItem={ newItem } updateItem={ updateItem } />
              </Grid>
          )}
            </Grid>

      </Container>
  );
};

export default Items;
