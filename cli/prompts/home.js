module.exports = {
    type:'list',
    askAnswered:true,
    name:'menu',
    message:'Welcome to Guist CLI',
    choices:[
        // displayed to the user                // dispatch actions
        { name:'Create a new Session',          value:'newSession'      },
        { name:'Continue a previous Session',   value:'continueSession' },
        { name:'Exit',                          value:'exit'            }
    ],
}