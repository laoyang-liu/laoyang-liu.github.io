import { Link } from 'react-router-dom'
import { lifePosts } from '@/data/life'
import { Badge } from '@/components/ui/badge'

export default function LifePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl text-center mb-12">
        <span className="inline-block rounded-full bg-rose-100 px-4 py-1.5 text-sm font-medium text-rose-700">
          个人生活 & 感悟
        </span>
        <h1 className="mt-4 text-3xl font-bold text-slate-900 lg:text-4xl">生活笔记</h1>
        <p className="mt-4 text-slate-500">
          科研之外，记录生活的点滴与成长的思考
        </p>
      </div>

      {/* Featured post - first post */}
      {lifePosts.length > 0 && (
        <Link
          to={`/life/${lifePosts[0].id}`}
          className="group mx-auto mb-12 flex max-w-4xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-lg lg:flex-row"
        >
          {lifePosts[0].coverImage && (
            <div className="lg:w-1/2">
              <img
                src={lifePosts[0].coverImage}
                alt={lifePosts[0].title}
                className="h-64 w-full object-cover lg:h-full"
              />
            </div>
          )}
          <div className="flex flex-col justify-center p-8 lg:w-1/2">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="bg-rose-50 text-rose-700">最新</Badge>
              <span className="text-sm text-slate-400">{lifePosts[0].date}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
              {lifePosts[0].title}
            </h2>
            <p className="mt-3 text-slate-500 line-clamp-3">{lifePosts[0].summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {lifePosts[0].tags.map((tag) => (
                <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-500">{tag}</span>
              ))}
            </div>
          </div>
        </Link>
      )}

      {/* Grid of remaining posts */}
      <div className="mx-auto max-w-4xl grid gap-8 sm:grid-cols-2">
        {lifePosts.slice(1).map((post) => (
          <Link
            key={post.id}
            to={`/life/${post.id}`}
            className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:shadow-lg"
          >
            {post.coverImage && (
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            )}
            <div className="p-5">
              <span className="text-sm text-slate-400">{post.date}</span>
              <h3 className="mt-2 text-lg font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                {post.title}
              </h3>
              <p className="mt-2 text-sm text-slate-500 line-clamp-2">{post.summary}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{tag}</span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
