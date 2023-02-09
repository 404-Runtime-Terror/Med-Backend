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
        const data = await fetchData.GetData(client,"Hackthon","PatientData",id);
        data.map(e=>{
            e.prescription = encryption.decrypt({password:e.prescription,iv:e.iv});

        })
        data.map(e=>{
            delete(e.iv);
        })
        console.log(data)
        res.json(data);
    }
    catch (error) {
        console.error(error);

    }
});

module.exports = router;