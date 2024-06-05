const { products } = require("../schema/Product");
const users = require("../schema/register");
const { Cartadd } = require("../schema/Cart");
const { productcart } = require("../schema/Quantity");
const { Orders } = require("../schema/Address");
const { orderitmes } = require("../schema/Order");
const cloudinary = require("cloudinary").v2;
const { Chats } = require("../schema/Chat");
const nodemailer = require("nodemailer");
const path = require("path");
const secretKey =
  "sk_test_51OU6RHEGEcAgpKUXhghRvE9y7YcGGffnZo9EGYZTPMejZKVsA358VPgI58gzigzNT80uU0RIZV86dDkR2IFYgAtc00hNU4THoT";
const stripe = require("stripe")(secretKey);
cloudinary.config({
  cloud_name: "dvifsulmi",
  api_key: "761136893464741",
  api_secret: "gcgymC9Qe8hLeDpmnkCEeZkDS6g",
});

const getallproducts = async (req, res) => {
  const { page = 1, limit = 6 } = await req.query;

  const limitset = Number(limit);

  try {
    const product = await products.find().limit(limitset);
    const currentPage = page;

    res.status(200).json({ message: "success", product, currentPage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getproducts = async (req, res) => {
  try {
    const product = await products.find();

    res.status(200).json({ message: "success", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const postproduct = async (req, res) => {
  const { title, description, stock, price } = req.body;
  console.log(req?.files?.File, "filesssssssssss");
  try {
    if (!req.files) {
      return res.status(400).json({ message: "No file uploaded." });
    }
    const image = await Promise.all(
      req?.files?.image?.map(async (image) => {
        const result = await cloudinary?.uploader?.upload(image?.path);
        return result?.secure_url;
      })
    )
      .then((res) => res)
      .catch((e) => console.error("error", e));

    const videoshow = await Promise.all(
      req?.files?.video?.map(async (video) => {
        const videoData = await cloudinary.uploader.upload(video.path, {
          resource_type: "video",
          public_id: "video_upload_data",
        });
        return videoData.secure_url;
      })
    )
      .then((res) => res.toString())
      .catch((e) => console.error("error", e));

    const product = new products({
      title: title,
      description: description,
      stock: stock,
      price: price,
      image: image,
      video: videoshow,
    });

    await product.save();
    return res.json({
      message: "Product uploaded successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to save product to the database",
      error: error.message,
    });
  }
};

const showimage = (req, res) => {
  const image = req.params.image;
  try {
    const product = products.find({ image: image });
    if (!product) {
      return res.status(404).json({ error: "Image not found" });
    }
    const imagePath = path.join(__dirname, "../upload/image", image);
    res.sendFile(imagePath);
    if (!imagePath) {
      return res.status(404).json({ message: "not found" });
    }
  } catch (error) {
    return res.status(500).json(error.toString());
  }
};

const singleproduct = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await products.findById(id);
    res.status(200).json({ message: "success", product });
  } catch (error) {
    return res.status(404).json({ message: "Not found" });
  }
};

const getusercartid = async (req, res) => {
  const Id = req.userId;
  try {
    const Cart = new Cartadd({ userId: Id });
    await Cart.save();
    return res.status(200).json({ message: "sucess" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const addToCart = async (req, res) => {
  const userId = req.userId;
  const { productId, quantity } = req.body;

  try {
    let cart = await Cartadd.findOne({ userId: userId });
    if (cart) {
      let Productquantity = await productcart.findOne({
        cartId: cart._id,
        productId: productId,
      });

      if (Productquantity) {
        Productquantity.quantity += +quantity;
        await Productquantity.save();
        return res.status(200).json({ message: "Quantity Add Successfully" });
      } 
      else
       {
        const products = new productcart({
          cartId: cart._id,
          productId: productId,
          quantity: quantity,
        });
        await products.save();
      }
      return res.status(200).json({ message: "Products Add Successfully" });
    } else {
      const newcart = new Cartadd({ userId: userId });
      const productcarts = await newcart.save();
      const products = new productcart({
        cartId: productcarts?._id,
        productId: productId,
        quantity: quantity,
      });
      await products.save();
      return res.status(200).json({ message: "cartadd successfuly" });
    }
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

const showCartProducts = async (req, res) => {
  const userId = req.userId;

  try {
    const cart = await Cartadd.findOne({ userId: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found for the user" });
    }
    const cartProducts = await productcart.aggregate([
      {
        $match: { cartId: cart._id },
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "cartDetails",
        },
      },
      {
        $unwind: "$cartDetails",
      },
      {
        $project: {
          productId: "$productId",
          title: "$cartDetails.title",
          description: "$cartDetails.description",
          stock: "$cartDetails.stock",
          image: "$cartDetails.image",
          quantity: "$quantity",
          price: "$cartDetails.price",
        },
      },
    ]);
    if (!cartProducts || cartProducts.length === 0) {
      return res.status(404).json({ message: "No products in the cart" });
    }
    return res
      .status(200)
      .json({ message: " your cart products ", products: cartProducts });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.toString() });
  }
};

const deleteCartProduct = async (req, res) => {
  const userId = req.userId;

  try {
    const cart = await Cartadd.findOne({ userId: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found for the user" });
    }

    const deletedProduct = await productcart.findOneAndDelete({
      cartId: cart._id,
      productId: req.params.id,
    });

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found in the cart" });
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.toString() });
  }
};

const updatequantity = async (req, res) => {
  const userId = req.userId;
  const { quantity } = req.body;
  try {
    const cart = await Cartadd.findOne({ userId: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const updatedProduct = await productcart.findOneAndUpdate(
      {
        cartId: cart._id,
        productId: req.params.id,
      },
      {
        $set: { quantity: quantity },
      }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found in the cart" });
    }
    return res
      .status(200)
      .json({ message: "Quantity updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.toString() });
  }
};

const payment = async (req, res) => {
  const userId = req.userId;
  const { products } = req.body;

  try {
    const cart = await Cartadd.findOne({ userId: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const session = await stripe.checkout.sessions.create({
      client_reference_id: cart.id,
      payment_method_types: ["card"],
      line_items: products.map((product) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: product.title,
            description: product.description,
            images: product?.image,
          },
          unit_amount: product.price * 100,
        },
        quantity: product.quantity,
      })),
      billing_address_collection: "required",
      mode: "payment",
      success_url:
        "https://frontend-mu-indol.vercel.app/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://frontend-mu-indol.vercel.app/cancel",
    });
    res.json({ id: session.id });
  } catch (error) {
    console.log(error.toString());
    return res.status(404).json({ message: "Internal Server Error" });
  }
};

const ordersuccess = async (req, res) => {
  const userId = req.userId;
  const { id } = req.params;

  try {
    const usermail = await users.findById(userId);
    const useremail = usermail.email;
    const cart = await Cartadd.findOne({ userId: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const session = await stripe.checkout.sessions.retrieve(id);
    if (session.payment_status === "paid") {
      const address = session.customer_details.address;
      const { city, country, line1, line2, postal_code, state } = address;

      const order = new Orders({
        userId: userId,
        address: {
          city: city,
          country: country,
          line1: line1,
          line2: line2,
          postal_code: postal_code,
          state: state,
        },
        metadata: JSON.stringify(session),
      });

      const savedOrder = await order.save();

      const cartProducts = await productcart.find({
        cartId: session.client_reference_id,
      });

      // if (!cartProducts) {
      //   return res.status(404).json({ message: "cartProducts not found" });
      // }
      const attachments = [];
      await cartProducts?.map(async (prod, i) => {
        const oneProd = await products.findOne(prod.productId);

        const saveas = new orderitmes({
          orderId: savedOrder._id,
          productId: prod.productId,
          quantity: prod.quantity,
          price: oneProd?.price,
        });
        await saveas.save();
        attachments.push({
          filename: `image${i + 1}.png`,
          href: `${oneProd?.image}`,
        });

        if (cartProducts.length === i + 1) {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 465,
            auth: {
              user: useremail,
              pass: "mhpo aclc kijd jajv",
            },
          });

          const mailOptions = {
            from: "usercreator143@gmail.com",
            to: "sakshi-mishra@csgroupchd.com",
            subject: "order succesfully",
            html: `<p>Order successfully placed!</p>
                  <p>please check attachment:</p>`,
            attachments: attachments,
          };
          await transporter.sendMail(mailOptions);
        }
      });
      // console.log(transporter,"transporter")
      // console.log(mailOptions,"mailOptions")

      await productcart.deleteMany({
        cartId: session.client_reference_id,
      });

      return res.status(200).json({
        message: "Payment successful.......",
      });
    } else {
      return res.status(400).send("Payment not successfully");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};

const showallorder = async (req, res) => {
  const userId = req.userId;

  try {
    const order = await Orders.findOne({ userId: userId });
    if (!order) {
      return res.status(200).json({ message: "User not found" });
    }

    const orders = await Orders.aggregate([
      { $match: { userId: order.userId } },
      {
        $lookup: {
          from: "orderproducts",
          localField: "_id",
          foreignField: "orderId",
          as: "orderdetails",
        },
      },
      { $unwind: "$orderdetails" },
      {
        $lookup: {
          from: "products",
          localField: "orderdetails.productId",
          foreignField: "_id",
          as: "productdetails",
        },
      },
      { $unwind: "$productdetails" },
      {
        $group: {
          _id: "$_id",
          address: { $first: "$address" },
          details: {
            $push: {
              _id: "$orderId",
              product: "$productdetails",
              orderdetails: "$orderdetails",
            },
          },
        },
      },
    ]);

    res.status(200).json({
      message: "Your Orders Are Here",
      orders,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const singleorder = async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const order = await Orders.findById(orderId);

    if (!order) {
      return res.status(200).json({ message: "User not found" });
    }
    const showorder = await Orders.aggregate([
      {
        $match: {
          _id: order._id,
        },
      },
      {
        $lookup: {
          from: "orderproducts",
          localField: "_id",
          foreignField: "orderId",
          as: "orderdetails",
        },
      },
      {
        $unwind: "$orderdetails",
      },
      {
        $lookup: {
          from: "products",
          localField: "orderdetails.productId",
          foreignField: "_id",
          as: "productdetails",
        },
      },
      {
        $unwind: "$productdetails",
      },
      {
        $group: {
          _id: "$_id",
          address: { $first: "$address" },
          details: {
            $push: {
              _id: "$orderId",
              product: "$productdetails",
              orderdetails: "$orderdetails",
            },
          },
        },
      },
    ]);

    const ordershow = { showorder };
    res.status(200).json({
      message: "Your Product and Address",
      ordershow,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const shows = async (req, res) => {
  const userId = req.userId;
  const { page, limit = 3 } = await req.query;
  const skip = parseInt(page - 1) * limit;
  try {
    const order = await Orders.findOne({ userId: userId });
    if (!order) {
      return res.status(200).json({ message: "User not found" });
    }

    const orders = await Orders.aggregate([
      { $match: { userId: order.userId } },
      {
        $lookup: {
          from: "orderproducts",
          localField: "_id",
          foreignField: "orderId",
          as: "orderdetails",
        },
      },
      { $unwind: "$orderdetails" },
      {
        $lookup: {
          from: "products",
          localField: "orderdetails.productId",
          foreignField: "_id",
          as: "productdetails",
        },
      },
      { $unwind: "$productdetails" },
      {
        $group: {
          _id: "$_id",
          address: { $first: "$address" },
          details: {
            $push: {
              _id: "$orderId",
              product: "$productdetails",
              orderdetails: "$orderdetails",
            },
          },
        },
      },
    ])
      .skip(skip)
      .limit(limit);
    const currentPage = page;
    const count = await orderitmes.countDocuments();
    const totalpage = Math.ceil(count / limit);

    res.status(200).json({
      message: "Your Orders Are Here",
      orders,
      currentPage,
      totalpage,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const Deleteproducts = async (req, res) => {
  const id = req.params.id;

  try {
    const deleteproduct = await products.findByIdAndDelete(id);
    if (deleteproduct) {
      res.status(200).json({ message: "delete successfully " });
    }
  } catch (error) {
    res.status(404).json(error);
  }
};

const paymentwithsingleproduct = async (req, res) => {
  const id = req.params.id;
  const { quantities } = await req.body;

  try {
    const product = await products.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const session = await stripe.checkout.sessions.create({
      client_reference_id: product.id,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.title,
              description: product.description,
              images: product?.image,
            },
            unit_amount: product.price * 100,
          },
          quantity: quantities?.[product?._id] || 1,
        },
      ],
      billing_address_collection: "required",
      mode: "payment",
      success_url:
        "https://frontend-mu-indol.vercel.app/successorder?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://frontend-mu-indol.vercel.app/cancel",
    });
    res.json({ id: session.id });
  } catch (error) {
    console.log(error.toString());
    return res.status(404).json({ message: "Internal Server Error" });
  }
};

const getsingleproductorder = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  console.log(req.params, "dsjfgf");

  try {
    const usermail = await users.findById(userId);
    const useremail = usermail.email;
    const lineItems = await stripe.checkout.sessions.listLineItems(id);
    console.log(lineItems, "itemsss");
    const session = await stripe.checkout.sessions.retrieve(id);
    if (session.payment_status === "paid") {
      const order = new Orders({
        userId: userId,
        address: session.customer_details.address,
        metadata: JSON.stringify(session),
      });

      const savedOrder = await order.save();
      const productssave = await products.findById({
        _id: session.client_reference_id,
      });
      const attachments = [];
      if (productssave) {
        const saveas = new orderitmes({
          orderId: savedOrder._id,
          productId: session.client_reference_id,
          price: lineItems?.data[0].amount_subtotal,
          quantity: lineItems.data[0].quantity,
        });
        await saveas.save();
        attachments.push({
          filename: `images.png`,
          href: `${productssave?.image}`,
        });

        const transporter = nodemailer.createTransport({
          service: "gmail",
          host: "smtp.gmail.com",
          port: 465,
          auth: {
            user: "usercreator143@gmail.com",
            pass: "mhpo aclc kijd jajv",
          },
        });

   
        const mailOptions = {
          from: "usercreator143@gmail.com",
          to: useremail,
          subject: "order succesfully",
          html: `<p>Order successfully placed!</p>
                  <p>please check attachment:</p>`,
          attachments: attachments,
        };
        await transporter.sendMail(mailOptions);
      }
      
      return res.status(200).json({
        message: "Payment successful.......",
      });
    } else {
      return res.status(400).send("Payment not successfully");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};

const chats = async (req, res) => {
  const userId = req.userId;
  const { To, message } = req.body;

  try {
    const fromUser = await users.findOne({ _id: userId });
    const toUser = await users.findOne({ _id: To });
    if (!fromUser || !toUser) {
      return res.status(400).json({ error: " users not found." });
    }

    const newChat = new Chats({
      From: fromUser._id,
      To: toUser._id,
      message,
    });

    await newChat.save();
    res.status(201).json(newChat);
  } catch (error) {
    res.status(500).json({ error: "Failed to create a chat." });
  }
};

const getmessage = async (req, res) => {
  const id1 = req.params.id;
  const userId = req.userId;
  try {
    const user1 = await users.findById({ _id: id1 });
    const user2 = await users.findById({ _id: userId });

    const getallmessage = await Chats.aggregate([
      { $match: { $or: [{ To: user1.id }, { From: user1.id }] } },
      { $match: { $or: [{ To: user2.id }, { From: user2.id }] } },
    ]);

    return res.status(200).json({ message: "success", getallmessage });
  } catch (error) {
    res.status(400).json(error);
  }
};

const videocall = async (req, res) => {
  const userId = await req.userId;
  const { To } = await req.body;
  try {
    const receiver = await users.findOne({ _id: To });
    if (receiver) {
      const message = `Incoming call from ${userId}`;
      res.status(200).json(message);
    } else {
      res.status(406).send(`User with the given id=${To} is not available.`);
    }
  } catch (error) {
    console.error("Error during video call:", error);
  }
};



module.exports = {
  getproducts,
  postproduct,
  showimage,
  singleproduct,
  getusercartid,
  addToCart,
  showCartProducts,
  deleteCartProduct,
  updatequantity,
  payment,
  ordersuccess,
  showallorder,
  singleorder,
  shows,
  Deleteproducts,
  getallproducts,
  paymentwithsingleproduct,
  getsingleproductorder,
  chats,
  getmessage,
  videocall,

};
