import Category from "../models/Category.js";
import asyncHandler from 'express-async-handler';

//@desc    create new category
//@route   POST /api/v1/categories
//@access  private/admin

export const createCategory = asyncHandler(async(req,res)=>{
    const {name} = req.body
    
    const categoryFound = await Category.findOne({name});
    if(categoryFound){
        throw new Error("Category already exist ");
    }

    const category = await Category.create({
        name : name?.toLowerCase(),
        user: req.userAuthId,
        image : req?.file?.path

    });

    res.json({
        status :"success",
        message :"Category created successfully",
        category
    })
})

//@desc    get all categories
//@route   GET /api/v1/categories
//@access  private/admin

export const getAllCategoriesCtrl = asyncHandler(async(req,res)=>{
    const categories = await Category.find();

    res.json({
        status:'succcess',
        message : "categories fetched successfully",
        categories
    });
});

//@desc    get single categories
//@route   GET /api/v1/categories
//@access  private/admin

export const getSingleCategoryCtrl = asyncHandler(async(req,res)=>{
    const category = await Category.findById(req.params.id);

    res.json({
        status:'succcess',
        message : "category fetched successfully",
        category
    });
});

//@desc    update categories
//@route   PUT /api/v1/categories
//@access  private/admin

export const updateCategoryCtrl = asyncHandler(async(req,res)=>{
    const {name} = req.body;

    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name,
        },
        {
            new:true
        }
    );
    if(!category){
        return "please check"
    }
    res.json({
        status:"success",
        messsage:'Product updated successfully',
        category
    });
});

//@desc    delete categories
//@route   DELETE /api/v1/categories
//@access  private/admin

export const deleteCategoryCtrl = asyncHandler(async(req,res)=>{
    const category = await Category.findByIdAndDelete(req.params.id);
    res.json({
        status:"success",
        message:"Category deleted successfully"
    })
})

