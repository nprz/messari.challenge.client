import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { useParams } from "react-router-dom";
import { Params, GetMetrics } from "../interfaces";
import { getDate, getNumber } from "../helpers/getValues";

import { loader } from "graphql.macro";
import { useQuery } from "@apollo/client";
const GET_METRICS = loader("../graphql/getMetrics.gql");

const useClasses = makeStyles({
  paper: {
    padding: 12,
    width: "50vw",
  },
  dataItem: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
  },
});

const metricTitle: { [index: string]: string } = {
  currentUSDPrice: "Current USD Price",
  ath: "All Time High",
  athDate: "All Time High Date",
  marketCapRank: "Market Cap Rank",
  marketCapUSD: "Market Cap USD",
};

export function Metrics() {
  const classes = useClasses();
  const { symbol }: Params = useParams();

  const { data: { getMetrics } = {} } = useQuery<GetMetrics>(GET_METRICS, {
    variables: {
      asset: symbol || "btc",
    },
  });

  function getValue(value: number | string, key: string) {
    if (key === "marketCapRank") {
      return value;
    }

    if (typeof value === "string") {
      return getDate(value);
    }

    return getNumber(value);
  }

  function renderMetrics() {
    // typename is unused
    // eslint-disable-next-line
    const [typename, ...rest] = Object.entries(getMetrics || {});

    return rest.map(([key, value]) => (
      <div className={classes.dataItem} key={key}>
        <Typography variant="subtitle1" className={classes.title}>
          {metricTitle[key]}
        </Typography>
        :&nbsp;
        <Typography variant="subtitle1">{getValue(value, key)}</Typography>
      </div>
    ));
  }

  return <Paper className={classes.paper}>{renderMetrics()}</Paper>;
}
