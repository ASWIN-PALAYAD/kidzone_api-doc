import dotenv from 'dotenv';
dotenv.config();

import {v2 as cloudinary} from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';



//configure cloudinary
cloudinary.config({

    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_SECRET_KEY

});

//create storage engine for multer
const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormates :["jpg","png","jpeg"],
    params:{
        folder :"Ecommerce-api"
    }
});

//init multer with storage engine

const upload = multer({
    storage
});


export default upload;