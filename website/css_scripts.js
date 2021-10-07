var body = undefined;

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

var interval = undefined;

var sampling = 1000;

var scaling_fs = 1.5;


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
	rec.appendChild(recB);
}

function clearBuffer() {
    rBuffer = {
        alpha: [],
        beta: [],
        gamma: [],
        x:[],
        y:[],
        z:[]
    };
}

function reactToPred(predIdx) {
    document.getElementById('prediction').innerHTML = NBclasses[predIdx];

    if (predIdx == 2) {
        var size = fontSize * scaling_fs + 'px';
    } else {
        var size = fontSize + 'px';
    }
    body.style.fontSize = size;
}

function doPrediction() {
    val = rBuffer;
    clearBuffer();
    
    aggF = []
    // Not elegant but will do
    aggF.push(minN(val.alpha));
    aggF.push(maxN(val.alpha));
    aggF.push(meanN(val.alpha));
    aggF.push(medianN(val.alpha));
    aggF.push(stdN(val.alpha));
    aggF.push(varN(val.alpha));

    aggF.push(minN(val.beta));
    aggF.push(maxN(val.beta));
    aggF.push(meanN(val.beta));
    aggF.push(medianN(val.beta));
    aggF.push(stdN(val.beta));
    aggF.push(varN(val.beta));

    aggF.push(minN(val.gamma));
    aggF.push(maxN(val.gamma));
    aggF.push(meanN(val.gamma));
    aggF.push(medianN(val.gamma));
    aggF.push(stdN(val.gamma));
    aggF.push(varN(val.gamma));

    aggF.push(minN(val.x));
    aggF.push(maxN(val.x));
    aggF.push(meanN(val.x));
    aggF.push(medianN(val.x));
    aggF.push(stdN(val.x));
    aggF.push(varN(val.x));

    aggF.push(minN(val.y));
    aggF.push(maxN(val.y));
    aggF.push(meanN(val.y));
    aggF.push(medianN(val.y));
    aggF.push(stdN(val.y));
    aggF.push(varN(val.y));

    aggF.push(minN(val.z));
    aggF.push(maxN(val.z));
    aggF.push(meanN(val.z));
    aggF.push(medianN(val.z));
    aggF.push(stdN(val.z));
    aggF.push(varN(val.z));

    classIdx = predict(aggF);
    reactToPred(classIdx);
}

function record() {
	recording = !recording;
	recB = document.getElementById('record_button');
	if (recording) {
		clearBuffer();
		interval = setInterval(doPrediction, sampling);
        document.getElementById('acc').innerHTML = '';
        document.getElementById('accig').innerHTML = '';       
        document.getElementById('rotr').innerHTML = '';     
        document.getElementById('iv').innerHTML =  '';
		recB.value = 'Stop';
	} else {
        clearInterval(interval)
        document.getElementById('prediction').innerHTML = '';
		recB.value = 'Start';
	}
}

function writeDataToBuffer(acc,rot) {
    rBuffer.alpha.push(rot.alpha);
    rBuffer.beta.push(rot.beta);
    rBuffer.gamma.push(rot.gamma);
    rBuffer.x.push(acc.x);
    rBuffer.y.push(acc.y);
    rBuffer.z.push(acc.z);
}

function devmo(acceleration, accelerationIncludingGravity, rotationRate, interval) {
    //document.getElementsByTagName('body')[0].style.backgroundColor = 'red';
    
	if (recording) {
		writeDataToBuffer(accelerationIncludingGravity,rotationRate);
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
        body = document.getElementsByTagName('body')[0];
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
