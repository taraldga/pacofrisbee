import * as React from 'react'
import { Chart } from "react-google-charts";


interface ThrowTypeGraphProps {
  aces: number;
  eagles: number;
  birdies: number;
  pars: number;
  bogeys: number;
  doubleBogeys: number;
}


export const ThrowTypeGraph: React.FC<ThrowTypeGraphProps> = ({
  aces,
  eagles,
  birdies,
  pars,
  bogeys,
  doubleBogeys
}) => {

  const data = [
    ["Score", "Number"],
    ["Aces", aces],
    ["Eagles", eagles],
    ["Birdies", birdies],
    ["Par", pars],
    ["Bogeys", bogeys],
    ["Double Bogeys", doubleBogeys]
  ]

  return (
    <div>
      <Chart
          chartType="BarChart"
          data={data}
          width="100%"
          height="400px"
          legendToggle
        />
    </div>
  )
}