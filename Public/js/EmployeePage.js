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







//fred code starts here














































































































































































//
