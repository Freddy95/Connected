
var employeeId;
function initiate() {

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

  $.ajax({// gets list of best items
    type: 'GET',
    url: 'http://localhost:1337/getEmployeeId',
    dataType: 'json',
    async: false,
    success: function(data) {
      console.log('data -> ' + data[0].EmployeeId);
      getEmployeeId(data[0].EmployeeId);
    },
  });

  $.ajax({// gets list of all distinct User Names This is Used for Transaction 37,38
    type: 'GET',
    url: 'http://localhost:1337/getAdvertisements',
    dataType: 'json',
    data: {
      EmployeeId : employeeId
    },
    success: function(data) {

      var ItemList = document.getElementById('Advertisements');

      var ItemList2 = document.getElementById('AdvertisementIds');

      for(var i = 0; i < data.length; i++){

        var listElement = document.createElement('li');
        listElement.setAttribute('id', 'Ad' + data[i].AdvertisementId);
        listElement.innerHTML= "Ad ID: " + String(data[i].AdvertisementId) + " | " + data[i].Item_name;
        listElement.setAttribute('class', 'list-group-item');

        var deleteAdButton = document.createElement('button');//create Delete ad button
        deleteAdButton.setAttribute('class', 'btn-danger');
        deleteAdButton.setAttribute('style', 'margin-left:70%');
        deleteAdButton.setAttribute('onclick' , 'deleteAd('+  data[i].AdvertisementId +')');
        deleteAdButton.innerHTML = 'Delete Ad';
        listElement.appendChild(deleteAdButton);

        ItemList.appendChild(listElement);

        var listElement2 = document.createElement('li');
        var a = document.createElement('a');
        listElement2.appendChild(a);
        a.setAttribute('onclick', 'setValueOfAdId(' + data[i].AdvertisementId +')');
        a.innerHTML = 'Advertisement ' + String(data[i].AdvertisementId);
        a.setAttribute('id' , 'SuperId' + data[i].AdvertisementId);
        a.setAttribute('style', 'cursor:pointer')
        ItemList2.appendChild(listElement2);

      }
    },
  });

  $.ajax({// gets list of all distinct User Names This is Used for Transaction 37,38
    type: 'GET',
    url: 'http://localhost:1337/getEveryUser',
    dataType: 'json',
    success: function(data) {

      var ItemList = document.getElementById('Users');


      for(var i = 0; i < data.length; i++){


        //Transaction 38
        var listElement = document.createElement('li');
        var a = document.createElement('a');
        a.innerHTML=data[i].UserId + " "+data[i].First_name +" "+ data[i].Last_name;
        a.setAttribute('onclick', 'generateUserSummary(' + data[i].UserId +", '"+data[i].First_name+"', '"+data[i].Last_name+"')");
        listElement.appendChild(a);
        ItemList.appendChild(listElement);



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


function createAdvertisement() {
  var itemName = document.getElementById('ItemName');
  var itemType = document.getElementById('Type');
  var company = document.getElementById('Company');
  var content = document.getElementById('Content');
  var price = document.getElementById('UnitPrice');
  var numOfUnits = document.getElementById('NumberOfUnits');

  $.ajax({// gets list of all distinct User Names
    type: 'get',
    url: 'http://localhost:1337/createAdvertisement',
    dataType: 'json',
    data:{
      EmployeeId : employeeId,
      Item_name : itemName.value,
      Type : itemType.value,
      Company : company.value,
      Content : content.value,
      Unit_price : price.value,
      Number_of_available_units : numOfUnits.value
    },
    success: function(data) {//add advertisement to list
      console.log('creating ad');
      var ItemList2 = document.getElementById('AdvertisementIds');
      var ItemList = document.getElementById('Advertisements');
      var listElement = document.createElement('li');
      listElement.setAttribute('id', 'Ad' + data[0].AdvertisementId);
      listElement.innerHTML= "Ad ID: " + String(data[0].AdvertisementId) + " | " + data[0].Item_name;
      listElement.setAttribute('class', 'list-group-item');

      var deleteAdButton = document.createElement('button');//create Delete ad button
      deleteAdButton.setAttribute('class', 'btn-danger');
      deleteAdButton.setAttribute('style', 'margin-left:70%');
      deleteAdButton.setAttribute('onclick' , 'deleteAd('+  data[0].AdvertisementId +')');
      deleteAdButton.innerHTML = 'Delete Ad';
      listElement.appendChild(deleteAdButton);

      ItemList.appendChild(listElement);

      var listElement2 = document.createElement('li');
      var a = document.createElement('a');
      listElement2.appendChild(a);
      a.setAttribute('onclick', 'setValueOfAdId(' + data[0].AdvertisementId +')');
      a.innerHTML = 'Advertisement ' + String(data[0].AdvertisementId);
      a.setAttribute('id' , 'SuperId' + data[0].AdvertisementId);
      a.setAttribute('style', 'cursor:pointer')
      ItemList2.appendChild(listElement2);
    },
  });
}

function deleteAd(id) {
  $.ajax({// gets list of all distinct User Names
    type: 'get',
    url: 'http://localhost:1337/deleteAdvertisement',
    dataType: 'json',
    data:{
      AdvertisementId : id,
    },
    success: function(data) {//add advertisement to list
      console.log('deleting ad');
      console.log('ADID : ' + id);
      document.getElementById('Ad' + id).remove();
      document.getElementById('SuperId' + id).remove();
      document.getElementById
    },
  });
}

function getEmployeeId(id) {
  console.log('Employee id -> ' + id);
  employeeId = id;
}


function setValueOfAdId(id) {
  document.getElementById('RecordAdId').setAttribute('value', id);
}
