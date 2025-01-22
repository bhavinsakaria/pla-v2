"use client";
import { useState } from "react";

interface SerialPort extends EventTarget {
  readable: ReadableStream<Uint8Array>;
  writable: WritableStream<Uint8Array>;
  open(options: { baudRate: number }): Promise<void>;
  close(): Promise<void>;
}

declare global {
  interface Navigator {
    serial: {
      requestPort(): Promise<SerialPort>;
    };
  }
}

const useSerialPort = () => {
  const [serialData, setSerialData] = useState<string>(""); // State to store incoming data
  const [connectionStatus, setConnectionStatus] = useState<string>("");
  const [connected, setConnected] = useState<boolean>(false); // State for connection status

  const connectToSerialPort = async () => {
    try {
      const port = await navigator.serial.requestPort(); // Request user to select a serial port
      console.log(port);
      await port.open({ baudRate: 9600 }); // Open the selected port with a baud rate of 9600
      setConnected(true);
      setConnectionStatus("Connected to Serial Port");

      const textDecoder = new TextDecoder(); // Text decoder for converting bytes to string
      const reader = port.readable.getReader(); // Get a reader for the readable stream

      let receivedData = ""; // Buffer to store the complete data

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            // End of stream
            setConnectionStatus("Disconnected from Serial Port");
            setConnected(false);
            break;
          }
          if (value) {
            receivedData += textDecoder.decode(value, { stream: true });
            //console.log(receivedData);
            // setSerialData(receivedData);
            if (receivedData.endsWith("\r")) {
              setSerialData(receivedData);
              receivedData = ""; // Clear the buffer
            }
          }
        }
      } catch (error) {
        console.error("Error while reading serial data:", error);
      } finally {
        reader.releaseLock(); // Release the lock on the reader
        await port.close(); // Close the port properly
        setConnected(false); // Update connection status
        setConnectionStatus("Disconnected from Serial Port");
      }
    } catch (err: any) {
      console.error("Error:", err);
      setConnectionStatus(err.message || "An error occurred while connecting");
    }
  };

  return {
    connectToSerialPort,
    connectionStatus,
    serialData,
    connected,
  };
};

export default useSerialPort;
