type TranslationOptions = {
  isHtml?: boolean;
  isQualityScores?: boolean;
};

type TranslationResponse = {
  text: string;
};

export interface SignWritingObj {
  fsw: string;
}

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
const MAX_SEGMENT_WORDS = 14;

const PHRASE_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bcan't\b/gi, "cannot"],
  [/\bwon't\b/gi, "will not"],
  [/\bdon't\b/gi, "do not"],
  [/\bdoesn't\b/gi, "does not"],
  [/\bdidn't\b/gi, "did not"],
  [/\bisn't\b/gi, "is not"],
  [/\baren't\b/gi, "are not"],
  [/\bwasn't\b/gi, "was not"],
  [/\bweren't\b/gi, "were not"],
  [/\bit's\b/gi, "it is"],
  [/\bI'm\b/gi, "I am"],
  [/\byou're\b/gi, "you are"],
  [/\bwe're\b/gi, "we are"],
  [/\bthey're\b/gi, "they are"],
  [/\bgonna\b/gi, "going to"],
  [/\bwanna\b/gi, "want to"],
  [/\bgotta\b/gi, "have to"],
  [/\blet's\b/gi, "let us"],
];

function ensureBrowser() {
  if (typeof window === "undefined") {
    throw new Error("Offline translation is only available in the browser.");
  }
}

export function preProcessSpokenText(text: string): string {
  let normalized = text.normalize("NFKC");
  normalized = normalized
    .replace(/[“”]/g, '"')
    .replace(/[’]/g, "'")
    .replace(/\r?\n|\r/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  for (const [pattern, replacement] of PHRASE_REPLACEMENTS) {
    normalized = normalized.replace(pattern, replacement);
  }

  return normalized;
}

export function segmentSpokenText(text: string): string[] {
  if (!text) return [];

  const sentenceMarkers = text
    .replace(/([.!?]+)\s+/g, "$1|")
    .replace(/([;:]+)\s+/g, "$1|");

  const roughSegments = sentenceMarkers
    .split("|")
    .map((segment) => segment.trim())
    .filter(Boolean);

  const segments: string[] = [];
  for (const segment of roughSegments) {
    const words = segment.split(/\s+/);
    if (words.length <= MAX_SEGMENT_WORDS) {
      segments.push(segment);
      continue;
    }

    for (let i = 0; i < words.length; i += MAX_SEGMENT_WORDS) {
      segments.push(words.slice(i, i + MAX_SEGMENT_WORDS).join(" "));
    }
  }

  return segments;
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
      try {
        const worker = await initWorker();
        await worker.loadModel(
          SOURCE_LANGUAGE,
          TARGET_LANGUAGE,
          createModelRegistry()
        );
        modelLoaded = true;
      } catch (error) {
        console.error("Offline model load error:", error);
        throw error;
      }
    })().catch((error) => {
      modelPromise = null;
      throw error;
    });
  }

  return modelPromise;
}

export async function translateSpokenToSignWriting(text: string): Promise<string> {
  const cleanText = preProcessSpokenText(text);
  if (!cleanText) {
    return "";
  }

  try {
    const worker = await initWorker();
    await loadOfflineModel();
    const segments = segmentSpokenText(cleanText);
    if (segments.length === 0) {
      return "";
    }

    const payload = segments.map(
      (segment) => `$${SOURCE_LANGUAGE} $${TARGET_LANGUAGE} ${segment}`
    );
    console.log("Payload sent to Worker:", payload);

    const results = await worker.translate(
      SOURCE_LANGUAGE,
      TARGET_LANGUAGE,
      payload,
      payload.map(() => ({ isHtml: false }))
    );

    const rawChunks = results.map((result) =>
      typeof result === "string" ? result : (result?.text ?? "")
    );

    return rawChunks.join(" ").trim();
  } catch (error) {
    console.error("Translation Worker Error:", error);
    return "";
  }
}

export function postProcessSignWriting(translationText: string): string {
  return translationText
    .replace(/\$[^\s]+/g, " ")
    .replace(/(\d)M/g, "$1 M")
    .replace(/\s+/g, " ")
    .trim();
}

export function splitSignWritingTokens(cleanedText: string): SignWritingObj[] {
  return cleanedText
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 0 && /^M\d+/i.test(token))
    .map((fsw) => ({ fsw }));
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

export class TranslationService {
  getSpokenToSignedPoseUrl(
    text: string,
    spokenLanguage: string,
    signedLanguage: string
  ): string {
    const encodedText = encodeURIComponent(text);
    return `${SPOKEN_TO_SIGNED_POSE_ENDPOINT}?spoken=${encodeURIComponent(
      spokenLanguage
    )}&signed=${encodeURIComponent(signedLanguage)}&text=${encodedText}`;
  }
}
