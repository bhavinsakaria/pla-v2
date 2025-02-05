import fetch from 'node-fetch';
import crypto from 'crypto';
import zlib from 'zlib';
import dotenv from 'dotenv';
import { loadJsonToMySQL } from './json_to_sql';

interface Payload {
  CompanyCode: string;
  MargID: string;
  Datetime: string;
  index: number;
}

export async function ApiMasterData(db_name: string, data_time?: string): Promise<string> {
  dotenv.config();
  const url = process.env.MST_API_URL;
  const key = process.env.MST_API_KEY;
  
  const payload: Payload = {
    CompanyCode: process.env.MST_COMPANY_CODE,
    MargID: process.env.MST_MARG_ID,
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
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseText = await response.text();

    // Step 2: Decrypt the response
    const decipher = crypto.createDecipheriv(
      'aes-128-cbc',
      Buffer.from(fixedKey),
      iv
    );

    let decrypted = decipher.update(
      Buffer.from(responseText, 'base64'),
      'binary',
      'utf8'
    );
    decrypted += decipher.final('utf8'); // Finalize decryption

    // Step 3: Decode second base64 and decompress
    const decoded = Buffer.from(decrypted, 'base64');
    const inflatedBuffer = zlib.inflateRawSync(decoded);
    const data = inflatedBuffer.toString('utf8').substring(1);

    // Decide whether to truncate tables or not based on the presence of data_time
    if (data_time === undefined) {
      await loadJsonToMySQL(data, db_name, "master", true);
    } else {
      await loadJsonToMySQL(data, db_name, "master", false);
    }

    return 'Master Data loaded successfully';
  } catch (error) {
    return `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
}
