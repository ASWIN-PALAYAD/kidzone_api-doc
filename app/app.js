import dotenv  from "dotenv";
import cors from 'cors';
dotenv.config();
import Stripe from "stripe";
import express from "express";
import path, { join } from 'path';
import dbConnect from "../config/dbConnect.js";   
import { globalErrHandler, notFound } from "../middlewares/globalErrorHandler.js";
import userRoutes from "../routes/usersRoute.js";
import productRouter from "../routes/productRout.js";
import categoriesRouter from '../routes/categoriesRouter.js';
import brandsRouter from "../routes/brandsRouter.js";
import colorRouter from "../routes/colorRouter.js";
import reviewRouter from "../routes/reviewRouter.js";
import orderRouter from "../routes/orderRouter.js";
import Order from "../models/Order.js";
import couponRouter from "../routes/couponRouter.js";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory of the current module
const __dirname = dirname(fileURLToPath(import.meta.url));



//dbConnect
dbConnect()
const app = express();

//cors
// app.use(cors())
app.use(cors({
  origin: 'https://kidzone.vercel.app',
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true
}));

//stripe webhook
const stripe = new Stripe(process.env.STRIPE_KEY);

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_67605d5c4ca28881931eaedc5235b0137265a8a3ea8f29f69211767158fbd76f";

app.post('/webhook', express.raw({type: 'application/json'}), async(request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if(event.type === 'checkout.session.completed'){
    //update order
    const session = event.data.object
    const {orderId} = session.metadata;
    const paymentStatus = session.payment_status;
    const paymentMethode = session.payment_method_types[0] 
    const totalAmount = session.amount_total;
    const currency = session.currency;
    //find order using order id
    const order = await Order.findByIdAndUpdate(
        JSON.parse(orderId),{
        totalPrice:totalAmount/100,
        currency,
        paymentMethode,
        paymentStatus,
    },{new:true}); 
    console.log(order); 
  }else{
    return 
  }

  // Handle the event
//   switch (event.type) {
//     case 'payment_intent.succeeded':
//       const paymentIntentSucceeded = event.data.object;
//       // Then define and call a function to handle the event payment_intent.succeeded
//       break;
//     // ... handle other event types
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});



app.use(express.json());
app.use(express.urlencoded({extended:true}));

//serve static files
app.use(express.static('public'));


// Home route
// app.use('/',(req,res)=>{
//   console.log('my routess');
// res.send('welcome')
// })

//Home route
app.use('/',(req,res)=>{ 
  // res.sendFile(path,join('public','index.html'))
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

//routes
app.use('/api/v1/users',userRoutes);
app.use('/api/v1/products',productRouter);
app.use('/api/v1/categories',categoriesRouter);  
app.use('/api/v1/brands',brandsRouter);
app.use('/api/v1/colors', colorRouter);
app.use('/api/v1/reviews',reviewRouter);
app.use('/api/v1/orders',orderRouter);
app.use('/api/v1/coupons',couponRouter);   



//err midleware
app.use(notFound); 
app.use(globalErrHandler); 
 

export default app; 