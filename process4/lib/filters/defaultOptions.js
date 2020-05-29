const defaultValues = {
    H:{
        upper: 360,
        channelIndex:0
    },
    S:{
        upper: 100,
        channelIndex:1
    },
    L:{
        upper: 100,
        channelIndex:2
    },
    R:{
        upper: 255,
        channelIndex:0
    },
    G:{
        upper: 255,
        channelIndex:1
    },
    B:{
        upper: 255,
        channelIndex:2
    },
    A:{
        upper: 100,
        channelIndex:3
    },
    GREY:{
        upper:255
    }
} 

const defaultOptions = ( options ) => {

    options.conditions.forEach(condition => {
        const { name } = condition
        if(!condition.upper) {
            condition.upper = defaultValues[name].upper; 
        }

        if(!condition.lower) {
            condition.lower = 0
        }
        
        //tells the filter function what channel the name refers to i.e 'G' in [R,G,B] is index 1 (2nd Channel)
        condition.channelIndex = defaultValues[name].channelIndex;
    });

    if (!options.replacement) {
        options.repacement = [0,0,0];
    }

    if (!options.method) {
        options.method = 'ifAny'
    }

    return options;
}

module.exports = defaultOptions;