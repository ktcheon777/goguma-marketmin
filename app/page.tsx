import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/auth/actions'
import Link from 'next/link'
import DeleteAccountButton from '@/app/components/DeleteAccountButton'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const params = await searchParams
  const message = params.message

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-sky-100 to-white">
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-sky-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏪</span>
            <h1 className="text-lg font-bold text-sky-900">하늘장터</h1>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-sky-700">
                  {user.user_metadata?.nickname ?? user.email}
                </span>
                <form action={logout}>
                  <button
                    type="submit"
                    className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-1.5 rounded-full transition-colors"
                  >
                    로그아웃
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-sky-600 hover:text-sky-800 font-medium"
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className="text-sm bg-sky-500 hover:bg-sky-600 text-white px-4 py-1.5 rounded-full transition-colors"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-2xl mx-auto px-4 py-10">
        {user ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">👋</div>
            <h2 className="text-2xl font-bold text-sky-900 mb-2">
              {user.user_metadata?.nickname ?? '회원'}님, 반가워요!
            </h2>
            <p className="text-sky-600 mb-8">하늘장터에서 이웃과 거래해보세요.</p>
            {message && (
              <div className="mb-6 p-3 bg-sky-50 border border-sky-200 rounded-xl text-sky-700 text-sm">
                {message}
              </div>
            )}
            <div className="inline-flex gap-3 mb-12">
              <Link
                href="/products/new"
                className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-sm"
              >
                판매하기
              </Link>
              <button
                disabled
                className="bg-white border border-sky-300 text-sky-700 px-6 py-3 rounded-xl font-semibold opacity-50 cursor-not-allowed"
              >
                둘러보기 (준비 중)
              </button>
            </div>
            <div>
              <DeleteAccountButton />
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🌤️</div>
            <h2 className="text-2xl font-bold text-sky-900 mb-3">
              하늘장터에 오신 걸 환영해요
            </h2>
            <p className="text-sky-600 mb-8 leading-relaxed">
              이웃 간 믿을 수 있는 중고거래 플랫폼.<br />
              지금 가입하고 시작해보세요!
            </p>
            <div className="flex justify-center gap-3">
              <Link
                href="/signup"
                className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors shadow-sm"
              >
                시작하기
              </Link>
              <Link
                href="/login"
                className="bg-white hover:bg-sky-50 border border-sky-300 text-sky-700 font-semibold px-8 py-3 rounded-xl transition-colors"
              >
                로그인
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
