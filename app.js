var express = require("express"),
    app     = express();

app.set("view engine", "ejs");

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
    res.render("partywall/new");
});

app.listen("3000", function(){
    console.log("Application Started....")
});