//
// Usage:
//
//     node getImagesFromGallery.js <gallery-url> <target-folder>
//
// Example:
//
//     node getImagesFromGallery.js https://magic.wizards.com/en/products/guilds-ravnica/cards /users/jakobm/Downloads/grn
//


const async = require("async");
const request = require('request');
const fs = require("fs");
const jsdom = require("jsdom");
const JSDOM = jsdom.JSDOM;




var url = process.argv[2];
var folder = process.argv[3];

// check both the arguments make sense
// check the target folder exists


var downloadFile = (url, filename, callback) => {
  request.get({url: url, encoding: 'binary'}, (err, res) => {
    if (err || res.statusCode !== 200) {
      callback(err || 'bad status code: ' + res.statusCode);
      return;
    }
    console.log("writing " + filename)
    fs.writeFile(filename, res.body, { encoding: 'binary' }, callback);
  })
}



var getPage = (callback) => {

  request({
    url: url
  }, (err, res, body) => {
    if (err) {
      return callback(err);
    }

    const dom = new JSDOM(body);
    var imgTags = dom.window.document.querySelectorAll("p.rtecenter img")
    
    async.forEachSeries(imgTags, (imgTag, callback) => {
      console.log("calling download: " + imgTag.alt)
      downloadFile(imgTag.src, folder + '/' + imgTag.alt.replace('//', '--') + '.png', callback);
    }, callback);


    return;

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



getPage((err) => {
  console.log(err || 'All done');
});
