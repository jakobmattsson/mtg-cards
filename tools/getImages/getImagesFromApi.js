//
// Usage:
//
//     node getImagesFromApi.js <set-name> <target-folder>
//
// Example:
//
//     node getImagesFromApi.js DOM /users/jakobm/Downloads/dom/img4
//


const async = require("async");
const request = require('request');
const fs = require("fs");




// check both the arguments make sense
// check the target folder exists




var getPage = (set, page, callback) => {

  request({
    url: 'https://api.magicthegathering.io/v1/cards?set=' + set + '&page=' + page,
    json: true
  }, (err, res, body) => {
    if (err) {
      return callback(err);
    }

    var allCards = body.cards;
    async.forEach(allCards, (card, callback) => {

      var dest = targetFolder + '/' + card.number + " " + card.name + ".jpeg";
      console.log(card.imageUrl, card.name);

      request({
        url: card.imageUrl,
        encoding: null
      }, (err, res, body) => {
        if (err) {
          return callback(err);
        }
        fs.writeFile(dest, body, 'binary', (err) => {
          if (err) {
            return callback(err)
          }
        });
      });
    }, (err) => {
      if (err) {
        return callback(err);
      } else {
        callback(null, allCards.length);
      }
    })
  });
};



var i = 1;
var getNext = (callback) => {

  getPage('DOM', i, (err, count) => {
    if (err) {
      return callback(err);
    }
    console.log("count", count)
    if (count < 100) {
      return callback();
    }
    i++;
    getNext(callback);
  })
}

getNext((err) => {
  console.log(err || 'All done');
});
