import { createClient } from '@/lib/supabase/server'
import { updateProduct } from '@/app/products/actions'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'

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

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) notFound()

  // 본인 글이 아니면 상세 페이지로 이동
  if (product.user_id !== user.id) redirect(`/products/${id}`)

  const { error } = await searchParams

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white">
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-sky-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href={`/products/${id}`} className="text-sky-600 hover:text-sky-800 text-sm font-medium">
            ← 돌아가기
          </Link>
          <h1 className="text-lg font-bold text-sky-900">판매글 수정</h1>
        </div>
      </header>

      {/* 수정 폼 */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-md p-6">

          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form action={updateProduct} className="space-y-5">
            {/* 숨겨진 id 필드 */}
            <input type="hidden" name="id" value={id} />

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
                defaultValue={product.title}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition text-gray-800"
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
                defaultValue={product.category}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition text-gray-800 bg-white"
              >
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
                  defaultValue={product.price}
                  className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition text-gray-800"
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
                defaultValue={product.description}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition text-gray-800 resize-none"
              />
            </div>

            {/* 수정 완료 버튼 */}
            <button
              type="submit"
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 rounded-xl transition-colors shadow-sm text-base"
            >
              수정 완료
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
