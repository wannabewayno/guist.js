module.exports = class Queue {
    constructor(...initialPrompts){
        this.queue = initialPrompts;
        this.queuePosition = 0;
    }

    // methods
    // =================================

    //Loads the next prompt in the queue to the UI 
    next(){
        this.queuePosition++;
        return this.queue[this.queuePosition-1];
    };

    add(){}

    current(){}

    clear(){}
}