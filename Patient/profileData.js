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
        flag = false;
        await client.connect();
        const db = client.db("Hackthon");
        const collection = await db.collection("AccountData").aggregate().toArray();
        collection.find(e=>{
            console.log(e._id.toString(),id)
            if(e._id.toString()===id)
            {
                Name = e.name;
                age = e.age;
                dateofbirth = e.dateofbirth;
                allergy = e.allergies;
                bloodgroup = e.bloodgroup;
                flag = true;
                res.json({flag: flag,age: age, dateofbirth: dateofbirth, allergies: allergy, bloodgroup: bloodgroup,name:Name});
            }
            else{
                // res.json({flag: flag});
            }
        })
        
    }
    catch (error) {
        console.error(error);

    }
});

module.exports = router;