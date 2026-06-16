'use client'

import { useState } from 'react'
import { updateComment, deleteComment } from '@/app/comments/actions'

interface Comment {
  id: string
  product_id: string
  content: string
  author_nickname: string | null
  created_at: string
  updated_at: string | null
}

interface Props {
  comment: Comment
  isOwner: boolean
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function CommentItem({ comment, isOwner }: Props) {
  const [editing, setEditing] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const nickname = comment.author_nickname ?? '익명'

  return (
    <div className="py-3 flex gap-3">
      {/* 작성자 아바타 */}
      <div className="w-8 h-8 flex-shrink-0 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 text-sm font-bold">
        {nickname.charAt(0)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-800">{nickname}</span>
          <span className="text-xs text-gray-400">
            {formatDate(comment.created_at)}
            {comment.updated_at && ' (수정됨)'}
          </span>
        </div>

        {editing ? (
          // 수정 모드
          <form
            action={async (formData) => {
              await updateComment(formData)
              setEditing(false)
            }}
            className="mt-1.5 flex items-start gap-2"
          >
            <input type="hidden" name="id" value={comment.id} />
            <input type="hidden" name="product_id" value={comment.product_id} />
            <textarea
              name="content"
              required
              rows={2}
              maxLength={500}
              defaultValue={comment.content}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition text-gray-800 resize-none text-sm"
            />
            <div className="flex flex-col gap-1">
              <button
                type="submit"
                className="bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
              >
                저장
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="text-gray-500 hover:bg-gray-100 text-xs px-3 py-1.5 rounded-lg transition-colors"
              >
                취소
              </button>
            </div>
          </form>
        ) : (
          <p className="mt-0.5 text-sm text-gray-700 whitespace-pre-wrap break-words">
            {comment.content}
          </p>
        )}

        {/* 내 댓글일 때만 수정·삭제 버튼 표시 */}
        {isOwner && !editing && (
          <div className="mt-1 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-xs text-gray-400 hover:text-sky-600 transition-colors"
            >
              수정
            </button>
            {confirming ? (
              <form action={deleteComment} className="flex items-center gap-2">
                <input type="hidden" name="id" value={comment.id} />
                <input type="hidden" name="product_id" value={comment.product_id} />
                <span className="text-xs text-gray-400">삭제할까요?</span>
                <button
                  type="submit"
                  className="text-xs text-red-500 font-semibold hover:text-red-600 transition-colors"
                >
                  네
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  아니요
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                삭제
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
