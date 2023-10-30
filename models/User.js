import mongoose from "mongoose";
import { boolean } from "webidl-conversions";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    fullname: {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    orders : [
        {
            type : mongoose.Schema.ObjectId,
            ref : "Order"
        }
    ],
    wishLists : [{
        type : mongoose.Schema.ObjectId,
        ref : "WishList"
    }],
    isAdmin : {
        type : Boolean,
        default : false
    },
    hasShippingAddress : {
        type: Boolean,
        default : false
    },
    shippingAddress : {
        firstName :{
            type : String,
            // required: true
        },
        lastName :{
            type : String,
            // required: true
        },
        address :{
            type : String,
            // required: true
        },
        city :{
            type : String,
            // required: true
        },
        postalCode :{
            type : String,
            // required: true
        },
        province :{
            type : String,
            // required: true
        },
        country :{
            type : String,
            // required: true
        },
        phone :{
            type : String,
            // required: true
        },
    }
}, {
    timestamps: true
});

//compile user schema to model in mongodb

const User  = mongoose.model('User',UserSchema);

export default User;