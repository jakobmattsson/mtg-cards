csvtojson data/raw/uma.csv > data/compiled/sets/uma.json
csvtojson data/raw/dom.csv > data/compiled/sets/dom.json
csvtojson data/raw/grn.csv > data/compiled/sets/grn.json
csvtojson data/raw/m19.csv > data/compiled/sets/m19.json
csvtojson data/raw/rix.csv > data/compiled/sets/rix.json
csvtojson data/raw/xln.csv > data/compiled/sets/xln.json
csvtojson data/raw/rna-jas.csv > data/compiled/sets/rna-jas.json


# alternative grn ratings: grn-jas
csvcut -C lowScore,highScore,review data/raw/grn.csv | sed s/,grn,/,grn-jas,/ > tmp/tmpjoinfile.csv
csvjoin -c title tmp/tmpjoinfile.csv data/raw/grn-jas.csv | csvtojson > data/compiled/sets/grn-jas.json

# alternative grn ratings: grn-drn
csvcut -C lowScore,highScore,review data/raw/grn.csv | sed s/,grn,/,grn-drn,/ > tmp/tmpjoinfile.csv
csvjoin -c title tmp/tmpjoinfile.csv data/raw/grn-drn.csv | csvtojson > data/compiled/sets/grn-drn.json

# alternative grn ratings: rna
csvcut -C lowScore,highScore,review data/raw/rna-jas.csv | sed s/,rna-jas,/,rna,/ > tmp/tmpjoinfile.csv
csvcut -C color,set,imageUrl data/raw/rna.csv > tmp/rna2.csv
csvjoin -c title tmp/tmpjoinfile.csv tmp/rna2.csv | csvtojson > data/compiled/sets/rna.json

ls data/compiled/sets | xargs node -e "_ = require('lodash');console.log(JSON.stringify(_.flatten(process.argv.slice(1).map((x) => require('./data/compiled/sets/' + x)))))" > data/compiled/all.json

echo 'var allthedata = ' > web/hardcoded.js
cat data/compiled/all.json >> web/hardcoded.js



# Use this to convert a csv export from Mac Excel to proper csv
#
# csvformat sheet.csv -D , -d ";"
#
