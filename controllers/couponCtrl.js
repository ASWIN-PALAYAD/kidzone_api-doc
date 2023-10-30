import Coupon from "../models/Coupon.js";
import asyncHandler from "express-async-handler";

// @desc      create new coupon
//@route      POST /api/coupons
//@route     private/admin

export const createCouponCtrl = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;
  //check if admin

  const couponExist = await Coupon.findOne({ code });
  if (couponExist) {
    throw new Error("Coupon already exist");
  }
  //check is discount value is number
  if (isNaN(discount)) {
    throw new Error("Discount Value must be a number");
  }

  const coupon = await Coupon.create({
    code: code?.toUpperCase(),
    startDate,
    endDate,
    discount,
    user: req.userAuthId,
  });
  res.status(200).json({
    status: "success",
    message: "Coupon created successfully",
    coupon,
  });
});

// @desc      get all coupons
//@route      GET /api/coupons
//@route     private/admin

export const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find();
  res.status(200).json({
    staus: "success",
    message: "all coupons",
    coupons,
  });
});

// @desc      get single coupons
//@route      GET /api/coupons/:id
//@route     private/admin

export const getSingleCouponCtrl = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findOne({code:req.query.code});
   // check not found
  if(coupon === null){
    throw new Error("Coupon not found");
  }
   //check if expired
  if(coupon?.isExpired){
    throw new Error("Coupon expired");
  }
  res.json({
    status: "success",
    message: "coupon fetched",
    coupon,
  });
});

export const updateCouponCtrl = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, {
    code: code?.toUpperCase(),
    discount,
    startDate,
    endDate,
  },{new:true});
  res.json({
    status:"success",
    message:"Coupon updated successfully",
    coupon
  })
});

export const deleteCouponCtrl = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    res.json({
        status:"success",
        message:"Coupon deleted successfully"
    })
});
