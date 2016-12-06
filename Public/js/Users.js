function initiate() {
  console.log("Initiate");
  $.ajax({//get groups user is the owner of
    type: 'GET',
    url: 'http://localhost:1337/getAllUsers',
    dataType: 'json',
    success: function(data) {
      var listOfUsers = document.getElementById('Users');
      for(var i = 0; i < data.length; i++){
        console.log(data);
        var listElement = document.createElement('li');
        var form = document.createElement('form');
        var userId = document.createElement('input');
        var userName = document.createElement('input');

        listElement.setAttribute('class', 'list-group-item');


        form.setAttribute('action', 'http://localhost:1337/goToUserPage');
        form.setAttribute('method', 'post');
        form.setAttribute('class', 'text-center');

        userId.setAttribute('value', data[i].UserId);
        userId.setAttribute('name', 'UserId');
        userId.setAttribute('style', 'display:none');

        userName.setAttribute('type', 'submit');
        userName.setAttribute('class', 'user');
        userName.setAttribute('value', data[i].First_name + " " + data[i].Last_name);

        form.appendChild(userId);
        form.appendChild(userName);
        listElement.appendChild(form);
        listOfUsers.appendChild(listElement);
      }
    },
  });
}
