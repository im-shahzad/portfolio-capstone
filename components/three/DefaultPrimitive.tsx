"use client";

import type { MaterialConfig } from "./types";

interface DefaultPrimitiveProps {
  material: MaterialConfig;
}

/** Standard 3D primitive shown when no .glb/.gltf has been uploaded. */
export default function DefaultPrimitive({ material }: DefaultPrimitiveProps) {
  return (
    <mesh castShadow receiveShadow rotation={[0.4, 0.3, 0]}>
      <torusKnotGeometry args={[1, 0.35, 200, 32]} />
      <meshStandardMaterial
        color={material.color}
        metalness={material.metalness}
        roughness={material.roughness}
        wireframe={material.wireframe}
      />
    </mesh>
  );
}
