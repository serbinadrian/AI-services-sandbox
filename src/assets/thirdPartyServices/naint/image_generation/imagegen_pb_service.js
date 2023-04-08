// package: image_generation
// file: imagegen.proto

var imagegen_pb = require("./imagegen_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var image_generation = (function () {
  function image_generation() {}
  image_generation.serviceName = "image_generation.image_generation";
  return image_generation;
}());

image_generation.Gen = {
  methodName: "Gen",
  service: image_generation,
  requestStream: false,
  responseStream: false,
  requestType: imagegen_pb.Text,
  responseType: imagegen_pb.Image
};

exports.image_generation = image_generation;

function image_generationClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

image_generationClient.prototype.gen = function gen(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(image_generation.Gen, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

exports.image_generationClient = image_generationClient;

