if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.slice(0, str.length) == str;
  };
}

var http = require('http');
var httpProxy = require('http-proxy');
var url = require('url');
var path = require('path');
var fs = require('fs');
var mime = require("mime");

var serve_static = function(request, response) {
 
  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri);
  
  fs.exists(filename, function(exists) {
        if(!exists) {
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404 Not Found\n");
        response.end();
        return;
        }
    
        var stat = fs.statSync(filename);
        if (stat.isDirectory()) filename += '/index.html';
        
        var rangeRequest = readRangeHeader(request.headers['range'], stat.size);
        if (rangeRequest) {
                var start = rangeRequest.Start;
                var end = rangeRequest.End;

                // If the range can't be fulfilled. 
                if (start >= stat.size || end >= stat.size) {
                    // Indicate the acceptable range.
                    responseHeaders['Content-Range'] = 'bytes */' + stat.size; // File size.

                    // Return the 416 'Requested Range Not Satisfiable'.
                    response.writeHead(416, { 
                        "Content-Range": 'bytes */' + stat.size
                    });
                    response.end();
                    return;
                }
                
                // Indicate the current range.
                var length = start == end ? 0 : (end - start + 1);
                response.writeHead(206, {
                    "Content-Range": 'bytes ' + start + '-' + end + '/' + stat.size,
                    "Content-Length": length,
                    "Content-Type": mime.lookup(filename),
                    "Accept-Ranges": "bytes",
                    "Cache-Control": "no-cache"
                });
                
                var instream = fs.createReadStream(filename, { start: start, end: end });
                instream.on('open', function () {
                    instream.pipe(response);
                });
        } else {
            fs.readFile(filename, "binary", function(err, file) {
            if(err) {        
                response.writeHead(500, {"Content-Type": "text/plain"});
                response.write(err + "\n");
                response.end();
                return;
            }
        
            response.writeHead(200, {
                "Content-Type": mime.lookup(filename),
                "Content-Length": stat.size,
                "Accept-Ranges": "bytes"
                
            });
            response.write(file, "binary");
            response.end();
            });
        }
    });
};

var readRangeHeader = function(range, totalLength) {
        /*
         * Example of the method 'split' with regular expression.
         * 
         * Input: bytes=100-200
         * Output: [null, 100, 200, null]
         * 
         * Input: bytes=-200
         * Output: [null, null, 200, null]
         */

    if (range == null || range.length == 0)
        return null;

    var array = range.split(/bytes=([0-9]*)-([0-9]*)/);
    var start = parseInt(array[1]);
    var end = parseInt(array[2]);
    var result = {
        Start: isNaN(start) ? 0 : start,
        End: isNaN(end) ? (totalLength - 1) : end
    };
    
    if (!isNaN(start) && isNaN(end)) {
        result.Start = start;
        result.End = totalLength - 1;
    }

    if (isNaN(start) && !isNaN(end)) {
        result.Start = totalLength - end;
        result.End = totalLength - 1;
    }

    return result;
}

var proxy = httpProxy.createProxyServer({
    target: {
        host: 'localhost',
        port: 8080
    }
});

var server = http.createServer(function (req, res) {
    var path = url.parse(req.url).pathname;
    
    if (path.startsWith("/.rest") || path.startsWith("/scenarioStatus")) {
        proxy.web(req, res);
    } else {
        serve_static(req, res);
    }
});

// web socket support
server.on('upgrade', function (req, socket, head) {
    proxy.ws(req, socket, head);
});

proxy.on('error', function (e) {
    console.log("*** Proxy error: ");
    console.log(e);
});

server.listen(8081);
