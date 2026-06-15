'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

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
