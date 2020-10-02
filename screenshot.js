const inquirer = require('inquirer');
const screenshot = require('./cli/screenshot');
const takeScreenShotQuestion = {
    type:'confirm',
    askAnswered:true,
    name:'screenshot',
    message:'take a screenshot'
}

async function main() {
inquirer.prompt(takeScreenShotQuestion)
.then(async answers => {
    if(answers.screenshot){
        await screenshot();
        main();
    } else {
        process.exit();
    }
    
})
}

main()
