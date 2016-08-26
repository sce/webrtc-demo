var ajax = require('./ajax.js');

function AjaxSignalChannel(fetchUrl, putUrl) {
  this.fetchUrl = fetchUrl;
  this.putUrl = putUrl;
};

AjaxSignalChannel.prototype.send = function(data, callback) {
  var encoded = encodeURIComponent(JSON.stringify(data));
  ajax.put(this.putUrl, { encoded: encoded }, callback);
};

AjaxSignalChannel.prototype.pollData = function(callback) {
  var self = this;
  ajax.get(this.fetchUrl, function(json) {
    if (json) {
      try {
        var data = JSON.parse(json);
        data = JSON.parse(decodeURIComponent(data.encoded));
        callback(data);
      } catch(err) {
        console.error("AjaxSignalChannel.pollData: Error parsing json & running callback:", err);
        console.info("presumed json:", json);
      }
    }
    // continue polling for more data:
    setTimeout(self.pollData.bind(self, callback), 500);
  });
};

module.exports = AjaxSignalChannel;
