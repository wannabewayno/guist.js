const crawler = () =>{



};

const average = image => {
    const sum = image.data.reduce((a,b) => a + b, 0);
    const average = sum/image.data.length;
    return average;
}
const threshold = (image,threshold) => {
    const width = image.width;
    const height = image.height;
    
    threshedData = image.data.map(pixel => {
      if(pixel < threshold){
          return 0;
      } else {
          return pixel;
      }
    });
    const newData = [];
    threshedData.forEach(pixel => {
        newData.push(pixel,pixel,pixel,255);
    });
    newImage = new Image(width,height,newData)
    return newImage;
}

gamerTag2 = ['killahhh.-Â\00BB',`seb008-seacow`,`[[Reaper]]`,`Poo|ToeKnee`,`Invictus`,`davemck89`,`|.:|Zio Matrix`,`darkraider`,`Icefyre`,`>TG<BloodSplat`,`xTwilightDawnx`,`da_moletrix`];
gamerTag1 = ['Dani3l<3','BlackWolf','HOCANINOGLU','maskinen',"i'fucku",'ZeusVanZall~///','JA','erik1953','dor dani','Get On My LvL','Jake132Hun','Esji'];

module.exports = crawler;
module.exports = average;
module.exports = threshold;
module.exports = gamerTag1;
module.exports = gamerTag2;