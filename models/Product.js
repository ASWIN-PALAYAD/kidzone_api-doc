import mongoose, { mongo } from "mongoose";

const Schema = mongoose.Schema;

const ProductSchema = new Schema(
    {
        name:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required : true
        },
        brand : {
            type:String,
            required : true,
        },
        category:{
                type:String,
                ref:"Category",
                required : true
        },
        sizes : {
            type:[String],
            enum : ["S","M","L","XL","XXL"],
            required : true
        },
        colors:{
            type:[String],
            required:true
        },
        user:{
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required: true
        },
        images:[
            {
                type:String,
                required:true
            }
        ],
        reviews:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Review"
            }
        ],
        price:{
            type: Number,
            required:true,
        },
        totalQty:{
            type:Number,
            required:true
        },
        totalSold:{
            type:Number, 
            default:0
        }
        
    },
    {
        timestamps:true,
        toJSON: {virtuals:true},
    }
)

//virtuals (check)
//1) total reviews
ProductSchema.virtual("totalReviews").get(function(){
    const product = this;
    return product?.reviews?.length
});

//2) averaage rating
ProductSchema.virtual("averageRating").get(function(){
    let ratingsTotal = 0;
    const product = this;
    product?.reviews?.forEach((review)=>{
        ratingsTotal += review?.rating;
    })
    const averageRating = Number(ratingsTotal / product?.reviews?.length).toFixed(1);
    return averageRating
})

//3)qty left
ProductSchema.virtual("qtyLeft").get(function(){
    const product = this;
    return product.totalQty - this.totalSold 
})

const Product = mongoose.model("Product",ProductSchema);

export default Product;