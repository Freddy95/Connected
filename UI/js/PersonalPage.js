var express = require('express');
var mysql = require('mysql');
var app = express();
var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : '',
  database : 'Connected'
})

connection.connect(function (error){
    if(error){
      console.log(error);
    }else{
      console.log('Connected');
    }
});
app.get('/', function(req, resp){
  console.log(req);
  console.log(resp);
  connection.query('SELECT * FROM User WHERE UserId=1', function(error, rows, fields){
    if(error){
      console.log('ERROR')
    }else{

    }
  });
})
app.get('/loggedIn', function (req, resp) {
  console.log(req);
});

app.listen(1337);
