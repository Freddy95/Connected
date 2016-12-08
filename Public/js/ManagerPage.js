function initiate() {

  $.ajax({//get all employee names and create the list for them
    type: 'GET',
    url: 'http://localhost:1337/getBestCustomer',
    dataType: 'json',
    success: function(data) {
      var best= document.getElementById('BestCustomer');
      best.innerHTML = data[0].First_name + " " + data[0].Last_name;
    },
  });
  $.ajax({//get all employee names and create the list for them
    type: 'GET',
    url: 'http://localhost:1337/getBestEmployee',
    dataType: 'json',
    success: function(data) {
      console.log("DATA -> " + data);
      var best= document.getElementById('BestEmployee');
      best.innerHTML = data[0].First_name + " " + data[0].Last_name;
    },
  });
  $.ajax({//get all employee names and create the list for them
    type: 'GET',
    url: 'http://localhost:1337/getAllEmployees',
    dataType: 'json',
    success: function(data) {
      var listOfEmployees = document.getElementById('Employees');
      for(var i = 0; i < data.length; i++){
        console.log(data);
        var listElement = document.createElement('li');
        listElement.setAttribute('class', 'list-group-item');
        var button = document.createElement('button');
        button.setAttribute('onclick', 'getEmployeeData(' + data[i].UserId +")");
        button.innerHTML = data[i].First_name + " " + data[i].Last_name;
        listElement.appendChild(button);
        listOfEmployees.appendChild(listElement);
      }
    },
  });


}


function getEmployeeData(UserId) {
  $.ajax({//get groups user is the owner of
    type: 'GET',
    url: 'http://localhost:1337/getEmployeeData',
    dataType: 'json',
    data:{
      User: UserId
    },
    success: function(data) {
      var firstName = document.getElementById('FirstName');
      var lastName = document.getElementById('LastName');
      var address = document.getElementById('Address');
      var city = document.getElementById('City');
      var state= document.getElementById('State');
      var zipCode = document.getElementById('ZipCode');
      var phone = document.getElementById('Phone');
      var preferences = document.getElementById('Preferences');
      var hourlyRate = document.getElementById('HourlyRate');
      var userId = document.getElementById('UserId');

      firstName.value = data[0].First_name;
      lastName.value = data[0].Last_name;
      address.value = data[0].Address;
      city.value = data[0].City;
      state.value = data[0].State;
      zipCode.value = data[0].Zip_code;
      phone.value = data[0].Telephone;
      preferences.value = data[0].Preferences;
      hourlyRate.value = data[0].Hourly_rate;
      userId.value = data[0].UserId;

    },
  });
}
