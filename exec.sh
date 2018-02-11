node getReview.js > data/channelfireball.csv
node allData.js > data/ix_all_cards.csv
csvjoin --left -c "Card,title,card" data/ix_nice.csv data/channelfireball.csv data/ix_all_cards.csv | csvcut -C title,card > data/ix_enhanced.csv
