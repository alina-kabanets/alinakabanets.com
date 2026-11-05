"use client";

import { useEffect } from "react";

// Videos in posts get a control bar under the picture, in the site's style,
// so nothing covers the video's own captions: play/pause, a seek line to go
// back or forward, the time, sound, and fullscreen. They autoplay, muted,
// while on screen (only the version shown at this screen size). With reduced
// motion they wait for a press.

const icon = {
  play: "M8 5.5v13l11-6.5z",
  pause: "M7 5h3.5v14H7zM13.5 5H17v14h-3.5z",
  muted: "M4 9.5h3.5L12 5.5v13l-4.5-4H4zM16 9.5l5 5M21 9.5l-5 5",
  sound: "M4 9.5h3.5L12 5.5v13l-4.5-4H4zM15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11",
  full: "M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5",
};

const time = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

function button(label: string) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "post-video-button";
  b.setAttribute("aria-label", label);
  b.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path/></svg>`;
  return b;
}

export function PostVideos() {
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const frames = document.querySelectorAll<HTMLElement>(".post-body .post-video-frame");
    const cleanups: (() => void)[] = [];

    frames.forEach((frame) => {
      const video = frame.querySelector("video");
      if (!video) return;
      const bar = document.createElement("div");
      bar.className = "post-video-controls";
      const play = button("Play");
      const seek = document.createElement("input");
      seek.type = "range";
      seek.min = "0";
      seek.step = "0.1";
      seek.value = "0";
      seek.className = "post-video-seek";
      seek.setAttribute("aria-label", "Seek");
      const clock = document.createElement("span");
      clock.className = "post-video-time";
      clock.textContent = "0:00";
      const sound = button("Turn sound on");
      const full = button("Fullscreen");
      full.querySelector("path")!.setAttribute("d", icon.full);
      bar.append(play, seek, clock, sound, full);
      frame.after(bar);
      // The bar belongs to its video: it shows and hides with it.
      bar.dataset.for = frame.classList.contains("is-phone") ? "phone" : "laptop";

      const sync = () => {
        play.querySelector("path")!.setAttribute("d", video.paused ? icon.play : icon.pause);
        play.setAttribute("aria-label", video.paused ? "Play" : "Pause");
        sound.querySelector("path")!.setAttribute("d", video.muted ? icon.muted : icon.sound);
        sound.setAttribute("aria-label", video.muted ? "Turn sound on" : "Turn sound off");
      };
      const tick = () => {
        if (!video.duration) return;
        seek.max = String(video.duration);
        seek.value = String(video.currentTime);
        seek.style.setProperty("--progress", `${(video.currentTime / video.duration) * 100}%`);
        clock.textContent = `${time(video.currentTime)} / ${time(video.duration)}`;
      };
      const toggle = () => (video.paused ? video.play().catch(() => {}) : video.pause());
      play.onclick = toggle;
      video.onclick = toggle;
      seek.oninput = () => {
        video.currentTime = Number(seek.value);
        tick();
      };
      sound.onclick = () => {
        video.muted = !video.muted;
        if (!video.muted && video.paused) video.play().catch(() => {});
        sync();
      };
      full.onclick = () => {
        // iPhone Safari only allows fullscreen on the video element itself.
        const v = video as HTMLVideoElement & { webkitEnterFullscreen?: () => void };
        if (video.requestFullscreen) video.requestFullscreen().catch(() => v.webkitEnterFullscreen?.());
        else v.webkitEnterFullscreen?.();
      };
      video.addEventListener("play", sync);
      video.addEventListener("pause", sync);
      video.addEventListener("timeupdate", tick);
      video.addEventListener("loadedmetadata", tick);
      sync();
      cleanups.push(() => {
        bar.remove();
        video.removeEventListener("play", sync);
        video.removeEventListener("pause", sync);
        video.removeEventListener("timeupdate", tick);
        video.removeEventListener("loadedmetadata", tick);
      });
    });

    let observer: IntersectionObserver | undefined;
    if (!reduced) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const { target, isIntersecting } of entries) {
            const video = target as HTMLVideoElement;
            if (isIntersecting && video.offsetParent) video.play().catch(() => {});
            else video.pause();
          }
        },
        { threshold: 0.5 },
      );
      frames.forEach((frame) => {
        const video = frame.querySelector("video");
        if (video) observer!.observe(video);
      });
    }
    return () => {
      observer?.disconnect();
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);
  return null;
}
