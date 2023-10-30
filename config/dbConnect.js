import mongoose from "mongoose";

mongoose.set('strictQuery',false); 

const dbConnect = async ()=> {
    try {
        const connected = await mongoose.connect(process.env.MONGODB_URL) 
        console.log(`Mongodb connected ${connected.connection.host}`);
    } catch (error) {
        console.log(`Error : ${error.message}`);
        process.exit(1)
    }
};
  
export default dbConnect; 
