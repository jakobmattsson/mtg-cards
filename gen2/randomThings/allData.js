const exec = require('child_process').exec;
const fs = require("fs");
const stringify = require('csv-stringify');



var currentCards = fs.readFileSync('./data/AllCards.json', 'utf8')
var file = fs.readFileSync('./data/AllCards.json', 'utf8');
var js = JSON.parse(file);




exec('csvcut -c Card data/ix_nice.csv -x | csvformat -D ";" -U 3 | tail -n +2', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }

  var lines = stdout.split('\n').filter(x => x.length > 0);


  var output = lines.map((line) => {
    var match = js[line];
    if (!match)
      return { card: line };

    return {
      card: line,
      power: match.power || null,
      toughness: match.toughness || null,
      text: (match.text || '').replace(/\n/g, '. ').replace(/\.\. /g, '. ')
    }
  });

  stringify(output, { header: true }, (err, json) => {
    if (err) return console.error(err);
    process.stdout.write(json);
  });
});


