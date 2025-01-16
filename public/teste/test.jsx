"use client";
import React, { useEffect, useState } from "react";
import { TextureLoader, NearestFilter, CanvasTexture, DoubleSide } from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { useLoader } from "@react-three/fiber";

export function Test(props) {
  const obj = useLoader(
    OBJLoader,
    `${process.env.NEXT_PUBLIC_BASE_URL}/models/test/${
      props.slim ? "model_slim.obj" : "model.obj"
    }`
  );
  const [imageSrc, setImageSrc] = useState(
    () => sessionStorage.getItem("combinedTexture") || null
  );

  useEffect(() => {
    const textureLoader = new TextureLoader();

    const loadTexture = (url) => {
      return new Promise((resolve, reject) => {
        textureLoader.load(url, resolve, undefined, reject);
      });
    };

    // URLs das texturas
    const baseTextureUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/models/test/texture/${props.baseTexture}.png`;
    const shirtTextureUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/models/test/texture/Roupas/${props.shirtTexture}.png`;
    const pantTextureUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/models/test/texture/Roupas/${props.pantTexture}.png`;
    const olhoTextureUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/models/test/texture/olho.png`;
    const pupilaTextureUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/models/test/texture/pupila.png`;
    const cuecaTextureUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/models/test/texture/cueca.png`;

    // Carregar todas as texturas
    Promise.all([
      loadTexture(baseTextureUrl),
      loadTexture(shirtTextureUrl).catch(() => null), // Capturar erro se a textura não existir
      loadTexture(pantTextureUrl).catch(() => null), // Capturar erro se a textura não existir
      loadTexture(olhoTextureUrl).catch(() => null), // Capturar erro se a textura não existir
      loadTexture(pupilaTextureUrl).catch(() => null), // Capturar erro se a textura não existir
      loadTexture(cuecaTextureUrl).catch(() => null), // Capturar erro se a textura não existir
    ])
      .then(
        ([
          baseTexture,
          shirtTexture,
          pantTexture,
          olhoTexture,
          pupilaTexture,
          cuecaTexture,
        ]) => {
          // Configurar as texturas como pixel art
          [
            baseTexture,
            shirtTexture,
            pantTexture,
            olhoTexture,
            pupilaTexture,
            cuecaTexture,
          ].forEach((texture) => {
            if (texture) {
              texture.minFilter = NearestFilter;
              texture.magFilter = NearestFilter;
              texture.generateMipmaps = false;
            }
          });

          obj.scale.set(2, 2, 2);
          obj.position.set(0, -1.8, 0);

          // Função para desenhar uma textura em um canvas
          const drawTexture = (
            context,
            texture,
            alpha = 1.0,
            compositeOperation = "source-over"
          ) => {
            if (texture) {
              const image = texture.image;
              context.globalAlpha = alpha;
              context.globalCompositeOperation = compositeOperation;
              context.drawImage(
                image,
                0,
                0,
                context.canvas.width,
                context.canvas.height
              );
            }
          };

          // Função para criar um canvas e contexto
          const createCanvas = () => {
            const canvas = document.createElement("canvas");
            canvas.width = 64;
            canvas.height = 64;
            const context = canvas.getContext("2d");
            return { canvas, context };
          };

          // Criar canvases separados para cada textura
          const { canvas: baseCanvas, context: baseContext } = createCanvas();
          const { canvas: shirtCanvas, context: shirtContext } = createCanvas();
          const { canvas: cuecaCanvas, context: cuecaContext } = createCanvas();
          const { canvas: pantCanvas, context: pantContext } = createCanvas();
          const { canvas: olhoCanvas, context: olhoContext } = createCanvas();
          const { canvas: pupilaCanvas, context: pupilaContext } =
            createCanvas();

          // Desenhar a textura base e mudar sua cor usando multiplicação
          if (baseTexture) {
            drawTexture(baseContext, baseTexture, 1.0, "source-over");
            baseContext.globalCompositeOperation = "multiply";
            baseContext.fillStyle = props.skinColor || "#f8eee7"; // Cor padrão branca
            baseContext.fillRect(0, 0, baseCanvas.width, baseCanvas.height);
            baseContext.globalCompositeOperation = "source-over";
            drawTexture(baseContext, baseTexture, 1.0, "destination-in");
          }

          // Desenhar a textura da pupila e mudar sua cor usando multiplicação
          if (!pantTexture) {
            drawTexture(cuecaContext, cuecaTexture, 1.0, "source-over");
            cuecaContext.globalCompositeOperation = "multiply";
            cuecaContext.fillStyle = props.cuecaColor || "#fff"; // Cor padrão preta
            cuecaContext.fillRect(0, 0, cuecaCanvas.width, cuecaCanvas.height);
            cuecaContext.globalCompositeOperation = "source-over";
            drawTexture(cuecaContext, cuecaTexture, 1.0, "destination-in");
          }

          // Desenhar a textura do olho
          if (olhoTexture) {
            drawTexture(olhoContext, olhoTexture, 1.0, "source-over");
          }

          // Desenhar a textura da pupila e mudar sua cor usando multiplicação
          if (pupilaTexture) {
            drawTexture(pupilaContext, pupilaTexture, 1.0, "source-over");
            pupilaContext.globalCompositeOperation = "multiply";
            pupilaContext.fillStyle = props.pupilaColor || "#59add2"; // Cor padrão preta
            pupilaContext.fillRect(
              0,
              0,
              pupilaCanvas.width,
              pupilaCanvas.height
            );
            pupilaContext.globalCompositeOperation = "source-over";
            drawTexture(pupilaContext, pupilaTexture, 1.0, "destination-in");
          }

          // Desenhar a textura da calça
          if (pantTexture) {
            drawTexture(pantContext, pantTexture, 1.0, "source-over");
          }

          // Desenhar a textura da camisa
          if (shirtTexture) {
            drawTexture(shirtContext, shirtTexture, 1.0, "source-over");
          }

          // Criar um canvas final para combinar todas as texturas
          const finalCanvas = document.createElement("canvas");
          finalCanvas.width = 64;
          finalCanvas.height = 64;
          const finalContext = finalCanvas.getContext("2d");

          // Combinar todos os canvases no canvas final
          finalContext.drawImage(baseCanvas, 0, 0);
          finalContext.drawImage(shirtCanvas, 0, 0);
          finalContext.drawImage(cuecaCanvas, 0, 0);
          finalContext.drawImage(pantCanvas, 0, 0);
          finalContext.drawImage(olhoCanvas, 0, 0);
          finalContext.drawImage(pupilaCanvas, 0, 0);

          // Criar uma textura combinada a partir do canvas final
          const combinedTexture = new CanvasTexture(finalCanvas);
          combinedTexture.minFilter = NearestFilter;
          combinedTexture.magFilter = NearestFilter;
          combinedTexture.generateMipmaps = false;

          const dataURL = finalCanvas.toDataURL();
          setImageSrc(dataURL);
          sessionStorage.setItem("combinedTexture", dataURL);

          obj.traverse((child) => {
            if (child.isMesh) {
              child.material.map = combinedTexture;
              child.material.side = DoubleSide;
              child.material.transparent = true;
              child.material.alphaTest = 0.5;
              child.material.needsUpdate = true;

              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
        }
      )
      .catch((error) => {
        console.error("Erro ao carregar texturas:", error);
      });
  }, [
    obj,
    props.baseTexture,
    props.shirtTexture,
    props.pantTexture,
    props.baseColor,
    props.cuecaColor,
    props.pupilaColor,
    props.skinColor,
  ]);

  return (
    <>
      <primitive object={obj} />
    </>
  );
}
