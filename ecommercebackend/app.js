const express = require("express");
const { ObjectId } = require("mongodb");
const { connectToDb, getDb } = require("./db");
var cors = require('cors')

const app = express();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

let db;

// app.listen(3300, () =>{
//     console.log("app listening here!")
// })

connectToDb((err) => {
  if (!err) {
    app.listen(3300, () => {
      console.log("app listening here from server!");
    });
    db = getDb();
  } else {
    console.log("error===>", err);
  }
});

app.get("/wholedata", (req, res) => {
  let collection = [];
  db.collection("family")
    .find()
    .sort({ id: 1 })
    .forEach((item) => collection.push(item))
    .then(() => {
      res.status(200).json(collection);
    })
    .catch(() => {
      res.status(500).json({ error: "Something is wrong buddy" });
    });
});

app.get("/singledata/:id", (req, res) => {
  db.collection("family")
    .findOne({ id: parseInt(req.params.id) })
    .then((data) => res.status(200).json(data))
    .catch(() => res.status(500).json({ err: "Something is wrong buddy" }));
});

app.post("/addmember", (req, res) => {
  const member = req.body;

  db.collection("family")
    .insertOne(member)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch(() => res.status(500).json({ err: "Something is wrong buddy" }));
});

app.delete("/removemember/:id", (req, res) => {
  db.collection("family")
    .deleteOne({ id: parseInt(req.params.id) })
    .then((data) => res.status(200).json(data))
    .catch(() => res.status(500).json({ err: "Something is wrong buddy" }));
});

app.patch("/updateinfo/:id", (req, res) => {
  const update = req.body;

  db.collection("family")
    .updateOne({ id: parseInt(req.params.id) }, { $set: update })
    .then((result) => {
      res.status(201).json(result);
    })
    .catch(() => res.status(500).json({ err: "Something is wrong buddy" }));
});

app.post("/addItem", (req, res) => {
  const item = req.body;

  db.collection("cart")
    .insertOne(item)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch(() => res.status(500).json({ err: "Something is wrong buddy" }));
});

app.get("/getCart", (req, res) => {
    let collection = [];
    db.collection("cart")
      .find()
      .forEach((item) => collection.push(item))
      .then(() => {
        res.status(200).json(collection);
      })
      .catch(() => {
        res.status(500).json({ error: "Something is wrong buddy" });
      });
});

app.delete("/removeItem/:id", (req, res) => {
    db.collection("cart")
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((data) => res.status(200).json(data))
      .catch(() => res.status(500).json({ err: "Something is wrong buddy" }));
  });