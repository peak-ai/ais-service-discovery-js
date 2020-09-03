"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithAwsBackend = exports.WithMockBackend = exports.ServiceDiscovery = exports.listen = exports.queue = exports.subscribe = exports.publish = exports.request = exports.call = void 0;
// @ts-ignore
var call_service_1 = require("./call-service");
Object.defineProperty(exports, "call", { enumerable: true, get: function () { return call_service_1.call; } });
Object.defineProperty(exports, "request", { enumerable: true, get: function () { return call_service_1.request; } });
Object.defineProperty(exports, "publish", { enumerable: true, get: function () { return call_service_1.publish; } });
Object.defineProperty(exports, "subscribe", { enumerable: true, get: function () { return call_service_1.subscribe; } });
Object.defineProperty(exports, "queue", { enumerable: true, get: function () { return call_service_1.queue; } });
Object.defineProperty(exports, "listen", { enumerable: true, get: function () { return call_service_1.listen; } });
// Beta api -
var backend_1 = __importDefault(require("./backend/backend"));
exports.ServiceDiscovery = backend_1.default;
var mock_1 = require("./backend/mock/mock");
Object.defineProperty(exports, "WithMockBackend", { enumerable: true, get: function () { return mock_1.WithMockBackend; } });
var aws_1 = require("./backend/aws/aws");
Object.defineProperty(exports, "WithAwsBackend", { enumerable: true, get: function () { return aws_1.WithAwsBackend; } });
