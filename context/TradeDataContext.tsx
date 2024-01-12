import React, { createContext, useState, useContext, useCallback } from 'react';

// Creating the context for trade data
const TradeDataContext = createContext(null);

export const TradeDataProvider = ({ children }) => {
  const [tradeData, setTradeData] = useState([]); // State for storing trade data

  // State for storing high and low values of different metrics
  const [highLowValues, setHighLowValues] = useState({
    highestBuyPrice: 0,
    lowestBuyPrice: Infinity,
    highestSellPrice: 0,
    lowestSellPrice: Infinity,
    highestSize: 0,
    lowestSize: Infinity,
  });

  // Function to update the trade data and high/low values
  const updateTradeData = useCallback((newData) => {
    setTradeData((currentData) => {
      const currentTime = new Date().getTime();
      return [
        ...currentData.filter(
          (d) => currentTime - new Date(d.timestamp).getTime() <= 60000
        ),
        newData,
      ];
    });

    // Updating high and low values based on the new data
    setHighLowValues((currentValues) => {
      let updatedValues = { ...currentValues };
      if (newData.side === 'buy') {
        updatedValues.highestBuyPrice = Math.max(
          updatedValues.highestBuyPrice,
          newData.price
        );
        updatedValues.lowestBuyPrice = Math.min(
          updatedValues.lowestBuyPrice,
          newData.price
        );
      } else if (newData.side === 'sell') {
        updatedValues.highestSellPrice = Math.max(
          updatedValues.highestSellPrice,
          newData.price
        );
        updatedValues.lowestSellPrice = Math.min(
          updatedValues.lowestSellPrice,
          newData.price
        );
      }
      // Updating sell prices
      updatedValues.highestSize = Math.max(
        updatedValues.highestSize,
        newData.size
      );
      updatedValues.lowestSize = Math.min(
        updatedValues.lowestSize,
        newData.size
      );

      return updatedValues;
    });
  }, []);

  // Providing the trade data and high/low values through context
  return (
    <TradeDataContext.Provider
      value={{ tradeData, updateTradeData, highLowValues }}
    >
      {children}
    </TradeDataContext.Provider>
  );
};

// Custom hook for accessing trade data context
export const useTradeData = () => useContext(TradeDataContext);
