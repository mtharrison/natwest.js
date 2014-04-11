var express = require('express');


var ServerRenderer = function() {
	this.app = express();
};

ServerRenderer.prototype = {
	setData: function(data) {
		this.data = data;
		return this;
	},
	render: function() {
		var self = this;
		this.app.get('/', function(req, res){
			res.json(self.data);
		});
		this.app.listen(4488);
		console.log("Server is listening on 127.0.0.1:4488");
	}
};

module.exports = new ServerRenderer();