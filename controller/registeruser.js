const register = require("../schema/register");
const secretKey = "your-secret-key";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Sequence = require("../schema/Sequence");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dvifsulmi",
  api_key: "761136893464741",
  api_secret: "gcgymC9Qe8hLeDpmnkCEeZkDS6g",
});

//---verified user--//

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "Unauthorized" }); //---authentication get  user after login
  try {
    const decoded = jwt.verify(token, secretKey);
    if (decoded) {
      req.userId = decoded.id;
      req.user = decoded.email;
      next();
    }
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: "Invalid Token" });
  }
};

//--get user--//

const getuser = async (req, res) => {
  try {
    const userdata = await register
      .find()
      .select("role username firstname lastname email image"); //---get all user
    res.status(200).json({ message: "success", userdata });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getsequence = async (req, res) => {
  try {
    const sequence=await Sequence.find()
    // const sequence = new Sequence();
    // sequence.save()
    res.status(200).json({ message: "success", sequence });
  } catch (error) {
    res.status(500).json(error);
  }
};

//----update columns----

const updatecolumn = async (req, res) => {
  const { updatedColumns } = await req?.body;
  
  try {
    const dbSequence = await Sequence.find({});

    const result = await Sequence.updateMany(
      { _id: dbSequence[0]?._id },
      { $set: { sequence: updatedColumns } }
    );

    if (result.acknowledged == true) {
      return res
        .status(201)
        .json({ message: "Successfully Updated!", updatedColumns });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

//---save user--------
const postregister = async (req, res) => {
  const { username, firstname, lastname, email, password } = req.body;
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const hashedPassword = await bcrypt.hash(password, 10); //---encrypt password with bcrypt and hash
    const user = new register({
      username,
      firstname,
      lastname,
      email,
      password: hashedPassword,
      image: req.file.filename,
    }); //--then saved user with all fields
    await user.save();
    res.status(200).json({ message: "Registration successful", user });
  } catch (error) {
    res.status(404).json({ message: "registration failed" });
  }
};

const updateuser = async (req, res) => {
  //   const userId = req.params.id;
  const userId = req.userId;
  const updateData = req.body;

  try {
    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updatedUser = await register
      .findByIdAndUpdate(userId, updateData, { new: true })
      .select("username firstname lastname email image");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateimage = async (req, res) => {
  const userId = req.userId;
  const updateData = req.body;

  try {
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      updateData.image = result.secure_url;
    }

    const update = await register.findByIdAndUpdate(userId, updateData, { new: true }).select("image");

    if (!update) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", update });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getbyiduser = async (req, res) => {
  const userId = req.userId;
  try {
    const newuser = await register.findById(userId);
    res.status(200).json({ message: "user login successfully", newuser });
  } catch {
    res.status(404).json({ message: "not valid" });
  }
};

const userget = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await register.findById(userId);
    res.status(200).json({ message: "user sucess", user });
  } catch {
    res.status(404).json({ message: "not valid" });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body)
  try {
    const user = await register.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const comparePassword = await bcrypt.compare(password, user?.password);

    if (comparePassword) {
      const token = jwt.sign({ id: user._id, email: user.email }, secretKey, {
        expiresIn: "10h",
      });
      req.token = token;

      next();
    } else {
      return res.status(404).json({ message: "Invalid password." });
    }
  } catch (err) {
    res.status(500).json({ error: "Enter valid data " });
  }
};

const profile = async (req, res) => {
  const token = req.token;

  try {
    const decodedToken = jwt.verify(token, secretKey);

    const user = await register.findOne({ email: decodedToken.email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    res.json({
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      token: token,
    });
  } catch (e) {
    res.status(500).json({ message: "Error in Fetching user" });
  }
};

// const updateposition=async (req, res) => {

//   try {
//     await register.updateMany({}, { $set: { position: order.indexOf(id) } }, { multi: true });
//     res.json({ message: 'User positions updated successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// }

module.exports = {
  postregister,
  getuser,
  login,
  profile,
  updateuser,
  getbyiduser,
  authenticateUser,
  userget,
  updateimage,
  getsequence,
  updatecolumn,
};
