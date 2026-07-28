import { Link } from 'react-router-dom'
import { categoryConfig } from '@/data/portfolio'

export default function PortfolioPage() {
  const categories = Object.entries(categoryConfig)

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-900 lg:text-4xl">科研实验</h1>
        <p className="mt-4 text-slate-500">按研究方向分类浏览科研作品</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map(([id, cat]) => (
          <Link
            key={id}
            to={`/portfolio/${id}`}
            className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 transition-all hover:shadow-lg hover:-translate-y-1"
          >
            <div className={`mb-4 inline-block rounded-lg bg-gradient-to-br ${cat.color} p-3 text-white`}>
              <span className="text-2xl">{cat.icon}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">{cat.name}</h3>
            <p className="mt-2 text-sm text-slate-500">{cat.desc}</p>
            <div className="mt-4 text-sm font-medium text-blue-600 group-hover:underline">
              浏览作品 &rarr;
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
