/* 第三轮特别款补充：Blüthner Imperial Edition 官方设计版本。 */
const SPECIAL_EXTRA3 = [
  {
    brand: 'bluthner', models: [
      { model: 'Kaiser Wilhelm', cm: 280, quote: true, classic: 86, sig: '威廉皇帝风格琴壳，Blüthner Imperial Edition 的德皇版本', tags: ['Kaiser Wilhelm', 'Imperial Edition'], official: 'https://bluthner.co.uk/pianos/imperial-edition', photo: 'bluthKaiser' },
      { model: 'Tsar Nicolaus', cm: 238, quote: true, classic: 84, sig: '沙皇尼古拉风格琴壳与珍稀木皮，Imperial Edition 的俄国宫廷版本', tags: ['Tsar Nicolaus', 'Imperial Edition'], official: 'https://bluthner.co.uk/pianos/imperial-edition', photo: 'bluthTsar' },
      { model: 'Dynasty', cm: 280, quote: true, classic: 82, sig: '王朝主题红色艺术琴壳，Imperial Edition 的收藏版本', tags: ['Dynasty', 'Imperial Edition'], official: 'https://bluthner.co.uk/pianos/imperial-edition', photo: 'bluthDynasty' },
      { model: 'Ambassador', cm: 238, quote: true, classic: 76, sig: '大使主题珍稀木皮琴壳，Imperial Edition 的典藏版本', tags: ['Ambassador', 'Imperial Edition'], official: 'https://bluthner.co.uk/pianos/imperial-edition', photo: 'bluthAmbassador' },
      { model: 'Jubilee', cm: 238, quote: true, classic: 70, sig: '周年纪念版黑色艺术琴壳，Imperial Edition 的庆典版本', tags: ['Jubilee', 'Imperial Edition'], official: 'https://bluthner.co.uk/pianos/imperial-edition', photo: 'bluthJubilee' },
      { model: 'President', cm: 280, quote: true, classic: 68, sig: '总统主题黑色艺术琴壳，Imperial Edition 的官方版本', tags: ['President', 'Imperial Edition'], official: 'https://bluthner.co.uk/pianos/imperial-edition', photo: 'bluthPresident' },
      { model: 'Senator', cm: 210, quote: true, classic: 64, sig: '参议员主题绿色艺术琴壳，Imperial Edition 的古典版本', tags: ['Senator', 'Imperial Edition'], official: 'https://bluthner.co.uk/pianos/imperial-edition', photo: 'bluthSenator' }
    ]
  }
];

SPECIAL_EXTRA3.forEach((group) => {
  if (!SPECIAL_MODELS[group.brand]) {
    SPECIAL_MODELS[group.brand] = { name: '特别版', note: '定制特别版', madeIn: '—', highlight: '定制外观', tradeoff: '价格需确认', tags: ['特别版'], models: [] };
  }
  group.models.forEach((m) => SPECIAL_MODELS[group.brand].models.push(m));
});

Object.assign(SPECIAL_PHOTO_OVERRIDES, {
  'bluthner|Model 1 Julius Blüthner Edition': 'bluthJulius',
  'bluthner|Model 1 Louis XIV': 'bluthLouis',
  'bluthner|Model 2 Queen Victoria': 'bluthQueen',
  'bluthner|Model 4 Louis XIV': 'bluthLouis'
});
