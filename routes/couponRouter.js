import express from 'express';
import { createCouponCtrl, deleteCouponCtrl, getAllCoupons, getSingleCouponCtrl, updateCouponCtrl } from '../controllers/couponCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import isAdmin from '../middlewares/isAdmin.js';


const couponRouter = express.Router();

couponRouter.post('/',isLoggedIn,isAdmin,createCouponCtrl);
couponRouter.get('/',getAllCoupons);
couponRouter.get('/single?',getSingleCouponCtrl)
couponRouter.put('/update/:id',isLoggedIn,isAdmin,updateCouponCtrl);
couponRouter.delete('/delete/:id',isLoggedIn,isAdmin,deleteCouponCtrl)


export default couponRouter;