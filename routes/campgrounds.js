var express     = require("express"),
    Campground  = require("../models/campground"),
    router      = express.Router(),
    middleware  = require("../middleware");
    
//INDEX - show all campgrounds
router.get("/",function(req,res){
    //Get all campgrounds from database
    Campground.find({},function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index",{campgrounds: allCampgrounds});
        }
    });
});

//CREATE - add a new campground to DB
router.post("/",middleware.isLoggedIn,function(req,res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name,price: price,image: image,description: desc, author: author};
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campground
router.get("/new",middleware.isLoggedIn,function(req, res) {
    res.render("campgrounds/new");
});

//SHOW - show more info about one campground
router.get("/:id", function(req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error","Campground not found");
            res.redirect("back");
        } else {
            //render show template with that campground
            //console.log(foundCampground.comments[0].text);
            //console.log(JSON.stringify(foundCampground, null, "\t"));
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT - show edit form of particular campground
router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err,foundCampground){
        res.render("campgrounds/edit",{ campground : foundCampground});
    });
});

//UPDATE - show updated campground
router.put("/:id",middleware.checkCampgroundOwnership,function(req, res){
    Campground.findByIdAndUpdate(req.params.id , req.body.campground, function(err, updatedCampground){
        if (err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY - delete campground
router.delete("/:id",middleware.checkCampgroundOwnership,function(req, res) {
    Campground.findByIdAndRemove(req.params.id,function(err) {
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;