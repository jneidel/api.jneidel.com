const fs = require( "mz/fs" );
const path = require( "path" );
const DotJson = require( "dot-json" );
const fileExists = require( "file-exists" );
const _ = require( "lodash" );
const { getLastChapter } = require( "." );

/* Read/write files in ../../data */

const defaultDataDir = path.resolve( __dirname, "..", "..", "data" );

function checkFilesExist( dataDir = path.resolve( __dirname, "..", "..", "data" ) ) {
  const userPath = path.resolve( dataDir, "users.json" );
  const latestPath = path.resolve( dataDir, "manga.json" );

  if ( !fileExists.sync( userPath ) ) fs.writeFileSync( userPath, `{}` );
  if ( !fileExists.sync( latestPath ) ) fs.writeFileSync( latestPath, `{}` );
}

const openJson = ( name, dataDir = defaultDataDir ) => new DotJson( path.resolve( dataDir, `${name}.json` ) );

function addUser( id ) {
  const users = openJson( "users" );
  users.set( `${id}`, {} ).save();
}

function mangaExists( id, name ) {
  const users = openJson( "users" );
  return !!users.get( `${id}.${name}` );
}

function setMangaChapter( id, name, chapter ) {
  const users = openJson( "users" );
  users.set( `${id}.${name}`, chapter ).save();
}

function addManga( id, name, chapter ) {
  const users = openJson( "users" );
  const hasManga = users.get( `${id}.${name}` );

  const latest = openJson( "latest" );

  if ( !hasManga ) {
    setMangaChapter( id, name, chapter );

    const mangaExists = !!latest.get( name );
    const state = mangaExists ? latest.get( `${name}.users` ) : [];
    state.push( id );
    latest.set( `${name}.users`, state ).save();
  }
  getLastChapter( name, "mangareader" )
    .then( lastChapter => latest.set( `${name}.last`, lastChapter ).save() );
}

function removeManga( id, name ) {
  const users = openJson( "users" );
  const userManga = users.get( id );

  if ( userManga[name] ) {
    delete userManga[name];
    users.set( `${id}`, userManga ).save();

    const latest = openJson( "latest" );
    const mangaUsers = latest.get( `${name}.users` );
    _.remove( mangaUsers, u => u === id );
    latest.set( `${name}.users`, mangaUsers ).save();
  }
}

module.exports = {
  checkFilesExist,
  addUser,
  addManga,
  removeManga,
  setMangaChapter,
  mangaExists,
};
