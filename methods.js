module.exports = methods = {};

methods.gamerTag = {
    left: 218,
    top: 171,
    width: 300,
    height: 24
}
methods.score = {
    left: 598,
    top: 171,
    width: 300,
    height: 24
}
methods.gap =5;

methods.Region = class Region {
    constructor(object){
        this.left = object.left;
        this.top = object.top;
        this.width = object.width;
        this.height = object.height;
    }
}
methods.CropBox = class CropBox {
    constructor(template){
        this.x = template.left;
        this.y = template.top;
        this.width = template.width;
        this.height = template.height;
    }
}

methods.CreateBoxes = numberOfBoxes => {
    boxesArray = [];
    for (let i = 0; i < numberOfBoxes; i++) {
        box = new Region(gamerTag);
        box.top += (box.height+gap)*i;
        boxesArray.push(box);
    }
    return boxesArray;
}

methods.createCropBoxes = (numberOfBoxes,template,splitTeams) => {
    boxesArray = [];
    for (let i = 0; i < numberOfBoxes; i++) {
        box = new methods.CropBox(template);
        if(i >= numberOfBoxes/2 && splitTeams){
            box.y += (box.height+methods.gap)*i+62;
        } else {
            box.y += (box.height+methods.gap)*i;
        }
        console.log(box);
        boxesArray.push(box);
    }
    return boxesArray;
}

//define all the crop boxes, the image to crop and the threshold for each image.
methods.crop = (cropBoxes,image,threshold) => {
    return new Promise((resolve, reject)=>{
        resolve({cropBoxes:cropBoxes,image:image,threshold:threshold})
        reject(new Error("LOL NEW ERROR"))
    }).then(params=>{
        let count = 0;
        preppedImages = [];
        params.cropBoxes.forEach(box => {
            count++;
            const cropped = params.image.crop(box);
            cropped.data.forEach((pixel,index) => {
                if(pixel < params.threshold){
                    cropped.data[index] = 0;
                }
            });
            let modify = cropped.grey();
            // modify = modify.dilate();
            // modify = modify.gaussianFilter({radius:1,sigma:0.4})
            // modify = modify.medianFilter();
           
            modify =  modify.mask({algorithm:'minimum',threshold:0.8,useAlpha:true,invert:true});
            
            // modify = modify.sobelFilter()
            // const blur = cropped.gaussianFilter({radius:2,sigma:0.2})
            // const grey = cropped.grey();
            // const topHat = grey.topHat({iterations:100});
            modify.save(`cropped${count}.png`)
        });
    });
}
//threshold value of 0.48 seems to be the winner at the moment.