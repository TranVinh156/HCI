import {
  ArrowLeftRight,
  Camera,
  Copy,
  Download,
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
import { LoadingSpinner } from "~/components/ui/loading-spinner";
// import { useSignToText } from "~/hooks/use-translate";
import {
  useSignKeypoints,
  useSignLandmark,
  useSignToText,
} from "~/hooks/use-translate";
import {
  captureClip,
  captureLandmarkClip,
  captureStaticLandmark,
  ensureLandmarkers,
  NUM_FRAMES,
  NUM_FRAMES_LANDMARK,
} from "~/services/keypoint-extractor";
import { detectAndCropHand, hasHandInFrame } from "~/services/hand-cropper";
import { formatLabel } from "~/services/label-formatter";
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
type SignKind = "alphabet" | "word" | "landmark";
type LandmarkCaptureMode = "static" | "dynamic";

type Prediction = {
  label: string;
  confidence: number;
  kind: SignKind;
  topK?: { label: string; confidence: number }[];
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
  const [landmarkCaptureMode, setLandmarkCaptureMode] =
    useState<LandmarkCaptureMode>("static");
  const signToTextMutation = useSignToText();
  const signKeypointsMutation = useSignKeypoints();
  const signLandmarkMutation = useSignLandmark();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const isHandsignToText = mode === "handsign-to-text";
  const sourceLabel = isHandsignToText ? "Handsign" : "Text";
  const targetLabel = isHandsignToText ? "Text" : "Handsign";

  const recognizedText = useMemo(() => {
    if (predictions.length === 0) return "";
    if (kind === "alphabet") {
      return predictions.map((p) => p.label).join("");
    }
    if (kind === "landmark") {
      // Letters/digits glue together, multi-char glosses get spaces.
      return predictions
        .map((p, i) => {
          const formatted = formatLabel(p.label, "landmark");
          if (i === 0) return formatted;
          const prev = predictions[i - 1];
          const prevIsChar = prev.label.length <= 1;
          const curIsChar = p.label.length <= 1;
          return prevIsChar && curIsChar ? formatted : ` ${formatted}`;
        })
        .join("");
    }
    return predictions.map((p) => formatLabel(p.label, "word")).join(" ");
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
    if (!videoRef.current || isCapturing) return;
    if (kind !== "alphabet" && kind !== "word") return;
    const legacyKind = kind;
    setIsCapturing(true);
    try {
      const video = videoRef.current;

      const crop = await detectAndCropHand(video);
      if (!crop) {
        setCameraError("No hand detected. Please show your hand in frame.");
        return;
      }
      setCameraError(null);

      const result = await signToTextMutation.mutateAsync({
        image: crop.dataUrl,
        kind: legacyKind,
      });
      setStubWarning(!result.model_loaded);

      if (result.confidence >= 0.5 || !result.model_loaded) {
        setPredictions((prev) => [
          ...prev,
          { label: result.label, confidence: result.confidence, kind: legacyKind },
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

  async function captureLandmarkStatic() {
    if (!videoRef.current || isCapturing) return;
    setIsCapturing(true);
    try {
      const video = videoRef.current;
      const handVisible = await hasHandInFrame(video);
      if (!handVisible) {
        setCameraError("No hand detected. Please show your hand in frame.");
        return;
      }
      setCameraError(null);
      await ensureLandmarkers();
      const frames = await captureStaticLandmark(video);
      const result = await signLandmarkMutation.mutateAsync(frames);
      setStubWarning(!result.model_loaded);

      if (result.confidence >= 0.5 || !result.model_loaded) {
        const topK = (result.top_k ?? [])
          .slice(1)
          .map((alt) => ({ label: alt.label, confidence: alt.confidence }));
        setPredictions((prev) => [
          ...prev,
          {
            label: result.label,
            confidence: result.confidence,
            kind: "landmark",
            topK,
          },
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

  async function captureLandmarkDynamic() {
    if (!videoRef.current || isRecording) return;
    const video = videoRef.current;
    try {
      const handVisible = await hasHandInFrame(video);
      if (!handVisible) {
        setCameraError(
          "No hand detected. Please show your hand before recording."
        );
        return;
      }
    } catch (error) {
      console.warn("Hand pre-check failed", error);
    }
    setCameraError(null);
    setIsRecording(true);
    setClipProgress(0);
    try {
      await ensureLandmarkers();
      const frames = await captureLandmarkClip(video, {
        intervalMs: 100,
        onProgress: setClipProgress,
      });
      const result = await signLandmarkMutation.mutateAsync(frames);
      setStubWarning(!result.model_loaded);

      if (result.confidence >= 0.5 || !result.model_loaded) {
        const topK = (result.top_k ?? [])
          .slice(1)
          .map((alt) => ({ label: alt.label, confidence: alt.confidence }));
        setPredictions((prev) => [
          ...prev,
          {
            label: result.label,
            confidence: result.confidence,
            kind: "landmark",
            topK,
          },
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

  async function captureWordClip() {
    if (!videoRef.current || isRecording) return;
    const video = videoRef.current;
    try {
      const handVisible = await hasHandInFrame(video);
      if (!handVisible) {
        setCameraError(
          "No hand detected. Please show your hand before recording."
        );
        return;
      }
    } catch (error) {
      console.warn("Hand pre-check failed", error);
    }
    setCameraError(null);
    setIsRecording(true);
    setClipProgress(0);
    try {
      await ensureLandmarkers();
      const frames = await captureClip(video, {
        intervalMs: 66,
        onProgress: setClipProgress,
      });
      const result = await signKeypointsMutation.mutateAsync(frames);
      setStubWarning(!result.model_loaded);

      if (result.confidence >= 0.3 || !result.model_loaded) {
        const topK = (result.top_k ?? [])
          .slice(1)
          .map((alt) => ({ label: alt.label, confidence: alt.confidence }));
        setPredictions((prev) => [
          ...prev,
          {
            label: result.label,
            confidence: result.confidence,
            kind: "word",
            topK,
          },
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
    if (!cameraStream) return;
    ensureLandmarkers().catch((error) => {
      console.warn("MediaPipe landmarkers failed to preload", error);
    });
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
    if (!autoCapture || !cameraStream) return;
    if (kind === "alphabet") {
      const timer = setInterval(() => {
        captureFrame();
      }, 1500);
      return () => clearInterval(timer);
    }
    if (kind === "landmark" && landmarkCaptureMode === "static") {
      const timer = setInterval(() => {
        captureLandmarkStatic();
      }, 1500);
      return () => clearInterval(timer);
    }
  }, [autoCapture, cameraStream, kind, landmarkCaptureMode]);

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
            <Button
              type="button"
              onClick={() => {
                setKind("landmark");
                clearPredictions();
              }}
              variant={kind === "landmark" ? "default" : "outline"}
              className="h-9 rounded-xl font-black"
            >
              Landmark (A-Z, 0-9, words)
            </Button>
            {kind === "landmark" ? (
              <div className="ml-2 flex items-center gap-1 border-l border-slate-200 pl-2">
                <span className="text-xs font-black uppercase text-slate-500">
                  Capture:
                </span>
                <Button
                  type="button"
                  onClick={() => {
                    setLandmarkCaptureMode("static");
                    clearPredictions();
                  }}
                  variant={
                    landmarkCaptureMode === "static" ? "default" : "outline"
                  }
                  className="h-8 rounded-lg px-2 text-xs font-black"
                >
                  Static
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setLandmarkCaptureMode("dynamic");
                    clearPredictions();
                  }}
                  variant={
                    landmarkCaptureMode === "dynamic" ? "default" : "outline"
                  }
                  className="h-8 rounded-lg px-2 text-xs font-black"
                >
                  Dynamic
                </Button>
              </div>
            ) : null}
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
                {!isHandsignToText
                  ? "Type a phrase to convert into hand signs."
                  : kind === "word"
                  ? "Bật camera, đưa tay vào khung, bấm Record và thực hiện cử chỉ trong ~2 giây."
                  : kind === "landmark" && landmarkCaptureMode === "dynamic"
                  ? "Bật camera, đưa tay vào khung, bấm Record và thực hiện cử chỉ trong ~2 giây (mô hình mới — words)."
                  : kind === "landmark"
                  ? "Bật camera, đưa tay vào khung, bấm Capture để nhận diện ký tự / số (mô hình mới)."
                  : "Bật camera, đưa tay vào khung, bấm Capture để nhận diện."}
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

                  {cameraStream ? (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        onClick={() => {
                          if (kind === "word") return captureWordClip();
                          if (kind === "landmark") {
                            return landmarkCaptureMode === "dynamic"
                              ? captureLandmarkDynamic()
                              : captureLandmarkStatic();
                          }
                          return captureFrame();
                        }}
                        disabled={isCapturing || isRecording}
                        className="h-11 rounded-2xl font-black"
                      >
                        {isCapturing || isRecording ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <ScanLine className="size-4" />
                        )}
                        {isRecording
                          ? `Recording ${clipProgress}/${
                              kind === "landmark"
                                ? NUM_FRAMES_LANDMARK
                                : NUM_FRAMES
                            }`
                          : kind === "word"
                          ? "Record sign (~2s)"
                          : kind === "landmark" &&
                            landmarkCaptureMode === "dynamic"
                          ? "Record sign (~2s)"
                          : "Capture sign"}
                      </Button>
                      {kind === "alphabet" ||
                      (kind === "landmark" &&
                        landmarkCaptureMode === "static") ? (
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

                  {isRecording ? (
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{
                          width: `${Math.min(
                            100,
                            (clipProgress /
                              (kind === "landmark"
                                ? NUM_FRAMES_LANDMARK
                                : NUM_FRAMES)) *
                              100
                          )}%`,
                        }}
                      />
                    </div>
                  ) : null}

                  {lastPrediction ? (
                    <div className="rounded-2xl border-2 border-primary/30 bg-secondary/40 p-3 text-sm font-bold text-slate-800">
                      <div>
                        Vừa nhận diện:{" "}
                        <span className="text-primary">
                          {formatLabel(lastPrediction.label, lastPrediction.kind)}
                        </span>{" "}
                        ({Math.round(lastPrediction.confidence * 100)}%)
                        {lastPrediction.confidence < 0.5 ? (
                          <span className="ml-2 rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                            low confidence
                          </span>
                        ) : null}
                      </div>
                      {lastPrediction.topK && lastPrediction.topK.length > 0 ? (
                        <details className="mt-2 text-xs font-semibold">
                          <summary className="cursor-pointer text-slate-600">
                            Other guesses
                          </summary>
                          <ul className="mt-1 space-y-0.5 pl-3">
                            {lastPrediction.topK.map((alt, i) => (
                              <li key={i}>
                                {formatLabel(alt.label, lastPrediction.kind)} —{" "}
                                {Math.round(alt.confidence * 100)}%
                              </li>
                            ))}
                          </ul>
                        </details>
                      ) : null}
                    </div>
                  ) : null}

                  {(kind === "word" || kind === "landmark") &&
                  predictions.length > 1 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {predictions.map((p, i) => (
                        <span
                          key={i}
                          className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700"
                          title={`${Math.round(p.confidence * 100)}%`}
                        >
                          {formatLabel(p.label, p.kind)}
                        </span>
                      ))}
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
                      Translate
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
                    <LoadingSpinner
                      label="Fetching pose and video assets"
                      className="justify-start py-1"
                      spinnerClassName="size-4"
                      showLabel={false}
                    />
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
                  {/* {videoUrl ? (
                    <video
                      src={videoUrl}
                      controls
                      width={320}
                      className="rounded-xl border-2 border-slate-200 bg-white"
                    />
                  ) : null} */}
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
                  <a className="flex gap-2 items-center" href={videoUrl}>
                    <Download className="size-5" />
                    Download
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </StudentShell>
  );
}
