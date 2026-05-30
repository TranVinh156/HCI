import {
  ArrowLeftRight,
  Camera,
  Copy,
  Eraser,
  Hand,
  Languages,
  Loader2,
  Mic,
  ScanLine,
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
import { useSignKeypoints, useSignToText } from "~/hooks/use-translate";
import {
  captureClip,
  ensureLandmarkers,
  NUM_FRAMES,
} from "~/services/keypoint-extractor";
import {
  fetchPoseData,
  getSpokenToSignedPoseUrl,
  getSpokenToSignedVideoUrl,
  loadOfflineModel,
  postProcessSignWriting,
  splitSignWritingTokens,
  type SignWritingObj,
  translateSpokenToSignWriting,
} from "~/services/translation.service";
import { SkeletonPoseViewer } from "~/components/SkeletonPoseViewer";

type TranslateMode = "handsign-to-text" | "text-to-handsign";
type SignKind = "alphabet" | "word";

type Prediction = {
  label: string;
  confidence: number;
  kind: SignKind;
};

const sampleSigns = [
  { sign: "hello", text: "Hello" },
  { sign: "thank-you", text: "Thank you" },
  { sign: "i-love-you", text: "I love you" },
  { sign: "help", text: "Help" },
  { sign: "yes", text: "Yes" },
  { sign: "no", text: "No" },
];

function translateTextToHands(input: string) {
  return input
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.toLowerCase().replace(/[^a-z-]/g, ""))
    .filter(Boolean);
}

export default function TranslateRoute() {
  const [mode, setMode] = useState<TranslateMode>("handsign-to-text");
  const [kind, setKind] = useState<SignKind>("alphabet");
  const [textInput, setTextInput] = useState("Hello thank you");
  const [signWritingText, setSignWritingText] = useState("");
  const [signWritingSigns, setSignWritingSigns] = useState<SignWritingObj[]>([]);
  const [translateError, setTranslateError] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [poseUrl, setPoseUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isNetworkLoading, setIsNetworkLoading] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [autoCapture, setAutoCapture] = useState(false);
  const [stubWarning, setStubWarning] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [clipProgress, setClipProgress] = useState(0);
  const signToTextMutation = useSignToText();
  const signKeypointsMutation = useSignKeypoints();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const isHandsignToText = mode === "handsign-to-text";
  const sourceLabel = isHandsignToText ? "Handsign" : "Text";
  const targetLabel = isHandsignToText ? "Text" : "Handsign";

  const recognizedText = useMemo(() => {
    if (predictions.length === 0) return "";
    if (kind === "alphabet") {
      return predictions.map((p) => p.label).join("");
    }
    return predictions
      .map((p) => p.label.replace(/-/g, " "))
      .join(" ");
  }, [predictions, kind]);

  const lastPrediction = predictions[predictions.length - 1];

  const textToSignsResult = useMemo(
    () => (isHandsignToText ? [] : translateTextToHands(textInput)),
    [isHandsignToText, textInput]
  );

  function switchMode() {
    setMode((current) =>
      current === "handsign-to-text" ? "text-to-handsign" : "handsign-to-text"
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

  async function captureFrame() {
    if (!videoRef.current || !canvasRef.current || isCapturing) return;
    setIsCapturing(true);
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);

      const result = await signToTextMutation.mutateAsync({
        image: dataUrl,
        kind,
      });
      setStubWarning(!result.model_loaded);

      if (result.confidence >= 0.5 || !result.model_loaded) {
        setPredictions((prev) => [
          ...prev,
          { label: result.label, confidence: result.confidence, kind },
        ]);
      }
    } catch (error) {
      console.error(error);
      setCameraError(
        error instanceof Error ? error.message : "Recognition failed"
      );
    } finally {
      setIsCapturing(false);
    }
  }

  async function captureWordClip() {
    if (!videoRef.current || isRecording) return;
    setIsRecording(true);
    setClipProgress(0);
    try {
      await ensureLandmarkers();
      const frames = await captureClip(videoRef.current, {
        intervalMs: 66,
        onProgress: setClipProgress,
      });
      const result = await signKeypointsMutation.mutateAsync(frames);
      setStubWarning(!result.model_loaded);

      if (result.confidence >= 0.3 || !result.model_loaded) {
        setPredictions((prev) => [
          ...prev,
          { label: result.label, confidence: result.confidence, kind: "word" },
        ]);
      }
    } catch (error) {
      console.error(error);
      setCameraError(
        error instanceof Error ? error.message : "Recognition failed"
      );
    } finally {
      setIsRecording(false);
      setClipProgress(0);
    }
  }

  function clearPredictions() {
    setPredictions([]);
    setStubWarning(false);
  }

  async function copyText() {
    try {
      const textToCopy = isHandsignToText
        ? recognizedText
        : signWritingText || textInput;
      await navigator.clipboard.writeText(textToCopy);
    } catch {
      /* ignore */
    }
  }

  async function handleTranslate() {
    const trimmed = textInput.trim();
    if (!trimmed) {
      setSignWritingText("");
      setSignWritingSigns([]);
      setPoseUrl("");
      setVideoUrl("");
      setNetworkError(null);
      setIsNetworkLoading(false);
      return;
    }

    setIsTranslating(true);
    setTranslateError(null);
    setNetworkError(null);

    try {
      const result = await translateSpokenToSignWriting(trimmed);
      console.log("Raw translation result:", result);
      const cleaned = postProcessSignWriting(result);
      console.log("Cleaned FSW string:", cleaned);
      setSignWritingText(cleaned);

      const tokens = splitSignWritingTokens(cleaned);
      console.log("Parsed FSW tokens:", tokens);
      setSignWritingSigns(tokens);

      setIsNetworkLoading(true);
      const poseLink = getSpokenToSignedPoseUrl(trimmed);
      const videoLink = getSpokenToSignedVideoUrl(trimmed);
      setPoseUrl(poseLink);
      setVideoUrl(videoLink);

      try {
        await fetchPoseData(poseLink);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to fetch pose data.";
        setNetworkError(message);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to translate offline.";
      setTranslateError(message);
      setSignWritingSigns([]);
      setPoseUrl("");
      setVideoUrl("");
    } finally {
      setIsTranslating(false);
      setIsNetworkLoading(false);
    }
  }

  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  useEffect(() => {
    if (isHandsignToText) {
      setTranslateError(null);
      setIsTranslating(false);
      setSignWritingText("");
      setSignWritingSigns([]);
      setPoseUrl("");
      setVideoUrl("");
      setNetworkError(null);
      setIsNetworkLoading(false);
      return;
    }

    let isActive = true;
    loadOfflineModel().catch((error) => {
      if (!isActive) return;
      const message =
        error instanceof Error
          ? error.message
          : "Unable to load offline model.";
      setTranslateError(message);
    });

    return () => {
      isActive = false;
    };
  }, [isHandsignToText]);

  useEffect(() => {
    if (!isHandsignToText && cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  }, [cameraStream, isHandsignToText]);

  useEffect(() => {
    if (!autoCapture || !cameraStream || kind !== "alphabet") return;
    const timer = setInterval(() => {
      captureFrame();
    }, 1500);
    return () => clearInterval(timer);
  }, [autoCapture, cameraStream, kind]);

  return (
    <StudentShell>
      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-black uppercase tracking-[0.08em] text-primary">
              <Languages className="size-4" />
              Translate (ASL)
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

        {isHandsignToText ? (
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border-2 border-slate-200 bg-white p-3">
            <span className="text-sm font-black text-slate-700">Mode:</span>
            <Button
              type="button"
              onClick={() => {
                setKind("alphabet");
                clearPredictions();
              }}
              variant={kind === "alphabet" ? "default" : "outline"}
              className="h-9 rounded-xl font-black"
            >
              Alphabet (A-Z)
            </Button>
            <Button
              type="button"
              onClick={() => {
                setKind("word");
                clearPredictions();
              }}
              variant={kind === "word" ? "default" : "outline"}
              className="h-9 rounded-xl font-black"
            >
              Vocabulary
            </Button>
          </div>
        ) : null}

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
                  ? "Bật camera, đưa tay vào khung, bấm Capture để nhận diện."
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
                        <div>
                          <p className="text-sm font-black text-slate-900">
                            Enable camera to detect hand signs
                          </p>
                          <p className="text-xs font-semibold text-slate-500">
                            Camera chỉ dùng để nhận diện cục bộ.
                          </p>
                        </div>
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
                  <canvas ref={canvasRef} className="hidden" />

                  {cameraStream ? (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        onClick={kind === "word" ? captureWordClip : captureFrame}
                        disabled={isCapturing || isRecording}
                        className="h-11 rounded-2xl font-black"
                      >
                        {isCapturing || isRecording ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <ScanLine className="size-4" />
                        )}
                        {isRecording
                          ? `Recording ${clipProgress}/${NUM_FRAMES}`
                          : kind === "word"
                          ? "Record sign (~2s)"
                          : "Capture sign"}
                      </Button>
                      {kind === "alphabet" ? (
                        <Button
                          type="button"
                          onClick={() => setAutoCapture((v) => !v)}
                          variant={autoCapture ? "default" : "outline"}
                          className="h-11 rounded-2xl font-black"
                        >
                          {autoCapture ? "Stop auto" : "Auto capture"}
                        </Button>
                      ) : null}
                      <Button
                        type="button"
                        onClick={clearPredictions}
                        variant="outline"
                        className="h-11 rounded-2xl font-black"
                      >
                        <Eraser className="size-4" />
                        Clear
                      </Button>
                    </div>
                  ) : null}

                  {lastPrediction ? (
                    <div className="rounded-2xl border-2 border-primary/30 bg-secondary/40 p-3 text-sm font-bold text-slate-800">
                      Vừa nhận diện:{" "}
                      <span className="text-primary">
                        {lastPrediction.label}
                      </span>{" "}
                      ({Math.round(lastPrediction.confidence * 100)}%)
                    </div>
                  ) : null}

                  {stubWarning ? (
                    <p className="rounded-xl bg-amber-50 p-2 text-xs font-bold text-amber-700">
                      ⚠ Model chưa được train — backend đang trả về kết quả mẫu.
                      Xem `backend/ml/README.md` để train model.
                    </p>
                  ) : null}
                </>
              ) : (
                <>
                  <textarea
                    value={textInput}
                    onChange={(event) => setTextInput(event.target.value)}
                    className="min-h-72 resize-none rounded-[1.5rem] border-2 border-slate-200 bg-white p-4 text-2xl font-black text-slate-900 outline-none transition-colors placeholder:text-slate-300 focus:border-primary focus:ring-3 focus:ring-primary/20"
                    placeholder="Enter text"
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      onClick={handleTranslate}
                      disabled={isTranslating || !textInput.trim()}
                      className="h-11 rounded-2xl font-black"
                    >
                      {isTranslating ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Languages className="size-4" />
                      )}
                      Translate offline
                    </Button>
                  </div>
                </>
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
                  {recognizedText || (
                    <span className="text-slate-400">
                      Capture a sign to see text…
                    </span>
                  )}
                </div>
              ) : (
                <>
                  {isNetworkLoading ? (
                    <p className="text-xs font-semibold text-slate-600">
                      Fetching Pose and Video assets from Cloud...
                    </p>
                  ) : null}
                  {networkError ? (
                    <p className="text-xs font-semibold text-rose-500">
                      {networkError}
                    </p>
                  ) : null}
                  {poseUrl ? (
                    <div className="w-full rounded-[1.5rem] border-2 border-slate-900 bg-slate-950 p-3">
                      <SkeletonPoseViewer src={poseUrl} />
                    </div>
                  ) : null}
                  {videoUrl ? (
                    <video
                      src={videoUrl}
                      controls
                      width={320}
                      className="rounded-xl border-2 border-slate-200 bg-white"
                    />
                  ) : null}
                  {translateError ? (
                    <p className="text-xs font-semibold text-rose-500">
                      {translateError}
                    </p>
                  ) : null}
                </>
              )}

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  onClick={copyText}
                  className="h-11 rounded-2xl font-black"
                >
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
