import * as React from 'react';
import { useState } from 'react';
import WebSocketComponent from './components/WebSocketConnect';
import ChartComponent from './components/Chart';
import { TradeDataProvider } from './context/TradeDataContext';
import './style.css';

const App = () => {
  const [showChart, setShowChart] = useState<boolean>(false); // State to control the visibility of the chart

  // Function to toggle the chart visibility
  const toggleChart = () => {
    setShowChart(!showChart);
  };

  return (
    // Wrapping the application in the TradeDataProvider context
    <TradeDataProvider>
      <div>
        <h1 className="header-title">Streaming Data Visualization</h1>
        <button className="toggle-chart-button" onClick={toggleChart}>
          {showChart ? 'Hide Chart' : 'Show Chart'}
        </button>
        <WebSocketComponent />
        {showChart && <ChartComponent />}
      </div>
    </TradeDataProvider>
  );
};

export default App;
