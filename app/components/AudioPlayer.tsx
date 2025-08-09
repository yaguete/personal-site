"use client"

import { useEffect, useMemo, useRef, useState } from "react"

type AudioPlayerProps = {
  src: string
  title?: string
  lang?: "en" | "es"
}

export default function AudioPlayer({ src, title, lang = "en" }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [rate, setRate] = useState(1.2)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onLoaded = () => setDuration(audio.duration || 0)
    const onTime = () => setCurrentTime(audio.currentTime || 0)
    const onEnd = () => setIsPlaying(false)

    audio.addEventListener("loadedmetadata", onLoaded)
    audio.addEventListener("timeupdate", onTime)
    audio.addEventListener("ended", onEnd)

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded)
      audio.removeEventListener("timeupdate", onTime)
      audio.removeEventListener("ended", onEnd)
    }
  }, [src])

  useEffect(() => {
    const audio = audioRef.current
    if (audio) audio.playbackRate = rate
  }, [rate])

  const label = useMemo(() => {
    if (title) return title
    return lang === "es" ? "Escuchar artículo" : "Listen to article"
  }, [title, lang])

  function toggle() {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {})
    }
  }

  const format = (s: number) => {
    if (!isFinite(s)) return "00:00"
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`
  }

  const rates = [0.5, 1, 1.2, 1.5, 2] as const

  return (
    <div className="mt-4 mb-6">
      {/* label eliminado intencionadamente */}
      {/* Contenedor sin fondo, solo los controles */}
      <div className="flex w-full max-w-full items-center gap-4">
        <button
          type="button"
          onClick={toggle}
          aria-label={isPlaying ? (lang === "es" ? "Pausar" : "Pause") : (lang === "es" ? "Reproducir" : "Play")}
          className="grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-zinc-200 text-zinc-900 transition hover:bg-zinc-300 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
        >
          {isPlaying ? (
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor"><path d="M6 4h3v12H6zM11 4h3v12h-3z"/></svg>
          ) : (
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor"><path d="M4 3.5v13l12-6.5-12-6.5z"/></svg>
          )}
        </button>
        <div className="flex items-center gap-4 min-w-0">
          <span className="tabular-nums text-sm text-zinc-700 dark:text-zinc-200">{format(currentTime)}</span>
          <span className="h-5 w-px bg-zinc-300 dark:bg-zinc-700" />
          <div className="flex items-center gap-3">
            {rates.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRate(r)}
                aria-pressed={rate === r}
                className={`cursor-pointer text-sm transition ${
                  rate === r
                    ? "text-zinc-900 dark:text-zinc-50 font-medium"
                    : "text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200"
                }`}
              >
                {r}x
              </button>
            ))}
          </div>
        </div>
      </div>
      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  )
}
