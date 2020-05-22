const { createWorker } = require('tesseract.js');

const worker = createWorker({
  logger: m => console.log(m), // Add logger here
});

(async () => {
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  const { data: { text } } = await worker.recognize('./images/image-processing.jpg');
  console.log(text);
  await worker.terminate();
})();