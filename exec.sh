
# Download the new CSV and merge it with the current one (could it be made so it doesn't add duplicates?)
# Updates both .json and .csv
node getReview.js > data/channelfireball-new.csv
csvstack data/channelfireball.csv data/channelfireball-new.csv | grep -Ev "^$" > data/channelfireball-all-temp.csv
mv data/channelfireball-all-temp.csv data/channelfireball.csv
rm data/channelfireball-new.csv
csvtojson data/channelfireball.csv > data/channelfireball.json





# Produce the rated file
csvjoin --left -c title data/channelfireball.csv data/rarities.csv | csvcut -c title,imageUrl,lowScore,highScore,review,color,set,rarity,type > data/channelfireball_rarity.csv
csvtojson data/channelfireball_rarity.csv > data/channelfireball_rarity.json

