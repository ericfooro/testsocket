var Socket = require('socketHandler');
var sock = new Socket();
sock.connect();

function send(){
	sock.sendMessage("Hi Ethan");
}

Ti.App.fireEvent("websocketMessage", function(e) {
	Ti.API.log(e);
});

Ti.App.addEventListener("socketMessage", function(e) {
	Ti.API.log(JSON.stringify(e.event));
});


$.index.open();
