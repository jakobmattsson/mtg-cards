const request = require('request');
const { JSDOM } = require("jsdom");
const async = require("async");
const stringify = require('csv-stringify');
const _ = require("lodash");

const pageConfig = require("./pageConfig");

const fixText = (text) => text.replace(/’/g, "'").replace(/—/g, '-').replace(/“/g, '"').replace(/”/g, '"').trim();
const qsAll = (html, selector) => Array.from(new JSDOM(html).window.document.querySelectorAll(selector));

const check = (card, assertion) => {
  if (!assertion)
    return false;

  var keys = Object.keys(assertion);
  var picked = _.pick(card, keys);
  var checks = [
    picked.title !== assertion.title,
    picked.lowScore !== assertion.lowScore,
    picked.highScore !== assertion.highScore,
    picked.review.slice(0, assertion.review.length) !== assertion.review
  ];
  return checks.every(x => !x);
}

const getList = (metas, callback) => {
  async.map(metas, getData, (err, res) => {
    if (err) return callback(err);
    stringify(_.flatten(res), { header: true }, callback);
  });
};

const getAll = (callback) => {
  getList(pageConfig, callback);
};

const getData = (meta, callback) => {

  const matches = pageConfig.filter(x => x.format == meta.format && x.color == meta.color && x.set == meta.set);
  if (matches.length == 0) {
    return callback("No match for " + meta.format + " " + meta.set + " " + meta.color);
  }
  if (matches.length > 1) {
    return callback("Multiple matches for " + meta.format + " " + meta.set + " " + meta.color);
  }
  const match = matches[0];

  request(match.url, function (error, response, body) {

    // Assume there is exactly one node with the class "postContent"
    const postContent = qsAll(body, ".postContent");
    if (postContent.length != 1)
      return callback(new Error("WRONG LENGTH"));

    // Remove everything in "postContent" up until the title "Ratings Scale"; then return all nodes from that point
    const html = postContent[0].innerHTML;
    const limitedHtml = html.slice(html.indexOf("<h1>Ratings Scale</h1>"))
    var all = qsAll('<div id="root">' + limitedHtml + "</div>", "#root > *")

    // Remove the "Ratings scale" h1 element
    all = all.slice(1);

    // Extract all the card info from this point
    var result = [];
    var current = {};
    all.forEach((node) => {
      if (node.tagName == 'H1' || (node.tagName == 'DIV' && node.childNodes.length > 1 && node.childNodes[1].tagName == 'H1')) {
        if (current && current.review && current.title && current.lowScore !== undefined) {
          current.review = current.review.join(' ');
          current.color = meta.color;
          current.set = meta.set;
          result.push(current);
        }
        current = {};
        current.title = fixText(node.textContent);
      }
      if (node.tagName == 'H3' && node.textContent.indexOf('Limited:') !== -1) {
        var scores = node.textContent.replace('Limited: ', '').split('//').map(s => parseFloat(s.trim()));
        current.lowScore = scores[0];
        current.highScore = scores[1] || null;
      }
      if (node.tagName == 'DIV' && node.className == "crystal-catalog-helper crystal-catalog-helper-grid") {
        var as = Array.prototype.slice.call(node.childNodes, 0).filter((x) => x.tagName == 'A')[0];
        if (as.childNodes.length > 0 && as.childNodes[0].tagName == 'IMG') {
          current.imageUrl = "http:" + as.childNodes[0].src;
        }
      }
      if (node.tagName == 'P') {
        current.review = current.review || [];
        current.review.push(fixText(node.textContent));
      }
    });

    // Run assertions
    const asserted = match.assert;
    if (!asserted) {
      return callback(new Error("Missing assert for " + match.url));
    }
    if (!check(result[0], asserted.firstCard)) {
      return callback(new Error("For the first card for " + match.url + " expected\n\n" + JSON.stringify(asserted.firstCard)+"\n\nbut got\n\n" + JSON.stringify(result[0]) + "\n"));
    }
    if (!check(result.slice(-1)[0], asserted.lastCard)) {
      return callback(new Error("For the last card for " + match.url + " expected\n\n" + JSON.stringify(asserted.lastCard)+"\n\nbut got\n\n" + JSON.stringify(result.slice(-1)[0]) + "\n"));
    }
    if (asserted.specificCards) {
      for (var i=0; i<asserted.specificCards.length; i++ ) {
        var title = asserted.specificCards[i].title;
        var foundCard = result.filter(x => x.title == title)[0];
        var assertion = asserted.specificCards[i];
        if (!check(foundCard, assertion)) {
          return callback(new Error("For the card " + title + " in " + match.url + " expected\n\n" + JSON.stringify(assertion)+"\n\nbut got\n\n" + JSON.stringify(foundCard) + "\n"));
        }
      }
    }

    // Return the full result
    callback(null, result);
  });
}







// // During the debugging it might be useful to use this instead of the main routine below
//
// var toGet = [
//   { format: 'limited', set: 'rivals-of-ixalan', color: 'blue' },
//   //{ format: 'limited', set: 'ixalan', color: 'gold' },
// ]
// getList(toGet, (err, result) => {
//   if (err) return console.error(err);
//   console.log(result);
// })



// This the main routine
getAll((err, result) => {
  if (err) return console.error(err);
  process.stdout.write(result);
})
