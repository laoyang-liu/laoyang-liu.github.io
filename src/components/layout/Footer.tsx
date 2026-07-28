import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t bg-slate-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">老羊的学术空间</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              生命科学科研实验平台，聚焦分子、细胞、蛋白、NGS、IVD、医药六大方向。
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">导航</h3>
            <ul className="space-y-2">
              <li><Link to="/portfolio" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">科研实验</Link></li>
              <li><Link to="/videos" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">B站视频</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">社交媒体</h3>
            <ul className="space-y-2">
              <li><a href="https://space.bilibili.com/255795738" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-500 hover:text-pink-600 transition-colors">📺 B站：老羊的宇宙</a></li>
              <li><a href="https://channels.weixin.qq.com/login.html" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-500 hover:text-orange-600 transition-colors">🎬 视频号：生命科学实验bug解决基地</a></li>
              <li><span className="text-sm text-slate-500">💬 公众号：硕博生物实验帮</span></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">联系方式</h3>
            <ul className="space-y-2">
              <li><a href="mailto:contact@example.com" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">📧 邮件联系</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-slate-400">
          &copy; {new Date().getFullYear()} 老羊的学术空间. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
