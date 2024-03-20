const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: "./upload/image",
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

const {
  getproducts,
  getallproducts,
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
  paymentwithsingleproduct,
  getsingleproductorder,
  chats,
  getmessage,
 
} = require("../controller/product");
const {
  authenticateUser,
  postregister,
  profile,
  updateuser,
  getbyiduser,
  login,
  userget,
  updateimage,
  getuser,
  getsequence,
  updatecolumn,
  // changeprofile,
} = require("../controller/registeruser");

//---get---
router.get("/alluser", getuser);
router.get("/alluser/:id", authenticateUser, userget);
router.get("/getmessage/:id", authenticateUser,getmessage);
router.get("/showall", getproducts);
router.get("/allproducts", authenticateUser, getallproducts);
router.get("/pagination", authenticateUser, shows);
router.get("/getproduct/:id", singleproduct);
router.get("/images/:image", showimage);
router.get("/showcart", authenticateUser, showCartProducts);
router.get("/details", authenticateUser, showallorder);
router.get("/detailsdata/:orderId", authenticateUser, singleorder);
router.get("/users/:id", authenticateUser, userget);
router.get("/user", authenticateUser, getbyiduser);
router.get("/success/:id", authenticateUser, ordersuccess);
router.get("/singleordersuccess/:id", authenticateUser, getsingleproductorder);
router.get("/getsequence", getsequence);


// router.get("/getuser",authenticateUser, getuser);
// router.get("/show",verifyed,tokenverify);
// router.get("/sendmail",sendmail)

//----post---
router.post(
  "/save",
  upload.fields([{ name: "image" }, { name: "video" }]),
  postproduct
);
router.post("/usersave", upload.single("image"), postregister);
router.post("/login", login, profile);
router.post("/cart", authenticateUser, getusercartid);
router.post("/add-to-cart", authenticateUser, addToCart);
router.post("/payment", authenticateUser, payment);
router.post("/paywithproduct/:id", authenticateUser, paymentwithsingleproduct);
router.post("/savechats",authenticateUser,chats)

// router.post("/updateprofile",changeprofile)

//---update--
router.put("/updatequantities/:id", authenticateUser, updatequantity);
router.put("/update/:id", authenticateUser, upload.single("image"), updateuser);
router.put(
  "/imageupdate",
  authenticateUser,
  upload.single("image"),
  updateimage
);
router.put("/updateuserorder", updatecolumn);

//---delete--
router.delete("/delete/:id", authenticateUser, deleteCartProduct);
router.delete("/productdelete/:id", authenticateUser, Deleteproducts);


module.exports = router;
