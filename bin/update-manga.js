#!/usr/bin/env node

const { updateLastChapter, openJson } = require( "../lib/mangareader/manipulate-data" );

/**
 * Update all manga in latest.json
 * Indended to be frequently run as cron job
 */

async function updateLatestManga() {
  const latest = openJson( "latest" );

  const mangareader = Object.keys( latest.get( "mangareader" ) );
  const readmng = Object.keys( latest.get( "readmng" ) );
  const goodmanga = Object.keys( latest.get( "goodmanga" ) );

  await mangareader.forEach( manga => updateLastChapter( manga, "mangareader" ) );
  await readmng.forEach( manga => updateLastChapter( manga, "readmng" ) );
  await goodmanga.forEach( manga => updateLastChapter( manga, "goodmanga" ) );

  console.log( "Finished updating" );
}

updateLatestManga();

module.exports = updateLatestManga;
