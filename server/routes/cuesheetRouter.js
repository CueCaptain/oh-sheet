import express from 'express';

import { 
    postGoogleSheet,
    getSheetNamesFromGoogleSheets,
} from '../controllers/cuesheetController.js';

export const router = express.Router();
router.get('/get_sheet_names_from_google_sheets', getSheetNamesFromGoogleSheets);
router.post('/google_sheet', postGoogleSheet);