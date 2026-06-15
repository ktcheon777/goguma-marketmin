import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

// 가격을 "1,200,000원" 형식으로 바꿔주는 함수
function formatPrice(price: number) {
  return price.toLocaleString('ko-KR') + '원'
}

// 날짜를 "6월 15일" 형식으로 바꿔주는 함수
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
  })
}

export default async function ProductsPage() {
  const supabase = await createClient()

  // Supabase에서 상품 목록을 최신순으로 가져오기
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white">
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-sky-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sky-600 hover:text-sky-800 text-sm font-medium">
              ← 홈으로
            </Link>
            <h1 className="text-lg font-bold text-sky-900">판매글 목록</h1>
          </div>
          <Link
            href="/products/new"
            className="text-sm bg-sky-500 hover:bg-sky-600 text-white px-4 py-1.5 rounded-full transition-colors"
          >
            + 판매하기
          </Link>
        </div>
      </header>

      {/* 목록 */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {!products || products.length === 0 ? (
          // 상품이 없을 때 보여줄 화면
          <div className="text-center py-24">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-gray-500 mb-6">아직 등록된 판매글이 없어요.</p>
            <Link
              href="/products/new"
              className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              첫 번째 판매글 올리기
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="flex items-center gap-4 py-4 hover:bg-sky-50 -mx-4 px-4 rounded-xl transition-colors"
              >
                {/* 이미지 자리 (나중에 사진 추가 예정) */}
                <div className="w-20 h-20 bg-gray-100 rounded-xl flex-shrink-0 flex items-center justify-center text-3xl">
                  🛍️
                </div>

                {/* 상품 정보 */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{product.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {product.category} · {formatDate(product.created_at)}
                  </p>
                  <p className="font-bold text-gray-900 mt-1">{formatPrice(product.price)}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {product.seller_nickname ?? '판매자'}
                  </p>
                </div>

                {/* 화살표 */}
                <span className="text-gray-300 flex-shrink-0">›</span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
