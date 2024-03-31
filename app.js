const express = require("express");
const hash = require("object-hash");
const app = express();
const mongoose = require("mongoose");

//connection with database
mongoose.connect("mongodb+srv://admin-harshit:test123@cluster0.5v6tyuh.mongodb.net/blockchain");

// schema defined 
const blockSchema = mongoose.Schema({
    id:{
        type:Number
    },
    innerBlock:
    {
        lastBlock: String,
        transaction: String
    },
    currentHash: String
}, { versionKey: false });

//collection created
const blocks = new mongoose.model("block", blockSchema);

//function to create a new block or new entry
function block(lastBlock, transaction) {
    const block = {
        innerBlock:
        {
            lastBlock: hash(lastBlock),
            transaction: hash(transaction)
        },
        currentHash: null
    }
    block.currentHash = hash(block.innerBlock);
    return block;
}

const genisisBlock = {
    innerBlock: {
        previousBlock: 0,
        transaction: null
    },
    currentHash: null
}
genisisBlock.currentHash = hash(genisisBlock.innerBlock);

app.get("/", function (req, res) {
    res.send("hello world");
});  


app.post("/", async function (req, res) {
    
    const transaction = req.query.transaction;
    console.log(transaction);

    var lastEntry = null;

    const count = await blocks.countDocuments();
    console.log(count);

    if (count == 0) {
        lastEntry = genisisBlock
    } else {
        await blocks.findOne({}, {}, { sort: { '_id': -1 } }).then(function (lastBlock, err) {
            if (err) {
                console.error("Error retrieving last block:", err);
                return;
            }
            lastEntry = {
                innerBlock: lastBlock.innerBlock,
                currentHash: lastBlock.currentHash
            };
            console.log("Last inserted block:", lastBlock);
            console.log(hash(lastBlock._id));
        });
    }
    
    const newBlock = block(lastEntry, transaction);
   
    const newEntry = new blocks({
        id: count + 1,
        innerBlock:
        {   
            lastBlock: newBlock.innerBlock.lastBlock,
            transaction: newBlock.innerBlock.transaction
        },
        currentHash: newBlock.currentHash
    });
    
    newEntry.save().then(function () {
        res.send("voted sccessfully");
    });

});

app.get("/calculate", function (req, res) {
    Vote = {
        BJP : 0,
        Congress : 0
    }
    
    // Retrieve documents from the collection
    const cursor = blocks.find().sort({ _id: 1 }); // Sorting by _id in ascending order
    console.log(cursor); // Log the cursor object to inspect its properties

    previousHash = hash(genisisBlock);
    // Iterate over the cursor

    cursor.toArray().then(docs => {
        docs.forEach(doc => {
            if(doc.innerBlock.lastBlock != previousHash){
                res.send("Verification not successful")
                return;
            }
            if(hash(doc.innerBlock.transaction) == hash("BJP")){
                Vote.BJP++;
            }
            if(hash(doc.innerBlock.transaction) == hash("Congress")){
                Vote.Congress++;
            }
            if(hash(doc.innerBlock) != doc.currentHash){
                res.send("Verification not successful")
                return;
            }
            previousHash = hash(doc);
          // Process each document here
          console.log(doc);
        });
      });
      

    // cursor.forEach(doc => {
    //     // Process the document
    //     console.log(doc);
        
    // }, err => {
    //     if (err) {
    //         console.error("Error iterating over cursor:", err);
    //         return;
    //     }
    //     console.log("Cursor iteration complete.");
    // });
    
    res.send(Vote);
});


app.listen(3000, function () {
    console.log("server on at 3000");
});
  

