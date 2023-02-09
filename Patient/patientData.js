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
        flag = true;
        const data = await fetchData.GetData(client,"Hackthon","PatientData",id);
        console.log("working")
        console.log(data)
        
        data.map(e=>{
            if(e.prescription === null)
            {
                flag = false;
            }
            else{
                e.prescription = encryption.decrypt({password:e.prescription,iv:e.iv});
            }

        })
        if (flag){
            data.map(e=>{
                delete(e.iv);
            })
            console.log(data)
            res.json(data);
        }
        else{
            res.json({flag: flag});
        }
    }
    catch (error) {
        console.error(error);

    }
});

module.exports = router;