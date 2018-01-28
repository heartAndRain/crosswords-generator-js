const { run, generateWordsMap, formatMatrixIntoUI } = require('./core');

const MATRIX_LENGTH = 10;

// const words = require('./words.json');
// const wordsList = words.data;

const wordsList = {
  'husband': 'n. the man that a woman is married to; a married man',
  'steak': 'n. a large flat piece of beef without much fat on it',
  'mince': 'n. meat which has been cut into very small pieces using a machine',
  'chicken': 'n. a large bird that is often kept for its eggs or meat',
  'tell': ' v. of a person to give information to somebody by speaking or writing',
  'truth': 'n. the true facts about something, not the things that have been invented or guessed',
  'butcher': 'n. a person whose job is cutting up and selling meat in a shop/store',
  'meat': 'n. the flesh of an animal or a bird eaten as food',
  'beef': 'n. meat that comes from a cow',
  'sometimes': 'adv. occasionally rather than all of the time',
  'either': '也（用于否定句）',
  'tomato': '西红柿，一种蔬菜',
  'potato': '土豆 ，一种蔬菜',
  'cabbage': '卷心菜，一种蔬菜',
  'lettuce': '莴苣，一种蔬菜',
  'pea': '豌豆，一种豆类',
  'bean': '豆角，一种豆类',
  'pear': '梨，一种水果',
  'grape': '葡萄，一种水果',
  'peach': '桃，一种水果'
}

const wordsMap = generateWordsMap(Object.keys(wordsList), MATRIX_LENGTH);


function formatMatrixIntoJSON(matrix, name) {
  const arr = [];
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[0].length; x++) {
      const item = matrix[y][x];
      if (item.isUsed) {
        arr.push({
          x,
          y,
          value: item.value,
          words: item.words,
          wordsDirection: item.wordsDirection,
          description: item.words.map(word => wordsList[word])
        });
      }
    }
  }
  const json = { data: arr };
  const fs = require('fs');
  fs.writeFileSync(name, JSON.stringify(json, null, 2), 'utf8', err => {
    if (err) throw err;
    console.log('generate success');
  });
}

run(wordsList, wordsMap, MATRIX_LENGTH, (matrix, wordsSet) => {
  formatMatrixIntoUI(matrix);
  console.log(wordsSet);
  // formatMatrixIntoJSON(matrix, 'resulte.json');
});