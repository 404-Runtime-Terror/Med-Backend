// For Perscription

// Require modules
const { MongoClient, ObjectId } = require("mongodb");
const express = require("express");
const router = express.Router();
const fetchData = require("../fetchData");
const encryption = require("../Encryption");
require("dotenv").config();

//connect to mongodb database
const client = new MongoClient(process.env.DB_URL, {
    useUnifiedTopology: true,
});

// to create data in database for editing patient data
async function createData(client, DBname, collectionName, pres, id, date) {
    
    //  connect to database
    await client.connect();
    const db = client.db(DBname);
    const collection = await db.collection(collectionName).aggregate().toArray();
    const AddCollection = db.collection(collectionName);
    
    // Encryption of prescription
    const hashedPassword = await encryption.encrypt(pres);
    
    // create data in database
    Data = {
        Date: date,
        prescription: hashedPassword.password,
        iv: hashedPassword.iv
    }


    collection[0].data.map(e=>{

        // check if its first time getting editted 
        if(e.Date === null){
            e.Date = date;
            e.prescription = hashedPassword.password;
            e.iv = hashedPassword.iv;
        }

        // else it will append the prescription
        else{
            collection[0].data.push(Data);
        }
    });

    // update the database
    AddCollection.updateOne({ _id: ObjectId(id) }, { $set: { data: collection[0].data } });

    // return the data
    return collection[0].data;
}

//get request
router.get("/", async (req, res) => {
    try {

        // get data from request
        const pres = req.query.pres;
        const id = req.query.userID;
        const patientID = req.query.patientID;
        const date = req.query.date;
        
        // Flag variable
        var flag;

        // to get the paitent list doctor have
        const data = await fetchData.Getkey(client, "Hackthon", "DocData", id);
        console.log(data)
        // if the key is present in the list
        if (data === false){
            flag = 0;
        }
        else{

            data.map((e) => {
                if (e.toString() === patientID) {
                    // set the flag
                    flag = 1;
                }
            })
            
        }
        // if the key is present in the list
        if (flag === 1) {

            // create data in database
            display = createData(client, "Hackthon", "PatientData",pres, patientID, date);
            res.status(200).json({edited : true});
        }
        // if the key is not present in the list
        else if (flag === 0){
            res.status(200).json({edited : false});
        }
    }
    catch (error) {
        console.error(error);

    }
});

module.exports = router;
