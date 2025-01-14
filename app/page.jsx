"use client";

import { Test } from "@/public/teste/test";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";

export default function Home() {
  const [baseNumber, setBaseNumber] = useState(0);
  const [shirtNumber, setShirtNumber] = useState(1);
  const [pantNumber, setPantNumber] = useState(1);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] absolute">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1>Three.js com Next.js</h1>
        <button
          onClick={(e) => {
            setBaseNumber(baseNumber < 6 ? baseNumber + 1 : 0);
          }}
          className="relative z-50"
        >
          Base Texture {baseNumber}
        </button>
        <button
          onClick={(e) => {
            setShirtNumber(shirtNumber < 13 ? shirtNumber + 1 : 1);
          }}
          className="relative z-50"
        >
          Shirt Texture {shirtNumber}
        </button>
        <button
          onClick={(e) => {
            setPantNumber(pantNumber < 7 ? pantNumber + 1 : 1);
          }}
          className="relative z-50"
        >
          Pant Texture {pantNumber}
        </button>
        <Canvas
          style={{
            height: "100vh",
            width: "100vw",
            position: "absolute",
            top: 0,
            left: 0,
          }}
          shadows
          camera={{ position: [0, 1, -5], rotation: [0, Math.PI, 0] }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={Math.PI / 2} />
            <spotLight
              position={[20, 20, -10]}
              angle={0.15}
              penumbra={1}
              decay={0}
              intensity={Math.PI}
            />
            <Test
              baseTexture={"base" + baseNumber}
              shirtTexture={"shirt" + shirtNumber}
              pantTexture={"pant" + pantNumber}
              rotate={-0}
            />
          </Suspense>
        </Canvas>
      </main>
    </div>
  );
}
