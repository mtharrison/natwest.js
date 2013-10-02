var Table = require('cli-table');

var CLITableRenderer = function() {
	this.table = new Table({
		head: ['#', 'Account name', 'Account number', 'Sort code', "Balance", "Available"],
		colWidths: [3, 20, 20,15,15,15]
	});
	return this;
};

CLITableRenderer.prototype = {
	setData: function(data) {
		for(var i in data)
			this.table.push([data[i].id, data[i].name, data[i].number, data[i].sortcode, data[i].balance, data[i].available]);

		return this;
	},
	render: function() {
		console.log(this.table.toString());
	}
};

module.exports = new CLITableRenderer();