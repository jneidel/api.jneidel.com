const express = require( "express" );
const fs = require( "mz/fs" );
const path = require( "path" );
const mkdir = require( "make-dir" );
const reader = require( "buffered-reader" );
const DataReader = reader.DataReader;
const uuid = require( "uuid/v4" );
const { getCurrentData, getLatestChapter } = require( "../lib/mangareader" );
const data = require( "../lib/mangareader/manipulate-data" );
const utils = require( "./utils" );

const mr = require( "mangareader-dl/lib" );

const router = express.Router();

router.post( "/create-id",
  ( req, res ) => {
    const id = uuid();
    data.addUser( id );

    return res.json( {
      meta: { id, err: null },
    } );
  }
);

router.post( "/add-manga",
  utils.hasId,
  utils.hasManga,
  utils.hasChapter,
  ( req, res ) => {
    const id = req.body.id;
    const manga = req.body.manga;
    const chapter = req.body.chapter;

    data.addManga( id, manga, chapter );

    return res.json( {
      meta: { id, err: null },
    } );
  }
);

router.post( "/remove-manga",
  utils.hasId,
  utils.hasManga,
  ( req, res ) => {
    const id = req.body.id;
    const manga = req.body.manga;

    data.removeManga( id, manga );

    return res.json( {
      meta: { id, err: null },
    } );
  }
);

router.post( "/update-manga",
  utils.hasId,
  utils.hasManga,
  utils.hasChapter,
  ( req, res ) => {
    const id = req.body.id;
    const manga = req.body.manga;
    const chapter = req.body.chapter;

    if ( !data.mangaExists( id, manga ) ) return res.json( { meta: { id, err: "Manga hasnt been added yet. Please use /add-manga, before /update-manga" } } );

    data.setMangaChapter( id, manga, chapter );

    return res.json( {
      meta: { id, err: null },
    } );
  }
);

module.exports = router;

