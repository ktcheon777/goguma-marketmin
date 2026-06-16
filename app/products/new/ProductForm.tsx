'use client'

import { useState } from 'react'
import { createProduct } from '@/app/products/actions'
import ImageUploader from '@/app/components/ImageUploader'

const CATEGORIES = [
  '디지털/가전',
  '의류/잡화',
  '가구/인테리어',
  '생활/주방',
  '도서/티켓',
  '스포츠/레저',
  '취미/게임',
  '식물',
  '기타',
]

interface Props {
  userId: string
  error?: string
}

export default function ProductForm({ userId, error }: Props) {
  const [uploading, setUploading] = useState(false)

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      {error && (
        <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <form action={createProduct} className="space-y-5">
        {/* 사진 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            사진 <span className="text-gray-400 text-xs font-normal">(선택)</span>
          </label>
          <ImageUploader userId={userId} onUploadingChange={setUploading} />
        </div>

        {/* 제목 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            제목 <span className="text-red-400">*</span>
          </label>
          <input
            name="title"
            type="text"
            required
            maxLength={100}
            placeholder="판매할 물건의 이름을 입력하세요"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition text-gray-800 placeholder-gray-400"
          />
        </div>

        {/* 카테고리 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            카테고리 <span className="text-red-400">*</span>
          </label>
          <select
            name="category"
            required
            defaultValue=""
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition text-gray-800 bg-white"
          >
            <option value="" disabled>카테고리를 선택하세요</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* 가격 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            가격 <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              name="price"
              type="number"
              required
              min={0}
              max={99999999}
              placeholder="0"
              className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition text-gray-800 placeholder-gray-400"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
          </div>
        </div>

        {/* 설명 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            설명 <span className="text-red-400">*</span>
          </label>
          <textarea
            name="description"
            required
            rows={6}
            maxLength={2000}
            placeholder="물건의 상태, 구매 시기, 하자 여부 등 자세한 설명을 적어주세요."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition text-gray-800 placeholder-gray-400 resize-none"
          />
        </div>

        {/* 등록 버튼 */}
        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors shadow-sm text-base"
        >
          {uploading ? '이미지 업로드 중...' : '판매글 등록하기'}
        </button>
      </form>
    </div>
  )
}
