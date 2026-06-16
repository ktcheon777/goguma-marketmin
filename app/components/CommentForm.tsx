'use client'

import { useRef } from 'react'
import { addComment } from '@/app/comments/actions'

// 댓글 작성 폼 — 등록 후 입력칸을 비워준다
export default function CommentForm({ productId }: { productId: string }) {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await addComment(formData)
        formRef.current?.reset()
      }}
      className="flex items-start gap-2"
    >
      <input type="hidden" name="product_id" value={productId} />
      <textarea
        name="content"
        required
        rows={1}
        maxLength={500}
        placeholder="댓글을 입력하세요"
        className="flex-1 px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition text-gray-800 placeholder-gray-400 resize-none text-sm"
      />
      <button
        type="submit"
        className="flex-shrink-0 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
      >
        등록
      </button>
    </form>
  )
}
