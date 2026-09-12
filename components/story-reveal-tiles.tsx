"use client"

import { useState } from "react"
import type { StaticImageData } from "next/image"
import Image from "next/image"
import type { StoryBlock } from "@/components/story-page"

const FOCAL = [
  "object-center",
  "object-left",
  "object-right",
  "object-top",
  "object-bottom",
  "object-[center_20%]",
] as const

export function StoryRevealTiles({
  items,
  image,
  imageAlt,
}: {
  items: StoryBlock[]
  image?: StaticImageData
  imageAlt?: string
}) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item, index) => {
        const isOpen = open === index
        return (
          <button
            key={item.title}
            type="button"
            aria-expanded={isOpen}
            onClick={() => setOpen(isOpen ? null : index)}
            className={`story-reveal ${isOpen ? "is-open" : ""}`}
          >
            {image ? (
              <Image
                src={image}
                alt={imageAlt ?? ""}
                className={`story-reveal-media ${FOCAL[index % FOCAL.length]}`}
                sizes="(min-width: 1184px) 380px, (min-width: 640px) 50vw, 100vw"
              />
            ) : (
              <span className="story-reveal-media story-reveal-media-plain" />
            )}
            <span className="story-reveal-shade" aria-hidden />
            <span className="story-reveal-panel">
              <span className="story-reveal-title">{item.title}</span>
              <span className="story-reveal-body">{item.body}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
