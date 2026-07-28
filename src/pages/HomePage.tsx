import { Link } from 'react-router-dom'
import { categoryConfig } from '@/data/portfolio'
import SearchBox from '@/components/search/SearchBox'
import CommentSection from '@/components/community/GiscusCommentSection'

export default function HomePage() {
  const categories = Object.entries(categoryConfig)

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section
        className="relative overflow-hidden bg-cover bg-center bg-no-repeat py-16 lg:py-24"
        style={{ backgroundImage: 'url(/hero-bg.jpg)' }}
      >
        {/* 暗色遮罩，确保文字可读 */}
        <div className="absolute inset-0 bg-slate-950/55" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-white lg:text-5xl drop-shadow-lg">
              生命科学科研与行业信息平台
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/90 drop-shadow-md">
              聚焦分子、细胞、蛋白、NGS、IVD、医药六大方向，分享科研实验方法与行业前沿资讯。
            </p>

            {/* 搜索框 */}
            <div className="mt-8 flex justify-center">
              <SearchBox variant="dark" />
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link to="/portfolio" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-lg hover:bg-blue-700 transition-colors">
                进入科研实验
              </Link>
              <a href="#industry" className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-6 py-3 font-medium text-white shadow-lg backdrop-blur-sm hover:bg-white/20 transition-colors">
                行业信息
              </a>
              <a href="#community" className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-6 py-3 font-medium text-white shadow-lg backdrop-blur-sm hover:bg-white/20 transition-colors">
                社区讨论
              </a>
              <Link to="/videos" className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-6 py-3 font-medium text-white shadow-lg backdrop-blur-sm hover:bg-white/20 transition-colors">
                B站视频
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 科研实验板块 */}
      <section id="research" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <span className="inline-block rounded-full bg-blue-50 px-4 py-1 text-sm font-medium text-blue-600">RESEARCH</span>
            <h2 className="mt-4 text-3xl font-bold text-slate-900">科研实验</h2>
            <p className="mt-3 text-slate-500">六大研究方向，涵盖从基础研究到临床转化</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map(([id, cat]) => (
              <Link
                key={id}
                to={`/portfolio/${id}`}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:shadow-xl hover:-translate-y-1"
              >
                <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${cat.color} p-3 text-white shadow-sm`}>
                  <span className="text-2xl">{cat.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{cat.name}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{cat.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-blue-600">
                  浏览作品
                  <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 行业信息板块 — 4分类 */}
      <section id="industry" className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <span className="inline-block rounded-full bg-emerald-50 px-4 py-1 text-sm font-medium text-emerald-600">INDUSTRY</span>
            <h2 className="mt-4 text-3xl font-bold text-slate-900">行业信息</h2>
            <p className="mt-3 text-slate-500">追踪生命科学领域政策、技术与市场动态</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: '最新资讯', icon: '📰', desc: '行业新闻、政策发布与前沿突破', color: 'bg-blue-50 text-blue-700' },
              { title: '行报分析', icon: '📋', desc: '深度研究报告与趋势解读', color: 'bg-purple-50 text-purple-700' },
              { title: '市场动态', icon: '📈', desc: '市场数据、投融资与产业格局', color: 'bg-emerald-50 text-emerald-700' },
              { title: '行业标准与规范', icon: '📐', desc: '技术标准、法规指南与合规要求', color: 'bg-cyan-50 text-cyan-700' },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 text-center transition-all hover:shadow-lg"
              >
                <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl ${item.color} text-2xl`}>
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                <div className="mt-4 text-xs font-medium text-slate-400">建站中 · 即将上线</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 社区讨论板块 */}
      <section id="community" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <span className="inline-block rounded-full bg-amber-50 px-4 py-1 text-sm font-medium text-amber-600">COMMUNITY</span>
            <h2 className="mt-4 text-3xl font-bold text-slate-900">社区讨论</h2>
            <p className="mt-3 text-slate-500">学术交流、经验分享，留下你的问题和观点</p>
          </div>
          <CommentSection />
        </div>
      </section>

      {/* 快捷入口 */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 sm:grid-cols-2 max-w-lg mx-auto">
            <Link to="/videos" className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-50 text-2xl">📺</div>
              <div>
                <h3 className="font-bold text-slate-900 group-hover:text-pink-600 transition-colors">B站视频</h3>
                <p className="text-sm text-slate-500">老羊的宇宙 · 实验教程与科普</p>
              </div>
            </Link>
            <a href="https://channels.weixin.qq.com/login.html" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-2xl">🎬</div>
              <div>
                <h3 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">视频号</h3>
                <p className="text-sm text-slate-500">生命科学实验bug解决基地</p>
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
