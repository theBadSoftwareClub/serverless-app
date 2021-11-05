import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Grid,
  TextField,
  FormLabel,
  IconButton
} from '@material-ui/core';

import Alert from '@material-ui/lab/Alert';
import FriendlyYaml from './friendlyyaml';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
const useStyles = makeStyles((app_theme) => ({
  pagetitle: {
    padding: app_theme.spacing(4),
  },
  input: {
    display: 'none',
  },
}));

const Item = ({ item, token, onChange,deleteItem,updateItem }) => {
  const [body, setBody] = useState();
  const [title, setTitle] = useState(item.itemTitle);
  const [validationfeedback, setValidationFeedback] = useState();
  const [newitemopen, setNewItemOpen] = useState(false);
  const [formattedbody, setFormattedBody] = useState();
  const [dialogopen, setDialogOpen] = useState(false);
  const classes = useStyles();


  async function fetchItemNew() {
        console.log('fetching item: ', item.itemId)
        console.log('api url:', process.env.REACT_APP_API_URL)
      if (typeof token != 'undefined') {
            // make the the request with fetch
            let url = encodeURI(`${process.env.REACT_APP_API_URL}/items/${item.itemId}`)
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
                    console.log('plan results: ', json)
                    setBody(json)
                    setFormattedBody(JSON.stringify(json, undefined, 2))

                })
                .catch((err) => console.log(err));
        }
    };

  const handleDialogClose = () => {
        setDialogOpen(false);
    };

  const handleDialogChange = () => {
        if (dialogopen) {
            setDialogOpen(false);
        } else {
            setDialogOpen(true);
        }
    };

  const handleItemDelete = (itemId) => {
      console.log("deleting item: ", itemId)
      onChange("test");
      setBody(null)
        if (dialogopen) {
            setDialogOpen(false);
        }
        ;
        deleteItem(itemId);
    };

  const handleUpdateItemSubmit = (event) => {
        if (formattedbody === null || body === undefined || body.length < 1) {
            setValidationFeedback("Must not be empty");
            return false;
        }
        try {
            JSON.parse(formattedbody);
        } catch (e) {
            // console.log(e)
            setValidationFeedback("Must be Valid JSON");
            return false;
        }

        updateItem(item.itemId, title, formattedbody );
        setDialogOpen(false);
    };

  useEffect(() => {
        fetchItemNew()
    }, []);

  return (
    <Grid
            key={item.itemId}
            container
            spacing={2}
            alignItems="flex-start"
            direction="column"
        >
            {body &&
                <>
                    {dialogopen ?
                        <Dialog
                            open={dialogopen}
                            onClose={handleDialogClose}
                            scroll={"paper"}
                            aria-labelledby={item.itemId}
                            maxWidth="lg"
                            fullWidth
                            id={item.itemId}>
                                <DialogTitle id={item.itemId}>Edit Item</DialogTitle>
                                <DialogContent id={item.itemId}>
                                <Grid
                                  container
                                  direction="column"
                                  spacing={8}
                                  justify="space-between"
                                  >
                                  <Grid item >
                                    <TextField
                                      id={item.itemId}
                                      name="title"
                                      defaultValue={ item.itemTitle }
                                      onInput={ e=>setTitle(e.target.value) }
                                    />
                                  </ Grid>
                                  <Grid item >
                                    <FormLabel>JSON</FormLabel>
                                    <TextField
                                      autoFocus
                                      id={item.itemId}
                                      multiline
                                      rows="24"
                                      fullWidth
                                      variant="outlined"
                                      defaultValue={formattedbody}
                                      className={classes.textarea}
                                      onInput={ e=>setFormattedBody(e.target.value) }
                                    />
                                  </Grid>


                                </Grid>
                                </DialogContent>
                                <DialogActions>
                                {validationfeedback && (
                                  <Alert severity="error">{validationfeedback}</Alert>
                                )
                                }
                                  <Button variant="contained" onClick={handleDialogClose} >
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="contained"
                                    onClick={event => { handleUpdateItemSubmit(item.itemId); event.preventDefault(); }}
                                    color="primary"
                                  >
                                    Update
                                  </Button>
                                </DialogActions>
                        </Dialog>
                        :
                    <>
                    <Grid item>
                        <div padding-left="20px">
                            <FriendlyYaml yamldoc={JSON.stringify(body)}/>
                        </div>
                    </Grid>

                    <Grid container direction="row" justifyContent="space-between">
                        <Grid item>
                            <Grid container direction="row">
                                <Grid item>
                                    <IconButton
                                        aria-label="edit"
                                        id={item.itemId}
                                        onClick={handleDialogChange}
                                        color="primary"
                                    >
                                        <EditIcon/>
                                    </IconButton>
                                </Grid>
                                <Grid item>
                                    <IconButton
                                        aria-label="delete"
                                        id={item.itemId}
                                        onClick={() =>
                                            handleItemDelete(item.itemId)}
                                        color="primary"
                                    >
                                        <DeleteIcon/>
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>


                    </>
                        }

                </>
                }
        </Grid>


  );
};

export default Item;
