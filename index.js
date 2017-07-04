const request = require('request');
const _ = require('underscore');
const async = require('async');
const fs = require('fs');
const baseString = "abcdefghijklmnopqrstuvwxyz "; //specify the characters here to build your search string
const outputFileName = "output-" + new Date().getTime() + ".tsv";

var requestObject = {
  url : "", //specifu url here
  mehtod : "POST", //specify method here
  json : true, //important
  body : {

  },
  //encoding : null,
  headers : {

  }
}

function makeSearchCall(searchString, callback){
  requestObject.body.searchTerm = searchString; //repalce the search term
  console.log(searchString);
  request.post(requestObject, function(error, response, body){
    if(error){
      console.error('Something went wrong');
      console.error(error);
    } else {
      var data = "";
      _.each(body, function(record){

        data = data + record.key1 + "\t" +
          record.key2 + "\t" +
          record.key3 + "\t" +
          "\n";
      })
      //console.log(data)
      fs.appendFile("output/"+outputFileName , data, function (err) {
        if (err) {
          return console.error(err);
        }
        callback();
      });
    }
  });
}
var searchLetters = [];
var alphabets = baseString.split("");
_.each(alphabets, function(a){
   searchLetters.push(a);
  _.each(alphabets, function(b){
    searchLetters.push(a+b);
     _.each(alphabets, function(c){
      searchLetters.push(a+b+c);
      //in case you want another level
      // _.each(alphabets, function(d){
      //   searchLetters.push(a+b+c+d);
      // });
    });
  })
})

//use this line in case the earlier job got stuck at some searchLetter
//searchLetters = searchLetters.splice(searchLetters.indexOf("tsw"), (searchLetters.length - searchLetters.indexOf("tsw")));

async.eachSeries(searchLetters, makeSearchCall, function(){console.log('done'); process.exit(0);});
