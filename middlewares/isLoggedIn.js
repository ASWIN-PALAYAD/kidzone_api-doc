import { getTokenFromHeader } from "../utils/getTokenFromHeader.js"
import { verifyToken } from "../utils/verifyToken.js";

export const isLoggedIn = (req,res,next) => {
    //get token from header
    const token = getTokenFromHeader(req);
    //verify token
    const decode = verifyToken(token);
    
    if(!decode){
        //attach the id to the req
        throw new Error("Invalid / Expired token, Please login again");
    }else{
        req.userAuthId = decode.id;
        next();
    }
};