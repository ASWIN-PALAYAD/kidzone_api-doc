import asyncHandler from 'express-async-handler';
import Brand from '../models/Brand.js';


//@desc    create new Brand
//@route   POST /api/v1/brands
//@access  private/admin

export const createBrandCtrl = asyncHandler(async(req,res)=>{
    const {name} = req.body
    
    const brandFound = await Brand.findOne({name});
    if(brandFound){
        throw new Error("Brand already exist ");
    }

    const brand = await Brand.create({
        name : name.toLowerCase(),
        user: req.userAuthId
    });

    res.json({
        status :"success",
        message :"Brand created successfully",
        brand,
    })
})

//@desc    get all brand
//@route   GET /api/v1/brands
//@access  private/admin

export const getAllBrandsCtrl = asyncHandler(async(req,res)=>{
    const brands = await Brand.find();

    res.json({
        status:'succcess',
        message : "categories fetched successfully",
        brands,
    });
});

//@desc    get single brand
//@route   GET /api/v1/brand/:id
//@access  private/admin

export const getSingleBrandCtrl = asyncHandler(async(req,res)=>{
    const brand= await Brand.findById(req.params.id);

    res.json({
        status:'succcess',
        message : "category fetched successfully",
        brand,
    });
});

//@desc    update brand
//@route   PUT /api/v1/brands/:id
//@access  private/admin

export const updateBrandCtrl = asyncHandler(async(req,res)=>{
    const {name} = req.body;

    const brand = await Brand.findByIdAndUpdate(
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
        messsage:'Product updated successfully',
        brand,
    });
});

//@desc    delete brand
//@route   DELETE /api/v1/brands/:id
//@access  private/admin

export const deleteBrandCtrl = asyncHandler(async(req,res)=>{
    await Brand.findByIdAndDelete(req.params.id);
    res.json({
        status:"success",
        message:"Brand deleted successfully"
    })
})

