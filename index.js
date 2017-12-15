const { run, generateWordsMap, formatMatrixIntoUI } = require('./core');

const MATRIX_LENGTH = 12;

const words = require('./words.json');
const wordsList = words.data;

const wordsMap = generateWordsMap(wordsList, MATRIX_LENGTH);

run(wordsList, wordsMap, MATRIX_LENGTH, (matrix, wordsSet) => {
  formatMatrixIntoUI(matrix);
  console.log(wordsSet);
});