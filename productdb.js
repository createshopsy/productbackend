// require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://userproducts:e3YJSvz0rQ6f3aHC@userproduct.vf9vzhe.mongodb.net/?retryWrites=true&w=majority",
      // {
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
      // }
    );
    console.log("DATABASE CONNECTED SUCCESSFULLY ----------->>>>>>>>>>>>>>>>>>>>");
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = connectDB;

// const mondodb=(url)=>{
// return mongoose.connect(url,{
//     useNewUrlParser:true,
//     useUnifiedTopology:true,
// })
// }
// const start=async()=>{
//     try{

//         await mondodb(process.env.MONGO_URL);
//         await qantity.create(productjson)
//         console.log("success")
//     }catch(error){
//         console.log(error)
//     }
// }
// start()




// const server=new ApolloServer({
//   // typeDefs:schema.typeDefs ,resolvers:schema.resolvers,
//   typeDefs:typeDefs ,resolvers:resolvers,
//   csrfPrevention: false
// })