var express = require("express"),
    app     = express();


    
// Index Route
app.get("/partywall", function(req, res){
    res.send("Index Page!");
});

// Create Route
app.post("/partywall", function(req, res){
    res.send("New order created");
});

// New Post Route
app.get("/partywall/new", function(req, res){
    res.send("New Route");
});

app.listen("3000", function(){
    console.log("Application Started....")
});