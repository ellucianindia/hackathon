var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient

app.use(express.static(__dirname));

var db;

const TAGS = "tags";

const USER_LIST = "userlist";

const QUESTION_LIST = "questionList";

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
	var cursor = db.collection(USER_LIST).find().toArray(function(err, results) 
	{
		res.json(results)
	})
}); 

app.post('/users', function(req, res) 
{
	console.log("POST");
	db.collection(USER_LIST).insert(req.body, function (error, results) 
	{
		var cursor = db.collection(USER_LIST).find().toArray(function(err, results) 
		{
			res.json(results)
		})
	});
});

//delete by id
app.delete('/question/:id', function(req, res)
{
	var id = req.params.id;
	console.log("DELETE");
	db.collection(QUESTION_LIST).findOneAndDelete({_id: ObjectId(id)},function(error, results)
	{
		var cursor = db.collection(QUESTION_LIST).find().toArray(function(err, results) 
		{
			res.json(results)
		})
	});
});

app.get('/tags', function(req, res) 
{
	db.collection(TAGS).find().toArray(function(error, results) 
	{
		res.json(results)
	})
});

//search by id
app.get('/users/:id', function(req, res)
{
	var id = req.params.id;
	console.log("GET by ID" + id);	
	db.collection(USER_LIST).findOne({_id: ObjectId(id)},function(error, results) 
	{
		res.json(results);
	});
});

app.get('/users/byId/:id', function(req, res)
{
	var id = req.params.id;
	console.log("GET by id " + id);
	var query = {_id: ObjectId(id)};
	var cursor = db.collection(USER_LIST).findOne(query, function(err, results) 
	{
		console.log(results)
		res.json(results)
	})
});

app.get('/users/byExpertise/:expertise', function(req, res)
{
	console.log("GET by expertize " + req.params.expertise);
	db.collection(USER_LIST).aggregate([
    { "$match": { "expertise.name": req.params.expertise }},
    { "$project": {
    	"firstName" : "$firstName",
    	"lastName" : "$lastName",
    	"team" : "$team",
    	"image" : "$image",
        "expertise": { 
            "$setDifference": [
                { "$map": {
                    "input": "$expertise",
                    "as": "p",
                    "in": { "$cond": [
                        { "$eq": [ "$$p.name", req.params.expertise ] },
                        "$$p",
                        false
                    ]}
                }},
                [false]   
            ]
        }
    }},
    { "$sort": { "expertise.credits": -1 } }
]).toArray(function(err, results) 
	{
		console.log("res : " + results)
		res.json(results)
	})
});

app.get('/users/byUsername/:userName', function(req, res)
{
	console.log("GET by userName " + req.params.userName);
	var query = {userName : req.params.userName};
	var cursor = db.collection(USER_LIST).find(query).toArray(function(err, results) 
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
	db.collection(USER_LIST).findOneAndUpdate({_id: ObjectId(id)},
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
		var cursor = db.collection(USER_LIST).find().toArray(function(err, results) 
		{
			res.json(results)
		})
	});	
});

//To Post a question along with tags
app.post('/postQuestion', function(req, res) 
		{
			console.log("POST");
			db.collection(QUESTION_LIST).insert(req.body, function (error, results) 
			{
				res.json(res.statusCode);
			});
		});

app.get('/question/byTitle/:question', function(req, res) {
	var question = req.params.question;
	if (question != "undefined") {
		var query = {"title" : new RegExp(question, 'i')};
		db.collection(QUESTION_LIST).find(query).toArray(function (err, docs) {
			res.json(docs);
		});
	} else {
		db.collection(QUESTION_LIST).find().sort({"publishedOn": -1}).limit(10).toArray(function (err, docs) {
			res.json(docs);
		});
	}
}); 

app.get('/question/byId/:id', function(req, res) {
	var id = req.params.id;
	var query = {_id: ObjectId(id)};
	db.collection(QUESTION_LIST).findOne(query,function(error, doc) {
		res.json(doc);
	});
});

app.put('/upVote/:id', function(req, res) {
	var id = req.params.id;
	db.collection(QUESTION_LIST).update(
    	{ _id: ObjectId(id), "answers.answerid": req.body.answerid},
    	{ $inc: { "answers.$.credits": 1 } },
    	false,
    	true
    );
    res.json("");
});

app.put('/downVote/:id', function(req, res) {
	var id = req.params.id;
	db.collection(QUESTION_LIST).update(
    	{ _id: ObjectId(id), "answers.answerid": req.body.answerid},
    	{ $inc: { "answers.$.credits": -1 } }, 
    	false,
    	true
    );
    res.json("");
});

app.put('/postAnswer/:id', function(req, res) {
	var id = req.params.id;
	console.log(id+"----"+req.body.answerid);
	db.collection('questionList').update(
		{ _id: ObjectId(id)},
		{$push: { "answers": req.body } ,
		$set: { "answered": "Yes" } }
		)
  		res.json("");
});

app.put('/downVoteTag/:id', function(req, res) {
	db.collection(USER_LIST).update(
		{userName: req.body.userName, "expertise.name": {$in: req.body.tags}},
		{ $inc: { "expertise.$.credits": -1 }}, {multi : true}
	);
	res.json("");
});

app.put('/upVoteTag/:id', function(req, res) {
	db.collection(USER_LIST).update(
		{userName: req.body.userName, "expertise.name": {$in: req.body.tags}},
		{ $inc: { "expertise.$.credits": 1 }}, {multi : true}
	);
	res.json("");
});