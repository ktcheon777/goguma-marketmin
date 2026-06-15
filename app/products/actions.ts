'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function deleteProduct(formData: FormData) {
  const id = formData.get('id') as string
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase.from('products').delete().eq('id', id).eq('user_id', user.id)
  redirect('/products?message=' + encodeURIComponent('판매글이 삭제됐습니다.'))
}

export async function updateProduct(formData: FormData) {
  const id = formData.get('id') as string
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase
    .from('products')
    .update({
      title: formData.get('title') as string,
      price: parseInt(formData.get('price') as string, 10),
      category: formData.get('category') as string,
      description: formData.get('description') as string,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    redirect(`/products/${id}/edit?error=` + encodeURIComponent(error.message))
  }
  redirect(`/products/${id}?message=` + encodeURIComponent('수정이 완료됐습니다!'))
}

export async function createProduct(formData: FormData) {
  const supabase = await createClient()

  // 로그인 여부 확인
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const title = formData.get('title') as string
  const price = parseInt(formData.get('price') as string, 10)
  const category = formData.get('category') as string
  const description = formData.get('description') as string

  const { error } = await supabase.from('products').insert({
    user_id: user.id,
    title,
    price,
    category,
    description,
    seller_nickname: user.user_metadata?.nickname ?? user.email?.split('@')[0],
  })

  if (error) {
    redirect('/products/new?error=' + encodeURIComponent(error.message))
  }

  redirect('/?message=' + encodeURIComponent('판매글이 등록되었습니다!'))
}
