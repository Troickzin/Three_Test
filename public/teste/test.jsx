"use client";
import React, { useEffect } from "react";
import { TextureLoader, NearestFilter, CanvasTexture } from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { useLoader } from "@react-three/fiber";

export function Test(props) {
  const obj = useLoader(
    OBJLoader,
    "http://localhost:3000/models/test/model.obj"
  );
  const baseTexture = useLoader(
    TextureLoader,
    `http://localhost:3000/models/test/texture/${props.baseTexture}.png`
  );
  const shirtTexture = useLoader(
    TextureLoader,
    `http://localhost:3000/models/test/texture/Roupas/${props.shirtTexture}.png`
  );
  const pantTexture = useLoader(
    TextureLoader,
    `http://localhost:3000/models/test/texture/Roupas/${props.pantTexture}.png`
  );

  useEffect(() => {
    obj.scale.set(2, 2, 2);
    obj.position.set(0, -0.7, 0);

    // Configurar as texturas como pixel art
    [baseTexture, shirtTexture, pantTexture].forEach((texture) => {
      texture.minFilter = NearestFilter;
      texture.magFilter = NearestFilter;
      texture.generateMipmaps = false;
    });

    // Criar um canvas para combinar as texturas
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext("2d");

    // Desenhar as texturas no canvas
    const drawTexture = (texture, alpha = 1.0) => {
      const image = texture.image;
      context.globalAlpha = alpha;
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
    };

    drawTexture(baseTexture);
    drawTexture(shirtTexture, 1.0); // Ajuste o valor alpha conforme necessário
    drawTexture(pantTexture, 1.0); // Ajuste o valor alpha conforme necessário

    // Criar uma textura combinada a partir do canvas
    const combinedTexture = new CanvasTexture(canvas);
    combinedTexture.minFilter = NearestFilter;
    combinedTexture.magFilter = NearestFilter;
    combinedTexture.generateMipmaps = false;

    // Aplicar a textura combinada ao material da malha
    obj.traverse((child) => {
      if (child.isMesh) {
        child.material.map = combinedTexture;
        child.material.transparent = true;
        child.material.alphaTest = 0.5;
        child.material.needsUpdate = true;
      }
    });
  }, [obj, baseTexture, shirtTexture, pantTexture]);

  return <primitive object={obj} />;
}
