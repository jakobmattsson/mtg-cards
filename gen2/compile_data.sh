csvtojson data/raw/dom.csv > data/compiled/sets/dom.json
csvtojson data/raw/grn.csv > data/compiled/sets/grn.json
csvtojson data/raw/m19.csv > data/compiled/sets/m19.json
csvtojson data/raw/rix.csv > data/compiled/sets/rix.json
csvtojson data/raw/xln.csv > data/compiled/sets/xln.json

ls data/compiled/sets | xargs node -e "_ = require('lodash');console.log(JSON.stringify(_.flatten(process.argv.slice(1).map((x) => require('./data/compiled/sets/' + x)))))" > data/compiled/all.json
