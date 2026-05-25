let fontsLoaded = false;

async function loadFonts(): Promise<void> {
  if (typeof window === "undefined" || fontsLoaded) {
    return;
  }

  if (typeof FontFace === "undefined" || !document?.fonts) {
    fontsLoaded = true;
    return;
  }

  const font = new FontFace(
    "SuttonSignWritingOneD",
    "url(/fonts/SuttonSignWritingOneD.ttf)"
  );

  await font.load();
  document.fonts.add(font);
  fontsLoaded = true;
}

export const signWritingService = {
  loadFonts,
};
