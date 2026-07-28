import { useParams, Link } from 'react-router-dom'
import { lifePosts } from '@/data/life'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'

export default function LifePostPage() {
  const { postId } = useParams<{ postId: string }>()
  const post = lifePosts.find((p) => p.id === postId)

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">文章未找到</h1>
        <Link to="/life" className="mt-4 inline-block text-blue-600 hover:underline">返回生活感悟</Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        to="/life"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-rose-600 transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> 返回生活感悟
      </Link>

      <article className="mx-auto max-w-3xl">
        {post.coverImage && (
          <div className="mb-8 overflow-hidden rounded-xl">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full aspect-video object-cover"
            />
          </div>
        )}

        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 lg:text-4xl leading-tight">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5 text-sm text-slate-400">
              <Calendar className="h-4 w-4" />
              {post.date}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-rose-50 text-rose-700 hover:bg-rose-100">
                  <Tag className="h-3 w-3 mr-1" /> {tag}
                </Badge>
              ))}
            </div>
          </div>
        </header>

        <div className="prose prose-slate prose-lg max-w-none">
          {post.content.split('\n').map((line, i) => {
            const trimmed = line.trim()
            if (!trimmed) return <br key={i} />
            if (trimmed.startsWith('## ')) {
              return <h2 key={i} className="text-2xl font-bold text-slate-900 mt-8 mb-4">{trimmed.replace('## ', '')}</h2>
            }
            if (trimmed.startsWith('### ')) {
              return <h3 key={i} className="text-xl font-semibold text-slate-800 mt-6 mb-3">{trimmed.replace('### ', '')}</h3>
            }
            if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
              return <p key={i} className="font-bold text-slate-800 mt-4 mb-2">{trimmed.replace(/\*\*/g, '')}</p>
            }
            return (
              <p key={i} className="text-slate-600 leading-relaxed mb-3">
                {trimmed}
              </p>
            )
          })}
        </div>
      </article>

      <div className="mt-12 text-center">
        <Link
          to="/life"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-6 py-3 text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> 返回生活感悟
        </Link>
      </div>
    </div>
  )
}
