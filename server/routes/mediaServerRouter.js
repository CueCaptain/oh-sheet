import express from 'express';

import { 
    generateStreamKey,
} from '../controllers/mediaServerController.js';

export const router = express.Router();
router.post('/generate_stream_key', generateStreamKey);
