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
        upper:255;
    }
} 

const defaultOptions = options => {
    options.forEach(option => {
        const { name } = option
        if(!option.condition.upper){
            option.condition.upper = defaultValues[name].upper; 
        }

        if(!option.condition.lower){
            option.condition.lower = 0
        }

        if(!option.replacement){
            option.repacement = [0,0,0];
        }

        if(!option.method){
            option.method = 'ifAny'
        }

        //tells the filter function what channel the name refers to i.e 'G' in [R,G,B] is index 1 (2nd Channel)
        option.channelIndex = defaultValues[name].channelIndex;
    });
    
    return options;
}

module.exports = defaultOptions;