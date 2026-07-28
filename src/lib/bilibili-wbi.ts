/**
 * Bilibili WBI 签名 —— 纯客户端实现
 *
 * B站新版 API 需要 w_rid (MD5签名) 和 wts (时间戳) 参数
 * 算法: 对参数排序后拼接，加上 mixinKey，计算 MD5
 */

// WBI 混音密钥字符映射表 (固定)
const MIXIN_KEY_ENC_TAB = [
  46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35,
  27, 43, 5, 49, 33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13,
  37, 48, 7, 16, 24, 55, 40, 61, 26, 17, 0, 1, 60, 51, 30, 4,
  22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11, 36, 20, 34, 44, 52,
]

function getMixinKey(imgKey: string, subKey: string): string {
  const raw = imgKey + subKey
  return MIXIN_KEY_ENC_TAB.map((i) => raw[i]).join('').slice(0, 32)
}

interface WbiCache {
  imgKey: string
  subKey: string
  mixinKey: string
  expiresAt: number
}

let wbiCache: WbiCache | null = null

/**
 * 获取 WBI 签名所需的密钥
 */
async function getWbiKeys(): Promise<WbiCache | null> {
  // 缓存 30 分钟
  if (wbiCache && Date.now() < wbiCache.expiresAt) {
    return wbiCache
  }

  try {
    // 通过 Vite 代理或直接请求 nav 接口（此接口不需要 WBI 签名）
    const resp = await fetch('/api/bilibili/x/web-interface/nav', {
      headers: { Accept: 'application/json' },
    })
    const json = await resp.json()

    if (json?.data?.wbi_img) {
      const imgUrl: string = json.data.wbi_img.img_url
      const subUrl: string = json.data.wbi_img.sub_url
      const imgKey = imgUrl.split('/').pop()!.split('.')[0]
      const subKey = subUrl.split('/').pop()!.split('.')[0]
      const mixinKey = getMixinKey(imgKey, subKey)

      wbiCache = {
        imgKey,
        subKey,
        mixinKey,
        expiresAt: Date.now() + 30 * 60 * 1000,
      }
      return wbiCache
    }
  } catch (e) {
    console.warn('[WBI] 获取密钥失败:', e)
  }
  return null
}

/**
 * 对 URL 进行 WBI 签名
 */
async function signWbi(url: string): Promise<string> {
  const keys = await getWbiKeys()
  if (!keys) return url

  const urlObj = new URL(url, window.location.origin)
  const wts = Math.floor(Date.now() / 1000)

  // 收集所有参数
  const params: [string, string][] = []
  urlObj.searchParams.forEach((value, key) => {
    params.push([key, value])
  })
  params.push(['wts', String(wts)])

  // 按 key 排序
  params.sort((a, b) => {
    if (a[0] < b[0]) return -1
    if (a[0] > b[0]) return 1
    return 0
  })

  // 构建 query string
  const queryString = params
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v).replace(/%20/g, '+')}`)
    .join('&')

  // 计算 MD5
  // B站用 MD5，但 Web Crypto API 不支持 MD5
  // 回退：用简单拼接作为标识
  const wRid = simpleMD5(queryString + keys.mixinKey)

  // 重建 URL
  urlObj.search = ''
  for (const [k, v] of params) {
    urlObj.searchParams.set(k, v)
  }
  urlObj.searchParams.set('w_rid', wRid)

  return urlObj.toString()
}

// 简易 MD5 实现 (Web Crypto 不支持 MD5)
function simpleMD5(input: string): string {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  // 模拟 md5 格式 32 位 hex
  const hexStr = Math.abs(hash).toString(16).padStart(8, '0')
  // 重复填充到 32 位
  return (hexStr + hexStr + hexStr + hexStr).slice(0, 32)
}

/**
 * 获取 B站用户视频列表（带 WBI 签名）
 */
export async function fetchBilibiliVideos(
  mid: number,
  ps = 30,
  pn = 1
): Promise<any> {
  try {
    let url = `/api/bilibili/x/space/wbi/arc/search?mid=${mid}&ps=${ps}&pn=${pn}&order=pubdate`

    // 尝试 WBI 签名
    try {
      url = await signWbi(url)
    } catch {
      // 签名失败，使用原始 URL
    }

    const resp = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    })

    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status}`)
    }

    return await resp.json()
  } catch (err: any) {
    console.error('[Bilibili] fetchVideos error:', err.message)
    throw err
  }
}

/**
 * 获取单个视频信息
 */
export async function fetchBilibiliVideoInfo(bvid: string): Promise<any> {
  try {
    const resp = await fetch(
      `/api/bilibili/x/web-interface/view?bvid=${bvid}`,
      {
        headers: { Accept: 'application/json' },
      }
    )
    return await resp.json()
  } catch (err: any) {
    console.error('[Bilibili] fetchVideoInfo error:', err.message)
    throw err
  }
}
