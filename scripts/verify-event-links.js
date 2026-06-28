// Script to verify all MTGTop8 event links are correct
const events = [
  { name: 'GP Prague', eventId: '12671' },
  { name: 'GP Columbus', eventId: '12681' },
  { name: 'SCG Worcester', eventId: '12947' },
  { name: 'Bazaar of Moxen - Strasbourg', eventId: '12908' },
  { name: 'SCG Dallas', eventId: '12863' },
  { name: 'BoM Annecy', eventId: '12303' },
  { name: 'MKM Frankfurt', eventId: '12433' },
  { name: 'SCG Indianapolis', eventId: '12443' }
];

console.log('Check these event pages manually to get correct deck IDs:');
console.log('');
events.forEach(event => {
  console.log(`${event.name}: https://mtgtop8.com/event?e=${event.eventId}&f=LE`);
});
