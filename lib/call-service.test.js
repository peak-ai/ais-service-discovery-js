'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var ServiceDiscovery = require('./call-service');
var LambdaAdapter = require('./functions').LambdaAdapter;
var CloudmapAdapter = require('./services').CloudmapAdapter;
var SQS = require('./queue').SQS;
var SNS = require('./events').SNS;
var StepFunctionAdapter = require('./state-machine').StepFunctionAdapter;
var SSMAdapter = require('./automation').SSMAdapter;
var extractServiceParts = require('./helpers/call-service-helper').extractServiceParts;
describe('(call)', function () {
    beforeAll(function () {
        process.env.STAGE = 'latest';
    });
    afterEach(function () {
        jest.resetAllMocks();
        jest.resetModules();
    });
    var lambdaService = {
        id: 'my-func',
        attributes: {
            type: 'function',
            arn: 'my-test-arn',
        },
    };
    var stateMachineService = {
        id: 'state-machine',
        attributes: {
            type: 'state-machine',
            arn: 'my-test-arn',
        },
    };
    var automationService = {
        id: 'test',
        attributes: {
            type: 'automation',
            arn: 'ExampleDocumentName',
        },
    };
    var snsService = {
        id: 'test-topic',
        attributes: {
            type: 'sns',
            arn: 'test-topic',
        },
    };
    var sqsService = {
        id: 'sqs',
        attributes: {
            type: 'queue',
            url: 'test-queue',
        },
    };
    it('should call a lambda function', function () { return __awaiter(void 0, void 0, void 0, function () {
        var expected, body, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expected = { name: 'test' };
                    CloudmapAdapter.prototype.find = jest.fn().mockReturnValue(Promise.resolve(lambdaService));
                    LambdaAdapter.prototype.call = jest.fn().mockImplementation(function () { return Promise.resolve(expected); });
                    expect.assertions(1);
                    body = { name: 'Ewan' };
                    return [4 /*yield*/, ServiceDiscovery.call({
                            service: 'test-service',
                            instance: 'my-func',
                            body: body,
                        })];
                case 1:
                    res = _a.sent();
                    expect(res).toEqual(expected);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should call a lambda using a service id', function () { return __awaiter(void 0, void 0, void 0, function () {
        var expected, body, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expected = { name: 'test' };
                    CloudmapAdapter.prototype.find = jest.fn().mockReturnValue(Promise.resolve(lambdaService));
                    LambdaAdapter.prototype.call = jest.fn().mockImplementation(function () { return Promise.resolve(expected); });
                    expect.assertions(1);
                    body = { name: 'Ewan' };
                    return [4 /*yield*/, ServiceDiscovery.request('my-namespace.test-service->my-func', body)];
                case 1:
                    res = _a.sent();
                    expect(res).toEqual(expected);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should publish an sns event', function () { return __awaiter(void 0, void 0, void 0, function () {
        var messageId, event, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    messageId = 'abc123';
                    CloudmapAdapter.prototype.find = jest.fn().mockReturnValue(Promise.resolve(snsService));
                    SNS.prototype.publish = jest.fn().mockImplementation(function () { return Promise.resolve({
                        MessageId: messageId,
                    }); });
                    expect.assertions(2);
                    event = { name: 'Test' };
                    return [4 /*yield*/, ServiceDiscovery.publish('test-namespace.test-service->test-topic', event)];
                case 1:
                    res = _a.sent();
                    expect(SNS.prototype.publish).toBeCalledWith('test-topic', event, undefined);
                    expect(res).toEqual({ MessageId: messageId });
                    return [2 /*return*/];
            }
        });
    }); });
    it('should publish an sns event with MessageAttributes if present in the options', function () { return __awaiter(void 0, void 0, void 0, function () {
        var messageId, event, attributes, options, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    messageId = 'abc123';
                    CloudmapAdapter.prototype.find = jest.fn().mockReturnValue(Promise.resolve(snsService));
                    SNS.prototype.publish = jest.fn().mockImplementation(function () { return Promise.resolve({
                        MessageId: messageId,
                    }); });
                    expect.assertions(2);
                    event = { name: 'Test' };
                    attributes = {
                        tenant: {
                            DataType: 'String',
                            StringValue: 'foo',
                        },
                    };
                    options = {
                        foo: true,
                        attributes: attributes,
                    };
                    return [4 /*yield*/, ServiceDiscovery.publish('test-namespace.test-service->test-topic', event, options)];
                case 1:
                    res = _a.sent();
                    expect(SNS.prototype.publish).toBeCalledWith('test-topic', event, attributes);
                    expect(res).toEqual({ MessageId: messageId });
                    return [2 /*return*/];
            }
        });
    }); });
    it('should send an sqs message', function () { return __awaiter(void 0, void 0, void 0, function () {
        var namespace, queue, namespaceQueue, message, mockMessageId, opts, MessageId, mockDelete, messages;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expect.assertions(5);
                    namespace = 'test-namespace';
                    queue = 'test-queue';
                    namespaceQueue = namespace + "." + queue;
                    message = { name: 'test' };
                    mockMessageId = 'abc123';
                    opts = { MessageGroupId: 'abc123', MessageDeduplicationId: 'abc123' };
                    CloudmapAdapter.prototype.find = jest.fn().mockReturnValue(Promise.resolve(sqsService));
                    SQS.prototype.send = jest.fn().mockImplementation(function () { return Promise.resolve({
                        MessageId: mockMessageId,
                    }); });
                    return [4 /*yield*/, ServiceDiscovery.queue(namespaceQueue, message, opts)];
                case 1:
                    MessageId = (_a.sent()).MessageId;
                    expect(SQS.prototype.send).toBeCalledWith(queue, message, opts);
                    expect(MessageId).toEqual(mockMessageId);
                    mockDelete = jest.fn();
                    CloudmapAdapter.prototype.find = jest.fn().mockReturnValue(Promise.resolve(sqsService));
                    SQS.prototype.listen = jest.fn().mockImplementation(function () { return Promise.resolve({
                        message: message,
                        delete: mockDelete,
                    }); });
                    return [4 /*yield*/, ServiceDiscovery.listen('test-namespace.test-service->test-queue')];
                case 2:
                    messages = _a.sent();
                    messages.on('message', function (msg) {
                        msg.delete();
                        expect(message).toEqual(msg.message);
                        expect(mockDelete).toHaveBeenCalled();
                        messages.stop();
                    });
                    expect(SQS.prototype.listen).toBeCalledWith('test-queue');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should use the specified namespace if included in service name', function () { return __awaiter(void 0, void 0, void 0, function () {
        var serviceWithNamespace;
        return __generator(this, function (_a) {
            expect.assertions(1);
            serviceWithNamespace = 'my-namespace.service-name->instance';
            expect(extractServiceParts(serviceWithNamespace))
                .toEqual({
                namespace: 'my-namespace',
                service: 'service-name',
                instance: 'instance',
            });
            return [2 /*return*/];
        });
    }); });
    it('should use the default namespace if not included in service name', function () { return __awaiter(void 0, void 0, void 0, function () {
        var defaultNamespaceVal, serviceWithoutNamespace;
        return __generator(this, function (_a) {
            expect.assertions(1);
            defaultNamespaceVal = 'default';
            serviceWithoutNamespace = 'service-name->instance';
            expect(extractServiceParts(serviceWithoutNamespace))
                .toEqual({
                namespace: defaultNamespaceVal,
                service: 'service-name',
                instance: 'instance',
            });
            return [2 /*return*/];
        });
    }); });
    it('should start a state machine', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var expected, body, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expected = { name: 'testing' };
                    CloudmapAdapter.prototype.find = jest.fn()
                        .mockReturnValue(Promise.resolve(stateMachineService));
                    StepFunctionAdapter.prototype.start = jest.fn().mockReturnValue(Promise.resolve(expected));
                    body = { name: 'test', tenant: 'mock' };
                    return [4 /*yield*/, ServiceDiscovery.call({
                            service: 'test-service',
                            instance: 'test',
                            body: body,
                        })];
                case 1:
                    result = _a.sent();
                    expect(result).toEqual(expected);
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should run an automation task', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var expected, body, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expected = { name: 'testing' };
                    CloudmapAdapter.prototype.find = jest.fn()
                        .mockReturnValue(Promise.resolve(automationService));
                    SSMAdapter.prototype.run = jest.fn().mockReturnValue(Promise.resolve(expected));
                    body = { name: 'test', tenant: 'mock' };
                    return [4 /*yield*/, ServiceDiscovery.call({
                            service: 'test-service',
                            instance: 'test',
                            body: body,
                        })];
                case 1:
                    result = _a.sent();
                    expect(result).toEqual(expected);
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
});
