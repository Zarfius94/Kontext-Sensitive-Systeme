function eulerCoordinates(rawalpha, rawbeta, rawgamma, offset) {
    var alpha, beta, gamma;
    
    //gamma ist in [-90,90)    
    gamma = 0;
    if(offset < 0) {
        gamma = 180 - (Math.abs(rawgamma));
    } else {
        gamma = Math.abs(rawgamma);
    }    
    
    //alpha ist in [0,360)
    alpha = Math.abs(rawalpha);
    if(offset < 0) {
        //es scheint das sich der Wert um 180° verschiebt, wenn der Screen nach unten zeigt.
        alpha = (alpha + 180) % 360
    }
    alpha = Math.abs(alpha - 180);
	
    //beta ist in [-180,180)
    beta = rawbeta;
    if(offset < 0) {
        beta = 180 - rawbeta;
    }
    
    if(beta >= 180) {
        beta -= 360;
    }
    beta = Math.abs(beta);
    
    return [alpha, beta, gamma];
}