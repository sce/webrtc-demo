/* peer.js */

var AjaxSignalChannel = require('./ajaxSignalChannel.js');

function Peer(signalChannelReadUrl, signalChannelWriteUrl, receiveChannelCallback, sendChannelCallback) {
  this.receiveChannelCallback = receiveChannelCallback.bind(this);
  this.sendChannelCallback = sendChannelCallback.bind(this);

  this.signalChannel = new AjaxSignalChannel(signalChannelReadUrl, signalChannelWriteUrl);
};

// This is the main entry point:
Peer.prototype.createConnection = function(actAsClient, stream) {
  this.actAsClient = actAsClient;
  this.createPeerConnection(stream);

  // Setup data channel (that we can write to):
  var sendDataChannel = this.peerConnection.createDataChannel('sendDataChannel', null);
  this.sendChannelCallback(sendDataChannel);

  if (actAsClient) {
    console.log("Acting as client: Contacting other peer...");
    this.createOffer();
  } else {
    console.log("Acting as server: Waiting for other peer...");
  }

  this.signalChannel.pollData(this.receiveSignalData.bind(this));
};

Peer.prototype.createPeerConnection = function(stream) {
  this.peerConnection = RTCPeerConnection(null, null);

  // adding the stream has to happen here: after creating the stream, before
  // creating any offers:
  if (stream) {
    console.info("Setting stream on connection...");
    this.peerConnection.addStream(stream);
  }

  // ice candidate events are created for us by our host/environment (the web browser):
  var self = this;
  this.peerConnection.onicecandidate = function(event) {
    if (event.candidate) {
      console.log("Created ICE event:");
      console.log(event);

      // The only thing we need them for is to send them to the other peer:
      self.signalChannel.send(event.candidate, function(status) {
        console.log("ICE sent to signal server.");
      });
    }
  };

  // This means the WebRTC channel is up and running (no more need for the signal server):
  this.peerConnection.ondatachannel = function(event) {
    console.log("Got data channel from other peer!");
    self.receiveChannelCallback(event.channel);
  };
};

// Client behaviour:
Peer.prototype.createOffer = function() {
  var self = this;
  this.peerConnection.createOffer().then(function(desc) {
    console.log("Created offer.");
    console.log(desc);
    self.peerConnection.setLocalDescription(desc);

    self.signalChannel.send(desc, function(status) {
      console.info("Offer sent to signal server.");
    });
  });
};

// Server behaviour:
Peer.prototype.createAnswer = function() {
  var self = this;
  this.peerConnection.createAnswer().then(function(desc) {
    console.log("Created answer:");
    console.log(desc);
    self.peerConnection.setLocalDescription(desc);

    self.signalChannel.send(desc, function (status) {
      console.info("Answer sent to signal server:", + status);
    });
  });
};

Peer.prototype.receiveSignalData = function(data) {
  // The signal channel will give us two types of data:
  // - ICE candidates
  // - Remote description (also called "offer" or "answer")
  if (data.candidate) {
    console.log("Got ICE candidate via signal channel:");
    console.log(data.candidate);

    if (this.gotRemoteDescription) {
      this.peerConnection.addIceCandidate(data,
        function() { console.warn("Remote ICE candidate added (direct)") },
        function(err) { console.error("Remote ICE candidate: Failed to add!", err) }
      );
    } else {
      this.iceCandidates = this.iceCandidates || [];
      this.iceCandidates.push(data);
    }

  } else {
    // If we've previously sent, then this was an answer. If we haven't sent,
    // then we need to send our answer.
    if (this.actAsClient) {
      console.log("Got offer answer via signal channel.");
      this.peerConnection.setRemoteDescription(data);

    } else {
      console.log("Got offer via signal channel.");
      this.peerConnection.setRemoteDescription(data);

      this.createAnswer();
    }
    this.gotRemoteDescription = true;

    if (this.iceCandidates) {
      var self = this;
      this.iceCandidates.forEach(function(candidate) {
        self.peerConnection.addIceCandidate(candidate,
          function() { console.warn("Remote ICE candidate added (buffered).") },
          function(err) { console.error("Remote ICE candidate: Failed to add!", err) }
        );
      });
    }
  }
};

module.exports = Peer;
