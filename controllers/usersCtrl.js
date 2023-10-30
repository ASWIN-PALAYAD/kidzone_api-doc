import User from "../models/User.js";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";


//user registration

export const registerUserCtrl = asyncHandler(
    async (req, res) => {
        const { fullname, email, password } = req.body;
      
        const userExist = await User.findOne({ email });
        if (userExist) {
          throw new Error("user already exist")
        }
      
        //hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
      
        const user = await User.create({
          fullname,
          email,
          password: hashedPassword,
        });
      
        res.status(201).json({
          status: "success",
          message: "User created successfully",
          data: user,
        });
      }
)


//user login

export const loginUserCtrl = asyncHandler(
    async (req,res) => {
        const {email,password} = req.body;
    
        const userFound = await User.findOne({email});
        if(userFound && (await bcrypt.compare(password, userFound?.password))){
            res.json({
                status : "success",
                msg : 'User logged Successfully',  
                userFound:{
                    fullname:userFound?.fullname,
                    isAdmin:userFound?.isAdmin,
                },
                token : generateToken(userFound._id)
            })
        }else{
            throw new Error("Invalid login credentials")
        } 
    }
)



// @desc    Get User Profile
// @route   GET /api/v1/users/profile
// @access  Private

export const getUserProfileCtrl = asyncHandler(async(req,res)=> {
   
    const user = await User.findById(req.userAuthId).populate("orders");
    res.json({
        status:"success",
        message:"User profile fetched successfully",
        user,
    })
   
})

//get all users
export const getAllUsersCtrl = asyncHandler(async(req,res)=>{
    const users = await User.find();
    res.json({
        status:'success',
        message:"fetched all users",
        users
    })
})

//@desc      update user shipping address
//@route     PUT /api/v1/users/update/shipping
//@access    private 

export const updateShippingAddress = asyncHandler(async(req,res)=>{
    const {firstName,lastName,address,city,postalCode,province,country,phone} = req.body;

    const user = await User.findByIdAndUpdate(req.userAuthId,{
        shippingAddress:{
            firstName,lastName,address,city,postalCode,province,country,phone
        },
        hasShippingAddress: true,
    
    },{
        new:true,
    });

    res.json({
        staus:"success",
        message:'User shipping address updated successfully',
        user,
    })

})