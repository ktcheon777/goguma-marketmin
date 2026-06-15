'use client'

import { useState } from 'react'
import { deleteAccount } from '@/app/auth/actions'

export default function DeleteAccountButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-red-400 hover:text-red-600 underline transition-colors"
      >
        회원탈퇴
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* 배경 오버레이 */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />

          {/* 다이얼로그 */}
          <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <div className="text-center mb-5">
              <div className="text-4xl mb-3">⚠️</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">정말 탈퇴하시겠어요?</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                계정을 삭제하면 모든 정보가 영구적으로 삭제되며<br />
                복구할 수 없습니다.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl transition-colors"
              >
                취소
              </button>
              <form action={deleteAccount} className="flex-1">
                <button
                  type="submit"
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl transition-colors"
                >
                  탈퇴하기
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
