const prompts   = require('./prompts');
const Queue = require('./Queue');

const queue = new Queue(prompts.home);
console.log(queue);
console.log(prompts);


module.exports = {
    next() {
        return queue.next()
    }
}

