import express from 'express';

const healthcheck = async (req, res) => {
  res.status(200).send("Oh Sheet! - Dw the server's running!");
};

export const router = express.Router();
router.get('/', healthcheck);
router.get('/healthcheck', healthcheck);
