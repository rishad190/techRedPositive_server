const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pv2sf.mongodb.net/${process.env.DB_DATA}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = 5000;

var nodemailer = require("nodemailer");

// var transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "rishadkhan202119@gmail.com",
//
//   },
// });

client.connect((err) => {
  const collection = client.db("hobbies").collection("userData");
  // perform actions on the collection object
  app.post("/addData", (req, res) => {
    collection.insertOne(req.body).then((doc) => {
      res.send(doc);
    });
  });
  app.get("/sendMail", (req, res) => {
    console.log(req.body);
  });
  app.get("/updateUser/:id", (req, res) => {
    collection.find({ _id: ObjectId(req.params.id) }).toArray((err, doc) => {
      res.send(doc[0]);
    });
  });
  app.delete("/deleteUser/:id", (req, res) => {
    collection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => res.send(result.deletedCount > 0));
  });
  app.patch("/update/:id", (req, res) => {
    collection
      .updateOne(
        { _id: ObjectId(req.params.id) },
        {
          $set: {
            name: req.body.updateName,
            email: req.body.updateEmail,
            phone: req.body.updatePhone,
            hobbies: req.body.updateHobbies,
          },
        }
      )
      .then((result) => {
        res.send(result.matchedCount > 0);
      });
  });
  app.get("/showData", (req, res) => {
    collection.find({}).toArray((err, doc) => {
      res.send(doc);
    });
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT || port);
