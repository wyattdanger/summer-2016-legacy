const fs = require('fs');
const https = require('https');

// Cards that are missing from the current banned list but should be there for 2016
const missingCardNames = [
  'Amulet of Quoz',
  'Demonic Attorney',
  'Demonic Tutor',
  'Dig Through Time',
  'Flash',
  'Frantic Search',
  'Gush',
  'Mana Drain',
  'Memory Jar',
  'Mental Misstep',
  'Mystical Tutor',
  'Necropotence',
  'Oath of Druids',
  'Time Vault',
  'Tinker',
  'Tolarian Academy',
  'Treasure Cruise',
  'Wheel of Fortune'
];

function fetchCard(cardName) {
  return new Promise((resolve, reject) => {
    // Get oldest printing by using search with unique=prints and order=released
    const url = `https://api.scryfall.com/cards/search?q=${encodeURIComponent(`!"${cardName}"`)}&unique=prints&order=released&dir=asc`;

    const options = {
      headers: {
        'User-Agent': 'Pre-Brexit-Legacy/1.0',
        'Accept': 'application/json'
      }
    };

    https.get(url, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          const result = JSON.parse(data);
          // Get the first card (oldest printing)
          if (result.data && result.data.length > 0) {
            resolve(result.data[0]);
          } else {
            reject(new Error(`No results for ${cardName}`));
          }
        } else {
          console.error(`Status ${res.statusCode} for ${cardName}: ${data}`);
          reject(new Error(`Failed to fetch ${cardName}: ${res.statusCode}`));
        }
      });
    }).on('error', reject);
  });
}

async function fetchMissingCards() {
  const cards = [];

  for (const cardName of missingCardNames) {
    try {
      console.log(`Fetching ${cardName}...`);
      const card = await fetchCard(cardName);

      cards.push({
        name: card.name,
        image_uri: card.image_uris?.normal || card.card_faces?.[0]?.image_uris?.normal,
        scryfall_uri: card.scryfall_uri,
        set: card.set,
        set_name: card.set_name
      });

      // Rate limit: wait 150ms between requests (max ~6 requests/sec)
      await new Promise(resolve => setTimeout(resolve, 150));
    } catch (error) {
      console.error(`Error fetching ${cardName}:`, error.message);
    }
  }

  return cards;
}

async function main() {
  console.log('Fetching missing banned cards from Scryfall...');
  const newCards = await fetchMissingCards();

  // Read existing banned cards
  const existingPath = './src/data/banned-cards.json';
  const existing = JSON.parse(fs.readFileSync(existingPath, 'utf8'));

  // Combine and sort alphabetically
  const combined = [...existing, ...newCards].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // Write back
  fs.writeFileSync(existingPath, JSON.stringify(combined, null, 2));

  console.log(`\nAdded ${newCards.length} new cards. Total: ${combined.length} banned cards in ${existingPath}`);
}

main().catch(console.error);
