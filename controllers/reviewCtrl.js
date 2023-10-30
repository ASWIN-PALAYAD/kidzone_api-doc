import expressAsyncHandler from "express-async-handler";
import Review from "../models/Review.js";
import Product from "../models/Product.js";

//@desc      Create new review
//@route     POST /api/v1/reviews
//@access    private /admin

export const createReviewCntrl = expressAsyncHandler(async(req,res)=> {

    const {product,message,rating} = req.body;

    //find the product 
    const {productId} = req.params;
    const productFound = await Product.findById(productId).populate('reviews');

    if(!productFound){
        throw new Error("Product not found");
    }

    //check user already reviewd product
    const hasReviewed = productFound?.reviews?.find((review)=>{
        return review?.user?.toString() === req?.userAuthId?.toString();
    })

    if(hasReviewed){
        throw new Error("You have already reviewed this product");
    }


    //create review
    const review = await Review.create({
        message,
        rating,
        product : productFound?._id,
        user : req.userAuthId,
    });

    //pousth review to product found
    productFound.reviews.push(review?._id);
    await productFound.save();

    res.status(201).json({
        success:true,
        message : "Review created successfully"
    })
})