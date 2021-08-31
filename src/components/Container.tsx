import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import { useParams } from "react-router-dom";
import { Graph } from "./Graph";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import { Params } from "../interfaces";

const useClasses = makeStyles({
  card: {
    width: "50vw",
    height: "50vh",
    overflow: "visible",
  },
  content: {
    height: "calc(100% - 134px)",
    width: "calc(100% - 32px)",
  },
  header: {
    paddingBottom: 0,
  },
  subheader: {
    display: "flex",
    flexDirection: "column",
  },
});

export function Container() {
  const classes = useClasses();
  const { name, symbol }: Params = useParams();

  return (
    <Card className={classes.card}>
      <CardHeader
        title={name ? name : "Bitcoin"}
        subheader={
          <div className={classes.subheader}>
            <div>{symbol ? symbol : "BTC"}</div>
            <div>Past Month</div>
          </div>
        }
        className={classes.header}
      />
      <CardContent className={classes.content}>
        <ParentSize>
          {({ width, height }) => <Graph width={width} height={height} />}
        </ParentSize>
      </CardContent>
    </Card>
  );
}
