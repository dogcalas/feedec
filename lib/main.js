var {Cc, Ci} = require("chrome");
var parser = Cc["@mozilla.org/xmlextras/domparser;1"].createInstance(Ci.nsIDOMParser);
var self = require("sdk/self");


var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");


var panel = panels.Panel({
  contentURL: self.data.url("panel.html"),
  onHide: handleHide,
  contentScriptFile: [self.data.url("jquery-2.1.0.min.js"),self.data.url("data.js")],
  contentStyleFile:self.data.url("estilo.css")
});

var button = ToggleButton({
  id: "my-button",
  label: "Feedec",
  icon: {
    "16": "./feedec.png",
  },
  onChange: handleChange,
  onClick: function(event) {
    var Request = require("sdk/request").Request;
    var goblecontent = Request({
      url: "http://mozilla.ec/feed",
      onComplete: function (response) {
        var xml = parser.parseFromString(response.text, "application/xml");  
        var packs = xml.getElementsByTagName("item");
		var list = new Array();
		for(var i = 0; i<5; i++){
			list.push(
			{
				title:packs[i].getElementsByTagName("title")[0].innerHTML,
				url:packs[i].getElementsByTagName("link")[0].innerHTML,
				description:packs[i].getElementsByTagName("description")[0].innerHTML.replace("<![CDATA[<p>","").substr(0,120)+"..."
			});
			
		}
		panel.port.emit("enviar", list);
		console.log(list);

      }
    });

    goblecontent.get();

    }
});

function handleChange(state) {
  if (state.checked) {
    panel.show({
      position: button
    });
  }
}

function handleHide() {
  button.state('window', {checked: false});
}


