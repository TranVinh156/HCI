type TranslationOptions = {
  isHtml?: boolean;
  isQualityScores?: boolean;
};

type TranslationResponse = {
  text: string;
};

type ModelRegistry = Record<
  string,
  {
    model: { name: string };
    lex: { name: string };
    vocab: { name: string };
  }
>;

type BergamotWorker = {
  importBergamotWorker: (
    jsFilePath: string,
    wasmFilePath: string | ArrayBuffer
  ) => Promise<void>;
  loadModel: (from: string, to: string, modelRegistry: ModelRegistry) => Promise<string>;
  translate: (
    from: string,
    to: string,
    sentences: string[],
    options: TranslationOptions[]
  ) => Promise<TranslationResponse[]>;
  terminate: () => void | Promise<void>;
};

const SOURCE_LANGUAGE = "en";
const TARGET_LANGUAGE = "ase";
const SPOKEN_TO_SIGNED_POSE_ENDPOINT =
  "https://us-central1-sign-mt.cloudfunctions.net/spoken_text_to_signed_pose";
const SPOKEN_TO_SIGNED_VIDEO_ENDPOINT =
  "https://us-central1-sign-mt.cloudfunctions.net/spoken_text_to_signed_video";

let workerInstance: BergamotWorker | null = null;
let workerPromise: Promise<BergamotWorker> | null = null;
let modelPromise: Promise<void> | null = null;
let modelLoaded = false;

function ensureBrowser() {
  if (typeof window === "undefined") {
    throw new Error("Offline translation is only available in the browser.");
  }
}

export async function initWorker(): Promise<BergamotWorker> {
  ensureBrowser();

  if (workerInstance) {
    return workerInstance;
  }

  if (!workerPromise) {
    workerPromise = (async () => {
      const module = await import("@sign-mt/browsermt");
      if (typeof module.createBergamotWorker !== "function") {
        throw new Error("BrowserMT worker factory is unavailable.");
      }

      const worker = module.createBergamotWorker("/browsermt/worker.js") as BergamotWorker;
      await worker.importBergamotWorker(
        "/browsermt/bergamot-translator-worker.js",
        "/browsermt/bergamot-translator-worker.wasm"
      );

      workerInstance = worker;
      return worker;
    })().catch((error) => {
      workerPromise = null;
      throw error;
    });
  }

  return workerPromise;
}

export function createModelRegistry(): ModelRegistry {
  return {
    enase: {
      model: {
        name: "/models/browsermt/en-ase/model.enase.intgemm.alphas.bin",
      },
      lex: {
        name: "/models/browsermt/en-ase/lex.50.50.enase.s2t.bin",
      },
      vocab: {
        name: "/models/browsermt/en-ase/vocab.enase.spm",
      },
    },
  };
}

export async function loadOfflineModel(): Promise<void> {
  if (modelLoaded) {
    return;
  }

  if (!modelPromise) {
    modelPromise = (async () => {
      const worker = await initWorker();
      await worker.loadModel(SOURCE_LANGUAGE, TARGET_LANGUAGE, createModelRegistry());
      modelLoaded = true;
    })().catch((error) => {
      modelPromise = null;
      throw error;
    });
  }

  return modelPromise;
}

export async function translateSpokenToSignWriting(text: string): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) {
    return "";
  }

  const worker = await initWorker();
  await loadOfflineModel();

  const taggedText = `$${SOURCE_LANGUAGE} $${TARGET_LANGUAGE} ${trimmed}`;
  const [result] = await worker.translate(
    SOURCE_LANGUAGE,
    TARGET_LANGUAGE,
    [taggedText],
    [{ isHtml: false }]
  );

  const raw = result?.text ?? "";
  return raw
    .replace(/\$en\s*\$ase\s*/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function getSpokenToSignedPoseUrl(text: string): string {
  const encodedText = encodeURIComponent(text);
  return `${SPOKEN_TO_SIGNED_POSE_ENDPOINT}?spoken=${SOURCE_LANGUAGE}&signed=${TARGET_LANGUAGE}&text=${encodedText}`;
}

export function getSpokenToSignedVideoUrl(text: string): string {
  const encodedText = encodeURIComponent(text);
  return `${SPOKEN_TO_SIGNED_VIDEO_ENDPOINT}?spoken=${SOURCE_LANGUAGE}&signed=${TARGET_LANGUAGE}&text=${encodedText}`;
}

export async function fetchPoseData(url: string): Promise<unknown> {
  ensureBrowser();

  try {
    const response = await fetch(url, { method: "GET" });
    if (!response.ok) {
      throw new Error(`Pose request failed with status ${response.status}.`);
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return await response.json();
    }

    return await response.arrayBuffer();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to fetch pose data.";
    throw new Error(message);
  }
}
