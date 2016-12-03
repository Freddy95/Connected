function initiate() {
  $.ajax({ // get group name
    type: 'GET',
    url: 'http://localhost:1337/getgroupname',
    dataType: 'json',
    success: function(data) {
      j = data;
      document.getElementById("name").innerHTML = data;
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
  $.ajax({// get groups user has joined
    type: 'GET',
    url: 'http://localhost:1337/getgroups',
    dataType: 'json',
    success: function(data) {
      for(var i = 0; i < data.length; i++){
        console.log(data[i].Group_name)
        var group = document.createElement("li");
        var link = document.createElement("a");
        link.innerHTML = data[i].Group_name;
        link.setAttribute('onclick','enter_group_page('+data[i].GroupId+')');
        // group.innerHTML = data[i].Group_name;
        group.appendChild(link);        
        document.getElementById("groups").appendChild(group);
      }
    },
  });

  $.ajax({// get groups user has joined
    type: 'GET',
    url: 'http://localhost:1337/getuserposts',
    dataType: 'json',
    async: false,
    success: function(data) {
      for(var i = 0; i < data.length; i++){// get each post
        console.log(data[i].PostId)
        console.log(data[i]);
        var postsDiv = document.getElementById('posts');// posts div
        var post = document.createElement("div");// the specific post div
        post.setAttribute('class', 'col-md-12 well');
        post.setAttribute('id', 'post ' + data[i].PostId);
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
        commentsDiv.setAttribute('id', 'PostCommentDiv' + data[i].PostId);
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
          async: false,
          success: function(rows) {
            console.log("length -> " + rows.length);
            for(var x = 0; x < rows.length; x++){
              console.log("Getting comments");
              var cDiv = document.createElement('div');
              cDiv.setAttribute('class', 'col-md-12 comment');
              cDiv.setAttribute('id', 'comment ' + rows[x].CommentId);
              var name = document.createElement('h4');
              var comment = document.createElement('p');
              var likes = document.createElement('p');
              likes.setAttribute('id', 'LikeCommentCount' + rows[x].CommentId);
              likes.setAttribute('style', 'display:inline-block');
              var likeCommentButton = document.createElement('button');

              cDiv.appendChild(name);
              cDiv.appendChild(comment);
              cDiv.appendChild(likes);
              cDiv.appendChild(likeCommentButton);
              commentsDiv.appendChild(cDiv);
              likeCommentButton.setAttribute('id', "LikeComment"+ rows[x].CommentId);
              comment.innerHTML = rows[x].Content;
              name.innerHTML = rows[x].First_name + " " + rows[x].Last_name;
              console.log("postid -> " + data[i].PostId);
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
                      likes.val = response[0].Likes;
                  },
                  error: function (response) {
                        likes.innerHTML = "0 Likes";
                        likes.val = 0;
                  }
              });
              $.ajax({// finds out if user liked the comment
                type: 'GET',
                url: 'http://localhost:1337/getusercommentlike',
                dataType: 'json',
                jsonp: 'callback',
                data:{
                  CommentId : rows[x].CommentId
                },
                async: false,
                success: function(res) {
                  if(res.length == 0){//user didnt like comment
                    likeCommentButton.setAttribute('onclick', 'likeComment(' + rows[x].CommentId + ", " + "LikeComment"+ rows[x].CommentId +", " + 'LikeCommentCount' + rows[x].CommentId + ")");
                    likeCommentButton.innerHTML = "Like";
                  }else{//user has already liked the comment
                    console.log(rows.length);
                    console.log('unlikeComment(' + rows[x].CommentId + ", " + "LikePost"+ rows[x].CommentId +")");
                    likeCommentButton.setAttribute('onclick', 'unlikeComment(' + rows[x].CommentId + ", " + "LikeComment" + rows[x].CommentId +", " + 'LikeCommentCount' + rows[x].CommentId + ")");
                    likeCommentButton.innerHTML = "unlike";
                  }
                },
                error: function (res) {//user hasnt liked the comment
                  console.log("ERROR ID -> " + rows[x].CommentId);
                  likeCommentButton.setAttribute('onclick', 'likeComment(' + rows[x].CommentId + ", "  + "LikePost" + rows[x].CommentId +", " + 'LikePostCount' + rows[x].CommentId + ")");
                  likeCommentButton.innerHTML = "Like";
                }
              });


            }
          },error: function (error) {
            console.log("error");
          }
        });
        var span = document.createElement('span');
        var likeButton = document.createElement('button');
        likeButton.setAttribute('class', 'btn');
        likeButton.setAttribute('id', "LikePost" + data[i].PostId);


        var commentButton = document.createElement('button');
        commentButton.setAttribute('class', 'btn');
        commentButton.setAttribute('data-toggle', 'modal');
        commentButton.setAttribute('data-target', '#myModal');
        var likeCount = document.createElement('p');
        likeCount.setAttribute('id', 'LikePostCount' + data[i].PostId);
        $.ajax({// finds out if user has liked the post
          type: 'GET',
          url: 'http://localhost:1337/getuserlikes',
          dataType: 'json',
          jsonp: 'callback',
          data:{
            post : data[i].PostId
          },
          async: false,
          success: function(rows) {
            if(rows.length == 0){//user didnt like post
              likeButton.setAttribute('onclick', 'likePost(' + data[i].PostId + ", " + "LikePost"+ data[i].PostId +", " + 'LikePostCount' + data[i].PostId + ")");
              likeButton.innerHTML = "Like";
            }else{//user has already liked the post
              likeButton.setAttribute('onclick', 'unlikePost(' + data[i].PostId + ", " + "LikePost" + data[i].PostId +", " + 'LikePostCount' + data[i].PostId + ")");
              likeButton.innerHTML = "unlike";
            }
          },
          error: function (rows) {//user hasnt liked the post
            console.log("ERROR ID -> " + data[i].PostId);
            likeButton.setAttribute('onclick', 'likePost(' + data[i].PostId + ", "  + "LikePost" + data[i].PostId +", " + 'LikePostCount' + data[i].PostId + ")");
            likeButton.innerHTML = "Like";
          }
        });


        $.ajax({// get likes of post
          type: 'GET',
          url: 'http://localhost:1337/getlikes',
          dataType: 'json',
          jsonp: 'callback',
          data:{
            post : data[i].PostId
          },
          async: false,
          success: function(rows) {
            likeCount.innerHTML = rows[0].Likes + " likes";
            likeCount.val = rows[0].Likes;
          },
          error: function (rows) {
            likeCount.innerHTML = "0 likes";
            likeCount.val = 0;
          }
        });

        commentButton.innerHTML = "Comment";
        commentButton.setAttribute('onclick', 'comment(' + data[i].PostId + ')');
        span.appendChild(likeButton);
        span.appendChild(commentButton);
        span.appendChild(likeCount);
        post.appendChild(span);
      }
    }
  });
}