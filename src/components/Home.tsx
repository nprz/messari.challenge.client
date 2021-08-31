import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Container } from "./Container";
import { ComboBox } from "./ComboBox";
import { Metrics } from "./Metrics";

const useStyles = makeStyles({
  root: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "column",
    alignItems: "center",
  },
});

export function Home() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ComboBox />
      <Container />
      <Metrics />
    </div>
  );
}
