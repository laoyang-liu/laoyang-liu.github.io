export interface WechatArticle {
  id: string
  title: string
  summary: string
  date: string
  url: string
  coverImage?: string
}

export const WECHAT_CONFIG = {
  accountName: '硕博生物实验帮',
  qrcodeImage: 'https://placehold.co/300x300/f0fdf4/22c55e?text=公众号二维码',
  description: '专注于生物实验技术分享，为硕博研究生提供实验技巧、文献解读和科研心得。',
}

export const wechatArticles: WechatArticle[] = [
  {
    id: 'wx-001',
    title: '实验室必备：最全抗体选择指南（建议收藏）',
    summary: '抗体是WB、IHC、IF等实验的核心试剂。本文从抗体类型、品牌选择、验证方法等多角度，为科研人员提供一份全面的抗体选择指南。',
    date: '2026-07-05',
    url: '#',
    coverImage: 'https://placehold.co/600x400/fef3c7/f59e0b?text=抗体选择',
  },
  {
    id: 'wx-002',
    title: '细胞转染效率低？这5个优化策略帮你搞定',
    summary: '转染是分子生物学实验的基础操作，但效率低是很多人遇到的难题。本文总结了提高转染效率的5个关键优化策略。',
    date: '2026-06-28',
    url: '#',
    coverImage: 'https://placehold.co/600x400/dbeafe/3b82f6?text=细胞转染',
  },
  {
    id: 'wx-003',
    title: '研究生三年，我学到的 10 条科研经验',
    summary: '从选题、实验设计到论文写作，一位生物学博士分享读研三年积累的宝贵经验和教训。',
    date: '2026-06-20',
    url: '#',
    coverImage: 'https://placehold.co/600x400/f3e8ff/8b5cf6?text=科研经验',
  },
  {
    id: 'wx-004',
    title: 'qPCR 数据分析从入门到精通（含实操代码）',
    summary: '系统讲解 qPCR 的数据处理方法，从 Ct 值到相对表达量，附带 R 语言和 GraphPad 操作教程。',
    date: '2026-06-15',
    url: '#',
    coverImage: 'https://placehold.co/600x400/ecfdf5/10b981?text=qPCR+分析',
  },
  {
    id: 'wx-005',
    title: '如何高效阅读一篇 SCI 论文？三步法分享',
    summary: '面对海量文献，如何快速抓住重点？本文分享一套实用的文献阅读三步法：筛选→精读→笔记。',
    date: '2026-06-08',
    url: '#',
    coverImage: 'https://placehold.co/600x400/fdf2f8/ec4899?text=文献阅读',
  },
  {
    id: 'wx-006',
    title: '蛋白质纯化：Ni-NTA 亲和层析的最全优化方案',
    summary: 'His标签蛋白纯化是蛋白实验中最高频的操作之一。本文详细介绍Ni-NTA层析的原理、操作步骤和常见问题解决方案。',
    date: '2026-06-01',
    url: '#',
    coverImage: 'https://placehold.co/600x400/f0f9ff/0ea5e9?text=蛋白纯化',
  },
]
