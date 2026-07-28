import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-8xl font-bold text-slate-200">404</h1>
      <h2 className="mt-4 text-2xl font-bold text-slate-900">页面未找到</h2>
      <p className="mt-2 text-slate-500">你访问的页面不存在或已被移除</p>
      <Link to="/" className="mt-8">
        <Button className="gap-2">
          <Home className="h-4 w-4" /> 返回首页
        </Button>
      </Link>
    </div>
  )
}
