var oldgamma = 1;
var offset = 1;

window.ondeviceorientation = function(event) { 
	ralpharaw = event.alpha;
	rbetaraw = event.beta;
	rgammaraw = event.gamma;


    //gamma ist in [-90,90)    
    //Wechsel der Orientierung über Gamma 
    if(Math.abs(oldgamma) > 45){    
        if((oldgamma * Math.floor(rgammaraw)) < 0){
            if(offset < 0) {
                offset = 1;
            } else {
                offset = -1;
            }
        }
    }
    oldgamma = Math.floor(rgammaraw);
    rgamma = 0;
    if(offset < 0) {
        rgamma = 180 - (Math.abs(rgammaraw));
    } else {
        rgamma = Math.abs(rgammaraw);
    }
	var b = Math.floor((rgamma * 255)/180);
    
    //alpha ist in [0,360)
    ralpha = Math.abs(ralpharaw);
    if(offset < 0) {
        //es scheint das sich der Wert um 180° verschiebt, wenn der Screen nach unten zeigt.
        ralpha = (ralpha + 180) % 360
    }
    ralpha = Math.abs(ralpha - 180);
	var r = Math.floor((ralpha * 255)/180);
	
    //beta ist in [-180,180)
    rbeta = Math.abs(rbetaraw)
	if(offset < 0) {
		// es scheint dass sich der Wert zu 180 ergänzt, wenn der Screen nach unten zeigt.
		rbeta = (180 - rbeta) % 360;
	}
    var g = Math.floor((rbeta * 255)/180);
	
    
    var hexBackground = RgbToHex(r,g,b);
	var hexFont = RgbToHex((255-r), (255-g),(255-b));

	
	
	document.getElementById("alpha").innerHTML = 'Rot: ' + r + ' (' + Math.floor(ralpharaw) + ')';
	//document.getElementById("alpha").innerHTML = 'Alpha: ' + Math.floor(ralpharaw);
	document.getElementById("beta").innerHTML = 'Grün: ' + g + ' (' + Math.floor(rbetaraw) + ')';
	//document.getElementById("beta").innerHTML = 'Beta: ' + Math.floor(rbetaraw);
	document.getElementById("gamma").innerHTML = 'Blau: ' + b + ' (' + Math.floor(rgammaraw) + ')';
	//document.getElementById("gamma").innerHTML = 'Gamma: ' + Math.floor(rgammaraw) + ' (' + oldgamma + ')';
	
    document.getElementById("hex").innerHTML = 'Background color: ' + hexBackground + '<br />' + 'Font color: ' + hexFont;
	//document.getElementById("hex").innerHTML = hex + ' ('+ offset + ')';
    
    //document.getElementById("space1").innerHTML = 'Counter1: ' + counter1;
    //document.getElementById("space2").innerHTML = counter2;

	//document.body.style.backgroundColor = 'rgb(' + r + ',' + g + ',' + b + ')';
	//document.body.style.backgroundColor = '#00ff00';
	document.body.style.backgroundColor = hexBackground;
	document.body.style.color = hexFont;
}

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