function Log() {
	
	this.logs = [];
	this.initialized = false;
	
	this.addToLog = function(msg) {
		if(!this.initialized){
			var logdiv = document.createElement('div');
			logdiv.id = 'logdiv';
			var content = document.getElementById('content');
			//document.getElementById('content').appendChild(logdiv);
			content.appendChild(logdiv);
			this.initialized = true;
		}
		console.log(msg);
		this.logs.push(msg);
	}
	
	this.printLog = function() {
		for(var i = 0; i < this.logs.length; i++) {
			var id = 'logp' + i;
			console.log(id);
			var logp = document.createElement('p');
			logp.id = id;
			document.getElementById('logdiv').appendChild(logp);
			var t = this.logs[i];
			console.log(t);
			document.getElementById(id).innerHTML = t;
		}
		this.logs.length = 0;
	}
	
}
