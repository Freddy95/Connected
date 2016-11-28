function initiate() {
  $.ajax({
    type: 'GET',
    url: 'http://localhost:1337/getuser',
    dataType: 'json',
    success: function(data) {
      j = data;
      document.getElementById("name").innerHTML = data.name;
    },
  });
  $.ajax({
    type: 'GET',
    url: 'http://localhost:1337/getgroups',
    dataType: 'json',
    success: function(data) {
      j = data;
      console.log(data);
    },
  });
}
