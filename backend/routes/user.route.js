import express from 'express';
import { getPublishedCreation, getUserCreation } from '../controllers/user.controller.js';
import {auth} from '../middlewares/auth.js';

const userRouter = express.Router();
userRouter.get('/get-user-creation', auth, getUserCreation);
userRouter.get('/get-published-creation', auth, getPublishedCreation);


export default userRouter
