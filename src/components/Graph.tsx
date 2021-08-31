import React, { useMemo, useCallback } from "react";
import { makeStyles } from "@material-ui/styles";
import { LinearGradient } from "@visx/gradient";
import { GridColumns, GridRows } from "@visx/grid";
import { AreaClosed, Bar, Line } from "@visx/shape";
import { scaleLinear, scaleTime } from "@visx/scale";
import { curveMonotoneX } from "@visx/curve";
import {
  useTooltip,
  Tooltip,
  TooltipWithBounds,
  defaultStyles,
} from "@visx/tooltip";
import CircularProgress from "@material-ui/core/CircularProgress";
import { localPoint } from "@visx/event";
import { bisector } from "d3-array";
import _ from "lodash";
import { useParams } from "react-router-dom";
import { GraphProps, Value, Params } from "../interfaces";

import { loader } from "graphql.macro";
import { useQuery } from "@apollo/client";
const GET_TIME_SERIES = loader("../graphql/getTimeSeries.gql");

const useStyles = makeStyles({
  root: {
    height: "100%",
    width: "100%",
    position: "relative",
  },
  loadingContainer: {
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

const background = "#3b6978";
const background2 = "#204051";
const accentColor = "#edffea";
const accentColorDark = "#75daad";
const tooltipStyles = {
  ...defaultStyles,
  background,
  border: "1px solid white",
  color: "white",
};

const getDate = (v: Value) => new Date(parseInt(v?.time));
const getValue = (v: Value) => parseInt(v?.close?.toFixed(2));
const bisectDate = bisector<Value, Date>(
  (v) => new Date(parseInt(v?.time))
).left;

export function Graph({ width, height }: GraphProps) {
  const classes = useStyles();
  const { symbol = "BTC" }: Params = useParams();
  // loading
  const { data: { getTimeSeries: { values = [] } = {} } = {}, loading } =
    useQuery(GET_TIME_SERIES, {
      variables: {
        asset: symbol,
      },
    });

  const {
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
  } = useTooltip();

  const atClose = useMemo(
    () => values?.map((v: Value) => v?.close?.toFixed(2)),
    [values]
  );

  const dates = useMemo(
    () => values?.map((v: Value) => new Date(parseInt(v?.time))),
    [values]
  );

  const valueScale = useMemo(
    () =>
      scaleLinear({
        range: [height, 0], // svg-coordinates, svg-coordinates increase left to right
        domain: [0, Math.max(...atClose) * 1.3], // x-coordinate data-values
        nice: true,
      }),
    [height, atClose]
  );

  const dateScale = useMemo(
    () =>
      scaleTime({
        range: [0, width],
        domain: [_.min(dates), _.max(dates)] as [Date, Date],
      }),
    [dates, width]
  );

  // think about what this actually does
  const handleTooltip = useCallback(
    (
      event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>
    ) => {
      const { x } = localPoint(event) || { x: 0 };
      const x0 = dateScale.invert(x);
      const index = bisectDate(values, x0, 1);
      const d0 = values[index - 1];
      const d1 = values[index];
      let d = d0;
      if (d1 && getDate(d1)) {
        d =
          x0.valueOf() - getDate(d0).valueOf() >
          getDate(d1).valueOf() - x0.valueOf()
            ? d1
            : d0;
      }

      showTooltip({
        tooltipData: d,
        tooltipLeft: x,
        tooltipTop: valueScale(getValue(d)),
      });
    },
    [dateScale, showTooltip, valueScale, values]
  );

  if (loading) {
    return (
      <div className={classes.loadingContainer}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <svg className={classes.root}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="url(#area-background-gradient)"
          rx={14}
        />
        <LinearGradient
          id="area-background-gradient"
          from={background}
          to={background2}
        />
        <LinearGradient
          id="area-gradient"
          from={accentColor}
          to={accentColor}
          toOpacity={0.1}
        />
        <GridRows
          left={0}
          scale={valueScale}
          width={width}
          strokeDasharray="1,3"
          stroke={accentColor}
          strokeOpacity={0}
          pointerEvents="none"
        />
        <GridColumns
          top={0}
          scale={dateScale}
          height={height}
          strokeDasharray="1,3"
          stroke={accentColor}
          strokeOpacity={0.2}
          pointerEvents="none"
        />
        <AreaClosed
          data={[...values]}
          x={(v: Value) => dateScale(getDate(v))}
          y={(v: Value) => valueScale(getValue(v))}
          yScale={valueScale}
          strokeWidth={1}
          stroke="url(#area-gradient)"
          fill="url(#area-gradient)"
          curve={curveMonotoneX}
        />
        <Bar
          x={0}
          y={0}
          width={width}
          height={height}
          fill="transparent"
          rx={14}
          onTouchStart={handleTooltip}
          onTouchMove={handleTooltip}
          onMouseMove={handleTooltip}
          onMouseLeave={() => hideTooltip()}
        />
        {tooltipData && (
          <g>
            <Line
              from={{ x: tooltipLeft, y: 0 }}
              to={{ x: tooltipLeft, y: height }}
              stroke={accentColorDark}
              strokeWidth={2}
              pointerEvents="none"
              strokeDasharray="5,2"
            />
            <circle
              cx={tooltipLeft}
              cy={tooltipTop + 1}
              r={4}
              fill="black"
              fillOpacity={0.1}
              stroke="black"
              strokeOpacity={0.1}
              strokeWidth={2}
              pointerEvents="none"
            />
            <circle
              cx={tooltipLeft}
              cy={tooltipTop}
              r={4}
              fill={accentColorDark}
              stroke="white"
              strokeWidth={2}
              pointerEvents="none"
            />
          </g>
        )}
      </svg>
      {tooltipData && (
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
          }}
        >
          <TooltipWithBounds
            key={Math.random()}
            top={tooltipTop - 12}
            left={tooltipLeft + 12}
            style={tooltipStyles}
          >
            {`$${getValue(tooltipData as Value)}`}
          </TooltipWithBounds>
          <Tooltip
            top={height - 12}
            left={tooltipLeft}
            style={{
              ...defaultStyles,
              minWidth: 72,
              textAlign: "center",
              transform: "translateX(-55%)",
            }}
          >
            {getDate(tooltipData as Value).toLocaleDateString()}
          </Tooltip>
        </div>
      )}
    </div>
  );
}
