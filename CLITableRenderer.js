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
		this.data = data;
		return this;
	},
	render: function() {
		for(var i in this.data){
			this.table.push(this.data[i]);
		}
		console.log(this.table.toString());
	}
};

module.exports = new CLITableRenderer();