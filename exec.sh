
# Download the new CSV and merge it with the current one (could it be made so it doesn't add duplicates?)
node getReview.js > data/channelfireball-new.csv
csvstack data/channelfireball.csv data/channelfireball-new.csv | grep -Ev "^$" > data/channelfireball-all-temp.csv
mv data/channelfireball-all-temp.csv data/channelfireball.csv
rm data/channelfireball-new.csv


# join with the rarities
# csvtojson data/channelfireball.csv > data/channelfireball-new.json



# Cant remember what these were used for
# node allData.js > data/ix_all_cards.csv
# csvjoin --left -c "Card,title,card" data/ix_nice.csv data/channelfireball.csv data/ix_all_cards.csv | csvcut -C title,card > data/ix_enhanced.csv
