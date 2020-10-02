module.exports = function(H1,H2) {
    const difference = Math.abs(H1 - H2);
    if(difference <= 127.5) return Math.round(difference*1000)/1000;
    else return Math.round(Math.abs(difference - 255)*1000)/1000;
}