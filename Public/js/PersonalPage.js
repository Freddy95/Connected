function initiate() {
  $.ajax({ // get user first and last name
    type: 'GET',
    url: 'http://localhost:1337/getuser',
    dataType: 'json',
    success: function(data) {
      j = data;
      document.getElementById("name").innerHTML = data.name;
    },
  });
  $.ajax({//get groups user is the owner of
    type: 'GET',
    url: 'http://localhost:1337/getPageId',
    dataType: 'json',
    success: function(data) {
      console.log(data);
    },
  });
  $.ajax({//get groups user is the owner of
    type: 'GET',
    url: 'http://localhost:1337/getownergroups',
    dataType: 'json',
    success: function(data) {
      for(var i = 0; i < data.length; i++){
        console.log(data[i].Group_name)
        var group = document.createElement("li");
        group.innerHTML = data[i].Group_name;
        document.getElementById("groups").appendChild(group);
      }
    },
  });

  $.ajax({// get groups user has joined
    type: 'GET',
    url: 'http://localhost:1337/getgroups',
    dataType: 'json',
    success: function(data) {
      for(var i = 0; i < data.length; i++){
        console.log(data[i].Group_name)
        var group = document.createElement("li");
        group.innerHTML = data[i].Group_name;
        document.getElementById("groups").appendChild(group);
      }
    },
  });

  $.ajax({// get groups user has joined
    type: 'GET',
    url: 'http://localhost:1337/getuserposts',
    dataType: 'json',
    success: function(data) {
      for(var i = 0; i < data.length; i++){// get each post
        console.log(data[i].PostId)
        console.log(data[i]);
        var postsDiv = document.getElementById('posts');// posts div
        var post = document.createElement("div");// the specific post div
        post.setAttribute('class', 'col-md-12 well');

        var contentDiv = document.createElement("div");// content of post div
        contentDiv.setAttribute('class', 'col-md-12');

        var content = document.createElement("p");
        content.setAttribute('class', 'content');
        content.innerHTML=data[i].Content;
        contentDiv.appendChild(content);//append content to contentdiv
        post.appendChild(contentDiv);// append contentdiv to post
        postsDiv.appendChild(post);//append post to postsdiv
        var commentsDiv = document.createElement('div');
        commentsDiv.setAttribute('class', 'col-md-12');
        var header = document.createElement('h3');
        header.innerHTML="Comments";
        commentsDiv.appendChild(header);
        post.appendChild(commentsDiv);//apend commentsDiv to posts

        $.ajax({// get comments on post
          type: 'GET',
          jsonp : 'callback',
          url: 'http://localhost:1337/getcomments',
          dataType: 'json',
          data:{
            post : data[i].PostId
          },
          success: function(rows) {
            console.log("length -> " + rows.length);
            for(var x = 0; x < rows.length; x++){
              console.log("Getting comments");
              var cDiv = document.createElement('div');
              cDiv.setAttribute('class', 'col-md-12 comment');

              var name = document.createElement('p');
              var comment = document.createElement('p');
              var likes = document.createElement('p');
              likes.setAttribute('style', 'display:inline-block');
              var likeCommentButton = document.createElement('button');

              cDiv.appendChild(name);
              cDiv.appendChild(comment);
              cDiv.appendChild(likes);
              cDiv.appendChild(likeCommentButton);
              commentsDiv.appendChild(cDiv);
              likeCommentButton.innerHTML="Like";
              comment.innerHTML = rows[x].Content;
              name.innerHTML = rows[x].First_name + " " + rows[x].Last_name;

              $.ajax({//get likes for each comment
                type: "GET",
                  url: "http://localhost:1337/getcommentlikes",

                  // The name of the callback parameter, as specified by the YQL service
                  jsonp: "callback",

                  // Tell jQuery we're expecting JSONP
                  dataType: "jsonp",

                  // Tell YQL what we want and that we want JSON
                  data: {
                      comment: rows[x].CommentId,
                      format: "json"
                  },

                  // Work with the response
                  success: function( response ) {
                      console.log("comment likes -> " + response);
                      likes.innerHTML = response[0].Likes + " Likes"; // server response
                  },
                  error: function (response) {
                        likes.innerHTML = "0 Likes";
                  }
              });



            }
          },
        });
        var span = document.createElement('span');
        var likeButton = document.createElement('button');
        var commentButton = document.createElement('button');
        var likeCount = document.createElement('p');
        $.ajax({// get likes of post
          type: 'GET',
          url: 'http://localhost:1337/getlikes',
          dataType: 'json',
          jsonp: 'callback',
          data:{
            post : data[i].PostId
          },
          success: function(rows) {
            likeCount.innerHTML = rows[0].Likes + " likes";
          },
          error: function (rows) {
            likeCount.innerHTML = "0 likes";
          }
        });
        likeButton.innerHTML = "Like";
        commentButton.innerHTML = "Comment";
        span.appendChild(likeButton);
        span.appendChild(commentButton);
        span.appendChild(likeCount);
        post.appendChild(span);
      }
    }
  });
}

function post_Status(){
  //get the data from the text box
  var status = $('#status').val();

  $.ajax({//get likes for each comment
    type: "POST",
    url: "http://localhost:1337/PostMessage",

    // The name of the callback parameter, as specified by the YQL service
    jsonp: "callback",

    // Tell jQuery we're expecting JSONP
    dataType: "jsonp",

    // Tell YQL what we want and that we want JSON
    data: {
      message: status,
      // PageId: 1,
      format: "json"
    },

    // Work with the response
    success: function( response ) {

      var postsDiv = document.getElementById('posts');// posts div
      var post = document.createElement("div");// the specific post div
      post.setAttribute('class', 'col-md-12 well');

      var contentDiv = document.createElement("div");// content of post div
      contentDiv.setAttribute('class', 'col-md-12');

      var content = document.createElement("p");
      content.setAttribute('class', 'content');
      content.innerHTML=status;
      contentDiv.appendChild(content);//append content to contentdiv

      post.appendChild(contentDiv);// append contentdiv to post
      postsDiv.prepend(post);//append post to postsdiv

      var commentsDiv = document.createElement('div');
      commentsDiv.setAttribute('class', 'col-md-12');

      var header = document.createElement('h3');
      header.innerHTML="Comments";

      commentsDiv.appendChild(header);
      post.appendChild(commentsDiv);//apend commentsDiv to posts

      var span = document.createElement('span');
      var likeButton = document.createElement('button');
      var commentButton = document.createElement('button');
      var likeCount = document.createElement('p');
      likeButton.innerHTML = "Like";
      commentButton.innerHTML = "Comment";
      span.appendChild(likeButton);
      span.appendChild(commentButton);
      span.appendChild(likeCount);
      post.appendChild(span);
      $('#status').val('');

    },
    error: function (response) {
      alert('there was an error with the post try sending again');
    }
  });


}
