import { useParams, Link } from 'react-router-dom'
import { portfolioData, categoryConfig } from '@/data/portfolio'

const categoryColors: Record<string, string> = {
  molecule: 'bg-violet-100 text-violet-700',
  cell: 'bg-emerald-100 text-emerald-700',
  protein: 'bg-sky-100 text-sky-700',
  ngs: 'bg-amber-100 text-amber-700',
  ivd: 'bg-rose-100 text-rose-700',
  medicine: 'bg-indigo-100 text-indigo-700',
}

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>()

  if (!category || !categoryConfig[category]) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">分类不存在</h1>
        <Link to="/portfolio" className="mt-4 inline-block text-blue-600 hover:underline">返回科研实验</Link>
      </div>
    )
  }

  const works = portfolioData.filter((w) => w.category === category)
  const cat = categoryConfig[category]

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <Link to="/portfolio" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
          &larr; 返回科研实验
        </Link>
        <div className="mt-4">
          <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${categoryColors[category]}`}>
            {cat.icon} {cat.name}
          </span>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">{cat.name}方向研究</h1>
          <p className="mt-2 text-slate-500">{cat.desc} · 共 {works.length} 个作品</p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {works.map((work) => {
          const isFile = !!work.filePath
          return (
            <Link
              key={work.id}
              to={`/portfolio/${category}/${work.id}`}
              className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:shadow-lg"
            >
              {isFile ? (
                <div className={`flex aspect-video items-center justify-center ${
                  work.fileType === 'PDF'
                    ? 'bg-gradient-to-br from-red-50 to-red-100'
                    : 'bg-gradient-to-br from-blue-50 to-blue-100'
                }`}>
                  <div className="text-center">
                    <span className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold shadow-sm ${
                      work.fileType === 'PDF'
                        ? 'bg-red-500 text-white'
                        : 'bg-blue-500 text-white'
                    }`}>
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      {work.fileType}
                    </span>
                  </div>
                </div>
              ) : work.images?.[0] ? (
                <div className="aspect-video bg-slate-100 overflow-hidden">
                  <img
                    src={work.images[0]}
                    alt={work.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="flex aspect-video items-center justify-center bg-slate-100">
                  <span className="text-4xl">📄</span>
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start gap-2">
                  <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex-1">{work.title}</h3>
                </div>
                {isFile && (
                  <span className={`mt-1 inline-block rounded px-1.5 py-0.5 text-xs font-medium ${
                    work.fileType === 'PDF' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    可下载
                  </span>
                )}
                <p className="mt-2 text-sm text-slate-500 line-clamp-2">{work.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {work.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{tag}</span>
                  ))}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
