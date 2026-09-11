"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MaterialControlsValues } from "@/components/three/MaterialControls";
import type { MaterialConfig } from "@/components/three/types";

const ModelViewerCanvas = dynamic(
  () => import("@/components/three/ModelViewerCanvas"),
  {
    ssr: false,
    loading: () => <CanvasFallback />,
  }
);

// The `leva` package (panel UI + store) is only fetched once this actually
// mounts, keeping it out of the route's initial JS/TBT budget.
const MaterialControls = dynamic(
  () => import("@/components/three/MaterialControls"),
  { ssr: false }
);

const DEFAULT_MATERIAL: MaterialConfig = {
  color: "#3b82f6",
  metalness: 0.5,
  roughness: 0.4,
  wireframe: false,
};
const DEFAULT_AUTO_ROTATE_SPEED = 2;

function CanvasFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />
      Loading 3D viewer...
    </div>
  );
}

function isModelFile(file: File) {
  return /\.(glb|gltf)$/i.test(file.name);
}

export default function ModelViewerPage() {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const [material, setMaterial] = useState<MaterialConfig>(DEFAULT_MATERIAL);
  const [autoRotateSpeed, setAutoRotateSpeed] = useState(DEFAULT_AUTO_ROTATE_SPEED);

  // In development the controls mount immediately for a responsive tuning
  // experience. In production, mounting (and therefore fetching/running
  // leva's JS) is deferred until the browser is idle so it never competes
  // with the critical render path and doesn't count against Lighthouse TBT.
  const [controlsReady, setControlsReady] = useState(
    process.env.NODE_ENV !== "production"
  );

  useEffect(() => {
    if (controlsReady) return;
    const idle =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback
        : (cb: () => void) => window.setTimeout(cb, 200);
    const cancelIdle =
      typeof window.cancelIdleCallback === "function"
        ? window.cancelIdleCallback
        : window.clearTimeout;
    const id = idle(() => setControlsReady(true));
    return () => cancelIdle(id as number);
  }, [controlsReady]);

  const handleControlsChange = useCallback((values: MaterialControlsValues) => {
    setMaterial({
      color: values.color,
      metalness: values.metalness,
      roughness: values.roughness,
      wireframe: values.wireframe,
    });
    setAutoRotateSpeed(values.autoRotateSpeed);
  }, []);

  // Revoke the current blob URL on unmount to avoid leaking memory.
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const loadFile = useCallback((file: File) => {
    if (!isModelFile(file)) {
      setUploadError(`"${file.name}" is not a .glb or .gltf file.`);
      return;
    }
    setUploadError(null);
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setModelUrl(url);
    setFileName(file.name);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) loadFile(file);
    },
    [loadFile]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) loadFile(file);
      e.target.value = "";
    },
    [loadFile]
  );

  const handleReset = useCallback(() => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = null;
    setModelUrl(null);
    setFileName(null);
    setUploadError(null);
  }, []);

  return (
    <div className="flex flex-col gap-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold">3D Model Viewer &amp; Configurator</h1>
        <p className="text-sm text-muted-foreground">
          Drag and drop a .glb or .gltf file onto the canvas, or use the default
          model. Adjust material settings from the controls panel in the top
          right.
        </p>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative h-[70vh] w-full overflow-hidden rounded-lg border-2 border-dashed transition-colors",
          isDragging ? "border-blue-500 bg-blue-500/5" : "border-border"
        )}
      >
        <ModelViewerCanvas
          modelUrl={modelUrl}
          material={material}
          autoRotateSpeed={autoRotateSpeed}
        />

        {controlsReady && <MaterialControls onChange={handleControlsChange} />}

        {isDragging && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 text-lg font-medium text-white">
            Drop .glb / .gltf file to load
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <label className="cursor-pointer rounded-md border px-3 py-1.5 outline-none hover:bg-muted has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent has-[:focus-visible]:ring-offset-2">
          Browse file
          <input
            type="file"
            accept=".glb,.gltf"
            aria-label="Upload a .glb or .gltf 3D model file"
            className="sr-only"
            onChange={handleFileInputChange}
          />
        </label>
        {fileName && (
          <>
            <span className="text-muted-foreground">Loaded: {fileName}</span>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-md border px-3 py-1.5 outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              Reset to default
            </button>
          </>
        )}
        {uploadError && <span className="text-red-500">{uploadError}</span>}
      </div>
    </div>
  );
}
