const express = require("express");
const hash = require("object-hash");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
//connection with database
mongoose.connect("mongodb+srv://admin-harshit:test123@cluster0.5v6tyuh.mongodb.net/blockchain");



const Candidates = ["Bjp", "Congress", "Aap"]
//connection with database


// schema defined 
const blockSchema = mongoose.Schema({
    _id: Number,
    innerBlock:
    {
        lastBlock: String,
        transaction: String
    },
    currentHash: String,
    date: String
}, { versionKey: false });

//collection created
const blocks = new mongoose.model("block", blockSchema);

//function to create a new block or new entry
function block(lastBlock, transaction, count) {
    const block = {
        _id: count,
        innerBlock:
        {
            lastBlock: hash(lastBlock),
            transaction: hash(transaction)
        },
        currentHash: null,
        date: new Date()
    }
    block.currentHash = hash(block.innerBlock);
    return block;
}


function findWinner(votes) {
    let maxVotes = -Infinity;
    let winner = null;
    for (const candidate in votes) {
        if (votes.hasOwnProperty(candidate)) {
            const voteCount = votes[candidate];
            if (voteCount > maxVotes) {
                maxVotes = voteCount;
                winner = candidate;
            }
        }
    }
    return winner;
}

const genisisBlock = {
    _id: -1,
    innerBlock: {
        lastBlock: 0,
        transaction: null
    },
    currentHash: null,
    date: null
}
genisisBlock.currentHash = hash(genisisBlock.innerBlock);

app.get('/', (req, res) => {  
    res.render("index");
});  

app.post("/", async function (req, res) {

    const transaction = req.query.transaction;
    console.log(transaction);

    if (Candidates.includes(transaction)) {

        var lastEntry = null;

        const count = await blocks.countDocuments();
        console.log(count);

        if (count == 0) {
            lastEntry = genisisBlock
        } else {
            await blocks.findOne({ _id: count - 1 }).then(function (lastBlock, err) {
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
        // const total_documents = db.blocks.count()
        const newBlock = block(lastEntry, transaction, count);
        var tmp = 0
        const newEntry = new blocks({
            _id: newBlock._id,
            innerBlock:
            {
                lastBlock: newBlock.innerBlock.lastBlock,
                transaction: newBlock.innerBlock.transaction
            },
            currentHash: newBlock.currentHash,
            date : newBlock.date
        });

        newEntry.save().then(function () {
            res.send("Vote casted sccessfully");
        });
    } else {
        res.send("Invalid Vote casted.Try Again!!");
    }
    console.log(req.get("User-Agent"));
});

app.get("/calculate", async function (req, res) {
    Vote = {} 
    Candidates.forEach(candidate => {
        Vote[candidate] = 0;
    });
    const count = await blocks.countDocuments();
    console.log(count)
    let hashLastBlock = hash(genisisBlock);
    // Fetch the first block separately
    await blocks.findOne({ _id: 0 }).then(function (Block, err) {
        Candidates.forEach(candidate => {
            if (Block.innerBlock.transaction == hash(candidate)) {
                Vote[candidate] = Vote[candidate] + 1
            }
        })
    });
    for (let i = 1; i < count; i++) { // Start from 1 since we've already processed the first block
        await blocks.findOne({ _id: i }).then(function (Block, err) {
            if (Block.innerBlock.lastBlock.localeCompare(hashLastBlock)) {
                console.log(Block._id)
                Candidates.forEach(candidate => {
                    if (Block.innerBlock.transaction == hash(candidate)) {
                        Vote[candidate] = Vote[candidate] + 1
                    }
                })
                newBlock={
                    _id:Block._id,
                    innerBlock:{
                        lastBlock:Block.innerBlock.lastBlock,
                        transaction:Block.innerBlock.transaction
                    },
                    currentHash:Block.currentHash,
                    date:Block.date
                }
                
                hashLastBlock = hash(newBlock)
            }
        })
    }
    res.send(Vote);
});

app.listen(3000, function () {
    console.log("server on at 3000");
});