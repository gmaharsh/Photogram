var express = require('express');

var app = express();

var bp = require('body-parser');

var mongoose = require('mongoose');

var passport = require('passport');

var Local = require('passport-local');

var User = require('./models/user');

mongoose.connect("mongodb://localhost/yelp_camp");

//Passport Configs

app.use(require("express-session")({
	secret:"Nishu",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new Local(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Schema Setup
var campgroundSchema = new mongoose.Schema({
	name:String,
	image:String
});


var Campgrounds = mongoose.model("Campgrounds",campgroundSchema);


// Campgrounds.create(
// {
// 	// name:"Maharsh_College",
// 	// image:"https://scontent.fmaa1-2.fna.fbcdn.net/v/t31.0-8/16722602_969277046507602_7012426065668438724_o.jpg?oh=7c495b7bbcf4744e9acf772b0806b116&oe=595E51C6"
// },function(err,campground){
// 	if(err){
// 		console.log("Something Appers To be Wrong");
// 	}else{
// 		console.log("Newly created campground");
// 		console.log(campground);
// 	}
// });


app.use(bp.urlencoded({extended:true}));

app.set("view engine","ejs");

	// var campgrounds = [

	//      {
	//      	name:"Nishi_Home",image:"https://scontent.fmaa1-2.fna.fbcdn.net/v/t1.0-0/p526x296/17201052_1550458681650613_1201541429451415486_n.jpg?oh=6bfe23338b7a38f94bfacd42e9095444&oe=595E50C0"
	//      },
	//      {
	//      	name:"Nishi_College",image:"https://scontent.fmaa1-2.fna.fbcdn.net/v/t1.0-9/17190916_1796699780656324_399644457431609069_n.jpg?oh=486bfd03fc04297b9f11b149359f81a5&oe=5928E4B2"
	//      },
	//      {
	//      	name:"Nishi_Traditional",image:"https://scontent.fmaa1-2.fna.fbcdn.net/v/t31.0-8/s960x960/16804461_1528969687132846_7493665328945830110_o.jpg?oh=9a7b565e7b04ec71764c79431f4fa958&oe=5959BE1B"
	//      }
	// ];

app.get("/",function(req,res){
	res.render("home");
});

app.get("/campgrounds",isLoggedIn,function(req,res){
	Campgrounds.find({},function(err,memories){
		if(err){
			console.log("You Met With An Error");
		}else{
			console.log("You Met With A Result");
			res.render("campgrounds",{campground : memories});
		}
	});
	
});

app.post("/campgrounds",function(req,res){
	var name = req.body.name;
	console.log(req.body.name);
	var image = req.body.image;
	var  newcamp = {name:name,image:image};
	// campgrounds.push(newcamp);
	Campgrounds.create(newcamp,function(err,newmemories){
		if(err){
			console.log(err);
		}else{
			// console.log();
        	res.redirect("/campgrounds");			
		}
	});

});

app.get("/new",function(req,res){
	// Campgrounds.drop();
	res.render("new");
});


//================================================================================================================================================================
//                                                                   Authentication
//================================================================================================================================================================

app.get("/register",function(req,res){
	res.render("register");
});

app.post("/register",function(req,res){
	var newUser = new User({username:req.body.username});
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			console.log(err);
			return res.render("register");
		}else{
			passport.authenticate("local")(req,res,function(){
				res.redirect("/campgrounds");
			});
		}
	});
// res.send("We have received a post request");
});


//================================================================================================================================================================================================
//                                                                                      LOGIN
//================================================================================================================================================================================================

app.get("/login",function(req,res){
	res.render("login");
});

app.post("/login",passport.authenticate("local",{
	successRedirect:"/campgrounds",
	failureRedirect:"/login"
}),function(req,res){
});


//================================================================================================================================================================
//                                                                                     LogOut
//================================================================================================================================================================
app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/login");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
//=================================================================================================================================================================================================
//                                                                                  Server Listening
//=================================================================================================================================================================================================

app.listen(2903,function(req,res){
	console.log("Server is Running");
});