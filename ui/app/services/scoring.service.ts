type Landmark3D = {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
  presence?: number;
} | null;

type HolisticFrame = {
  pose: Landmark3D[];
  leftHand: Landmark3D[];
  rightHand: Landmark3D[];
};

type Sequence = HolisticFrame[];

export type HandRequirement = "any" | "left" | "right" | "both" | "none";

export type SignDifficultyLevel = "easy" | "medium" | "hard";

export type SignScoringVersion = "v1" | "v2";

export type DominantHand = "left" | "right" | null;

export type MirrorModeUsed =
  | "original"
  | "flipped"
  | "mirror-disabled"
  | "exact-handedness";

export type SignScoringMetadata = {
  scoringVersion: SignScoringVersion;
  requiredHands: HandRequirement;
  allowMirror: boolean;
  requiresExactHandedness: boolean;
  dominantHand: DominantHand;
  minPassingScore: number;
  handShapeWeight: number;
  positionWeight: number;
  motionWeight: number;
  orientationWeight: number;
  timingWeight: number;
  startPoseWeight: number;
  endPoseWeight: number;
  bodyArmPostureWeight: number;
  requiredHandMissingScoreCap: number;
  unrelatedMotionScoreCap: number;
  wrongHandShapeScoreCap: number;
  handShapeCriticalThreshold: number;
  motionSimilarityCriticalThreshold: number;
  expectedDuration: number | null;
  difficultyLevel: SignDifficultyLevel;
  minWindowSize: number;
  maxWindowSize: number;
  windowRatio: number;
  strictTimingMode: boolean;
};

export type SignScoringMetadataInput = Partial<SignScoringMetadata>;

export type SignScoringRuntimeOptions = {
  webcamPreviewMirrored: boolean;
  landmarkCoordinatesMirrored: boolean;
};

export type HandShapeFeatures = {
  values: number[];
};

export type HandShapeScoreBreakdown = {
  leftHandShapeScore: number | null;
  rightHandShapeScore: number | null;
  overallHandShapeScore: number | null;
};

export type HandOrientationFeatures = {
  values: number[];
};

export type HandOrientationScoreBreakdown = {
  leftHandOrientationScore: number | null;
  rightHandOrientationScore: number | null;
  overallOrientationScore: number | null;
};

export type DtwAlignmentDiagnostics = {
  averageCost: number;
  baseScore: number;
  finalScore: number;
  alignmentLength: number;
  windowSizeUsed: number;
  timingPenalty: number;
  sequenceLengthRatio: number;
  timingSimilarityScore: number;
  studentFrames: number;
  teacherFrames: number;
  handScore: number;
  armScore: number;
  torsoScore: number;
  angleScore: number;
  missingLandmarkRatio: number;
};

export type PhaseScoreBreakdown = {
  startPoseScore: number | null;
  motionScore: number | null;
  endPoseScore: number | null;
  phaseWeights: {
    startPoseWeight: number;
    motionWeight: number;
    endPoseWeight: number;
  };
  feedback: string[];
};

export type ScoringComponentScores = {
  handShape: number | null;
  handPosition: number | null;
  motionPath: number | null;
  handOrientation: number | null;
  timing: number | null;
  startPose: number | null;
  endPose: number | null;
  bodyArmPosture: number | null;
};

export type ScoringComponentWeights = {
  handShape: number;
  handPosition: number;
  motionPath: number;
  handOrientation: number;
  timing: number;
  startPose: number;
  endPose: number;
  bodyArmPosture: number;
};

export type ScoreCapDiagnostics = {
  requiredHandMissing: boolean;
  requiredHandCap: number | null;
  trackingQualityBlocked: boolean;
  unrelatedMotion: boolean;
  unrelatedMotionCap: number | null;
  handShapeCriticalMiss: boolean;
  handShapeCap: number | null;
  appliedCaps: string[];
};

export type FinalScoreAggregation = {
  rawComponentScores: ScoringComponentScores;
  componentWeights: ScoringComponentWeights;
  weightedScoreBeforeCaps: number;
  finalScore: number;
  caps: ScoreCapDiagnostics;
};

export type FeatureExtractionDiagnostics = {
  handPositionFrames: number;
  handShapeFrames: {
    left: number;
    right: number;
  };
  handOrientationFrames: {
    left: number;
    right: number;
  };
  jointAngleFrameCount: number;
  motionVolume: number;
  averageVelocity: number;
};

export type StudentQualityCheckConfig = {
  handRequirement: HandRequirement;
  allowMirroredHands: boolean;
  minValidFrames: number;
  minValidFrameRatio: number;
  minPoseLandmarks: number;
  minHandLandmarks: number;
  minAverageConfidence: number;
  frameMargin: number;
  minInsideHandLandmarkRatio: number;
  defaultConfidence: number;
  debugLogs: boolean;
};

export type StudentQualityIssue =
  | "no_pose"
  | "missing_left_hand"
  | "missing_right_hand"
  | "missing_required_hand"
  | "hands_out_of_frame"
  | "low_confidence"
  | "not_enough_valid_frames";

export type StudentQualityCheckResult = {
  ok: boolean;
  issue: StudentQualityIssue | null;
  message: string | null;
  metrics: {
    totalFrames: number;
    validFrames: number;
    validFrameRatio: number;
    poseDetected: boolean;
    leftHandDetected: boolean;
    rightHandDetected: boolean;
    poseFrameRatio: number;
    leftHandFrameRatio: number;
    rightHandFrameRatio: number;
    leftHandValidFrameRatio: number;
    rightHandValidFrameRatio: number;
    bothHandsFrameRatio: number;
    averageConfidence: number;
    averagePoseConfidence: number;
    averageLeftHandConfidence: number;
    averageRightHandConfidence: number;
    poseConfidenceSource: string;
    leftHandConfidenceSource: string;
    rightHandConfidenceSource: string;
    leftHandInsideRatio: number;
    rightHandInsideRatio: number;
    handsInsideFrameRatio: number;
    finalFailureReason: StudentQualityIssue | null;
  };
};

export type GestureSegmentationFailureReason =
  | "empty_sequence"
  | "no_clear_movement"
  | "segment_too_short";

export type GestureSegmentationConfig = {
  motionStartThreshold: number;
  motionEndThreshold: number;
  startConsecutiveFrames: number;
  endConsecutiveFrames: number;
  paddingFrames: number;
  minSegmentFrames: number;
};

export type GestureSegmentationMetadata = {
  startFrame: number;
  endFrame: number;
  duration: number;
  segmentationConfidence: number;
  reason: GestureSegmentationFailureReason | null;
  usedFallback: boolean;
  motionFrameCount: number;
  peakMotion: number;
  averageMotion: number;
};

export type GestureSegmentationResult = {
  ok: boolean;
  sequence: Sequence;
  metadata: GestureSegmentationMetadata;
};

export type SignScoringDiagnostics = {
  scoringVersion: SignScoringVersion;
  trackingQuality: StudentQualityCheckResult | null;
  segmentationResult: {
    user: GestureSegmentationMetadata | null;
    reference: GestureSegmentationMetadata | null;
  };
  dtwDiagnostics: DtwAlignmentDiagnostics | null;
  featureExtraction: FeatureExtractionDiagnostics | null;
  componentScores: ScoringComponentScores | null;
  finalScore: number | null;
  feedbackMessages: string[];
  fallbackUsed: boolean;
  fallbackReason: string | null;
};

export type SegmentedSignScoreResult = {
  ok: boolean;
  scoringVersion: SignScoringVersion;
  score: number | null;
  landmarkScore: number | null;
  handShapeScore: number | null;
  orientationScore: number | null;
  timingSimilarityScore: number | null;
  alignmentDiagnostics: DtwAlignmentDiagnostics | null;
  phaseScores: PhaseScoreBreakdown | null;
  componentScores: ScoringComponentScores | null;
  finalScoreAggregation: FinalScoreAggregation | null;
  feedback: string[];
  diagnostics: SignScoringDiagnostics;
  trackingQuality: StudentQualityCheckResult | null;
  message: string | null;
  minPassingScore: number;
  passed: boolean;
  mirrorUsed: boolean;
  mirrorDiagnostics: {
    mirrorModeUsed: MirrorModeUsed;
    originalScore: number;
    flippedScore: number;
    selectedScore: number;
    handednessPenalty: number;
    webcamPreviewMirrored: boolean;
    landmarkCoordinatesMirrored: boolean;
  };
  handShapeScores: HandShapeScoreBreakdown;
  orientationScores: HandOrientationScoreBreakdown;
  scoringMetadata: SignScoringMetadata;
  userSegmentation: GestureSegmentationMetadata;
  referenceSegmentation: GestureSegmentationMetadata;
};

type NormalizedFrame = {
  pose: number[];
  leftHand: number[];
  rightHand: number[];
  angles: number[];
};

type NormalizedSequence = NormalizedFrame[];

const POSE_LEFT_SHOULDER_INDEX = 0;
const POSE_RIGHT_SHOULDER_INDEX = 1;
const POSE_LEFT_ELBOW_INDEX = 2;
const POSE_RIGHT_ELBOW_INDEX = 3;
const POSE_LEFT_WRIST_INDEX = 4;
const POSE_RIGHT_WRIST_INDEX = 5;

const HAND_WRIST_INDEX = 0;
const HAND_THUMB_CMC = 1;
const HAND_THUMB_MCP = 2;
const HAND_THUMB_IP = 3;
const HAND_THUMB_TIP = 4;
const HAND_INDEX_MCP = 5;
const HAND_INDEX_PIP = 6;
const HAND_INDEX_DIP = 7;
const HAND_INDEX_TIP = 8;
const HAND_MIDDLE_MCP = 9;
const HAND_MIDDLE_PIP = 10;
const HAND_MIDDLE_DIP = 11;
const HAND_MIDDLE_TIP = 12;
const HAND_RING_MCP = 13;
const HAND_RING_PIP = 14;
const HAND_RING_DIP = 15;
const HAND_RING_TIP = 16;
const HAND_PINKY_MCP = 17;
const HAND_PINKY_PIP = 18;
const HAND_PINKY_DIP = 19;
const HAND_PINKY_TIP = 20;
const HAND_FINGERS = [
  {
    mcp: HAND_THUMB_MCP,
    pip: HAND_THUMB_IP,
    dip: HAND_THUMB_IP,
    tip: HAND_THUMB_TIP,
  },
  {
    mcp: HAND_INDEX_MCP,
    pip: HAND_INDEX_PIP,
    dip: HAND_INDEX_DIP,
    tip: HAND_INDEX_TIP,
  },
  {
    mcp: HAND_MIDDLE_MCP,
    pip: HAND_MIDDLE_PIP,
    dip: HAND_MIDDLE_DIP,
    tip: HAND_MIDDLE_TIP,
  },
  {
    mcp: HAND_RING_MCP,
    pip: HAND_RING_PIP,
    dip: HAND_RING_DIP,
    tip: HAND_RING_TIP,
  },
  {
    mcp: HAND_PINKY_MCP,
    pip: HAND_PINKY_PIP,
    dip: HAND_PINKY_DIP,
    tip: HAND_PINKY_TIP,
  },
];
const HAND_TIP_INDICES = [
  HAND_THUMB_TIP,
  HAND_INDEX_TIP,
  HAND_MIDDLE_TIP,
  HAND_RING_TIP,
  HAND_PINKY_TIP,
];

const JOINT_WEIGHTS = {
  hands: 0.7,
  arms: 0.2,
  torso: 0.1,
};

const POSE_TORSO_INDICES = [
  POSE_LEFT_SHOULDER_INDEX,
  POSE_RIGHT_SHOULDER_INDEX,
  12,
  13,
];
const POSE_ELBOW_INDICES = [POSE_LEFT_ELBOW_INDEX, POSE_RIGHT_ELBOW_INDEX];

const EPSILON = 1e-6;
const DEFAULT_DTW_WINDOW = 45;
const SENSITIVITY_MULTIPLIER = 60;
const TIMING_RATIO_THRESHOLD = 2.0;
const TIMING_PENALTY = 10;
const MOTION_RATIO_THRESHOLD = 0.15;
const MOTION_MIN_REFERENCE = 0.02;
const MOTION_FAIL_SCORE = 15;
const MISSING_LANDMARK_PENALTY = 0.45;

export const DEFAULT_SIGN_SCORING_METADATA: SignScoringMetadata = {
  scoringVersion: "v2",
  requiredHands: "any",
  allowMirror: true,
  requiresExactHandedness: false,
  dominantHand: null,
  minPassingScore: 70,
  handShapeWeight: 0.3,
  positionWeight: 0.3,
  motionWeight: 0.2,
  orientationWeight: 0.08,
  timingWeight: 0.07,
  startPoseWeight: 0.025,
  endPoseWeight: 0.025,
  bodyArmPostureWeight: 0.05,
  requiredHandMissingScoreCap: 35,
  unrelatedMotionScoreCap: 45,
  wrongHandShapeScoreCap: 55,
  handShapeCriticalThreshold: 45,
  motionSimilarityCriticalThreshold: 35,
  expectedDuration: null,
  difficultyLevel: "easy",
  minWindowSize: 6,
  maxWindowSize: DEFAULT_DTW_WINDOW,
  windowRatio: 0.35,
  strictTimingMode: false,
};

export const EXAMPLE_SIGN_SCORING_METADATA = {
  oneHandStatic: {
    scoringVersion: "v2",
    requiredHands: "right",
    allowMirror: true,
    requiresExactHandedness: false,
    dominantHand: "right",
    minPassingScore: 72,
    handShapeWeight: 0.42,
    positionWeight: 0.34,
    motionWeight: 0.04,
    orientationWeight: 0.1,
    timingWeight: 0.03,
    startPoseWeight: 0.03,
    endPoseWeight: 0.04,
    bodyArmPostureWeight: 0.04,
    requiredHandMissingScoreCap: 30,
    unrelatedMotionScoreCap: 45,
    wrongHandShapeScoreCap: 50,
    handShapeCriticalThreshold: 55,
    motionSimilarityCriticalThreshold: 30,
    expectedDuration: 1000,
    difficultyLevel: "easy",
    minWindowSize: 4,
    maxWindowSize: 18,
    windowRatio: 0.22,
    strictTimingMode: true,
  },
  oneHandMovement: {
    scoringVersion: "v2",
    requiredHands: "right",
    allowMirror: true,
    requiresExactHandedness: false,
    dominantHand: "right",
    minPassingScore: 74,
    handShapeWeight: 0.22,
    positionWeight: 0.24,
    motionWeight: 0.34,
    orientationWeight: 0.07,
    timingWeight: 0.07,
    startPoseWeight: 0.03,
    endPoseWeight: 0.03,
    bodyArmPostureWeight: 0.05,
    requiredHandMissingScoreCap: 35,
    unrelatedMotionScoreCap: 42,
    wrongHandShapeScoreCap: 58,
    handShapeCriticalThreshold: 45,
    motionSimilarityCriticalThreshold: 38,
    expectedDuration: 1400,
    difficultyLevel: "medium",
    minWindowSize: 5,
    maxWindowSize: 28,
    windowRatio: 0.3,
    strictTimingMode: false,
  },
  twoHandMovement: {
    scoringVersion: "v2",
    requiredHands: "both",
    allowMirror: false,
    requiresExactHandedness: true,
    dominantHand: null,
    minPassingScore: 78,
    handShapeWeight: 0.2,
    positionWeight: 0.25,
    motionWeight: 0.32,
    orientationWeight: 0.08,
    timingWeight: 0.08,
    startPoseWeight: 0.03,
    endPoseWeight: 0.04,
    bodyArmPostureWeight: 0.05,
    requiredHandMissingScoreCap: 30,
    unrelatedMotionScoreCap: 40,
    wrongHandShapeScoreCap: 55,
    handShapeCriticalThreshold: 45,
    motionSimilarityCriticalThreshold: 40,
    expectedDuration: 1800,
    difficultyLevel: "hard",
    minWindowSize: 6,
    maxWindowSize: 36,
    windowRatio: 0.28,
    strictTimingMode: true,
  },
} satisfies Record<string, SignScoringMetadata>;

export const DEFAULT_SIGN_SCORING_RUNTIME_OPTIONS: SignScoringRuntimeOptions = {
  webcamPreviewMirrored: true,
  landmarkCoordinatesMirrored: false,
};

export const DEFAULT_STUDENT_QUALITY_CONFIG: StudentQualityCheckConfig = {
  handRequirement: "any",
  allowMirroredHands: true,
  minValidFrames: 12,
  minValidFrameRatio: 0.35,
  minPoseLandmarks: 4,
  minHandLandmarks: 8,
  minAverageConfidence: 0.3,
  frameMargin: 0.08,
  minInsideHandLandmarkRatio: 0.65,
  defaultConfidence: 1,
  debugLogs: false,
};

export const DEFAULT_GESTURE_SEGMENTATION_CONFIG: GestureSegmentationConfig = {
  // These thresholds are measured after torso normalization, so values are
  // roughly shoulder-width units per frame. Raise them if idle jitter starts
  // signs too early; lower them if slow signs are being missed.
  motionStartThreshold: 0.035,
  motionEndThreshold: 0.018,
  // Consecutive-frame windows debounce short MediaPipe spikes. Increase these
  // for noisy cameras; decrease them for very short or fast one-motion signs.
  startConsecutiveFrames: 3,
  endConsecutiveFrames: 8,
  // Padding keeps the first/last meaningful handshape around the motion burst.
  paddingFrames: 4,
  minSegmentFrames: 12,
};

function isDetected(point: Landmark3D): boolean {
  return (
    !!point &&
    Number.isFinite(point.x) &&
    Number.isFinite(point.y) &&
    Number.isFinite(point.z ?? 0)
  );
}

function countDetected(landmarks: Landmark3D[]): number {
  return landmarks.reduce(
    (count, landmark) => count + (isDetected(landmark) ? 1 : 0),
    0
  );
}

function hasPose(frame: HolisticFrame, config: StudentQualityCheckConfig) {
  return countDetected(frame.pose) >= config.minPoseLandmarks;
}

function hasHand(
  landmarks: Landmark3D[],
  config: StudentQualityCheckConfig
) {
  return countDetected(landmarks) >= config.minHandLandmarks;
}

function requiredHandsPresent(
  leftDetected: boolean,
  rightDetected: boolean,
  requirement: HandRequirement
) {
  switch (requirement) {
    case "left":
      return leftDetected;
    case "right":
      return rightDetected;
    case "both":
      return leftDetected && rightDetected;
    case "none":
      return true;
    case "any":
    default:
      return leftDetected || rightDetected;
  }
}

function requiredHandsPresentForQuality(
  leftDetected: boolean,
  rightDetected: boolean,
  config: StudentQualityCheckConfig
) {
  if (
    config.allowMirroredHands &&
    (config.handRequirement === "left" || config.handRequirement === "right")
  ) {
    return leftDetected || rightDetected;
  }

  return requiredHandsPresent(leftDetected, rightDetected, config.handRequirement);
}

function handInsideRatio(
  landmarks: Landmark3D[],
  config: StudentQualityCheckConfig
) {
  let detected = 0;
  let inside = 0;
  const min = -config.frameMargin;
  const max = 1 + config.frameMargin;

  for (const landmark of landmarks) {
    if (!isDetected(landmark) || !landmark) continue;
    detected += 1;
    if (
      landmark.x >= min &&
      landmark.x <= max &&
      landmark.y >= min &&
      landmark.y <= max
    ) {
      inside += 1;
    }
  }

  return detected > 0 ? inside / detected : 0;
}

function requiredHandsInside(
  leftInside: boolean,
  rightInside: boolean,
  requirement: HandRequirement
) {
  switch (requirement) {
    case "left":
      return leftInside;
    case "right":
      return rightInside;
    case "both":
      return leftInside && rightInside;
    case "none":
      return true;
    case "any":
    default:
      return leftInside || rightInside;
  }
}

function collectAverageConfidence(
  sequence: Sequence,
  config: StudentQualityCheckConfig
) {
  const stats = collectConfidenceStats(sequence, config);
  return stats.averageConfidence;
}

function readProvidedConfidence(landmark: NonNullable<Landmark3D>) {
  if (
    typeof landmark.presence === "number" &&
    Number.isFinite(landmark.presence) &&
    landmark.presence > 0
  ) {
    return { value: landmark.presence, source: "presence" };
  }
  if (
    typeof landmark.visibility === "number" &&
    Number.isFinite(landmark.visibility) &&
    landmark.visibility > 0
  ) {
    return { value: landmark.visibility, source: "visibility" };
  }
  return null;
}

function collectLandmarkConfidence(
  landmarks: Landmark3D[],
  config: StudentQualityCheckConfig,
  kind: "pose" | "hand"
) {
  let sum = 0;
  let count = 0;
  let visibilityCount = 0;
  let presenceCount = 0;
  let fallbackCount = 0;

  for (const landmark of landmarks) {
    if (!isDetected(landmark) || !landmark) continue;
    const provided = readProvidedConfidence(landmark);

    // MediaPipe hand landmarks commonly do not expose reliable visibility or
    // presence values. If the hand landmark exists with finite coordinates, it
    // is valid for quality purposes unless MediaPipe provides a positive
    // confidence value we can use. Zero/undefined hand confidence falls back.
    const confidence =
      provided?.value ?? (kind === "hand" ? config.defaultConfidence : 0);

    if (provided?.source === "visibility") visibilityCount += 1;
    else if (provided?.source === "presence") presenceCount += 1;
    else fallbackCount += 1;

    sum += confidence;
    count += 1;
  }

  return { sum, count, visibilityCount, presenceCount, fallbackCount };
}

function confidenceAverage(sum: number, count: number) {
  return count > 0 ? clamp(sum / count, 0, 1) : 1;
}

function collectConfidenceStats(
  sequence: Sequence,
  config: StudentQualityCheckConfig
) {
  let poseSum = 0;
  let poseCount = 0;
  let leftHandSum = 0;
  let leftHandCount = 0;
  let rightHandSum = 0;
  let rightHandCount = 0;
  let poseVisibilityCount = 0;
  let posePresenceCount = 0;
  let poseFallbackCount = 0;
  let leftVisibilityCount = 0;
  let leftPresenceCount = 0;
  let leftFallbackCount = 0;
  let rightVisibilityCount = 0;
  let rightPresenceCount = 0;
  let rightFallbackCount = 0;

  for (const frame of sequence) {
    const pose = collectLandmarkConfidence(frame.pose, config, "pose");
    const leftHand = collectLandmarkConfidence(frame.leftHand, config, "hand");
    const rightHand = collectLandmarkConfidence(frame.rightHand, config, "hand");

    poseSum += pose.sum;
    poseCount += pose.count;
    poseVisibilityCount += pose.visibilityCount;
    posePresenceCount += pose.presenceCount;
    poseFallbackCount += pose.fallbackCount;
    leftHandSum += leftHand.sum;
    leftHandCount += leftHand.count;
    leftVisibilityCount += leftHand.visibilityCount;
    leftPresenceCount += leftHand.presenceCount;
    leftFallbackCount += leftHand.fallbackCount;
    rightHandSum += rightHand.sum;
    rightHandCount += rightHand.count;
    rightVisibilityCount += rightHand.visibilityCount;
    rightPresenceCount += rightHand.presenceCount;
    rightFallbackCount += rightHand.fallbackCount;
  }

  const sourceLabel = (
    visibilityCount: number,
    presenceCount: number,
    fallbackCount: number
  ) => {
    if (presenceCount > 0) return "presence";
    if (visibilityCount > 0) return "visibility";
    if (fallbackCount > 0) return "fallback";
    return "none";
  };

  return {
    averageConfidence: confidenceAverage(poseSum, poseCount),
    averagePoseConfidence: confidenceAverage(poseSum, poseCount),
    averageLeftHandConfidence: confidenceAverage(leftHandSum, leftHandCount),
    averageRightHandConfidence: confidenceAverage(rightHandSum, rightHandCount),
    poseConfidenceSource: sourceLabel(
      poseVisibilityCount,
      posePresenceCount,
      poseFallbackCount
    ),
    leftHandConfidenceSource: sourceLabel(
      leftVisibilityCount,
      leftPresenceCount,
      leftFallbackCount
    ),
    rightHandConfidenceSource: sourceLabel(
      rightVisibilityCount,
      rightPresenceCount,
      rightFallbackCount
    ),
  };
}

function buildQualityResult(
  issue: StudentQualityIssue | null,
  message: string | null,
  metrics: StudentQualityCheckResult["metrics"]
): StudentQualityCheckResult {
  const finalMetrics = {
    ...metrics,
    finalFailureReason: issue,
  };

  return {
    ok: issue === null,
    issue,
    message,
    metrics: finalMetrics,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function normalizeDifficulty(value: unknown): SignDifficultyLevel {
  if (value === "medium" || value === "hard") return value;
  return "easy";
}

function normalizeHandRequirement(value: unknown): HandRequirement {
  if (
    value === "left" ||
    value === "right" ||
    value === "both" ||
    value === "none"
  ) {
    return value;
  }
  return "any";
}

function normalizeDominantHand(value: unknown): DominantHand {
  if (value === "left" || value === "right") return value;
  return null;
}

function normalizeScoringVersion(value: unknown): SignScoringVersion {
  return value === "v1" ? "v1" : "v2";
}

export function resolveSignScoringMetadata(
  input?: SignScoringMetadataInput | null
): SignScoringMetadata {
  const metadata = {
    ...DEFAULT_SIGN_SCORING_METADATA,
    ...(input ?? {}),
  };
  const minWindowSize = Math.max(1, Math.round(metadata.minWindowSize));
  const maxWindowSize = Math.max(
    minWindowSize,
    Math.round(metadata.maxWindowSize)
  );

  return {
    scoringVersion: normalizeScoringVersion(metadata.scoringVersion),
    requiredHands: normalizeHandRequirement(metadata.requiredHands),
    allowMirror: Boolean(metadata.allowMirror),
    requiresExactHandedness: Boolean(metadata.requiresExactHandedness),
    dominantHand: normalizeDominantHand(metadata.dominantHand),
    minPassingScore: clamp(metadata.minPassingScore, 0, 100),
    handShapeWeight: Math.max(0, metadata.handShapeWeight),
    positionWeight: Math.max(0, metadata.positionWeight),
    motionWeight: Math.max(0, metadata.motionWeight),
    orientationWeight: Math.max(0, metadata.orientationWeight),
    timingWeight: Math.max(0, metadata.timingWeight),
    startPoseWeight: Math.max(0, metadata.startPoseWeight),
    endPoseWeight: Math.max(0, metadata.endPoseWeight),
    bodyArmPostureWeight: Math.max(0, metadata.bodyArmPostureWeight),
    requiredHandMissingScoreCap: clamp(
      metadata.requiredHandMissingScoreCap,
      0,
      100
    ),
    unrelatedMotionScoreCap: clamp(metadata.unrelatedMotionScoreCap, 0, 100),
    wrongHandShapeScoreCap: clamp(metadata.wrongHandShapeScoreCap, 0, 100),
    handShapeCriticalThreshold: clamp(
      metadata.handShapeCriticalThreshold,
      0,
      100
    ),
    motionSimilarityCriticalThreshold: clamp(
      metadata.motionSimilarityCriticalThreshold,
      0,
      100
    ),
    expectedDuration:
      typeof metadata.expectedDuration === "number" &&
      Number.isFinite(metadata.expectedDuration) &&
      metadata.expectedDuration > 0
        ? metadata.expectedDuration
        : null,
    difficultyLevel: normalizeDifficulty(metadata.difficultyLevel),
    minWindowSize,
    maxWindowSize,
    windowRatio: clamp(metadata.windowRatio, 0.05, 1),
    strictTimingMode: Boolean(metadata.strictTimingMode),
  };
}

function difficultySensitivity(metadata: SignScoringMetadata) {
  switch (metadata.difficultyLevel) {
    case "hard":
      return SENSITIVITY_MULTIPLIER * 1.15;
    case "medium":
      return SENSITIVITY_MULTIPLIER * 1.05;
    case "easy":
    default:
      return SENSITIVITY_MULTIPLIER;
  }
}

function getFrameDistanceWeights(metadata: SignScoringMetadata) {
  const position = Math.max(metadata.positionWeight, 0.01);
  const handShape = Math.max(metadata.handShapeWeight, 0.01);
  const orientation = metadata.orientationWeight;
  const poseAnchor = metadata.startPoseWeight + metadata.endPoseWeight;
  const motion = metadata.motionWeight;

  return {
    torso: position * 0.1 + poseAnchor * 0.2,
    arms: position * 0.2 + motion * 0.12 + poseAnchor * 0.3,
    hands: position * 0.7 + motion * 0.18 + poseAnchor * 0.5,
    angle: handShape + orientation + poseAnchor * 0.35,
  };
}

function validPointCount(values: number[]) {
  let count = 0;
  for (let index = 0; index < values.length; index += 3) {
    if (readPoint(values, index / 3)) count += 1;
  }
  return count;
}

function getChestOrigin(frame: HolisticFrame) {
  const left = frame.pose[POSE_LEFT_SHOULDER_INDEX] ?? null;
  const right = frame.pose[POSE_RIGHT_SHOULDER_INDEX] ?? null;

  if (left && right) {
    return {
      origin: {
        x: (left.x + right.x) / 2,
        y: (left.y + right.y) / 2,
        z: ((left.z ?? 0) + (right.z ?? 0)) / 2,
      },
      scale: Math.sqrt(
        (left.x - right.x) * (left.x - right.x) +
          (left.y - right.y) * (left.y - right.y) +
          ((left.z ?? 0) - (right.z ?? 0)) * ((left.z ?? 0) - (right.z ?? 0))
      ) || EPSILON,
    };
  }

  return {
    origin: { x: 0, y: 0, z: 0 },
    scale: 1,
  };
}

function rotateAroundOrigin(
  point: Landmark3D,
  origin: { x: number; y: number; z: number },
  cosTheta: number,
  sinTheta: number
): Landmark3D {
  if (!point) return null;
  const dx = point.x - origin.x;
  const dy = point.y - origin.y;
  const rotatedX = dx * cosTheta - dy * sinTheta;
  const rotatedY = dx * sinTheta + dy * cosTheta;
  return {
    x: rotatedX + origin.x,
    y: rotatedY + origin.y,
    z: point.z,
  };
}

function rotateFrame(
  frame: HolisticFrame,
  origin: { x: number; y: number; z: number },
  angle: number
): HolisticFrame {
  const cosTheta = Math.cos(-angle);
  const sinTheta = Math.sin(-angle);

  return {
    pose: frame.pose.map((point) =>
      rotateAroundOrigin(point, origin, cosTheta, sinTheta)
    ),
    leftHand: frame.leftHand.map((point) =>
      rotateAroundOrigin(point, origin, cosTheta, sinTheta)
    ),
    rightHand: frame.rightHand.map((point) =>
      rotateAroundOrigin(point, origin, cosTheta, sinTheta)
    ),
  };
}

function normalizeLandmarks(
  landmarks: Landmark3D[],
  origin: { x: number; y: number; z: number },
  scale: number
): number[] {
  const normalized = new Array(landmarks.length * 3);
  for (let i = 0; i < landmarks.length; i += 1) {
    const point = landmarks[i];
    if (!point) {
      normalized[i * 3] = Number.NaN;
      normalized[i * 3 + 1] = Number.NaN;
      normalized[i * 3 + 2] = Number.NaN;
      continue;
    }
    const z = point.z ?? 0;
    normalized[i * 3] = (point.x - origin.x) / scale;
    normalized[i * 3 + 1] = (point.y - origin.y) / scale;
    normalized[i * 3 + 2] = (z - origin.z) / scale;
  }

  return normalized;
}

function vectorFrom(a: Landmark3D, b: Landmark3D) {
  if (!a || !b) return null;
  return {
    x: b.x - a.x,
    y: b.y - a.y,
    z: (b.z ?? 0) - (a.z ?? 0),
  };
}

function vectorAngle(a: { x: number; y: number; z: number } | null, b: { x: number; y: number; z: number } | null) {
  if (!a || !b) return Number.NaN;
  const dot = a.x * b.x + a.y * b.y + a.z * b.z;
  const magA = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
  const magB = Math.sqrt(b.x * b.x + b.y * b.y + b.z * b.z);
  if (magA < EPSILON || magB < EPSILON) return Number.NaN;
  const cosTheta = Math.max(-1, Math.min(1, dot / (magA * magB)));
  return Math.acos(cosTheta);
}

function landmarkDistance(a: Landmark3D, b: Landmark3D) {
  if (!a || !b) return Number.NaN;
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = (a.z ?? 0) - (b.z ?? 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function safeNormalizedDistance(
  a: Landmark3D,
  b: Landmark3D,
  scale: number
) {
  const distance = landmarkDistance(a, b);
  return Number.isFinite(distance) ? distance / scale : Number.NaN;
}

function normalizedDirection(a: Landmark3D, b: Landmark3D) {
  const vector = vectorFrom(a, b);
  if (!vector) return [Number.NaN, Number.NaN, Number.NaN];
  const magnitude = Math.sqrt(
    vector.x * vector.x + vector.y * vector.y + vector.z * vector.z
  );
  if (magnitude < EPSILON) return [Number.NaN, Number.NaN, Number.NaN];
  return [vector.x / magnitude, vector.y / magnitude, vector.z / magnitude];
}

function normalizeVector(vector: { x: number; y: number; z: number } | null) {
  if (!vector) return null;
  const magnitude = Math.sqrt(
    vector.x * vector.x + vector.y * vector.y + vector.z * vector.z
  );
  if (magnitude < EPSILON) return null;
  return {
    x: vector.x / magnitude,
    y: vector.y / magnitude,
    z: vector.z / magnitude,
  };
}

function crossProduct(
  a: { x: number; y: number; z: number } | null,
  b: { x: number; y: number; z: number } | null
) {
  if (!a || !b) return null;
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

function pushVector(values: number[], vector: { x: number; y: number; z: number } | null) {
  if (!vector) {
    values.push(Number.NaN, Number.NaN, Number.NaN);
    return;
  }
  values.push(vector.x, vector.y, vector.z);
}

function handPalmScale(hand: Landmark3D[]) {
  const wrist = hand[HAND_WRIST_INDEX] ?? null;
  const middleMcp = hand[HAND_MIDDLE_MCP] ?? null;
  const wristToMiddle = landmarkDistance(wrist, middleMcp);
  if (Number.isFinite(wristToMiddle) && wristToMiddle > EPSILON) {
    return wristToMiddle;
  }

  const points = hand.filter(isDetected) as NonNullable<Landmark3D>[];
  if (points.length < 2) return 0;
  let maxDistance = 0;
  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      const distance = landmarkDistance(points[i], points[j]);
      if (Number.isFinite(distance)) {
        maxDistance = Math.max(maxDistance, distance);
      }
    }
  }
  return maxDistance;
}

export function extractHandShapeFeatures(
  hand: Landmark3D[]
): HandShapeFeatures | null {
  if (countDetected(hand) < 12) return null;
  const wrist = hand[HAND_WRIST_INDEX] ?? null;
  const scale = handPalmScale(hand);
  if (!wrist || scale < EPSILON) return null;

  const values: number[] = [];

  for (let i = 0; i < HAND_TIP_INDICES.length; i += 1) {
    for (let j = i + 1; j < HAND_TIP_INDICES.length; j += 1) {
      values.push(
        safeNormalizedDistance(
          hand[HAND_TIP_INDICES[i]] ?? null,
          hand[HAND_TIP_INDICES[j]] ?? null,
          scale
        )
      );
    }
  }

  for (const tipIndex of HAND_TIP_INDICES) {
    values.push(safeNormalizedDistance(hand[tipIndex] ?? null, wrist, scale));
  }

  for (const finger of HAND_FINGERS) {
    values.push(
      vectorAngle(
        vectorFrom(hand[finger.mcp] ?? null, hand[finger.pip] ?? null),
        vectorFrom(hand[finger.pip] ?? null, hand[finger.tip] ?? null)
      )
    );
  }

  values.push(
    safeNormalizedDistance(
      hand[HAND_THUMB_TIP] ?? null,
      hand[HAND_INDEX_TIP] ?? null,
      scale
    )
  );

  const palmOpenness =
    HAND_TIP_INDICES.reduce(
      (sum, tipIndex) =>
        sum + safeNormalizedDistance(hand[tipIndex] ?? null, wrist, scale),
      0
    ) / HAND_TIP_INDICES.length;
  values.push(palmOpenness);

  for (const finger of HAND_FINGERS) {
    values.push(...normalizedDirection(hand[finger.mcp] ?? null, hand[finger.tip] ?? null));
  }

  return { values };
}

export function extractHandOrientationFeatures(
  hand: Landmark3D[]
): HandOrientationFeatures | null {
  if (countDetected(hand) < 6) return null;
  const wrist = hand[HAND_WRIST_INDEX] ?? null;
  const indexMcp = hand[HAND_INDEX_MCP] ?? null;
  const middleTip = hand[HAND_MIDDLE_TIP] ?? null;
  const middleMcp = hand[HAND_MIDDLE_MCP] ?? null;
  const pinkyMcp = hand[HAND_PINKY_MCP] ?? null;
  if (!wrist || !indexMcp || !middleMcp || !pinkyMcp) return null;

  const wristToIndex = vectorFrom(wrist, indexMcp);
  const wristToPinky = vectorFrom(wrist, pinkyMcp);
  const palmNormal = normalizeVector(crossProduct(wristToIndex, wristToPinky));
  const wristToMiddleFinger = normalizeVector(
    vectorFrom(wrist, middleTip ?? middleMcp)
  );
  const indexToPinky = normalizeVector(vectorFrom(indexMcp, pinkyMcp));
  const relativeHandRotation = normalizeVector(
    crossProduct(wristToMiddleFinger, indexToPinky)
  );
  const values: number[] = [];

  pushVector(values, palmNormal);
  pushVector(values, wristToMiddleFinger);
  pushVector(values, indexToPinky);
  pushVector(values, relativeHandRotation);
  values.push(vectorAngle(palmNormal, wristToMiddleFinger));
  values.push(vectorAngle(indexToPinky, wristToMiddleFinger));

  return { values };
}

function collectJointAngles(frame: HolisticFrame): number[] {
  const leftShoulder = frame.pose[POSE_LEFT_SHOULDER_INDEX] ?? null;
  const rightShoulder = frame.pose[POSE_RIGHT_SHOULDER_INDEX] ?? null;
  const leftElbow = frame.pose[POSE_LEFT_ELBOW_INDEX] ?? null;
  const rightElbow = frame.pose[POSE_RIGHT_ELBOW_INDEX] ?? null;
  const leftWrist = frame.pose[POSE_LEFT_WRIST_INDEX] ?? null;
  const rightWrist = frame.pose[POSE_RIGHT_WRIST_INDEX] ?? null;

  const leftUpper = vectorFrom(leftShoulder, leftElbow);
  const leftLower = vectorFrom(leftElbow, leftWrist);
  const rightUpper = vectorFrom(rightShoulder, rightElbow);
  const rightLower = vectorFrom(rightElbow, rightWrist);

  const leftElbowAngle = vectorAngle(leftUpper, leftLower);
  const rightElbowAngle = vectorAngle(rightUpper, rightLower);

  const shoulderAxis = vectorFrom(rightShoulder, leftShoulder);
  const leftShoulderAngle = vectorAngle(shoulderAxis, leftUpper);
  const rightShoulderAngle = vectorAngle(shoulderAxis, rightUpper);

  const leftHandIndexAngle = vectorAngle(
    vectorFrom(frame.leftHand[HAND_WRIST_INDEX] ?? null, frame.leftHand[HAND_INDEX_MCP] ?? null),
    vectorFrom(frame.leftHand[HAND_INDEX_MCP] ?? null, frame.leftHand[HAND_INDEX_PIP] ?? null)
  );
  const leftHandMiddleAngle = vectorAngle(
    vectorFrom(frame.leftHand[HAND_WRIST_INDEX] ?? null, frame.leftHand[HAND_MIDDLE_MCP] ?? null),
    vectorFrom(frame.leftHand[HAND_MIDDLE_MCP] ?? null, frame.leftHand[HAND_MIDDLE_PIP] ?? null)
  );
  const rightHandIndexAngle = vectorAngle(
    vectorFrom(frame.rightHand[HAND_WRIST_INDEX] ?? null, frame.rightHand[HAND_INDEX_MCP] ?? null),
    vectorFrom(frame.rightHand[HAND_INDEX_MCP] ?? null, frame.rightHand[HAND_INDEX_PIP] ?? null)
  );
  const rightHandMiddleAngle = vectorAngle(
    vectorFrom(frame.rightHand[HAND_WRIST_INDEX] ?? null, frame.rightHand[HAND_MIDDLE_MCP] ?? null),
    vectorFrom(frame.rightHand[HAND_MIDDLE_MCP] ?? null, frame.rightHand[HAND_MIDDLE_PIP] ?? null)
  );

  return [
    leftElbowAngle,
    rightElbowAngle,
    leftShoulderAngle,
    rightShoulderAngle,
    leftHandIndexAngle,
    leftHandMiddleAngle,
    rightHandIndexAngle,
    rightHandMiddleAngle,
  ];
}

function normalizeFrame(frame: HolisticFrame): NormalizedFrame {
  const { origin, scale } = getChestOrigin(frame);
  const shoulderLeft = frame.pose[POSE_LEFT_SHOULDER_INDEX] ?? null;
  const shoulderRight = frame.pose[POSE_RIGHT_SHOULDER_INDEX] ?? null;
  const angle = shoulderLeft && shoulderRight
    ? Math.atan2(shoulderLeft.y - shoulderRight.y, shoulderLeft.x - shoulderRight.x)
    : 0;

  const rotatedFrame = rotateFrame(frame, origin, angle);
  const angles = collectJointAngles(rotatedFrame);

  return {
    pose: normalizeLandmarks(rotatedFrame.pose, origin, scale),
    leftHand: normalizeLandmarks(rotatedFrame.leftHand, origin, scale),
    rightHand: normalizeLandmarks(rotatedFrame.rightHand, origin, scale),
    angles,
  };
}

function normalizeSequence(sequence: Sequence): NormalizedSequence {
  return sequence.map((frame) => normalizeFrame(frame));
}

function pointDistance(a: number[], b: number[], index: number): number | null {
  const ax = a[index];
  const ay = a[index + 1];
  const az = a[index + 2];
  const bx = b[index];
  const by = b[index + 1];
  const bz = b[index + 2];

  if (
    !Number.isFinite(ax) ||
    !Number.isFinite(ay) ||
    !Number.isFinite(az) ||
    !Number.isFinite(bx) ||
    !Number.isFinite(by) ||
    !Number.isFinite(bz)
  ) {
    return null;
  }

  const dx = ax - bx;
  const dy = ay - by;
  const dz = az - bz;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

type WeightedDistanceStats = {
  sum: number;
  count: number;
  missing: number;
};

function angleDistance(
  a: number[],
  b: number[],
  missingPenalty: number
): WeightedDistanceStats {
  const len = Math.min(a.length, b.length);
  let sum = 0;
  let count = 0;
  let missing = 0;

  for (let i = 0; i < len; i += 1) {
    const av = a[i];
    const bv = b[i];
    if (!Number.isFinite(av) || !Number.isFinite(bv)) {
      sum += missingPenalty;
      count += 1;
      missing += 1;
      continue;
    }
    sum += Math.abs(av - bv);
    count += 1;
  }

  return { sum, count, missing };
}

function segmentDistance(
  a: number[],
  b: number[],
  weight: number,
  missingPenalty: number
): WeightedDistanceStats {
  const len = Math.min(a.length, b.length);
  let sum = 0;
  let count = 0;
  let missing = 0;

  for (let i = 0; i < len; i += 3) {
    const distance = pointDistance(a, b, i);
    if (distance === null) {
      sum += missingPenalty * weight;
      count += weight;
      missing += weight;
      continue;
    }
    sum += distance * weight;
    count += weight;
  }

  return { sum, count, missing };
}

function weightedPointDistance(
  a: number[],
  b: number[],
  indices: number[],
  totalWeight: number,
  missingPenalty: number
) : WeightedDistanceStats {
  if (indices.length === 0) {
    return { sum: 0, count: 0, missing: 0 };
  }

  const perPointWeight = totalWeight / indices.length;
  let sum = 0;
  let count = 0;
  let missing = 0;

  for (const pointIndex of indices) {
    const offset = pointIndex * 3;
    const distance = pointDistance(a, b, offset);
    if (distance === null) {
      sum += missingPenalty * perPointWeight;
      count += perPointWeight;
      missing += perPointWeight;
      continue;
    }
    sum += distance * perPointWeight;
    count += perPointWeight;
  }

  return { sum, count, missing };
}

type FrameDistanceBreakdown = {
  distance: number;
  torsoCost: number | null;
  armCost: number | null;
  handCost: number | null;
  angleCost: number | null;
  missingWeight: number;
  totalWeight: number;
};

function selectedHandSides(
  metadata: SignScoringMetadata,
  a: NormalizedFrame,
  b: NormalizedFrame
): Array<"left" | "right"> {
  if (metadata.requiredHands === "none") return [];
  if (metadata.requiredHands === "both") return ["left", "right"];
  if (metadata.requiredHands === "left") return ["left"];
  if (metadata.requiredHands === "right") return ["right"];
  if (metadata.dominantHand) return [metadata.dominantHand];

  const leftComparable =
    validPointCount(a.leftHand) >= 6 && validPointCount(b.leftHand) >= 6;
  const rightComparable =
    validPointCount(a.rightHand) >= 6 && validPointCount(b.rightHand) >= 6;
  const sides: Array<"left" | "right"> = [];
  if (leftComparable) sides.push("left");
  if (rightComparable) sides.push("right");
  return sides.length > 0 ? sides : ["left", "right"];
}

function frameDistanceBreakdown(
  a: NormalizedFrame,
  b: NormalizedFrame,
  metadata: SignScoringMetadata = DEFAULT_SIGN_SCORING_METADATA
): FrameDistanceBreakdown {
  const missingPenalty = MISSING_LANDMARK_PENALTY;
  const weights = getFrameDistanceWeights(metadata);

  const torsoStats = weightedPointDistance(
    a.pose,
    b.pose,
    POSE_TORSO_INDICES,
    weights.torso,
    missingPenalty
  );
  const armStats = weightedPointDistance(
    a.pose,
    b.pose,
    POSE_ELBOW_INDICES,
    weights.arms,
    missingPenalty
  );

  const selectedSides = selectedHandSides(metadata, a, b);
  const handPointCount = Math.min(
    a.leftHand.length,
    b.leftHand.length,
    a.rightHand.length,
    b.rightHand.length
  ) / 3;
  const handIndices = handPointCount > 0
    ? Array.from({ length: handPointCount }, (_, index) => index)
    : [];
  const handWeightPerSide =
    selectedSides.length > 0 ? weights.hands / selectedSides.length : 0;
  const emptyStats: WeightedDistanceStats = { sum: 0, count: 0, missing: 0 };
  const leftStats = selectedSides.includes("left")
    ? weightedPointDistance(
        a.leftHand,
        b.leftHand,
        handIndices,
        handWeightPerSide,
        missingPenalty
      )
    : emptyStats;
  const rightStats = selectedSides.includes("right")
    ? weightedPointDistance(
        a.rightHand,
        b.rightHand,
        handIndices,
        handWeightPerSide,
        missingPenalty
      )
    : emptyStats;
  const angleStats = angleDistance(a.angles, b.angles, missingPenalty);

  const sum =
    torsoStats.sum +
    armStats.sum +
    leftStats.sum +
    rightStats.sum +
    angleStats.sum * weights.angle;
  const count =
    torsoStats.count +
    armStats.count +
    leftStats.count +
    rightStats.count +
    angleStats.count * weights.angle;

  if (count === 0) {
    return {
      distance: Number.POSITIVE_INFINITY,
      torsoCost: null,
      armCost: null,
      handCost: null,
      angleCost: null,
      missingWeight: 0,
      totalWeight: 0,
    };
  }

  return {
    distance: sum / count,
    torsoCost: torsoStats.count > 0 ? torsoStats.sum / torsoStats.count : null,
    armCost: armStats.count > 0 ? armStats.sum / armStats.count : null,
    handCost:
      leftStats.count + rightStats.count > 0
        ? (leftStats.sum + rightStats.sum) /
          (leftStats.count + rightStats.count)
        : null,
    angleCost:
      angleStats.count > 0 ? angleStats.sum / angleStats.count : null,
    missingWeight:
      torsoStats.missing +
      armStats.missing +
      leftStats.missing +
      rightStats.missing +
      angleStats.missing * weights.angle,
    totalWeight: count,
  };
}

function frameDistance(
  a: NormalizedFrame,
  b: NormalizedFrame,
  metadata: SignScoringMetadata = DEFAULT_SIGN_SCORING_METADATA
): number {
  return frameDistanceBreakdown(a, b, metadata).distance;
}

function difficultyWindowMultiplier(metadata: SignScoringMetadata) {
  switch (metadata.difficultyLevel) {
    case "hard":
      return 0.85;
    case "medium":
      return 1;
    case "easy":
    default:
      return 1.15;
  }
}

function sequenceLengthRatio(aLength: number, bLength: number) {
  return Math.max(aLength, bLength) / Math.max(1, Math.min(aLength, bLength));
}

function adaptiveDtwWindowSize(
  userLength: number,
  referenceLength: number,
  metadata: SignScoringMetadata
) {
  const expectedFrameCount = metadata.expectedDuration
    ? metadata.expectedDuration / (1000 / 30)
    : referenceLength;
  const expectedDurationFactor = clamp(
    expectedFrameCount / Math.max(1, referenceLength),
    0.75,
    1.25
  );
  const strictFactor = metadata.strictTimingMode ? 0.7 : 1;
  const baseWindow = Math.round(
    referenceLength *
      metadata.windowRatio *
      difficultyWindowMultiplier(metadata) *
      expectedDurationFactor *
      strictFactor
  );
  const clampedWindow = clamp(
    baseWindow,
    metadata.minWindowSize,
    metadata.maxWindowSize
  );
  const lengthDelta = Math.abs(userLength - referenceLength);
  const ratio = sequenceLengthRatio(userLength, referenceLength);

  if (!metadata.strictTimingMode && ratio < 1.75) {
    return Math.min(metadata.maxWindowSize, Math.max(clampedWindow, lengthDelta));
  }

  return clampedWindow;
}

function timingPenaltyForLengths(
  userLength: number,
  referenceLength: number,
  metadata: SignScoringMetadata
) {
  const ratio = sequenceLengthRatio(userLength, referenceLength);
  const expectedFrames = metadata.expectedDuration
    ? metadata.expectedDuration / (1000 / 30)
    : referenceLength;
  const expectedRatio = Math.max(userLength, expectedFrames) / Math.max(1, Math.min(userLength, expectedFrames));
  const ratioExcess = Math.max(0, ratio - 1);
  const expectedExcess = Math.max(0, expectedRatio - 1);
  const strictMultiplier = metadata.strictTimingMode ? 1.4 : 1;
  const penalty =
    (ratioExcess * 35 + expectedExcess * 15) *
    Math.max(0.25, metadata.timingWeight) *
    strictMultiplier;

  return Math.round(clamp(penalty, 0, 35));
}

function defaultComponentDiagnostics() {
  return {
    handScore: 0,
    armScore: 0,
    torsoScore: 0,
    angleScore: 0,
    missingLandmarkRatio: 1,
  };
}

function sequenceComponentDiagnostics(
  userSeq: NormalizedSequence,
  referenceSeq: NormalizedSequence,
  metadata: SignScoringMetadata
) {
  const len = Math.min(userSeq.length, referenceSeq.length);
  if (len === 0) return defaultComponentDiagnostics();

  let handCost = 0;
  let handCount = 0;
  let armCost = 0;
  let armCount = 0;
  let torsoCost = 0;
  let torsoCount = 0;
  let angleCost = 0;
  let angleCount = 0;
  let missingWeight = 0;
  let totalWeight = 0;

  for (let index = 0; index < len; index += 1) {
    const breakdown = frameDistanceBreakdown(
      userSeq[index],
      referenceSeq[index],
      metadata
    );
    if (breakdown.handCost !== null) {
      handCost += breakdown.handCost;
      handCount += 1;
    }
    if (breakdown.armCost !== null) {
      armCost += breakdown.armCost;
      armCount += 1;
    }
    if (breakdown.torsoCost !== null) {
      torsoCost += breakdown.torsoCost;
      torsoCount += 1;
    }
    if (breakdown.angleCost !== null) {
      angleCost += breakdown.angleCost;
      angleCount += 1;
    }
    missingWeight += breakdown.missingWeight;
    totalWeight += breakdown.totalWeight;
  }

  const sensitivity = difficultySensitivity(metadata);

  return {
    handScore:
      handCount > 0 ? distanceToScore(handCost / handCount, sensitivity) : 100,
    armScore:
      armCount > 0 ? distanceToScore(armCost / armCount, sensitivity) : 100,
    torsoScore:
      torsoCount > 0 ? distanceToScore(torsoCost / torsoCount, sensitivity) : 100,
    angleScore:
      angleCount > 0 ? distanceToScore(angleCost / angleCount, sensitivity) : 100,
    missingLandmarkRatio:
      totalWeight > EPSILON ? clamp(missingWeight / totalWeight, 0, 1) : 1,
  };
}

function buildAlignmentDiagnostics(
  totalCost: number,
  userLength: number,
  referenceLength: number,
  windowSizeUsed: number,
  metadata: SignScoringMetadata,
  componentDiagnostics = defaultComponentDiagnostics()
): DtwAlignmentDiagnostics {
  const alignmentLength = userLength + referenceLength;
  const averageCost =
    alignmentLength > 0 ? totalCost / alignmentLength : Number.POSITIVE_INFINITY;
  const baseScore = distanceToScore(averageCost, difficultySensitivity(metadata));
  const sequenceRatio = sequenceLengthRatio(userLength, referenceLength);
  const timingPenalty = timingPenaltyForLengths(
    userLength,
    referenceLength,
    metadata
  );
  const ratioPenalty = Math.max(0, sequenceRatio - 1) * 55;
  const timingSimilarityScore = Math.round(
    clamp(100 - timingPenalty - ratioPenalty, 0, 100)
  );

  return {
    averageCost,
    baseScore,
    finalScore: Math.max(0, baseScore - timingPenalty),
    alignmentLength,
    windowSizeUsed,
    timingPenalty,
    sequenceLengthRatio: sequenceRatio,
    timingSimilarityScore,
    studentFrames: userLength,
    teacherFrames: referenceLength,
    ...componentDiagnostics,
  };
}

function dtwAlignment(
  aSeq: NormalizedSequence,
  bSeq: NormalizedSequence,
  metadata: SignScoringMetadata = DEFAULT_SIGN_SCORING_METADATA
) {
  const n = aSeq.length;
  const m = bSeq.length;
  const windowSizeUsed = adaptiveDtwWindowSize(n, m, metadata);

  if (n === 0 || m === 0 || Math.abs(n - m) > windowSizeUsed) {
    const componentDiagnostics = sequenceComponentDiagnostics(
      aSeq,
      bSeq,
      metadata
    );
    return {
      totalCost: Number.POSITIVE_INFINITY,
      diagnostics: buildAlignmentDiagnostics(
        Number.POSITIVE_INFINITY,
        n,
        m,
        windowSizeUsed,
        metadata,
        componentDiagnostics
      ),
    };
  }

  const prev = new Float64Array(m + 1);
  const curr = new Float64Array(m + 1);

  for (let j = 0; j <= m; j += 1) {
    prev[j] = Number.POSITIVE_INFINITY;
  }
  prev[0] = 0;

  for (let i = 1; i <= n; i += 1) {
    curr[0] = Number.POSITIVE_INFINITY;
    const aFrame = aSeq[i - 1];
    const start = Math.max(1, i - windowSizeUsed);
    const end = Math.min(m, i + windowSizeUsed);

    for (let j = 1; j < start; j += 1) {
      curr[j] = Number.POSITIVE_INFINITY;
    }

    for (let j = start; j <= end; j += 1) {
      const cost = frameDistance(aFrame, bSeq[j - 1], metadata);
      curr[j] = cost + Math.min(prev[j], curr[j - 1], prev[j - 1]);
    }

    for (let j = end + 1; j <= m; j += 1) {
      curr[j] = Number.POSITIVE_INFINITY;
    }

    prev.set(curr);
  }

  return {
    totalCost: prev[m],
    diagnostics: buildAlignmentDiagnostics(
      prev[m],
      n,
      m,
      windowSizeUsed,
      metadata,
      sequenceComponentDiagnostics(aSeq, bSeq, metadata)
    ),
  };
}

function dtwDistance(
  aSeq: NormalizedSequence,
  bSeq: NormalizedSequence,
  windowSize: number = DEFAULT_DTW_WINDOW,
  metadata: SignScoringMetadata = DEFAULT_SIGN_SCORING_METADATA
): number {
  if (windowSize === DEFAULT_DTW_WINDOW) {
    return dtwAlignment(aSeq, bSeq, metadata).totalCost;
  }

  const n = aSeq.length;
  const m = bSeq.length;

  if (n === 0 || m === 0) {
    return Number.POSITIVE_INFINITY;
  }

  const window = Math.max(windowSize, Math.abs(n - m));

  const prev = new Float64Array(m + 1);
  const curr = new Float64Array(m + 1);

  for (let j = 0; j <= m; j += 1) {
    prev[j] = Number.POSITIVE_INFINITY;
  }
  prev[0] = 0;

  for (let i = 1; i <= n; i += 1) {
    curr[0] = Number.POSITIVE_INFINITY;
    const aFrame = aSeq[i - 1];

    const start = Math.max(1, i - window);
    const end = Math.min(m, i + window);
    for (let j = 1; j < start; j += 1) {
      curr[j] = Number.POSITIVE_INFINITY;
    }

    for (let j = start; j <= end; j += 1) {
      const cost = frameDistance(aFrame, bSeq[j - 1], metadata);
      const minPrev = Math.min(prev[j], curr[j - 1], prev[j - 1]);
      curr[j] = cost + minPrev;
    }

    for (let j = end + 1; j <= m; j += 1) {
      curr[j] = Number.POSITIVE_INFINITY;
    }

    prev.set(curr);
  }

  return prev[m];
}

function distanceToScore(averageCost: number, sensitivity: number = SENSITIVITY_MULTIPLIER): number {
  if (!Number.isFinite(averageCost)) {
    return 0;
  }

  const penalty = averageCost * sensitivity;
  const score = Math.max(0, Math.min(100, 100 - penalty));
  return Math.round(score);
}

function readPoint(values: number[], index: number) {
  const offset = index * 3;
  const x = values[offset];
  const y = values[offset + 1];
  const z = values[offset + 2];
  if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
    return null;
  }
  return { x, y, z };
}

function computeBoundingVolume(points: Array<{ x: number; y: number; z: number }>) {
  if (points.length < 2) return 0;
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let minZ = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  let maxZ = Number.NEGATIVE_INFINITY;

  for (const point of points) {
    if (point.x < minX) minX = point.x;
    if (point.y < minY) minY = point.y;
    if (point.z < minZ) minZ = point.z;
    if (point.x > maxX) maxX = point.x;
    if (point.y > maxY) maxY = point.y;
    if (point.z > maxZ) maxZ = point.z;
  }

  const dx = maxX - minX;
  const dy = maxY - minY;
  const dz = maxZ - minZ;
  return dx * dy * dz;
}

function calculateSequenceMotion(sequence: NormalizedSequence) {
  const leftPoints: Array<{ x: number; y: number; z: number }> = [];
  const rightPoints: Array<{ x: number; y: number; z: number }> = [];

  for (const frame of sequence) {
    const leftHandWrist = readPoint(frame.leftHand, HAND_WRIST_INDEX);
    const rightHandWrist = readPoint(frame.rightHand, HAND_WRIST_INDEX);
    const leftPoseWrist = readPoint(frame.pose, POSE_LEFT_WRIST_INDEX);
    const rightPoseWrist = readPoint(frame.pose, POSE_RIGHT_WRIST_INDEX);

    const left = leftHandWrist ?? leftPoseWrist;
    const right = rightHandWrist ?? rightPoseWrist;

    if (left) leftPoints.push(left);
    if (right) rightPoints.push(right);
  }

  return computeBoundingVolume(leftPoints) + computeBoundingVolume(rightPoints);
}

function wristMotionBetween(a: NormalizedFrame, b: NormalizedFrame) {
  const points = [
    [readPoint(a.leftHand, HAND_WRIST_INDEX), readPoint(b.leftHand, HAND_WRIST_INDEX)],
    [readPoint(a.rightHand, HAND_WRIST_INDEX), readPoint(b.rightHand, HAND_WRIST_INDEX)],
    [readPoint(a.pose, POSE_LEFT_WRIST_INDEX), readPoint(b.pose, POSE_LEFT_WRIST_INDEX)],
    [readPoint(a.pose, POSE_RIGHT_WRIST_INDEX), readPoint(b.pose, POSE_RIGHT_WRIST_INDEX)],
  ] as const;
  let peak = 0;

  for (const [prev, next] of points) {
    if (!prev || !next) continue;
    const dx = next.x - prev.x;
    const dy = next.y - prev.y;
    const dz = next.z - prev.z;
    peak = Math.max(peak, Math.sqrt(dx * dx + dy * dy + dz * dz));
  }

  return peak;
}

function computeWristMotion(sequence: Sequence): number[] {
  const normalized = normalizeSequence(sequence);
  const motion = new Array(sequence.length).fill(0);

  for (let i = 1; i < normalized.length; i += 1) {
    motion[i] = wristMotionBetween(normalized[i - 1], normalized[i]);
  }

  return motion;
}

function flipLandmarksHorizontally(landmarks: Landmark3D[]) {
  return landmarks.map((landmark) =>
    landmark
      ? {
          ...landmark,
          x: 1 - landmark.x,
        }
      : null
  );
}

function flipSequenceHorizontally(sequence: Sequence): Sequence {
  return sequence.map((frame) => ({
    pose: flipLandmarksHorizontally(frame.pose),
    leftHand: flipLandmarksHorizontally(frame.rightHand),
    rightHand: flipLandmarksHorizontally(frame.leftHand),
  }));
}

function handShapeFeatureDistance(
  a: HandShapeFeatures,
  b: HandShapeFeatures
) {
  const len = Math.min(a.values.length, b.values.length);
  if (len === 0) return Number.POSITIVE_INFINITY;
  let sum = 0;
  let count = 0;

  for (let i = 0; i < len; i += 1) {
    const av = a.values[i];
    const bv = b.values[i];
    if (!Number.isFinite(av) || !Number.isFinite(bv)) {
      sum += 0.75;
      count += 1;
      continue;
    }
    sum += Math.abs(av - bv);
    count += 1;
  }

  return count > 0 ? sum / count : Number.POSITIVE_INFINITY;
}

function handShapeDtwDistance(
  userFeatures: HandShapeFeatures[],
  referenceFeatures: HandShapeFeatures[],
  metadata: SignScoringMetadata
) {
  const n = userFeatures.length;
  const m = referenceFeatures.length;
  if (n === 0 || m === 0) return Number.POSITIVE_INFINITY;

  const window = adaptiveDtwWindowSize(n, m, metadata);
  if (Math.abs(n - m) > window) return Number.POSITIVE_INFINITY;
  const prev = new Float64Array(m + 1);
  const curr = new Float64Array(m + 1);

  for (let j = 0; j <= m; j += 1) {
    prev[j] = Number.POSITIVE_INFINITY;
  }
  prev[0] = 0;

  for (let i = 1; i <= n; i += 1) {
    curr[0] = Number.POSITIVE_INFINITY;
    const start = Math.max(1, i - window);
    const end = Math.min(m, i + window);

    for (let j = 1; j < start; j += 1) {
      curr[j] = Number.POSITIVE_INFINITY;
    }

    for (let j = start; j <= end; j += 1) {
      const cost = handShapeFeatureDistance(
        userFeatures[i - 1],
        referenceFeatures[j - 1]
      );
      curr[j] = cost + Math.min(prev[j], curr[j - 1], prev[j - 1]);
    }

    for (let j = end + 1; j <= m; j += 1) {
      curr[j] = Number.POSITIVE_INFINITY;
    }

    prev.set(curr);
  }

  return prev[m] / Math.max(1, n + m);
}

function handShapeSequenceFeatures(
  sequence: Sequence,
  side: "left" | "right"
) {
  const features: HandShapeFeatures[] = [];
  for (const frame of sequence) {
    const hand = side === "left" ? frame.leftHand : frame.rightHand;
    const frameFeatures = extractHandShapeFeatures(hand);
    if (frameFeatures) features.push(frameFeatures);
  }
  return features;
}

function isHandShapeRequired(
  side: "left" | "right",
  metadata: SignScoringMetadata
) {
  if (metadata.requiredHands === "both") return true;
  if (metadata.requiredHands === side) return true;
  return metadata.requiredHands === "any" && metadata.dominantHand === side;
}

function scoreHandShapeSide(
  userSeq: Sequence,
  referenceSeq: Sequence,
  side: "left" | "right",
  metadata: SignScoringMetadata
) {
  const required = isHandShapeRequired(side, metadata);
  const userFeatures = handShapeSequenceFeatures(userSeq, side);
  const referenceFeatures = handShapeSequenceFeatures(referenceSeq, side);

  if (userFeatures.length === 0 || referenceFeatures.length === 0) {
    return required ? 0 : null;
  }

  const averageCost = handShapeDtwDistance(
    userFeatures,
    referenceFeatures,
    metadata
  );
  return distanceToScore(averageCost, 115);
}

function calculateHandShapeScores(
  userSeq: Sequence,
  referenceSeq: Sequence,
  metadata: SignScoringMetadata
): HandShapeScoreBreakdown {
  const leftHandShapeScore = scoreHandShapeSide(
    userSeq,
    referenceSeq,
    "left",
    metadata
  );
  const rightHandShapeScore = scoreHandShapeSide(
    userSeq,
    referenceSeq,
    "right",
    metadata
  );
  const availableScores = [leftHandShapeScore, rightHandShapeScore].filter(
    (score): score is number => typeof score === "number"
  );
  const overallHandShapeScore =
    availableScores.length > 0
      ? Math.round(
          availableScores.reduce((sum, score) => sum + score, 0) /
            availableScores.length
        )
      : null;

  return {
    leftHandShapeScore,
    rightHandShapeScore,
    overallHandShapeScore,
  };
}

function orientationFeatureDistance(
  a: HandOrientationFeatures,
  b: HandOrientationFeatures
) {
  const len = Math.min(a.values.length, b.values.length);
  if (len === 0) return Number.POSITIVE_INFINITY;
  let sum = 0;
  let count = 0;

  for (let i = 0; i < len; i += 1) {
    const av = a.values[i];
    const bv = b.values[i];
    if (!Number.isFinite(av) || !Number.isFinite(bv)) {
      sum += 0.5;
      count += 1;
      continue;
    }
    sum += Math.abs(av - bv);
    count += 1;
  }

  return count > 0 ? sum / count : Number.POSITIVE_INFINITY;
}

function orientationDtwDistance(
  userFeatures: HandOrientationFeatures[],
  referenceFeatures: HandOrientationFeatures[],
  metadata: SignScoringMetadata
) {
  const n = userFeatures.length;
  const m = referenceFeatures.length;
  if (n === 0 || m === 0) return Number.POSITIVE_INFINITY;

  const window = adaptiveDtwWindowSize(n, m, metadata);
  if (Math.abs(n - m) > window) return Number.POSITIVE_INFINITY;
  const prev = new Float64Array(m + 1);
  const curr = new Float64Array(m + 1);

  for (let j = 0; j <= m; j += 1) {
    prev[j] = Number.POSITIVE_INFINITY;
  }
  prev[0] = 0;

  for (let i = 1; i <= n; i += 1) {
    curr[0] = Number.POSITIVE_INFINITY;
    const start = Math.max(1, i - window);
    const end = Math.min(m, i + window);

    for (let j = 1; j < start; j += 1) {
      curr[j] = Number.POSITIVE_INFINITY;
    }

    for (let j = start; j <= end; j += 1) {
      const cost = orientationFeatureDistance(
        userFeatures[i - 1],
        referenceFeatures[j - 1]
      );
      curr[j] = cost + Math.min(prev[j], curr[j - 1], prev[j - 1]);
    }

    for (let j = end + 1; j <= m; j += 1) {
      curr[j] = Number.POSITIVE_INFINITY;
    }

    prev.set(curr);
  }

  return prev[m] / Math.max(1, n + m);
}

function orientationSequenceFeatures(
  sequence: Sequence,
  side: "left" | "right"
) {
  const features: HandOrientationFeatures[] = [];
  for (const frame of sequence) {
    const hand = side === "left" ? frame.leftHand : frame.rightHand;
    const frameFeatures = extractHandOrientationFeatures(hand);
    if (frameFeatures) features.push(frameFeatures);
  }
  return features;
}

function scoreOrientationSide(
  userSeq: Sequence,
  referenceSeq: Sequence,
  side: "left" | "right",
  metadata: SignScoringMetadata
) {
  const required = isHandShapeRequired(side, metadata);
  const userFeatures = orientationSequenceFeatures(userSeq, side);
  const referenceFeatures = orientationSequenceFeatures(referenceSeq, side);

  if (userFeatures.length === 0 || referenceFeatures.length === 0) {
    return required ? 0 : null;
  }

  const averageCost = orientationDtwDistance(
    userFeatures,
    referenceFeatures,
    metadata
  );
  return distanceToScore(averageCost, 95);
}

function calculateOrientationScores(
  userSeq: Sequence,
  referenceSeq: Sequence,
  metadata: SignScoringMetadata
): HandOrientationScoreBreakdown {
  const leftHandOrientationScore = scoreOrientationSide(
    userSeq,
    referenceSeq,
    "left",
    metadata
  );
  const rightHandOrientationScore = scoreOrientationSide(
    userSeq,
    referenceSeq,
    "right",
    metadata
  );
  const availableScores = [
    leftHandOrientationScore,
    rightHandOrientationScore,
  ].filter((score): score is number => typeof score === "number");
  const overallOrientationScore =
    availableScores.length > 0
      ? Math.round(
          availableScores.reduce((sum, score) => sum + score, 0) /
            availableScores.length
        )
      : null;

  return {
    leftHandOrientationScore,
    rightHandOrientationScore,
    overallOrientationScore,
  };
}

function phaseWindowSize(sequenceLength: number) {
  return clamp(Math.round(sequenceLength * 0.15), 2, 8);
}

function averageFrameDistanceScore(
  userFrames: Sequence,
  referenceFrames: Sequence,
  metadata: SignScoringMetadata,
  sensitivity: number
) {
  const normalizedUser = normalizeSequence(userFrames);
  const normalizedReference = normalizeSequence(referenceFrames);
  const len = Math.min(normalizedUser.length, normalizedReference.length);

  if (len === 0) return null;

  let sum = 0;
  for (let i = 0; i < len; i += 1) {
    sum += frameDistance(normalizedUser[i], normalizedReference[i], metadata);
  }

  return distanceToScore(sum / len, sensitivity);
}

function phaseWeights(metadata: SignScoringMetadata) {
  const startPoseWeight = Math.max(metadata.startPoseWeight, 0.01);
  const motionWeight = Math.max(metadata.motionWeight, 0.01);
  const endPoseWeight = Math.max(metadata.endPoseWeight, 0.01);
  const total = startPoseWeight + motionWeight + endPoseWeight;

  return {
    startPoseWeight: startPoseWeight / total,
    motionWeight: motionWeight / total,
    endPoseWeight: endPoseWeight / total,
  };
}

function calculatePhaseScores(
  userSeq: Sequence,
  referenceSeq: Sequence,
  metadata: SignScoringMetadata
): PhaseScoreBreakdown {
  const startWindow = Math.min(
    phaseWindowSize(referenceSeq.length),
    userSeq.length,
    referenceSeq.length
  );
  const endWindow = startWindow;
  const userStart = userSeq.slice(0, startWindow);
  const referenceStart = referenceSeq.slice(0, startWindow);
  const userEnd = userSeq.slice(Math.max(0, userSeq.length - endWindow));
  const referenceEnd = referenceSeq.slice(
    Math.max(0, referenceSeq.length - endWindow)
  );
  const userMotion = userSeq.slice(
    startWindow,
    Math.max(startWindow, userSeq.length - endWindow)
  );
  const referenceMotion = referenceSeq.slice(
    startWindow,
    Math.max(startWindow, referenceSeq.length - endWindow)
  );
  const startPoseScore = averageFrameDistanceScore(
    userStart,
    referenceStart,
    metadata,
    difficultySensitivity(metadata) * 1.2
  );
  const endPoseScore = averageFrameDistanceScore(
    userEnd,
    referenceEnd,
    metadata,
    difficultySensitivity(metadata) * 1.2
  );
  const motionScore =
    userMotion.length > 0 && referenceMotion.length > 0
      ? calculateSignScoreDetails(userMotion, referenceMotion, metadata).score
      : calculateSignScoreDetails(userSeq, referenceSeq, metadata).score;
  const weights = phaseWeights(metadata);
  const feedback = phaseFeedback(
    startPoseScore,
    motionScore,
    endPoseScore,
    weights
  );

  return {
    startPoseScore,
    motionScore,
    endPoseScore,
    phaseWeights: weights,
    feedback,
  };
}

function scoringComponentWeights(
  metadata: SignScoringMetadata
): ScoringComponentWeights {
  return {
    handShape: metadata.handShapeWeight,
    handPosition: metadata.positionWeight,
    motionPath: metadata.motionWeight,
    handOrientation: metadata.orientationWeight,
    timing: metadata.timingWeight,
    startPose: metadata.startPoseWeight,
    endPose: metadata.endPoseWeight,
    bodyArmPosture: metadata.bodyArmPostureWeight,
  };
}

function averageSelectedPointScore(
  userSeq: Sequence,
  referenceSeq: Sequence,
  metadata: SignScoringMetadata,
  selectors: Array<(frame: NormalizedFrame) => number[]>,
  pointIndices: number[]
) {
  const normalizedUser = normalizeSequence(userSeq);
  const normalizedReference = normalizeSequence(referenceSeq);
  const len = Math.min(normalizedUser.length, normalizedReference.length);

  if (len === 0) return null;

  let total = 0;
  let comparisons = 0;

  for (let i = 0; i < len; i += 1) {
    for (const select of selectors) {
      const userValues = select(normalizedUser[i]);
      const referenceValues = select(normalizedReference[i]);

      for (const index of pointIndices) {
        const userPoint = readPoint(userValues, index);
        const referencePoint = readPoint(referenceValues, index);

        if (!userPoint || !referencePoint) {
          total += 1;
        } else {
          total += landmarkDistance(userPoint, referencePoint);
        }
        comparisons += 1;
      }
    }
  }

  if (comparisons === 0) return null;

  return distanceToScore(total / comparisons, difficultySensitivity(metadata));
}

function calculateHandPositionScore(
  userSeq: Sequence,
  referenceSeq: Sequence,
  metadata: SignScoringMetadata
) {
  const selectors: Array<(frame: NormalizedFrame) => number[]> = [];

  if (metadata.requiredHands !== "right" && metadata.requiredHands !== "none") {
    selectors.push((frame) => frame.leftHand);
  }
  if (metadata.requiredHands !== "left" && metadata.requiredHands !== "none") {
    selectors.push((frame) => frame.rightHand);
  }
  if (selectors.length === 0 && metadata.requiredHands !== "none") {
    selectors.push((frame) => frame.leftHand, (frame) => frame.rightHand);
  }

  return averageSelectedPointScore(userSeq, referenceSeq, metadata, selectors, [
    HAND_WRIST_INDEX,
    HAND_THUMB_TIP,
    HAND_INDEX_TIP,
    HAND_MIDDLE_TIP,
    HAND_RING_TIP,
    HAND_PINKY_TIP,
  ]);
}

function calculateBodyArmPostureScore(
  userSeq: Sequence,
  referenceSeq: Sequence,
  metadata: SignScoringMetadata
) {
  return averageSelectedPointScore(
    userSeq,
    referenceSeq,
    metadata,
    [(frame) => frame.pose],
    [
      POSE_LEFT_SHOULDER_INDEX,
      POSE_RIGHT_SHOULDER_INDEX,
      POSE_LEFT_ELBOW_INDEX,
      POSE_RIGHT_ELBOW_INDEX,
      POSE_LEFT_WRIST_INDEX,
      POSE_RIGHT_WRIST_INDEX,
    ]
  );
}

function requiredHandSides(metadata: SignScoringMetadata): Array<"left" | "right"> {
  if (metadata.requiredHands === "both") return ["left", "right"];
  if (metadata.requiredHands === "left") return ["left"];
  if (metadata.requiredHands === "right") return ["right"];
  if (metadata.requiredHands === "any" && metadata.dominantHand) {
    return [metadata.dominantHand];
  }
  return [];
}

function sequenceHasHand(sequence: Sequence, side: "left" | "right") {
  if (sequence.length === 0) return false;

  const detectedFrames = handShapeSequenceFeatures(sequence, side).length;
  return detectedFrames / sequence.length >= 0.2;
}

function isRequiredHandMissing(
  sequence: Sequence,
  metadata: SignScoringMetadata
) {
  const requiredSides = requiredHandSides(metadata);

  if (requiredSides.length > 0) {
    return requiredSides.some((side) => !sequenceHasHand(sequence, side));
  }

  if (metadata.requiredHands === "any") {
    return !sequenceHasHand(sequence, "left") && !sequenceHasHand(sequence, "right");
  }

  return false;
}

function handShapeWeightRatio(metadata: SignScoringMetadata) {
  const weights = scoringComponentWeights(metadata);
  const total = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  return total <= EPSILON ? 0 : weights.handShape / total;
}

function aggregateFinalScore(
  rawComponentScores: ScoringComponentScores,
  metadata: SignScoringMetadata,
  requiredHandMissing: boolean
): FinalScoreAggregation {
  const componentWeights = scoringComponentWeights(metadata);
  const entries = Object.entries(rawComponentScores) as Array<
    [keyof ScoringComponentScores, number | null]
  >;
  const weightedEntries = entries
    .map(([key, score]) => ({
      key,
      score,
      weight: componentWeights[key],
    }))
    .filter(
      (entry): entry is { key: keyof ScoringComponentScores; score: number; weight: number } =>
        entry.score !== null && entry.weight > 0
    );
  const totalWeight = weightedEntries.reduce(
    (sum, entry) => sum + entry.weight,
    0
  );

  // Formula:
  // 1. Keep every component on the same 0-100 scale.
  // 2. Drop unavailable optional components by removing their weight.
  // 3. Compute the normalized weighted average.
  // 4. Apply hard caps for minimum requirements that should never pass.
  const weightedScoreBeforeCaps =
    totalWeight <= EPSILON
      ? 0
      : weightedEntries.reduce(
          (sum, entry) => sum + entry.score * entry.weight,
          0
        ) / totalWeight;
  const caps: ScoreCapDiagnostics = {
    requiredHandMissing,
    requiredHandCap: requiredHandMissing
      ? metadata.requiredHandMissingScoreCap
      : null,
    trackingQualityBlocked: false,
    unrelatedMotion:
      (rawComponentScores.motionPath ?? 100) <
      metadata.motionSimilarityCriticalThreshold,
    unrelatedMotionCap: null,
    handShapeCriticalMiss:
      handShapeWeightRatio(metadata) >= 0.25 &&
      (rawComponentScores.handShape ?? 100) <
        metadata.handShapeCriticalThreshold,
    handShapeCap: null,
    appliedCaps: [],
  };

  let finalScore = weightedScoreBeforeCaps;

  if (caps.requiredHandMissing) {
    finalScore = Math.min(finalScore, metadata.requiredHandMissingScoreCap);
    caps.appliedCaps.push("required_hand_missing");
  }
  if (caps.unrelatedMotion) {
    caps.unrelatedMotionCap = metadata.unrelatedMotionScoreCap;
    finalScore = Math.min(finalScore, metadata.unrelatedMotionScoreCap);
    caps.appliedCaps.push("unrelated_motion");
  }
  if (caps.handShapeCriticalMiss) {
    caps.handShapeCap = metadata.wrongHandShapeScoreCap;
    finalScore = Math.min(finalScore, metadata.wrongHandShapeScoreCap);
    caps.appliedCaps.push("critical_hand_shape_miss");
  }

  return {
    rawComponentScores,
    componentWeights,
    weightedScoreBeforeCaps: Math.round(clamp(weightedScoreBeforeCaps, 0, 100)),
    finalScore: Math.round(clamp(finalScore, 0, 100)),
    caps,
  };
}

function phaseFeedback(
  startPoseScore: number | null,
  motionScore: number | null,
  endPoseScore: number | null,
  weights: PhaseScoreBreakdown["phaseWeights"]
) {
  const feedback: string[] = [];
  const strictThreshold = 68;
  const motionThreshold = 62;

  if (startPoseScore !== null && startPoseScore < strictThreshold) {
    feedback.push("Your starting hand position is incorrect.");
  }
  if (motionScore !== null && motionScore < motionThreshold) {
    feedback.push("Your movement path does not match the reference yet.");
  }
  if (endPoseScore !== null && endPoseScore < strictThreshold) {
    if (motionScore !== null && motionScore >= motionThreshold) {
      feedback.push(
        "Your movement path is close, but the final hand position is wrong."
      );
    } else {
      feedback.push("Your final hand position is incorrect.");
    }
  }
  if (
    weights.motionWeight > weights.startPoseWeight &&
    weights.motionWeight > weights.endPoseWeight &&
    motionScore !== null &&
    motionScore >= motionThreshold &&
    endPoseScore !== null &&
    endPoseScore >= strictThreshold &&
    startPoseScore !== null &&
    startPoseScore >= strictThreshold
  ) {
    feedback.push("Your sign phases look consistent.");
  }

  return feedback;
}

function buildScoringFeedback(
  phaseScores: PhaseScoreBreakdown,
  alignmentDiagnostics: DtwAlignmentDiagnostics,
  finalScoreAggregation: FinalScoreAggregation
) {
  const feedback = [...phaseScores.feedback];

  if (alignmentDiagnostics.timingSimilarityScore < 60) {
    feedback.push("You performed the sign too slowly or too quickly.");
  }
  if (finalScoreAggregation.caps.requiredHandMissing) {
    feedback.push("A required hand was not detected clearly enough.");
  }
  if (finalScoreAggregation.caps.unrelatedMotion) {
    feedback.push("Your movement does not appear to match the reference sign.");
  }
  if (finalScoreAggregation.caps.handShapeCriticalMiss) {
    feedback.push("Your hand shape is too different for this sign.");
  }

  return feedback;
}

function resolveRuntimeOptions(
  options?: Partial<SignScoringRuntimeOptions> | null
): SignScoringRuntimeOptions {
  return {
    ...DEFAULT_SIGN_SCORING_RUNTIME_OPTIONS,
    ...(options ?? {}),
  };
}

function buildMirrorDiagnostics(
  mirrorModeUsed: MirrorModeUsed,
  originalScore: number,
  flippedScore: number,
  selectedScore: number,
  handednessPenalty: number,
  runtimeOptions: SignScoringRuntimeOptions
): SegmentedSignScoreResult["mirrorDiagnostics"] {
  return {
    mirrorModeUsed,
    originalScore,
    flippedScore,
    selectedScore,
    handednessPenalty,
    webcamPreviewMirrored: runtimeOptions.webcamPreviewMirrored,
    landmarkCoordinatesMirrored: runtimeOptions.landmarkCoordinatesMirrored,
  };
}

function evaluateScoringCandidate(
  userSeq: Sequence,
  referenceSeq: Sequence,
  metadata: SignScoringMetadata
) {
  const landmark = calculateSignScoreDetails(userSeq, referenceSeq, metadata);
  const handShapeScores = calculateHandShapeScores(
    userSeq,
    referenceSeq,
    metadata
  );
  const orientationScores = calculateOrientationScores(
    userSeq,
    referenceSeq,
    metadata
  );
  const phaseScores = calculatePhaseScores(userSeq, referenceSeq, metadata);
  const rawComponentScores: ScoringComponentScores = {
    handShape: handShapeScores.overallHandShapeScore,
    handPosition:
      calculateHandPositionScore(userSeq, referenceSeq, metadata) ??
      landmark.score,
    motionPath: phaseScores.motionScore ?? landmark.score,
    handOrientation: orientationScores.overallOrientationScore,
    timing: landmark.diagnostics.timingSimilarityScore,
    startPose: phaseScores.startPoseScore,
    endPose: phaseScores.endPoseScore,
    bodyArmPosture:
      calculateBodyArmPostureScore(userSeq, referenceSeq, metadata) ??
      landmark.score,
  };
  const finalScoreAggregation = aggregateFinalScore(
    rawComponentScores,
    metadata,
    isRequiredHandMissing(userSeq, metadata)
  );

  return {
    score: finalScoreAggregation.finalScore,
    landmarkScore: landmark.score,
    alignmentDiagnostics: landmark.diagnostics,
    handShapeScore: handShapeScores.overallHandShapeScore,
    handShapeScores,
    orientationScore: orientationScores.overallOrientationScore,
    orientationScores,
    phaseScores,
    componentScores: rawComponentScores,
    finalScoreAggregation,
  };
}

function selectMirrorAwareScore(
  userSeq: Sequence,
  referenceSeq: Sequence,
  metadata: SignScoringMetadata,
  runtimeOptions: SignScoringRuntimeOptions
) {
  const canonicalUserSeq = runtimeOptions.landmarkCoordinatesMirrored
    ? flipSequenceHorizontally(userSeq)
    : userSeq;
  const flippedUserSeq = flipSequenceHorizontally(canonicalUserSeq);
  const original = evaluateScoringCandidate(
    canonicalUserSeq,
    referenceSeq,
    metadata
  );
  const originalScore = original.score;
  const flipped = evaluateScoringCandidate(
    flippedUserSeq,
    referenceSeq,
    metadata
  );
  const flippedScore = flipped.score;

  if (metadata.requiresExactHandedness) {
    const handednessPenalty = Math.round(
      clamp(flippedScore - originalScore, 0, 25)
    );
    const selectedScore = Math.max(0, originalScore - handednessPenalty);
    const finalScoreAggregation = {
      ...original.finalScoreAggregation,
      finalScore: selectedScore,
    };

    return {
      selectedScore,
      selectedLandmarkScore: original.landmarkScore,
      selectedAlignmentDiagnostics: original.alignmentDiagnostics,
      selectedHandShapeScore: original.handShapeScore,
      selectedHandShapeScores: original.handShapeScores,
      selectedOrientationScore: original.orientationScore,
      selectedOrientationScores: original.orientationScores,
      selectedPhaseScores: original.phaseScores,
      selectedComponentScores: original.componentScores,
      selectedFinalScoreAggregation: finalScoreAggregation,
      mirrorUsed: false,
      diagnostics: buildMirrorDiagnostics(
        "exact-handedness",
        originalScore,
        flippedScore,
        selectedScore,
        handednessPenalty,
        runtimeOptions
      ),
    };
  }

  if (!metadata.allowMirror) {
    return {
      selectedScore: originalScore,
      selectedLandmarkScore: original.landmarkScore,
      selectedAlignmentDiagnostics: original.alignmentDiagnostics,
      selectedHandShapeScore: original.handShapeScore,
      selectedHandShapeScores: original.handShapeScores,
      selectedOrientationScore: original.orientationScore,
      selectedOrientationScores: original.orientationScores,
      selectedPhaseScores: original.phaseScores,
      selectedComponentScores: original.componentScores,
      selectedFinalScoreAggregation: original.finalScoreAggregation,
      mirrorUsed: false,
      diagnostics: buildMirrorDiagnostics(
        "mirror-disabled",
        originalScore,
        flippedScore,
        originalScore,
        0,
        runtimeOptions
      ),
    };
  }

  const mirrorUsed = flippedScore > originalScore;
  const selectedScore = mirrorUsed ? flippedScore : originalScore;
  const selectedLandmarkScore = mirrorUsed
    ? flipped.landmarkScore
    : original.landmarkScore;
  const selectedAlignmentDiagnostics = mirrorUsed
    ? flipped.alignmentDiagnostics
    : original.alignmentDiagnostics;
  const selectedHandShapeScores = mirrorUsed ? flipped.handShapeScores : original.handShapeScores;
  const selectedOrientationScores = mirrorUsed
    ? flipped.orientationScores
    : original.orientationScores;
  const selectedPhaseScores = mirrorUsed ? flipped.phaseScores : original.phaseScores;
  const selectedComponentScores = mirrorUsed
    ? flipped.componentScores
    : original.componentScores;
  const selectedFinalScoreAggregation = mirrorUsed
    ? flipped.finalScoreAggregation
    : original.finalScoreAggregation;

  return {
    selectedScore,
    selectedLandmarkScore,
    selectedAlignmentDiagnostics,
    selectedHandShapeScore: selectedHandShapeScores.overallHandShapeScore,
    selectedHandShapeScores,
    selectedOrientationScore:
      selectedOrientationScores.overallOrientationScore,
    selectedOrientationScores,
    selectedPhaseScores,
    selectedComponentScores,
    selectedFinalScoreAggregation,
    mirrorUsed,
    diagnostics: buildMirrorDiagnostics(
      mirrorUsed ? "flipped" : "original",
      originalScore,
      flippedScore,
      selectedScore,
      0,
      runtimeOptions
    ),
  };
}

function findConsecutiveAbove(
  motion: number[],
  threshold: number,
  count: number
) {
  let streak = 0;
  for (let i = 0; i < motion.length; i += 1) {
    streak = motion[i] >= threshold ? streak + 1 : 0;
    if (streak >= count) {
      return i - count + 1;
    }
  }
  return -1;
}

function findConsecutiveBelowAfter(
  motion: number[],
  startIndex: number,
  threshold: number,
  count: number
) {
  let streak = 0;
  for (let i = startIndex; i < motion.length; i += 1) {
    streak = motion[i] <= threshold ? streak + 1 : 0;
    if (streak >= count) {
      return i - count;
    }
  }
  return motion.length - 1;
}

function buildSegmentationResult(
  sequence: Sequence,
  startFrame: number,
  endFrame: number,
  confidence: number,
  reason: GestureSegmentationFailureReason | null,
  usedFallback: boolean,
  motion: number[],
  minSegmentFrames: number
): GestureSegmentationResult {
  const duration = Math.max(0, endFrame - startFrame + 1);
  const isTooShort = duration < minSegmentFrames;
  const finalReason =
    reason === "empty_sequence"
      ? reason
      : isTooShort
        ? "segment_too_short"
        : reason;
  const peakMotion = motion.length > 0 ? Math.max(...motion) : 0;
  const averageMotion =
    motion.length > 0
      ? motion.reduce((sum, value) => sum + value, 0) / motion.length
      : 0;
  const metadata = {
    startFrame,
    endFrame,
    duration,
    segmentationConfidence: isTooShort ? 0 : confidence,
    reason: finalReason,
    usedFallback,
    motionFrameCount: motion.filter((value) => value > 0).length,
    peakMotion,
    averageMotion,
  };

  return {
    ok: !isTooShort,
    sequence: isTooShort ? [] : sequence.slice(startFrame, endFrame + 1),
    metadata,
  };
}

export function segmentGestureSequence(
  sequence: Sequence,
  configOverrides: Partial<GestureSegmentationConfig> = {}
): GestureSegmentationResult {
  const config = {
    ...DEFAULT_GESTURE_SEGMENTATION_CONFIG,
    ...configOverrides,
  };

  if (sequence.length === 0) {
    return buildSegmentationResult(
      sequence,
      0,
      -1,
      0,
      "empty_sequence",
      true,
      [],
      config.minSegmentFrames
    );
  }

  const motion = computeWristMotion(sequence);
  const detectedStart = findConsecutiveAbove(
    motion,
    config.motionStartThreshold,
    config.startConsecutiveFrames
  );

  if (detectedStart < 0) {
    return buildSegmentationResult(
      sequence,
      0,
      sequence.length - 1,
      0.25,
      "no_clear_movement",
      true,
      motion,
      config.minSegmentFrames
    );
  }

  const detectedEnd = findConsecutiveBelowAfter(
    motion,
    detectedStart + config.startConsecutiveFrames,
    config.motionEndThreshold,
    config.endConsecutiveFrames
  );
  const startFrame = Math.max(0, detectedStart - config.paddingFrames);
  const endFrame = Math.min(
    sequence.length - 1,
    Math.max(detectedStart, detectedEnd) + config.paddingFrames
  );
  const activeMotionCount = motion
    .slice(startFrame, endFrame + 1)
    .filter((value) => value >= config.motionEndThreshold).length;
  const segmentDuration = Math.max(1, endFrame - startFrame + 1);
  const confidence = Math.max(
    0.35,
    Math.min(1, activeMotionCount / segmentDuration + 0.35)
  );

  return buildSegmentationResult(
    sequence,
    startFrame,
    endFrame,
    confidence,
    null,
    false,
    motion,
    config.minSegmentFrames
  );
}

export function validateStudentSequenceQuality(
  sequence: Sequence,
  configOverrides: Partial<StudentQualityCheckConfig> = {}
): StudentQualityCheckResult {
  const config = {
    ...DEFAULT_STUDENT_QUALITY_CONFIG,
    ...configOverrides,
  };
  const totalFrames = sequence.length;
  let poseFrames = 0;
  let leftHandFrames = 0;
  let rightHandFrames = 0;
  let bothHandsFrames = 0;
  let validFrames = 0;
  let leftInsideSum = 0;
  let leftInsideCount = 0;
  let rightInsideSum = 0;
  let rightInsideCount = 0;

  for (const frame of sequence) {
    const poseDetected = hasPose(frame, config);
    const leftDetected = hasHand(frame.leftHand, config);
    const rightDetected = hasHand(frame.rightHand, config);
    const leftInsideRatio = handInsideRatio(frame.leftHand, config);
    const rightInsideRatio = handInsideRatio(frame.rightHand, config);
    const leftInside =
      leftDetected && leftInsideRatio >= config.minInsideHandLandmarkRatio;
    const rightInside =
      rightDetected && rightInsideRatio >= config.minInsideHandLandmarkRatio;

    if (poseDetected) poseFrames += 1;
    if (leftDetected) {
      leftHandFrames += 1;
      leftInsideSum += leftInsideRatio;
      leftInsideCount += 1;
    }
    if (rightDetected) {
      rightHandFrames += 1;
      rightInsideSum += rightInsideRatio;
      rightInsideCount += 1;
    }
    if (leftDetected && rightDetected) bothHandsFrames += 1;
    // Sequence-level quality should tolerate brief MediaPipe dropouts. A frame
    // is valid when pose and at least the required visible hand side are present;
    // inside-frame checks are evaluated as ratios below instead of per frame.
    if (
      poseDetected &&
      requiredHandsPresentForQuality(leftDetected, rightDetected, config)
    ) {
      validFrames += 1;
    }
  }

  const confidence = collectConfidenceStats(sequence, config);
  const leftHandFrameRatio =
    totalFrames > 0 ? leftHandFrames / totalFrames : 0;
  const rightHandFrameRatio =
    totalFrames > 0 ? rightHandFrames / totalFrames : 0;
  const mirroredLeftHandFrameRatio = config.allowMirroredHands
    ? Math.max(leftHandFrameRatio, rightHandFrameRatio)
    : leftHandFrameRatio;
  const mirroredRightHandFrameRatio = config.allowMirroredHands
    ? Math.max(rightHandFrameRatio, leftHandFrameRatio)
    : rightHandFrameRatio;
  const leftHandInsideRatio =
    leftInsideCount > 0 ? leftInsideSum / leftInsideCount : 0;
  const rightHandInsideRatio =
    rightInsideCount > 0 ? rightInsideSum / rightInsideCount : 0;
  const mirroredLeftInsideRatio = config.allowMirroredHands
    ? Math.max(leftHandInsideRatio, rightHandInsideRatio)
    : leftHandInsideRatio;
  const mirroredRightInsideRatio = config.allowMirroredHands
    ? Math.max(rightHandInsideRatio, leftHandInsideRatio)
    : rightHandInsideRatio;
  const metrics = {
    totalFrames,
    validFrames,
    validFrameRatio: totalFrames > 0 ? validFrames / totalFrames : 0,
    poseDetected: poseFrames > 0,
    leftHandDetected: leftHandFrames > 0,
    rightHandDetected: rightHandFrames > 0,
    poseFrameRatio: totalFrames > 0 ? poseFrames / totalFrames : 0,
    leftHandFrameRatio,
    rightHandFrameRatio,
    leftHandValidFrameRatio: leftHandFrameRatio,
    rightHandValidFrameRatio: rightHandFrameRatio,
    bothHandsFrameRatio: totalFrames > 0 ? bothHandsFrames / totalFrames : 0,
    averageConfidence: confidence.averageConfidence,
    averagePoseConfidence: confidence.averagePoseConfidence,
    averageLeftHandConfidence: confidence.averageLeftHandConfidence,
    averageRightHandConfidence: confidence.averageRightHandConfidence,
    poseConfidenceSource: confidence.poseConfidenceSource,
    leftHandConfidenceSource: confidence.leftHandConfidenceSource,
    rightHandConfidenceSource: confidence.rightHandConfidenceSource,
    leftHandInsideRatio,
    rightHandInsideRatio,
    handsInsideFrameRatio: Math.max(leftHandInsideRatio, rightHandInsideRatio),
    finalFailureReason: null,
  };

  const fail = (
    issue: StudentQualityIssue,
    message: string
  ): StudentQualityCheckResult => {
    const result = buildQualityResult(issue, message, metrics);
    if (config.debugLogs) {
      console.debug("[sign-scoring] quality check failed", result);
    }
    return result;
  };

  if (metrics.poseFrameRatio < config.minValidFrameRatio) {
    return fail(
      "no_pose",
      "Please face the camera clearly."
    );
  }

  if (
    (config.handRequirement === "left" || config.handRequirement === "both") &&
    mirroredLeftHandFrameRatio < config.minValidFrameRatio
  ) {
    return fail(
      "missing_left_hand",
      "Left hand is not detected."
    );
  }

  if (
    (config.handRequirement === "right" || config.handRequirement === "both") &&
    mirroredRightHandFrameRatio < config.minValidFrameRatio
  ) {
    return fail(
      "missing_right_hand",
      "Right hand is not detected."
    );
  }

  if (
    config.handRequirement === "any" &&
    metrics.leftHandFrameRatio < config.minValidFrameRatio &&
    metrics.rightHandFrameRatio < config.minValidFrameRatio
  ) {
    return fail(
      "missing_required_hand",
      "Hand is not detected."
    );
  }

  if (confidence.averagePoseConfidence < config.minAverageConfidence) {
    return fail(
      "low_confidence",
      "Camera tracking quality is too low."
    );
  }

  if (
    (config.handRequirement === "left" || config.handRequirement === "both") &&
    mirroredLeftInsideRatio < config.minInsideHandLandmarkRatio
  ) {
    return fail(
      "hands_out_of_frame",
      "Please move your hands into the camera frame."
    );
  }

  if (
    (config.handRequirement === "right" || config.handRequirement === "both") &&
    mirroredRightInsideRatio < config.minInsideHandLandmarkRatio
  ) {
    return fail(
      "hands_out_of_frame",
      "Please move your hands into the camera frame."
    );
  }

  if (
    config.handRequirement === "any" &&
    Math.max(metrics.leftHandInsideRatio, metrics.rightHandInsideRatio) <
      config.minInsideHandLandmarkRatio
  ) {
    return fail(
      "hands_out_of_frame",
      "Please move your hands into the camera frame."
    );
  }

  if (
    validFrames < config.minValidFrames ||
    metrics.validFrameRatio < config.minValidFrameRatio
  ) {
    return fail(
      "not_enough_valid_frames",
      "Not enough valid frames to score."
    );
  }

  const result = buildQualityResult(null, null, metrics);
  if (config.debugLogs) {
    console.debug("[sign-scoring] quality check passed", result);
  }
  return result;
}

export function calculateSignScore(
  userSeq: Sequence,
  videoSeq: Sequence,
  metadataInput?: SignScoringMetadataInput | null
): number {
  return calculateSignScoreDetails(userSeq, videoSeq, metadataInput).score;
}

function calculateSignScoreDetails(
  userSeq: Sequence,
  videoSeq: Sequence,
  metadataInput?: SignScoringMetadataInput | null
) {
  const metadata = resolveSignScoringMetadata(metadataInput);
  const normalizedUser = normalizeSequence(userSeq);
  const normalizedVideo = normalizeSequence(videoSeq);
  const userMotion = calculateSequenceMotion(normalizedUser);
  const videoMotion = calculateSequenceMotion(normalizedVideo);
  const motionRatioThreshold =
    MOTION_RATIO_THRESHOLD * Math.max(0.5, metadata.motionWeight + 0.5);

  if (
    videoMotion > MOTION_MIN_REFERENCE &&
    userMotion < videoMotion * motionRatioThreshold
  ) {
    const diagnostics = buildAlignmentDiagnostics(
      Number.POSITIVE_INFINITY,
      normalizedUser.length,
      normalizedVideo.length,
      adaptiveDtwWindowSize(normalizedUser.length, normalizedVideo.length, metadata),
      metadata,
      sequenceComponentDiagnostics(normalizedUser, normalizedVideo, metadata)
    );
    return {
      score: MOTION_FAIL_SCORE,
      diagnostics: {
        ...diagnostics,
        finalScore: MOTION_FAIL_SCORE,
      },
    };
  }
  const alignment = dtwAlignment(normalizedUser, normalizedVideo, metadata);
  const averageCost = alignment.diagnostics.averageCost;

  let score = alignment.diagnostics.baseScore;
  if (alignment.diagnostics.sequenceLengthRatio >= TIMING_RATIO_THRESHOLD) {
    score = Math.max(0, score - alignment.diagnostics.timingPenalty);
  }

  return {
    score,
    diagnostics: {
      ...alignment.diagnostics,
      averageCost,
      finalScore: score,
    },
  };
}

function segmentationFailureMessage(metadata: GestureSegmentationMetadata) {
  switch (metadata.reason) {
    case "empty_sequence":
      return "Not enough valid frames to score.";
    case "segment_too_short":
      return "The sign movement is too short to score.";
    case "no_clear_movement":
      return "No clear sign movement was detected.";
    default:
      return null;
  }
}

function emptyHandShapeScores(): HandShapeScoreBreakdown {
  return {
    leftHandShapeScore: null,
    rightHandShapeScore: null,
    overallHandShapeScore: null,
  };
}

function emptyOrientationScores(): HandOrientationScoreBreakdown {
  return {
    leftHandOrientationScore: null,
    rightHandOrientationScore: null,
    overallOrientationScore: null,
  };
}

function emptyFeedback() {
  return [] as string[];
}

function emptyGestureSegmentationMetadata(): GestureSegmentationMetadata {
  return {
    startFrame: 0,
    endFrame: -1,
    duration: 0,
    segmentationConfidence: 0,
    reason: "empty_sequence",
    usedFallback: true,
    motionFrameCount: 0,
    peakMotion: 0,
    averageMotion: 0,
  };
}

function qualityRequirementForMetadata(metadata: SignScoringMetadata) {
  if (metadata.requiredHands === "any" && metadata.dominantHand) {
    return metadata.dominantHand;
  }
  return metadata.requiredHands;
}

function calculateAverageVelocity(sequence: Sequence) {
  const motion = computeWristMotion(sequence);
  if (motion.length === 0) return 0;
  return motion.reduce((sum, value) => sum + value, 0) / motion.length;
}

function calculateFeatureExtractionDiagnostics(
  sequence: Sequence
): FeatureExtractionDiagnostics {
  const normalized = normalizeSequence(sequence);
  const handPositionFrames = sequence.filter(
    (frame) => frame.leftHand.length > 0 || frame.rightHand.length > 0
  ).length;
  const jointAngleFrameCount = normalized.filter(
    (frame) => frame.angles.length > 0
  ).length;

  return {
    handPositionFrames,
    handShapeFrames: {
      left: handShapeSequenceFeatures(sequence, "left").length,
      right: handShapeSequenceFeatures(sequence, "right").length,
    },
    handOrientationFrames: {
      left: orientationSequenceFeatures(sequence, "left").length,
      right: orientationSequenceFeatures(sequence, "right").length,
    },
    jointAngleFrameCount,
    motionVolume: calculateSequenceMotion(normalized),
    averageVelocity: calculateAverageVelocity(sequence),
  };
}

function buildScoringDiagnostics(input: {
  scoringVersion: SignScoringVersion;
  trackingQuality: StudentQualityCheckResult | null;
  userSegmentation: GestureSegmentationMetadata | null;
  referenceSegmentation: GestureSegmentationMetadata | null;
  dtwDiagnostics: DtwAlignmentDiagnostics | null;
  featureExtraction: FeatureExtractionDiagnostics | null;
  componentScores: ScoringComponentScores | null;
  finalScore: number | null;
  feedbackMessages: string[];
  fallbackUsed?: boolean;
  fallbackReason?: string | null;
}): SignScoringDiagnostics {
  return {
    scoringVersion: input.scoringVersion,
    trackingQuality: input.trackingQuality,
    segmentationResult: {
      user: input.userSegmentation,
      reference: input.referenceSegmentation,
    },
    dtwDiagnostics: input.dtwDiagnostics,
    featureExtraction: input.featureExtraction,
    componentScores: input.componentScores,
    finalScore: input.finalScore,
    feedbackMessages: input.feedbackMessages,
    fallbackUsed: input.fallbackUsed ?? false,
    fallbackReason: input.fallbackReason ?? null,
  };
}

function emptyScoreResult(
  metadata: SignScoringMetadata,
  runtimeOptions: SignScoringRuntimeOptions,
  input: {
    message: string | null;
    trackingQuality?: StudentQualityCheckResult | null;
    userSegmentation?: GestureSegmentationMetadata;
    referenceSegmentation?: GestureSegmentationMetadata;
    fallbackUsed?: boolean;
    fallbackReason?: string | null;
  }
): SegmentedSignScoreResult {
  const userSegmentation =
    input.userSegmentation ?? emptyGestureSegmentationMetadata();
  const referenceSegmentation =
    input.referenceSegmentation ?? emptyGestureSegmentationMetadata();

  return {
    ok: false,
    scoringVersion: metadata.scoringVersion,
    score: null,
    landmarkScore: null,
    handShapeScore: null,
    orientationScore: null,
    timingSimilarityScore: null,
    alignmentDiagnostics: null,
    phaseScores: null,
    componentScores: null,
    finalScoreAggregation: null,
    feedback: emptyFeedback(),
    diagnostics: buildScoringDiagnostics({
      scoringVersion: metadata.scoringVersion,
      trackingQuality: input.trackingQuality ?? null,
      userSegmentation,
      referenceSegmentation,
      dtwDiagnostics: null,
      featureExtraction: null,
      componentScores: null,
      finalScore: null,
      feedbackMessages: emptyFeedback(),
      fallbackUsed: input.fallbackUsed,
      fallbackReason: input.fallbackReason,
    }),
    trackingQuality: input.trackingQuality ?? null,
    message: input.message,
    minPassingScore: metadata.minPassingScore,
    passed: false,
    mirrorUsed: false,
    mirrorDiagnostics: buildMirrorDiagnostics(
      "original",
      0,
      0,
      0,
      0,
      runtimeOptions
    ),
    handShapeScores: emptyHandShapeScores(),
    orientationScores: emptyOrientationScores(),
    scoringMetadata: metadata,
    userSegmentation,
    referenceSegmentation,
  };
}

function calculateV1SegmentedSignScore(
  userSeq: Sequence,
  videoSeq: Sequence,
  metadata: SignScoringMetadata,
  runtimeOptions: SignScoringRuntimeOptions
): SegmentedSignScoreResult {
  const legacy = calculateSignScoreDetails(userSeq, videoSeq, metadata);
  const score = legacy.score;
  const feedback =
    legacy.diagnostics.timingSimilarityScore < 60
      ? ["You performed the sign too slowly or too quickly."]
      : emptyFeedback();
  const componentScores: ScoringComponentScores = {
    handShape: null,
    handPosition: score,
    motionPath: score,
    handOrientation: null,
    timing: legacy.diagnostics.timingSimilarityScore,
    startPose: null,
    endPose: null,
    bodyArmPosture: null,
  };
  const fullUserSegmentation: GestureSegmentationMetadata = {
    startFrame: 0,
    endFrame: Math.max(0, userSeq.length - 1),
    duration: userSeq.length,
    segmentationConfidence: 1,
    reason: null,
    usedFallback: true,
    motionFrameCount: userSeq.length,
    peakMotion: 0,
    averageMotion: calculateAverageVelocity(userSeq),
  };
  const fullReferenceSegmentation: GestureSegmentationMetadata = {
    startFrame: 0,
    endFrame: Math.max(0, videoSeq.length - 1),
    duration: videoSeq.length,
    segmentationConfidence: 1,
    reason: null,
    usedFallback: true,
    motionFrameCount: videoSeq.length,
    peakMotion: 0,
    averageMotion: calculateAverageVelocity(videoSeq),
  };

  return {
    ok: true,
    scoringVersion: "v1",
    score,
    landmarkScore: score,
    handShapeScore: null,
    orientationScore: null,
    timingSimilarityScore: legacy.diagnostics.timingSimilarityScore,
    alignmentDiagnostics: legacy.diagnostics,
    phaseScores: null,
    componentScores,
    finalScoreAggregation: null,
    feedback,
    diagnostics: buildScoringDiagnostics({
      scoringVersion: "v1",
      trackingQuality: null,
      userSegmentation: fullUserSegmentation,
      referenceSegmentation: fullReferenceSegmentation,
      dtwDiagnostics: legacy.diagnostics,
      featureExtraction: calculateFeatureExtractionDiagnostics(userSeq),
      componentScores,
      finalScore: score,
      feedbackMessages: feedback,
      fallbackUsed: true,
      fallbackReason: "scoringVersion=v1",
    }),
    trackingQuality: null,
    message: null,
    minPassingScore: metadata.minPassingScore,
    passed: score >= metadata.minPassingScore,
    mirrorUsed: false,
    mirrorDiagnostics: buildMirrorDiagnostics(
      "original",
      score,
      score,
      score,
      0,
      runtimeOptions
    ),
    handShapeScores: emptyHandShapeScores(),
    orientationScores: emptyOrientationScores(),
    scoringMetadata: metadata,
    userSegmentation: fullUserSegmentation,
    referenceSegmentation: fullReferenceSegmentation,
  };
}

function calculateV2SegmentedSignScore(
  userSeq: Sequence,
  videoSeq: Sequence,
  configOverrides: Partial<GestureSegmentationConfig>,
  metadata: SignScoringMetadata,
  runtimeOptions: SignScoringRuntimeOptions,
  qualityConfigOverrides: Partial<StudentQualityCheckConfig> = {}
): SegmentedSignScoreResult {
  // Stage 1: reject poor camera/landmark input before computing a score.
  const trackingQuality = validateStudentSequenceQuality(userSeq, {
    ...qualityConfigOverrides,
    handRequirement:
      qualityConfigOverrides.handRequirement ??
      qualityRequirementForMetadata(metadata),
  });

  if (!trackingQuality.ok) {
    return emptyScoreResult(metadata, runtimeOptions, {
      message: trackingQuality.message,
      trackingQuality,
    });
  }

  // Stage 2: trim idle frames so DTW sees the sign, not preparation/cleanup.
  const userSegmentation = segmentGestureSequence(userSeq, configOverrides);
  const referenceSegmentation = segmentGestureSequence(videoSeq, configOverrides);

  if (!userSegmentation.ok) {
    return emptyScoreResult(metadata, runtimeOptions, {
      message: segmentationFailureMessage(userSegmentation.metadata),
      trackingQuality,
      userSegmentation: userSegmentation.metadata,
      referenceSegmentation: referenceSegmentation.metadata,
    });
  }

  if (!referenceSegmentation.ok) {
    return emptyScoreResult(metadata, runtimeOptions, {
      message: "The reference sign movement is too short to score.",
      trackingQuality,
      userSegmentation: userSegmentation.metadata,
      referenceSegmentation: referenceSegmentation.metadata,
    });
  }

  // Stages 3-8: normalize, apply mirror policy, extract features, phase-score,
  // align movement with adaptive DTW, then aggregate component scores.
  const mirrorSelection = selectMirrorAwareScore(
    userSegmentation.sequence,
    referenceSegmentation.sequence,
    metadata,
    runtimeOptions
  );
  const score = mirrorSelection.selectedScore;
  const feedback = buildScoringFeedback(
    mirrorSelection.selectedPhaseScores,
    mirrorSelection.selectedAlignmentDiagnostics,
    mirrorSelection.selectedFinalScoreAggregation
  );

  return {
    ok: true,
    scoringVersion: "v2",
    score,
    landmarkScore: mirrorSelection.selectedLandmarkScore,
    handShapeScore: mirrorSelection.selectedHandShapeScore,
    orientationScore: mirrorSelection.selectedOrientationScore,
    timingSimilarityScore:
      mirrorSelection.selectedAlignmentDiagnostics.timingSimilarityScore,
    alignmentDiagnostics: mirrorSelection.selectedAlignmentDiagnostics,
    phaseScores: mirrorSelection.selectedPhaseScores,
    componentScores: mirrorSelection.selectedComponentScores,
    finalScoreAggregation: mirrorSelection.selectedFinalScoreAggregation,
    feedback,
    diagnostics: buildScoringDiagnostics({
      scoringVersion: "v2",
      trackingQuality,
      userSegmentation: userSegmentation.metadata,
      referenceSegmentation: referenceSegmentation.metadata,
      dtwDiagnostics: mirrorSelection.selectedAlignmentDiagnostics,
      featureExtraction: calculateFeatureExtractionDiagnostics(
        userSegmentation.sequence
      ),
      componentScores: mirrorSelection.selectedComponentScores,
      finalScore: score,
      feedbackMessages: feedback,
    }),
    trackingQuality,
    message: null,
    minPassingScore: metadata.minPassingScore,
    passed: score >= metadata.minPassingScore,
    mirrorUsed: mirrorSelection.mirrorUsed,
    mirrorDiagnostics: mirrorSelection.diagnostics,
    handShapeScores: mirrorSelection.selectedHandShapeScores,
    orientationScores: mirrorSelection.selectedOrientationScores,
    scoringMetadata: metadata,
    userSegmentation: userSegmentation.metadata,
    referenceSegmentation: referenceSegmentation.metadata,
  };
}

export function calculateSegmentedSignScore(
  userSeq: Sequence,
  videoSeq: Sequence,
  configOverrides: Partial<GestureSegmentationConfig> = {},
  metadataInput?: SignScoringMetadataInput | null,
  runtimeOptionsInput?: Partial<SignScoringRuntimeOptions> | null,
  qualityConfigOverrides: Partial<StudentQualityCheckConfig> = {}
): SegmentedSignScoreResult {
  const metadata = resolveSignScoringMetadata(metadataInput);
  const runtimeOptions = resolveRuntimeOptions(runtimeOptionsInput);

  if (metadata.scoringVersion === "v1") {
    return calculateV1SegmentedSignScore(
      userSeq,
      videoSeq,
      metadata,
      runtimeOptions
    );
  }

  return calculateV2SegmentedSignScore(
    userSeq,
    videoSeq,
    configOverrides,
    metadata,
    runtimeOptions,
    qualityConfigOverrides
  );
}

export const scoringUtils = {
  normalizeFrame,
  normalizeSequence,
  dtwDistance,
  distanceToScore,
  calculateSequenceMotion,
  extractHandShapeFeatures,
  extractHandOrientationFeatures,
  validateStudentSequenceQuality,
  segmentGestureSequence,
  calculateSegmentedSignScore,
};
