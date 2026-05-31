type QuestionVideoProps = {
  title: string;
  url: string | null;
};

function getYoutubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    if (parsed.hostname === "youtu.be") {
      const videoId = parsed.pathname.replace("/", "");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
  } catch {
    return null;
  }

  return null;
}

export function QuestionVideo({ title, url }: QuestionVideoProps) {
  if (!url) return null;

  const youtubeUrl = getYoutubeEmbedUrl(url);
  if (youtubeUrl) {
    return (
      <iframe
        className="mb-5 aspect-video w-full rounded-[1.5rem] bg-slate-950"
        src={youtubeUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  if (url.toLowerCase().split("?")[0].endsWith(".mp4")) {
    return (
      <video
        className="mb-5 aspect-video w-full rounded-[1.5rem] bg-slate-950 object-contain"
        controls
        playsInline
        preload="metadata"
        src={url.replace("https", "http")}
      />
    );
  }

  return null;
}
