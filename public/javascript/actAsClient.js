/* actAsClient.js */

var Peer = require('./peer.js');
var mmPeer = require('./mmpeer.js');

var gotReceiveChannel = function(receiveChannel) {
  window.receiveChannel = receiveChannel;

  // This means the connection is up and running and we're ready to go full multimedia:
  mmPeer.afterConnect(peer, {
    remoteStream: {
      add: function(stream) {
        document.querySelector('video.remote').src = window.URL.createObjectURL(stream);
        //document.querySelector('video.remote').srcObj = stream;
      },
      remove: function(stream) {
        console.log("remove???");
      },
    }
  });

  if (this.onreceivemessage) {
    receiveChannel.onmessage = this.onreceivemessage;
  } else {
    receiveChannel.onmessage = (event) => {
      console.log("RECEIVED: " + event.data);
    };
  }

  receiveChannel.onopen = receiveChannel.onclose = (event) => {
    console.log("receiveChannel state change: " + receiveChannel.readyState);

    switch (receiveChannel.readyState) {
      case 'closed':
        this.createConnection(true); // client behaviour
        break;
    }
  };
};

var gotSendChannel = function(sendChannel) {
  window.sendChannel = sendChannel;

  sendChannel.onopen = sendChannel.onclose = (event) => {
    console.log("sendChannel state change: " + sendChannel.readyState);

    switch (sendChannel.readyState) {
      case 'open':
        sendChannel.send("hello from client!");
        break;
    }
  };
};

var peer = new Peer("//localhost:4000/client", "//localhost:4000/server", gotReceiveChannel, gotSendChannel);

var actAsClient = true;

mmPeer.makeMultimediaPeer(peer, {
  localStream: {
    success: function(stream) {
      document.querySelector('video.local').src = window.URL.createObjectURL(stream);
    }
  },
}, actAsClient);

//peer.createConnection(actAsClient);

window.peer = peer;
