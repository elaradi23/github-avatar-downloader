var fs = require('fs');
var request = require('request');
var secrets = require('./secrets');
var dotenv = require('dotenv').config()

console.log('Welcome to the GitHub Avatar Downloader!');

//Take argv as inputs for repoOwner and repoName
var repoOwner = process.argv[2];
var repoName = process.argv[3];

function getRepoContributors(repoOwner, repoName, cb){
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': process.env.GITHUB_TOKEN
    }
  };

  //The body is pulled, parsed as a JSON object and then passed to the callback function
  request(options, function(err, res, body){
    var bodyJSON = JSON.parse(body);
    cb(err, bodyJSON);
  });
}

//Check if both repoOwner and repoName are given, else do not run getRepoContributors
if(!repoOwner || !repoName){
  console.log('Error: No input for repo-owner or repo-name!');
} else {
  getRepoContributors(repoOwner, repoName, function(err, result) {
    console.log("Errors:", err);
    for(var item in result){
      //The file path will use the 'login' field as a name for the image file
      downloadImageByURL(result[item].avatar_url, result[item].login);
    }
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)
  .on('error', function(err){
    throw(err);
  })
  .pipe(fs.createWriteStream('./avatars/' + filePath + '.jpg'));
}



