function initiate() {
  $.ajax({//get received messages
    type: 'GET',
    url: 'http://localhost:1337/getReceivedMessages',
    dataType: 'json',
    success: function(data) {
      var receivedMessagesDiv = document.getElementById('ReceivedMessages');
      for(var i = 0; i < data.length; i++){
            console.log(data);
            var messageDiv = document.createElement('div');
            var name = document.createElement('h3');
            var subject= document.createElement('h5');
            var content= document.createElement('p');

            messageDiv.setAttribute('class', 'col-md-12');
            messageDiv.setAttribute('id', 'Message'+data[i].MessageId);

            name.innerHTML = data[i].First_name + " "  +data[i].Last_name;
            subject.innerHTML = data[i].Subject;
            content.innerHTML = data[i].Content;


            var deleteMessageDiv = document.createElement('div');
            deleteMessageDiv.setAttribute('class', 'col-md-12');
            deleteMessageDiv.setAttribute('align', 'right');

            var deleteMessageButton = document.createElement("button");
            deleteMessageButton.setAttribute('class', 'btn-danger');
            deleteMessageButton.innerHTML = 'Delete Message';
            deleteMessageButton.setAttribute('onclick', 'deleteRecievedMessage(' + data[i].MessageId +")");

            deleteMessageDiv.appendChild(deleteMessageButton);

            messageDiv.appendChild(deleteMessageDiv);
            messageDiv.appendChild(name);
            messageDiv.appendChild(subject);
            messageDiv.appendChild(content);

            receivedMessagesDiv.appendChild(messageDiv);
      }
    },
  });

  $.ajax({//get received messages
    type: 'GET',
    url: 'http://localhost:1337/getSentMessages',
    dataType: 'json',
    success: function(data) {
      var sentMessagesDiv = document.getElementById('SentMessages');
      for(var i = 0; i < data.length; i++){
          if(data[i].Visible_by_sender == 'Y'){
            console.log(data);
            var messageDiv = document.createElement('div');
            var name = document.createElement('h3');
            var subject= document.createElement('h5');
            var content= document.createElement('p');

            messageDiv.setAttribute('class', 'col-md-12');
            messageDiv.setAttribute('id', 'Message'+data[i].MessageId);

            name.innerHTML = data[i].First_name + " " + data[i].Last_name;
            subject.innerHTML = data[i].Subject;
            content.innerHTML = data[i].Content;


            var deleteMessageDiv = document.createElement('div');
            deleteMessageDiv.setAttribute('class', 'col-md-12');
            deleteMessageDiv.setAttribute('align', 'right');

            var deleteMessageButton = document.createElement("button");
            deleteMessageButton.setAttribute('class', 'btn-danger');
            deleteMessageButton.innerHTML = 'Delete Message';
            deleteMessageButton.setAttribute('onclick', 'deleteSentMessage(' + data[i].MessageId +")");

            deleteMessageDiv.appendChild(deleteMessageButton);

            messageDiv.appendChild(deleteMessageDiv);
            messageDiv.appendChild(name);
            messageDiv.appendChild(subject);
            messageDiv.appendChild(content);

            sentMessagesDiv.appendChild(messageDiv);
        }
      }
    },
  });
}

function deleteRecievedMessage(MessageId) {
    $.ajax({
      type: 'GET',
      jsonp : 'callback',
      url: 'http://localhost:1337/deleteReceivedMessage',
      dataType: 'json',
      data:{
        MessageId : MessageId
      },
      success: function(rows) {
        document.getElementById('ReceivedMessages').removeChild(document.getElementById('Message' + MessageId));
      }
  });
}

function deleteSentMessage(MessageId) {
    $.ajax({
      type: 'GET',
      jsonp : 'callback',
      url: 'http://localhost:1337/deleteSentMessage',
      dataType: 'json',
      data:{
        MessageId : MessageId
      },
      success: function(rows) {
        document.getElementById('SentMessages').removeChild(document.getElementById('Message' + MessageId));
      }
  });
}
