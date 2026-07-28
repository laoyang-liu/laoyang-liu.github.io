import { useState, useEffect } from 'react'

interface Comment {
  id: string
  name: string
  content: string
  createdAt: string
  replies: Reply[]
}

interface Reply {
  id: string
  name: string
  content: string
  createdAt: string
  parentId: string
}

const STORAGE_KEY = 'laoyang_community_comments'

function loadComments(): Comment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveComments(comments: Comment[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(comments))
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function formatTime(iso: string) {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function CommentSection() {
  const [comments, setComments] = useState<Comment[]>(loadComments)
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyName, setReplyName] = useState('')
  const [replyContent, setReplyContent] = useState('')

  useEffect(() => {
    saveComments(comments)
  }, [comments])

  const handleSubmit = () => {
    if (!name.trim() || !content.trim()) return
    const newComment: Comment = {
      id: generateId(),
      name: name.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
      replies: [],
    }
    setComments((prev) => [newComment, ...prev])
    setName('')
    setContent('')
  }

  const handleReply = (commentId: string) => {
    if (!replyName.trim() || !replyContent.trim()) return
    const newReply: Reply = {
      id: generateId(),
      name: replyName.trim(),
      content: replyContent.trim(),
      createdAt: new Date().toISOString(),
      parentId: commentId,
    }
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId ? { ...c, replies: [...c.replies, newReply] } : c
      )
    )
    setReplyingTo(null)
    setReplyName('')
    setReplyContent('')
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* 留言表单 */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 mb-8">
        <h4 className="mb-4 font-semibold text-slate-800">发表留言</h4>
        <input
          type="text"
          placeholder="你的昵称"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-3 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          maxLength={20}
        />
        <textarea
          placeholder="写下你想说的话..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          className="mb-3 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
          maxLength={500}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">{content.length}/500</span>
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || !content.trim()}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            发布留言
          </button>
        </div>
      </div>

      {/* 留言列表 */}
      {comments.length === 0 ? (
        <div className="py-12 text-center text-slate-400">
          <div className="mb-3 text-4xl">💬</div>
          <p className="text-sm">还没有留言，快来成为第一个发言的人吧</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              {/* 主评论 */}
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 text-sm font-bold text-white">
                  {comment.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800 text-sm">{comment.name}</span>
                    <span className="text-xs text-slate-400">{formatTime(comment.createdAt)}</span>
                  </div>
                  <p className="mt-1.5 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                  <button
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="mt-2 text-xs font-medium text-blue-500 hover:text-blue-700 transition-colors"
                  >
                    {replyingTo === comment.id ? '取消回复' : '回复'}
                  </button>
                </div>
              </div>

              {/* 回复列表 */}
              {comment.replies.length > 0 && (
                <div className="ml-12 mt-3 space-y-3 border-l-2 border-slate-100 pl-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex items-start gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-xs font-bold text-white">
                        {reply.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800 text-sm">{reply.name}</span>
                          <span className="text-xs text-slate-400">{formatTime(reply.createdAt)}</span>
                        </div>
                        <p className="mt-1 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 回复表单 */}
              {replyingTo === comment.id && (
                <div className="ml-12 mt-3 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                  <input
                    type="text"
                    placeholder="你的昵称"
                    value={replyName}
                    onChange={(e) => setReplyName(e.target.value)}
                    className="mb-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    maxLength={20}
                  />
                  <textarea
                    placeholder={`回复 ${comment.name}...`}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    rows={2}
                    className="mb-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
                    maxLength={300}
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => { setReplyingTo(null); setReplyName(''); setReplyContent('') }}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                    >
                      取消
                    </button>
                    <button
                      onClick={() => handleReply(comment.id)}
                      disabled={!replyName.trim() || !replyContent.trim()}
                      className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      回复
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
