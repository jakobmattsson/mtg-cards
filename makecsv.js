const mtg = require('mtgsdk');

console.log("Number,Name,Rarity");
mtg.card.all({ set: 'DOM', pageSize: 100 }).on('data', card => {
  var name = card.name.replace(/"/g, '\\"');
  console.log(card.number + ',"' + name + '",' + card.rarity);
});



// all.csv is an export from decked builder
// node makecsv.js > dom-cards.csv
// cat ~/Desktop/all.csv | csvgrep -c Set -m Dominaria | csvcut -c "Total Qty,Card" > dom-mine.csv
// csvjoin --left -c Name,Card dom-cards.csv dom-mine.csv | csvcut -C Card | csvsort -c Number | uniq | csvlook


