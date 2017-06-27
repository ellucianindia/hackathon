var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient

app.use(express.static(__dirname));

app.use(express.static(__dirname));

var db;

MongoClient.connect('mongodb://sysdb:Ellucian123@ds137882.mlab.com:37882/myhackathon', function(err, database) 
{
  if (err) return console.log(err)
  db = database;
  app.listen(3000, function() 
  {
	console.log("Listening at 3000")
  })
})

app.use(bodyParser.urlencoded({extended: true}))

app.get('/users', function(req,res)
{
	console.log("HELLO - GET");
	var cursor = db.collection('userlist').find().toArray(function(err, results) 
	{
		console.log(results)
		res.json(results)
	})
}); 

app.post('/users', function(req, res) 
{
	console.log("HELLO - POST");
	db.collection('userlist').insert(req.body,function (error, results) 
	{
		db.collection('userlist').find(function (err, results) 
		{
		res.json(results);
	});
	});
});

//delete by id
app.delete('/users/:id', function(req, res)
{
	var id = req.params.id;
	console.log("HELLO - DELETE");
	db.collection('userlist').findOneAndDelete({_id: ObjectId(id)},function(error, results)
	{
		db.collection('userlist').find(function (err, results)
		{
			res.json(results);
		});
	});
});

//search by id
app.get('/users/:id', function(req, res)
{
	var id = req.params.id;
	console.log("HELLO - GET by ID" + id);
	db.collection('userlist').findOne({_id: ObjectId(id)},function(error, results) 
	{
		console.log(results)
		res.json(results);
	});
});

//update
app.put('/users/:id', function(req, res)
{
	var id = req.params.id;
	console.log("HELLO - UPDATE " + id);
	console.log("id= " + id + "  firstName" + req.body.firstName);
	db.collection('userlist').findOneAndUpdate({query:{_id:ObjectId(id)},
	update:{$set:{credits:req.body.credits, firstName:req.body.firstName, lastName:req.body.lastName, team:req.body.team}}, new:true},function(error, doc)
	{
		db.collection('userlist').find(function (err,results)
		{
			res.json(results);
		});
	});
	
});
