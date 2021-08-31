import React from "react";
import { makeStyles } from "@material-ui/styles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useHistory } from "react-router-dom";
import { Asset } from "../interfaces";

import { loader } from "graphql.macro";
import { useQuery } from "@apollo/client";
const GET_ASSETS = loader("../graphql/getAssets.gql");

const useStyles = makeStyles({
  autoComplete: {
    width: "50vw",
  },
});

export function ComboBox() {
  const classes = useStyles();
  const history = useHistory();

  // loading
  const { data: { getAssets = [] } = {} } = useQuery(GET_ASSETS);

  // handle clear
  return (
    <Autocomplete
      className={classes.autoComplete}
      options={getAssets}
      getOptionLabel={(option: Asset) => option.name}
      onChange={(event: any, newValue: Asset | null) => {
        if (!newValue) {
          history.push("");
        } else {
          history.push(`/${newValue.symbol}/${newValue.name}`);
        }
      }}
      renderInput={(params) => (
        <TextField {...params} label="Asset" variant="outlined" />
      )}
    />
  );
}
