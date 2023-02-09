// Require modules
const { MongoClient } = require("mongodb");
const express = require("express");
const router = express.Router();
const fetchData = require("../fetchData");
const encryption = require("../Encryption");
require ("dotenv").config();

// //connect to mongodb database
// const client = new MongoClient(process.env.DB_URL, {
//     useUnifiedTopology: true,
// });

// //get request
// router.get("/", async (req, res) => {
//     try {
//         id = req.query.userID;
//         await client.connect();
//         const db = client.db(DBname);
//         const collection = await db.collection(collectionName).aggregate().toArray();
    
//     }
//     catch (error) {
//         console.error(error);

//     }
// });

// module.exports = router;