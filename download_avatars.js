var fs = require('fs');
var request = require('request');
var secrets = require('./secrets')

console.log('Welcome to the GitHub Avatar Downloader!');

var repoOwner = process.argv[2];
var repoName = process.argv[3];

function getRepoContributors(repoOwner, repoName, cb){
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': secrets.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body){
    var bodyJSON = JSON.parse(body);
    cb(err, bodyJSON);
  });
}

if(!repoOwner || !repoName){
  console.log('Error: No input for repo-owner or repo-name!');
} else {
  getRepoContributors(repoOwner, repoName, function(err, result) {
    console.log("Errors:", err);
    for(var item in result){
      downloadImageByURL(result[item].avatar_url, result[item].login)
    }

  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)
  .on('error', function(err){
    throw(err);
  })
  .pipe(fs.createWriteStream('./avatars/' + filePath + '.jpg'))
}


