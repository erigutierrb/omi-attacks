"use client";

import { useEffect, useRef, useState } from 'react';
import p5 from 'p5';

export default function Home() {
  const sketchRef = useRef<HTMLDivElement>(null);
  const [gameStarted, setGameStarted] = useState(false);


  const Sketch = (p: p5) => {
    let characterX = 200;
    let characterImg: p5.Image;
    let reactImg: p5.Image;
    let archiImg: p5.Image;
    let jsImg: p5.Image;
    let netImg: p5.Image;
    let points = 0;
    let fallingShapes: Array<{ img: p5.Image; x: number; y: number; w: number, h: number }> = [];
    let isGameOver = false;


    p.preload = () => {
      characterImg = p.loadImage('/omi.svg');
      reactImg = p.loadImage('/react.svg');
      archiImg = p.loadImage('/archi.svg');
      jsImg = p.loadImage('/js.svg');
      netImg = p.loadImage('/net.svg');
    };

    p.setup = () => {
      p.createCanvas(500, 500);
      let shapeIndex = 0;
      const images = [{ img: reactImg, w: 50, h: 50 }, { img: archiImg, w: 50, h: 50 }, { img: jsImg, w: 50, h: 50 }, { img: netImg, w: 80, h: 50 }];
      const interval = setInterval(() => {
        if (shapeIndex < images.length) {
          fallingShapes.push({
            img: images[shapeIndex].img,
            x: p.random(0, p.width - 50),
            y: p.random(-200, -50),
            w: images[shapeIndex].w,
            h: images[shapeIndex].h,
          });
          shapeIndex++;
        } else {
          clearInterval(interval);
        }
      }, 3000);
    };

    const detectCollision = (shape: { x: number; y: number; w: number; h: number }) => {
      const characterY = 420;
      const characterW = 50;
      const characterH = 80;

      return (
        shape.x < characterX + characterW &&
        shape.x + shape.w > characterX &&
        shape.y < characterY + characterH &&
        shape.y + shape.h > characterY
      );
    };

    p.draw = () => {
      p.background(0);
      p.fill(255);
      p.text("Mis Puntitos: " + points, 10, 30);

      if (isGameOver) {
        p.background(0);
        p.fill(255, 0, 0);
        p.textSize(32);
        p.text("¡Perdisteeeeeeeeee!, muajajaja", 20, 250);
        p.noLoop();
        return;
      }


      for (let shape of fallingShapes) {
        p.image(shape.img, shape.x, shape.y, shape.w, shape.h);
        shape.y += 2;

        if (shape.y > p.height) {
          isGameOver = true;
        }

        if (detectCollision(shape)) {
          points++;
          shape.y = p.random(-200, -50);
          shape.x = p.random(0, p.width - 50);
        }
      }
      p.image(characterImg, characterX, 420, 50, 80);
    };

    p.keyPressed = () => {
      if (p.keyCode === p.LEFT_ARROW) {
        characterX = Math.max(characterX - 30, 0);
      } else if (p.keyCode === p.RIGHT_ARROW) {
        characterX = Math.min(characterX + 30, p.width - 50);
      }
    };
  };

  useEffect(() => {
    if (gameStarted && sketchRef.current) {
      const p5Instance = new p5(Sketch, sketchRef.current);

      return () => {
        p5Instance.remove();
      };
    }
  }, [gameStarted]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-2">
      <div className="container-game">
        <h1 className="text-4xl font-bold title-game">OMI ATTACKS!!!</h1>
        <p>El destructor de lenguajes de programación malignos</p>
        {!gameStarted && (
          <button
            onClick={() => setGameStarted(true)}
            className="start-btn"
          >
            Iniciar Juego
          </button>
        )}
        {gameStarted && <div ref={sketchRef}></div>}
      </div>
    </main>
  );
}
