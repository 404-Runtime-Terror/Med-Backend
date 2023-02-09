// For QrCode


// Require modules
const { MongoClient, ObjectId } = require("mongodb");
const express = require("express");
const router = express.Router();
const fetchData = require("../fetchData");
require("dotenv").config();

//connect to mongodb database
const client = new MongoClient(process.env.DB_URL, {
    useUnifiedTopology: true,
});


// to create data in database for editing patient data
async function createData(client, DBname, collectionName, userID, addID) {

    // connect to database
    await client.connect();
    const db = client.db(DBname);
    const collection = await db.collection(collectionName);

    // add patient id to doctor key
    key = [addID]

    // update the database
    collection.updateOne({ _id: ObjectId(userID) }, { $set: { key: key } });

}

//get request
router.get("/", async (req, res) => {
    try {

        // get request from frontend
        id = req.query.userID,
        addID = req.query.patientID;

        // get keys from database of doctor
        const data = await fetchData.Getkey(client, "Hackthon", "DocData", id);
        flag = false;

        // check if its first time getting editted
        if (data.length === 0) {

            // create first data in doctors key
            createData(client, "Hackthon", "DocData", id, addID);
            flag = true;

        } 
        // if not first time and add further patient id
        else {

            // check if patient id is already present
            if (data.includes(addID)) {

                res.status(200).json({added : false});
            }

            // if not present then add it
            else{

                // add patient id to doctor key
                data.push(addID);
                
                // connect to database
                await client.connect();
                const db = client.db("Hackthon");
                const collection = await db.collection("DocData");

                // update the database
                collection.updateOne({ _id: ObjectId(id) }, { $set: { key: data } });
                flag = true;
            }
        }
        
        res.status(200).json({added : flag});
    }
    catch (error) {
        console.error(error);

    }
});

module.exports = router;
