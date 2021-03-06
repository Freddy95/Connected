//Required Modules
//
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
			tempCont.query("select UserId from User WHERE Email=? AND Password=?", [req.body.email, req.body.psw], function(error,rows,fields){
				tempCont.release();
				if (rows.length==0){
					console.log('Error in the query'+error);
					resp.render('login2.html');

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
						sess.temp = sess.PageId;
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
				tempCont.query("select G.Group_name , G.GroupId ,P.PageId from Groups_data G, Pages P WHERE P.Associated_group = G.GroupId and G.Owner=?", [req.query.user], function(error,rows,fields){
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
				tempCont.query("select G.Group_name, G.GroupId, P.PageId from Groups_data G, Joins J, Pages P WHERE J.UserId=? AND J.Stat='accepted' AND J.GroupId=G.GroupId and G.GroupId = P.Associated_group", [req.query.user], function(error,rows,fields){
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



app.get('/getReceivedMessages',function(req,resp){//get all messages received by user
	sess = req.session;//get session
	if(sess.user){
		connection.getConnection(function(error,tempCont){
			if (error){
				tempCont.release();
				console.log('Error');
			}
			else{
				tempCont.query("SELECT *, First_name, Last_name FROM Messages_data, User WHERE Receiver=? AND Sender=UserId and Visible_by_receiver='Y' ORDER BY MessageId DESC", [sess.user], function(error,rows,fields){
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

app.get('/getSentMessages',function(req,resp){//get all messages sent by user
	sess = req.session;//get session
	if(sess.user){
		connection.getConnection(function(error,tempCont){
			if (error){
				tempCont.release();
				console.log('Error');
			}
			else{
				tempCont.query("SELECT *, First_name, Last_name FROM Messages_data, User WHERE Sender=? AND Receiver=UserId and Visible_by_sender='Y' ORDER BY MessageId DESC", [sess.user], function(error,rows,fields){
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


app.get('/deleteReceivedMessage',function(req,resp){//get posts on user page
	sess = req.session;//get session
	if(sess.user){
		connection.getConnection(function(error,tempCont){
			if (error){
				tempCont.release();
				console.log('Error');
			}
			else{
				tempCont.query("UPDATE Messages_data SET Visible_by_receiver='N' WHERE MessageId=?", [req.query.MessageId], function(error,rows,fields){
					tempCont.release();
					if (error){
						console.log('Error in the query'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{
						resp.json("deleted message");
						resp.end();
					}

				});
			}
		});
	}
});


app.get('/deleteSentMessage',function(req,resp){//delete sent message
	sess = req.session;//get session
	if(sess.user){
		connection.getConnection(function(error,tempCont){
			if (error){
				tempCont.release();
				console.log('Error');
			}
			else{
				tempCont.query("UPDATE Messages_data SET Visible_by_sender='N' WHERE MessageId=?", [req.query.MessageId], function(error,rows,fields){
					tempCont.release();
					if (error){
						console.log('Error in the query'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{
						resp.json("deleted messsage");
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

app.get('/editGroupName', function (req, resp) {
	sess = req.session;
	connection.getConnection(function (error, tempCont) {
			if(error){
				tempCont.release();
			}else{
				tempCont.query(

					"UPDATE Groups_data SET Group_name=? WHERE GroupId=?", [req.query.Content, sess.GroupId], function(error,rows,fields){
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

app.get('/Home', function (req, resp) {
	sess = req.session;

	if(sess.user){
		resp.render('PersonalPage.html');
		resp.end();
	}else{
		resp.json('error');
		resp.end();
	}

});
app.get('/sendMessage',function(req,resp){
	sess = req.session;
	//about mysql
	//to query
	connection.getConnection(function(error,tempCont){
		if (error){
			tempCont.release();
			console.log('Error');
		}
		else{

			tempCont.query("insert into Messages_data (Sender,Receiver, Subject, Content, Date) Values (?, ?, ?, ?, CURDATE())", [sess.user, sess.otherUser, req.query.Subject, req.query.Content], function(error,rows,fields){
				tempCont.release();
				if (error){
					console.log('Error in the query'+error);
					resp.jsonp("error");
					resp.end();
				}
				else{
					resp.send("Success sending message");
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
			if(!req.body.Zip_code){//zipcode must be a number
				console.log();
				req.body.Zip_code=null;
			}
			tempCont.query(
				"INSERT INTO  User (First_name, Last_name, Email, Password, Address, City, State, Zip_code, Telephone, Preferences) VALUES(?,?,?,?,?,?,?,?,?,?)", [req.body.First_name, req.body.Last_name, req.body.Email, req.body.Password, req.body.Address, req.body.City, req.body.State, req.body.Zip_code, req.body.Telephone, req.body.Preferences], function(error,rows,fields){
				if (error){
					console.log('Error in the query'+error);
					resp.jsonp("error");
					resp.end();
				}
				else{
					tempCont.query(
						"SELECT UserId FROM  User ORDER BY UserId DESC LIMIT 1",  function(error,rows2,fields){
						if (error){
							console.log('Error in the query'+error);
							resp.jsonp("error");
							resp.end();
						}
						else{
							tempCont.query(
								"INSERT INTO  Pages (Owner, Post_count) VALUES(?,?)", [rows2[0].UserId, 0], function(error,rows3,fields){
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

app.get('/addUser', function (req, resp) {
	sess = req.session;
	console.log('user -> ' + sess.user);
	connection.getConnection(function(error,tempCont){
		if (error){
			tempCont.release();
			console.log('Error');
		}
		else{
			tempCont.query(
				"INSERT INTO  Joins values ('accepted', ?, ?)", [sess.otherUser,  sess.GroupId], function(error,rows,fields){
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
	res.end();
});

app.get('/getMessagesPage', function (req, res) {
	res.render('Messages.html');
	res.end();
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
		sess.GroupId= req.body.GroupId;
		sess.PageId = req.body.PageId;
		resp.render('GroupPage.html')
	}
	resp.end();

});

app.get('/returnToGroupPage' ,function(req,resp){
	sess = req.session;//get session
	sess.PageId = sess.temp;
	resp.render('GroupPage.html');
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
				tempCont.query("select Group_name from Groups_data WHERE GroupId=?", sess.GroupId, function(error,rows,fields){
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
				tempCont.query("select U.UserId from User U, Groups_data G, Joins J WHERE J.GroupId=G.GroupId and G.GroupId=? and J.UserId=U.UserId and U.UserId=? and J.Stat='accepted'", [sess.GroupId, sess.otherUser], function(error,rows,fields){
					tempCont.release();
					if (error){
						console.log('Error in the query'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{
						resp.json(rows);
						console.log(rows);
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
				tempCont.query("select U.First_name, U.Last_name, U.UserId from User U, Joins J WHERE J.GroupId=? AND J.Stat='accepted' AND J.UserId=U.UserId", sess.GroupId, function(error,rows,fields){
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

app.get('/getownerofgroup',function(req,resp){//get groups user has joined
	sess = req.session;//get session
	if(sess.user){
		connection.getConnection(function(error,tempCont){
			if (error){
				tempCont.release();
				console.log('Error');
			}
			else{
				tempCont.query("select U.First_name, U.Last_name, U.UserId, G.GroupId from User U, Groups_data G WHERE G.GroupId=? AND G.Owner = U.UserId;", sess.GroupId, function(error,rows,fields){
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
						if(rows[0].UserId == sess.user){
							resp.json({rows:rows, Owner: 1});
						}else{
							resp.json({rows:rows, Owner:0});
						}

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
				tempCont.query("SELECT P.Content, P.PostId, S.Associated_group FROM Posts_data P, Pages S WHERE S.Associated_group=? AND P.PageId=? ORDER BY PostId DESC", [sess.GroupId, sess.PageId], function(error,rows,fields){
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

			tempCont.query("insert into Posts_data (PageId,Post_date,Content,Comment_count) Values (?,CURDATE(),?,0);", [sess.PageId, req.body.message], function(error,rows,fields){
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

app.post('/goToFriendPage',function(req,resp){
	sess = req.session;//get session
	if(sess.user){
		sess.otherUser= req.body.UserId;
		resp.render('FriendPage.html')
	}
	resp.end();
});

app.get('/getUsersPage',function(req,resp){
	sess = req.session;//get session
	if(sess.user){
		resp.render('Users.html');
	}
});

app.get('/getGroupsPage',function(req,resp){
	sess = req.session;//get session
	if(sess.user){
		resp.render('Groups.html');
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


app.get('/getAllGroups',function(req,resp){
		connection.getConnection(function(error,tempCont){
			if (error){
				tempCont.release();
				console.log('Error');
			}
			else{
				tempCont.query("select Group_name, GroupId from Groups_data",  function(error,rows,fields){
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


app.get('/joinGroup',function(req,resp){//add user to group
		connection.getConnection(function(error,tempCont){
			if (error){
				tempCont.release();
				console.log('Error');
			}
			else{
				tempCont.query("insert into Joins values ('accepted', ?, ?)", [sess.user, sess.GroupId], function(error,rows,fields){
					tempCont.release();
					if (error){
						console.log('Error in the query'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{
						resp.render('GroupPage.html');
						resp.end();
					}

				});
			}
		});

});

app.get('/userInGroup',function(req,resp){//check to see if user in group

		connection.getConnection(function(error,tempCont){

			if (error){

				tempCont.release();

				console.log('Error');

			}

			else{

				tempCont.query("SELECT UserId FROM Joins WHERE UserId=? AND GroupId=? AND Stat='accepted'", [sess.user, sess.GroupId], function(error,rows,fields){

					tempCont.release();

					if (error){

						console.log('Error in the query' + error);

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
app.get('/removeUser',function(req,resp){
		connection.getConnection(function(error,tempCont){
			if (error){
				tempCont.release();
				console.log('Error');
			}
			else{
				tempCont.query("DELETE FROM Joins WHERE UserId=? AND GroupId=?", [sess.otherUser, sess.GroupId], function(error,rows,fields){
					tempCont.release();
					if (error){
						console.log('Error in the query'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{
						resp.jsonp("success");
						resp.end();
					}

				});
			}
		});

});

app.post('/leaveGroup',function(req,resp){
		connection.getConnection(function(error,tempCont){
			if (error){
				tempCont.release();
				console.log('Error');
			}
			else{
				tempCont.query("DELETE FROM Joins WHERE UserId=? AND GroupId=?", [sess.user, sess.GroupId], function(error,rows,fields){
					tempCont.release();
					if (error){
						console.log('Error in the query'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{
						sess.GroupId = -1;
						resp.render('PersonalPage.html')
						resp.end();
					}

				});
			}
		});
});

app.post('/DeleteGroup',function(req,resp){
		connection.getConnection(function(error,tempCont){
			if (error){
				tempCont.release();
				console.log('Error');
			}
			else{
				tempCont.query("DELETE FROM Groups_data WHERE GroupId=?", [sess.GroupId], function(error,rows,fields){
					tempCont.release();
					if (error){
						console.log('Error in the query'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{
						sess.GroupId = -1;
						resp.render('PersonalPage.html')
						resp.end();
					}

				});
			}
		});
});

app.post('/CreateGroup',function(req,resp){
	console.log('input = '+ req.body.GroupName);

		connection.getConnection(function(error,tempCont){
			if (error){
				tempCont.release();
				console.log('Error');
			}
			else{
				console.log('input = '+ req.body.GroupName);
				tempCont.query("insert into Groups_data(Group_name,Type,Owner) values(?,'club',?)", [req.body.GroupName,sess.user], function(error,rows,fields){
					if (error){
						console.log('Error in the query'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{
						tempCont.query("Select * from Groups_data order by GroupId desc limit 1;", function(error,rows2,fields){
							if (error){
								console.log('Error in the query2 '+error);
								resp.jsonp("error");
								resp.end();
							}
							else{
								console.log('groupid '+rows2[0].GroupId);
								tempCont.query("insert into Pages (Owner,Associated_group,Post_count) values(NULL,?,0);", [rows2[0].GroupId], function(error,rows3,fields){
									if (error){
										console.log('Error in the query'+error);
										resp.jsonp("error");
										resp.end();
									}
									else{
										tempCont.query("Select * from Groups_data G, Pages P where P.Associated_group = G.GroupId order by GroupId desc limit 1;", function(error,rows4,fields){
											tempCont.release();
											if (error){
												console.log('Error in the query'+error);
												resp.jsonp("error");
												resp.end();
											}
											else{
												resp.jsonp(rows4);
												resp.end();
											}

										});
									}

								});
							}

						});
					}

				});
			}
		});
});

app.post('/goToManagerPage',function(req,resp){
	sess = req.session;//get session
	if(sess.user){
		resp.render('ManagerPage.html')
	}
	resp.end();

});
app.post('/goToEmployeePage',function(req,resp){
	sess = req.session;//get session
	if(sess.user){
		resp.render('EmployeePage.html')
	}
	resp.end();

});

app.get('/getEmployeeStatus',function(req,resp){//check if user is an employee and what kind
		connection.getConnection(function(error,tempCont){
			if (error){
				tempCont.release();
				console.log('Error');
			}
			else{
				tempCont.query("SELECT E.Role FROM Employee_data E, User U WHERE U.UserId=? AND E.Social_security_number=U.EmployeeId", [sess.user], function(error,rows,fields){
					tempCont.release();
					if (error){
						console.log('Error in the query'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{
						resp.jsonp(rows);
						resp.end();
					}

				});
			}
		});

});


app.get('/getAllEmployees',function(req,resp){//check if user is an employee and what kind
		connection.getConnection(function(error,tempCont){
			if (error){
				tempCont.release();
				console.log('Error');
			}
			else{
				tempCont.query("Select DISTINCT U.* from User U, Employee_data E where U.EmployeeId>0 and E.Role!='Manager' and U.EmployeeId=E.Social_security_number",  function(error,rows,fields){
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


app.get('/getEmployeeData',function(req,resp){//check if user is an employee and what kind
		connection.getConnection(function(error,tempCont){
			if (error){
				tempCont.release();
				console.log('Error');
			}
			else{
				tempCont.query("SELECT U.*, E.Hourly_rate FROM User U, Employee_data E where U.UserId=? AND U.EmployeeId = E.Social_security_number",[req.query.User],  function(error,rows,fields){
					tempCont.release();
					if (error){
						console.log('Error in the query'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{
						resp.jsonp(rows);
						resp.end();
					}

				});
			}
		});

});

app.post('/updateEmployeeInfo',function(req,resp){//check if user is an employee and what kind
		connection.getConnection(function(error,tempCont){
			if (error){
				tempCont.release();
				console.log('Error');
			}
			else{
				tempCont.query("UPDATE User U INNER JOIN Employee_data E ON (U.EmployeeId = E.Social_security_number) SET U.First_name=?, U.Last_name=?, U.Address=?, U.City=?, U.State=?, U.Zip_code=?, U.Telephone=?, U.Preferences=?, E.Hourly_rate=? WHERE U.UserId=?",[req.body.First_name, req.body.Last_name,req.body.Address, req.body.City,req.body.State, req.body.Zip_code,req.body.Phone, req.body.Preferences,req.body.Hourly_rate, req.body.UserId],  function(error,rows,fields){
					tempCont.release();
					if (error){
						console.log('Error in the query'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{
						resp.render('ManagerPage.html');
						resp.end();
					}

				});
			}
		});

});

app.get('/getBestCustomer', function (req, resp) {//get best customer
	connection.getConnection(function(error,tempCont){
		if (error){
			tempCont.release();
			console.log('Error');
		}
		else{
			tempCont.query(//create max c view
				"CREATE VIEW MaxC AS SELECT UserId, Accounts.Account_number, Sales_data.Number_of_units * Unit_price AS Revenue FROM Sales_data LEFT JOIN Accounts ON Accounts.Account_number=Sales_data.Account_number LEFT JOIN Advertisements_data ON Advertisements_data.AdvertisementId=Sales_data.AdvertisementId",  function(error,rows,fields){
				if (error){
					console.log('Error in the query'+error);
					resp.jsonp("error");
					resp.end();
				}
				else{
					tempCont.query(//create Best cutomer view
						"CREATE VIEW BestCustomer AS SELECT UserId, SUM(Revenue) AS TOTAL FROM MaxC GROUP BY UserId;",  function(error,rows2,fields){
						if (error){
							console.log('Error in the query'+error);
							resp.jsonp("error");
							resp.end();
						}
						else{
							tempCont.query(//get the customer
								"SELECT U.First_name, U.Last_name FROM User U WHERE U.UserId = (SELECT UserId FROM BestCustomer WHERE Total=(SELECT MAX(Total) FROM BestCustomer))",  function(error,rows3,fields){
								if (error){
									console.log('Error in the query'+error);
									resp.jsonp("error");
									resp.end();
								}
								else{
									tempCont.query(//drop view maxc
										"DROP VIEW BestCustomer",  function(error,rows4,fields){
										if (error){
											console.log('Error in the query'+error);
											resp.jsonp("error");
											resp.end();
										}
										else{
											tempCont.query(//drop view best customer
												"DROP VIEW MaxC",  function(error,rows5,fields){
												if (error){
													console.log('Error in the query'+error);
													resp.jsonp("error");
													resp.end();
												}
												else{
													resp.json(rows3);
													resp.end();
												}
											});
										}
									});
								}
							});
						}
					});
				}
			});
		}
	});
});

app.get('/getBestEmployee', function (req, resp) {//get best employee
	connection.getConnection(function(error,tempCont){
		if (error){
			tempCont.release();
			console.log('Error');
		}
		else{
			tempCont.query(//create max e view
				"CREATE VIEW MaxE AS SELECT Social_security_number, Sales_data.Number_of_units * Unit_price AS Revenue FROM Advertisements_data LEFT JOIN Employee_data ON Employee_data.Social_security_number=Advertisements_data.EmployeeId LEFT JOIN Sales_data ON Advertisements_data.AdvertisementId=Sales_data.AdvertisementId",  function(error,rows,fields){
				if (error){
					console.log('Error in the query1'+error);
					resp.jsonp("error");
					resp.end();
				}
				else{
					tempCont.query(//create Best Employee view
						"CREATE VIEW BestEmployee AS SELECT Social_security_number, SUM(Revenue) AS Total FROM MaxE GROUP BY Social_Security_number",  function(error,rows2,fields){
						if (error){
							console.log('Error in the query2'+error);
							resp.jsonp("error");
							resp.end();
						}
						else{
							tempCont.query(//get the employee
								"SELECT U.First_name, U.Last_name FROM User U WHERE U.EmployeeId = (SELECT Social_security_number FROM BestEmployee WHERE Total=(SELECT MAX(TOTAL) FROM BestEmployee))",  function(error,rows3,fields){
								if (error){
									console.log('Error in the query3'+error);
									resp.jsonp("error");
									resp.end();
								}
								else{
									tempCont.query(//drop view maxc
										"DROP VIEW MaxE",  function(error,rows4,fields){
										if (error){
											console.log('Error in the query4'+error);
											resp.jsonp("error");
											resp.end();
										}
										else{
											tempCont.query(//drop view best customer
												"DROP VIEW BestEmployee",  function(error,rows5,fields){
												if (error){
													console.log('Error in the query5'+error);
													resp.jsonp("error");
													resp.end();
												}
												else{
													resp.json(rows3);
													resp.end();
												}
											});
										}
									});
								}
							});
						}
					});
				}
			});
		}
	});
});

app.get('/getAllItems',function(req,resp){//get all item list
		connection.getConnection(function(error,tempCont){
			if (error){
				tempCont.release();
				console.log('Error');
			}
			else{
				tempCont.query("select distinct Item_name from Advertisements_data;", function(error,rows,fields){
					tempCont.release();
					if (error){
						console.log('Error in the query'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{
						resp.jsonp(rows);
						resp.end();
					}

				});
			}
		});

});

app.get('/getBestItems',function(req,resp){//get best item list
		connection.getConnection(function(error,tempCont){
			if (error){
				tempCont.release();
				console.log('Error');
			}
			else{
				tempCont.query("SELECT A.Item_name, COUNT(*) AS Occurences FROM Advertisements_data A INNER JOIN Sales_data S ON A.AdvertisementId=S.AdvertisementId GROUP BY Item_name ORDER BY Occurences DESC LIMIT 5", function(error,rows,fields){
					tempCont.release();
					if (error){
						console.log('Error in the query'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{

						resp.jsonp(rows);
						resp.end();
					}

				});
			}
		});

});

app.get('/getEveryUser',function(req,resp){//check if user is an employee and what kind
		connection.getConnection(function(error,tempCont){
			if (error){
				tempCont.release();
				console.log('Error');
			}
			else{
				tempCont.query("select distinct UserId , First_name, Last_name from User;", function(error,rows,fields){
					tempCont.release();
					if (error){
						console.log('Error in the query'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{
						resp.jsonp(rows);
						resp.end();
					}

				});
			}
		});

});

app.get('/getAllItemTypes',function(req,resp){// gets all item types
		connection.getConnection(function(error,tempCont){
			if (error){
				tempCont.release();
				console.log('Error');
			}
			else{
				tempCont.query("select distinct A.Type from Sales_data S, Advertisements_data A where S.AdvertisementId = A.AdvertisementId;", function(error,rows,fields){
					tempCont.release();
					if (error){
						console.log('Error in the query'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{
						resp.jsonp(rows);
						resp.end();
					}

				});
			}
		});

});

app.get('/getAllCompanies',function(req,resp){// gets all item types
		connection.getConnection(function(error,tempCont){
			if (error){
				tempCont.release();
				console.log('Error');
			}
			else{
				tempCont.query("select Distinct Company from Advertisements_data;", function(error,rows,fields){
					tempCont.release();
					if (error){
						console.log('Error in the query'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{
						resp.jsonp(rows);
						resp.end();
					}

				});
			}
		});

});

app.get('/getMailingList',function(req,resp){// gets all item types
		connection.getConnection(function(error,tempCont){
			if (error){
				tempCont.release();
				console.log('Error');
			}
			else{
				tempCont.query("select Email From User;", function(error,rows,fields){
					tempCont.release();
					if (error){
						console.log('Error in the query'+error);
						resp.jsonp("error");
						resp.end();
					}
					else{
						resp.jsonp(rows);
						resp.end();
					}

				});
			}
		});

});

app.post('/getUserTransactions',function(req,resp){
	sess = req.session;
	//about mysql
	//to query
	connection.getConnection(function(error,tempCont){
		if (error){
			tempCont.release();
			console.log('Error');
		}
		else{
			tempCont.query("select S.TransactionId, S.Sale_date_time, S.Number_of_units from Sales_data S, Accounts A, User U where S.Account_number = A.Account_number and A.UserId = U.UserId and U.UserId =?; ", [req.body.UserId], function(error,rows,fields){
				tempCont.release();
				if (error){
					console.log('Error in the query'+error);
					resp.end();
				}
				else{
					resp.jsonp(rows);
					resp.end();
				}

			});
		}
	});

});

app.post('/getSimilarItems',function(req,resp){
	sess = req.session;
	//about mysql
	//to query
	connection.getConnection(function(error,tempCont){
		if (error){
			tempCont.release();
			console.log('Error');
		}
		else{
			tempCont.query("CREATE VIEW V AS (SELECT DISTINCT A.Type FROM Advertisements_data A, Sales_data S, User U , Accounts Ac  where S.AdvertisementId=A.AdvertisementId and S.Account_number=Ac.Account_number and Ac.UserId = U.UserId and U.UserId=?); ", [req.body.UserId], function(error,rows,fields){
				if (error){
					console.log('Error in the query'+error);
					resp.end();
				}
				else{
					tempCont.query("SELECT distinct A.Item_name FROM Advertisements_data A INNER JOIN V V WHERE A.Type = V.Type; ", function(error,rows2,fields){
						if (error){
							console.log('Error in the query'+error);
							resp.end();
						}
						else{
							tempCont.query("DROP VIEW V; ", function(error,rows3,fields){
								tempCont.release();
								if (error){
									console.log('Error in the query'+error);
									resp.end();
								}
								else{
									resp.jsonp(rows2);
									resp.end();
								}

							});
						}

					});
				}

			});
		}
	});

});

app.post('/getItemTransactions',function(req,resp){
	sess = req.session;
	//about mysql
	//to query
	connection.getConnection(function(error,tempCont){
		if (error){
			tempCont.release();
			console.log('Error');
		}
		else{
			tempCont.query("select S.TransactionId , S.Sale_date_time, S.Number_of_units from Sales_data S, Advertisements_data A where S.AdvertisementId = A.AdvertisementId and A.Item_name =?; ", [req.body.Item_name], function(error,rows,fields){
				tempCont.release();
				if (error){
					console.log('Error in the query'+error);
					resp.end();
				}
				else{
					resp.jsonp(rows);
					resp.end();
				}

			});
		}
	});

});

app.post('/getUserSummary',function(req,resp){
	sess = req.session;
	//about mysql
	//to query
	connection.getConnection(function(error,tempCont){
		if (error){
			tempCont.release();
			console.log('Error');
		}
		else{
			tempCont.query("select Ad.Unit_price, S.Number_of_units from Sales_data S, Accounts A, User U, Advertisements_data Ad where Ad.AdvertisementId = S.AdvertisementId and S.Account_number = A.Account_number and A.UserId = U.UserId and U.UserId =?; ", [req.body.UserId], function(error,rows,fields){
				tempCont.release();
				if (error){
					console.log('Error in the query'+error);
					resp.end();
				}
				else{
					resp.jsonp(rows);
					resp.end();
				}

			});
		}
	});

});

app.post('/getItemSummary',function(req,resp){
	sess = req.session;
	//about mysql
	//to query
	connection.getConnection(function(error,tempCont){
		if (error){
			tempCont.release();
			console.log('Error');
		}
		else{
			tempCont.query("select A.Unit_price, S.Number_of_units from Sales_data S, Advertisements_data A where S.AdvertisementId = A.AdvertisementId and A.Item_name=?; ", [req.body.Item_name], function(error,rows,fields){
				tempCont.release();
				if (error){
					console.log('Error in the query'+error);
					resp.end();
				}
				else{
					resp.jsonp(rows);
					resp.end();
				}

			});
		}
	});

});

app.post('/getItemTypeSummary',function(req,resp){
	sess = req.session;
	//about mysql
	//to query
	connection.getConnection(function(error,tempCont){
		if (error){
			tempCont.release();
			console.log('Error');
		}
		else{
			tempCont.query("select A.Unit_price, S.Number_of_units from Sales_data S, Advertisements_data A where S.AdvertisementId = A.AdvertisementId and A.Type=?;", [req.body.Type], function(error,rows,fields){
				tempCont.release();
				if (error){
					console.log('Error in the query'+error);
					resp.end();
				}
				else{
					resp.jsonp(rows);
					resp.end();
				}

			});
		}
	});

});

app.post('/getPurchasers',function(req,resp){
	sess = req.session;
	//about mysql
	//to query
	connection.getConnection(function(error,tempCont){
		if (error){
			tempCont.release();
			console.log('Error');
		}
		else{
			tempCont.query("select U.First_name , U.Last_name from Sales_data S, Accounts A, User U, Advertisements_data Ad where Ad.AdvertisementId = S.AdvertisementId and S.Account_number = A.Account_number and A.UserId = U.UserId and Ad.Item_name=?;", [req.body.Item_name], function(error,rows,fields){
				tempCont.release();
				if (error){
					console.log('Error in the query'+error);
					resp.end();
				}
				else{
					resp.jsonp(rows);
					resp.end();
				}

			});
		}
	});
});

app.post('/getCompanyItems',function(req,resp){
	sess = req.session;
	//about mysql
	//to query
	connection.getConnection(function(error,tempCont){
		if (error){
			tempCont.release();
			console.log('Error');
		}
		else{
			tempCont.query("select Distinct Item_name from Advertisements_data where Company=?;", [req.body.Company], function(error,rows,fields){
				tempCont.release();
				if (error){
					console.log('Error in the query'+error);
					resp.end();
				}
				else{
					resp.jsonp(rows);
					resp.end();
				}

			});
		}
	});
});

app.get('/deleteEmployee',function(req,resp){//delete employee
	sess = req.session;
	//about mysql
	//to query
	connection.getConnection(function(error,tempCont){
		if (error){
			tempCont.release();
			console.log('Error');
		}
		else{
			console.log("EmployeeId -> " + req.query.UserId);
			tempCont.query("DELETE FROM Employee_data WHERE Social_security_number = (SELECT EmployeeId FROM User WHERE UserId=?)", [req.query.UserId], function(error,rows,fields){
				tempCont.release();
				if (error){
					console.log('Error in the query'+error);
					resp.end();
				}
				else{
					console.log("SUCCESS DELETING EMPLOYEE");
					resp.end();
				}

			});
		}
	});

});


app.get('/makeEmployee',function(req,resp){//make employee
	resp.render('MakeEmployee.html');

});


app.post('/addEmployee', function (req, resp) {
	connection.getConnection(function(error,tempCont){
		if (error){
			tempCont.release();
			console.log('Error');
		}
		else{
			if(!req.body.Zip_code){//zipcode must be a number
				req.body.Zip_code=null;
			}
			tempCont.query(// add employee
				"INSERT INTO  Employee_data (Social_security_number, First_name, Last_name, Address, City, State, Zipcode, Telephone, Start_date, Hourly_rate, Role) VALUES(?,?,?,?,?,?,?,?,CURDATE(),?, 'Employee')", [req.body.SSN,req.body.First_name, req.body.Last_name, req.body.Address, req.body.City, req.body.State, req.body.Zip_code, req.body.Telephone, req.body.Hourly_rate], function(error,rows,fields){
				if (error){
					console.log('Error in the query'+error);
					resp.jsonp("error");
					resp.end();
				}
				else{
					tempCont.query(//add to user
						"INSERT INTO  User (First_name, Last_name, Email, Password, Address, City, State, Zip_code, Telephone, Preferences, EmployeeId) VALUES(?,?,?,?,?,?,?,?,?,?,?)", [req.body.First_name, req.body.Last_name, req.body.Email, req.body.Password, req.body.Address, req.body.City, req.body.State, req.body.Zip_code, req.body.Telephone, req.body.Preferences, req.body.SSN], function(error,rows2,fields){
						if (error){
							console.log('Error in the query'+error);
							resp.jsonp("error");
							resp.end();
						}
						else{
							tempCont.query(
								"SELECT UserId FROM  User ORDER BY UserId DESC LIMIT 1",  function(error,rows3,fields){
								if (error){
									console.log('Error in the query'+error);
									resp.jsonp("error");
									resp.end();
								}
								else{
									tempCont.query(
										"INSERT INTO  Pages (Owner, Post_count) VALUES(?,?)", [rows3[0].UserId, 0], function(error,rows4,fields){
										if (error){
											console.log('Error in the query'+error);
											resp.jsonp("error");
											resp.end();
										}
										else{
											resp.render('ManagerPage.html');
											resp.end();
										}
									});
								}
							});
						}
					});
				}
			});
		}
	});
});




app.get('/getMonthlyReport',function(req,resp){//delete employee
	sess = req.session;
	//about mysql
	//to query
	connection.getConnection(function(error,tempCont){
		if (error){
			tempCont.release();
			console.log('Error');
		}
		else{
			tempCont.query("Select * from Sales_data where month(Sale_date_time)=?", [req.query.Month], function(error,rows,fields){
				tempCont.release();
				if (error){
					console.log('Error in the query'+error);
					resp.end();
				}
				else{
					console.log("SUCCESS getting montly report");
					resp.json(rows);
					resp.end();
				}

			});
		}
	});

});



app.get('/createAdvertisement',function(req,resp){//delete employee
	sess = req.session;
	//about mysql
	//to query
	connection.getConnection(function(error,tempCont){
		if (error){
			tempCont.release();
			console.log('Error');
		}
		else{
			tempCont.query("INSERT INTO Advertisements_data (EmployeeId, Type, Date, Company, Item_name, Content, Unit_price, Number_of_available_units) VALUES (?,?,CURDATE(),?,?,?,?,?)", [req.query.EmployeeId, req.query.Type, req.query.Company, req.query.Item_name, req.query.Content, req.query.Unit_price, req.query.Number_of_available_units], function(error,rows,fields){
				if (error){
					console.log('Error in the query'+error);
					resp.end();
				}
				else{
					console.log("SUCCESS create ad");
					tempCont.query("Select Item_name, AdvertisementId from Advertisements_data ORDER BY AdvertisementId DESC LIMIT 1", function(error,rows,fields){
						tempCont.release();
						if (error){
							console.log('Error in the query'+error);
							resp.end();
						}
						else{
							console.log("SUCCESS getting ad");
							resp.json(rows);
							resp.end();
						}

					});
				}

			});
		}
	});

});


app.get('/getEmployeeId',function(req,resp){//get employee id
	sess = req.session;
	//about mysql
	//to query
	connection.getConnection(function(error,tempCont){
		if (error){
			tempCont.release();
			console.log('Error');
		}
		else{
			tempCont.query("Select EmployeeId FROM User WHERE UserId=?", [sess.user], function(error,rows,fields){
				tempCont.release();
				if (error){
					console.log('Error in the query'+error);
					resp.end();
				}
				else{
					console.log("SUCCESS getting EmployeeId 1");
					resp.json(rows);
					resp.end();
				}

			});
		}
	});

});


app.get('/getAdvertisements',function(req,resp){//get employee id
	sess = req.session;
	//about mysql
	//to query
	connection.getConnection(function(error,tempCont){
		if (error){
			tempCont.release();
			console.log('Error');
		}
		else{
			tempCont.query("Select DISTINCT * FROM Advertisements_data WHERE EmployeeId=?", [req.query.EmployeeId], function(error,rows,fields){
				tempCont.release();
				if (error){
					console.log('Error in the query'+error);
					resp.end();
				}
				else{
					console.log("SUCCESS getting ads");
					resp.json(rows);
					resp.end();
				}

			});
		}
	});

});


app.post('/getAdvertisements',function(req,resp){//get employee id
	sess = req.session;
	//about mysql
	//to query
	connection.getConnection(function(error,tempCont){
		if (error){
			tempCont.release();
			console.log('Error');
		}
		else{
			tempCont.query("Select * FROM Advertisements_data ORDER BY RAND() LIMIT 3", function(error,rows,fields){
				tempCont.release();
				if (error){
					console.log('Error in the query'+error);
					resp.end();
				}
				else{
					console.log("SUCCESS getting ads");
					resp.json(rows);
					resp.end();
				}

			});
		}
	});

});


app.get('/deleteAdvertisement',function(req,resp){//get employee id
	sess = req.session;
	//about mysql
	//to query
	connection.getConnection(function(error,tempCont){
		if (error){
			tempCont.release();
			console.log('Error');
		}
		else{
			tempCont.query("DELETE FROM Advertisements_data WHERE AdvertisementId=?", [req.query.AdvertisementId], function(error,rows,fields){
				tempCont.release();
				if (error){
					console.log('Error in the query'+error);
					resp.end();
				}
				else{
					console.log("SUCCESS deleting ad");
					resp.json('success');
					resp.end();
				}

			});
		}
	});

});

app.post('/recordTransaction',function(req,resp){//get employee id
	sess = req.session;
	//about mysql
	//to query
	connection.getConnection(function(error,tempCont){
		if (error){
			tempCont.release();
			console.log('Error');
		}
		else{
			tempCont.query("INSERT INTO Sales_data (Sale_date_time, AdvertisementId, Number_of_units, Account_number) VALUES (CURDATE(),?,?,?)", [req.body.AdvertisementId, req.body.Number_of_units,  req.body.Account_number], function(error,rows,fields){
				tempCont.release();
				if (error){
					console.log('Error in the query'+error);
					resp.end();
				}
				else{
					console.log("SUCCESS recording transactions");
					resp.render('EmployeePage.html');
					resp.end();
				}

			});
		}
	});

});

app.listen(1337);





//
