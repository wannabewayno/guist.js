const imageFn = require('./filters.js');
const getFilterSequence = require('./filters')

//TODO change how this works to allow static inputs in the filters. 


Fn = {};
//TODO write a function that calcuates the total number of iterations
//todo have createProgressHash() call this after the inital progress hash is created


//TODO write a validate chunk argument that calculates the chunk size for the loop.

Fn.createProgressHash = filters => {
    const progressHash = filters.map(filter => {
        // create out progressHash object
        filterProgress = {};
        filterProgress.name = filter.name;
        filterProgress.reset = false;
        filterProgress.option = {};
        filterProgress.limits = {};
        // populating 'option' and 'limits' properties
        // Option: will be the options object passed to the filter during processing
        // limits will be a reference object used to update the options object every iteration.
        for (const functionOption in filter){
            if (functionOption !== 'name'){
                if (typeof(filter[functionOption]) === 'object'){
                    filterProgress.limits[functionOption] = filter[functionOption];
                    //TODO maybe set the intial lower limit here -= down a step size.
                    filterProgress.option[functionOption] = filter[functionOption].lower;
                } else {
                    filterProgress.option[functionOption] = filter[functionOption]
                }
            }
        }
        return filterProgress;
    });
    return progressHash;
};

/** makeOptions
 * makes options to be passed into process.
 * @param filters filters objectArray, defined by the user in main(imageName, filters, progressHash)
 * @param progress progress objectArray, was the last option processed by the previous recursive iteration, internally built by main();
 * @param i an iterator from a loop.
 */
Fn.updateProgress = progressHash => {
    const progressHashReversed = progressHash.reverse();
    progressHashReversed.forEach( (progress,index,progressHash) => {

        let reset;
        if ( index === 0){
            reset = true;
        } else {
            reset = progressHash[index-1].reset;
        }
        
        //If previous filter's cycle resets or this is the first filter in our sequence,
        // this filter will increase by it's nominated step.
        if ( reset ){

            // we go through all properties nominated in 'limits'
            for(const property in progress.limits){

                // we increase these properties by their nomianted steps
                progress.option[property] += (progress.limits[property].step);
                
                //if this is the first iteration from a cycle reset, set reset to false;
                if (progress.reset) {
                    progress.reset = false;
                }

                // we now check to make sure we didn't go over our upper limit
                if (progress.option[property] > progress.limits[property].upper){
                    // if so, reset this property to the lower limit
                    progress.option[property] = progress.limits[property].lower;
                    // set reset to true, so the next filter knows we have reset this one.
                    progress.reset = true;
                }

            }
        }
    });
    //un-reverse it to get the updated progress hash.
    const progressHashUpdate = progressHashReversed.reverse();
    //Send this back
    return progressHashUpdate;
}

//Extract desired filter names from an options object.
Fn.getFilterSequence = options => {
    const filterSequence = options.map(filter => filter.name);
    return filterSequence
}

/** process
 * Takes in an image, processes the image by applying various filters and thier options found in the options object.
 * @param image image to process passed from image.load(imagePath)
 * @param options object with filterName:{filterOptions}; e.g {thresholdRGB:{threshold:120}}; 
*/ 
Fn.process = (image,progressHash) => {
    const filterSequence = getFilterSequence(progressHash);
    filterSequence.forEach( (filter,index) => {
        image = imageFn[filter](image,progressHash[index].option)
    });
    //return our processed image
    return image
};



module.exports = Fn;