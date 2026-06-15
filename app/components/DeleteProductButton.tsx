'use client'

import { useState } from 'react'
import { deleteProduct } from '@/app/products/actions'

export default function DeleteProductButton({ id }: { id: string }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-3 rounded-xl transition-colors border border-red-200"
      >
        삭제
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">판매글 삭제</h3>
            <p className="text-gray-500 text-sm mb-6">
              삭제한 글은 복구할 수 없어요. 정말 삭제할까요?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <form action={deleteProduct} className="flex-1">
                <input type="hidden" name="id" value={id} />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
                >
                  삭제하기
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
