const path = require( "path" );
const fs = require( "mz/fs" );
const phantom = require( "phantom" );

exports.getCurrentData = async function getCurrentData( id ) {
  const res = {};

  for ( const x of [ "current", "new" ] ) {
    const file = path.resolve( __dirname, `../data/${id}/${x}` );

    const data = await fs.readFile( file, "utf8" )
      .catch( async ( err ) => {
        await fs.writeFile( file, "" );
        return fs.readFile( file, "utf8" );
      } );

    res[x] = data
      .split( "\n" )
      .filter( x => x != "" )
      .map( ( x ) => {
        const [ manga, chapter ] = x.split( ";" );
        return { manga, chapter };
      } );
  }

  return res;
};

exports.getLatestChapter = async function getLatestChapter( manga ) {
  const browser = await phantom.create();

  const page = await browser.createPage();
  const status = await page.open( `http://www.mangareader.net/${manga}` );

  const chapter = await page.evaluate( function parseLastestChapter() {
    return document.getElementById( "latestchapters" ).getElementsByTagName( "a" )[0].innerHTML.match( /(\d+)/ )[0];
  } );

  browser.exit();

  if ( chapter === null ) {
    throw new Error();
  }

  return chapter;
};

