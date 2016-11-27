//Required Modules

//SELECT U.First_name, U.Last_name, C.Content, COUNT(L.LikeId) AS Likes FROM User U, Likes_data L, Comments_data C, Posts_data P WHERE U.UserId=C.Author AND P.PostId=1 AND C.PostId=P.PostId AND L.CommentId=C.CommentId GROUP BY U.First_name, U.Last_name, C.Content
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


app.get('/getownergroups',function(req,resp){// get groups user is the owner of
	sess = req.session;//get session
	if(sess.user){
		connection.getConnection(function(error,tempCont){
			if (error){
				tempCont.release();
				console.log('Error');
			}
			else{
				tempCont.query("select Group_name from Groups_data WHERE Owner=?", [sess.user], function(error,rows,fields){
					tempCont.release();
					if (error){
						console.log('Error in the query'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{
						console.log(rows);
						resp.json(rows);
					}

				});
			}
		});
	}
});

app.get('/getgroups',function(req,resp){//get groups user has joined
	sess = req.session;//get session
	if(sess.user){
		connection.getConnection(function(error,tempCont){
			if (error){
				tempCont.release();
				console.log('Error');
			}
			else{
				tempCont.query("select G.Group_name from Groups_data G, Joins J WHERE J.UserId=? AND J.Stat='accepted' AND J.GroupId=G.GroupId", [sess.user], function(error,rows,fields){
					tempCont.release();
					if (error){
						console.log('Error in the query'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{
						console.log(rows);
						resp.json(rows);
					}

				});
			}
		});
	}
});


app.get('/getuserposts',function(req,resp){//get posts on user page
	sess = req.session;//get session
	if(sess.user){
		connection.getConnection(function(error,tempCont){
			if (error){
				tempCont.release();
				console.log('Error');
			}
			else{
				tempCont.query("SELECT P.Content, P.PostId FROM Posts_data P, Pages S WHERE S.Owner=? AND P.PageId=S.PageId", [sess.user], function(error,rows,fields){
					tempCont.release();
					if (error){
						console.log('Error in the query'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{
						console.log(rows);
						resp.json(rows);
					}

				});
			}
		});
	}
});


app.get('/getcomments',function(req,resp){//get posts on user page
	sess = req.session;//get session
	console.log("post -> " + req.query.post);
	if(sess.user){
		connection.getConnection(function(error,tempCont){
			if (error){
				tempCont.release();
				console.log('Error');
			}
			else{
				tempCont.query(
					"SELECT U.First_name, U.Last_name, C.Content, C.CommentId FROM User U, Comments_data C, Posts_data P WHERE U.UserId=C.Author AND P.PostId=? AND C.PostId=P.PostId", [req.query.post], function(error,rows,fields){
					tempCont.release();
					if (error){
						console.log('Error in the query'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{
						console.log(rows);
						console.log("these are the comments");
						resp.json(rows);
					}

				});
			}
		});
	}
});


app.get('/getcommentlikes',function(req,resp){//get posts on user page
	sess = req.session;//get session
	console.log("comment -> " + req.query.comment);
	if(sess.user){
		connection.getConnection(function(error,tempCont){
			if (error){
				tempCont.release();
				console.log('Error');
			}
			else{
				tempCont.query(
					"SELECT COUNT(L.LikeId) AS Likes FROM Likes_data L, Comments_data C WHERE  L.CommentId=C.CommentId AND C.CommentId = ?",
					[req.query.comment], function(error,rows,fields){
					tempCont.release();
						if (error){
							console.log('Error in the query'+error);
							resp.jsonp("error");
							resp.end();
						}
						else{
							console.log(rows);
							console.log("these are the comments likes");
							resp.json(rows);
							resp.end();
						}

				});
			}
		});
	}
});

app.get('/getlikes',function(req,resp){//get likes on post
	sess = req.session;//get session
	console.log('GETTING POST LIKES');
	if(sess.user){
		connection.getConnection(function(error,tempCont){
			if (error){
				tempCont.release();
				console.log('Error');
			}
			else{
				tempCont.query(
					"SELECT  COUNT(L.LikeId) AS Likes FROM  Likes_data L, Posts_data P WHERE P.PostId=? AND L.PostId=P.PostId", [req.query.post], function(error,rows,fields){
					tempCont.release();
					if (error){
						console.log('Error in the query'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{
						console.log(rows);
						resp.json(rows);
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
