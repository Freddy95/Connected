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
	console.log("ID -> " + req.query.user);
	if(sess.user){
		connection.getConnection(function(error,tempCont){
			if (error){
				tempCont.release();
				console.log('Error');
			}
			else{
				tempCont.query("select PageId from Pages WHERE Owner=?", [req.query.user], function(error,rows,fields){
					tempCont.release();
					if (error){
						console.log('Error HERE'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{
						console.log("PAGE ID -> " + rows[0].PageId);
						sess.PageId = rows[0].PageId;
						resp.jsonp(sess.PageId);
						resp.end();
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
				tempCont.query("select First_name, Last_name, UserId from User WHERE UserId=?", [sess.user], function(error,rows,fields){
					tempCont.release();
					if (error){
						console.log('Error in the query'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{
						console.log(rows);
						resp.json(rows);
						resp.end();
					}

				});
			}
		});
	}
});


app.get('/getOtherUser',function(req,resp){
	sess = req.session;//get session
	console.log('loggedin');
	if(sess.user){
		connection.getConnection(function(error,tempCont){
			if (error){
				tempCont.release();
				console.log('Error');
			}
			else{
				tempCont.query("select First_name, Last_name, UserId from User WHERE UserId=?", [sess.otherUser], function(error,rows,fields){
					tempCont.release();
					if (error){
						console.log('Error in the query'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{
						resp.json(rows);
						resp.end();
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
				tempCont.query("select Group_name , GroupId from Groups_data WHERE Owner=?", [req.query.user], function(error,rows,fields){
					tempCont.release();
					if (error){
						console.log('Error in the query'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{
						resp.json(rows);
						resp.end();
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
				tempCont.query("select G.Group_name, G.GroupId from Groups_data G, Joins J WHERE J.UserId=? AND J.Stat='accepted' AND J.GroupId=G.GroupId", [req.query.user], function(error,rows,fields){
					tempCont.release();
					if (error){
						console.log('Error in the query'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{
						console.log(req.query.user);
						console.log("rows: "+ rows);
						resp.json(rows);
						resp.end();

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
				tempCont.query("SELECT P.Content, P.PostId, S.Owner FROM Posts_data P, Pages S WHERE S.Owner=? AND P.PageId=? ORDER BY PostId DESC", [req.query.user, sess.PageId], function(error,rows,fields){
					tempCont.release();
					if (error){
						console.log('Error in the query'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{
						console.log("PAGE ID -> " + sess.PageId);
						resp.json(rows);
						resp.end();
					}

				});
			}
		});
	}
});


app.get('/getcomments',function(req,resp){//get posts on user page
	sess = req.session;//get session
	if(sess.user){
		connection.getConnection(function(error,tempCont){
			if (error){
				tempCont.release();
				console.log('Error');
			}
			else{
				tempCont.query(
					"SELECT U.UserId, U.First_name, U.Last_name, C.Content, C.CommentId FROM User U, Comments_data C, Posts_data P WHERE U.UserId=C.Author AND P.PostId=? AND C.PostId=P.PostId", [req.query.post], function(error,rows,fields){
					tempCont.release();
					if (error){
						console.log('Error in the query'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{
						resp.json(rows);
						resp.end();
					}

				});
			}
		});
	}
});


app.get('/getcommentlikes',function(req,resp){//get posts on user page
	sess = req.session;//get session
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
							resp.json(rows);
							resp.end();
						}

				});
			}
		});
	}
});

app.get('/editPost', function (req, resp) {
	sess = req.session;
	connection.getConnection(function (error, tempCont) {
			if(error){
				tempCont.release();
			}else{
				tempCont.query(

					"UPDATE Posts_data P SET Content=? WHERE P.PostId=?", [req.query.Content, req.query.Post], function(error,rows,fields){
					tempCont.release();
					console.log("HERRE");
					console.log(req.query.Content);
					console.log(req.query.Post);
					if (error){
						console.log('Error in the query'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{
						resp.json(rows);
						resp.end();
					}

				});
			}
	});
});

app.get('/editComment', function (req, resp) {
	sess = req.session;
	connection.getConnection(function (error, tempCont) {
			if(error){
				tempCont.release();
			}else{
				tempCont.query(

					"UPDATE Comments_data SET Content=? WHERE CommentId=?", [req.query.Content, req.query.CommentId], function(error,rows,fields){
					tempCont.release();
					console.log("HERRE");
					console.log(req.query.Content);
					console.log(req.query.Post);
					if (error){
						console.log('Error in the query'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{
						resp.json(rows);
						resp.end();
					}

				});
			}
	});
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
						resp.json(rows);
						resp.end();
					}

				});
			}
		});
	}
});

//used to find out if the user in the current session already like the post
app.get('/getuserlikes',function(req,resp){//get likes on post
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
					"SELECT  UserId FROM  Likes_data L, Posts_data P WHERE P.PostId=? AND L.PostId=P.PostId AND L.UserId=?", [req.query.post, sess.user], function(error,rows,fields){
					tempCont.release();
					if (error){
						console.log('Error in the query'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{
						resp.json(rows);
						resp.end();
					}

				});
			}
		});
	}
});

//used to find out if the user in the current session already like the comment
app.get('/getusercommentlike',function(req,resp){//get likes on post
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
					"SELECT  L.UserId FROM  Likes_data L, Comments_data C WHERE C.CommentId=? AND L.CommentId=C.CommentId AND L.UserId=?", [req.query.CommentId, sess.user], function(error,rows,fields){
					tempCont.release();
					if (error){
						console.log('Error in the query'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{
						console.log('LIKES -> ' + rows.length);
						resp.json(rows);
						resp.end();
					}

				});
			}
		});
	}
});


app.get('/likePost', function (req, resp) {
	sess = req.session;
	connection.getConnection(function (error, tempCont) {
		if(error){
			tempCont.release();
		}else{
			tempCont.query("INSERT INTO Likes_data (PostId, UserId) VALUES (?,?)", [req.query.Post, sess.user], function (error, rows, fields) {
				tempCont.release();
				if(error){
					console.log("Error HERE")
					resp.end();
				}else{
					resp.jsonp("Success");
					resp.end();
				}
			})
		}
	});
});
app.get('/unlikePost', function (req, resp) {
	sess = req.session;
	connection.getConnection(function (error, tempCont) {
		if(error){
			tempCont.release();
		}else{
			tempCont.query("DELETE FROM Likes_data WHERE PostId=? AND UserId=?", [req.query.Post, sess.user], function (error, rows, fields) {
				tempCont.release();
				if(error){
					console.log("Error HERE")
					resp.end();
				}else{
					resp.jsonp("Success");
					resp.end();
				}
			})
		}
	});
});

app.get('/deletePost', function (req, resp) {
	sess = req.session;
	connection.getConnection(function (error, tempCont) {
		if(error){
			tempCont.release();
		}else{
			tempCont.query("DELETE FROM Posts_data WHERE PostId=?", [req.query.Post], function (error, rows, fields) {
				tempCont.release();
				if(error){
					console.log("Error HERE")
					resp.end();
				}else{
					resp.jsonp("Success");
					resp.end();
				}
			})
		}
	});
});


app.get('/deleteComment', function (req, resp) {
	sess = req.session;
	connection.getConnection(function (error, tempCont) {
		if(error){
			tempCont.release();
		}else{
			tempCont.query("DELETE FROM Comments_data WHERE CommentId=?", [req.query.CommentId], function (error, rows, fields) {
				tempCont.release();
				if(error){
					console.log("Error HERE")
					resp.end();
				}else{
					resp.jsonp("Success Deleting Comment");
					resp.end();
				}
			})
		}
	});
});

app.get('/likeComment', function (req, resp) {
	sess = req.session;
	connection.getConnection(function (error, tempCont) {
		if(error){
			tempCont.release();
		}else{
			tempCont.query("INSERT INTO Likes_data (CommentId, UserId) VALUES (?,?)", [req.query.CommentId, sess.user], function (error, rows, fields) {
				tempCont.release();
				if(error){
					console.log("Error HERE")
					resp.end();
				}else{
					resp.jsonp("Success");
					resp.end();
				}
			})
		}
	});
});
app.get('/unlikeComment', function (req, resp) {
	sess = req.session;
	connection.getConnection(function (error, tempCont) {
		if(error){
			tempCont.release();
		}else{
			tempCont.query("DELETE FROM Likes_data WHERE CommentId=? AND UserId=?", [req.query.CommentId, sess.user], function (error, rows, fields) {
				tempCont.release();
				if(error){
					console.log("Error HERE")
					resp.end();
				}else{
					resp.jsonp("Success");
					resp.end();
				}
			})
		}
	});
});



app.post('/PostMessage',function(req,resp){
	sess = req.session;
	//about mysql
	//to query
	connection.getConnection(function(error,tempCont){
		if (error){
			tempCont.release();
			console.log('Error');
		}
		else{

			tempCont.query("insert into Posts_data (PageId,Post_date,Content,Comment_count) Values (?,CURDATE(),?,0);", [sess.PageId, req.body.message], function(error,rows,fields){
				tempCont.release();
				if (error){
					console.log('Error in the query'+error);
					resp.jsonp("error");
					resp.end();
				}
				else{
					resp.render('PersonalPage.html');
					//resp.render('PersonalPage.html');
					// req.session.reload();
					resp.end();
				}

			});
		}
	});

});



app.get('/login', function(req, res) {//starting point
    res.render('login2.html');
		res.end();
});
app.post('/signup', function (req, resp) {
	connection.getConnection(function(error,tempCont){
		if (error){
			tempCont.release();
			console.log('Error');
		}
		else{
			tempCont.query(
				"INSERT INTO  User (First_name, Last_name, Email, Password, Address, City, State, Zip_code, Telephone, Preferences) VALUES(?,?,?,?,?,?,?,?,?,?)", [req.body.First_name, req.body.Last_name, req.body.Email, req.body.Password, req.body.Address, req.body.City, req.body.State, req.body.Zip_code, req.body.Telephone, req.body.Preferences], function(error,rows,fields){
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



app.get('/addComment', function (req, resp) {
	sess = req.session;
	console.log('user -> ' + sess.user);
	connection.getConnection(function(error,tempCont){
		if (error){
			tempCont.release();
			console.log('Error');
		}
		else{
			tempCont.query(
				"INSERT INTO  Comments_data (PostId, Date, Content, Author) VALUES(?,CURDATE(),?,?)", [req.query.Post,  req.query.CommentValue,  sess.user], function(error,rows,fields){
				tempCont.release();
				if (error){
					console.log('Error in the query'+error);
					resp.jsonp("error");
					resp.end();
				}
				else{
					resp.json("success");
					resp.end();
				}
			});
		}
	});
});

app.get('/getLastComment', function (req, resp) {
	connection.getConnection(function(error,tempCont){
		if (error){
			tempCont.release();
			console.log('Error');
		}
		else{
			tempCont.query(
				"SELECT U.First_name, U.Last_name, C.Content, C.CommentId FROM User U, Comments_data C, Posts_data P WHERE U.UserId=? AND U.UserId=C.Author AND P.PostId=? AND C.PostId=P.PostId ORDER BY CommentId DESC", [sess.user,  req.query.Post], function(error,rows,fields){
				tempCont.release();
				if (error){
					console.log('Error in the query'+error);
					resp.jsonp("error");
					resp.end();
				}
				else{
					resp.json(rows);
					resp.end();
				}
			});
		}
	});
});




app.get('/register', function (req, res) {
	res.render('Register.html');
	resp.end();
});
app.get('/logout', function (req, res) {
	sess = req.session;
	sess.user = null;
	req.session.destroy();
	res.render('login2.html');
	res.end();
});

app.post('/goToGroupPage',function(req,resp){
	sess = req.session;//get session
	if(sess.user){
		sess.group= req.body.GroupId;
		resp.render('GroupPage.html')
	}
	resp.end();

});

app.get('/getgroupname',function(req,resp){
	sess = req.session;//get session
	if(sess.user){
		connection.getConnection(function(error,tempCont){
			if (error){
				tempCont.release();
				console.log('Error');
			}
			else{
				tempCont.query("select Group_name from Groups_data WHERE GroupId=?", 1, function(error,rows,fields){
					tempCont.release();
					if (error){
						console.log('Error in the query'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{
						console.log("group name: "+rows[0].Group_name);
						resp.jsonp(rows[0].Group_name);
						resp.end();
					}

				});
			}
		});
	}
});


app.get('/getFriends',function(req,resp){
	sess = req.session;//get session
	if(sess.user){
		connection.getConnection(function(error,tempCont){
			if (error){
				tempCont.release();
				console.log('Error');
			}
			else{
				tempCont.query("select U.First_name, U.Last_name, U.UserId from User U, Requests_friends R WHERE (R.Sender=? or R.Receiver=?) and (U.UserId=R.Sender or U.UserId=R.Receiver) and R.Stat='accepted' and U.UserId!=?", [req.query.user, req.query.user, req.query.user], function(error,rows,fields){
					tempCont.release();
					if (error){
						console.log('Error in the query'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{
						resp.json(rows);
						resp.end();
					}

				});
			}
		});
	}
});



app.get('/getPersonInGroup',function(req,resp){
	sess = req.session;//get session
	if(sess.user){
		connection.getConnection(function(error,tempCont){
			if (error){
				tempCont.release();
				console.log('Error');
			}
			else{
				tempCont.query("select U.UserId from User U, Groups_data G, Joins J WHERE J.GroupId=G.GroupId and G.GroupId=? and J.UserId=U.UserId and U.UserId=? and J.Stat='accepted'", [sess.group, sess.otherUser], function(error,rows,fields){
					tempCont.release();
					if (error){
						console.log('Error in the query'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{
						resp.json(rows);
						resp.end();
					}

				});
			}
		});
	}
});

app.get('/getmembers',function(req,resp){//get groups user has joined
	sess = req.session;//get session
	if(sess.user){
		connection.getConnection(function(error,tempCont){
			if (error){
				tempCont.release();
				console.log('Error');
			}
			else{
				tempCont.query("select U.First_name, U.Last_name, U.UserId from User U, Joins J WHERE J.GroupId=? AND J.Stat='accepted' AND J.UserId=U.UserId", 1, function(error,rows,fields){
					tempCont.release();
					if (error){
						console.log('Error in the query'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{
						console.log('?///////////////////////////////');
						console.log("rows: "+ rows);
						console.log('?///////////////////////////////');
						resp.json(rows);
						resp.end();
					}

				});
			}
		});
	}
});

app.get('/getgroupposts',function(req,resp){//get posts on user page
	sess = req.session;//get session
	if(sess.user){
		connection.getConnection(function(error,tempCont){
			if (error){
				tempCont.release();
				console.log('Error');
			}
			else{
				tempCont.query("SELECT P.Content, P.PostId, S.Associated_group FROM Posts_data P, Pages S WHERE S.Associated_group=? AND P.PageId=? ORDER BY PostId DESC", [1, 11], function(error,rows,fields){
					tempCont.release();
					if (error){
						console.log('Error in the query'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{
						console.log("----------group Posts:" + rows);
						resp.json({rows:rows, UserId: sess.user});
					}

				});
			}
		});
	}
});

app.post('/PostGroupMessage',function(req,resp){
	sess = req.session;
	//about mysql
	//to query
	connection.getConnection(function(error,tempCont){
		if (error){
			tempCont.release();
			console.log('Error');
		}
		else{

			tempCont.query("insert into Posts_data (PageId,Post_date,Content,Comment_count) Values (?,CURDATE(),?,0);", [11, req.body.message], function(error,rows,fields){
				tempCont.release();
				if (error){
					console.log('Error in the query'+error);
					resp.jsonp("error");
					resp.end();
				}
				else{
					resp.render('GroupPage.html');
					//resp.render('PersonalPage.html');
					// req.session.reload();
					resp.end();
				}

			});
		}
	});

});

app.post('/goToUserPage',function(req,resp){
	sess = req.session;//get session
	if(sess.user){
		sess.otherUser= req.body.UserId;
		resp.render('UserPage.html')
	}
	resp.end();
});




app.get('/getUsersPage',function(req,resp){
	sess = req.session;//get session
	if(sess.user){
		resp.render('Users.html');
	}
});


app.get('/getAllUsers',function(req,resp){
		connection.getConnection(function(error,tempCont){
			if (error){
				tempCont.release();
				console.log('Error');
			}
			else{
				tempCont.query("select First_name, Last_name, UserId from User WHERE UserId!=?", [sess.user], function(error,rows,fields){
					tempCont.release();
					if (error){
						console.log('Error in the query'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{
						resp.json(rows);
						resp.end();
					}

				});
			}
		});

});

app.get('/addUser',function(req,resp){//add user to group
		connection.getConnection(function(error,tempCont){
			if (error){
				tempCont.release();
				console.log('Error');
			}
			else{
				tempCont.query("insert into joins values ('accepted', ?, ?)", [sess.otherUser, sess.group], function(error,rows,fields){
					tempCont.release();
					if (error){
						console.log('Error in the query'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{
						resp.end();
					}

				});
			}
		});

});


app.get('/removeUser',function(req,resp){//add user to group
		connection.getConnection(function(error,tempCont){
			if (error){
				tempCont.release();
				console.log('Error');
			}
			else{
				tempCont.query("DELETE FROM Joins WHERE UserId=? AND GroupId=?", [sess.otherUser, sess.group], function(error,rows,fields){
					tempCont.release();
					if (error){
						console.log('Error in the query'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{
						resp.end();
					}

				});
			}
		});

});

app.listen(1337);
