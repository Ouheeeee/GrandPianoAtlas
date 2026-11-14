/* Wilh. Steinberg 百年珍藏 / 透明艺术琴。 */
const SPECIAL_EXTRA6 = [
  {
    brand: 'steinberg', models: [
      { model: 'WS-D275', cm: 275, quote: true, classic: 91, sig: '百年珍藏系列旗舰，275cm 音乐会大琴；德国 Eisenberg 制造，传统音色与完整低音。', tags: ['百年珍藏', '德国制造'], official: 'http://www.wilh-steinberg.cn/Piano/WS', photo: 'wsD275' },
      { model: 'WS-B211', cm: 211, quote: true, classic: 88, sig: '百年珍藏系列 211cm，家用大琴尺寸；德产工艺，声音温暖，适合客厅与教学。', tags: ['百年珍藏', '德国制造'], official: 'http://www.wilh-steinberg.cn/Piano/WS', photo: 'wsB211' },
      { model: 'WS-A188ID-B2DII', cm: 188, quote: true, classic: 86, sig: '透明艺术琴，亚克力琴壳与金属结构；百年珍藏系列中最具辨识度的 Art Case。', tags: ['透明艺术琴', '百年珍藏'], official: 'http://www.wilh-steinberg.cn/Piano/WS', photo: 'wsA188ID' }
    ]
  }
];

SPECIAL_EXTRA6.forEach((group) => {
  if (!SPECIAL_MODELS[group.brand]) {
    SPECIAL_MODELS[group.brand] = { name: '特别版', note: '定制特别版', madeIn: '—', highlight: '定制外观', tradeoff: '价格需确认', tags: ['特别版'], models: [] };
  }
  group.models.forEach((m) => SPECIAL_MODELS[group.brand].models.push(m));
});
