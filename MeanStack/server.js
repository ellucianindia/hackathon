var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('contactlist',['contactlist']);
var bodyParser = require('body-parser');
app.use(express.static(__dirname + "/main/html"));
app.use(bodyParser.json());

app.get('/contactlist', function(req,res){
	console.log("hello world from node js");
	db.contactlist.find(function (err,docs){
		console.log(docs);
		res.json(docs);
	});
	/* person1={
		name:"abc",
		email:"abc@gmail.com",
		number:"1111111"
	};
	person2={
		name:"aaa",
		email:"aaa@gmail.com",
		number:"222222222"
	};
	person3={
		name:"ccc",
		email:"ccc@gmail.com",
		number:"33333333"
	};
	var contactList1 =[person1,person2,person3 ];
	res.json(contactList1);*/
}); 
app.post('/contactlist', function(req,res){
	console.log(req.body);
	db.contactlist.insert(req.body,function (error,docs){
		//console.log(res.json(docs));
		db.contactlist.find(function (err,docs){
		//console.log(docs);
		res.json(docs);
	});
	});
});
app.delete('/contactlist/:id', function(req,res){
	var id=req.params.id;
	console.log("id="+id);
	db.contactlist.remove({_id:mongojs.ObjectId(id)},function(error,doc){
		db.contactlist.find(function (err,docs){
			res.json(docs);
		});
	});
});
app.get('/contactlist/:id', function(req,res){
	var id=req.params.id;
	console.log("id="+id);
	db.contactlist.findOne({_id:mongojs.ObjectId(id)},function(error,doc){
		res.json(doc);
	});
});
//update
app.put('/contactlist/:id', function(req,res){
	var id=req.params.id;
	console.log("id="+id+"  name"+req.body.name);
	db.contactlist.findAndModify({query:{_id:mongojs.ObjectId(id)},
	update:{$set:{rating:req.body.rating,name:req.body.name,email:req.body.email,number:req.body.number}},
	new:true},function(error,doc){
		db.contactlist.find(function (err,docs){
			res.json(docs);
		});
	});
	
});

app.listen(3000);
console.log("server running on port 30000");