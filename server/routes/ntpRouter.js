import express from 'express';

import { 
    time,
} from '../controllers/ntpController.js';

export const router = express.Router();
router.get('/time', time);
