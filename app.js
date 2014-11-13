#!/usr/bin/env nodejs

/*
 * ASSET SERVER
 */

var http = require('http');
var path = require('path');
var url  = require('url');
var fs   = require('fs');

http.createServer(function(request, response) {

	var uri      = url.parse(request.url).pathname;
	var filename = path.join(process.cwd() + '/public', uri);

	fs.exists(filename, function(exists) {

		if (!exists) {

			response.writeHead(404, { "Content-Type": "text/plain" });
			response.write('404 Not Found\n');
			response.end();

		} else {

			if (fs.statSync(filename).isDirectory()) filename += '/index.html';

			fs.readFile(filename, 'binary', function(err, buffer) {

				if (err) {

					response.writeHead(500, { "Content-Type": "text/plain" });
					response.write(err + '\n');
					response.end();

				} else {

					response.writeHead(200);
					response.write(buffer, 'binary');
					response.end();

				}

			});

		}

	});


}).listen(8080);


console.log('Static file server running at\n => http://localhost:8080');

