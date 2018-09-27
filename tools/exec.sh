

# Script. Antag att det finns en fil med alla kort (jas)


JOINFILE="data/raw/jas.csv"
OUTFILE="data/raw/grn.csv"

mkdir -p tmp
node tools/downloadReviews/getReview.js > tmp/lsv-ratings.csv # get the reviews as configured in "getReview"
cat tmp/lsv-ratings.csv | csvcut -c title,lowScore,highScore,review > tmp/lsv-min.csv
cat $JOINFILE | csvcut -C lowScore,highScore > tmp/raw.csv
csvjoin --right -c title tmp/lsv-min.csv tmp/raw.csv | csvcut -C 1 > $OUTFILE # output as 





# USEFUL SNIPPETS
# ===============

# Convert from excel
# csvformat -d ";" data/raw/Arbetsbok1.csv > data/raw/arb1.csv
