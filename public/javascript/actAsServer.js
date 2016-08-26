/* actAsServer.js */

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
        // since we are acting as a server we will do nothing now
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
        sendChannel.send("hello from server!");
        break;
    }
  };
};

var peer = new Peer("//localhost:4000/server", "//localhost:4000/client", gotReceiveChannel, gotSendChannel);

var actAsClient = false;

mmPeer.makeMultimediaPeer(peer, {
  localStream: {
    success: function(stream) {
      document.querySelector('video.local').src = window.URL.createObjectURL(stream);
    }
  },
}, actAsClient);

//peer.createConnection(actAsClient);

window.peer = peer;
