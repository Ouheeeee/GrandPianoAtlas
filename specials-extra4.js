/* Schimmel Art Collection / NWS Edition 扩展。 */
const SPECIAL_EXTRA4 = [
  {
    brand: 'schimmel', models: [
      { model: 'C 169 Black Pearl', cm: 169, quote: true, classic: 74, sig: '黑珍珠漆面与 Art Collection 细节，C 169 的收藏级版本', tags: ['Black Pearl', 'Art Collection'], official: 'https://www.schimmel-pianos.de/en/art-collection/c-169-black-pearl/', photo: 'schC169' },
      { model: 'K 219 NWS Edition', cm: 219, quote: true, classic: 71, sig: 'Nikolaus Wilhelm Schimmel 签名版，乌木漆面与绗缝枫木细节', tags: ['NWS Edition', '签名版'], official: 'https://www.schimmel-pianos.de/en/meisterstuecke/nws-edition/', photo: 'schNWS' }
    ]
  }
];

SPECIAL_EXTRA4.forEach((group) => {
  if (!SPECIAL_MODELS[group.brand]) {
    SPECIAL_MODELS[group.brand] = { name: '特别版', note: '定制特别版', madeIn: '—', highlight: '定制外观', tradeoff: '价格需确认', tags: ['特别版'], models: [] };
  }
  group.models.forEach((m) => SPECIAL_MODELS[group.brand].models.push(m));
});

Object.assign(SPECIAL_PHOTO_OVERRIDES, {
  'schimmel|K 213 Glas': 'schGlas',
  'schimmel|K 208 Pegasus': 'schPegasus',
  'bosendorfer|290 Chopin': 'bosChopin',
  'bosendorfer|290 Johann Strauss': 'bosStrauss',
  'bosendorfer|290 Liszt': 'bosLiszt',
  'essex|EGP-173 French Provincial': 'essexFrench'
});
