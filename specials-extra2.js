/* 第二轮特别款扩充：Bechstein / Fazioli / Steinway / Bösendorfer。 */
const SPECIAL_EXTRA2 = [
  {
    brand: 'bechstein', models: [
      { model: 'D 282 Vogelaugenahorn', cm: 282, quote: true, classic: 95, sig: '鸟眼枫木琴壳与贝希斯坦手工整音，D 282 的珍稀木皮版本', tags: ['鸟眼枫木', '珍稀木皮'], official: 'https://bechstein.com/en/special-editions/c-bechstein-birds-eye-maple-grand-piano/', photo: 'bechMaple' },
      { model: 'B 212 Sterling', cm: 212, quote: true, classic: 88, sig: '银色金属漆面与 Art Case 细节，B 212 的收藏级外观版本', tags: ['Sterling', '银色漆面'], official: 'https://bechstein.com/en/special-editions/c-bechstein-sterling-grand-piano/', photo: 'bechSterling' }
    ]
  },
  {
    brand: 'fazioli', models: [
      { model: 'Ebony Black & White (F212)', cm: 212, quote: true, classic: 84, sig: '黑白对比艺术琴壳，F212 的现代收藏版本', tags: ['Ebony', 'Black & White'], official: 'https://www.fazioli.com/en/special-models/ebony-black-white/', photo: 'fazioliEbony' },
      { model: 'Eucalipto Fumé (F228)', cm: 228, quote: true, classic: 82, sig: '烟熏桉木艺术琴壳，F228 的珍稀木皮版本', tags: ['Eucalipto', '烟熏木皮'], official: 'https://www.fazioli.com/en/special-models/eucalipto-fume/', photo: 'fazioliEucalipto' },
      { model: 'First Light (F212)', cm: 212, quote: true, classic: 80, sig: 'First Light 艺术漆面，F212 的限量收藏版本', tags: ['First Light', '艺术漆面'], official: 'https://www.fazioli.com/en/special-models/first-light/', photo: 'fazioliFirstLight' },
      { model: 'Origami Fairmont (F228)', cm: 228, quote: true, classic: 76, sig: 'Origami 折纸灵感琴壳，F228 的建筑艺术版本', tags: ['Origami', 'Fairmont'], official: 'https://www.fazioli.com/en/special-models/origami-fairmont-2/', photo: 'fazioliOrigami' },
      { model: 'Red Elm (F212)', cm: 212, quote: true, classic: 70, sig: '红榆木艺术琴壳与 F212 的透明音色', tags: ['Red Elm', '珍稀木皮'], official: 'https://www.fazioli.com/en/special-models/red-elm-2/', photo: 'fazioliRedElm' },
      { model: 'Rovere Fumé (F278)', cm: 278, quote: true, classic: 66, sig: '烟熏橡木艺术琴壳，F278 的音乐会规模', tags: ['Rovere', '烟熏橡木'], official: 'https://www.fazioli.com/en/special-models/rovere-fume/', photo: 'fazioliRovere' },
      { model: 'Telus (F228)', cm: 228, quote: true, classic: 58, sig: 'Telus 艺术琴壳与 F228 的清晰音色', tags: ['Telus', '艺术琴壳'], official: 'https://www.fazioli.com/en/special-models/telus/', photo: 'fazioliTelus' }
    ]
  },
  {
    brand: 'steinway', models: [
      { model: 'D-274 Straw Marquetry', cm: 274, quote: true, classic: 92, sig: '麦秆镶嵌艺术琴壳，D-274 的限量收藏版本', tags: ['Straw Marquetry', '限量'], official: 'https://eu.steinway.com/en/pianos/limited-edition-pianos/straw-marquetry', photo: 'stStraw' },
      { model: 'B-211 Straw Marquetry', cm: 211, quote: true, classic: 90, sig: '麦秆镶嵌艺术琴壳，B-211 的限量收藏版本', tags: ['Straw Marquetry', '限量'], official: 'https://eu.steinway.com/en/pianos/limited-edition-pianos/straw-marquetry', photo: 'stStraw' },
      { model: 'B-211 Black Masterpiece', cm: 211, quote: true, classic: 86, sig: 'Black Masterpiece 限量版，黑色艺术漆面与 Spirio | r', tags: ['Black Masterpiece', '限量'], official: 'https://eu.steinway.com/en/pianos/limited-edition-pianos/black-masterpiece', photo: 'stBlackMasterpiece' },
      { model: 'B-211 Disney', cm: 211, quote: true, classic: 84, sig: 'Disney 米奇主题限量版，艺术家 Elena Salmistraro 设计', tags: ['Disney', '限量'], official: 'https://eu.steinway.com/en/pianos/limited-edition-pianos/disney', photo: 'stDisney' },
      { model: 'B-211 Homage Concert Halls', cm: 211, quote: true, classic: 82, sig: 'Homage Concert Halls 系列，向音乐厅致敬的限量版', tags: ['Homage', '音乐厅'], official: 'https://eu.steinway.com/en/pianos/limited-edition-pianos/homage-concert-halls', photo: 'stHomage' },
      { model: 'B-211 Masterpiece 8x8', cm: 211, quote: true, classic: 80, sig: 'Masterpiece 8x8 限量版，八种珍稀木皮与八台一套', tags: ['Masterpiece', '8x8'], official: 'https://eu.steinway.com/en/pianos/limited-edition-pianos/masterpiece-8x8', photo: 'st8x8' },
      { model: 'B-211 Noé', cm: 211, quote: true, classic: 78, sig: 'Noé Duchaufour-Lawrance 设计的限量版，流动线条与自然色', tags: ['Noé', '设计师联名'], official: 'https://eu.steinway.com/en/pianos/limited-edition-pianos/noe', photo: 'stNoe' },
      { model: 'B-211 Sunburst', cm: 211, quote: true, classic: 76, sig: 'Sunburst 限量版，日 burst 渐变漆面与舞台感', tags: ['Sunburst', '限量'], official: 'https://eu.steinway.com/en/pianos/limited-edition-pianos/sunburst', photo: 'stSunburst' }
    ]
  },
  {
    brand: 'bosendorfer', models: [
      { model: 'Secession', cm: 214, quote: true, classic: 93, sig: '分离派金色艺术琴壳，Bösendorfer 建筑系列收藏版', tags: ['Secession', '金色艺术'], official: 'https://www.boesendorfer.com/en/pianos/collectors-item/secession', photo: 'bosSecession' },
      { model: 'Jean Cocteau', cm: 214, quote: true, classic: 87, sig: '让·科克托手绘线条艺术琴壳，收藏级限量版', tags: ['Jean Cocteau', '艺术琴壳'], official: 'https://www.boesendorfer.com/en/pianos/collectors-item/jean-cocteau', photo: 'bosCocteau' },
      { model: 'Oscar Peterson', cm: 214, quote: true, classic: 82, sig: '奥斯卡·彼得森致敬版，爵士主题艺术琴壳', tags: ['Oscar Peterson', '爵士'], official: 'https://www.boesendorfer.com/en/pianos/collectors-item/oscar-peterson', photo: 'bosOscar' },
      { model: 'The Great Wave off Kanagawa', cm: 214, quote: true, classic: 80, sig: '神奈川冲浪里主题艺术琴壳，Bösendorfer 收藏版', tags: ['Great Wave', '艺术琴壳'], official: 'https://www.boesendorfer.com/en/pianos/collectors-item/the-great-wave-off-kanagawa', photo: 'bosWave' },
      { model: 'Tree of Life', cm: 214, quote: true, classic: 78, sig: '生命之树主题艺术琴壳，Klimt 风格的收藏版', tags: ['Tree of Life', 'Klimt'], official: 'https://www.boesendorfer.com/en/pianos/collectors-item/treeoflife', photo: 'bosTree' }
    ]
  }
];

SPECIAL_EXTRA2.forEach((group) => {
  if (!SPECIAL_MODELS[group.brand]) {
    SPECIAL_MODELS[group.brand] = { name: '特别版', note: '定制特别版', madeIn: '—', highlight: '定制外观', tradeoff: '价格需确认', tags: ['特别版'], models: [] };
  }
  group.models.forEach((m) => SPECIAL_MODELS[group.brand].models.push(m));
});

/* 现有贝希斯坦艺术琴壳：用官网高清图替换空缺。 */
const SPECIAL_PHOTO_OVERRIDES = {
  'bechstein|B 212 Sphinx': 'bechSphinx',
  'bechstein|D 282 Sphinx': 'bechSphinx',
  'bechstein|D 282 Louis XV': 'bechLouis',
  'bechstein|B 212 Louis XV': 'bechLouis',
  'bechstein|B 212 Vogelaugenahorn': 'bechMaple',
  'bechstein|D 282 Sterling': 'bechSterling'
};
