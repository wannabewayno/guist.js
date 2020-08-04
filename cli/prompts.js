const Answer = require('./Answer');

module.exports = {
    home:{
        type:'list',
        askAnswered:true,
        name:'home',
        message:'Welcome to Guist CLI, What would you like to do?',
        choices:[
            { name:'Create a new Session', value:'newSession' },
            { name:'Continue a previous Session', value:'continueSession' }
        ],
        filter(answer){
            return new Answer(answer,answer);
        }

    },
    addGame:{
        type:'confirm',
        askAnswered:true,
        name:'addGame',
        message:'ADD GAME TO SESSION?',
        filter(answer){
            return new Answer(answer, 'addGame')
        }
    }
    
}