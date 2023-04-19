// package: example_service
// file: example_service.proto

var example_service_pb = require("./example_service_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var example_service = (function () {
  function example_service() {}
  example_service.serviceName = "example_service.example_service";
  return example_service;
}());

example_service.example_service = {
  methodName: "example_service",
  service: example_service,
  requestStream: false,
  responseStream: false,
  requestType: example_service_pb.Query,
  responseType: example_service_pb.Answer
};

exports.example_service = example_service;

function example_serviceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

example_serviceClient.prototype.example_service = function example_service(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(example_service.example_service, {
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

exports.example_serviceClient = example_serviceClient;

