const path = require( "path" );
const DotJson = require( "dot-json" );
const { getLastChapter } = require( "mangareader-dl/lib" );

/**
 * Update all manga in latest.json
 * Indended to be frequently run as cron job
 */

const openLatest = () => new DotJson( path.resolve( path.resolve( __dirname, "..", "..", "data" ), `latest.json` ) );

async function updateLastChapter( name, provider ) {
  const lastChapter = await getLastChapter( name, provider ).catch( err => console.log( err ) );

  const latest = openLatest();
  latest.set( `${provider}.${name}.last`, lastChapter ).save();
}

async function updateLatestManga() {
  const latest = openLatest();

  const mangareader = Object.keys( latest.get( "mangareader" ) );
  const readmng = Object.keys( latest.get( "readmng" ) );
  const goodmanga = Object.keys( latest.get( "goodmanga" ) );

  await mangareader.forEach( manga => updateLastChapter( manga, "mangareader" ) );
  await readmng.forEach( manga => updateLastChapter( manga, "readmng" ) );
  await goodmanga.forEach( manga => updateLastChapter( manga, "goodmanga" ) );

  console.log( "Finished updating" );
}

module.exports = updateLatestManga;
