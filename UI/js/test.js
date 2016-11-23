// function testget(){
// 	$.get("http://localhost:1337/gettest",function(data, status){
// 	    alert(data);
// 	});

// }
// function testpost(){
// 	$.post("localhost:1337/posttest",{query:"SELECT * FROM ACCOUNTS"},function(data, status){
// 	    alert(data);
// 	});
// }



function testget2(){
	$.ajax({
		type: "GET",
	    url: "http://localhost:1337/gettest",

	    // The name of the callback parameter, as specified by the YQL service
	    jsonp: "callback",

	    // Tell jQuery we're expecting JSONP
	    dataType: "jsonp",

	    // Tell YQL what we want and that we want JSON
	    data: {
	        q: "testig",
	        format: "json"
	    },

	    // Work with the response
	    success: function( response ) {
	        console.log( response ); // server response
	    }
	});

}
// this works
function testpost2(){
	$.ajax({
		type: "POST",
	    url: "http://localhost:1337/posttest",

	    // The name of the callback parameter, as specified by the YQL service
	    jsonp: "callback",

	    // Tell jQuery we're expecting JSONP
	    dataType: "jsonp",

	    // Tell YQL what we want and that we want JSON
	    data: {
	        sql_statement: "select * from Accounts",
	        format: "json"
	    },

	    // Work with the response
	    success: function( response ) {
	        if(response === 1){
						window.location = "login.html";
					}
	    }
	});

}

function testquery(){
	$.ajax({
		type: "POST",
	    url: "http://localhost:1337/query",

	    // The name of the callback parameter, as specified by the YQL service
	    json: "callback",

	    // Tell jQuery we're expecting JSONP
	    dataType: "jsonp",

	    // Tell YQL what we want and that we want JSON
	    data: {
	        query: "SELECT * FROM Accounts",
	        format: "json"
	    },

	    // Work with the response
	    success: function( response ) {
	        console.log( response ); // server response
	    }
	});

}
