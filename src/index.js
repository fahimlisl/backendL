import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: "./.env"
})


connectDB()
.then(() => {
    app.listen(process.env.PORT || 2000 , () => {
        console.log(`app is listneing on port ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.error(`got error while coneectiing to mongodb ${err}`)
})




// another way to connect to mongodb using iife(immediately invoked function exceution) method

// ;( async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//     } catch (error) {
//         console.error(`error: ${error}`)
//         throw error
//     }
// })()