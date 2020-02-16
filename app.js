//		DECLARING VARIABLES AND REQUIRING PACKAGES & MODULES		
//========================================================
const express 				= require('express'),
	  path 					= require('path'),
	  multer				= require('multer'),
	  flash                 = require('connect-flash'),
	  app 					= express(),
	  bodyParser 			= require('body-parser'),
	  mongoose 				= require('mongoose'),
	  passport 				= require('passport'),
	  LocalStrategy 		= require('passport-local'),
	  passportLocalMongoose = require('passport-local-mongoose'),
	  methodOverride 		= require('method-override'),
	  expressSanitizer 		= require('express-sanitizer'),
	  fs					= require('fs')

//					APP CONFIGURATIONS
//=============================================================
mongoose.connect("mongodb://localhost:27017/IOSK",{
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
});

app.use(require('express-session')({
	secret: "Secret because it's secret",
	resave: false,
	saveUninitialized: false
}));

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
// app.use(expressSanitizer());
// app.use(flash());
// app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	// res.locals.error = req.flash("error");
	// res.locals.success = req.flash("success");
	next();
});

//							STORAGE ENGINE FOR FILES
//==========================================================================
var Storage = multer.diskStorage({
	destination:"public/uploads/",
	filename:(req,file,cb)=>{
		var d = new Date();
		var year  = d.getFullYear();
		var month = d.getMonth()+1;
		var day = d.getDate();
		var date = month + "_" + day + "_" + year;
		cb(null,file.fieldname+"_"+date+path.extname(file.originalname));
	}
});

var upload = multer({
	storage:Storage
}).single('file');

//								MONGOOSE MODELS
//==========================================================================
var UserSchema = new mongoose.Schema({
	firstname: String,
	middlename: String,
	lastname: String,
	username: String,
	birthdate: String,
	gender: String,
	email: String,
	province: String,
	city: String,
	zipcode: String,
	brgy: String,
	work: String,
	photo: String,
	password: String
    },{timestamps: true});

UserSchema.plugin(passportLocalMongoose);

var User = mongoose.model("User", UserSchema);




//								PASSPORT CONFIG
//==========================================================================
passport.use(new LocalStrategy(User.authenticate()));
//ENCODING SESSION
passport.serializeUser(User.serializeUser());
//DECODING SESSION
passport.deserializeUser(User.deserializeUser());

//=======================================================
// 					RESTFUL ROUTES 
//=======================================================
app.get('/',(req,res)=>{
    res.render('home');
});

//>>>REGISTRATION ROUTES<<<<\\============================================================
app.get("/register",function(req,res){
	res.render("register");
});

app.post("/register",upload,function(req,res){
	var firstname = req.body.firstname;
	var middlename = req.body.middlename;
	var lastname =req.body.lastname;
	var username = req.body.username;
	var birthdate = req.body.birthdate;
	var gender = req.body.gender;
	var email = req.body.email;
	var province = req.body.province;
	var city = req.body.city;
	var zipcode = req.body.zipcode;
	var brgy = req.body.brgy;
	var work = req.body.work;
	var photo = req.file.filename;
	var employee = {firstname:firstname,middlename:middlename,lastname:lastname,username:username,birthdate:birthdate,gender:gender,email:email,province:province,city:city,zipcode:zipcode,brgy:brgy,work:work,photo:photo}
	User.register(new User(employee),req.body.password, function(err,user){
		if(err){
			console.log(err);
			// req.flash("error", err.message);
			return res.render("register");
		}
		passport.authenticate('local')(req,res, function(){
				console.log(user)
				// req.flash("success","Your Account has been Created Successfully! Welcome " + user.username);
				res.redirect('/login');
			});
		});
	});

//Login Route | Login logic
app.get('/login',(req,res)=>{
	res.render('login');
});

app.post('/login',passport.authenticate('local',{
	successRedirect: "/employee/dashboard",
	failureRedirect: "/login"
}),function(req,res){
});

//>>>LOG-OUT ROUTE<<<\\
app.get('/logout',function(req,res){
	req.logOut();
	// req.flash("success", "You are Logged Out Successfully");
	res.redirect('/');
})


//>>>Employee Routes<<<\\
app.get('/employee/dashboard',(req,res)=>{
	res.render('dashboard');
})

app.get('/employee/profile',(req,res)=>{
	res.render('profile');
})

app.get('/admin/panel',(req,res)=>{
	res.render('admin-panel');
})




// SERVER INITIALIZE
app.listen(3000,()=>{
    console.log('Server has started at PORT 3000');
});