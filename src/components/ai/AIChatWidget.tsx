import { useState, useRef, useEffect, useCallback } from 'react'
import { MessageCircle, X, Send, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { streamChat, getAIConfig, type ChatMessage } from '@/lib/ai-client'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

function getProviderLabel(provider: string): string {
  switch (provider) {
    case 'deepseek':
      return 'DeepSeek'
    case 'doubao':
      return '豆包'
    case 'zhipu':
      return '智谱 AI'
    default:
      return 'AI'
  }
}

const quickQuestions = [
  '介绍一下你的研究方向',
  'WB实验有哪些优化技巧',
  '讲讲细胞培养注意事项',
]

export default function AIChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '你好！我是老羊的AI学术助手 👋\n\n我可以回答关于细胞生物学、蛋白质科学、分子生物学和测序技术方面的问题。请随时提问！',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [modelInfo, setModelInfo] = useState<{ provider: string; model: string } | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getAIConfig().then(setModelInfo)
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return

    const userMsg: Message = { role: 'user', content: text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    const chatMessages: ChatMessage[] = [
      { role: 'system', content: '你是老羊的AI学术助手。老羊是一位生物科研工作者，研究方向包括细胞生物学、蛋白质科学、分子生物学和测序技术。请用友好、专业的中文回答访客的问题。回答要简洁有用。' },
      ...messages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      { role: 'user', content: text },
    ]

    // Add a placeholder assistant message
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

    await streamChat(
      chatMessages,
      (token) => {
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: updated[updated.length - 1].content + token,
          }
          return updated
        })
      },
      () => {
        setLoading(false)
      }
    )
  }, [messages, loading])

  const handleQuickQuestion = (q: string) => {
    sendMessage(q)
  }

  return (
    <>
      {/* Floating trigger button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all hover:scale-110"
          aria-label="打开AI助手"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[500px] w-[380px] max-w-[calc(100vw-2rem)] flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-3.5 text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <span className="font-semibold">AI 学术助手</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 px-4 py-3" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-md'
                        : 'bg-slate-100 text-slate-700 rounded-bl-md'
                    }`}
                  >
                    {msg.content || (loading && i === messages.length - 1 ? (
                      <span className="inline-flex gap-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '0.15s' }} />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '0.3s' }} />
                      </span>
                    ) : (
                      msg.content
                    ))}
                  </div>
                </div>
              ))}

              {/* Quick questions - show after first message */}
              {messages.length <= 1 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {quickQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleQuickQuestion(q)}
                      className="rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t p-3">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage(input)
                  }
                }}
                placeholder="输入你的问题..."
                className="min-h-[44px] resize-none rounded-xl text-sm"
                rows={1}
                disabled={loading}
              />
              <Button
                size="icon"
                className="h-11 w-11 shrink-0 rounded-xl bg-blue-600 hover:bg-blue-700"
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 text-center text-xs text-slate-400">
              {modelInfo && modelInfo.provider !== 'demo'
                ? `由 ${getProviderLabel(modelInfo.provider)} · ${modelInfo.model} 驱动 · 回答仅供参考`
                : 'Demo 模式 · 回答仅供参考'}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
