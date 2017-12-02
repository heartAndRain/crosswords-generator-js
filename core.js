const wordsList = ['BAA', 'SOLID', 'WIT', 'BUS', 'ALLOW', 'DOT'];


function generateWordsMap(wordsList) {

  // Map: 'word' => lib
  const map = new Map();

  wordsList.forEach(originWord => {
    const splitedWords = originWord.split('');

    splitedWords.forEach(splitWord => {
      
      const lib = map.get(splitWord);
      map.set(splitWord, insertIntoLib(originWord, lib));
      
    });

  });


  return map;
}

function insertIntoLib(word, lib) {

  const cpLib = lib ? lib.concat() : [];

  if (cpLib.filter(w => w === word).length) return cpLib;

  let pointer = 0;
  while(pointer < cpLib.length) {
    if (word.length > cpLib[pointer].length) {
      pointer++;
    } else {
      cpLib.splice(pointer, 0, word);
      break;
    }
  }

  if (pointer === cpLib.length) {
    cpLib.push(word);
  }

  return cpLib;

}


const wordsMap = generateWordsMap(wordsList);


const wordsMapKeys = wordsMap.keys();


const cube = {
  width: 5,
  height: 5
};



function generateMatrix(width, height, cell) {
  const matrix = [];
  for (let i = 0; i < height; i++) {
    const row = new Array();
    row.length = width;
    row.fill(cell);
    matrix.push(row);
  }
  return matrix;
}

function generateCellPosition(x,y) {
  return { x, y };
}

function generateCellStartPosition(x, y, rowOrCol) {
  if (rowOrCol !== 'row' || rowOrCol !== 'col') {
    throw new Error('invalid rowOrCol');
  }

  return Object.assign({}, generateCellPosition(x, y), rowOrCol);
}

function generatePositionsByWidthAndHeight(startPosition, matrix) {

  return function(width, height) {
    const { x: startX, y: startY } = startPosition;
    
    const realHeight = height <= matrix.length ? height : matrix.length;
    const realWidth = width <= matrix[0].length ? width : matrix[0].length;
  
    const stack = [];
      
    for (let y = startY; y < realHeight - startY; y++) {
      for (let x = startX; x < realWidth - startX; x++) {
        stack.push(generateCellPosition(x, y));
      }
    }
  
    return stack;
  }
}

function getAvailableStartPosition(matrix, wordLength) {

  const colLength = matrix.length;
  const rowLength = matrix[0].length;

  const rowAwailableLength = (rowLength - wordLength) + 1;
  const colAwailableLength = (colLength - wordLength) + 1;

  const rowAwailableArea = { width: rowAwailableLength, height: colLength };
  const colAwailableArea = { width: rowLength, height: colAwailableLength };
  const commonAwailableArea = { width: rowAwailableLength, height: colAwailableLength };

  const getPositions = generatePositionsByWidthAndHeight({x: 0, y: 0}, matrix);

  const rowAwailablePositions = getPositions(rowAwailableArea.width, rowAwailableArea.height);
  const colAwailablePositions = getPositions(colAwailableArea.width, colAwailableArea.height);
  const commonAwailablePositionsSet = new Set(getPositions(commonAwailableArea.width, colAwailableArea.height).map(p => `${p.x}${p.y}`));

  const awailablePositions = rowAwailablePositions.concat(colAwailablePositions.filter(p => !commonAwailablePositionsSet.has(`${p.x}${p.y}`)));

  console.log(awailablePositions)
  return awailablePositions;
}

const matrix = generateMatrix(5,5,{ isUsed: false, value: '' });


getAvailableStartPosition(matrix, 3)




