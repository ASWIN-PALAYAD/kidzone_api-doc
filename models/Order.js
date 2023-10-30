import mongoose from "mongoose";
const Schema = mongoose.Schema;

//generate random numbers for order
const randomTxt = Math.random().toString(36).substring(7).toUpperCase();;
const randomNumber = Math.floor(1000 + Math.random()*9000);

const OrderSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required : true,
    },
    orderItems:[
        {
            type:Object,
            required:true,
        }
    ],
    shippingAddress:{
        type:Object,
        required:true
    },
    orderNumber:{
        type:String,
        default:randomTxt + randomNumber,
    },
    //for stripe payment
    paymentStatus:{
        type:String,
        default:"Not paid",
    },
    paymentMethode:{
        type:String,
        default:"Not Specified"
    },
    totalPrice:{
        type:Number,
        default:0.0
    },
    currency:{
        type:String,
        default:"Not specified"
    },
    //for admin
    status:{
        type:String,
        default:"pending",
        enum:['pending','processing','shipped','delivered'],
    },
    deliveredAt:{
        type:Date,
    }

},{timestamps:true})  


const Order = mongoose.model("Order",OrderSchema);

export default Order;