"use client";

import { useEffect } from "react";
import type { HTMLAttributes } from "react";
import { defineCustomElements } from "@sutton-signwriting/sgnw-components/loader";

import type { SignWritingObj } from "~/services/translation.service";
import { signWritingService } from "~/services/signwriting.service";

type FswSignProps = HTMLAttributes<HTMLElement> & {
  sign?: string;
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "fsw-sign": FswSignProps;
    }
  }
}

type SignWritingCanvasProps = {
  signs: SignWritingObj[];
};

export function SignWritingCanvas({ signs }: SignWritingCanvasProps) {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    signWritingService.loadFonts().catch((err) => {
      console.error(
        "Failed to load SignWriting fonts. Usually this means '/fonts/SuttonSignWritingOneD.ttf' is missing.",
        err
      );
    });

    if (!customElements.get("fsw-sign")) {
      defineCustomElements(window).catch((err) => {
        console.error("Failed to define custom elements", err);
      });
    }
  }, []);

  return (
    <div className="flex w-full flex-col items-center gap-6 overflow-visible py-4">
      {signs.map((sign, index) => (
        <fsw-sign key={`${sign.fsw}-${index}`} sign={sign.fsw}></fsw-sign>
      ))}
    </div>
  );
}
