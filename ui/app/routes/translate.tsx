import {
  ArrowLeftRight,
  Camera,
  Copy,
  Hand,
  Languages,
  Mic,
  Type,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { StudentShell } from "~/components/learning/student-shell";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

type TranslateMode = "handsign-to-text" | "text-to-handsign";

const sampleSigns = [
  { sign: "hello", text: "Hello" },
  { sign: "thank-you", text: "Thank you" },
  { sign: "i-love-you", text: "I love you" },
  { sign: "help", text: "Help" },
  { sign: "yes", text: "Yes" },
  { sign: "no", text: "No" },
];

const signDictionary = new Map(
  sampleSigns.map((entry) => [entry.sign, entry.text])
);

function translateTextToHands(input: string) {
  return input
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.toLowerCase().replace(/[^a-z-]/g, ""))
    .filter(Boolean);
}

function translateHandsignToText(input: string) {
  return input
    .trim()
    .split(/[\s,]+/)
    .filter(Boolean)
    .map((sign) => signDictionary.get(sign.toLowerCase()) ?? sign)
    .join(" ");
}

export default function TranslateRoute() {
  const [mode, setMode] = useState<TranslateMode>("handsign-to-text");
  const [textInput, setTextInput] = useState("Hello thank you");
  const [selectedSigns, setSelectedSigns] = useState<string[]>(["hello"]);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const isHandsignToText = mode === "handsign-to-text";
  const sourceLabel = isHandsignToText ? "Handsign" : "Text";
  const targetLabel = isHandsignToText ? "Text" : "Handsign";

  const result = useMemo(() => {
    if (isHandsignToText) {
      return translateHandsignToText(selectedSigns.join(" "));
    }

    return translateTextToHands(textInput);
  }, [isHandsignToText, selectedSigns, textInput]);

  function switchMode() {
    setMode((current) =>
      current === "handsign-to-text" ? "text-to-handsign" : "handsign-to-text"
    );
  }

  function toggleSign(sign: string) {
    setSelectedSigns((current) =>
      current.includes(sign)
        ? current.filter((item) => item !== sign)
        : [...current, sign]
    );
  }

  async function requestCameraAccess() {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      setCameraStream(stream);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to access the camera.";
      setCameraError(message);
      setCameraStream(null);
    }
  }

  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  useEffect(() => {
    if (!isHandsignToText && cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  }, [cameraStream, isHandsignToText]);

  return (
    <StudentShell>
      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-black uppercase tracking-[0.08em] text-primary">
              <Languages className="size-4" />
              Translate
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              {sourceLabel} to {targetLabel}
            </h1>
          </div>

          <Button
            type="button"
            onClick={switchMode}
            className="h-12 w-full rounded-2xl font-black sm:w-auto"
            aria-label="Switch translation direction"
          >
            <ArrowLeftRight className="size-5" />
            Switch
          </Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
          <Card className="min-h-[24rem] rounded-[2rem] border-3 border-slate-800 bg-white shadow-[4px_6px_0_#1f2937]">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-black">
                {isHandsignToText ? (
                  <Hand className="size-5 text-primary" />
                ) : (
                  <Type className="size-5 text-primary" />
                )}
                {sourceLabel}
              </CardTitle>
              <CardDescription className="font-semibold">
                {isHandsignToText
                  ? "Select signs or use camera input."
                  : "Type a phrase to convert into hand signs."}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex h-full flex-col gap-4">
              {isHandsignToText ? (
                <>

                  {!cameraStream ? (
                    <div className="flex flex-col gap-3 rounded-[1.5rem] border-2 border-slate-200 bg-white p-4">
                      <div className="flex items-center gap-3">
                        <div className="grid size-12 place-items-center rounded-[1.25rem] bg-secondary text-primary">
                          <Camera className="size-5" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">
                          Enable camera to detect hand signs
                        </p>
                        <p className="text-xs font-semibold text-slate-500">
                          We only use it for live detection during practice.
                        </p>
                      </div>
                      <Button
                        type="button"
                        onClick={requestCameraAccess}
                        className="h-10 rounded-2xl font-black"
                      >
                        Request camera access
                      </Button>
                    </div>
                  ) : null}
                  {cameraError ? (
                    <p className="text-xs font-semibold text-rose-500">
                      {cameraError}
                    </p>
                  ) : null}
                  <div className="grid min-h-44 place-items-center overflow-hidden rounded-[1.5rem] border-2 border-dashed border-primary/40 bg-secondary">
                    {cameraStream ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <Camera className="mx-auto size-12 text-primary" />
                        <p className="mt-3 text-sm font-black text-slate-700">
                          Camera preview
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sampleSigns.map((entry) => {
                      const selected = selectedSigns.includes(entry.sign);

                      return (
                        <button
                          key={entry.sign}
                          type="button"
                          onClick={() => toggleSign(entry.sign)}
                          className={`rounded-2xl border-2 px-3 py-2 text-sm font-black transition-colors ${selected
                            ? "border-primary bg-primary text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-secondary"
                            }`}
                          aria-pressed={selected}
                        >
                          {entry.sign}
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <textarea
                  value={textInput}
                  onChange={(event) => setTextInput(event.target.value)}
                  className="min-h-72 resize-none rounded-[1.5rem] border-2 border-slate-200 bg-white p-4 text-2xl font-black text-slate-900 outline-none transition-colors placeholder:text-slate-300 focus:border-primary focus:ring-3 focus:ring-primary/20"
                  placeholder="Enter text"
                />
              )}
            </CardContent>
          </Card>

          <div className="hidden place-items-center lg:grid">
            <button
              type="button"
              onClick={switchMode}
              className="grid size-14 place-items-center rounded-full border-3 border-slate-800 bg-white text-primary shadow-[3px_4px_0_#1f2937] transition-transform hover:-translate-y-0.5"
              aria-label="Switch translation direction"
            >
              <ArrowLeftRight className="size-6" />
            </button>
          </div>

          <Card className="min-h-[24rem] rounded-[2rem] border-3 border-slate-800 bg-white shadow-[4px_6px_0_#1f2937]">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-black">
                {isHandsignToText ? (
                  <Type className="size-5 text-primary" />
                ) : (
                  <Hand className="size-5 text-primary" />
                )}
                {targetLabel}
              </CardTitle>
              <CardDescription className="font-semibold">
                Translation result
              </CardDescription>
            </CardHeader>
            <CardContent className="flex min-h-72 flex-col gap-4">
              {isHandsignToText ? (
                <div className="grow rounded-[1.5rem] bg-muted p-4 text-3xl font-black leading-snug text-slate-900">
                  {typeof result === "string" && result ? result : "Text"}
                </div>
              ) : (
                <div className="grid grow content-start gap-3 rounded-[1.5rem] bg-muted p-4 sm:grid-cols-2">
                  {Array.isArray(result) && result.length > 0 ? (
                    result.map((word, index) => (
                      <div
                        key={`${word}-${index}`}
                        className="grid min-h-28 place-items-center rounded-2xl border-2 border-slate-200 bg-white p-3 text-center"
                      >
                        <Hand className="mb-2 size-8 text-primary" />
                        <span className="text-sm font-black uppercase text-slate-800">
                          {word}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-lg font-black text-slate-400">
                      Handsign
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <Button type="button" className="h-11 rounded-2xl font-black">
                  <Copy className="size-4" />
                  Copy
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 rounded-2xl font-black"
                >
                  <Mic className="size-4" />
                  Speak
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </StudentShell>
  );
}
