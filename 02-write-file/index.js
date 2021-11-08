const path = require('path');
const fs = require('fs');
const filePath = __dirname + '/text.txt';
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
let closeText;
const enterYouText = (promptText, isNew) => {
  let textStarting;
  (isNew) ? textStarting = '': textStarting = '\n';
  rl.question(promptText, userInput => {
    if (userInput === 'exit') {
      closeText = 'exit';
      rl.close();
    } else {
      fs.appendFile(filePath, textStarting + userInput, err => {
        if (err) throw err;
        enterYouText('' /* userInput + ' added!\nYou can enter your text again or type "exit" (press "ctrl + c") to quit:\n' */ );
      });
    }
  });
}
fs.writeFile(filePath, '', err => {
  if (err) throw err;
  process.stdout.write('File "text.txt" has been added!\n');
  enterYouText('Enter your text or type "exit" (press "ctrl + c") to quit:\n', 'new');
});
rl.on('close', () => {
  if (closeText) process.stdout.write('You typed "exit". Goodbye!\n');
  else process.stdout.write('You pressed "ctrl + c". Goodbye!\n');
});