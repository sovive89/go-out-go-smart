import { useMemo } from 'react';

interface QRCodeProps {
  value: string;
  size?: number;
}

const QRCode = ({ value, size = 200 }: QRCodeProps) => {
  // Simple QR code visual representation
  // In production, use a library like 'qrcode.react'
  const pattern = useMemo(() => {
    const grid: boolean[][] = [];
    const gridSize = 25;
    
    // Create deterministic pattern based on value
    for (let i = 0; i < gridSize; i++) {
      grid[i] = [];
      for (let j = 0; j < gridSize; j++) {
        // Border pattern
        if (i < 7 && j < 7) grid[i][j] = true;
        else if (i < 7 && j >= gridSize - 7) grid[i][j] = true;
        else if (i >= gridSize - 7 && j < 7) grid[i][j] = true;
        // Inner pattern based on value hash
        else {
          const hash = (value.charCodeAt((i + j) % value.length) * (i + 1) * (j + 1)) % 100;
          grid[i][j] = hash > 45;
        }
      }
    }

    // Clear center squares for finder patterns
    for (let i = 1; i < 6; i++) {
      for (let j = 1; j < 6; j++) {
        if (i > 1 && i < 5 && j > 1 && j < 5) {
          grid[i][j] = true;
        } else if (i === 1 || i === 5 || j === 1 || j === 5) {
          grid[i][j] = false;
        }
      }
    }

    // Top right finder
    for (let i = 1; i < 6; i++) {
      for (let j = gridSize - 6; j < gridSize - 1; j++) {
        if (i > 1 && i < 5 && j > gridSize - 6 && j < gridSize - 2) {
          grid[i][j] = true;
        } else if (i === 1 || i === 5 || j === gridSize - 6 || j === gridSize - 2) {
          grid[i][j] = false;
        }
      }
    }

    // Bottom left finder
    for (let i = gridSize - 6; i < gridSize - 1; i++) {
      for (let j = 1; j < 6; j++) {
        if (i > gridSize - 6 && i < gridSize - 2 && j > 1 && j < 5) {
          grid[i][j] = true;
        } else if (i === gridSize - 6 || i === gridSize - 2 || j === 1 || j === 5) {
          grid[i][j] = false;
        }
      }
    }

    return grid;
  }, [value]);

  const cellSize = size / 25;

  return (
    <div className="flex items-center justify-center">
      <div 
        className="bg-foreground rounded-2xl p-4 shadow-[0_0_40px_hsl(38_92%_50%_/_0.3)]"
        style={{ width: size + 32, height: size + 32 }}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {pattern.map((row, i) =>
            row.map((cell, j) =>
              cell ? (
                <rect
                  key={`${i}-${j}`}
                  x={j * cellSize}
                  y={i * cellSize}
                  width={cellSize}
                  height={cellSize}
                  fill="hsl(0 0% 4%)"
                />
              ) : null
            )
          )}
        </svg>
      </div>
    </div>
  );
};

export default QRCode;
