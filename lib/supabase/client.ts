import { createBrowserClient } from '@supabase/ssr'

// 환경변수에 보이지 않는 BOM(파일 시작 표시) 문자가 섞여 들어오는 경우를 방지하기 위해 trim() 처리
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim()
  )
}
