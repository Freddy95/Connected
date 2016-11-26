//Required Modules
var express = require('express');
var mysql = require('mysql');
var session = require('express-session');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');

//connection pool
var connection = mysql.createPool({
	connectionLimit: 50,
	host:'localhost',
	user:'Connected_user',
	password:'password',
	database:'Connected'
});

app.use(bodyParser.urlencoded({ extended: true}));
app.set('views', __dirname);
app.engine('html', require('ejs').renderFile);
app.use(session({secret: 'ssshhhhh'}));
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, '/public')));
app.set('views', __dirname + '/views');
var sess; // session
//User request to login
app.post('/login',function(req,resp){
	sess = req.session;
	//about mysql
	//to query
	connection.getConnection(function(error,tempCont){
		if (error){
			tempCont.release();
			console.log('Error');
		}
		else{
			console.log(req.body.email);
			console.log(req.body.psw);
			tempCont.query("select UserId from User WHERE email=? AND password=?;", [req.body.email, req.body.psw], function(error,rows,fields){
				tempCont.release();
				if (error){
					console.log('Error in the query'+error);
					resp.jsonp("error");
					resp.end();
				}
				else{
					sess.user = rows[0].UserId;
					resp.render('PersonalPage.html');
					resp.end();
				}

			});
		}
	});

});


app.get('/getuser',function(req,resp){
	sess = req.session;//get session
	console.log('loggedin');
	if(sess.user){
		connection.getConnection(function(error,tempCont){
			if (error){
				tempCont.release();
				console.log('Error');
			}
			else{
				tempCont.query("select First_name, Last_name from User WHERE UserId=?", [sess.user], function(error,rows,fields){
					tempCont.release();
					if (error){
						console.log('Error in the query'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{
						console.log(rows);
						resp.json({name: rows[0].First_name + " " + rows[0].Last_name});
					}

				});
			}
		});
	}
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
	 resp.jsonp(1)
});


app.listen(1337)
