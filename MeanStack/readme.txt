Mean stack tutorial
-------------------------------
Steps:
---------------------
1.install node js and set the path 
2.creatre a folder any where
(eg.C:\MeanstackProject)
3.create one server.js file in created dir(eg.C:\MeanstackProject\server.js)
4.install express js
goto created dir.(eg. C:\MeanstackProject)
and run npm install express

5. open the server.js
and type
var express = require('express');
var app = express();
app.use(express.static(__dirname + "/main/html"));
app.listen(3000);
console.log("server running on port 30000");
6.goto cmd and type node server
if u r getting o/p like "server running on port 30000"
then your server is responding

MOngoDB
----------------------
https://www.youtube.com/watch?v=oVIeMfvgTz8
steps:
-----------
1.install in any folder(eg:C:\MongoDB)
2.run mongod in dmc from install bin dir(eg:C:\MongoDB\bin>mongod)
3.create dir in c drive like c:\data\db
4.run mongo from bin in other cmd from bin dir(eg:C:\MongoDB\bin>mongo)
(you will get connecting to: mongodb://127.0.0.1:27017)

MongoDB command:
---------------------
1.to show all db
show dbs
2.create database od switched to db
use databasename
3.to insert value in mongodb databse
db.databsename.insert({json format data})
(eg.db.contactlist.insert({name:'ramesh',email:'rames@gmail.com',number:'76454565666'}))
you will get 
WriteResult({ "nInserted" : 1 })
4.to see inserted value
db.databsename.find()
(eg. db.contactlist.find())
you will get response like
{ "_id" : ObjectId("592c3ae033fb3319a669cfa0"), "name" : "ramesh", "email" : "rames@gmail.com", "number" : "76454565666" }
5.to see in better format
db.databsename.find().pretty()
you will see

 "_id" : ObjectId("592c3ae033fb3319a669cfa0"),
 "name" : "ramesh",
 "email" : "rames@gmail.com",
 "number" : "76454565666"
 6.bul insert
 
 db.contactlist.insert([
 {rating:'10',name:'ramesh',email:'rames@gmail.com',number:'76454565666'},
 {rating:'10',name:'suresh',email:'suresh@gmail.com',number:'4567890678'},
 {rating:'10',name:'mahesh',email:'mahesh@gmail.com',number:'1234567890'}])
 7.to remove data
 db.databsename.remove({});
 (eg.db.contactlist.remove({});)
 
 
 install body parser
 -----------------------
 npm install body-parser from root folder (C:\MeanstackProject)