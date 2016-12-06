var postContent = {};
var commentContent={};
var User;
function initiate() {
  $.ajax({ // get user first and last name
    type: 'GET',
    url: 'http://localhost:1337/getuser',
    dataType: 'json',
    async: false,
    success: function(data) {
      name = data;
      document.getElementById("name").innerHTML = data[0].First_name + " " + data[0].Last_name;
      getUser(data[0].UserId);
    },
  });
  $.ajax({//get groups user is the owner of
    type: 'GET',
    url: 'http://localhost:1337/getPageId',
    dataType: 'json',
    data: {
      user: User
    },
    async: false,
    success: function(data) {
    },
  });
  $.ajax({//get groups user is the owner of
    type: 'GET',
    url: 'http://localhost:1337/getownergroups',
    dataType: 'json',
    data:{
      user: User
    },
    success: function(data) {
      for(var i = 0; i < data.length; i++){
        var group = document.createElement("li");
        var link = document.createElement("a");
        link.innerHTML = data[i].Group_name;
        link.setAttribute('onclick','enter_group_page('+data[i].GroupId+')');
        // link.setAttribute('action','http://localhost:1337/getGroupPage');
        // link.setAttribute('type','submit');
        // link.setAttribute('method','POST');
        // link        data[i].GroupId
        // group.innerHTML = data[i].Group_name;
        group.appendChild(link);
        document.getElementById("groups").appendChild(group);
      }
    },
  });

  $.ajax({// get groups user has joined
    type: 'GET',
    url: 'http://localhost:1337/getgroups',
    dataType: 'json',
    data:{
      user: User
    },
    success: function(data) {
      for(var i = 0; i < data.length; i++){
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
    url: 'http://localhost:1337/getFriends',
    dataType: 'json',
    data:{
      user: User
    },
    success: function(data) {
      for(var i = 0; i < data.length; i++){
        var listElement = document.createElement('li');

        var form = document.createElement('form');
        form.setAttribute('action', 'http://localhost:1337/goToFriendPage');
        form.setAttribute('method', 'post');
        var friendId = document.createElement('input');
        friendId.setAttribute('name', 'FriendId');
        friendId.setAttribute('id', 'Friend' + data[i].UserId);
        friendId.setAttribute('style', 'display:none');
        friendId.setAttribute('value' , data[i].UserId);
        var friend = document.createElement('input');
        friend.setAttribute('class', 'friend')
        friend.setAttribute('value', data[i].First_name + " " + data[i].Last_name);
        friend.setAttribute('type', 'submit');

        form.appendChild(friendId);//id
        form.appendChild(friend);//submit button
        listElement.appendChild(form);
        document.getElementById("friends").appendChild(listElement);
      }
    },
  });


  $.ajax({// get posts
    type: 'GET',
    url: 'http://localhost:1337/getuserposts',
    dataType: 'json',
    async: false,
    data:{
      user: User
    },
    success: function(data) {
      for(var i = 0; i < data.length; i++){// get each post
        var postsDiv = document.getElementById('posts');// posts div
        var post = document.createElement("div");// the specific post div
        post.setAttribute('class', 'col-md-12 well');
        post.setAttribute('id', 'post ' + data[i].PostId);

        var deleteDiv = document.createElement('div');
        deleteDiv.setAttribute('class', 'col-md-12');
        deleteDiv.setAttribute('align', 'right');
        var deletePostButton = document.createElement("button");
        deletePostButton.setAttribute('class', 'btn-danger');
        deletePostButton.innerHTML = 'Delete Post';
        deletePostButton.setAttribute('onclick', 'deletePost(' + data[i].PostId +")");
        deleteDiv.appendChild(deletePostButton);
        post.appendChild(deleteDiv);
        var contentDiv = document.createElement("div");// content of post div
        contentDiv.setAttribute('class', 'col-md-12');

        var content = document.createElement("p");
        content.setAttribute('id', data[i].PostId);
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
            for(var x = 0; x < rows.length; x++){
              addCommentContent(rows[x].CommentId, rows[x].Content);

              var cDiv = document.createElement('div');
              cDiv.setAttribute('class', 'col-md-12 comment');
              cDiv.setAttribute('id', 'comment ' + rows[x].CommentId);
              var name = document.createElement('h4');
              var comment = document.createElement('p');
              comment.setAttribute('id', 'Comment' + rows[x].CommentId);
              var likes = document.createElement('p');
              likes.setAttribute('id', 'LikeCommentCount' + rows[x].CommentId);
              likes.setAttribute('style', 'display:inline-block');
              var likeCommentButton = document.createElement('button');

              cDiv.appendChild(name);
              cDiv.appendChild(comment);
              cDiv.appendChild(likes);

              cDiv.appendChild(likeCommentButton);

              if(rows[x].UserId == data[i].Owner ){
                var editCommentButton = document.createElement('button');
                editCommentButton.innerHTML = "Edit";
                editCommentButton.setAttribute('onclick', 'editComment(' + rows[x].CommentId + ')');
                editCommentButton.setAttribute('class', 'btn-info');
                editCommentButton.setAttribute('data-toggle', 'modal');
                editCommentButton.setAttribute('data-target', '#myModal');
                cDiv.appendChild(editCommentButton);

                var deleteCommentButton = document.createElement('button');
                deleteCommentButton.innerHTML = "Delete";
                deleteCommentButton.setAttribute('class', 'btn-danger');
                deleteCommentButton.setAttribute('onclick', 'deleteComment(' + rows[x].CommentId + "," + data[i].PostId + ')');
                cDiv.appendChild(deleteCommentButton);
              }

              commentsDiv.appendChild(cDiv);
              likeCommentButton.setAttribute('id', "LikeComment"+ rows[x].CommentId);
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
                    likeCommentButton.setAttribute('onclick', 'unlikeComment(' + rows[x].CommentId + ", " + "LikeComment" + rows[x].CommentId +", " + 'LikeCommentCount' + rows[x].CommentId + ")");
                    likeCommentButton.innerHTML = "unlike";
                  }
                },
                error: function (res) {//user hasnt liked the comment
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

        var editPostButton = document.createElement('button');
        var commentButton = document.createElement('button');
        editPostButton.setAttribute('class', 'btn-info');
        editPostButton.setAttribute('data-toggle', 'modal');
        editPostButton.setAttribute('data-target', '#myPostModal');

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
        editPostButton.innerHTML = "Edit";
        commentButton.setAttribute('onclick', 'comment(' + data[i].PostId + ')');

        console.log('editPost(' + data[i].PostId  +')');
        console.log( data[i].Content + "a");
        editPostButton.setAttribute('onclick', 'editPost(' +data[i].PostId + ')');
        addPostContent(data[i].PostId, data[i].Content);
        span.appendChild(likeButton);
        span.appendChild(commentButton);
        span.appendChild(editPostButton);
        span.appendChild(likeCount);
        post.appendChild(span);
      }
    }
  });
}

function likePost(PostId, Ele, count) {
  console.log("LIKING POST -> ");

  console.log("LIKING POST -> " + Ele);
  console.log(count);
  Ele.innerHTML="Unlike";
  Ele.setAttribute('onclick', 'unlikePost(' + PostId + ", " + Ele.getAttribute('id') +"," + count.getAttribute('id') + ")");
  count.val = count.val+1;
  count.innerHTML = count.val + " Likes";
  $.ajax({// get likes of post
    type: 'GET',
    url: 'http://localhost:1337/likePost',
    dataType: 'json',
    jsonp: 'callback',
    data:{
      Post : PostId
    },
    async: false,
    success: function(rows) {
      console.log(rows);
    },
    error: function (rows) {
    }
  });

}


function unlikePost(PostId, Ele, count) {
  console.log("UNLIKING POST -> ");

  console.log("UNLIKING POST -> " + Ele);
  console.log(count);
  count.val = count.val-1;
  count.innerHTML = count.val + " Likes";
  Ele.innerHTML="Like";
  Ele.setAttribute('onclick', 'likePost(' + PostId + ", " + Ele.getAttribute('id')+"," + count.getAttribute('id') + ")");
  $.ajax({// get likes of post
    type: 'GET',
    url: 'http://localhost:1337/unlikePost',
    dataType: 'json',
    jsonp: 'callback',
    data:{
      Post : PostId
    },
    async: false,
    success: function(rows) {
      console.log(rows);
    },
    error: function (rows) {
    }
  });

}




function likeComment(CommentId, Ele, count) {

  console.log(count);
  Ele.innerHTML="Unlike";
  Ele.setAttribute('onclick', 'unlikeComment(' + CommentId + ", " + Ele.getAttribute('id') +"," + count.getAttribute('id') + ")");
  count.val = count.val+1;
  count.innerHTML = count.val + " Likes";
  $.ajax({// get likes of post
    type: 'GET',
    url: 'http://localhost:1337/likeComment',
    dataType: 'json',
    jsonp: 'callback',
    data:{
      CommentId : CommentId
    },
    async: false,
    success: function(rows) {
      console.log(rows);
    },
    error: function (rows) {
    }
  });

}


function unlikeComment(CommentId, Ele, count) {

  count.val = count.val-1;
  count.innerHTML = count.val + " Likes";
  Ele.innerHTML="Like";
  Ele.setAttribute('onclick', 'likeComment(' + CommentId + ", " + Ele.getAttribute('id')+"," + count.getAttribute('id') + ")");

  $.ajax({// get likes of post
    type: 'GET',
    url: 'http://localhost:1337/unlikeComment',
    dataType: 'json',
    jsonp: 'callback',
    data:{
      CommentId : CommentId
    },
    async: false,
    success: function(rows) {
      console.log(rows);
    },
    error: function (rows) {
    }
  });

}

function comment(PostId) {
  var modalButton = document.getElementById('Modal_button');
  modalButton.setAttribute('onclick', 'addComment(' + PostId + ')');
}

function editPost(PostId) {
  console.log("editing");
  console.log(postContent[PostId]);
  var modalButton = document.getElementById('Post_modal_button');
  var input = document.getElementById('postValue');
  input.value = postContent[PostId];
  modalButton.setAttribute('onclick', 'editPostRequest(' + PostId +')');

}
function editPostRequest(PostId) {
  console.log("request edit");
  var content = document.getElementById('postValue').value;

  $.ajax({// get likes of post
    type: 'GET',
    url: 'http://localhost:1337/editPost',
    dataType: 'json',
    jsonp: 'callback',
    data:{
      Content : content,
      Post : PostId
    },
    async: false,
    success: function(rows) {
      console.log(rows);
      var post = document.getElementById(PostId);
      post.innerHTML = content;
      postContent[PostId] = content;
      },
    error: function (rows) {

    }
  });
  document.getElementById('postValue').value="";

}


function editComment(CommentId) {
  console.log("editing");
  var modalButton = document.getElementById('Modal_button');
  var input = document.getElementById('commentValue');
  input.value = commentContent[CommentId];
  modalButton.setAttribute('onclick', 'editCommentRequest(' + CommentId +')');

}
function editCommentRequest(CommentId) {
  console.log("request edit");
  var content = document.getElementById('commentValue').value;

  $.ajax({// get likes of post
    type: 'GET',
    url: 'http://localhost:1337/editComment',
    dataType: 'json',
    jsonp: 'callback',
    data:{
      Content : content,
      CommentId : CommentId
    },
    async: false,
    success: function(rows) {
      console.log(rows);
      var comment = document.getElementById("Comment" + CommentId);
      comment.innerHTML = content;
      commentContent[CommentId] = content;
      },
    error: function (rows) {

    }
  });
  document.getElementById('postValue').value="";

}



function addComment(PostId) {
  var content = document.getElementById('commentValue').value;
  $.ajax({// get likes of post
    type: 'GET',
    url: 'http://localhost:1337/addComment',
    dataType: 'json',
    jsonp: 'callback',
    data:{
      CommentValue : content,
      Post: PostId
    },
    async: false,
    success: function(data) {
      var commentsDiv = document.getElementById('PostCommentDiv' + PostId);

      $.ajax({// get comments on post
        type: 'GET',
        jsonp : 'callback',
        url: 'http://localhost:1337/getLastComment',
        dataType: 'json',
        data:{
          Post : PostId
        },
        success: function(rows) {
          var cDiv = document.createElement('div');
          cDiv.setAttribute('class', 'col-md-12 comment');
          cDiv.setAttribute('id', 'comment ' + rows[0].CommentId);
          var name = document.createElement('h1');
          var comment = document.createElement('p');
          var likes = document.createElement('p');
          likes.setAttribute('style', 'display:inline-block');
          var likeCommentButton = document.createElement('button');

          cDiv.appendChild(name);
          cDiv.appendChild(comment);
          cDiv.appendChild(likes);
          cDiv.appendChild(likeCommentButton);

          addCommentContent(rows[0].CommentId, content);

          var editCommentButton = document.createElement('button');
          editCommentButton.innerHTML = "Edit";
          editCommentButton.setAttribute('onclick', 'editComment(' + rows[0].CommentId + ')');
          editCommentButton.setAttribute('class', 'btn-info');
          editCommentButton.setAttribute('data-toggle', 'modal');
          editCommentButton.setAttribute('data-target', '#myModal');
          cDiv.appendChild(editCommentButton);

          var deleteCommentButton = document.createElement('button');
          deleteCommentButton.innerHTML = "Delete";
          deleteCommentButton.setAttribute('class', 'btn-danger');
          deleteCommentButton.setAttribute('onclick', 'deleteComment(' + rows[0].CommentId + "," + PostId + ')');
          cDiv.appendChild(deleteCommentButton);


          commentsDiv.appendChild(cDiv);
          likeCommentButton.innerHTML="Like";
          comment.innerHTML = rows[0].Content;
          name.innerHTML = rows[0].First_name + " " + rows[0].Last_name;
          likes.innerHTML = "0 Likes";
          likes.val = 0;
          likeCommentButton.setAttribute('id', 'LikeComment' + rows[0].CommentId);
          likes.setAttribute('id', 'LikeCommentCount'+ rows[0].CommentId);
          likeCommentButton.setAttribute('onclick', 'likeComment(' + rows[0].CommentId + ", " + "LikeComment" + rows[0].CommentId +", " + 'LikeCommentCount' + rows[0].CommentId + ")");
          console.log("LIKE COUNT -> " +likes.innerHTML);
          document.getElementById('commentValue').value = "";
        },
        error: function (rows) {
        }
    });
  },
  error: function (data) {
  }
});
}


function deletePost(PostId) {
  $.ajax({// get comments on post
    type: 'GET',
    jsonp : 'callback',
    url: 'http://localhost:1337/deletePost',
    dataType: 'json',
    data:{
      Post : PostId
    },
    success: function(rows) {
      document.getElementById('posts').removeChild(document.getElementById('post ' + PostId));
    }
});
}
function enter_group_page(id){
  // window.location = "http://localhost:1337/getGroupPage";
  window.postMessage(id,"http://localhost:1337/getGroupPage");
  // $.post("http://localhost:1337/getGroupPage",id);
  console.log("here");
    // $.ajax({//get likes for each comment
    // type: "GET",
    // url: "http://localhost:1337/getGroupPage",

    // // The name of the callback parameter, as specified by the YQL service
    // jsonp: "callback",
    // async: false,

    // // Tell jQuery we're expecting JSONP
    // // dataType: "html",

    // // Tell YQL what we want and that we want JSON
    // data: {
    //   id: id,
    //   format: "json"
    // },
    // success: function( response ) {
    //   alert("success function");
    // },
    // error: function (response) {
    //   alert("error function");
    // }
    // });

}


function deleteComment(CommentId, PostId) {
    $.ajax({// get comments on post
      type: 'GET',
      jsonp : 'callback',
      url: 'http://localhost:1337/deleteComment',
      dataType: 'json',
      data:{
        CommentId : CommentId
      },
      success: function(rows) {
        document.getElementById('PostCommentDiv' +PostId).removeChild(document.getElementById('comment ' + CommentId));
      }
  });
}

function addPostContent(PostId, content) {

    postContent[PostId] = content;

}

function addCommentContent(CommentId, content) {
  commentContent[CommentId] = content;
}

function getUser(id) {
  console.log("USER -> " + id);
  User = id;
}
