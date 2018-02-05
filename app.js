const express = require( "express" );
const puppeteer = require( "puppeteer" );
const chalk = require( "chalk" );
const port = 62220;

const app = express();

const router = express.Router();

router.post( "/mangareader-latest", async ( req, res, next ) => {
  const url = req.query.url;
  const manga = url.match( /^http:\/\/www\.mangareader\.net\/(.*)/ )[1].replaceAll( "-", " " );

  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.goto( url );

  const chapter = await page.$eval( "#latestchapters", el => el.getElementsByTagName( "a" )[0].innerHTML.match( /(\d+)/ )[0] ).catch( ( er ) => {} );

  browser.close();

  res.send( `The latest chapter of ${manga} is ${chalk.red( chapter )}.` );
} );

app.use( "/", router );

app.listen( port, () => {
  console.log( `Server running on port ${port}.` ); // eslint-disable-line no-console
} );

