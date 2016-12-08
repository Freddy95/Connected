function initiate() {

  $.ajax({//get all employee names and create the list for them.
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
        listElement.setAttribute('id', 'Employee' + data[i].UserId);
        var button = document.createElement('button');
        button.setAttribute('onclick', 'getEmployeeData(' + data[i].UserId +")");
        button.innerHTML = data[i].First_name + " " + data[i].Last_name;
        listElement.appendChild(button);
        listOfEmployees.appendChild(listElement);
      }
    },
  });


  $.ajax({// gets list of best items
    type: 'GET',
    url: 'http://localhost:1337/getBestItems',
    dataType: 'json',
    success: function(data) {
      // Transaction 36
      var ItemList = document.getElementById('BestItems');

      for(var i = 0; i < data.length; i++){

        //Transaction 36
        var listElement = document.createElement('li');
        listElement.setAttribute('class', 'list-group-item');
        listElement.innerHTML = data[i].Item_name;
        ItemList.appendChild(listElement);

      }
    },
  });

  $.ajax({// gets list of all distinct item names
    type: 'GET',
    url: 'http://localhost:1337/getAllItems',
    dataType: 'json',
    success: function(data) {

      // Transaction 37
      var ItemList = document.getElementById('ItemTrans');
      // Transaction 38
      var ItemList2 = document.getElementById('ItemSummary');
      // Transaction 36
      var ItemList3 = document.getElementById('AllItems');

      for(var i = 0; i < data.length; i++){

        // Transaction 37
        var listElement = document.createElement('li');
        var a = document.createElement('a');
        a.innerHTML=data[i].Item_name;
        a.setAttribute('onclick', 'generateItemTransList(' + "'" +data[i].Item_name+"'" +")");
        listElement.appendChild(a);
        ItemList.appendChild(listElement);

        // Transaction 38
        var listElement2 = document.createElement('li');
        var a2 = document.createElement('a');
        a2.innerHTML=data[i].Item_name;
        a2.setAttribute('onclick', 'generateItemSummary(' + "'" +data[i].Item_name+"'" +")");
        listElement2.appendChild(a2);
        ItemList2.appendChild(listElement2);

        // Transaction 36
        var listElement3 = document.createElement('li');
        listElement3.setAttribute('class', 'list-group-item');
        listElement3.innerHTML = data[i].Item_name;
        ItemList3.appendChild(listElement3);

      }
    },
  });
  $.ajax({// gets list of all distinct User Names This is Used for Transaction 37,38
    type: 'GET',
    url: 'http://localhost:1337/getEveryUser',
    dataType: 'json',
    success: function(data) {

      // Transaction 37
      var ItemList = document.getElementById('UserTrans');
      //Transaction 38
      var ItemList2 = document.getElementById('UserSummary');


      for(var i = 0; i < data.length; i++){

        //Transaction 37
        var listElement = document.createElement('li');
        var a = document.createElement('a');
        a.innerHTML=data[i].UserId + " "+data[i].First_name +" "+ data[i].Last_name;
        a.setAttribute('onclick', 'generateUserTransList(' + data[i].UserId +")");
        listElement.appendChild(a);
        ItemList.appendChild(listElement);

        //Transaction 38
        var listElement2 = document.createElement('li');
        var a2 = document.createElement('a');
        a2.innerHTML=data[i].UserId + " "+data[i].First_name +" "+ data[i].Last_name;
        a2.setAttribute('onclick', 'generateUserSummary(' + data[i].UserId +", '"+data[i].First_name+"', '"+data[i].Last_name+"')");
        listElement2.appendChild(a2);
        ItemList2.appendChild(listElement2);



      }
    },
  });

  $.ajax({// gets list of all Item Types Transaction 38
    type: 'GET',
    url: 'http://localhost:1337/getAllItemTypes',
    dataType: 'json',
    success: function(data) {

      // Transaction 38
      var ItemList = document.getElementById('ItemTypeSummary');

      for(var i = 0; i < data.length; i++){

        //Transaction 38
        var listElement = document.createElement('li');
        var a = document.createElement('a');
        a.innerHTML=data[i].Type;
        a.setAttribute('onclick', 'generateItemTypeSummary(' + "'" +data[i].Type+"'" +")");
        listElement.appendChild(a);
        ItemList.appendChild(listElement);

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


function generateItemTransList(ItemName){
    $.ajax({// gets list of all distinct User Names
      type: 'POST',
      url: 'http://localhost:1337/getItemTransactions',
      dataType: 'json',
      data:{
        Item_name : ItemName
      },
      success: function(data) {
        document.getElementById("TransactionReportList").remove();
        var div = document.getElementById('TransactionReport');
        var ItemList = document.createElement('ul');
        ItemList.setAttribute('id', 'TransactionReportList');
        for(var i = 0; i < data.length; i++){
            var listElement = document.createElement('li');
            listElement.innerHTML="<b>TransactionId:</b> "+data[i].TransactionId + "   <b>Sale Time:</b> "+data[i].Sale_date_time +"   <b>#Purchased</b> "+ data[i].Number_of_units;
            ItemList.appendChild(listElement);
            div.appendChild(ItemList);


        }
      },
    });

}

function generateUserTransList(User){
    $.ajax({// gets list of all distinct User Names
      type: 'POST',
      url: 'http://localhost:1337/getUserTransactions',
      dataType: 'json',
      data:{
        UserId : User
      },
      success: function(data) {
        document.getElementById("TransactionReportList").remove();
        var div = document.getElementById('TransactionReport');
        var ItemList = document.createElement('ul');
        ItemList.setAttribute('id', 'TransactionReportList');
        for(var i = 0; i < data.length; i++){
            var listElement = document.createElement('li');
            listElement.innerHTML="<b>TransactionId:</b> "+data[i].TransactionId + "   <b>Sale Time:</b> "+data[i].Sale_date_time +"   <b>#Purchased</b> "+ data[i].Number_of_units;
            ItemList.appendChild(listElement);
            div.appendChild(ItemList);


        }
      },
    });

}

function generateUserSummary(User,First,Last){
    $.ajax({// gets list of all distinct User Names
      type: 'POST',
      url: 'http://localhost:1337/getUserSummary',
      dataType: 'json',
      data:{
        UserId : User
      },
      success: function(data) {
        var Total = 0;
        var summary = document.getElementById('Summary');
        for(var i = 0; i < data.length; i++){
            Total += data[i].Unit_price * data[i].Number_of_units;
        }
        summary.innerHTML=First + " " + Last +" Bought $" +Total+" worth of Items";

      },
    });

}

function generateItemSummary(ItemName){
    $.ajax({// gets list of all distinct User Names
      type: 'POST',
      url: 'http://localhost:1337/getItemSummary',
      dataType: 'json',
      data:{
        Item_name : ItemName
      },
      success: function(data) {
        var Total = 0;
        var summary = document.getElementById('Summary');
        for(var i = 0; i < data.length; i++){
            Total += data[i].Unit_price * data[i].Number_of_units;
        }
        summary.innerHTML=ItemName+" generated $" +Total+" Revenue";

      },
    });

}

function generateItemTypeSummary(Type){
    $.ajax({// gets list of all distinct User Names
      type: 'POST',
      url: 'http://localhost:1337/getItemTypeSummary',
      dataType: 'json',
      data:{
        Type : Type
      },
      success: function(data) {
        var Total = 0;
        var summary = document.getElementById('Summary');
        for(var i = 0; i < data.length; i++){
            Total += data[i].Unit_price * data[i].Number_of_units;
        }
        summary.innerHTML=Type+"(s) generated $" +Total+" Revenue";

      },
    });

}

//fred code starts here

//deletes an employee
function deleteEmployee() {
  var User = document.getElementById('UserId');
  $.ajax({// gets list of all distinct User Names
    type: 'GET',
    url: 'http://localhost:1337/deleteEmployee',
    dataType: 'json',
    data:{
      UserId : User.value
    },
    success: function(data) {
      var list = document.getElementById('Employees');
      list.removeChild(document.getElementById('Employee' + User.value));
      User.value = '';
    },
  });
}

function getSalesReport(Month) {
  $.ajax({// gets list of all transactions for that month
    type: 'GET',
    url: 'http://localhost:1337/getMonthlyReport',
    dataType: 'json',
    data:{
      Month : Month
    },
    success: function(data) {
      var div = document.getElementById('MonthReportDiv');
      var list = document.getElementById('MonthReport');
      list.remove();//delete list
      list = document.createElement('ul');
      list.setAttribute('id', 'MonthReport');//remake list
      div.appendChild(list);//put list back
      for(var i = 0; i< data.length; i++){
        var listElement = document.createElement('li');
        listElement.innerHTML="<b>TransactionId:</b> "+data[i].TransactionId + "   <b>Sale Time:</b> "+data[i].Sale_date_time +"   <b>#Purchased</b> "+ data[i].Number_of_units;
        list.appendChild(listElement);
      }
    },
  });
}











































































































































































//
