import React, { useEffect, useState } from 'react';
import { useTradeData } from '../context/TradeDataContext'; // Adjust the path as needed

// Interface to define the structure of trade data
interface TradeData {
  price: number;
  size: number;
  side: 'buy' | 'sell';
  timestamp: string;
}

const WebSocketComponent: React.FC = () => {
  // Using context to update trade data across the app
  const { updateTradeData } = useTradeData();

  // State to manage the WebSocket connection
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Creating a new WebSocket connection
    const ws = new WebSocket(
      'wss://www.bitmex.com/realtime?subscribe=trade:XBTUSD,liquidation:XBTUSD'
    );

    // Event handler for WebSocket connection opening
    ws.onopen = () => {
      console.log('WebSocket Connected');
      setWebSocket(ws);
    };

    // Event handler for receiving messages through WebSocket
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      // Check if the message contains trade data and then process it
      if (message.table === 'trade' && message.action === 'insert') {
        message.data.forEach((trade) => {
          const tradeData: TradeData = {
            price: trade.price,
            size: trade.size,
            side: trade.side.toLowerCase() as 'buy' | 'sell',
            timestamp: trade.timestamp,
          };
          updateTradeData(tradeData); // Use context method to update data
        });
      }
    };

    // Event handler for WebSocket errors
    ws.onerror = (event) => {
      console.error('WebSocket Error:', event);
    };

    // Event handler for WebSocket connection closing
    ws.onclose = () => {
      console.log('WebSocket Disconnected');
      setWebSocket(null); // Resetting WebSocket state to null
    };

    // Cleanup function to close WebSocket when the component unmounts
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [updateTradeData]); // Dependency on updateTradeData to ensure consistent updates

  // Rendering the WebSocket connection status
  return (
    <div
      className={`websocket-status ${
        webSocket && webSocket.readyState === WebSocket.OPEN
          ? 'connected'
          : 'disconnected'
      }`}
    >
      WebSocket Status:{' '}
      {webSocket && webSocket.readyState === WebSocket.OPEN
        ? 'Connected'
        : 'Disconnected'}
    </div>
  );
};

export default WebSocketComponent;
