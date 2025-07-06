import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const SHEET_ID = '1_kdzz44E2w4AV5Sr2i00XTpRtQ9jDlzdml8Bg5hOvnM';
const SHEET_NAME = 'IG_ADS';

const app = express();
app.use(cors());
app.use(bodyParser.json());

function getServiceAccountCredentials() {
  try {
    const jsonString = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    if (!jsonString) throw new Error('Service account JSON not found in env');
    return JSON.parse(jsonString);
  } catch (err) {
    throw new Error('Invalid GOOGLE_SERVICE_ACCOUNT_JSON: ' + err.message);
  }
}

app.post('/api/submit-lead', async (req, res) => {
  try {
    const { fullName, email, phone, course, state } = req.body;
    if (!fullName || !email || !phone || !course || !state) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const credentials = getServiceAccountCredentials();
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A:E`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[fullName, email, phone, course, state]],
      },
    });

    res.status(200).json({ success: true, message: 'Lead submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API server running on port ${PORT}`)); 
