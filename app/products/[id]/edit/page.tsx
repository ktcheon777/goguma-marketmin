import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import EditForm from './EditForm'

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

  if (product.user_id !== user.id) redirect(`/products/${id}`)

  const { error } = await searchParams

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white">
      <header className="bg-white/80 backdrop-blur-sm border-b border-sky-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href={`/products/${id}`} className="text-sky-600 hover:text-sky-800 text-sm font-medium">
            ← 돌아가기
          </Link>
          <h1 className="text-lg font-bold text-sky-900">판매글 수정</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <EditForm product={product} userId={user.id} error={error} />
      </main>
    </div>
  )
}
