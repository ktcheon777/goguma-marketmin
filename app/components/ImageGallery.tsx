'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Props {
  images: string[]
  title: string
}

export default function ImageGallery({ images, title }: Props) {
  const [current, setCurrent] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-2xl flex items-center justify-center text-7xl mb-6">
        🛍️
      </div>
    )
  }

  return (
    <div className="mb-6">
      <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-gray-100">
        <Image
          src={images[current]}
          alt={`${title} - 이미지 ${current + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 672px) 100vw, 672px"
        />
        {images.length > 1 && (
          <>
            {current > 0 && (
              <button
                onClick={() => setCurrent(p => p - 1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full text-xl flex items-center justify-center transition-colors"
              >
                ‹
              </button>
            )}
            {current < images.length - 1 && (
              <button
                onClick={() => setCurrent(p => p + 1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full text-xl flex items-center justify-center transition-colors"
              >
                ›
              </button>
            )}
            <span className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
              {current + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
          {images.map((url, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                current === i ? 'border-sky-500' : 'border-transparent'
              }`}
            >
              <Image
                src={url}
                alt={`썸네일 ${i + 1}`}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
