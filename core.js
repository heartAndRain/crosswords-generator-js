

function generateWordsMap(wordsList, maxWordLength) {

  // Map: 'word' => lib
  const map = new Map();

  wordsList.forEach(originWord => {

    if (originWord.length > maxWordLength || /[-_\\\.]/.test(originWord)) return;

    const splitedWords = originWord.replace(/\s+/g, '').split('');


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
    if (word.length < cpLib[pointer].length) {
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

function getCell() {

  return {
    isUsed: false,
    value: '',
    words: [],
    wordsDirection: [],
  }
}

function getCellByPosition(matrix, position) {

  if (!matrix.length) return null;

  const { x, y } = position;

  if (y < matrix.length && x < matrix[0].length) {
    return matrix[y][x];
  } else {
    return null;
  }
}


function generateMatrix(width, height) {
  const matrix = [];
  
  for (let y = 0; y < height; y++) {
    matrix[y] = [];
    for (let x = 0; x < width; x++) {
      matrix[y][x] = getCell();
    }
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

  const rowAvailableLength = (rowLength - wordLength) + 1;
  const colAvailableLength = (colLength - wordLength) + 1;

  const rowAvailableArea = { width: rowAvailableLength, height: colLength };
  const colAvailableArea = { width: rowLength, height: colAvailableLength };
  const commonAvailableArea = { width: rowAvailableLength, height: colAvailableLength };

  const getPositions = generatePositionsByWidthAndHeight({x: 0, y: 0}, matrix);

  const commonAvailablePositions = getPositions(commonAvailableArea.width, commonAvailableArea.height)
  .map(({x, y}) => ({x, y, availableX: true, availableY: true }));
  
  const commonAvailablePositionsSet = new Set(commonAvailablePositions.map(p => `${p.x}${p.y}`));

  const rowAvailablePositions = getPositions(rowAvailableArea.width, rowAvailableArea.height)
  .filter(p => !commonAvailablePositionsSet.has(`${p.x}${p.y}`))
  .map(({x, y}) => ({x, y, availableX: true, availableY: false }));
  
  const colAvailablePositions = getPositions(colAvailableArea.width, colAvailableArea.height)
  .filter(p => !commonAvailablePositionsSet.has(`${p.x}${p.y}`))
  .map(({x, y}) => ({x, y, availableX: false, availableY: true }));

  

  const availablePositions = commonAvailablePositions.concat(rowAvailablePositions, colAvailablePositions);

 // console.log(availablePositions)
  return availablePositions;
}

function getAvailableStartPositionByDistance(matrix, position, distance, wordLength) {
  const { x, y } = position;
  
  const maxX = matrix[0].length;
  const maxY = matrix.length;

  const isXOverflow = x - distance < 0 || ((x - distance) + wordLength - 1) >= maxX;
  const isYOverflow = y - distance < 0 || ((y - distance) + wordLength - 1) >= maxY;
  
  const positions = [];

  // row
  if (!isXOverflow) {

    const newX = x - distance;
    const newY = y;

    const existed = positions.find(({x, y}) => x === newX && y === newY);

    if (existed) {
      existed.availableX = true;
    } else {
      positions.push({x: newX, y: newY, availableX: true, availableY: false });
    }

    
  }
  // col
  if (!isYOverflow) {

    const newX = x;
    const newY = y - distance;

    const existed = positions.find(({x, y}) => x === newX && y === newY);

    if (existed) {
      existed.availableY = true;
    } else {
      positions.push({x: newX, y: newY, availableX: false, availableY: true });
    }


  }
  
  return positions;
}

function deepClone(object) {
  try {
    return JSON.parse(JSON.stringify(object));
  } catch(e) {
    console.error(e)
  }
}

function indexOfAll(array, searchElement) {
  const indexes = array.reduce((pre, cur, index) => {
    if (cur === searchElement) {
      pre.push(index);
    }
    return pre;
  }, []);
  if (indexes.length) {
    return indexes;
  } else {
    return -1;
  }
}

function getRandomELement(list) {
  if (!list.length) return;

  return list[Math.floor(Math.random() * list.length)];
}

function getLastElement(list) {
  if (!list.length) return;

  return list.concat().pop();
}


function fillFromStartPosition(matrix, wordsMap, startPosition) {

  let position = startPosition;
  let cell = getCellByPosition(matrix, position);
  const startWords = getLastElement(cell.words);
  const direction = getLastElement(cell.wordsDirection);

  let newMatrix = deepClone(matrix);

  console.log(startWords)

  const usedWordsSet = new Set();

  while(cell && getLastElement(cell.words) === startWords) {
    const { x, y } = position;
    const { value: commonWord } = cell;

    
    // console.log(commonWord)

    const lib = wordsMap.get(commonWord);
    
    if (!lib) throw new Error(`There is no lib for word "${word}"`);

    

    for (let libWords of lib) {

      let isFillSuccess = false;

      if (libWords !== startWords && !usedWordsSet.has(libWords)) {

        // the words may be "TAA", thus the indexes of "A" is [1,2]
        const indexes = indexOfAll(libWords.split(''), commonWord);
        if (!indexes) throw new Error(`"${commonWord}" is not in "${libWords}"`);

        for (let index of indexes) {
          const distance = index;
          const availablePositions = getAvailableStartPositionByDistance(matrix, position, distance, libWords.length);

          for(let startPosition of availablePositions) {

            const filledMatrix = fillMatrix(newMatrix, startPosition, libWords);

            if (filledMatrix) {
              isFillSuccess = true;
              newMatrix = filledMatrix;
              usedWordsSet.add(libWords);
              break;
            }
            
          }

          if (isFillSuccess) {
            break;
          }

        }
      }
      if (isFillSuccess) {
        break;
      }
    }



    // next words
    if (direction === 'row') {
      position = { x: x + 1, y };
    } else if (direction === 'col') {
      position = { x, y: y + 1 };
    } else {
      throw new Error('invalid cell direction');
    }

    cell = getCellByPosition(matrix, position);
  }


  return newMatrix;

}

function fillMatrix(matrix, startPosition, words) {
  const { x: startX, y: startY, availableX, availableY } = startPosition;
  const maxX = matrix[0].length;
  const maxY = matrix.length;

  let rowFillSuccess = true;
  let colFillSuccess = true;

  const newMatrix = deepClone(matrix);

  // 先尝试横着填
  if (availableX) {

    // console.log(words.length > (maxX - startX));

    for(let x = startX, wIndex = 0; x < maxX && wIndex < words.length; x++, wIndex++ ) {
      
      const isFillSuccess = fillCell(newMatrix, {x, y: startY}, words[wIndex], words, 'row');
  
      if (!isFillSuccess) {
        rowFillSuccess = false;
        break;
      }
    }

    if (rowFillSuccess) {
      return newMatrix;
    }

  } else {
    rowFillSuccess = false;
  }
  

  // 竖着填
  if (availableY && !rowFillSuccess) {

    for(let y = startY, wIndex = 0; y < maxY && wIndex < words.length; y++, wIndex++ ) {
      
      const isFillSuccess = fillCell(newMatrix, {x: startX, y}, words[wIndex], words, 'col');
  
      if (!isFillSuccess) {
        colFillSuccess = false;
        break;
      }
    }

    if (colFillSuccess) {
      return newMatrix;
    }

  } else {
    colFillSuccess = false;
  }
  
  return rowFillSuccess || colFillSuccess;
}


function fillCell(matrix, position, word, words, direction) {
  const { x, y } = position;

  const cell = matrix[y][x];

  if (typeof cell.isUsed === "undefined") throw new Error('isUsed is not existed');


  if (cell.isUsed && cell.value !== word) return false;

  cell.value = word;
  cell.words.push(words);
  cell.isUsed = true;
  cell.wordsDirection.push(direction);

  return true;
}

function formatMatrixIntoUI(matrix) {
  let text = '';
  for (row of matrix) {
    let rowString = row.reduce((pre, cur) => `${pre}${cur.value === '' ? '+' : cur.value} `, '');
    text += (rowString + '\n');
  }

  console.log(text);
}

function init(matrix, wordsList, usedWordsStack) {

  const maxWordsLength = Math.min(matrix.length, matrix[0].length);

  const wordsMap = generateWordsMap(wordsList, maxWordsLength);
  const wordsMapKeys = Array.from(wordsMap.keys());

  // init start words
  const randomKey = getRandomELement(wordsMapKeys);
  const lib = wordsMap.get(randomKey);
  const randomWords = getRandomELement(lib);

  
  const wordLength = randomWords.length;
  
  const availablePositions = getAvailableStartPosition(matrix, wordLength);
  const startPosition = getRandomELement(availablePositions);



  const startMatrix = fillMatrix(matrix, startPosition, randomWords);

  if (!startMatrix) throw new Error('init failed');

  usedWordsStack.push(randomWords);

  return { startMatrix, wordsMap, startPosition };
}

function run() {

  const MATRIX_LENGTH = 12;

  const words = require('./words.json');
  const wordsList = words.data;

  const initMatrix = generateMatrix(MATRIX_LENGTH,MATRIX_LENGTH);

  const usedWordsStack = [];

  const { startMatrix, wordsMap, startPosition } = init(initMatrix, wordsList, usedWordsStack);


  while(usedWordsStack.length !== 0) {
    const usedWords = usedWordsStack.pop();

    const newMatrix = fillFromStartPosition(startMatrix, wordsMap, startPosition);
    formatMatrixIntoUI(newMatrix);
  }




  // console.log(JSON.stringify(startMatrix));
  // formatMatrixIntoUI(startMatrix);


  
  // console.log(randomKey, '\n', wordsMap);
  // console.log(startMatrix, usedWordsStack);
}

run();