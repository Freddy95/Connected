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
app.engine('html', require('ejs').renderFile);
app.use(session({secret: 'ssshhhhh'}));
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, '/Public')));
app.set('views', __dirname + '/views');
var sess; // session
//User request to login
app.post('/PersonalPage',function(req,resp){
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

app.get('/getPageId',function(req,resp){
	sess = req.session;//get session
	if(sess.user){
		connection.getConnection(function(error,tempCont){
			if (error){
				tempCont.release();
				console.log('Error');
			}
			else{
				tempCont.query("select PageId from Pages WHERE UserId=?", [sess.user], function(error,rows,fields){
					tempCont.release();
					if (error){
						console.log('Error in the query'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{
						sess.PageId = rows[0].PageId;
						resp.jsonp(sess.PageId);
					}

				});
			}
		});
	}
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

app.post('/PostMessage',function(req,resp){
	sess = req.session;
	//about mysql
	//to query
	console.log('##############################');
	console.log(sess.PageId);
	console.log('##############################');

	connection.getConnection(function(error,tempCont){
		if (error){
			tempCont.release();
			console.log('Error');
		}
		else{
			console.log('no error');
			console.log(req.body);
			console.log('pageid '+req.body.PageId);
			console.log('content '+req.body.message);
			tempCont.query("insert into Posts_data (PageId,Post_date,Content,Comment_count) Values (?,CURDATE(),?,0);", [sess.PageId, req.body.message], function(error,rows,fields){
				tempCont.release();
				if (error){
					console.log('Error in the query'+error);
					resp.jsonp("error");
					resp.end();
				}
				else{
					resp.jsonp('success');
					// resp.render('PersonalPage.html');
					resp.end();
				}

			});
		}
	});

});



app.get('/login', function(req, res) {//starting point
    res.render('login2.html');
});
app.post('/signup', function (req, resp) {
	connection.getConnection(function(error,tempCont){
		if (error){
			tempCont.release();
			console.log('Error');
		}
		else{
			tempCont.query(
				"INSERT INTO  User (First_name, Last_name, Email, Password, Address, City, State, Zip_code, Telephone, Preferences, Account_number) VALUES(?,?,?,?,?,?,?,?,?,?, 900021)", [req.body.First_name, req.body.Last_name, req.body.Email, req.body.Password, req.body.Address, req.body.City, req.body.State, req.body.Zip_code, req.body.Telephone, req.body.CPassword], function(error,rows,fields){
				tempCont.release();
				if (error){
					console.log('Error in the query'+error);
					resp.jsonp("error");
					resp.end();
				}
				else{
					resp.render('login2.html');
					resp.end();
				}
			});
		}
	});
});



app.get('/register', function (req, res) {
	res.render('Register.html');
})
app.listen(1337);
