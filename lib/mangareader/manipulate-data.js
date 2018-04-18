const fs = require( "mz/fs" );
const path = require( "path" );
const DotJson = require( "dot-json" );
const fileExists = require( "file-exists" );
const _ = require( "lodash" );
const { getLastChapter } = require( "mangareader-dl/lib" );
const supportedProviders = require( "mangareader-dl/lib/providers.json" );

/* Read/write files in ../../data */

/** Json structure:
 * users.user.manga.provider - after provider update one can easily spot the old one
 * latest.provider.manga     - one can list/update the manga per provider
 */

const defaultDataDir = path.resolve( __dirname, "..", "..", "data" );
const baseContents = {
  users : "{}",
  latest: `{ ${supportedProviders.reduce( ( acc, cur ) => acc ? `${acc}, "${cur}": {}` : `"${cur}": {}`, "" )} }`,
};

const openJson = ( name, dataDir = defaultDataDir ) => new DotJson( path.resolve( dataDir, `${name}.json` ) );

// Check if x exists
function userExists( id ) {
  const users = openJson( "users" );
  return !!users.get( `${id}` );
}
function mangaExists( id, name ) {
  const users = openJson( "users" );
  return !!users.get( `${id}.${name}` );
}
function providerExists( id, name, provider ) {
  const users = openJson( "users" );
  return !!users.get( `${id}.${name}.${provider}` );
}
function checkFilesExist( dataDir = path.resolve( __dirname, "..", "..", "data" ) ) {
  const usersPath = path.resolve( dataDir, "users.json" );
  const latestPath = path.resolve( dataDir, "latest.json" );

  if ( !fileExists.sync( usersPath ) ) fs.writeFileSync( usersPath, baseContents.users );
  if ( !fileExists.sync( latestPath ) ) fs.writeFileSync( latestPath, baseContents.latest );
}

// Get/set chapters
function getUserChapter( id, name, provider ) {
  const users = openJson( "users" );
  return users.get( `${id}.${name}.${provider}` );
}
function setUserChapter( id, name, provider, chapter ) {
  const users = openJson( "users" );
  users.set( `${id}.${name}.${provider}`, chapter ).save();
}
function setLastChapter( name, provider, chapter ) {
  const latest = openJson( "latest" );
  latest.set( `${provider}.${name}.last`, chapter ).save();
}

async function updateLastChapter( name, provider ) {
  const lastChapter = await getLastChapter( name, provider ).catch( err => console.log( err ) );

  setLastChapter( name, provider, lastChapter );
}

function addUser( id ) {
  const users = openJson( "users" );
  users.set( `${id}`, {} ).save();
}

function addManga( id, name, provider, chapter ) {
  const users = openJson( "users" );
  const hasManga = users.get( `${id}.${name}.${provider}` );

  if ( !hasManga ) {
    setUserChapter( id, name, provider, chapter );

    const latest = openJson( "latest" );
    const mangaExists = !!latest.get( `${provider}.${name}` );
    const state = mangaExists ? latest.get( `${provider}.${name}.users` ) : [];
    state.push( id );
    latest.set( `${provider}.${name}.users`, state ).save();
  }

  // updateLastChapter( name, provider ); doesnt work, getLastChapter just doesnt return
}

function removeManga( id, name, provider ) {
  const users = openJson( "users" );
  const userManga = users.get( id );

  if ( userManga[name] ) {
    delete userManga[name];
    users.set( `${id}`, userManga ).save();

    const latest = openJson( "latest" );
    const mangaUsers = latest.get( `${provider}.${name}.users` );
    _.remove( mangaUsers, u => u === id );

    if ( mangaUsers.length === 0 ) {
      const mangaProvider = latest.get( `${provider}` );
      delete mangaProvider[name];
      latest.set( `${provider}`, mangaProvider ).save();
    } else {
      latest.set( `${provider}.${name}.users`, mangaUsers ).save();
    }
  }
}

module.exports = {
  openJson,
  checkFilesExist,
  addUser,
  addManga,
  removeManga,
  setUserChapter,
  userExists,
  mangaExists,
  providerExists,
  updateLastChapter,
};
