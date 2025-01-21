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
  const [connected, setConnected] = useState<boolean>(false); // State for connection status

  const connectToSerialPort = async () => {
    try {
      const port = await navigator.serial.requestPort(); // Request the user to select a serial port
      await port.open({ baudRate: 9600 }); // Open the selected port with a baud rate of 9600

      setConnected(true);
      setSerialData("Connected to Serial Port");

      const decoder = new TextDecoderStream(); // Create a decoder
      port.readable.pipeTo(decoder.writable); // Pipe data from the port to the decoder
      const reader = decoder.readable.getReader(); // Create a reader to read data

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          setConnected(false);
          setSerialData("Disconnected from Serial Port");
          break;
        }
        setSerialData(value || ""); // Update the state with incoming data
      }
    } catch (err: any) {
      console.error("Error:", err);
      setSerialData(err.message || "An error occurred");
    }
  };

  return {
    connectToSerialPort,
    serialData,
    connected,
  };
};

export default useSerialPort;
