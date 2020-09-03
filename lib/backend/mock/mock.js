"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithMockBackend = void 0;
var default_1 = __importDefault(require("../../address-parser/default"));
var queue_1 = __importDefault(require("./queue"));
var function_1 = __importDefault(require("./function"));
var registry_1 = __importDefault(require("./registry"));
var pubsub_1 = __importDefault(require("./pubsub"));
var backend_1 = __importDefault(require("../backend"));
// Convenience factory function
function WithMockBackend(config) {
    return new backend_1.default(new default_1.default(), new registry_1.default(config), new queue_1.default(config), new function_1.default(config), new pubsub_1.default(config));
}
exports.WithMockBackend = WithMockBackend;
