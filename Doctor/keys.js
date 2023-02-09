// Require modules
const { MongoClient } = require("mongodb");
const express = require("express");
const router = express.Router();
const fetchData = require("../fetchData");
const encryption = require("../Encryption");
require ("dotenv").config();

//connect to mongodb database
const client = new MongoClient(process.env.DB_URL, {
    useUnifiedTopology: true,
});

//get request
router.get("/", async (req, res) => {
    try {
        id = req.query.userID;
        await client.connect();
        const db = client.db("Hackthon");
        const collection = await db.collection("DocData").aggregate().toArray();
        collection.find(e=>{
            if(e._id.toString()===id)
            {
                console.log(e.key)
                res.json({keys: e.key});
            }else{
                res.json({keys:false});
            }
        })
    
    }
    catch (error) {
        console.error(error);

    }
});

module.exports = router;