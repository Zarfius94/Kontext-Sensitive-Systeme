var acc, accig, rotr, iv, sTime = 0;

var recording = false;

var rBuffer = '';

var columnDelimiter = ','
var lineDelimiter = '\n';

//In px!
var fontSize = 50;

var rotation = 0;

var settingsMode = true;

var enableLog = false;

var log = undefined;

//window.addEventListener("deviceorientation", handleOrientation, true);

//Initalisieren der Seite und bestimmter Objekte
function initsetup() {
	log = new Log();
	console.log('Setup');
	log.addToLog('Setup');
	var toSettings = document.createElement('div');
	toSettings.id = "toset";
	toSettings.style.width = 75;
	toSettings.style.height = 75;
	toSettings.style.backgroundColor = 'black';
	toSettings.style.position = 'fixed';
	toSettings.style.top = 0;
	toSettings.style.right = 0;
	document.getElementsByTagName('body')[0].appendChild(toSettings);
	addEvent(toSettings, 'click', settingsacc);
	//document.getElementsByTagName('body')[0].style.backgroundColor = 'blue';

	document.getElementsByTagName('body')[0].appendChild(toSettings);
	addEvent(toSettings, 'click', settingsacc);
	log.addToLog("Setup done");
	settingsacc();

	var rec = document.getElementById('extra');
	var recB = document. createElement('input');
	recB.type = 'button';
	recB.id = 'record_button';
	recB.value = 'Start';
	recB.style.fontSize = fontSize + 'px';
	addEvent(recB, 'click', record);
	rec.appendChild(recB)
}

function record() {
	recording = !recording;
	recB = document.getElementById('record_button');
	if (recording) {
		rBuffer = 'data:text/csv;charset=utf-8,';
		sTime = new Date()
		recB.value = 'Stop';
	} else {
		recB.value = 'Start';
		getCsv();
	}
}

function getCsv() {
	if (rBuffer.length > 28) {
		dataFile = encodeURI(rBuffer);
		nd = document.createElement('a');
		nd.setAttribute('href', rBuffer);
		nd.setAttribute('download', 'recording.csv');
		nd.click();
	}
}

function handleOrientation(event) {
    devmo(event.acceleration, event.accelerationIncludingGravity, event.rotationRate, event.interval);
}

function devmo(acceleration, accelerationIncludingGravity, rotationRate, interval) {
    //document.getElementsByTagName('body')[0].style.backgroundColor = 'red';
    
	if (recording) {
		mTime = new Date()
		rBuffer += (mTime - sTime) / 1000 + columnDelimiter + accelerationIncludingGravity.x + columnDelimiter + accelerationIncludingGravity.y + columnDelimiter + accelerationIncludingGravity.z + lineDelimiter;
	} else {
		acc = acceleration.x.toFixed(2) + ' ' + acceleration.y.toFixed(2) + ' ' + acceleration.z.toFixed(2);
		accig = accelerationIncludingGravity.x.toFixed(2) + ' ' + accelerationIncludingGravity.y.toFixed(2) + ' ' + accelerationIncludingGravity.z.toFixed(2);
		rotr = rotationRate.alpha.toFixed(2) + ' ' + rotationRate.beta.toFixed(2) + ' ' + rotationRate.gamma.toFixed(2);
		iv = interval;
	
		log.addToLog('Input done');
		
		process();
	}
	
	
}

function process() {
    // Datenverarbeitung

    // Hier nichts nötig

    // Ausgabe
    showValues(acc, accig, rotr, iv);
}

//Ausgaben

function showValues(acc_S, accig_S, rotr_S, iv_S) {

    log.addToLog("Testing");

    //document.getElementsByTagName('body')[0].style.backgroundColor = 'green';

	document.getElementById('acc').innerHTML = 'Beschleunigung: ' + acc_S;
	
	document.getElementById('accig').innerHTML = 'Beschleunigung mit g: ' + accig_S;
	
    document.getElementById('rotr').innerHTML = 'Rotationsrate: ' + rotr_S;
    
    document.getElementById('iv').innerHTML =  'Intervall: ' + iv_S;
	
	//centerHor(document.getElementById('content_text'));
}

function addText(identifier, msg) {
	var newTextP = document.getElementById(identifier);
	if(newTextP == undefined) {
		var content = document.getElementById('content_text');
		newTextP = document.createElement('p');
		newTextP.id = identifier;
		content.appendChild(newTextP);
	}
	newTextP.innerHTML = identifier + ': ' + msg;
	log.addToLog('text for ' + identifier + ' added');
	centerHor(document.getElementById('content_text'));
	
}

function centerHor(ele) {
	ele.style.position = 'static';
	
	ele.style.height = 'auto';
	var h = ele.clientHeight;
	if(h <= ele.parentElement.clientHeight) {
		ele.style.height = h;
		ele.style.position = 'absolute';
	}
}

//Umwandlungsfunktionen

//Wandelt die Werte rot, grün und blau in eine hexadezimale Zahl um.
function RgbToHex(red, green , blue) {
	var hexr = red.toString(16);
	var hexg = green.toString(16);
	var hexb = blue.toString(16);
  
	var hex = '#';
	if(hexr.length == 1) {
		hexr = '0' + hexr;
	}
	hex = hex + hexr;
	if(hexg.length == 1) {
		hexg = '0' + hexg;
	}
	hex = hex + hexg;
	if(hexb.length == 1) {
		hexb = '0' + hexb;
	}
	hex = hex + hexb;
	return hex;
}

//Einstellungen
function settingsacc() {
	settingsMode = true;
	document.getElementById('content').style.display = 'None';
	document.getElementById('toset').style.display = 'None';
	
	var body = document.getElementsByTagName('body')[0];
	body.style.backgroundColor = 'white';
	body.style.color = 'black';
	
	var setdiv = document.createElement('div');
	setdiv.id = 'setdiv';
	setdiv.style.fontSize = fontSize + 'px';
	
	//Schriftgröße wählen.
	var sliderFontSizeP = document.createElement('p');
	sliderFontSizeP.id = 'fsvp';
	sliderFontSizeP.innerHTML = 'Font size: ';
	var FontSizeValue = document.createElement('span');
	FontSizeValue.id = 'fsv';
	FontSizeValue.innerHTML = fontSize + 'px';
	sliderFontSizeP.appendChild(FontSizeValue);
	appendNewLine(sliderFontSizeP);
	var sliderFontSize = document.createElement('input');
	sliderFontSize.id = 'sFontSize';
	sliderFontSize.className = 'slider';
	sliderFontSize.type = 'range';
	sliderFontSize.min = 10;
	sliderFontSize.max = 100;
	sliderFontSize.value = fontSize;
	sliderFontSize.step = 5;
	sliderFontSize.oninput = function() { 
		fontSize = sliderFontSize.value;
		var size = fontSize + 'px';
		FontSizeValue.innerHTML = size;
		exampleText.style.fontSize = size;
		body.style.fontSize = size;
	}
	sliderFontSizeP.appendChild(sliderFontSize);
	var exampleText = document.createElement('span');
	exampleText.innerHTML = 'Lorem ipsum set dolor sit amet';
	appendNewLine(sliderFontSizeP);
	sliderFontSizeP.appendChild(exampleText);
	setdiv.appendChild(sliderFontSizeP);	
	
	//Einstellungen bestätigen und verlassen
	var confirmdiv = document.createElement('div');
    confirmdiv.id = 'confirmdiv';
	var buttonConfirm = document.createElement('input');
	buttonConfirm.id = 'confirm';
	buttonConfirm.type = 'button';
	buttonConfirm.value = 'confirm';
	buttonConfirm.style.fontSize = fontSize + 'px';
	buttonConfirm.onclick = function() {
		document.getElementById('content').style.display = 'block';
		settingsMode = false;
		body.removeChild(setdiv);
        document.getElementById('toset').style.display = 'block';
        //body.style.backgroundColor = 'rosybrown'
	}
	confirmdiv.appendChild(buttonConfirm);
	setdiv.appendChild(confirmdiv);
	
	body.appendChild(setdiv);
}

function appendNewLine(parentElement){
	var nl = document.createElement('br');
	parentElement.appendChild(nl);
}

addEvent(document, 'readystatechange', function() {
    if(document.readyState === 'complete') {
        //document.getElementsByTagName('body')[0].style.backgroundColor = 'teal';
        initsetup();
    }
});


addEvent(window, 'resize', function() {
	if(!settingsMode) {
		centerHor(document.getElementById('content_text'));
    }
});


if (typeof(DeviceMotionEvent) !== 'undefined' && typeof(DeviceMotionEvent.requestPermission) === 'function')
{
    DeviceMotionEvent.requestPermission().then(response => {
		if (response === 'granted')
		{
			addEvent(window, 'devicemotion', function(event) {
				if(!settingsMode) {
					devmo(event.acceleration, event.accelerationIncludingGravity, event.rotationRate, event.interval);
				}
			});
		}
		else
		{
			// Permission denied
		}
	}).catch(console.error);
}
else
{
	addEvent(window, 'devicemotion', function(event) {
		if(!settingsMode) {
			devmo(event.acceleration, event.accelerationIncludingGravity, event.rotationRate, event.interval);
		}
	});
}
