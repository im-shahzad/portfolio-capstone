"use client";

import { useEffect } from "react";
import { useControls } from "leva";
import type { MaterialConfig } from "./types";

export interface MaterialControlsValues extends MaterialConfig {
  autoRotateSpeed: number;
}

interface MaterialControlsProps {
  onChange: (values: MaterialControlsValues) => void;
}

/**
 * Isolated in its own module so the `leva` package (panel UI + store) is only
 * ever pulled into the client bundle via the dynamic() import in the page,
 * never as part of the initial /3d-viewer chunk.
 */
export default function MaterialControls({ onChange }: MaterialControlsProps) {
  const values = useControls("Material", {
    color: "#3b82f6",
    metalness: { value: 0.5, min: 0, max: 1, step: 0.01 },
    roughness: { value: 0.4, min: 0, max: 1, step: 0.01 },
    wireframe: false,
    autoRotateSpeed: { value: 2, min: 0, max: 10, step: 0.1, label: "Auto-Rotate Speed" },
  });

  useEffect(() => {
    onChange(values);
  }, [values, onChange]);

  return null;
}
