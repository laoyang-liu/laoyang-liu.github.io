export interface BilibiliVideo {
  bvid: string
  title: string
  pic: string
  play: number
  danmaku: number
  created: number
  description: string
  duration: string
}

export const BILIBILI_CONFIG = {
  accountName: '老羊的宇宙',
  uid: 255795738,
  spaceUrl: 'https://space.bilibili.com/255795738',
  avatarUrl: 'https://i0.hdslb.com/bfs/face/7086093aeafe51545b9556983e45005df3594ae0.jpg',

  // 已知的视频 BV 号列表（已从搜索 API 获取）
  // 如果有新视频发布，在此添加 BV 号即可
  knownBVs: [
    'BV1nDrkYPEG5',  // 生物试剂公司技术支持工作年终总结～
    'BV1XnkcYiEQi',  // 你们觉得读书能改变命运吗？
    'BV1RNqrY3EdQ',  // qPCR作图，包学包会的！！！
    'BV18VqNYFE7W',  // 普通人租房的room tour
    'BV1EJ4m1L7do',  // 【毕业生请进】找工作选体制内还是企业
    'BV1Pr421H71k',  // 朋友们，来对着烟花许愿吗？
    'BV11C4y1C7bq',  // qPCR的探针怎么设计
    'BV1tw411j7dX',  // 关于论文造假，戴建业老师这样说
    'BV1Sg4y117f7',  // 多功能酶标仪测不出来读数是什么原因
    'BV1nk4y1U7rB',  // 如何设置全长目的基因的上游和下游引物
    'BV1uW4y1N7L3',  // 今年没有年终奖
    'BV1Eg4y1f7c1',  // 一件发生在张家界的真实事件
    'BV1KF4m1L7UN',  // 云南，记录一下我的旅行～
  ],
}
