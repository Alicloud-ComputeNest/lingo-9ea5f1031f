import React, { useState, useEffect, useCallback } from 'react';
import Game2048 from '../../Game2048';

const GameBoard: React.FC = () => {
  const [game] = useState<Game2048>(new Game2048());
  const [grid, setGrid] = useState<number[][]>(game.getGrid());
  const [score, setScore] = useState<number>(game.getScore());
  const [bestScore, setBestScore] = useState<number>(game.getBestScore());
  const [gameOver, setGameOver] = useState<boolean>(game.isGameOver());
  const [hasWon, setHasWon] = useState<boolean>(game.hasWon());

  // 更新游戏状态
  const updateGameState = useCallback(() => {
    setGrid([...game.getGrid().map(row => [...row])]);
    setScore(game.getScore());
    setBestScore(game.getBestScore());
    setGameOver(game.isGameOver());
    setHasWon(game.hasWon());
  }, [game]);

  // 处理键盘事件
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    let moved = false;
    
    switch (event.key) {
      case 'ArrowUp':
        moved = game.move('up');
        break;
      case 'ArrowDown':
        moved = game.move('down');
        break;
      case 'ArrowLeft':
        moved = game.move('left');
        break;
      case 'ArrowRight':
        moved = game.move('right');
        break;
      default:
        break;
    }
    
    if (moved) {
      updateGameState();
    }
  }, [game, updateGameState]);

  // 重新开始游戏
  const handleRestart = () => {
    game.restart();
    updateGameState();
  };

  // 设置键盘监听器
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // 初始化游戏状态
  useEffect(() => {
    updateGameState();
  }, [updateGameState]);

  // 获取数字块的样式类
  const getTileClass = (value: number): string => {
    if (value === 0) return 'bg-gray-200 opacity-0';
    
    const baseClasses = 'flex items-center justify-center font-bold rounded-lg text-xl md:text-2xl transition-all duration-150 ease-in-out transform';
    
    switch (value) {
      case 2: return `${baseClasses} bg-tile-2 text-gray-700`;
      case 4: return `${baseClasses} bg-tile-4 text-gray-700`;
      case 8: return `${baseClasses} bg-tile-8 text-white`;
      case 16: return `${baseClasses} bg-tile-16 text-white`;
      case 32: return `${baseClasses} bg-tile-32 text-white`;
      case 64: return `${baseClasses} bg-tile-64 text-white`;
      case 128: return `${baseClasses} bg-tile-128 text-white text-2xl md:text-3xl`;
      case 256: return `${baseClasses} bg-tile-256 text-white text-2xl md:text-3xl`;
      case 512: return `${baseClasses} bg-tile-512 text-white text-2xl md:text-3xl`;
      case 1024: return `${baseClasses} bg-tile-1024 text-white text-2xl md:text-3xl`;
      case 2048: return `${baseClasses} bg-tile-2048 text-white text-2xl md:text-3xl`;
      default: return `${baseClasses} bg-tile-super text-white text-2xl md:text-3xl`;
    }
  };

  return (
    <div className="flex flex-col items-center p-4 md:p-6 max-w-md mx-auto">
      {/* 标题和分数区域 */}
      <div className="w-full mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">2048</h1>
          <div className="flex space-x-2">
            <div className="bg-[#bbada0] rounded-lg py-2 px-4 text-center">
              <div className="text-xs text-white uppercase">Score</div>
              <div className="text-white font-bold">{score}</div>
            </div>
            <div className="bg-[#bbada0] rounded-lg py-2 px-4 text-center">
              <div className="text-xs text-white uppercase">Best</div>
              <div className="text-white font-bold">{bestScore}</div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-300 text-sm md:text-base">
            Join the numbers and get to the <strong>2048 tile!</strong>
          </p>
          <button 
            onClick={handleRestart}
            className="bg-[#8f7a66] hover:bg-[#9f8a76] text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            New Game
          </button>
        </div>
      </div>

      {/* 游戏网格 */}
      <div className="relative bg-[#bbada0] rounded-lg p-4 w-full aspect-square max-w-md">
        {/* 游戏结束遮罩 */}
        {(gameOver || hasWon) && (
          <div className="absolute inset-0 bg-black bg-opacity-70 rounded-lg z-10 flex flex-col items-center justify-center">
            <div className="text-white text-3xl font-bold mb-4">
              {hasWon ? 'You Win!' : 'Game Over!'}
            </div>
            <button 
              onClick={handleRestart}
              className="bg-[#8f7a66] hover:bg-[#9f8a76] text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        )}
        
        {/* 网格背景 */}
        <div className="grid grid-cols-4 gap-3 w-full h-full">
          {Array(16).fill(0).map((_, index) => (
            <div 
              key={index} 
              className="bg-[#cdc1b4] rounded-lg opacity-30"
            />
          ))}
        </div>
        
        {/* 数字块 */}
        <div className="absolute inset-4 grid grid-cols-4 gap-3">
          {grid.flat().map((value, index) => (
            <div
              key={index}
              className={getTileClass(value)}
            >
              {value !== 0 ? value : ''}
            </div>
          ))}
        </div>
      </div>

      {/* 操作说明 */}
      <div className="mt-6 text-gray-300 text-sm text-center">
        <p className="mb-2"><strong>HOW TO PLAY:</strong> Use your <strong>arrow keys</strong> to move the tiles.</p>
        <p>When two tiles with the same number touch, they <strong>merge into one!</strong></p>
      </div>
    </div>
  );
};

export default GameBoard;