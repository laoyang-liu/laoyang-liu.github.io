import type { Plugin } from 'vite'
import type { IncomingMessage, ServerResponse } from 'http'

type Provider = 'zhipu' | 'deepseek' | 'doubao'

interface AIConfig {
  provider: Provider
  apiKey: string
  endpoint: string
  model: string
}

function getRequestBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve) => {
    let body = ''
    req.on('data', (chunk: Buffer) => {
      body += chunk.toString()
    })
    req.on('end', () => {
      resolve(body)
    })
  })
}

function loadAIConfig(): AIConfig | null {
  const provider = (process.env.AI_PROVIDER || 'zhipu').toLowerCase() as Provider

  if (provider === 'deepseek') {
    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) return null
    return {
      provider,
      apiKey,
      endpoint: process.env.DEEPSEEK_API_ENDPOINT || 'https://api.deepseek.com/chat/completions',
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
    }
  }

  if (provider === 'doubao') {
    const apiKey = process.env.DOUBAO_API_KEY
    if (!apiKey) return null
    return {
      provider,
      apiKey,
      endpoint: process.env.DOUBAO_API_ENDPOINT || 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
      model: process.env.DOUBAO_MODEL || 'doubao-1-5-pro-32k-250115',
    }
  }

  const apiKey = process.env.ZHIPUAI_API_KEY
  if (!apiKey) return null
  return {
    provider: 'zhipu',
    apiKey,
    endpoint: process.env.ZHIPUAI_API_ENDPOINT || 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    model: process.env.ZHIPUAI_MODEL || 'glm-5.2',
  }
}

function setCORS(res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

export function aiProxyPlugin(): Plugin {
  return {
    name: 'ai-proxy',
    configureServer(server) {
      server.middlewares.use('/api/ai', async (req: IncomingMessage, res: ServerResponse) => {
        setCORS(res)

        if (req.method === 'OPTIONS') {
          res.statusCode = 204
          res.end()
          return
        }

        if (req.url === '/api/ai/config') {
          const config = loadAIConfig()
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({
            provider: config?.provider || 'demo',
            model: config?.model || 'demo',
          }))
          return
        }

        const config = loadAIConfig()
        const body = await getRequestBody(req)
        let parsedBody: Record<string, unknown> = {}
        try {
          parsedBody = JSON.parse(body)
        } catch {
          // ignore parse errors
        }

        // No API key → demo mode with template responses
        if (!config) {
          let userMessage = ''
          try {
            const messages = parsedBody.messages as ChatMessage[] | undefined
            userMessage = messages?.[messages.length - 1]?.content || ''
          } catch {
            // ignore
          }

          const content = generateDemoResponse(userMessage)
          const stream = parsedBody.stream === true

          if (stream) {
            res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
            res.setHeader('Cache-Control', 'no-cache')
            res.setHeader('Connection', 'keep-alive')
            const ssePayload = {
              id: 'demo',
              object: 'chat.completion.chunk',
              created: Math.floor(Date.now() / 1000),
              model: 'demo',
              choices: [{ index: 0, delta: { role: 'assistant', content }, finish_reason: null }],
            }
            res.write(`data: ${JSON.stringify(ssePayload)}\n\n`)
            res.write('data: [DONE]\n\n')
            res.end()
          } else {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({
              choices: [{
                message: { content },
              }],
            }))
          }
          return
        }

        // Real API call
        try {
          const upstreamBody = JSON.stringify({
            ...parsedBody,
            model: config.model,
            stream: parsedBody.stream === true,
          })

          const upstream = await fetch(config.endpoint, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${config.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: upstreamBody,
          })

          if (!upstream.ok) {
            const text = await upstream.text()
            throw new Error(`Upstream ${upstream.status}: ${text}`)
          }

          // Stream upstream response directly if SSE
          if (parsedBody.stream === true) {
            res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
            res.setHeader('Cache-Control', 'no-cache')
            res.setHeader('Connection', 'keep-alive')

            const reader = upstream.body?.getReader()
            if (!reader) {
              throw new Error('No response body from upstream')
            }

            let finished = false
            while (!finished) {
              const { done, value } = await reader.read()
              if (done) {
                finished = true
                break
              }
              res.write(Buffer.from(value))
            }
            res.end()
          } else {
            const data = await upstream.text()
            res.setHeader('Content-Type', 'application/json')
            res.end(data)
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : 'AI 服务暂时不可用，请稍后再试。'
          console.error('[ai-proxy] upstream error:', message)

          if (parsedBody.stream === true) {
            res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
            const errorPayload = {
              id: 'error',
              object: 'chat.completion.chunk',
              created: Math.floor(Date.now() / 1000),
              model: config.model,
              choices: [{ index: 0, delta: { content: 'AI 服务暂时不可用，请稍后再试。' }, finish_reason: 'stop' }],
            }
            res.write(`data: ${JSON.stringify(errorPayload)}\n\n`)
            res.write('data: [DONE]\n\n')
            res.end()
          } else {
            res.statusCode = 502
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({
              choices: [{ message: { content: 'AI 服务暂时不可用，请稍后再试。' } }],
            }))
          }
        }
      })
    },
  }
}

function generateDemoResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase()

  if (msg.includes('研究') || msg.includes('方向')) {
    return '我们的研究方向涵盖四个主要领域：🦠 细胞生物学（细胞信号转导与功能调控）、🧬 蛋白质科学（表达纯化与结构解析）、⚛️ 分子生物学（分子互作与信号通路）、📊 测序技术（高通量测序与生物信息学）。你想深入了解哪个方向呢？'
  }

  if (msg.includes('实验') || msg.includes('技术')) {
    return '我们在实验中主要使用免疫共沉淀(Co-IP)、Western Blot、CRISPR-Cas9基因编辑、X射线晶体衍射、单细胞RNA-seq、ChIP-seq、ATAC-seq等技术。如果你对某个具体技术感兴趣，我可以详细讲解实验原理和操作要点！'
  }

  if (msg.includes('wb') || msg.includes('western') || msg.includes('蛋白印迹')) {
    return 'Western Blot是我们最常用的实验技术之一。关键步骤包括：1) SDS-PAGE电泳分离蛋白；2) 转膜（湿转或半干转）；3) 封闭（5%脱脂牛奶或BSA）；4) 一抗孵育（4°C过夜）；5) 二抗孵育；6) ECL显影。常见问题：条带位置不对（检查分子量marker）、背景过高（增加封闭时间）、无信号（检查抗体效价和ECL试剂）。需要我帮你排查具体问题吗？'
  }

  if (msg.includes('你好') || msg.includes('嗨') || msg.includes('hi') || msg.includes('hello')) {
    return '你好！我是老羊的AI学术助手。我可以回答关于细胞生物学、蛋白质科学、分子生物学和测序技术方面的问题。你也可以浏览网页上的科研作品、B站视频和公众号文章来了解更多内容。有什么我可以帮你的吗？'
  }

  if (msg.includes('细胞')) {
    return '在细胞生物学领域，我们主要关注细胞凋亡信号通路、原代细胞培养体系优化以及肿瘤细胞迁移与侵袭的分子机制。如果你对细胞培养或凋亡通路有疑问，欢迎交流！'
  }

  if (msg.includes('蛋白')) {
    return '蛋白质科学是我们的核心研究领域之一。蛋白质的纯化、结晶和结构解析是一个系统性的工作流程，每一步都需要仔细优化。'
  }

  if (msg.includes('分子')) {
    return '分子生物学研究中，我们利用定量蛋白质组学技术鉴定了p53信号网络中的新型互作蛋白。如果你在做Co-IP、AP-MS或荧光素酶报告基因实验，我可以分享一些实操经验。'
  }

  if (msg.includes('测序') || msg.includes('seq') || msg.includes('生信')) {
    return '我们利用单细胞RNA-seq、ChIP-seq和ATAC-seq等高通量测序技术开展研究。在数据分析方面，我们使用Seurat、Monocle、HOMER等工具进行生物信息学分析。'
  }

  return '感谢你的提问！我是老羊的AI学术助手，专注于生物科研领域的知识解答。你可以问我关于实验技术、研究方向的任何问题，也可以让我帮你分析实验数据、推荐相关文献。请随时提问！'
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}
