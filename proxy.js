var http = require('http');
var forwardUrl = process.env.ForwardUrl || 'cloudstitch.azure-mobile.net';

exports.forward = function (req, res) {
    console.log('forwarding request for ' + req.path);

    var headers = {
        'x-zumo-application': process.env.AppKey || 'CRpeeOnzAGfdSjmgrsageYSawSyOdg40'
    };

    // TODO: I probably don't want to remove _all_ of the other headers...
    for (var header in req.headers) {
        if (header.indexOf('x-zumo') == 0) {
            headers[header] = req.headers[header];
        }
    }

    var zumo_request = http.request({
        host: forwardUrl,
        port: 80,
        path: req.path,
        method: req.method,
        headers: req.headers
    }, function (zumo_response) {
        zumo_response.on('data', function (chunk) {
            console.log('Server data: ' + chunk.toString());
            res.write(chunk, 'binary');
        });

        zumo_response.on('end', function () {
            console.log('Server response ended');
            res.end();
        });
        res.writeHead(zumo_response.statusCode, zumo_response.headers);
    });

    zumo_request.on('error', function (err) {
        console.log('Server error: ' + err);
    });

    req.on('data', function (chunk) {
        console.log('Client data: ' + chunk.toString());
        zumo_request.write(chunk, 'binary');
    });

    req.on('end', function () {
        console.log('Client request ended');
        zumo_request.end();
    });
}