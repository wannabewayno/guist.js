const scaleHue = {

    scaleHueClockwise: ( hue, scaleFactor, upper, lower ) => {

        const difference0Upper = 0;

        if ( hue <= lower && hue >= 0 && upper > lower ) {
            //as we now cross the 0, add on the difference from upper to 0 degree segment,  
            difference0Upper = 360 - upper;
        }

        hue = upper + ( ( hue + difference0Upper ) - upper ) / scaleFactor;

        return hue;
    },


    scaleHueAntiClockwise: ( hue, scaleFactor, upper , lower ) => {

        const difference0Upper = 0;

        if ( hue <=360 && hue >= upper && upper > lower) {

            const difference0Upper = -360

        } 
            
        hue = lower - ( lower - ( hue + difference0Upper ) ) / scaleFactor;
        
        return hue;
    }

}

module.exports = scaleHue;