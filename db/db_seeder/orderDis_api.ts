import fetch from 'node-fetch';
import crypto from 'crypto';
import zlib from 'zlib';
import { loadJsonToMySQL } from './json_to_sql';

interface Payload {
  CompanyCode: string;
  MargID: string;
  SalesmanID: string;
  Type: string;
  Datetime: string;
  index: number;
}

interface OrderInfo {
  // Define the structure of the OrderInfo object if you need specific fields
}

interface ApiResponse {
  Details: {
    OrderInfo: OrderInfo[];
  };
}

export async function ApiOrderDispatch(db_name: string, data_time?: string): Promise<string> {
  const url = "https://wservices.margcompusoft.com/api/eOnlineData/LiveOrderDispatchStatus2017";
  const key = "G6A51WZLPUTF";

  const payload: Payload = {
    CompanyCode: "PHARMALINKS2",
    MargID: "299157",
    SalesmanID: "VIJAYA",
    Type: "S",
    Datetime: data_time || "",
    index: 0,
  };

  // Ensure the key is 16 bytes
  const fixedKey = key.padEnd(16, '\0');
  const iv = Buffer.from(fixedKey, 'utf8');

  try {
    // Step 1: Make the HTTP request
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.log(`HTTP error! Status: ${response.status}`);
      return `HTTP error! Status: ${response.status}`;
    }

    const responseText = await response.text();

    // Step 2: Decrypt the response
    const decipher = crypto.createDecipheriv('aes-128-cbc', Buffer.from(fixedKey), iv);

    let decrypted = decipher.update(Buffer.from(responseText, 'base64'), undefined, 'utf8');
   
    try {
      decrypted += decipher.final('utf8'); // Finalize decryption
    } catch (error) {
      // If decryption fails, try decompressing directly
      const decoded = Buffer.from(responseText, 'base64');
      const inflatedBuffer = zlib.inflateRawSync(decoded);
      const data = inflatedBuffer.toString('utf8').substring(1);
      console.log(data);
      return `Error decrypting response: ${error instanceof Error ? error.message : String(error)}`;
    }

    // Step 3: Decode second base64 and decompress
    const decoded = Buffer.from(decrypted, 'base64');
    const inflatedBuffer = zlib.inflateRawSync(decoded);
    const data = inflatedBuffer.toString('utf8').substring(1);

    // Parse JSON data
    const dataJson: ApiResponse = JSON.parse(data);
    const { OrderInfo } = dataJson.Details;
    console.log(OrderInfo);

    // Save JSON data (uncomment if you need to save it)
    // if (data_time === undefined){
    //   await loadJsonToMySQL(data, db_name, "orderDis", true);
    // } else {
    //   await loadJsonToMySQL(data, db_name, "orderDis", false);
    // }

    return 'Order Dispatch Data loaded successfully';
  } catch (error) {
    console.error('Error occurred:', error);
    return `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
}
