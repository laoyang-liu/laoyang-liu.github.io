import { useState, useEffect, useCallback } from 'react'
import { BILIBILI_CONFIG, type BilibiliVideo } from '@/data/bilibili.config'

interface BilibiliViewResponse {
  code: number
  message: string
  data: {
    bvid: string
    title: string
    pic: string
    desc: string
    duration: number
    stat: {
      view: number
      danmaku: number
    }
    pubdate: number
    owner: {
      mid: number
      name: string
    }
  }
}

function mapViewVideo(data: BilibiliViewResponse['data']): BilibiliVideo {
  const m = Math.floor((data.duration || 0) / 60)
  const s = (data.duration || 0) % 60
  const pic = (data.pic || '').startsWith('//') ? 'https:' + data.pic : data.pic
  return {
    bvid: data.bvid,
    title: data.title,
    pic,
    play: data.stat?.view || 0,
    danmaku: data.stat?.danmaku || 0,
    created: data.pubdate || 0,
    description: data.desc || '',
    duration: `${m}:${String(s).padStart(2, '0')}`,
  }
}

/**
 * 通过 view API 获取单个视频详情（可靠稳定，不限流）
 */
async function fetchVideoByBvid(bvid: string): Promise<BilibiliVideo | null> {
  try {
    const url = `/api/bilibili/x/web-interface/view?bvid=${bvid}`
    const resp = await fetch(url, {
      headers: { Accept: 'application/json' },
    })

    if (!resp.ok) return null

    const json: BilibiliViewResponse = await resp.json()

    if (json.code === 0 && json.data) {
      // 验证是否属于本账号
      if (json.data.owner?.mid === BILIBILI_CONFIG.uid) {
        return mapViewVideo(json.data)
      }
    }
    return null
  } catch (err) {
    console.warn(`[Bilibili] 获取 BV ${bvid} 失败:`, err)
    return null
  }
}

export function useBilibiliVideos() {
  const [videos, setVideos] = useState<BilibiliVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVideos = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const bvs = BILIBILI_CONFIG.knownBVs

      if (bvs.length === 0) {
        setError('尚未配置视频 BV 号')
        setVideos([])
        setLoading(false)
        return
      }

      // 并行获取所有视频信息（控制并发数为 5，避免触发限流）
      const results: BilibiliVideo[] = []
      const batchSize = 5

      for (let i = 0; i < bvs.length; i += batchSize) {
        const batch = bvs.slice(i, i + batchSize)
        const batchResults = await Promise.all(batch.map(fetchVideoByBvid))
        results.push(
          ...batchResults.filter((v): v is BilibiliVideo => v !== null)
        )

        // 批次间添加小延迟
        if (i + batchSize < bvs.length) {
          await new Promise((resolve) => setTimeout(resolve, 300))
        }
      }

      // 按发布时间倒序排列
      results.sort((a, b) => b.created - a.created)

      if (results.length === 0) {
        setError('未能获取到视频信息，请检查网络连接')
      }

      setVideos(results)
    } catch (err: any) {
      console.error('[Bilibili] 获取视频失败:', err.message)
      setError(err.message || '获取视频数据失败')
      setVideos([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  return { videos, loading, error, retry: fetchVideos }
}
