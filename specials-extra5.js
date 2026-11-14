/* Beethoven 官图补入 + 3 款 Steinway Crown Jewel 尺寸变体。 */
const SPECIAL_EXTRA5 = [
  {
    brand: 'steinway', models: [
      { model: 'B-211 Kewazinga Bubinga', cm: 211, quote: true, classic: 89, sig: 'Crown Jewel Kewazinga 木皮，B-211 的收藏级外观', tags: ['Crown Jewel', 'Kewazinga'], official: 'https://www.steinway.com/pianos/steinway/grand/model-b', photo: 'crownKewazinga' },
      { model: 'D-274 East Indian Rosewood', cm: 274, quote: true, classic: 87, sig: 'Crown Jewel 东印度玫瑰木，D-274 的收藏级外观', tags: ['Crown Jewel', 'Rosewood'], official: 'https://www.steinway.com/pianos/steinway/grand/model-d', photo: 'crownRosewood' },
      { model: 'A-188 Figured Sycamore', cm: 188, quote: true, classic: 85, sig: 'Crown Jewel 花纹枫木，A-188 的收藏级外观', tags: ['Crown Jewel', 'Sycamore'], official: 'https://www.steinway.com/pianos/steinway/grand/model-a', photo: 'crownSycamore' }
    ]
  }
];

SPECIAL_EXTRA5.forEach((group) => {
  if (!SPECIAL_MODELS[group.brand]) {
    SPECIAL_MODELS[group.brand] = { name: '特别版', note: '定制特别版', madeIn: '—', highlight: '定制外观', tradeoff: '价格需确认', tags: ['特别版'], models: [] };
  }
  group.models.forEach((m) => SPECIAL_MODELS[group.brand].models.push(m));
});

Object.assign(SPECIAL_PHOTO_OVERRIDES, {
  'bosendorfer|290 Beethoven': 'bosBeethoven'
});
