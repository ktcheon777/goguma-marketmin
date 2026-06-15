import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

function formatPrice(price: number) {
  return price.toLocaleString('ko-KR') + '원'
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // 상품 데이터 가져오기
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  // 없는 상품이면 404 페이지로
  if (!product) {
    notFound()
  }

  // 현재 로그인한 사용자 확인 (본인 글인지 확인용)
  const { data: { user } } = await supabase.auth.getUser()
  const isOwner = user?.id === product.user_id

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white">
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-sky-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/products" className="text-sky-600 hover:text-sky-800 text-sm font-medium">
            ← 목록으로
          </Link>
          <h1 className="text-lg font-bold text-sky-900">상품 상세</h1>
        </div>
      </header>

      {/* 상세 내용 */}
      <main className="max-w-2xl mx-auto px-4 py-6">

        {/* 이미지 자리 (나중에 사진 추가 예정) */}
        <div className="w-full h-64 bg-gray-100 rounded-2xl flex items-center justify-center text-7xl mb-6">
          🛍️
        </div>

        {/* 판매자 정보 */}
        <div className="bg-white rounded-2xl p-4 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-bold">
            {(product.seller_nickname ?? '판매자').charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{product.seller_nickname ?? '판매자'}</p>
            <p className="text-xs text-gray-400">판매자</p>
          </div>
        </div>

        {/* 상품 정보 */}
        <div className="bg-white rounded-2xl p-5 mb-4">
          {/* 카테고리 배지 */}
          <span className="inline-block text-xs bg-sky-100 text-sky-700 px-2.5 py-1 rounded-full mb-3">
            {product.category}
          </span>

          {/* 제목 */}
          <h2 className="text-xl font-bold text-gray-900 mb-2">{product.title}</h2>

          {/* 등록일 */}
          <p className="text-xs text-gray-400 mb-4">{formatDate(product.created_at)}</p>

          {/* 설명 */}
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{product.description}</p>
        </div>

        {/* 가격 + 문의 버튼 */}
        <div className="bg-white rounded-2xl p-4 flex items-center justify-between sticky bottom-4 shadow-lg border border-gray-100">
          <div>
            <p className="text-xs text-gray-400">판매가격</p>
            <p className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</p>
          </div>
          {isOwner ? (
            // 내 글이면 "내 판매글" 표시
            <span className="text-sm bg-gray-100 text-gray-500 px-5 py-2.5 rounded-xl">
              내 판매글
            </span>
          ) : (
            // 다른 사람 글이면 채팅 버튼 (아직 기능 미구현)
            <button
              disabled
              className="text-sm bg-sky-500 text-white px-5 py-2.5 rounded-xl opacity-50 cursor-not-allowed"
            >
              채팅하기 (준비 중)
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
