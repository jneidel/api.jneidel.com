const express = require( "express" );
const fs = require( "mz/fs" );
const path = require( "path" );
const mkdir = require( "make-dir" );
const reader = require( "buffered-reader" );
const DataReader = reader.DataReader;
const { getCurrentData, getLatestChapter } = require( "../utils/mangareader" );

const router = express.Router();

const includeId = ( req, res, next ) => {
  const id = req.query.id;
  if ( !id ) return res.status( 400 ).send( "Please include an 'id' parameter in your request." );

  return next();
};

router.post( "/create-id",
  includeId,
  async ( req, res ) => {
    const id = req.query.id;

    await mkdir( `data/${id}` );

    return res.status( 200 ).send( "Successfully created id" );
  }
);

router.get( "/updates",
  includeId,
  async ( req, res ) => {
    const id = req.query.id;
    const format = req.query.format;
    const clear = req.query.clear;

    const data = await getCurrentData( id );

    if ( clear ) { // Update current/new files
      data.new.forEach( async ( x ) => {
        const manga = x.manga;
        const chapter = x.chapter;

        const curFile = path.resolve( __dirname, `../data/${id}/current` );
        const curFd = await fs.open( curFile, "r+" );

        let start = 0;
        let end = 0;

        const latestChapter = await getLatestChapter( manga );

        new DataReader( curFile, { encoding: "utf8" } )
          .on( "line", async function updateCurrentManga( line, byteOffset ) {
            start = end;
            end = byteOffset;

            if ( line.split( ";" )[0] === manga ) {
              await fs.write( curFd, `${manga};${latestChapter}`, start, end - start );

              this.interrupt();
            }
          } )
          .read();

        const newFile = path.resolve( __dirname, `../data/${id}/new` );
        fs.open( newFile, "w" );
      } );
    }

    if ( format === "json" ) {
      return res.status( 200 ).json( { data: data.new } );
    }

    let response = `❯ The following updates are available:\n`;

    data.new.forEach( ( x ) => {
      response += ` • https://www.mangareader.net/${x.manga}/${x.chapter}/\n`;
    } );

    return res.status( 200 ).send( `${response}\n` );
  }
);

router.post( "/add-manga",
  includeId,
  async ( req, res ) => {
    const id = req.query.id;
    const manga = req.query.manga;

    if ( !manga ) {
      return res.status( 400 ).send( "Please include a manga.\n" );
    }

    let invalidName = false;
    const chapter = await getLatestChapter( manga )
      .catch( err => invalidName = true );

    if ( invalidName ) {
      return res.status( 400 ).send( "Invalid manga name, please refer to the documentation for more info.\n" );
    }

    const file = path.resolve( __dirname, `../data/${id}/current` );

    fs.appendFile( file, `${manga};${chapter}\n` );

    return res.status( 200 ).send( `Successfully added ${manga}\n` );
  }
);

module.exports = router;

