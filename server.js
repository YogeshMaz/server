import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import summaryRoutes from "./src/routes/summaryRoutes.js";
import rfqRoutes from "./src/routes/rfqRoutes.js";
import projectRoutes from "./src/routes/projectRoutes.js";
import purchaseRoutes from "./src/routes/purchaseRoutes.js";
import drawingRoutes from "./src/routes/drawingRoutes.js";
import assetRoutes from "./src/routes/assetRoutes.js";
import visitRoutes from "./src/routes/visitRoutes.js";
import thirdPartyRoutes from "./src/routes/thirdPartyRoutes.js";
import testRoutes from "./src/routes/testRoutes.js";
import getAccessToken from "./src/accessToken/checkAuthExpiration.js";
import { fetchPMLoginDetails, fetchForgotPasswordDetails } from "./src/authentication/loginController.js";

dotenv.config();

const app = express();


app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// mongoose.connect("mongodb://localhost:27017/LoginDB");
// mongoose.connect("mongodb://97.74.85.118:27017/LoginDB")


// const UserSchema = new mongoose.Schema({
//   Name: String,
//   Email: String
// })

// const UserModel = mongoose.model("LoginReport", UserSchema, "LoginReport");

// app.get("/getUsers", (req, res) => {
//   UserModel.find({})
//     .then(function(LoginReport){
//       // console.log("Found LoginReports:", LoginReport);
//       res.json(LoginReport);
//     })
//     .catch(function(err){
//       console.log("Error finding LoginReports:", err); 
//       res.status(500).send(err);
//     });
// });

// const mongoURL = "mongodb://97.74.85.118:27017/LoginDB";
const mongoURL = "mongodb://127.0.0.1:27017";

// Mongoose connection with proper error handling
mongoose.connect(mongoURL, {
  useNewUrlParser: true, 
  useUnifiedTopology: true
})
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Define Schema and Model
const UserSchema = new mongoose.Schema({
  Name: String,
  Email: String
});

const UserModel = mongoose.model("LoginReport", UserSchema, "LoginReport");

// API to get users
app.get("/getUsers", (req, res) => {
  UserModel.find({})
    .then(function(LoginReport){
      res.json(LoginReport);
    })
    .catch(function(err){
      console.log("Error finding LoginReports:", err); 
      res.status(500).send(err);
    });
});

// MongoDB connection string
// const dbConnectionString = "mongodb://machinemaze:Mongo@2024@97.74.85.118:27017/myDatabase";
// // const dbConnectionString = "mongodb://myAdminUser:mySecurePassword@97.74.85.118:27017/LoginDB";


// // Connect to MongoDB
// mongoose.connect(dbConnectionString, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverSelectionTimeoutMS: 20000, // Increase timeout to 20 seconds
// })
// .then(() => {
//   console.log("MongoDB connected successfully");
// })
// .catch(err => {
//   console.error("MongoDB connection error:", err);
// });

// // Define a simple schema and model
// const userSchema = new mongoose.Schema({
//   name: String,
//   role: String,
// });

// const User = mongoose.model("User", userSchema);

// // Route to create a new user
// app.post('/users', (req, res) => {
//   const newUser = new User(req.body);

//   newUser.save()
//     .then(() => res.status(201).json(newUser))
//     .catch(err => res.status(400).json({ error: err.message }));
// });

// // Route to get all users
// app.get('/users', (req, res) => {
//   User.find({})
//     .then(users => res.json(users))
//     .catch(err => res.status(500).json({ error: err.message }));
// });

// Call the getAccessToken function initially and set to refresh every hour
getAccessToken();
setInterval(getAccessToken, 3600000);

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.join(__dirname, "uploads");

// Serve static files from the uploads directory
app.use("/uploaded", express.static(UPLOAD_DIR));

app.get("/api/uploaded-files", (req, res) => {
  fs.readdir(UPLOAD_DIR, (err, files) => {
    if (err) {
      console.error("Error reading upload directory:", err);
      return res
        .status(500)
        .json({ message: "Error reading upload directory" });
    }

    // Construct URLs for each file
    const uploadedFiles = files.map((file) => ({
      name: file,
      url: `${req.protocol}://${req.get("host")}/uploaded/${file}`, // Create the full URL
    }));

    // Respond with the list of files and their URLs
    res.json(uploadedFiles);
  });
});

// Initialize global variable for logged in email
global.loggedInEmail = null;
global.loggedInName = null;
global.loggedInUserRole = null;
global.loggedInUserProfile = null;
global.loggedInUserId = null;

// forgot password route
app.post("/api/forgot_password", fetchForgotPasswordDetails);

// Login Route
app.post("/api/login_details", fetchPMLoginDetails);

// Route to get the logged in email
app.get("/api/userInfos", (req, res) => {
  const data = {
    email: global.loggedInEmail,
    name: global.loggedInName,
    role: global.loggedInUserRole,
    profile: global.loggedInUserProfile,
    ID: global.loggedInUserId,
  };

  if (data.email || data.name) {
    res.json(data);
  } else {
    res.status(404).json({ message: "No data logged in." });
  }
});

app.use("/api/healthcheck", (_, res) => {
  res.json({ status: "Ok" });
});

// Other Routes
app.use("/api/summary", summaryRoutes);
app.use("/api/rfq_management", rfqRoutes);
app.use("/api/project_management", projectRoutes);
app.use("/api/purchase", purchaseRoutes);
app.use("/api/drawing", drawingRoutes);
app.use("/api/asset", assetRoutes);
app.use("/api/visit", visitRoutes);
app.use("/api/third_party", thirdPartyRoutes);
app.use("/api/test", testRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
