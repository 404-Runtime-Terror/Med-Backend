// require  modules
const { MongoClient } = require("mongodb");
const express = require("express");
const router = express.Router();
require("dotenv").config();

//connect to mongodb database
const client = new MongoClient(process.env.DB_URL, {
    useUnifiedTopology: true,
  });

  //get request
router.get("/", async (req, res) => {
    try {
        userID = req.query.userID;
        var name ; 
        flag = false;
        //connect to database
        await client.connect();
        const db = client.db("Hackthon");

        //get data from database
        const collection = await db.collection("AccountData").aggregate().toArray();
        
        collection.find(e=>{
            if(e._id.toString()===userID)
            {
                name = e.name;
                age = e.age;
                dateofbirth = e.dateofbirth;
                bloodgroup = e.bloodgroup;
                flag = true;
            }
        })
        if(flag)
        {
            return res.status(200).json({name : name});
        }
        else
        {
            return res.status(400).json({flag : flag});
        }
    } catch (error) {
      console.error(error);
      return res.status(500).send("Server error");
    }
  });
  
  module.exports = router;
  