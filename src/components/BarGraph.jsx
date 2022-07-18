import React from 'react'
import { ResponsiveBar } from '@nivo/bar';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: '' };
  }

  static getDerivedStateFromError(error) {
    console.log(error)
    return { hasError: true, errorInfo: error.message };
  }

  render() {
    if (this.state.hasError) {
      return <details>
        <summary className='error'>Something went wrong.</summary>
        {this.state.errorInfo}
      </details>;
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
