module.exports = class Answer {
    constructor(answer, action){
        this.answer = answer;
        this.action = action
    }

    // methods
    // ==========================================================================

    // returns the user input for this prompt
    getAnswer() {
        return this.answer;
    }

    // returns the name of the next prompt to add to the queue
    getAction() {
        return this.action;
    }

}