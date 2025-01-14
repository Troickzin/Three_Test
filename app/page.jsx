// filepath: /c:/Users/troic/Documents/Projetos/tres-teste/app/page.jsx
"use client";
import { Test } from "@/public/teste/test";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, Suspense, useState } from "react";

export default function Home() {
  const [baseNumber, setBaseNumber] = useState(0);
  const [shirtNumber, setShirtNumber] = useState(0);
  const [pantNumber, setPantNumber] = useState(0);
  const [imageSrc, setImageSrc] = useState(null);

  const handleImageClick = () => {
    if (imageSrc) {
      const link = document.createElement("a");
      link.href = imageSrc;
      link.download = "skin.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  useEffect(() => {
    const storedBaseNumber = sessionStorage.getItem("baseTexture");
    const storedShirtNumber = sessionStorage.getItem("shirtTexture");
    const storedPantNumber = sessionStorage.getItem("pantTexture");

    if (storedBaseNumber) setBaseNumber(parseInt(storedBaseNumber));
    if (storedShirtNumber) setShirtNumber(parseInt(storedShirtNumber));
    if (storedPantNumber) setPantNumber(parseInt(storedPantNumber));
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] absolute">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1>Three.js com Next.js</h1>
        <button
          onClick={(e) => {
            setBaseNumber(baseNumber < 6 ? baseNumber + 1 : 0);
            sessionStorage.setItem(
              "baseTexture",
              baseNumber < 6 ? baseNumber + 1 : 0
            );
          }}
          className="relative z-50"
        >
          Base Texture {baseNumber}
        </button>
        <button
          onClick={(e) => {
            setShirtNumber(shirtNumber < 13 ? shirtNumber + 1 : 0);
            sessionStorage.setItem(
              "shirtTexture",
              shirtNumber < 13 ? shirtNumber + 1 : 0
            );
          }}
          className="relative z-50"
        >
          Shirt Texture {shirtNumber}
        </button>
        <button
          onClick={(e) => {
            setPantNumber(pantNumber < 7 ? pantNumber + 1 : 0);
            sessionStorage.setItem(
              "pantTexture",
              pantNumber < 7 ? pantNumber + 1 : 0
            );
          }}
          className="relative z-50"
        >
          Pant Texture {pantNumber}
        </button>
        <button
          onClick={(e) => {
            const storedImageSrc = sessionStorage.getItem("combinedTexture");
            if (storedImageSrc) {
              setImageSrc(storedImageSrc);
            }
          }}
          className="relative z-50"
        >
          render image
        </button>
        {imageSrc && (
          <img
            src={imageSrc}
            alt="Textura combinada"
            className="relative z-50"
            onClick={handleImageClick}
            style={{ cursor: "pointer" }}
          />
        )}
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
            <ambientLight intensity={0.5} />
            <spotLight
              position={[20, 20, -10]}
              angle={0.15}
              penumbra={1}
              decay={0}
              intensity={Math.PI}
            />
            <OrbitControls />
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
