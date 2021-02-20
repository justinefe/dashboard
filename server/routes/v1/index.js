import express from 'express';
import 'express-async-errors';
import user from './user';
import oauth from '../oauth';

const router = express.Router();

router.use('/user', user);
router.use('/oauth', oauth);

export default router;
