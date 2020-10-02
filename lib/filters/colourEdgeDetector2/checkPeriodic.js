module.exports = function ( index, min, max){
    if(index < min)      return Math.abs(index) - 1;
    else if(index > max) return max - (Math.abs(index - max) - 1);
    return index 
}