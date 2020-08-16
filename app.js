var express = require("express"),
    bodyParser = require("body-parser"),
    app     = express(),
    mongoose    = require("mongoose"),
    methodOverride  = require("method-override"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    PartyWall = require("./models/partywall"),
    User      = require("./models/user")



mongoose.connect("mongodb://localhost/partywall", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

// Passport Configuration
app.use(require("express-session")({
    secret: "Food",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

// Index Route
app.get("/partywall", function(req, res){
    PartyWall.find({}, function(err, orders){
        if(err){
            console.log(err);
        } else{
            res.render("partywall/index", {orders: orders, currentUser: req.user});
        }
    });
});

// Create Route
app.post("/partywall", isLoggedIn, function(req, res){
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
app.get("/partywall/new", isLoggedIn, function(req, res){
    res.render("partywall/new");
});

// Show Post Route
app.get("/partywall/:id", function(req, res){
    PartyWall.findById(req.params.id, function(err, foundOrder){
        if(err){
            console.log(err);
        } else{
            res.render("partywall/show", {order: foundOrder, currentUser: req.user});
        }
    });
})

// Destroy Post Route
app.delete("/partywall/:id", checkOrderOwnership, function(req, res){
    PartyWall.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/partywall");
        } else{
            res.redirect("/partywall");
        }
    })
})


// Auth Routes

// Register Page
app.get("/register", function(req, res){
    res.render("register");
});

// Register Logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        } else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("/partywall")
            });
        }
    });
})

// Login Page
app.get("/login", function(req, res){
    res.render("login");
});

// Login Logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/partywall",
        failureRedirect: "/login"
    }), function(req, res){

});

// Logout logic
app.get("/logout", function(req, res){
    req.logOut();
    res.redirect("/partywall")
});

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


app.listen("3000", function(){
    console.log("Application Started....")
});