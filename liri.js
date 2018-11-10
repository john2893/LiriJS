
var Spotify = require('node-spotify-api');
var inquirer = require("inquirer");
var keys = require("./keys.js");
var request = require('request');
var Table = require('cli-table2');
const CFonts = require('cfonts');
var moment = require('moment');
// const CFonts = require('cfonts');
var fs = require("fs");




var input = process.argv[2];

switch (input){
  case "concert-this":
    
    bandsInTown();
    break;
  case ("spotify-this-song"):
    
    spotifyThis()
    break;
  case "movie-this":
    
    omdbThis()
    break;
  case "do-what-it-says":
    
    doWhatItSays();
    break;
  default:
    console.log("\r\n")
    options();
    break;
}

function spotifyThis(){
  bigFont("Spotify");
  console.log("\r\n");
  inquirer
  .prompt([
      {
          type: "input",
          message:"What is the name of the song you want to search?",
          name:"songname"
      },
      {
          type:"confirm",
          message:"Are you sure?",
          name:"confirm",
          default:true
      }        
  ])
  .then(function(inquirerResp){
    if(inquirerResp.confirm){
      
      var colors = require('colors');
      var Table = require('cli-table2');
      var table = new Table({
      colWidths:[15,100],
      wordWrap:true
     
      });
      var spotify = new Spotify(keys.spotify);
      spotify
        .search({ type: 'track', query: inquirerResp.songname, market:'US'})
        .then(function(response) {
          
          var newData = ((response));
     
          table.push(
            {'Album': newData.tracks.items[1].album.name },
            { 'Released Date': newData.tracks.items[1].album.release_date },
            { 'Artist': newData.tracks.items[1].artists[0].name },
            { 'Preview URL': newData.tracks.items[1].preview_url}
          );
          console.log("\r\n");
          console.log(table.toString());
          var t = ["__________________________________________"];
          t.push(newData.tracks.items[1].album.name);
          t.push(newData.tracks.items[1].album.release_date);
          t.push(newData.tracks.items[1].artists[0].name);
          t.push(newData.tracks.items[1].preview_url);
          
          var titles = ["","Album: ", "Released Date: ", "Artist: ", "Preview URL: "];
          var fs = require("fs");
          for (var i=0; i<t.length; i++){
            fs.appendFile('spotifyThis.txt', titles[i] + t[i]+'\r\n', 'utf-8', (err) => {  
            if (err) throw err;
            
            });
          };
          
        })
        .catch(function(err) {
          console.log(err);
        });
        
        
        
   

    }else{
        console.log(" Thats okay Please come back when you are more sure");
    };
  });
};

function omdbThis(){
  bigFont("Movie");
  console.log("\r\n");
  var fs    = require("fs");
  var request = require('request');
  
  inquirer
.prompt([
  {
    type:"input",
    message:"What is the movie name you want to search?",
    name:"question",
    
  }
]).then(function(inquirerResp){
  if(inquirerResp.question === ''){
    omdb("Mr Nobody");
  }else {
    omdb(inquirerResp.question);
  }

  
});

// instantiate
function omdb(name){
    var url = 'http://www.omdbapi.com/?i=tt3896198&apikey=56df19d0&t='+name+"";
    let search ={
      title:{},
      released:{},
      rating:{},
      actors:{},
      awards:{}
    };
    request(url, function(err,resp,body){
      if (err) throw (err);     
      try {
        search.title =  JSON.parse(body).Title;
        search.released = JSON.parse(body).Year;
        search.rating = JSON.parse(body).Ratings[0].Value;
        search.rottenTomato = JSON.parse(body).Ratings[1].Value;
        search.country = JSON.parse(body).Country;
        search.language = JSON.parse(body).Language;
        search.actors =  JSON.parse(body).Actors;
        search.awards = JSON.parse(body).Awards;
        search.plot = JSON.parse(body).Plot;
      } catch (e) {
        
        if((e instanceof TypeError) || (e.name === true)){
          console.log(" Looks like there is an issue.\n ->Parts/Full Data of the requested movie is not available!. \n ->Please try another movie or correct any typos or enjoy the available data");
          
        } ; // true check
       
      }

      var Table = require('cli-table2');
      var table = new Table({
      colWidths:[15,55],
      wordWrap:true
      });

      table.push(
          { 'Title': search.title },
          { 'Released Year': search.released },
          { 'IMDB Rating': search.rating },
          { 'Rotten Tomato Rating': search.rottenTomato},
          {'Country': search.country},
          {'Language': search.language},
          { 'Actors': search.actors },
          { 'Awards': search.awards },
          { 'Plot': search.plot }
      );
      console.log("\r\n");
      console.log(table.toString());
        var t = ["__________________________________________"];
        t.push(search.title);
        t.push(search.released);
        t.push(search.rating);
        t.push(search.actors);
        t.push(search.awards);
        t.push(search.plot);
        var titles = ["","Title: ", "Released Year: ", "Rating: ", "Actors: ", "Awards: ", "Plot: "];

        for (var i=0; i<t.length; i++){
          fs.appendFile('Movie.txt', titles[i] + t[i]+'\r\n', 'utf-8', (err) => {  
          if (err) throw err;
          
        });
        }
        
    });// request
  };
};

function bandsInTown(){
  var fs    = require("fs");
  bigFont("Bands In Town");
  console.log("\r\n");
  inquirer
  .prompt([
      {
          type: "input",
          message:"What is the name of the Band/Artist you want to search?",
          name:"artistName"
      }     
  ])
  .then(function(inquirerResp){
    var url = 'https://rest.bandsintown.com/artists/'+inquirerResp.artistName + '/events?app_id=codingbootcamp';
    
  request(url, function(err,resp,body){
    if (!err && resp.statusCode === 200) {
      var parsedData = JSON.parse(body)
      var table = new Table({
        head: ['Venu', 'Location', 'Date']
      , colWidths: [25, 40],
        wordWrap:true
      });
  
      for(var i=0; i<parsedData.length; i++){

          var dateW = moment(parsedData[i].datetime).format("MMMM Do YYYY hh:mm");
          table.push(
              [`${parsedData[i].venue.name}`, `${parsedData[i].venue.city},${parsedData[i].venue.country}`, `${dateW}`]
          
          );
      }
    console.log(table.toString());
      for(var i=0; i<table.length; i++){
          fs.appendFile("bandsInTown.txt",table[i]+"\r\n",(err)=>{
              if (err) throw err;
              
          });
      };
    }
  });
  });
  
};
function doWhatItSays(){
  var shell = require('shelljs');
  fs.readFile("random.txt", "utf8", (err,data)=>{
    if (err){
        console.log(err);
    }
    else{
        var t = [];
       
        var d = data.split(":");
        
        t.push(d);
        var x = (t[0][0]);
        var w = (t[0][1]);
        var util  = require('util'),
        process = require('child_process'),
        ls = process.exec(`node liri.js ${x}\n `);

        ls.stdout.on('data', function (data) {
          console.log(data.toString());
          ls.stdin.write(`${w}`);
        });

      
    
    }
  });

  

};

function bigFont(name){
  const CFonts = require('cfonts');
  CFonts.say(`LiriJS App! |${name}`, {
    font: 'block',              // define the font face
    align: 'center',              // define text alignment
    colors: ['system'],         // define all colors
    background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
    letterSpacing: 0.99,           // define letter spacing
    lineHeight: 0.4,              // define the line height
    space: true,                // define if the output text should have empty lines on top and on the bottom
    maxLength: '0',             // define how many character can be on one line
  });
}
function options(){
  const CFonts = require('cfonts');
  CFonts.say(`   Sorry! You're options are |
  " "concert-this
  " "spotify-this-song
  " "movie-this
  do-what-it-says

     `, {
    font: 'console',              // define the font face
    align: 'center',              // define text alignment
    colors: ['yellow'],         // define all colors
    background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
    letterSpacing: 1,           // define letter spacing
    lineHeight: 2,              // define the line height
    space: true,                // define if the output text should have empty lines on top and on the bottom
    maxLength: '0',             // define how many character can be on one line
  });
}