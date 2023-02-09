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
        age = req.query.age;
        dateofbirth = req.query.DOB;
        allergy = req.query.allergies;
        bloodgroup = req.query.bloodgroup;
        console.log(id,age,dateofbirth,allergy,bloodgroup)
        flag = false;
        await client.connect();
        const db = client.db("Hackthon");
        const collection = await db.collection("AccountData").aggregate().toArray();
        const AddCollection = await db.collection("AccountData");
        collection.find(e=>{
            if(e._id.toString()===id)
            {
                flag = true;
               AddCollection.updateMany(
                     { _id: e._id },
                     {$set : {age: age, dateofbirth: dateofbirth, allergies: allergy, bloodgroup: bloodgroup}})
            }
        })
        
        res.json({flag: flag});
    }
    catch (error) {
        console.error(error);

    }
});

module.exports = router;