'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

interface Props {
  userId: string
  existingImages?: string[]
  maxImages?: number
  onUploadingChange?: (uploading: boolean) => void
}

export default function ImageUploader({
  userId,
  existingImages = [],
  maxImages = 5,
  onUploadingChange,
}: Props) {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(existingImages)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const setUploadingState = (value: boolean) => {
    setUploading(value)
    onUploadingChange?.(value)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return

    const remaining = maxImages - uploadedUrls.length
    const toUpload = files.slice(0, remaining)

    setUploadingState(true)
    const newUrls: string[] = []

    for (const file of toUpload) {
      const ext = file.name.split('.').pop() ?? 'jpg'
      const path = `${userId}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(path, file, { contentType: file.type })

      if (!error && data) {
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(data.path)
        newUrls.push(publicUrl)
      }
    }

    setUploadedUrls(prev => [...prev, ...newUrls])
    setUploadingState(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeImage = async (url: string, index: number) => {
    const path = url.split('/product-images/')[1]?.split('?')[0]
    if (path) {
      await supabase.storage.from('product-images').remove([path])
    }
    setUploadedUrls(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div>
      {uploadedUrls.map((url, i) => (
        <input key={i} type="hidden" name="image_urls" value={url} />
      ))}

      <div className="grid grid-cols-3 gap-2 mb-2">
        {uploadedUrls.map((url, i) => (
          <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
            <Image
              src={url}
              alt={`이미지 ${i + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 672px) 33vw, 224px"
            />
            <button
              type="button"
              onClick={() => removeImage(url, i)}
              className="absolute top-1 right-1 w-6 h-6 bg-black/50 text-white rounded-full text-xs flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              ✕
            </button>
          </div>
        ))}

        {uploadedUrls.length < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-sky-400 hover:text-sky-500 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <span className="text-xs text-center px-1">업로드 중...</span>
            ) : (
              <>
                <span className="text-3xl leading-none">+</span>
                <span className="text-xs mt-1">{uploadedUrls.length}/{maxImages}</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      <p className="text-xs text-gray-400">사진은 최대 {maxImages}장, 장당 5MB까지 등록할 수 있어요.</p>
    </div>
  )
}
