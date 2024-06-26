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
  videocall,
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

const {
  instausersave,
  Instapost,
  instalogin,
  InstaProfile,
  InstauserbyId,
  getInstapost,
  Likepost,
  GetAllUser,
  Getqueryname,
  GetAllPost,
  editProfile,
  CommentSave,
  GetAllcomment,
  DeletePost,
  GetUserById,
  Followuser,
  GetFollowCount,
} = require("../controller/instafeature");

//---get---
router.get("/alluser", getuser);
router.get("/alluser/:id", authenticateUser, userget);
router.get("/getmessage/:id", authenticateUser, getmessage);
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

//----post-----\
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
router.post("/savechats", authenticateUser, chats);
router.post("/videocall", authenticateUser, videocall);
// router.post("/updateprofile",changeprofile)

//------instapost--------
router.post("/instauser", upload.single("image"), instausersave);
router.post("/instalogin", instalogin, InstaProfile);
router.post(
  "/instapost",
  authenticateUser,
  upload.fields([{ name: "image" }, { name: "video" }]),
  Instapost
);

//--instaget------
router.get("/getprofile", authenticateUser, InstauserbyId);
router.get("/getpost", authenticateUser, getInstapost);
router.get("/getallinstauser", GetAllUser);
router.get("/getquery", Getqueryname);
router.get("/getallpost/:id", GetAllPost);
router.get("/getcomment/:id",authenticateUser,GetAllcomment)
router.get("/getprofile/:id",GetUserById)
router.get("/getcount",authenticateUser,GetFollowCount)

//-----instaput---
router.post("/postlike", authenticateUser, Likepost);
router.post("/comment",authenticateUser,CommentSave)
router.post("/follow/:id",authenticateUser,Followuser)
router.put("/edituser/:id",authenticateUser,editProfile)

// router.put("/postcomment",authenticateUser,Commentpost)


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
router.delete("/deletepost/:id",authenticateUser,DeletePost)

module.exports = router;
