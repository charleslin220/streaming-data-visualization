import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useTradeData } from '../context/TradeDataContext';

// Interface for trade data structure
interface TradeData {
  price: number;
  size: number;
  side: 'buy' | 'sell';
  timestamp: string;
}

const ChartComponent: React.FC = () => {
  // Fetching trade data and high/low values from context
  const { tradeData, highLowValues } = useTradeData();

  // State to store chart options
  const [options, setOptions] = useState<Highcharts.Options>({
    /* initial options */
  });

  // Effect hook to update chart options whenever trade data changes
  useEffect(() => {
    const oneMinuteAgo = Date.now() - 60000; // Calculate time one minute ago

    // Setting up chart options
    setOptions({
      title: {
        text: 'Trade Data',
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Timestamp',
        },
        accessibility: {
          description: 'Time',
        },
        min: oneMinuteAgo, // Set xAxis to start from one minute ago
      },
      yAxis: [
        {
          title: {
            text: 'Price',
          },
        },
        {
          title: {
            text: 'Size',
          },
          opposite: true,
        },
      ],
      tooltip: {
        shared: true, // Enable shared tooltip for multiple series
      },
      plotOptions: {
        series: {
          marker: {
            enabled: true,
            radius: 4,
            states: {
              hover: {
                enabled: true,
                radius: 6,
              },
            },
          },
          stickyTracking: false,
        },
      },
      series: [
        {
          name: 'Buy Price',
          type: 'line',
          zIndex: 2,
          data: tradeData
            .filter((d) => d.side === 'buy')
            .map((d) => [Date.parse(d.timestamp), d.price]),
        },
        {
          name: 'Sell Price',
          type: 'line',
          zIndex: 2,
          data: tradeData
            .filter((d) => d.side === 'sell')
            .map((d) => [Date.parse(d.timestamp), d.price]),
        },
        {
          name: 'Trade Size',
          type: 'line',
          yAxis: 1,
          zIndex: 1, // Lower zIndex
          dashStyle: 'ShortDashDot',
          data: tradeData.map((d) => [Date.parse(d.timestamp), d.size]),
        },
      ],
    });
  }, [tradeData]); // Depend on tradeData for updates

  // Render the Highcharts React component with the defined options
  // and a stats table displaying high and low values
  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
      <table className="stats-table">
        <tbody>
          <tr>
            <td>
              <b>Highest Buy Price:</b>
            </td>
            <td>{highLowValues.highestBuyPrice}</td>
          </tr>
          <tr>
            <td>
              <b>Lowest Buy Price:</b>
            </td>
            <td>{highLowValues.lowestBuyPrice}</td>
          </tr>
          <tr>
            <td>
              <b>Highest Sell Price:</b>
            </td>
            <td>{highLowValues.highestSellPrice}</td>
          </tr>
          <tr>
            <td>
              <b>Lowest Sell Price:</b>
            </td>
            <td>{highLowValues.lowestSellPrice}</td>
          </tr>
          <tr>
            <td>
              <b>Highest Trade Size:</b>
            </td>
            <td>{highLowValues.highestSize}</td>
          </tr>
          <tr>
            <td>
              <b>Lowest Trade Size:</b>
            </td>
            <td>{highLowValues.lowestSize}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ChartComponent;
