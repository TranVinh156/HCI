"use client";

import { useEffect, useRef } from "react";

import { poseViewerService } from "~/services/pose-viewer.service";

type SkeletonPoseViewerProps = {
  src: string;
};

export function SkeletonPoseViewer({ src }: SkeletonPoseViewerProps) {
  const viewerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    poseViewerService.definePoseViewerElement().catch((error) => {
      console.error("Failed to register pose-viewer custom element", error);
    });
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const viewer = viewerRef.current as any;
      if (!viewer) return;

      if (document.visibilityState === "hidden") {
        if (typeof viewer.pause === "function") {
          viewer.pause();
        }
      } else if (document.visibilityState === "visible") {
        if (typeof viewer.play === "function") {
          viewer.play();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div className="w-full">
      <pose-viewer
        ref={viewerRef}
        src={src}
        autoplay="true"
        background="transparent"
        className="block h-full min-h-[320px] w-full"
      ></pose-viewer>
    </div>
  );
}
