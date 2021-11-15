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
  IconButton,
  Box
} from '@material-ui/core';

import Alert from '@material-ui/lab/Alert';
import FriendlyYaml from './friendlyyaml';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
const useStyles = makeStyles((theme) => ({
  pagetitle: {
    padding: theme.spacing(7),
  },
  input: {
    display: 'none',
  },
  document: {
    padding: theme.spacing(6),
  },
  colorpane: {
    backgroundColor: theme.secondary
  }
}));

const Item = ({ item, token, onChange,deleteItem,updateItem }) => {
  const [body, setBody] = useState();
  const [title, setTitle] = useState(item.itemTitle);
  const [validationfeedback, setValidationFeedback] = useState();
  const [formattedbody, setFormattedBody] = useState();
  const [dialogopen, setDialogOpen] = useState(false);
  const classes = useStyles();

  async function fetchItem() {
        console.log('fetching item: ', item.itemId)
        console.log('api url:', process.env.REACT_APP_API_URL)
      if (typeof token != 'undefined') {
            // make the the request with fetch
            let url = encodeURI(`https://${process.env.REACT_APP_API_DOMAIN}.${process.env.REACT_APP_ROOT_DOMAIN}/items/${item.itemId}`)
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
        fetchItem()
    }, []);

  return (
    <Grid
            key={item.itemId}
            container
            spacing={7}
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
                    <Box component="span" sx={{ pl: '2em' }} >
                    <Grid item>

                            <FriendlyYaml yamldoc={JSON.stringify(body)}/>

                    </Grid>
                    </Box>

                    <Grid container direction="row" alignItems={"stretch"} justifyContent="flex-end"  >
                        <Box>
                        <Grid item >
                            <Box component="span" p={12} >
                            <Grid container direction="row" spacing={3}>

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
</Box>
                        </Grid>
                        </Box>

                    </Grid>




                    </>
                        }

                </>
                }
        </Grid>


  );
};

export default Item;
