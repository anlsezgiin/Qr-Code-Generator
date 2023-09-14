import express from "express";
import bodyParser from 'body-parser';
import inquirer from 'inquirer';
import qr from 'qr-image';
import fs from 'fs';


const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => 
{
    res.render("index.ejs");
});

app.post('/', (req, res) =>
{
    const url = req.body.url;
    if(url == null || url == undefined || url == "")
    {
        res.send("You must enter a URL! Go back you fool!");
        return;
    }
    var qr_png = qr.image(url);
    qr_png.pipe(fs.createWriteStream('qr_img.png'));

    fs.writeFile('URL.txt', url, (err) => {
        if (err) throw err;
    });
    let pngData = fs.readFileSync('qr_img.png');
    res.render("qr.ejs", 
    {
      imageData: pngData
    });  
});
/*inquirer // İf you want to use inquirer, you can use this code. But I recommend you to use ejs for user interface.
  .prompt([
    {
        message: 'Type in your URL: ',
        name: 'URL'
    }
    
  ])
  .then((answers) => {
    const url = answers.URL;
    var qr_png = qr.image(url);
    qr_png.pipe(fs.createWriteStream('qr_img.png'));

    fs.writeFile('URL.txt', url, (err) => {
        if (err) throw err;
    });
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  }); */

  app.listen(port, () =>
  {
    console.log(`Listening on port ${port}`);
  })