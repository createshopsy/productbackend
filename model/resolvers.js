const users = require("../schema/register");
const products = require("../schema/Product");
const { Cartadd } = require("../schema/Cart");
const secretKey = "your-secret-key";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const GraphQLUpload = require("graphql-upload/GraphQLUpload.js");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dw5yebdat",
  api_key: "771737179677165",
  api_secret: "aw2pUCm8i20By_cSqtlwcLsLtdk",
});
const resolvers = {
  Upload: GraphQLUpload,

  Query: {
    getallusers: async () => {
      const userget = await users.find();
      return userget;
    },


    findUserById: async (_, id) => {
      const newuser = await users.findById(id);
      return newuser;
    },


    allproducts: async (_, { page, limit }) => {
      const limitset = Number(limit);
      const product = await products.aggregate([
        { $sample: { size: limitset } },
        { $sort: { _id: 1 } },
      ]);
      return product;
    },

    getsingleproductswithid: async (_, id) => {
      const getproduct = await products.findById(id);
      return getproduct;
    },

  },

  Mutation: {
    saveproduct: async ( _,{ title, description, price, stock, image, video }) => {
      const { createReadStream, filename, mimetype, encoding } = await image;
      const stream = createReadStream();
      const filepath = path.join(__dirname, "../upload/image", filename);
      await new Promise((resolve, reject) =>
        stream
          .pipe(fs.createWriteStream(filepath))
          .on("finish", resolve)
          .on("error", reject)
      );
      const result = await cloudinary.uploader.upload(filepath);
      const product = new products({
        title: title,
        description: description,
        price: price,
        stock: stock,
        image: result.secure_url,
      });
      const savedProduct = await product.save();
      return savedProduct;
    },


    login: async (parent, args, context, info) => {
      const user = await users.findOne({ email: args.email });
      if (!user) {
        throw new Error("No such user found");
      }
      const comparePassword = await bcrypt.compare(
        args.password,
        user?.password
      );
      if (comparePassword) {
        const token = jwt.sign({ id: user._id, email: user.email }, secretKey, {
          expiresIn: "10h",
        });
        return { token, user };
      }
    },


    signup: async (_, args) => {
      const { createReadStream, filename, mimetype, encoding } =
        await args.image;
      const stream = createReadStream();
      const filepath = path.join(__dirname, "../upload/image", filename);
      await new Promise((resolve, reject) =>
        stream
          .pipe(fs.createWriteStream(filepath))
          .on("finish", resolve)
          .on("error", reject)
      );
      const result = await cloudinary.uploader.upload(filepath);
      const hashed = await bcrypt.hash(args.password, 10);
      const user = new users({
        username: args.username,
        firstname: args.firstname,
        lastname: args.lastname,
        email: args.email,
        password: hashed,
        image: result.secure_url,
      });
      await user.save();
      return user;
    },

    createusercart: async (_, id) => {
      console.log(id);
      const Cart = new Cartadd({ userId: id });
      await Cart.save();
      return Cart;
    },
    addToCart:async(_,args)=>{
      let cart=await Cartadd.findOne({userId:args.userId});
      if(!cart){throw new Error ("No User Cart Found")}
     
    }
  },
};

module.exports = resolvers;
