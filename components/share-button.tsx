"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function share() {
    const data = { title: "Laoka", text: "Ankafiziko ity rindranasa ity!", url: window.location.origin };
    if (navigator.share) {
      await navigator.share(data).catch(() => {});
    } else {
      await navigator.clipboard.writeText(data.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex h-12 items-center gap-2 rounded-full bg-ravitoto px-6 font-medium text-rice transition hover:bg-ravitoto-light"
    >
      <Share2 className="size-5" /> {copied ? "Voadika ny rohy!" : "Zarao amin'ny namana"}
    </button>
  );
}
