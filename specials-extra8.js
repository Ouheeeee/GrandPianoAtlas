/* 新增 7 款高定 / 限量特别版：Concert Hall、Ultra 与 KIZASHI。 */
const SPECIAL_EXTRA8 = [
  {
    brand: 'steinway',
    series: {
      name: 'Concert Hall Editions',
      note: 'Steinway Concert Hall Series 限量版',
      madeIn: '美国 / 德国',
      highlight: '把音乐厅的建筑语言压缩进琴壳与内盖',
      tradeoff: '按厅定制，数量少，价格与交期需单独确认',
      tags: ['特别版', 'Concert Hall']
    },
    models: [
      { model: 'B-211 Elbphilharmonie', cm: 211, quote: true, classic: 99, sig: '汉堡易北爱乐音乐厅限定版，B-211 仅 8 台，琴盖内缘以建筑波浪为灵感。', tags: ['Concert Hall', 'Elbphilharmonie'], official: 'https://eu.steinway.com/en/pianos/limited-edition-pianos/homage-concert-halls/elbphilharmonie-edition', photo: 'elbphilharmonie' },
      { model: 'B-211 Dubai Opera', cm: 211, quote: true, classic: 98.5, sig: '迪拜歌剧院限定版，B-211 与 D-274 共 14 台，阿拉伯纹样绘于内盖。', tags: ['Concert Hall', 'Dubai Opera'], official: 'https://eu.steinway.com/en/pianos/limited-edition-pianos/homage-concert-halls/dubai-opera', photo: 'dubai' },
      { model: 'B-211 Salzburger Festspiele', cm: 211, quote: true, classic: 97.5, sig: '萨尔茨堡音乐节限定版，B-211 以节日大厅的金色与建筑线条为装饰。', tags: ['Concert Hall', 'Salzburg'], official: 'https://eu.steinway.com/en/pianos/limited-edition-pianos/homage-concert-halls/salzburger-festspiele', photo: 'salzburg' },
      { model: 'B-211 Shanghai Symphony', cm: 211, quote: true, classic: 96.5, sig: '上海交响乐团 140 周年限定版，B-211 限量 20 台，纪念乐团与城市的音乐史。', tags: ['Concert Hall', 'Shanghai'], official: 'https://eu.steinway.com/en/pianos/limited-edition-pianos/homage-concert-halls/shanghai-symphony-orchestra', photo: 'shanghai' }
    ]
  },
  {
    brand: 'steinway',
    series: {
      name: 'Ultra Limited',
      note: 'Ultra Black / Ultra White 限量版',
      madeIn: '美国 / 德国',
      highlight: '全黑或全白键盘，极端单色设计',
      tradeoff: '数量极少，属于收藏型定制',
      tags: ['特别版', 'Ultra']
    },
    models: [
      { model: 'D-274 Ultra Black', cm: 274, quote: true, classic: 98.8, sig: 'Ultra Black 限量版，D-274 全黑键盘与哑光黑漆面，全球 8 台。', tags: ['Ultra', 'Black'], official: 'https://eu.steinway.com/en/pianos/limited-edition-pianos/ultra-black-ultra-white', photo: 'ultraBlack' },
      { model: 'D-274 Ultra White', cm: 274, quote: true, classic: 98.8, sig: 'Ultra White 限量版，D-274 全白键盘与纯白漆面，全球 8 台。', tags: ['Ultra', 'White'], official: 'https://eu.steinway.com/en/pianos/limited-edition-pianos/ultra-black-ultra-white', photo: 'ultraWhite' }
    ]
  },
  {
    brand: 'shigeru',
    series: {
      name: 'KIZASHI',
      note: 'Shigeru Kawai × HERALBONY 共创',
      madeIn: '日本',
      highlight: '把艺术家的绘画直接带进 SK-EX 的琴壳',
      tradeoff: '单体艺术项目，数量与交期需向品牌确认',
      tags: ['特别版', 'KIZASHI']
    },
    models: [
      { model: 'SK-EX KIZASHI', cm: 278, quote: true, classic: 99.2, sig: 'Shigeru Kawai 与 HERALBONY 共创的 KIZASHI，以 SK-EX 为基底，彩绘琴壳关注多元表达。', tags: ['KIZASHI', 'HERALBONY'], official: 'https://www.shigerukawai.jp/news/20261021/', photo: 'kizashi' }
    ]
  }
];

SPECIAL_EXTRA8.forEach((group) => {
  if (!SPECIAL_MODELS[group.brand]) {
    SPECIAL_MODELS[group.brand] = Object.assign({ name: '特别版', note: '定制特别版', madeIn: '—', highlight: '定制外观', tradeoff: '价格需确认', tags: ['特别版'] }, group.series || {}, { models: [] });
  }
  group.models.forEach((m) => SPECIAL_MODELS[group.brand].models.push(m));
});
