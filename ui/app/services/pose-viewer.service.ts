class PoseViewerService {
  private static instance: PoseViewerService | null = null;
  private isCustomElementDefined = false;

  private constructor() {}

  static getInstance(): PoseViewerService {
    if (!PoseViewerService.instance) {
      PoseViewerService.instance = new PoseViewerService();
    }
    return PoseViewerService.instance;
  }

  async definePoseViewerElement(): Promise<void> {
    if (typeof window === "undefined") {
      return;
    }

    if (this.isCustomElementDefined) {
      return;
    }

    try {
      const module = await import("pose-viewer/loader");
      await module.defineCustomElements(window);
      this.isCustomElementDefined = true;
    } catch (error) {
      console.error("Failed to define pose-viewer custom elements", error);
      throw error;
    }
  }
}

export const poseViewerService = PoseViewerService.getInstance();
export { PoseViewerService };
