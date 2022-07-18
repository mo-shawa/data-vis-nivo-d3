import React from 'react'
import { ResponsiveBar } from '@nivo/bar';


export const BarGraph = (props) => {

  return (
    <div className="graph-container">
      <ResponsiveBar
        data={props.data}
        keys={props.keys}
        indexBy='email'
        margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
        padding={0.3}

      />
    </div>
  )
}
