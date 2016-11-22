var express = require('express');
var mysql = require('mysql');
var app = express();
var test ={name:"test"}
var connection = mysql.createPool({
connectionLimit: 50,
host:'localhost',
user:'Connected_user',
password:'password',
database:'Connected'
});

app.get('/query',function(req,resp){

	//about mysql
	//to query
	connection.getConnection(function(error,tempCont){
		if (error){
			tempCont.release();
			console.log('Error');
		}
		else{
			console.log('connected!!!!!');
			console.log("req= "+req.query);
			resp.jsonp("testresp");
			// tempCont.query("select * from User",function(error,rows,fields){
			// 	tempCont.release();
			// 	if (error){
			// 		console.log('Error in the query'+error);
			// 	}
			// 	else{

			// 		resp.json(rows);
			
			// 	}

			// });
		}
	});
	
});

app.get('/gettest',function(req,resp){

	resp.jsonp("in_gettest ");
	
});


// this works
app.get('/posttest',function(req,resp){
	console.log(req.query.sql_statement);
	resp.jsonp("in_posttest");
	
});


app.listen(1337)