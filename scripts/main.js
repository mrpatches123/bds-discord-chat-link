import { world } from "@minecraft/server";
console.warn('hello');
//world.ejhjhe();
import { http, HttpHeader, HttpRequest, HttpRequestMethod } from "mojang-net";

const port = 8080;
let request = new HttpRequest(`http://localhost:${port}`);
request.method = HttpRequestMethod.POST;
req.headers = [
	new HttpHeader('Content-Type', 'text/plain')
];
request.body = 'hi';
request.timeout = 100;

async function test() {
	let res = await http.request(request);
	console.warn(JSON.stringify(res));
};

world.events.tick.subscribe(({ currentTick }) => {


	/*[...world.getPlayers()].forEach(player => {
		player.tell('pjkekjjfke');
	});*/
	if (currentTick % 20) return;
	console.warn('running', currentTick);
	world.say('hi');
	// test();//.error(error => console.warn(error, error.stack));
});