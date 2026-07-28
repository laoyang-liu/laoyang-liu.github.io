import { useState } from 'react'
import { Play, Eye, MessageCircle, ExternalLink, RefreshCw, AlertCircle, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { BILIBILI_CONFIG, type BilibiliVideo } from '@/data/bilibili.config'
import { useBilibiliVideos } from '@/hooks/useBilibiliVideos'

function formatDuration(seconds: string): string {
  const s = String(seconds)
  if (s.includes(':')) return s
  const num = parseInt(s)
  if (isNaN(num)) return s
  const m = Math.floor(num / 60)
  const sec = num % 60
  return `${m}:${String(sec).padStart(2, '0')}`
}

function formatPlayCount(count: number): string {
  if (count >= 10000) return (count / 10000).toFixed(1) + '万'
  return String(count)
}

function formatTime(ts: number): string {
  if (!ts) return ''
  const d = new Date(ts * 1000)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default function VideosPage() {
  const { videos, loading, error, retry } = useBilibiliVideos()
  const [selectedVideo, setSelectedVideo] = useState<BilibiliVideo | null>(null)

  return (
    <div className="container mx-auto px-4 py-16">
      {/* 页头 */}
      <div className="mx-auto max-w-4xl text-center mb-12">
        <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-pink-50 px-4 py-2">
          <img
            src={BILIBILI_CONFIG.avatarUrl}
            alt={BILIBILI_CONFIG.accountName}
            className="h-8 w-8 rounded-full bg-pink-200 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect fill="%23f472b6" width="40" height="40" rx="20"/><text x="20" y="27" text-anchor="middle" fill="white" font-size="18">羊</text></svg>'
            }}
          />
          <span className="font-medium text-pink-700">{BILIBILI_CONFIG.accountName}</span>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 lg:text-4xl">
          B站视频
          {!loading && videos.length > 0 && (
            <span className="ml-3 text-lg font-normal text-slate-400">({videos.length} 个视频)</span>
          )}
        </h1>
        <p className="mt-4 text-slate-500">科研实验与知识分享，让我们一起探索生命科学的奥秘</p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <a
            href={BILIBILI_CONFIG.spaceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-pink-600 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-pink-700 active:scale-95 shadow-sm shadow-pink-200"
          >
            <Play className="h-4 w-4" /> 前往B站主页
          </a>
          <a
            href={`${BILIBILI_CONFIG.spaceUrl}?spm_id_from=333.337.0.0`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white px-4 py-2.5 text-sm font-medium text-pink-600 transition-all hover:bg-pink-50"
          >
            <ExternalLink className="h-4 w-4" /> 全部视频
          </a>
        </div>
      </div>

      {/* 加载状态 */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="h-10 w-10 animate-spin text-pink-500" />
          <p className="mt-4 text-sm">正在从 B站 获取视频数据...</p>
        </div>
      )}

      {/* 视频网格 */}
      {!loading && videos.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <div
              key={video.bvid}
              onClick={() => setSelectedVideo(video)}
              className="group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:shadow-lg hover:border-pink-200"
            >
              <div className="relative aspect-video overflow-hidden bg-slate-100">
                <img
                  src={video.pic}
                  alt={video.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180"><rect fill="%23f1f5f9" width="320" height="180"/><text x="160" y="95" text-anchor="middle" fill="%2394a3b8" font-size="14">封面加载中</text></svg>`
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                  <Play className="h-14 w-14 rounded-full bg-white/90 p-3 text-pink-600 opacity-0 shadow-lg transition-all group-hover:opacity-100" />
                </div>
                {video.duration && video.duration !== '0:00' && (
                  <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">
                    {formatDuration(video.duration)}
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-slate-900 line-clamp-2 group-hover:text-pink-600 transition-colors text-sm leading-snug">
                  {video.title}
                </h3>
                <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    {formatPlayCount(video.play)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3.5 w-3.5" />
                    {video.danmaku > 0 ? video.danmaku : '0'}
                  </span>
                  {video.created > 0 && (
                    <span className="ml-auto">{formatTime(video.created)}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 空状态 / 引导页 */}
      {!loading && videos.length === 0 && (
        <div className="mx-auto max-w-lg py-16 text-center">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-pink-50">
            <Play className="h-10 w-10 text-pink-400" />
          </div>

          {error && (
            <div className="mb-6 mx-auto max-w-sm rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
              <AlertCircle className="mr-1 inline h-4 w-4" />
              {error}
            </div>
          )}

          <h3 className="text-lg font-semibold text-slate-800">暂无视频数据</h3>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            暂时无法获取视频数据，请直接访问 B站主页查看最新内容
          </p>

          <div className="mt-8 flex justify-center gap-3">
            <Button onClick={retry} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" /> 重新尝试
            </Button>
            <a href={BILIBILI_CONFIG.spaceUrl} target="_blank" rel="noopener noreferrer">
              <Button className="gap-2 bg-pink-600 hover:bg-pink-700">
                <ExternalLink className="h-4 w-4" /> 打开B站
              </Button>
            </a>
          </div>
        </div>
      )}

      {/* 视频播放弹窗 */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl border-0 p-0">
          <DialogTitle className="sr-only">{selectedVideo?.title}</DialogTitle>
          {selectedVideo && (
            <div>
              <div className="aspect-video w-full rounded-t-lg overflow-hidden">
                <iframe
                  src={`https://player.bilibili.com/player.html?bvid=${selectedVideo.bvid}&page=1&high_quality=1&autoplay=1`}
                  allow="autoplay; fullscreen"
                  className="h-full w-full"
                  allowFullScreen
                  title={selectedVideo.title}
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-slate-900">{selectedVideo.title}</h3>
                {selectedVideo.description && (
                  <p className="mt-2 text-sm text-slate-500 line-clamp-3">{selectedVideo.description}</p>
                )}
                <div className="mt-3 flex items-center gap-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" /> {formatPlayCount(selectedVideo.play)} 播放
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" /> {selectedVideo.danmaku} 弹幕
                  </span>
                  <a
                    href={`https://www.bilibili.com/video/${selectedVideo.bvid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto flex items-center gap-1 text-pink-600 hover:underline"
                  >
                    在B站观看 <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
