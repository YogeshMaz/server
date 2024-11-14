import mongoose from "mongoose";

const router = express.Router();

mongoose.connect("mongodb://localhost:27017/LoginDB");

const UserSchema = new mongoose.Schema({
  Name: String,
  Email: String
})

const UserModel = mongoose.model("LoginReport", UserSchema, "LoginReport");

router.get("/getUsers", (req, res) => {
  UserModel.find({})
    .then(function(LoginReport){
      // console.log("Found LoginReports:", LoginReport);
      res.json(LoginReport);
    })
    .catch(function(err){
      console.log("Error finding LoginReports:", err); 
      res.status(500).send(err);
    });
});

export default router;