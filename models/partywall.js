var mongoose = require("mongoose");

var PartyWallSchema = new mongoose.Schema({
    name: String,
    description: String,
    weight: String,
    price: Number,
    quantity: Number,
    category: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }, username: String
    }
});

module.exports = mongoose.model("PartyWall", PartyWallSchema);