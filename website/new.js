var coordinatesystem = 'euler';

var sysp = ['euler','sphere'];

var oldgamma = 1;

var fontcolorcompression = 10;

var degtorad = Math.PI / 180;

var offset = 1;

var r,g,b;

//In px!
var fontSize = 25;

var rotation = 0;

var enableRot = false;

var settingsMode = true;

var enableLog = false;

var AngleSnap = 5;

var log;

//EventListener hinzufügen
addEvent(document, 'readystatechange', function() {
	if(document.readyState === 'complete'){
        setup();
	}});

addEvent(window, 'resize', function() {
	if(!settingsMode) {
		centerHor(document.getElementById('content_text'));
	}});
	
addEvent(window, 'deviceorientation', function(event) {
	if(!settingsMode) {
		orientation(event.alpha, event.beta, event.gamma);
	}});
	
//Initalisieren der Seite und bestimmter Objekte
function setup() {
	log = new Log();
	console.log('Setup');
	log.addToLog('Setup');
	var toSettings = document.createElement('div');
	toSettings.id = "toset";
	toSettings.style.width = 75;
	toSettings.style.height = 75;
	toSettings.style.backgroundColor = 'gray';
	toSettings.style.position = 'fixed';
	toSettings.style.top = 0;
	toSettings.style.right = 0;
	document.getElementsByTagName('body')[0].appendChild(toSettings);
	addEvent(toSettings, 'click', settings);
	
	settings();
}

function orientation(alpha, beta, gamma) {
	rawalpha = Math.floor(alpha);
	rawbeta = Math.floor(beta);
	rawgamma = Math.floor(gamma);

    //Wechsel der Orientierung über Gamma 
    if(Math.abs(oldgamma) > 45){    
        if((oldgamma * Math.floor(rawgamma)) < 0){
            if(offset < 0) {
                offset = 1;
            } else {
                offset = -1;
            }
        }
    }    
    oldgamma = rawgamma;  
    log.addToLog('Input done');
	
	process();
}

function process() {
    
    var sphcoords = sphericalCoordinates(rawalpha,rawbeta, rawgamma);
    var euler = eulerCoordinates(rawalpha, rawbeta, rawgamma, offset);      
    log.addToLog('Computation done');
	  
    switch(coordinatesystem) {
        case 'euler':
            r = Math.floor((euler[0] * 255)/180);
            g = Math.floor((euler[1] * 255)/180);
            b = Math.floor((euler[2] * 255)/180);

            break;
        case 'sphere':
            r = Math.abs(Math.floor(255 * Math.sin(sphcoords[1] * degtorad) * Math.cos(sphcoords[0] * degtorad)));
            g = Math.abs(Math.floor(255 * Math.sin(sphcoords[1] * degtorad) * Math.sin(sphcoords[0] * degtorad)));
            b = Math.abs(Math.floor(255 * Math.cos(sphcoords[1] * degtorad)));
        default:
            break;
    }    
    setRGB(r,g,b);
	if(enableRot) {
		if(offset > 0) {
			rotate(-rawgamma);
		} else {
			if(rawgamma > 0) {
				rotate(-rawgamma + 90);
			} else {
				rotate(-rawgamma - 90);
			}
		}
	}
    log.addToLog('Color set');
 
	/*
    addText('Alpha', euler[0]);
	addText('Beta', euler[1]);
	addText('Gamma', euler[2]);
    addText('Theta', sphcoords[0]);
	addText('Phi', sphcoords[1]);*/
    log.addToLog('Prints done');
	
	if(enableLog) {
		log.printLog();
	}
	
}

//Ausgaben

function setRGB(red, green, blue) {

    var hexBackground = RgbToHex(red,green,blue);
	var hexFont = RgbToHex(colorcompression(255-red), colorcompression(255-green),colorcompression(255-blue));
    
	document.getElementById('red').innerHTML = 'Rot: ' + red;
	
	document.getElementById('green').innerHTML = unescape('Gr%FCn: ') + green;
	
	document.getElementById('blue').innerHTML = 'Blau: ' + blue;
	
	
    document.getElementById('hex').innerHTML = 'Background color: ' + hexBackground + '<br />' + 'Font color: ' + hexFont;

	document.body.style.backgroundColor = hexBackground;
	document.body.style.color = hexFont;
	centerHor(document.getElementById('content_text'));
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
	/*var h =  (ele.parentElement.clientHeight - ele.clientHeight)/2;
	log.addToLog('recalculating text position: element height ' + ele.clientHeight + '|  parent height ' + ele.parentElement.clientHeight + '|  height top offset ' + h);
	ele.style.top = h;*/
	
	ele.style.height = 'auto';
	var h = ele.clientHeight;
	log.addToLog('Height: ' + h);
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

//Konzentriert die Farbe an ein Ende (entweder Richtung 0 oder 255)
function colorcompression(color) {
    if(color < 128) {
        return Math.floor(color / fontcolorcompression);
    } else {
        return 255 - (colorcompression(255-color));
    }
}

//Einstellungen
function settings() {
	settingsMode = true;
	document.getElementById('content').style.display = 'None';
	document.getElementById('logdiv').style.display = 'None';
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
	
	
	//Checkboxen
	var cbdiv = document.createElement('div');
	cbdiv.id = 'cbdiv';
	
	/*
	var rotp = document.createElement('p');
	rotp.id = 'rotp';
	var rotcb = document.createElement('input');
	rotcb.type = 'checkbox';
	rotcb.id = 'rotcb';
	rotcb.checked = enableRot;
	rotcb.onchange = function() {
		enableRot = rotcb.checked;
		log.addToLog('rotation: ' + enableRot);
	}
	rotp.innerHTML = 'Enable text rotation with sensors: ';
	rotp.appendChild(rotcb);
	cbdiv.appendChild(rotp);
	*/
	
	var logp = document.createElement('p');
	logp.id = 'logp';
	var logcb = document.createElement('input');
	logcb.type = 'checkbox';
	logcb.id = 'logcb';
	logcb.checked = enableLog;
	logcb.onchange = function() {
		enableLog = logcb.checked
		log.addToLog('log on page: ' + enableLog);
		if(logcb.checked) {
            document.getElementById('logdiv').style.display = 'block';
        }
	}
	logp.innerHTML = 'Enable log output on screen: ';
	logp.appendChild(logcb);
	cbdiv.appendChild(logp);
	//appendNewLine(cbdiv);
	
	setdiv.appendChild(cbdiv);
	
	//Selection list für Darstellungsweise. Einstellung wird erst beim Bestätigen übernommen.
    var seldiv = document.createElement('div');
    seldiv.id = 'seldiv';
    
    var selp = document.createElement('p');
    selp.id = 'selp';
    selp.innerHTML = 'Used transformation: ';
    var selli = document.createElement('select')
    selli.id = 'selli'
    selli.style.fontSize = fontSize + 'px';
    
    for(var i = 0; i < sysp.length; i++) {
        var op = document.createElement('option');
        op.className = 'option';
        op.innerHTML = sysp[i];
        selli.appendChild(op);
    }
    selp.appendChild(selli);
    seldiv.appendChild(selp);
    appendNewLine(seldiv);
    
    setdiv.appendChild(seldiv);
	
	
	//Einstellungen bestätigen und verlassen
	var confirmdiv = document.createElement('div');
    confirmdiv.id = 'confirmdiv';
	var buttonConfirm = document.createElement('input');
	buttonConfirm.id = 'confirm';
	buttonConfirm.type = 'button';
	buttonConfirm.value = 'confirm';
	buttonConfirm.style.fontSize = fontSize + 'px';
	buttonConfirm.onclick = function() {
		coordinatesystem = sysp[selli.selectedIndex];
        log.addToLog('Using ' + coordinatesystem + ' to process'); 
		document.getElementById('content').style.display = 'block';
		settingsMode = false;
		body.removeChild(setdiv);
		document.getElementById('toset').style.display = 'block';
	}
	confirmdiv.appendChild(buttonConfirm);
	setdiv.appendChild(confirmdiv);
	
	body.appendChild(setdiv);
}

function appendNewLine(parentElement){
	var nl = document.createElement('br');
	parentElement.appendChild(nl);
}

//Drehen
var dragging = false;
var mouseStartX, mouseStartY;
//addEvent(window, "mousedown", function(event) {dragStart(event.clientX, event.clientY)});
addEvent(window, "mousedown", dragStartM);
addEvent(window, "touchstart", dragStartT);
addEvent(window, "mouseup", dragStopM);
addEvent(window, "touchend", dragStopT);