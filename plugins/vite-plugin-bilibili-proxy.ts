import crypto from 'crypto'
import type { Plugin, ViteDevServer } from 'vite'

// WBI 混音密钥字符映射表
const MIXIN_KEY_ENC_TAB: number[] = [
  46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35,
  27, 43, 5, 49, 33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13,
  37, 48, 7, 16, 24, 55, 40, 61, 26, 17, 0, 1, 60, 51, 30, 4,
  22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11, 36, 20, 34, 44, 52,
]

/**
 * 从 img_key 和 sub_key 计算 mixin_key
 */
function getMixinKey(imgKey: string, subKey: string): string {
  const raw = imgKey + subKey
  return MIXIN_KEY_ENC_TAB.map((i) => raw[i]).join('').slice(0, 32)
}

/**
 * 获取 WBI 签名所需参数
 */
async function fetchWbiKeys(): Promise<{ imgKey: string; subKey: string; mixinKey: string } | null> {
  try {
    const resp = await fetch('https://api.bilibili.com/x/web-interface/nav', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
        Referer: 'https://www.bilibili.com/',
      },
    })
    const json = (await resp.json()) as any
    if (json?.data?.wbi_img) {
      const imgUrl: string = json.data.wbi_img.img_url
      const subUrl: string = json.data.wbi_img.sub_url
      const imgKey = imgUrl.split('/').pop()!.split('.')[0]
      const subKey = subUrl.split('/').pop()!.split('.')[0]
      const mixinKey = getMixinKey(imgKey, subKey)
      return { imgKey, subKey, mixinKey }
    }
    return null
  } catch {
    return null
  }
}

/**
 * 对 B站 API 请求进行 WBI 签名
 * 在 URL 的 query string 中添加 w_rid（MD5 签名）和 wts（时间戳）
 */
function signWbi(url: string, mixinKey: string): string {
  const urlObj = new URL(url)
  const wts = Math.floor(Date.now() / 1000)

  // 收集并排序参数
  const params: [string, string][] = []
  urlObj.searchParams.forEach((value, key) => {
    params.push([key, value])
  })
  params.push(['wts', String(wts)])
  params.sort((a, b) => {
    if (a[0] < b[0]) return -1
    if (a[0] > b[0]) return 1
    return 0
  })

  // 构建 query string 并计算 MD5
  const queryString = params
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v).replace(/%20/g, '+')}`)
    .join('&')
  const md5 = crypto.createHash('md5')
  md5.update(queryString + mixinKey)
  const wRid = md5.digest('hex')

  // 重新构建 URL
  urlObj.search = ''
  for (const [k, v] of params) {
    urlObj.searchParams.set(k, v)
  }
  urlObj.searchParams.set('w_rid', wRid)

  return urlObj.toString()
}

// 缓存的 WBI keys 和过期时间
let cachedKeys: { imgKey: string; subKey: string; mixinKey: string } | null = null
let cacheTime = 0
const CACHE_TTL = 30 * 60 * 1000 // 30 分钟

async function getWbiKeys(): Promise<{ imgKey: string; subKey: string; mixinKey: string } | null> {
  if (cachedKeys && Date.now() - cacheTime < CACHE_TTL) {
    return cachedKeys
  }
  const keys = await fetchWbiKeys()
  if (keys) {
    cachedKeys = keys
    cacheTime = Date.now()
  }
  return keys
}

// B站 API 的常见 User-Agent
const BILI_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'

export function bilibiliProxyPlugin(): Plugin {
  return {
    name: 'vite-plugin-bilibili-proxy',
    async configureServer(server: ViteDevServer) {
      // 预取 WBI keys
      await getWbiKeys()

      // 注册 B站 API 代理中间件
      server.middlewares.use('/api/bilibili', async (req, res, next) => {
        if (!req.url) return next()

        // 去掉 /api/bilibili 前缀，得到实际的 B站 API 路径
        const apiPath = req.url.replace(/^\/api\/bilibili/, '')
        if (!apiPath || apiPath === '/') return next()

        const targetUrl = `https://api.bilibili.com${apiPath}`

        try {
          // 获取 WBI keys
          const keys = await getWbiKeys()

          let signedUrl = targetUrl
          if (keys?.mixinKey && apiPath.includes('wbi')) {
            signedUrl = signWbi(targetUrl, keys.mixinKey)
          }

          const fetchHeaders: Record<string, string> = {
            'User-Agent': BILI_UA,
            Referer: 'https://www.bilibili.com/',
            Origin: 'https://www.bilibili.com',
            Accept: 'application/json, text/plain, */*',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
          }

          // 转发 cookies（如果有）
          if (req.headers.cookie) {
            fetchHeaders.Cookie = req.headers.cookie
          }
          if (req.headers['accept-encoding']) {
            fetchHeaders['Accept-Encoding'] = req.headers['accept-encoding']
          }

          const apiResp = await fetch(signedUrl, { headers: fetchHeaders })

          res.statusCode = apiResp.status
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.setHeader('Cache-Control', 'public, max-age=300')

          const body = await apiResp.text()
          res.end(body)
        } catch (err: any) {
          console.error('[bilibili-proxy] Error:', err.message)
          res.statusCode = 502
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ code: -1, message: '代理请求失败: ' + err.message }))
        }
      })
    },
  }
}
