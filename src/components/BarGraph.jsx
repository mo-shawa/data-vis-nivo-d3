import React from 'react'
import { ResponsiveBar } from '@nivo/bar';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.error(error)
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}


export const BarGraph = (props) => {

  return (
    <div className="graph-container">
      <ErrorBoundary>
        <ResponsiveBar
          data={props.data}
          keys={props.keys}
          indexBy='email'
          margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
          padding={0.3}
        />
      </ErrorBoundary>
    </div>
  )
}
