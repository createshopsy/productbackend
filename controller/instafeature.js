const secretKey = "your-secret-key";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { InstaComment } = require("../schema/comments");
const { Follow } = require("../schema/Follow");
const { Instaprofile } = require("../schema/instauser");
const { InstaLike } = require("../schema/LIkes");
const { postfeature } = require("../schema/post");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dvifsulmi",
  api_key: "761136893464741",
  api_secret: "gcgymC9Qe8hLeDpmnkCEeZkDS6g",
});

const instausersave = async (req, res) => {
  const { name, user_name, user_email, user_password, dob, bio } = req.body;
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const hashedPassword = await bcrypt.hash(user_password, 10);
    const saveuser = new Instaprofile({
      name,
      user_name,
      user_email,
      user_password: hashedPassword,
      dob,
      bio,
      image: req.file.filename,
    });
    await saveuser.save();
    return res.status(200).json({ message: "sucessfully.........." });
  } catch (error) {
    return res.status(404).json({ message: "failed....." });
  }
};


const instalogin = async (req, res, next) => {
  const { user_email, user_password } = req.body;
  try {
    const user = await Instaprofile.findOne({ user_email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const comparePassword = await bcrypt.compare(
      user_password,
      user?.user_password
    );
    if (comparePassword) {
      const token = jwt.sign(
        { id: user._id, user_email: user.user_email },
        secretKey,
        { expiresIn: "10h" }
      );

      req.token = token;
      next();
    } else {
      return res.status(404).json({ message: "Invalid password." });
    }
  } catch (err) {
    res.status(500).json({ error: "Enter valid data " });
  }
};


const InstaProfile = async (req, res) => {
  const token = req.token;

  try {
    const decodedToken = jwt.verify(token, secretKey);

    const user = await Instaprofile.findOne({
      user_email: decodedToken.user_email,
    });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    } else {
      return res.status(200).json({ message: "User found", user, token });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};


const InstauserbyId = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await Instaprofile.findById(userId);
    res.status(200).json({ message: "successfully", user });
  } catch (error) {
    res.status(404).json(error);
  }
};


const GetUserById = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await Instaprofile.findById(id);
    res.status(200).json({ message: "successfully", user });
  } catch (error) {
    res.status(404).json(error);
  }
};


const Instapost = async (req, res) => {
  const userId = req.userId;
  const { caption, hashtag, description } = req.body;
  try {
    const images = await Promise.all(
      req?.files?.image?.map(async (image) => {
        const result = await cloudinary?.uploader?.upload(image?.path);
        return result?.secure_url;
      })
    )
      .then((res) => res)
      .catch((e) => console.error("error", e));

    const videoshow = await Promise.all(
      req?.files?.video?.map(async (video) => {
        console.log(video, "video");
        const videoData = await cloudinary.uploader.upload(video?.path, {
          resource_type: "video",
          public_id: "video_upload_data",
        });
        return videoData.secure_url;
      })
    )
      .then((res) => res.toString())
      .catch((e) => console.error("error", e));

    const userpost = new postfeature({
      userId: userId,
      caption,
      hashtag,
      description,
      image: images,
      video: videoshow,
    });
    await userpost.save();
    res.status(200).json({ message: "successfully.......", userpost });
  } catch (error) {
    res.status(404).json(error);
  }
};

 
const getInstapost = async (req, res) => {
  const userId = req.userId;
  try {
    const finduser = await Instaprofile.findOne({ _id: userId });
    const getuserpost = await postfeature.aggregate([
      { $match: { userId: finduser._id } },
    ]);
    res.status(200).json({ postdetail: getuserpost });
  } catch (error) {
    res.status(404).json({ messgae: "not found....." });
  }
};

const Likepost = async (req, res) => {
  const userId = req.userId;
  const postidsave = req.body;
  try {
    const likepost = new InstaLike({
      userId: userId,
      postId: postidsave.postId,
    });

    await likepost.save();
    res.status(200).json({ messgae: "success", likepost });
  } catch (error) {
    res.status(404).json({ messgae: "not found....." });
  }
};

const CommentSave = async (req, res) => {
  const userId = req.userId;
  const comment = req.body;

  try {
    const comments = new InstaComment({
      userId: userId,
      postId: comment.postId,
      comment: comment.comment,
    });
    await comments.save();
    res.status(200).json({ message: "success", comments });
  } catch (error) {
    res.status(500).json(error);
  }
};

const GetAllcomment = async (req, res) => {
  const userId = req.userId;
  const id = req.params.id;

  try {
    if (!userId) {
      res.status(200).json({ message: "user not found" });
    }
    const getcomment = await InstaComment.find({
      postId: id,
    });
    res.status(200).json({ message: "success", getcomment });
  } catch (error) {
    res.status(500).json(error);
  }
};

const GetAllUser = async (req, res) => {
  const userId = req.userId;
  try {
    if (userId) {
      const getall = await Instaprofile.find();
      res.status(200).json({ message: "sucesss...", getall });
    }
  } catch (error) {
    res.status(404).json(error);
  }
};

const Getqueryname = async (req, res) => {
  const queryinsta = await req.query;

  try {
    const getall = await Instaprofile.find({ user_name: queryinsta.q });

    if (!getall) {
      res.status(404).json({ messgae: "Not Found" });
    } else {
      res.status(200).json({ message: "User Found ", getall });
    }
  } catch (error) {
    res.status(404).json({ message: "not found " });
  }
};

const GetAllPost = async (req, res) => {
  const id = await req.params.id;
  try {
    const allpostwithid = await postfeature.find({ userId: id });
    res.status(200).json({ message: "success...", allpostwithid });
  } catch (error) {
    res.status(404).json({ meesage: "not found" });
  }
};

const editProfile = async (req, res) => {
  const userId = await req.userId;
  const updateuserdata = req.body;
  try {
    const editprofile = await Instaprofile.findByIdAndUpdate(
      userId,
      updateuserdata,
      { new: true }
    );

    if (!editprofile) {
      res.status(404).json({ message: "not found" });
    } else {
      res.status(200).json({ message: "Edit your profile", editprofile });
    }
  } catch (error) {
    res.status(404).json(error);
  }
};

const DeletePost = async (req, res) => {
  const id = req.params.id;
  try {
    const postdelete = await postfeature.findByIdAndDelete({ _id: id });
    if (postdelete) {
      res.status(200).json({ message: "successfully deleted" });
    } else {
      res.json(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.json(500).json(error);
  }
};

const Followuser = async (req, res) => {
  const userId = req.userId;
  const id = req.params.id;
  try {
    const finduser = await Follow.findOne({ follower: id });

    if (!finduser) {
      const followsave = new Follow({
        following: userId,
        follower: id,
      });

      await followsave.save();
      res.status(200).json({ message: "Followed Successfully" });
    } else {
      res.status(404).json({ message: "already follow this user" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const GetFollowCount = async (req, res) => {
  const userId = req.userId;
  try {
    const followerCount = await Follow.countDocuments({ follower: userId });
    const followingCount = await Follow.countDocuments({ following: userId });
    res.status(200).json({ followerCount, followingCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// const UnFollowuser = async (req, res) => {
//     const userId = req.userId;
//     const id = req.params.id;
//     try {
//       const user = await Instaprofile.findById(id);
//       console.log(user, "user");
//       if (!user) {
//         res.status(200).json({ message: "Not Found" });
//       }
//       await Follow.findOneAndRemove({ following: userId, follower: id });
//       res.status(200).json({ message: "Unfollowed Successfully" });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Internal Server Error" });
//     }
//   };

module.exports = {
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
};
