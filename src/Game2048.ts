/**
 * 2048游戏核心逻辑类
 */
class Game2048 {
  private grid: number[][];
  private score: number;
  private bestScore: number;
  private gameOver: boolean;
  private win: boolean;

  constructor() {
    this.grid = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    this.score = 0;
    this.bestScore = parseInt(localStorage.getItem('bestScore') || '0', 10);
    this.gameOver = false;
    this.win = false;
    
    this.initializeGame();
  }

  /**
   * 初始化游戏
   */
  public initializeGame(): void {
    this.grid = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    this.score = 0;
    this.gameOver = false;
    this.win = false;
    
    // 添加两个初始数字
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * 获取当前网格状态
   */
  public getGrid(): number[][] {
    return this.grid;
  }

  /**
   * 获取当前分数
   */
  public getScore(): number {
    return this.score;
  }

  /**
   * 获取最高分数
   */
  public getBestScore(): number {
    return this.bestScore;
  }

  /**
   * 检查游戏是否结束
   */
  public isGameOver(): boolean {
    return this.gameOver;
  }

  /**
   * 检查是否获胜
   */
  public hasWon(): boolean {
    return this.win;
  }

  /**
   * 在随机位置添加一个新的数字块(2或4)
   */
  private addRandomTile(): void {
    const emptyCells: [number, number][] = [];
    
    // 找到所有空单元格
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.grid[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }
    
    // 如果没有空单元格，直接返回
    if (emptyCells.length === 0) return;
    
    // 随机选择一个空单元格
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const [row, col] = randomCell;
    
    // 90%概率生成2，10%概率生成4
    this.grid[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  /**
   * 移动网格中的所有数字块
   * @param direction 移动方向: 'up', 'down', 'left', 'right'
   * @returns 是否成功移动
   */
  public move(direction: 'up' | 'down' | 'left' | 'right'): boolean {
    if (this.gameOver) return false;
    
    // 保存移动前的状态
    const originalGrid = this.grid.map(row => [...row]);
    let moved = false;
    
    // 根据方向执行移动
    switch (direction) {
      case 'up':
        moved = this.moveUp();
        break;
      case 'down':
        moved = this.moveDown();
        break;
      case 'left':
        moved = this.moveLeft();
        break;
      case 'right':
        moved = this.moveRight();
        break;
    }
    
    // 如果网格发生了变化
    if (moved) {
      // 添加新数字块
      this.addRandomTile();
      
      // 检查游戏状态
      this.checkGameStatus();
      
      // 更新最高分
      if (this.score > this.bestScore) {
        this.bestScore = this.score;
        localStorage.setItem('bestScore', this.bestScore.toString());
      }
    }
    
    return moved;
  }

  /**
   * 向左移动
   */
  private moveLeft(): boolean {
    let moved = false;
    
    for (let row = 0; row < 4; row++) {
      // 获取当前行非零数字
      const rowTiles = this.grid[row].filter(val => val !== 0);
      
      // 合并相邻相同数字
      const mergedRow: number[] = [];
      let i = 0;
      
      while (i < rowTiles.length) {
        if (i < rowTiles.length - 1 && rowTiles[i] === rowTiles[i + 1]) {
          // 合并相同数字
          const mergedValue = rowTiles[i] * 2;
          mergedRow.push(mergedValue);
          this.score += mergedValue;
          
          // 检查是否达到2048
          if (mergedValue === 2048) {
            this.win = true;
          }
          
          i += 2; // 跳过下一个数字
        } else {
          mergedRow.push(rowTiles[i]);
          i++;
        }
      }
      
      // 用0填充剩余位置
      while (mergedRow.length < 4) {
        mergedRow.push(0);
      }
      
      // 检查是否有变化
      for (let col = 0; col < 4; col++) {
        if (this.grid[row][col] !== mergedRow[col]) {
          moved = true;
        }
        this.grid[row][col] = mergedRow[col];
      }
    }
    
    return moved;
  }

  /**
   * 向右移动
   */
  private moveRight(): boolean {
    let moved = false;
    
    for (let row = 0; row < 4; row++) {
      // 获取当前行非零数字
      const rowTiles = this.grid[row].filter(val => val !== 0);
      
      // 合并相邻相同数字（从右向左）
      const mergedRow: number[] = [];
      let i = rowTiles.length - 1;
      
      while (i >= 0) {
        if (i > 0 && rowTiles[i] === rowTiles[i - 1]) {
          // 合并相同数字
          const mergedValue = rowTiles[i] * 2;
          mergedRow.unshift(mergedValue);
          this.score += mergedValue;
          
          // 检查是否达到2048
          if (mergedValue === 2048) {
            this.win = true;
          }
          
          i -= 2; // 跳过下一个数字
        } else {
          mergedRow.unshift(rowTiles[i]);
          i--;
        }
      }
      
      // 用0填充剩余位置
      while (mergedRow.length < 4) {
        mergedRow.unshift(0);
      }
      
      // 检查是否有变化
      for (let col = 0; col < 4; col++) {
        if (this.grid[row][col] !== mergedRow[col]) {
          moved = true;
        }
        this.grid[row][col] = mergedRow[col];
      }
    }
    
    return moved;
  }

  /**
   * 向上移动
   */
  private moveUp(): boolean {
    let moved = false;
    
    for (let col = 0; col < 4; col++) {
      // 获取当前列非零数字
      const colTiles: number[] = [];
      for (let row = 0; row < 4; row++) {
        if (this.grid[row][col] !== 0) {
          colTiles.push(this.grid[row][col]);
        }
      }
      
      // 合并相邻相同数字
      const mergedCol: number[] = [];
      let i = 0;
      
      while (i < colTiles.length) {
        if (i < colTiles.length - 1 && colTiles[i] === colTiles[i + 1]) {
          // 合并相同数字
          const mergedValue = colTiles[i] * 2;
          mergedCol.push(mergedValue);
          this.score += mergedValue;
          
          // 检查是否达到2048
          if (mergedValue === 2048) {
            this.win = true;
          }
          
          i += 2; // 跳过下一个数字
        } else {
          mergedCol.push(colTiles[i]);
          i++;
        }
      }
      
      // 用0填充剩余位置
      while (mergedCol.length < 4) {
        mergedCol.push(0);
      }
      
      // 检查是否有变化
      for (let row = 0; row < 4; row++) {
        if (this.grid[row][col] !== mergedCol[row]) {
          moved = true;
        }
        this.grid[row][col] = mergedCol[row];
      }
    }
    
    return moved;
  }

  /**
   * 向下移动
   */
  private moveDown(): boolean {
    let moved = false;
    
    for (let col = 0; col < 4; col++) {
      // 获取当前列非零数字
      const colTiles: number[] = [];
      for (let row = 0; row < 4; row++) {
        if (this.grid[row][col] !== 0) {
          colTiles.push(this.grid[row][col]);
        }
      }
      
      // 合并相邻相同数字（从下向上）
      const mergedCol: number[] = [];
      let i = colTiles.length - 1;
      
      while (i >= 0) {
        if (i > 0 && colTiles[i] === colTiles[i - 1]) {
          // 合并相同数字
          const mergedValue = colTiles[i] * 2;
          mergedCol.unshift(mergedValue);
          this.score += mergedValue;
          
          // 检查是否达到2048
          if (mergedValue === 2048) {
            this.win = true;
          }
          
          i -= 2; // 跳过下一个数字
        } else {
          mergedCol.unshift(colTiles[i]);
          i--;
        }
      }
      
      // 用0填充剩余位置
      while (mergedCol.length < 4) {
        mergedCol.unshift(0);
      }
      
      // 检查是否有变化
      for (let row = 0; row < 4; row++) {
        if (this.grid[row][col] !== mergedCol[row]) {
          moved = true;
        }
        this.grid[row][col] = mergedCol[row];
      }
    }
    
    return moved;
  }

  /**
   * 检查游戏状态（是否结束或获胜）
   */
  private checkGameStatus(): void {
    // 检查是否还有空位
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.grid[row][col] === 0) {
          return; // 还有空位，游戏继续
        }
      }
    }
    
    // 检查是否还能合并
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.grid[row][col] === this.grid[row][col + 1]) {
          return; // 水平方向可以合并
        }
      }
    }
    
    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 3; row++) {
        if (this.grid[row][col] === this.grid[row + 1][col]) {
          return; // 垂直方向可以合并
        }
      }
    }
    
    // 无法移动，游戏结束
    this.gameOver = true;
  }

  /**
   * 重新开始游戏
   */
  public restart(): void {
    this.initializeGame();
  }
}

export default Game2048;