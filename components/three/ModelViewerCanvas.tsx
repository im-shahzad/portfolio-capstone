"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Center, Environment, OrbitControls } from "@react-three/drei";
import GLTFModel from "./GLTFModel";
import DefaultPrimitive from "./DefaultPrimitive";
import type { MaterialConfig } from "./types";

interface ModelViewerCanvasProps {
  modelUrl: string | null;
  material: MaterialConfig;
  autoRotateSpeed: number;
}

function SceneFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.6, 0.6, 0.6]} />
      <meshBasicMaterial color="#94a3b8" wireframe />
    </mesh>
  );
}

export default function ModelViewerCanvas({
  modelUrl,
  material,
  autoRotateSpeed,
}: ModelViewerCanvasProps) {
  return (
    <Canvas camera={{ position: [3, 2, 5], fov: 50 }} shadows>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <Suspense fallback={<SceneFallback />}>
        <Center>
          {modelUrl ? (
            <GLTFModel key={modelUrl} url={modelUrl} material={material} />
          ) : (
            <DefaultPrimitive material={material} />
          )}
        </Center>
        <Environment preset="city" />
      </Suspense>
      <OrbitControls
        makeDefault
        autoRotate={autoRotateSpeed > 0}
        autoRotateSpeed={autoRotateSpeed}
      />
    </Canvas>
  );
}
