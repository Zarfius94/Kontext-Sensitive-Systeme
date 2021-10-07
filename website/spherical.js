function sphericalCoordinates(rawalpha, rawbeta, rawgamma) {
	var theta, phi;
    
	/*
    theta = angleCorrection(rawalpha + rawgamma);
    phi = angleCorrection(rawbeta - 90);*/
    
    theta = rawalpha + rawgamma;
    phi = (rawbeta - 90);
    
    if(phi >= 90) {
        phi -= 180;
    } else if (phi < -90) {
        phi += 180;
    }
	
	theta = angleCorrection(theta);
    return [theta, phi];
}