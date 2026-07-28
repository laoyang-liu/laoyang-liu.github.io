import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { portfolioData, categoryConfig } from '@/data/portfolio'
import { BILIBILI_CONFIG } from '@/data/bilibili.config'

interface SearchResult {
  type: 'portfolio' | 'video' | 'category'
  title: string
  desc: string
  link: string
  category?: string
}

interface SearchBoxProps {
  variant?: 'light' | 'dark'
}

export default function SearchBox({ variant = 'light' }: SearchBoxProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // 关闭搜索下拉（点击外部）
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSearch = (value: string) => {
    setQuery(value)
    if (!value.trim()) {
      setResults([])
      setIsOpen(false)
      return
    }

    const q = value.toLowerCase().trim()
    const items: SearchResult[] = []

    // 搜索分类
    Object.entries(categoryConfig).forEach(([id, cat]) => {
      if (cat.name.includes(q) || cat.desc.includes(q)) {
        items.push({
          type: 'category',
          title: `${cat.icon} ${cat.name}`,
          desc: cat.desc,
          link: `/portfolio/${id}`,
        })
      }
    })

    // 搜索作品
    portfolioData.forEach((work) => {
      const matchTitle = work.title.toLowerCase().includes(q)
      const matchDesc = work.description.toLowerCase().includes(q)
      const matchTag = work.tags.some((t) => t.toLowerCase().includes(q))
      if (matchTitle || matchDesc || matchTag) {
        items.push({
          type: 'portfolio',
          title: work.title,
          desc: work.description,
          link: `/portfolio/${work.category}/${work.id}`,
          category: categoryConfig[work.category]?.name,
        })
      }
    })

    // 搜索通用关键词
    const keywordMap: Record<string, SearchResult> = {
      'b站': { type: 'video', title: 'B站视频合集', desc: `${BILIBILI_CONFIG.accountName} 的全部视频`, link: '/videos' },
      '视频': { type: 'video', title: 'B站视频合集', desc: `${BILIBILI_CONFIG.accountName} 的全部视频`, link: '/videos' },
      '科研': { type: 'category', title: '🧪 科研实验', desc: '六大研究方向分类入口', link: '/portfolio' },
      '实验': { type: 'category', title: '🧪 科研实验', desc: '六大研究方向分类入口', link: '/portfolio' },
      '分子': { type: 'category', title: `${categoryConfig.molecule.icon} 分子`, desc: categoryConfig.molecule.desc, link: '/portfolio/molecule' },
      '细胞': { type: 'category', title: `${categoryConfig.cell.icon} 细胞`, desc: categoryConfig.cell.desc, link: '/portfolio/cell' },
      '蛋白': { type: 'category', title: `${categoryConfig.protein.icon} 蛋白`, desc: categoryConfig.protein.desc, link: '/portfolio/protein' },
      'ngs': { type: 'category', title: `${categoryConfig.ngs.icon} NGS`, desc: categoryConfig.ngs.desc, link: '/portfolio/ngs' },
      '测序': { type: 'category', title: `${categoryConfig.ngs.icon} NGS`, desc: categoryConfig.ngs.desc, link: '/portfolio/ngs' },
      'ivd': { type: 'category', title: `${categoryConfig.ivd.icon} IVD`, desc: categoryConfig.ivd.desc, link: '/portfolio/ivd' },
      '诊断': { type: 'category', title: `${categoryConfig.ivd.icon} IVD`, desc: categoryConfig.ivd.desc, link: '/portfolio/ivd' },
      '医药': { type: 'category', title: `${categoryConfig.medicine.icon} 医药`, desc: categoryConfig.medicine.desc, link: '/portfolio/medicine' },
      '药物': { type: 'category', title: `${categoryConfig.medicine.icon} 医药`, desc: categoryConfig.medicine.desc, link: '/portfolio/medicine' },
    }

    // 添加匹配的关键词结果（去重）
    const addedLinks = new Set(items.map((i) => i.link))
    Object.entries(keywordMap).forEach(([key, result]) => {
      if (q.includes(key) && !addedLinks.has(result.link)) {
        items.push(result)
        addedLinks.add(result.link)
      }
    })

    setResults(items.slice(0, 10))
    setIsOpen(items.length > 0)
  }

  const handleSelect = (link: string) => {
    setIsOpen(false)
    setQuery('')
    navigate(link)
  }

  const typeLabel = (type: string) => {
    switch (type) {
      case 'category': return '分类'
      case 'portfolio': return '作品'
      case 'video': return '视频'
      default: return ''
    }
  }

  const typeColor = (type: string) => {
    switch (type) {
      case 'category': return 'bg-blue-50 text-blue-600'
      case 'portfolio': return 'bg-purple-50 text-purple-600'
      case 'video': return 'bg-pink-50 text-pink-600'
      default: return 'bg-slate-50 text-slate-600'
    }
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query.trim() && results.length > 0 && setIsOpen(true)}
          placeholder="搜索科研方向、B站视频..."
          className={`w-full rounded-xl border py-2.5 pl-10 pr-9 text-sm transition-all focus:outline-none focus:ring-2 ${
            variant === 'dark'
              ? 'border-white/20 bg-white/95 text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-blue-200'
              : 'border-slate-200 bg-white/80 text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-blue-100'
          }`}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]); setIsOpen(false); inputRef.current?.focus() }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* 搜索结果下拉 */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-slate-400">
              未找到相关内容
            </div>
          ) : (
            <div className="py-2">
              {results.map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(item.link)}
                  className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className={`mt-0.5 shrink-0 rounded-md px-2 py-0.5 text-xs font-medium ${typeColor(item.type)}`}>
                    {typeLabel(item.type)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-slate-800 truncate">{item.title}</div>
                    <div className="mt-0.5 text-xs text-slate-400 truncate">
                      {item.category ? `${item.category} · ` : ''}{item.desc}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
