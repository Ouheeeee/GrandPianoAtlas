/* Apollo / 阿波罗：Toyo Apollo 集团，GA 国产线与 NA 日本线。 */
RAW_BRANDS.push({
  id: 'apollo', name: 'Apollo / Toyo', zh: '阿波罗', tier: 'Passable',
  country: '日本 / 中国', est: 1948,
  character: 'Apollo 与 Toyo 是同一家 Toyo Piano（东洋钢琴）：中国市场使用 Apollo，日本/海外使用 Toyo；GA 线中国上海制造，NA 线日本制造。',
  strengths: ['日本 Toyo 集团背景，制造体系成熟', 'GA / NA 两条产线，价格梯度清楚', '国内渠道与售后相对方便'],
  weaknesses: ['品牌辨识度低于 Yamaha / Kawai', '音色与整音个体差异需现场挑', '高端型号与日系一线仍有差距'],
  ratings: [2.8, 2.8, 2.6, 2.8, 2.3],
  series: [
    { name: 'GA 系列', note: '中国上海制造，阿波罗主力产线', madeIn: '中国', highlight: '价格友好，教学与家用', tradeoff: '共鸣与整音上限有限', adj: { tone: -0.2, build: -0.2, prestige: -0.2 }, tags: ['国产'], models: [
      ['GA152-WP', 152, 8, 12, '5 尺 入门小三角，价格优先'],
      ['GA198-EP', 198, 18, 25, '6 尺 6 大琴，低音更完整']
    ] },
    { name: 'NA 系列', note: '日本制造，Toyo Apollo 进口线', madeIn: '日本', highlight: '日本制造，手感与稳定性更完整', tradeoff: '价格高于 GA 线', adj: { tone: 0.1, build: 0.1 }, tags: ['日本制造'], models: [
      ['NA-148', 148, 12, 16, '4 尺 10 日本原装，小空间友好'],
      ['NA-170', 170, 18, 24, '5 尺 7 日本原装，家用主力']
    ] }
  ]
});
