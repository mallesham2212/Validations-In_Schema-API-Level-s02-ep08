const express = require('express')
const  connectDb  = require('./config/database')
const app = express()
const User=require("./models/user");

app.use(express.json());
// This is how we can get the data from database with specify email get request

app.get("/user",async (req,res)=>{
	const userEmail= req.body.email;
	console.log(userEmail);
	try {
		const users=await User.find({Email:userEmail});
		res.send(users);		
	} catch (error) {
		res.status(404).send("User  not found: " + error.message);
	}
} )


//This is how we can update in the database 

app.patch("/user/:userId",async (req,res)=>{
	const userEmail=req.params.userId;
	const data=req.body;


	// API Level validation for changes in patch 

	
	console.log(data);
	console.log(userEmail);	
	try {
		const allow=["age","firstName","lastName","password","gender"];

	const newdata=Object.keys(data).every((k)=>allow.includes(k));
	if(!newdata){
		res.send("user update not allowed")
	}
		const updatedUser  = await User.findByIdAndUpdate(
            {_id :  userEmail }, data,{
				returnDocument:"after",
				runValidators:true
			});
		console.log(updatedUser);
        if (!updatedUser ) {
            return res.status(404).send("User not found");
        }
        res.send(updatedUser );

	}  catch (error) {
		res.status(404).send("User  not found: " + error.message);
	}
} )


// app.patch("/user",async (req,res)=>{
// 	const userId=req.body.userId;
// 	// here body will replace all the actual update you want
// 	const body=req.body;
// 	console.log(userId);
	
// 	try {
// 		const users=await User.findByIdAndUpdate({_id:userId}, body);
// 		console.log(users);
// 		res.send(users);
// 		console.log("updated succesfully");		
// 	}  catch (error) {
// 		res.status(404).send("user not found"+err.message());
// 	}
// } )



// This is how we can delete the required user from database

app.delete("/user",async (req,res)=>{
	const userEmail=req.body.Email;
	console.log(userEmail);	
	try {
		const users=await User.findOneAndDelete({Email:userEmail});
		res.send(users);
	}  catch (error) {
		res.status(404).send("User  not found: " + error.message);
	}
} )

// app.delete("/user",async (req,res)=>{
// 	const userid=req.body.Id;
// 	console.log(userid);
// 	try {
// 		const users=await User.findByIdAndDelete(userid);
// 		console.log(users);
// 		res.send(users);
// 	}  catch (error) {
// 		res.status(404).send("user not found"+err.message());
// 	}
// } )


app.post("/signup",async (req,res)=>{
	const user=new User(req.body);
	try {
		await user.save();
		res.send("user added succesfully")
	} catch (error) {
		res.status(404).send("User  not found: " + error.message);
	}
})
connectDb().then(()=>{
    console.log("connected to database");
	app.listen(4000, () => {
		console.log("server connecting...");
	})
}).catch((err)=>{
    console.error("data base cannot connected");
})


