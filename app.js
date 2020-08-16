var express = require("express"),
    bodyParser = require("body-parser"),
    app     = express(),
    mongoose    = require("mongoose"),
    methodOverride  = require("method-override"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    PartyWall = require("./models/partywall")



mongoose.connect("mongodb://localhost/partywall", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

// Index Route
app.get("/partywall", function(req, res){
    PartyWall.find({}, function(err, orders){
        if(err){
            console.log(err);
        } else{
            res.render("partywall/index", {orders: orders});
        }
    });
});

// Create Route
app.post("/partywall", function(req, res){
    var category = req.body.category;
    console.log(category)
    category.forEach(element => {
        if(element === "Food"){
            var name = (req.body.name)[0];
            var description = (req.body.desc);
            var weight = (req.body.weight);
            var price = (req.body.price)[0];
            var quantity = (req.body.quantity)[0];
            var newOrder = {name:name, description:description, price:price, weight:weight, quantity:quantity, category:element}
            // Create a new order in the DB
            PartyWall.create(newOrder, function(err, newlyCreated){
                if(err){
                    console.log(err);
                } else{
                    res.redirect("/partywall");
                }
            })
        } else if(element === "Drink"){
            var name = (req.body.name)[1];
            var volume = (req.body.volume);
            var price = (req.body.price)[1];
            var quantity = (req.body.quantity)[1];
            var newOrder = {name:name, description:"", price:price, weight:volume, quantity:quantity, category:element}
            // Create a new order in the DB
            PartyWall.create(newOrder, function(err, newlyCreated){
                if(err){
                    console.log(err);
                } else{
                    res.redirect("/partywall");
                }
            })
        }
    });
});

// New Post Route
app.get("/partywall/new", function(req, res){
    res.render("partywall/new");
});

// Show Post Route
app.get("/partywall/:id", function(req, res){
    PartyWall.findById(req.params.id, function(err, foundOrder){
        if(err){
            console.log(err);
        } else{
            res.render("partywall/show", {order: foundOrder});
        }
    });
})

app.listen("3000", function(){
    console.log("Application Started....")
});