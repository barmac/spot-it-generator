const DECK_TEMPLATE = require('./template.json');

const CARDS_PER_PAGE = 6;

module.exports = getHtmlTemplate;

/**
 * Get HTML template for provided symbols paths.
 * @param {Array<string>} symbols
 * @returns {string}
 */
function getHtmlTemplate(symbols) {
  const cards = getCards(symbols);
  const pages = getPages(cards);

  return `
<head>
  <link rel="stylesheet" href="./style.css">
</head>
<body>
  ${pages.join('')}
</body>
  `;
}

function getCards(symbols) {
  const cards = DECK_TEMPLATE.map(template => {
    const cardSymbols = getCardSymbols(template, symbols);
    const card = getCard(cardSymbols);

    return card;
  });

  return cards;
}

function getPages(cards) {
  const pages = [];

  for (let i = 0; i < cards.length; i += CARDS_PER_PAGE) {
    const pageCards = cards.slice(i, i + CARDS_PER_PAGE);

    pages.push(getPage(pageCards));
  }

  return pages;
}

function getCardSymbols(cardTemplate, symbols) {
  return cardTemplate.map(value => symbols[value]);
}

function getCard(items) {
  return `
<div class="card">
${items.map(item => `<div class="item"><img src="${item}"></div>`).join('\n')}
</div>
  `;
}

function getPage(cards) {
  return `<div class="cards-container">
  ${cards.join('')}
</div>`;
}
