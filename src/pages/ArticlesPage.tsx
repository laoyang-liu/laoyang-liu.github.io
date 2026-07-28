import { ExternalLink, MessageCircle } from 'lucide-react'
import { WECHAT_CONFIG, wechatArticles } from '@/data/wechat.config'
import { Badge } from '@/components/ui/badge'

export default function ArticlesPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl text-center mb-12">
        <div className="mx-auto mb-6 flex items-center justify-center">
          <span className="rounded-full bg-green-100 px-4 py-1.5 text-sm font-medium text-green-700">
            微信公众号
          </span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 lg:text-4xl">
          {WECHAT_CONFIG.accountName}
        </h1>
        <p className="mt-4 text-slate-500 max-w-2xl mx-auto">
          {WECHAT_CONFIG.description}
        </p>
        <div className="mt-6 mx-auto w-32 h-32 rounded-lg border-2 border-green-200 overflow-hidden">
          <img src={WECHAT_CONFIG.qrcodeImage} alt="公众号二维码" className="w-full h-full object-cover" />
        </div>
        <p className="mt-2 text-xs text-slate-400">扫码关注公众号</p>
      </div>

      <div className="mx-auto max-w-3xl space-y-6">
        {wechatArticles.map((article) => (
          <a
            key={article.id}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col sm:flex-row gap-4 rounded-xl border border-slate-200 bg-white p-5 transition-all hover:shadow-md"
          >
            {article.coverImage && (
              <div className="sm:w-48 flex-shrink-0">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-32 sm:h-full object-cover rounded-lg"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100">
                  公众号文章
                </Badge>
                <span className="text-xs text-slate-400">{article.date}</span>
              </div>
              <h3 className="font-bold text-slate-900 group-hover:text-green-600 transition-colors">
                {article.title}
              </h3>
              <p className="mt-2 text-sm text-slate-500 line-clamp-2">{article.summary}</p>
              <div className="mt-3 flex items-center gap-1 text-xs text-green-600">
                <ExternalLink className="h-3.5 w-3.5" />
                <span>阅读原文</span>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-12 text-center p-8 rounded-xl bg-green-50/50 border border-green-100">
        <MessageCircle className="h-8 w-8 mx-auto text-green-500" />
        <p className="mt-3 text-slate-600">
          以上为示例内容展示。实际使用时，将从公众号「{WECHAT_CONFIG.accountName}」同步最新文章。
        </p>
      </div>
    </div>
  )
}
