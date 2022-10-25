const http = require("http");

const port = 8080;
let payload = "hello";
console.log('hello');
http.createServer((request, response) => {
	console.log(JSON.stringify(request));
	request.on("data", (chunk) => {

	});
	request.on("end", () => {
		response.writeHead(200, {
			'Content-Length': Buffer.byteLength(payload),
			"Content-Type": "text/plain"
		}).end(payload);
	});
}).listen(port);