//Darstellung über Canvas Element. Text ist hier verzerrt bei der Rotation.
function canvas() {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    //context.setTransform(1,0,0,1,0,0)
    context.fillStyle = hexBackground;
    context.fillRect(0,0,canvas.width, canvas.height);
    context.translate(canvas.width/2, canvas.height/2);
    context.rotate(rotation-old_rotation);
    context.translate(-canvas.width/2, -canvas.height/2);
    document.body.style.backgroundColor = hexBackground;
    context.fillStyle= hexFont;
    context.font = 'normal normal normal ' + fontSize + 'px sans-serif';
    context.textAlign = 'center';
    var text1 = 'Background color: ' + hexBackground;
    var text2 = 'Font color: ' + hexFont;
    var textwidth = context.measureText(text1).width;
    context.fillText(text1, canvas.width/2,(canvas.height/2)-((2*fontSize)/3));
    context.fillText(text2, canvas.width/2,(canvas.height/2)+((2*fontSize)/3));
    context.fillText(rawalpha, canvas.width/2,(canvas.height/2)+((4*fontSize)/3)+fontSize);
}

//Event zu einem Element hinzufügen
function addEvent(object, type, callback) {
	if(object == null|| object == undefined) {
		return;
	}
	if (object.addEventListener) {
        object.addEventListener(type, callback, false);
    }
}

function dragStartT(event) {
	mouseStartX = event.touches[0].clientX //xCoord;
	mouseStartY = event.touches[0].clientY //yCoord;
	addEvent(window, "touchmove", rotateDragT);
	//addText('drag', 'drag started T');
}

function dragStartM(event) {
	mouseStartX = event.clientX //xCoord;
	mouseStartY = event.clientY //yCoord;
	addEvent(window, "mousemove", rotateDragM);
	//addText('drag', 'drag started M');
}

function dragStopT() {
	window.removeEventListener("touchmove", rotateDragT);
	angle = rot;
	//addText('drag', 'drag stopped T');
}

function dragStopM() {
	window.removeEventListener("mousemove", rotateDragM);
	angle = rot;
	//addText('drag', 'drag stopped M');
}

function rotateDragT(event) {
	var x = mouseStartX - event.touches[0].clientX //xCoord;
	var y = mouseStartY - event.touches[0].clientY //yCoord;
	rotateDrag(x/4,y);
}
function rotateDragM(event) {
	var x = mouseStartX - event.clientX //xCoord;
	var y = mouseStartY - event.clientY //yCoord;
	rotateDrag(x,y)
}

function rotateDrag(x, y) {
	//addText('drag', 'dragging');
	/*var mag = Math.sqrt(x*x + y*y);
	if(x > 0) {
		mag *= -1;
	}*/
	var mag = -x/2;
	
	rotate(mag);
	//addText('rotation', mag);
}


//Text rotieren
var angle = 0;
var rot = 0;
function rotate(degree) {	
	if(!settingsMode){
		var ele = document.getElementById('content_text');
	/*var old_rotation = rotation;
	//if(gamma <= 90) {
		rotation = (((-rawgamma) * offset) );//- old_rotation);
	//}
	//rotation = rawalpha;
	var rot = (Math.round(rotation/AngleSnap))* AngleSnap;*/
		rot = angleCorrection(angle + (Math.round(degree/AngleSnap))* AngleSnap);
	//addText('Rotation angle', rot);
		ele.style.transform = 'rotate(' + rot + 'deg)';
	}
}

//Winkel auf [0,360) beschränken
function angleCorrection(angle) {
    return angle - Math.floor(angle/360) * 360;
}