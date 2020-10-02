module.exports = function(H1,H2) {
    const difference = Math.abs(H1 - H2);
    if(difference <= 128) return difference;
    else return Math.abs(difference - 255);
}