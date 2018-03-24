const phantom = require( "phantom" );
const express = require( "express" );
const chalk = require( "chalk" );
const port = 62220;

const app = express();

const router = express.Router();

router.post( "/mangareader-latest", async ( req, res, next ) => {
  const url = req.query.url;
  const manga = url.match( /^http:\/\/www\.mangareader\.net\/(.*)/ )[1].replace( /-/g, " " );

  const browser = await phantom.create();
  const page = await browser.createPage();
  const status = await page.open( url );

  const chapter = await page.evaluate( function() {
     return document.getElementById( "latestchapters" ).getElementsByTagName( "a" )[0].innerHTML.match( /(\d+)/ )[0];
  } );
  console.log( chapter );

  await browser.exit();

  res.send( `The latest chapter of ${manga} is ${chalk.red( chapter )}.` );
} );

app.use( "/", router );

app.listen( port, () => {
  console.log( `Server running on port ${port}.` ); // eslint-disable-line no-console
} );


