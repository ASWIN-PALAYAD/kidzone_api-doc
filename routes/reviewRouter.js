import express from 'express';
import { createReviewCntrl } from '../controllers/reviewCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const reviewRouter = express.Router();


reviewRouter.post('/:productId',isLoggedIn,createReviewCntrl)



export default reviewRouter;