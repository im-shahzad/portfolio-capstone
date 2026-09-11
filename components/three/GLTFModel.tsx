"use client";

import { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { MaterialConfig } from "./types";

interface GLTFModelProps {
  url: string;
  material: MaterialConfig;
}

export default function GLTFModel({ url, material }: GLTFModelProps) {
  const { scene } = useGLTF(url);

  // Clone so material edits never mutate drei's cached GLTF for this url.
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material];

      materials.forEach((mat) => {
        if (
          mat instanceof THREE.MeshStandardMaterial ||
          mat instanceof THREE.MeshPhysicalMaterial
        ) {
          mat.color.set(material.color);
          mat.metalness = material.metalness;
          mat.roughness = material.roughness;
          mat.wireframe = material.wireframe;
          mat.needsUpdate = true;
        }
      });
    });
  }, [clonedScene, material.color, material.metalness, material.roughness, material.wireframe]);

  return <primitive object={clonedScene} />;
}
