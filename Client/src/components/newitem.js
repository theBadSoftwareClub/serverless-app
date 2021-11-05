import React, { useState } from 'react';
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
  FormControlLabel,
  Switch,
} from '@material-ui/core';

import Alert from '@material-ui/lab/Alert';
import AddBoxIcon from '@material-ui/icons/AddBox';

const useStyles = makeStyles((app_theme) => ({
  pagetitle: {
    padding: app_theme.spacing(4),
  },
  input: {
    display: 'none',
  },
}));

const NewItem = ({ newItem }) => {
  const [body, setBody] = useState();
  const [title, setTitle] = useState("Title");
  const [validationfeedback, setValidationFeedback] = useState();
  const [newitemopen, setNewItemOpen] = useState(false);
  const classes = useStyles();


  const handleNewItemOpen = () => {
    setNewItemOpen(true);
  };

  const handleNewItemClose = () => {
    setNewItemOpen(false);
  };


  const handleNewItemSubmit = (event) => {
    if (body === null || body === undefined || body.length < 1) {
      setValidationFeedback('Body Must not be empty');
      return false;
    }
    try {
      JSON.parse(body);
    } catch (e) {
      setValidationFeedback('Must be Valid JSON');
      return false;
    }

    newItem(title, body);
    setNewItemOpen(false);
    return true;
  };

  return (
    <>
      <Dialog
        open={newitemopen}
        onClose={handleNewItemClose}
        maxWidth="lg"
        fullWidth
        scroll="body"
      >
        <DialogTitle>New Item</DialogTitle>
        <DialogContent >
          <Grid
            container
            direction="column"
            spacing={8}
            justify="space-between"
          >
            <Grid item>
              <TextField
                name="title"
                defaultValue="Title"
                onInput={(e) => setTitle(e.target.value)}
              />
            </Grid>
            <Grid item>
              <FormLabel>JSON</FormLabel>
              <TextField
                autoFocus
                defaultValue={"{}"}
                variant="outlined"
                multiline
                rows="24"
                fullWidth
                className={classes.textarea}
                onInput={(e) => setBody(e.target.value)}
              />
            </Grid>
            <Grid item >
             </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          {validationfeedback && (
            <Alert severity="error">{validationfeedback}</Alert>
          )}
          <Button variant="contained" onClick={handleNewItemClose} >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={(event) => {
              handleNewItemSubmit(event);
              event.preventDefault();
            }}
            color="primary"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Button
        variant="contained"
        color="primary"
        size="large"
        className={classes.button}
        startIcon={<AddBoxIcon />}
        onClick={handleNewItemOpen}

      >
        Add New Item
      </Button>
    </>
  );
};

export default NewItem;
