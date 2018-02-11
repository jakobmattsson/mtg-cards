node getReview.js > data/channelfireball.csv
csvjoin --left -c "Card,title" data/ix_nice.csv data/channelfireball.csv | csvcut -C title > data/ix_enhanced.csv
