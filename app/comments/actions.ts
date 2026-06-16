'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// 댓글 작성
export async function addComment(formData: FormData) {
  const productId = formData.get('product_id') as string
  const content = ((formData.get('content') as string) ?? '').trim()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  if (!content) return // 빈 댓글은 무시

  await supabase.from('comments').insert({
    product_id: productId,
    user_id: user.id,
    content,
    author_nickname: user.user_metadata?.nickname ?? user.email?.split('@')[0],
  })

  revalidatePath(`/products/${productId}`)
}

// 댓글 수정 (본인 댓글만 — RLS가 한 번 더 막아줌)
export async function updateComment(formData: FormData) {
  const id = formData.get('id') as string
  const productId = formData.get('product_id') as string
  const content = ((formData.get('content') as string) ?? '').trim()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  if (!content) return

  await supabase
    .from('comments')
    .update({ content, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)

  revalidatePath(`/products/${productId}`)
}

// 댓글 삭제 (본인 댓글만)
export async function deleteComment(formData: FormData) {
  const id = formData.get('id') as string
  const productId = formData.get('product_id') as string

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase
    .from('comments')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  revalidatePath(`/products/${productId}`)
}
