
const shiftPixel = variables => {

    const { hue, direction, shiftMagnitude } = variables;

    //* case 1
    if ( direction === 'clockwise' ) {

        hue -= shiftMagnitude;

    } else { //anti-clockwise

        hue += shiftMagnitude;

    }

    return hue
}