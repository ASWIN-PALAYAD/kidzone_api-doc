import asyncHandler from 'express-async-handler';
import dotenv from "dotenv";
dotenv.config();
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Stripe from "stripe";
import Coupon from '../models/Coupon.js';



const stripe = new Stripe(process.env.STRIPE_KEY);

//@desc      create orders
//@route    POST /api/v1/orders
//@acess    private
export const createOrderCtrl = asyncHandler(async(req,res)=> {

    //coupon is handled in frontend
    // const {coupon} = req?.query;
    // const couponFound = await Coupon.findOne({
    //     code:coupon?.toUpperCase(),
    // });
    // if(couponFound?.isExpired){
    //     throw new Error("Coupon has expired");
    // }
    // if(!couponFound){
    //     throw new Error("Coupon doesnot exist");
    // }

    //get discount
    // const discount = couponFound?.discount / 100;

    const {orderItems,shippingAddress,totalPrice} = req.body;
    const user = await User.findById(req.userAuthId); 

    //check user has shipping address
    if(!user?.hasShippingAddress){
        throw new Error("Please provide shipping address")
    }

    if(orderItems?.length <= 0){
        throw new Error("No items added")
    }
    const order = await Order.create({
        user:user?._id,
        orderItems,
        shippingAddress,
        // totalPrice:couponFound ? totalPrice - totalPrice*discount : totalPrice,
        totalPrice
    });

  
    //update the product qty
    const products = await Product.find({_id:{$in: orderItems}});
    
    orderItems?.map(async(order)=>{
        const product = products?.find((product)=>{
            return product?._id?.toString() === order?._id?.toString();
        });
        if(product){
            product.totalSold += order.qty; 
        }
        await product.save();
    })

    //push order to users
    user.orders.push(order?._id);
    await user.save();

    // =================make payment (stripe)=========================
    //conver order items to have same structure that stripe need
    const convertedOrders = orderItems.map((item)=>{
        return {
            price_data:{
                currency:"inr",
                product_data:{
                    name:item?.name,
                    description:item?.description,
                },
                unit_amount:item?.price*100
            },
            quantity:item?.qty
        }
    })

    const session = await stripe.checkout.sessions.create({
        line_items:convertedOrders,
        metadata:{
            orderId :JSON.stringify( order?._id)
        },
        mode:'payment',
        success_url:"https://kidzone.vercel.app/success",
        cancel_url:"https://kidzone.vercel.app/cancel"
    }); 
    res.send({url:session.url});   


    // res.json({
    //     success : true,
    //     message : "Order placed",
    //     order,
    //     user,
    // })
});

//@desc     get all orders
//@route    GET /api/v1/orders
//@acess    private

export const getAllOrderCtrl = asyncHandler(async(req,res)=>{
   //find all orders
   const orders = await Order.find();
   res.json({
    status:"success",
    message:"All orders",
    orders
   })
})


//@desc     get singel order
//@route    GET /api/v1/orders/:id
//@acess    private/admin

export const getSingleOrderCtrl = asyncHandler(async(req,res)=>{

    const id = req.params.id;
    const order = await Order.findById(id);
    res.status(200).json({
        success:true,
        message:"single order",
        order,
    });
})

//@desc     update order to deliverd
//@route    GET /api/v1/orders/update/:id
//@acess    private/admin

export const updateOrderCtrl = asyncHandler(async(req,res)=>{
    const id = req.params.id
    const updatedOrder = await Order.findByIdAndUpdate(id,{
        status:req.body.status
    },{new:true});

    res.status(200).json({
        success:true,
        message:"order updated",
        updatedOrder,
    })
});



//@desc      get sales sum of orders
//@route     GET /api/v1/orders/sales/sum
//@access    private/admin

export const getOrderStatsCtrl = asyncHandler(async(req,res)=>{
   

    //get order stats
    const orders = await Order.aggregate([
        {
            $group:{
                _id:null,
                minimumSale:{
                    $min:"$totalPrice"
                },
                totalPrice:{
                    $sum :'$totalPrice',
                },
                maximumSale:{
                    $max:"$totalPrice"
                },
                avgSale:{
                    $avg:"$totalPrice"
                }
            }
        }
    ])

    //get the date
    const date  = new Date();
    const today = new Date(date.getFullYear(),date.getMonth(),date.getDate());
    
    const salesToday = await Order.aggregate([
        {
            $match:{
                createdAt:{
                    $gte:today,
                }
            }
        },
        {
            $group:{
                _id:null,
                todayTotalSale:{
                    $sum:"$totalPrice"
                }
            }
        }
    ])
   

    res.status(200).json({
        success:true,
        message:"sum of orders",
       orders,
       salesToday
       
    })
});


//@desc      get sales sum of orders
//@route     GET /api/v1/orders/sales/sum
//@access    private/admin
