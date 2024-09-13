import { useEffect, useRef, useState } from 'react';

interface FallingShape {
  x: number;
  y: number;
  size: number;
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [characterX, setCharacterX] = useState(200);
  const [fallingShapes, setFallingShapes] = useState<FallingShape[]>([]);

  // Mover el personaje con las teclas de flechas
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setCharacterX((prevX) => Math.max(prevX - 20, 0));
    }
    if (e.key === 'ArrowRight') {
      setCharacterX((prevX) => Math.min(prevX + 20, 400)); // Evitar salir del canvas
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Crear figuras que caen
    const createShape = () => {
      setFallingShapes((prevShapes) => [
        ...prevShapes,
        { x: Math.random() * 400, y: 0, size: 20 + Math.random() * 30 },
      ]);
    };

    // Dibujar el personaje y las figuras
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dibujar personaje
      ctx.fillStyle = 'blue';
      ctx.fillRect(characterX, 450, 50, 50);

      // Dibujar figuras que caen
      setFallingShapes((prevShapes) =>
        prevShapes.map((shape) => {
          ctx.fillStyle = 'red';
          ctx.fillRect(shape.x, shape.y, shape.size, shape.size);
          return { ...shape, y: shape.y + 5 };
        })
      );
    };

    // Bucle de animación
    const interval = setInterval(() => {
      draw();
      createShape();
    }, 100);

    return () => clearInterval(interval);
  }, [characterX, fallingShapes]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-2">
      <h1 className="text-4xl font-bold">OMI ATTACKS!!!</h1>
      <p>HEREEEE</p>
      <canvas ref={canvasRef} width="500" height="500" style={{ border: '1px solid black' }} />
    </main>
  );
}
