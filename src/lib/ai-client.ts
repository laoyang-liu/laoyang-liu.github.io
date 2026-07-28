export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

function parseSSEChunk(chunk: string): string {
  const lines = chunk.split('\n')
  let content = ''
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || !trimmed.startsWith('data:')) continue
    const data = trimmed.slice(5).trim()
    if (data === '[DONE]') break
    try {
      const parsed = JSON.parse(data)
      const delta = parsed.choices?.[0]?.delta?.content || ''
      content += delta
    } catch {
      // ignore malformed sse data
    }
  }
  return content
}

export async function streamChat(
  messages: ChatMessage[],
  onToken: (token: string) => void,
  onDone: () => void
): Promise<void> {
  try {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        stream: true,
        temperature: 0.7,
      }),
    })

    if (!res.ok || !res.body) {
      throw new Error(`AI service error: ${res.status}`)
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const parts = buffer.split('\n\n')
      buffer = parts.pop() || ''
      for (const part of parts) {
        const token = parseSSEChunk(part)
        if (token) onToken(token)
      }
    }

    if (buffer) {
      const token = parseSSEChunk(buffer)
      if (token) onToken(token)
    }

    onDone()
  } catch {
    onToken('AI 服务暂时不可用，请稍后再试。')
    onDone()
  }
}

export async function summarize(content: string): Promise<string> {
  try {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: '你是一个科研助手，请用中文对以下研究内容生成3-5个要点摘要，每条一句话。' },
          { role: 'user', content },
        ],
        temperature: 0.5,
      }),
    })

    const data = await res.json()
    return data.choices?.[0]?.message?.content || '无法生成摘要'
  } catch {
    return '摘要生成功能暂时不可用'
  }
}

export async function getAIConfig(): Promise<{ provider: string; model: string }> {
  try {
    const res = await fetch('/api/ai/config')
    return await res.json()
  } catch {
    return { provider: 'demo', model: 'demo' }
  }
}

export async function recommend(currentTitle: string): Promise<string[]> {
  try {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: '基于用户正在浏览的内容，推荐相关的科研方向或实验技术供其进一步了解。返回一个JSON数组，包含3个推荐，每个推荐是一个简短的字符串。只返回JSON。' },
          { role: 'user', content: `我正在浏览: ${currentTitle}` },
        ],
        temperature: 0.7,
      }),
    })

    const data = await res.json()
    const text = data.choices?.[0]?.message?.content || '[]'
    try {
      return JSON.parse(text)
    } catch {
      return text.split('\n').filter(Boolean).slice(0, 3)
    }
  } catch {
    return ['了解更多实验技术', '浏览相关研究方向', '查看最新科研动态']
  }
}
