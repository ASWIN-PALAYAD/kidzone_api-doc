import jwt from "jsonwebtoken";

export const  verifyToken = (token) => {
    return jwt.verify(token,process.env.JWT_KEY,(err,decode)=>{
        if(err){
            return false;
        }else{
            return decode;
        }
    })
}