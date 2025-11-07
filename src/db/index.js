import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {
    try {
        // console.log(`.env is working fine ${process.env.MONGODB_URI}`); did for debauing purpose 
        const conneectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        
        console.log(`mongodb connection successfull \n and the instance is ${conneectionInstance}`);
        
    } catch (error) {
        console.error(`error connecting in db ${error}`)
        process.exit(1)
        // throw error
    }
}

export default connectDB