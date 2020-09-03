'use strict';
var SSMAdapter = /** @class */ (function () {
    function SSMAdapter(client) {
        this.client = client;
    }
    SSMAdapter.prototype.run = function (name, body, params) {
        var ssmParams = {
            DocumentName: name,
            InstanceIds: body.instanceIds,
        };
        if (params)
            ssmParams.Parameters = params;
        return this.client.sendCommand(ssmParams).promise();
    };
    return SSMAdapter;
}());
module.exports = SSMAdapter;
