const levels = {
    basic: { size: 8, words: 6 },
    moderate: { size: 12, words: 15 },
    advanced: { size: 16, words: 20 }
  };
  
  const wordBank = [
    'apple', 'banana', 'orange', 'grape', 'mango', 'peach', 'lemon', 'melon',
    'tiger', 'lion', 'zebra', 'panda', 'eagle', 'wolf', 'bear', 'horse',
    'river', 'ocean', 'forest', 'mountain', 'desert', 'valley', 'planet', 'galaxy',
    'school', 'garden', 'window', 'shadow', 'silver', 'circle', 'rocket', 'sunset',
    'thunder', 'rainbow', 'cloud', 'guitar', 'violin', 'drums', 'artist', 'poetry',
    'castle', 'bridge', 'puzzle', 'dragon', 'phoenix', 'unicorn', 'wizard', 'magic'
  ];
  
  let gridData = [];
  let selectedWords = [];
  let foundWords = new Set();
  let selectedCells = [];
  
  function startGame() {
    foundWords.clear();
    clearSelection();
  
    const level = document.getElementById('levelSelect').value;
    const { size, words } = levels[level];
  
    selectedWords = pickRandomWords(words).map(w => w.toUpperCase());
  
    gridData = generateEmptyGrid(size);
    selectedWords.forEach(word => placeWord(gridData, word));
  
    fillEmptySpaces(gridData);
    renderGrid(gridData);
    renderWordList(selectedWords);
  }
  
  function pickRandomWords(count) {
    const shuffled = wordBank.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
  
  function generateEmptyGrid(size) {
    return Array.from({ length: size }, () => Array(size).fill(''));
  }
  
  function placeWord(grid, word) {
    const directions = [
      [0, 1],  [1, 0],  [1, 1],  [-1, 1],  
      [0, -1], [-1, 0], [-1, -1], [1, -1]
    ];
    let placed = false;
    const size = grid.length;
  
    while (!placed) {
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);
  
      if (canPlaceWord(grid, word, row, col, dir[0], dir[1])) {
        for (let i = 0; i < word.length; i++) {
          grid[row + i * dir[0]][col + i * dir[1]] = word[i];
        }
        placed = true;
      }
    }
  }
  
  function canPlaceWord(grid, word, row, col, dRow, dCol) {
    for (let i = 0; i < word.length; i++) {
      const newRow = row + i * dRow;
      const newCol = col + i * dCol;
      if (newRow < 0 || newRow >= grid.length || newCol < 0 || newCol >= grid.length) {
        return false;
      }
      const currentCell = grid[newRow][newCol];
      if (currentCell !== '' && currentCell !== word[i]) {
        return false;
      }
    }
    return true;
  }
  
  function fillEmptySpaces(grid) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid.length; col++) {
        if (grid[row][col] === '') {
          grid[row][col] = letters[Math.floor(Math.random() * letters.length)];
        }
      }
    }
  }
  
  function renderGrid(grid) {
    const gridEl = document.getElementById('grid');
    gridEl.innerHTML = '';
    gridEl.style.gridTemplateColumns = `repeat(${grid.length}, 30px)`;
  
    grid.forEach((row, rowIndex) => {
      row.forEach((letter, colIndex) => {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.textContent = letter;
        cell.dataset.row = rowIndex;
        cell.dataset.col = colIndex;
  
        cell.addEventListener('click', () => handleCellClick(cell));
  
        gridEl.appendChild(cell);
      });
    });
  }
  
  function renderWordList(words) {
    const listEl = document.getElementById('wordList');
    listEl.innerHTML = '';
    words.forEach(word => {
      const li = document.createElement('li');
      li.textContent = word;
      li.id = `word-${word}`;
      listEl.appendChild(li);
    });
  }
  
  function handleCellClick(cell) {
    if (selectedCells.includes(cell)) return;
    cell.classList.add('selected');
    selectedCells.push(cell);
  
    checkSelection();
  }
  
  function clearSelection() {
    selectedCells.forEach(cell => cell.classList.remove('selected'));
    selectedCells = [];
  }
  
  function checkSelection() {
    const selectedWord = selectedCells.map(c => c.textContent).join('');
    const reversedWord = selectedWord.split('').reverse().join('');
  
    let found = false;
  
    if (selectedWords.includes(selectedWord) && !foundWords.has(selectedWord)) {
      markFound(selectedWord);
      found = true;
    } else if (selectedWords.includes(reversedWord) && !foundWords.has(reversedWord)) {
      markFound(reversedWord);
      found = true;
    }
  
    if (!found && selectedCells.length >= Math.max(...selectedWords.map(w => w.length))) {
      clearSelection();
    }
  }
  
  function markFound(word) {
    selectedCells.forEach(cell => {
      cell.classList.remove('selected');
      cell.classList.add('found');
    });
    foundWords.add(word);
    document.getElementById(`word-${word}`).style.textDecoration = "line-through";
    selectedCells = [];
  
    if (foundWords.size === selectedWords.length) {
      setTimeout(() => alert("🎉 You found all words!"), 100);
    }
  }
  