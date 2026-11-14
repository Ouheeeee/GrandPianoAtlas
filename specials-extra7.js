/* 新增 Crown Jewel B-211 木皮、Mason Artist Series，并补 Bösendorfer / Schimmel 官图。 */
const SPECIAL_EXTRA7 = [
  {
    brand: 'steinway', models: [
      { model: 'B-211 African Pommele', cm: 211, quote: true, classic: 89, sig: 'Crown Jewel 非洲桃花心木，B-211 的收藏级木皮版本。', tags: ['Crown Jewel', 'African Pommele'], official: 'https://www.steinway.com/pianos/steinway/grand/model-b', photo: 'stAfricanB211' },
      { model: 'B-211 Koa', cm: 211, quote: true, classic: 88.5, sig: 'Crown Jewel 夏威夷 Koa 木皮，纹理温暖、色泽金黄。', tags: ['Crown Jewel', 'Koa'], official: 'https://www.steinway.com/pianos/steinway/grand/model-b', photo: 'stKoaB211' },
      { model: 'B-211 Indian Apple', cm: 211, quote: true, classic: 88, sig: 'Crown Jewel 印度苹果木，细密纹理与红棕色调。', tags: ['Crown Jewel', 'Indian Apple'], official: 'https://www.steinway.com/pianos/steinway/grand/model-b', photo: 'stIndianAppleB211' },
      { model: 'B-211 Macassar', cm: 211, quote: true, classic: 87.5, sig: 'Crown Jewel 望加锡黑檀，深色条纹与金属光泽。', tags: ['Crown Jewel', 'Macassar'], official: 'https://www.steinway.com/pianos/steinway/grand/model-b', photo: 'stMacassarB211' },
      { model: 'B-211 Padauk', cm: 211, quote: true, classic: 87, sig: 'Crown Jewel 紫檀木，红橙色与清晰年轮。', tags: ['Crown Jewel', 'Padauk'], official: 'https://www.steinway.com/pianos/steinway/grand/model-b', photo: 'stPadaukB211' },
      { model: 'B-211 Santos Rosewood', cm: 211, quote: true, classic: 86.5, sig: 'Crown Jewel 桑托斯玫瑰木，暖棕底色与深色条纹。', tags: ['Crown Jewel', 'Santos Rosewood'], official: 'https://www.steinway.com/pianos/steinway/grand/model-b', photo: 'stSantosB211' },
      { model: 'B-211 Mahogany Tiger', cm: 211, quote: true, classic: 86, sig: 'Crown Jewel 虎纹桃花心木，条纹对比强烈。', tags: ['Crown Jewel', 'Mahogany Tiger'], official: 'https://www.steinway.com/pianos/steinway/grand/model-b', photo: 'stMahoganyTigerB211' },
      { model: 'B-211 Walnut', cm: 211, quote: true, classic: 85.5, sig: 'Crown Jewel 胡桃木，温润棕调与开放纹理。', tags: ['Crown Jewel', 'Walnut'], official: 'https://www.steinway.com/pianos/steinway/grand/model-b', photo: 'stWalnutB211' },
      { model: 'B-211 Ziricote', cm: 211, quote: true, classic: 85, sig: 'Crown Jewel 十二雄蕊破布木，深色云状纹理。', tags: ['Crown Jewel', 'Ziricote'], official: 'https://www.steinway.com/pianos/steinway/grand/model-b', photo: 'stZiricoteB211' }
    ]
  },
  {
    brand: 'henrymason', models: [
      { model: 'MHA-188G', cm: 188, quote: true, classic: 84, sig: 'Mason & Hamlin Artist Series 188cm，美国 Haverhill 制造；面向演奏者的现代系列。', tags: ['Artist Series', '美国制造'], official: 'https://masonhamlin.com/artist-series/', photo: 'masonMHA188' }
    ]
  }
];

SPECIAL_EXTRA7.forEach((group) => {
  if (!SPECIAL_MODELS[group.brand]) {
    SPECIAL_MODELS[group.brand] = { name: '特别版', note: '定制特别版', madeIn: '—', highlight: '定制外观', tradeoff: '价格需确认', tags: ['特别版'], models: [] };
  }
  group.models.forEach((m) => SPECIAL_MODELS[group.brand].models.push(m));
});

Object.assign(SPECIAL_PHOTO_OVERRIDES, {
  'bosendorfer|290 Vienna': 'bosVienna',
  'bosendorfer|290 Imperial Artisan': 'bosArtisan',
  'schimmel|K 213 Glas': 'sch213Glas',
  'schimmel|K 208 Pegasus': 'sch208Pegasus'
});
