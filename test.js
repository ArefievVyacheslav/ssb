// const searchTerm = 'футболка fila синяя';
// const line1 = 'Футболка FILA FILA clothes белый sportmaster  50M L ';
// const line2 = 'Футболка мужская FILA FILA clothes синий sportmaster  5046 ';
//
// const natural = require('natural');
//
// function tokenizeAndStem(text) {
//   const tokenizer = new natural.WordTokenizer();
//   const stemmer = natural.PorterStemmer;
//   return tokenizer.tokenize(text).map(token => stemmer.stem(token));
// }
//
// function cosineSimilarity(text1, text2) {
//   const vec1 = new natural.TfIdf().addDocument(tokenizeAndStem(text1));
//   const vec2 = new natural.TfIdf().addDocument(tokenizeAndStem(text2));
//   return natural.TfIdf.cosineSimilarity(vec1, vec2);
// }
//
// function matchPercentage(line1, line2 = searchTerm.toLowerCase()) {
//   const similarity = cosineSimilarity(line1.toLowerCase(), line2);
//   return similarity * 100;
// }
//
// console.log(matchPercentage(line1));
// console.log(matchPercentage(line2));


var stringSimilarity = require("string-similarity");

var similarity = stringSimilarity.compareTwoStrings("футболка fila синяя", "Футболка FILA FILA clothes белый sportmaster  50M L ");
var similarity2 = stringSimilarity.compareTwoStrings("футболка fila синяя", "Футболка мужская FILA FILA clothes синий sportmaster  5046 ");

// var matches = stringSimilarity.findBestMatch("healed", [
//   "edward",
//   "sealed",
//   "theatre",
// ]);

console.log(similarity)
console.log(similarity2)
