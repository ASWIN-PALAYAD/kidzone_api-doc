import asyncHandler from 'express-async-handler';
import Color from '../models/Color.js';

//@desc    create new Color
//@route   POST /api/v1/color
//@access  private/admin

export const createColorCtrl = asyncHandler(async(req,res)=>{
    const {name} = req.body
    console.log(req.body);
    
    const colorFound = await Color.findOne({name});
    if(colorFound){
        throw new Error("Color already exist ");
    }

    const color = await Color.create({
        name : name?.toLowerCase(),
        user: req.userAuthId
    });

    res.json({
        status :"success",
        message :"Color created successfully",
        color,
    })
})

//@desc    get all Color
//@route   GET /api/v1/color
//@access  private/admin

export const getAllColorsCtrl = asyncHandler(async(req,res)=>{
    const colors = await Color.find();

    res.json({
        status:'succcess',
        message : "colors fetched successfully",
        colors,
    });
});

//@desc    get singl color
//@route   GET /api/v1/color/:id
//@access  private/admin

export const getSingleColorCtrl = asyncHandler(async(req,res)=>{
    const color= await Color.findById(req.params.id);

    res.json({
        status:'succcess',
        message : "Color fetched successfully",
        color,
    });
});

//@desc    update color
//@route   PUT /api/v1/color/:id
//@access  private/admin

export const updateColorCtrl = asyncHandler(async(req,res)=>{
    const {name} = req.body;

    const color = await Color.findByIdAndUpdate(
        req.params.id,
        {
            name,
        },
        {
            new:true
        }
    );
    
    res.json({
        status:"success",
        messsage:'Color updated successfully',
        color,
    });
});

//@desc    delete color
//@route   DELETE /api/v1/color/:id
//@access  private/admin

export const deleteColorCtrl = asyncHandler(async(req,res)=>{
    await Color.findByIdAndDelete(req.params.id);
    res.json({
        status:"success",
        message:"Color deleted successfully"
    })
})

