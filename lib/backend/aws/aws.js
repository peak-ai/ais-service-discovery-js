"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithAwsBackend = void 0;
var aws_sdk_1 = __importDefault(require("aws-sdk"));
var backend_1 = __importDefault(require("../backend"));
var sns_1 = __importDefault(require("./sns"));
var sqs_1 = __importDefault(require("./sqs"));
var lambda_1 = __importDefault(require("./lambda"));
var cloudmap_1 = __importDefault(require("./cloudmap"));
var default_1 = __importDefault(require("../../address-parser/default"));
// Convenience factory function
function WithAwsBackend() {
    return new backend_1.default(new default_1.default(), new cloudmap_1.default(new aws_sdk_1.default.ServiceDiscovery()), new sqs_1.default(new aws_sdk_1.default.SQS()), new lambda_1.default(new aws_sdk_1.default.Lambda()), new sns_1.default(new aws_sdk_1.default.SNS()));
}
exports.WithAwsBackend = WithAwsBackend;
