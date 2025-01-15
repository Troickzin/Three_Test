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
  const [shadowEnable, setShadowEnable] = useState(true);
  const [slimEnable, setSlimEnable] = useState(false);
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
    const storedImageSrc = sessionStorage.getItem("combinedTexture");
    if (storedImageSrc) {
      setImageSrc(storedImageSrc);
    }
  }, []);

  return (
    <div className="w-screen h-screen">
      <div
        className="absolute w-full h-full"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.05) 100%)",
        }}
      ></div>
      <div className="grid absolute justify-center items-center z-50 w-full">
        <div className="grid gap-4 justify-center items-center w-full relative mt-2 grid-cols-6 max-sm:grid-cols-3">
          <button
            onClick={() => {
              setSlimEnable(!slimEnable);
            }}
            className="relative z-50 hover:text-green-300 transition-all"
          >
            Set Slim : {slimEnable ? "Enable" : "Disable"}
          </button>
          <button
            onClick={() => {
              setShadowEnable(!shadowEnable);
            }}
            className="relative z-50 hover:text-green-300 transition-all"
          >
            Set Shadow : {shadowEnable ? "Enable" : "Disable"}
          </button>
          <button
            onClick={() => {
              setBaseNumber(baseNumber < 6 ? baseNumber + 1 : 0);
              sessionStorage.setItem(
                "baseTexture",
                baseNumber < 6 ? baseNumber + 1 : 0
              );
            }}
            className="relative z-50 hover:text-green-300 transition-all"
          >
            Base Texture {baseNumber}
          </button>
          <button
            onClick={() => {
              setShirtNumber(shirtNumber < 13 ? shirtNumber + 1 : 0);
              sessionStorage.setItem(
                "shirtTexture",
                shirtNumber < 13 ? shirtNumber + 1 : 0
              );
            }}
            className="relative z-50 hover:text-green-300 transition-all"
          >
            Shirt Texture {shirtNumber}
          </button>
          <button
            onClick={() => {
              setPantNumber(pantNumber < 7 ? pantNumber + 1 : 0);
              sessionStorage.setItem(
                "pantTexture",
                pantNumber < 7 ? pantNumber + 1 : 0
              );
            }}
            className="relative z-50 hover:text-green-300 transition-all"
          >
            Pant Texture {pantNumber}
          </button>
          <button
            onClick={() => {
              const storedImageSrc = sessionStorage.getItem("combinedTexture");
              if (storedImageSrc) {
                setImageSrc(storedImageSrc);
              }
            }}
            className="relative z-50 hover:text-green-300 transition-all"
          >
            Generate Skin Image
          </button>
        </div>
        {imageSrc && (
          <img
            src={imageSrc}
            alt="Textura combinada"
            className="z-50 relative m-auto mt-2 hover:scale-110 transition-all max-sm:ml-0"
            onClick={handleImageClick}
            style={{ cursor: "pointer" }}
          />
        )}
      </div>
      <div className="grid items-center justify-items-center min-h-full p-8 pb-20 gap-16 sm:p-20 absolute">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
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
              <ambientLight intensity={0.3} />
              <spotLight
                position={[20, 15, -20]}
                angle={0.15}
                penumbra={1}
                decay={0}
                intensity={Math.PI}
                castShadow={shadowEnable}
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-bias={-0.0001}
                color="#E2FEFF"
              />
              <OrbitControls />
              <Test
                baseTexture={"base" + baseNumber}
                shirtTexture={"shirt" + shirtNumber}
                pantTexture={"pant" + pantNumber}
                slim={slimEnable}
              />
            </Suspense>
          </Canvas>
        </main>
      </div>
    </div>
  );
}
