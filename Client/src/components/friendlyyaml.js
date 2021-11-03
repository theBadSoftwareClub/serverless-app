import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography
} from '@material-ui/core';
import YAML from 'json-to-pretty-yaml';


const useStyles = makeStyles((tophat_theme) => ({
  pagetitle: {
    padding: tophat_theme.spacing(4),
  },
}));

const FriendlyYaml = (yamldoc) => {

  const classes = useStyles();
  
  yamldoc = JSON.parse(yamldoc.yamldoc);
  yamldoc = YAML.stringify(yamldoc);

return (
  <Typography variant="body2" className={classes.root}>
    {
      // special formatting to display multiline / inddented yaml
      yamldoc.split('\n').map((i, key) => {
        return (
          <Fragment key={key}>
            {i.replace(/ /g, '\u00a0')}
            <br />
          </Fragment>
        );
      })
    }
  </Typography>
);
};

export default FriendlyYaml;
