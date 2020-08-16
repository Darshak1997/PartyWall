var express = require("express"),
    bodyParser = require("body-parser"),
    router     = express.Router(),
    mongoose    = require("mongoose"),
    methodOverride  = require("method-override"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    PartyWall = require("../models/partywall"),
    User      = require("../models/user")

// Index Route
router.get("/partywall", function(req, res){
    PartyWall.find({}, function(err, orders){
        if(err){
            console.log(err);
        } else{
            res.render("partywall/index", {orders: orders, currentUser: req.user});
        }
    });
});

// Create Route
router.post("/partywall", isLoggedIn, function(req, res){
    var category = req.body.category;
    console.log(category)
    category.forEach(element => {
        if(element === "Food"){
            var name = (req.body.name)[0];
            var description = (req.body.desc);
            var weight = (req.body.weight);
            var price = (req.body.price)[0];
            var quantity = (req.body.quantity)[0];
            var author = {
                id: req.user._id,
                username: req.user.username
            }
            var newOrder = {name:name, description:description, price:price, weight:weight, quantity:quantity, category:element, author:author}
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
            var author = {
                id: req.user._id,
                username: req.user.username
            }
            var newOrder = {name:name, description:"", price:price, weight:volume, quantity:quantity, category:element, author:author}
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
router.get("/partywall/new", isLoggedIn, function(req, res){
    res.render("partywall/new");
});

// Show Post Route
router.get("/partywall/:id", function(req, res){
    PartyWall.findById(req.params.id, function(err, foundOrder){
        if(err){
            console.log(err);
        } else{
            res.render("partywall/show", {order: foundOrder, currentUser: req.user});
        }
    });
})

// Destroy Post Route
router.delete("/partywall/:id", checkOrderOwnership, function(req, res){
    PartyWall.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/partywall");
        } else{
            res.redirect("/partywall");
        }
    })
})

// middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}

// middleware to check ownership of the post
function checkOrderOwnership(req, res, next){
    if(req.isAuthenticated()){
        PartyWall.findById(req.params.id, function(err, foundOrder){
            if(err){
                res.redirect("back");
            } else{
                // Does user own the order?
                if(foundOrder.author.id.equals(req.user._id)){
                    next();
                } else{
                    res.redirect("back");
                }
            }
        });
    } else{
        res.redirect("back");
    }
}

module.exports = router;