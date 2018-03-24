const fs = require( "mz/fs" );
const path = require( "path" );
const walk = require( "fs-walk" );
const { getCurrentData, getLatestChapter } = require( "./mangareader" );

/*
  Utility for /mangareader routes
  Check all ids for newly available chapters, update 'new' files accordingly
  Indended to be frequently run as cron job
*/

async function writeUpdates( data, id, manga, chapter ) {
  const { current, new: newData } = data;
  const file = path.resolve( __dirname, `../data/${id}/new` );

  const curChapter = current
    .filter( x => x.manga == manga )
    .map( x => x.chapter )[0];

  const isNew = !newData.filter( x => x.manga == manga ).length;

  if ( chapter > curChapter && isNew ) {
    await fs.appendFile( file, `${manga};${curChapter}\n` );
  }
}

( async () => {
  const ids = [];
  await walk.dirsSync(
    path.resolve( __dirname, "../data" ),
    ( base, name, stat, next ) => {
      if ( name != "current" && name != "new" ) ids.push( name );
    } );

  for ( const id of ids ) {
    const data = await getCurrentData( id );

    const mangas = data.current.map( x => x.manga );

    for ( const manga of mangas ) {
      const chapter = await getLatestChapter( manga );
      await writeUpdates( data, id, manga, chapter );
    }
  }
} )();

