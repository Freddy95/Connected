function initiate() {
  console.log("Initiate");
  $.ajax({//get groups user is the owner of
    type: 'GET',
    url: 'http://localhost:1337/getAllGroups',
    dataType: 'json',
    success: function(data) {
      var listOfGroups = document.getElementById('Groups');
      for(var i = 0; i < data.length; i++){
        console.log(data);
        var listElement = document.createElement('li');
        var form = document.createElement('form');
        var groupId = document.createElement('input');
        var groupName = document.createElement('input');

        listElement.setAttribute('class', 'list-group-item');


        form.setAttribute('action', 'http://localhost:1337/goToGroupPage');
        form.setAttribute('method', 'post');
        form.setAttribute('class', 'text-center');

        groupId.setAttribute('value', data[i].GroupId);
        groupId.setAttribute('name', 'GroupId');
        groupId.setAttribute('style', 'display:none');

        groupName.setAttribute('type', 'submit');
        groupName.setAttribute('class', 'group');
        groupName.setAttribute('value', data[i].Group_name);

        form.appendChild(groupId);
        form.appendChild(groupName);
        listElement.appendChild(form);
        listOfGroups.appendChild(listElement);
      }
    },
  });
}
