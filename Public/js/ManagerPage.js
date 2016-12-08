function initiate() {

  $.ajax({//get groups user is the owner of
    type: 'GET',
    url: 'http://localhost:1337/getAllUsers',
    dataType: 'json',
    success: function(data) {
      var listOfUsers = document.getElementById('Users');
      for(var i = 0; i < data.length; i++){
        console.log(data);
        var listElement = document.createElement('li');
        var button = document.createElement('button');
        var userId = document.createElement('input');
        var userName = document.createElement('input');

        listElement.setAttribute('class', 'list-group-item');


        button.setAttribute('action', 'http://localhost:1337/goToUserPage');
        button.setAttribute('method', 'post');
        button.setAttribute('class', 'text-center');



        button.appendChild(userId);
        button.appendChild(userName);
        listElement.appendChild(button);
        listOfUsers.appendChild(listElement);
      }
    },
  });
}
