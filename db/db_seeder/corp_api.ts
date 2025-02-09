import fetch from 'node-fetch';
import crypto from 'crypto';
import zlib from 'zlib';
import dotenv from 'dotenv';
import { loadJsonToMySQL } from './json_to_sql';

interface ApiPayload {
  CompanyCode?: string;
  Datetime: string;
  MargKey?: string;
  Index: string;
  CompanyID?: string;
  APIType: string;
}

export async function ApiCroprateData(db_name: string, data_time?: string): Promise<string> {
  dotenv.config();

  const url = process.env.CORP_API_URL;
  const key = process.env.CORP_API_KEY;

  if (!url || !key) {
    throw new Error('CORP_API_URL environment variable is not set');
  }
  
  const payload: ApiPayload = {
    CompanyCode: process.env.CORP_COMPANY_CODE,
    MargKey: process.env.CORP_MARG_KEY,
    CompanyID: process.env.CORP_COMPANY_ID,
    Datetime: data_time || "",
    Index: "0",
    APIType: "1"
  };

  // Ensure the key is 16 bytes
  const fixedKey: string = key.padEnd(16, '\0');
  const iv: Buffer = Buffer.from(fixedKey, 'utf8');

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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseText = await response.text();

    // Step 2: Decrypt the response
    const decipher = crypto.createDecipheriv('aes-128-cbc', Buffer.from(fixedKey), iv);

    let decrypted = decipher.update(Buffer.from(responseText, 'base64'), undefined, 'utf8');
    decrypted += decipher.final('utf8'); // Finalize the decryption
 

    // Step 3: Decode second base64 and decompress
    const decoded: Buffer = Buffer.from(decrypted, 'base64');

    try {
      const inflatedBuffer = zlib.inflateRawSync(decoded);
      const data: string = inflatedBuffer.toString('utf8').substring(1);

      // Step 4: Insert into the database
      if (data_time === undefined) {
        await loadJsonToMySQL(data, db_name, "corp", true);
      } else {
        await loadJsonToMySQL(data, db_name, "corp", false);
      }

      return 'Corporate Data loaded successfully';
    } catch (inflateError) {
      throw new Error(`Error inflating data: ${inflateError}`);
    }
  } catch (error:any) {
    return `Error occurred: ${error.message}`;
  }
}
