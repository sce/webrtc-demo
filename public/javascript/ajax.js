var ajax = {
  get: function(url, cb) {
    var file = new XMLHttpRequest();

    file.open("GET", url, true);

    file.onreadystatechange = function() {
      if (file.readyState == XMLHttpRequest.DONE) {
        if (file.status === 200 || file.status === 0) {
          cb(file.responseText);
        }
      }
    };

    file.send(null);
  },

  put: function(url, data, cb) {
    return this.send("PUT", url, data, cb);
  },

  send: function(verb, url, data, cb) {
    var file = new XMLHttpRequest();

    file.open(verb, url, true);

    file.onreadystatechange = function() {
      if (file.readyState == XMLHttpRequest.DONE) {
        if (file.status === 200 || file.status === 0) {
          if (cb) cb(file.status);
        }
      }
    };

    var msg = JSON.stringify(data);
    file.send(msg);
  },
};

module.exports = ajax;
