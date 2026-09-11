"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useControls } from "leva";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ModelViewerCanvas = dynamic(
  () => import("@/components/three/ModelViewerCanvas"),
  {
    ssr: false,
    loading: () => <CanvasFallback />,
  }
);

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

  const { color, metalness, roughness, wireframe, autoRotateSpeed } = useControls(
    "Material",
    {
      color: "#3b82f6",
      metalness: { value: 0.5, min: 0, max: 1, step: 0.01 },
      roughness: { value: 0.4, min: 0, max: 1, step: 0.01 },
      wireframe: false,
      autoRotateSpeed: { value: 2, min: 0, max: 10, step: 0.1, label: "Auto-Rotate Speed" },
    }
  );

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
          material={{ color, metalness, roughness, wireframe }}
          autoRotateSpeed={autoRotateSpeed}
        />

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
