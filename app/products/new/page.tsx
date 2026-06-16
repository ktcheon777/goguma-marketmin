import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ProductForm from './ProductForm'

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const params = await searchParams
  const error = params.error

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white">
      <header className="bg-white/80 backdrop-blur-sm border-b border-sky-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-sky-600 hover:text-sky-800 text-sm font-medium">
            ← 홈으로
          </Link>
          <h1 className="text-lg font-bold text-sky-900">판매글 작성</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <ProductForm userId={user.id} error={error} />
      </main>
    </div>
  )
}
