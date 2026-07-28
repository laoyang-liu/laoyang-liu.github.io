import { useParams, Link } from 'react-router-dom'
import { portfolioData, categoryConfig } from '@/data/portfolio'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download, FileText } from 'lucide-react'

export default function WorkDetailPage() {
  const { category, workId } = useParams<{ category: string; workId: string }>()
  const work = portfolioData.find((w) => w.category === category && w.id === workId)

  if (!work) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">作品未找到</h1>
        <Link to="/portfolio" className="mt-4 inline-block text-blue-600 hover:underline">返回科研实验</Link>
      </div>
    )
  }

  const isFile = !!work.filePath
  const fileUrl = isFile ? `/${work.filePath}` : null

  const handleDownload = () => {
    // 下载事件已记录
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">首页</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/portfolio">科研实验</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/portfolio/${category}`}>{categoryConfig[category!]?.name || category}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{work.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mx-auto max-w-4xl">
        {/* File-type header card */}
        {isFile ? (
          <div className={`mb-8 flex items-center gap-4 rounded-xl p-6 ${
            work.fileType === 'PDF'
              ? 'bg-gradient-to-r from-red-50 to-red-100 border border-red-200'
              : 'bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200'
          }`}>
            <div className={`flex h-16 w-16 items-center justify-center rounded-xl shadow-md ${
              work.fileType === 'PDF' ? 'bg-red-500' : 'bg-blue-500'
            }`}>
              <FileText className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`rounded px-2 py-0.5 text-xs font-bold ${
                  work.fileType === 'PDF' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                }`}>
                  {work.fileType} 文档
                </span>
                <span className="text-sm text-slate-500">可下载</span>
              </div>
              <p className="mt-1 text-sm text-slate-600">
                点击下方按钮下载完整文档，在本地查阅实验方案的详细内容。
              </p>
            </div>
            {fileUrl && (
              <a href={fileUrl} download onClick={handleDownload}>
                <Button className={`gap-2 shadow-md ${
                  work.fileType === 'PDF'
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}>
                  <Download className="h-4 w-4" />
                  下载 {work.fileType}
                </Button>
              </a>
            )}
          </div>
        ) : work.images?.[0] ? (
          <div className="mb-8 overflow-hidden rounded-xl">
            <img
              src={work.images[0]}
              alt={work.title}
              className="w-full aspect-video object-cover"
            />
          </div>
        ) : null}

        <h1 className="text-3xl font-bold text-slate-900 lg:text-4xl">{work.title}</h1>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
          {work.date && <span>{work.date}</span>}
          {work.authors && work.authors.length > 0 && (
            <span>来源：{work.authors.join(', ')}</span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {work.tags.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>

        <p className="mt-6 text-lg text-slate-600 leading-relaxed">{work.description}</p>

        {work.method && (
          <div className="mt-6 rounded-lg bg-slate-50 p-4">
            <h3 className="text-sm font-semibold text-slate-700">实验方法</h3>
            <p className="mt-1 text-sm text-slate-500">{work.method}</p>
          </div>
        )}

        {work.doi && (
          <div className="mt-4">
            <span className="text-sm text-slate-500">DOI: </span>
            <a href={`https://doi.org/${work.doi}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
              {work.doi}
            </a>
          </div>
        )}

        {work.content && (
          <div className="mt-8 border-t pt-8">
            <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: work.content.replace(/\n/g, '<br/>') }} />
          </div>
        )}

        {isFile && (
          <div className="mt-8 border-t pt-8 text-center">
            <p className="mb-4 text-slate-500">此文档可在下载后离线查阅完整实验方案</p>
            <a href={fileUrl!} download onClick={handleDownload}>
              <Button size="lg" className={`gap-2 ${
                work.fileType === 'PDF'
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}>
                <Download className="h-5 w-5" />
                下载 {work.fileType} 文档
              </Button>
            </a>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            to={`/portfolio/${category}`}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-6 py-3 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            &larr; 返回「{categoryConfig[category!]?.name}」列表
          </Link>
        </div>
      </div>
    </div>
  )
}
