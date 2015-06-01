self.port.on("enviar", function(dir) {
	$("#lista").empty();
	for(var i= 0; i<dir.length; i++){
		$("#lista").append($("<li>").append($("<a>", {href:dir[i].url, target:"_blank", text: dir[i].title})));
	}
});