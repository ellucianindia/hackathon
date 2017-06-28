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

//for parsing application/json data
app.use(bodyParser.json());

//for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))

app.get('/users', function(req,res)
{
	console.log("GET");
	var cursor = db.collection('userlist').find().toArray(function(err, results) 
	{
		res.json(results)
	})
}); 

app.post('/users', function(req, res) 
{
	console.log("POST");
	db.collection('userlist').insert(req.body, function (error, results) 
	{
		var cursor = db.collection('userlist').find().toArray(function(err, results) 
		{
			res.json(results)
		})
	});
});

//delete by id
app.delete('/users/:id', function(req, res)
{
	var id = req.params.id;
	console.log("DELETE");
	db.collection('userlist').findOneAndDelete({_id: ObjectId(id)},function(error, results)
	{
		var cursor = db.collection('userlist').find().toArray(function(err, results) 
		{
			res.json(results)
		})
	});
});

//search by id
app.get('/users/:id', function(req, res)
{
	var id = req.params.id;
	console.log("GET by ID" + id);
	
	db.collection('userlist').findOne({_id: ObjectId(id)},function(error, results) 
	{
		res.json(results);
	});
});

//search by expertise
/*app.get('/users/search/:id', function(req, res)
{
	var id = req.params.id;
	console.log("HELLO - GET by SearchString " + id);
	//db.collection('userlist').find({expertize : { $regex : id }},function(error, results)
			db.collection('userlist').find(function (err, results)
	{
		console.log(error);
		console.log(results);
		res.json(results);
	});
});*/
app.get('/users/search/:id', function(req,res)
		{
		var id = req.params.id;
			console.log("HELLO - GET by SearchString " + id);
			var cursor = db.collection('userlist').find().toArray(function(err, results) 
			{
				console.log(results)
				res.json(results)
			})
		}); 


//update
app.put('/users/:id', function(req, res)
{
	var id = req.params.id;
	console.log("UPDATE " + id + ", name :: " + req.body.firstName);
	db.collection('userlist').findOneAndUpdate({_id: ObjectId(id)},
		{$set: {
			credits: req.body.credits, 
			firstName: req.body.firstName, 
			lastName: req.body.lastName, 
			team: req.body.team
		}
	}, {upsert: false}, function(error, doc) {
		if (error) 
		{
			throw error;
		}
		var cursor = db.collection('userlist').find().toArray(function(err, results) 
		{
			res.json(results)
		})
	});	
	
});
