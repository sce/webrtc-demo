var addLocalStream = function(peer, successCb, failureCb, actAsClient) {
  var constraints = {
    video: true,
    audio: false,
  };

  navigator.mediaDevices.getUserMedia(constraints)
    .then(function(stream) {
      var videoTracks = stream.getVideoTracks();
      console.info("Using video device: " + videoTracks[0].label);

      stream.oninactive = function() {
        console.info("Stream INACTIVE.");
      };

      // now we're ready to create an offer:
      peer.createConnection(actAsClient, stream);

      if (successCb) {
        // this callback can be used to add the stream to our local web page:
        successCb(stream);
      }
    })
    .catch(function(error) {
      console.error("getUserMedia failed:");
      console.error(error);

      if (failureCb) {
        failureCb(error);
      }
    });
}

// callbacks is expected to look like this:
// {
//   localStream: {
//     success: function(stream) {},
//     failure: function(error) {},
//   },
//   remoteStream: {
//     add: function(stream) {},
//     remove: function() {},
//   }
// }
var makeMultimediaPeer = function(peer, callbacks, actAsClient) {
  addLocalStream(peer, callbacks.localStream.success, callbacks.localStream.failure, actAsClient);
}

var afterConnect = function(peer, callbacks) {
  peer.peerConnection.ontrack = function(event) {
    console.info("GOT remote stream");
    callbacks.remoteStream.add(event.streams[0]);
  };

  peer.peerConnection.onremovestream = function(event) {
    console.info("Remote stream REMOVED");
    console.info(event);
    callbacks.remoteStream.remove(event);
  };
}

module.exports = {
  makeMultimediaPeer: makeMultimediaPeer,
  afterConnect: afterConnect
};
