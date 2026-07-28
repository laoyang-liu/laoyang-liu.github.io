import Giscus from '@giscus/react'

interface GiscusCommentSectionProps {
  term?: string
}

export default function GiscusCommentSection({ term = '社区讨论' }: GiscusCommentSectionProps) {
  const repo = import.meta.env.VITE_GISCUS_REPO || ''
  const repoId = import.meta.env.VITE_GISCUS_REPO_ID || ''
  const category = import.meta.env.VITE_GISCUS_CATEGORY || 'General'
  const categoryId = import.meta.env.VITE_GISCUS_CATEGORY_ID || ''

  // 如果未配置 Giscus，显示提示
  if (!repo || !repoId) {
    return (
      <div className="mx-auto max-w-3xl py-12 text-center">
        <div className="rounded-2xl border border-dashed border-amber-200 bg-amber-50/50 p-8">
          <div className="mb-4 text-5xl">💬</div>
          <h3 className="text-lg font-semibold text-amber-800">评论区待配置</h3>
          <p className="mt-2 text-sm text-amber-600 leading-relaxed max-w-md mx-auto">
            社区评论需要通过 GitHub Discussions 实现所有人可见。
            请配置 <code className="rounded bg-amber-100 px-1.5 py-0.5 text-xs">VITE_GISCUS_REPO</code> 等环境变量后重新部署。
          </p>
          <div className="mt-4 inline-block rounded-lg bg-white border border-amber-200 px-4 py-2 text-xs text-slate-500 text-left">
            <p className="font-semibold text-amber-700 mb-1">配置步骤：</p>
            <ol className="list-decimal list-inside space-y-0.5">
              <li>访问 <a href="https://giscus.app" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">giscus.app</a></li>
              <li>输入你的 GitHub 公开仓库名</li>
              <li>复制生成的 repo / repoId / categoryId</li>
              <li>填入 <code className="rounded bg-amber-100 px-1 py-0.5">.env</code> 文件</li>
            </ol>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Giscus
        id="community-comments"
        repo={repo as `${string}/${string}`}
        repoId={repoId}
        category={category}
        categoryId={categoryId}
        mapping="specific"
        term={term}
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="light"
        lang="zh-CN"
        loading="lazy"
      />
    </div>
  )
}
