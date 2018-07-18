const ids = require( "../../data/errors/ids.json" );
const types = require( "../../data/errors/types.json" );
const platforms = require( "../../data/errors/platforms.json" );

const formatStr = ( name, val, incorrect = null, invalid = null ) => `${incorrect ? "Incorrect" : ""}${incorrect && invalid ? "/" : ""}${invalid ? "Invalid" : ""} ${name}: ${val}\n`;

function ErrorModel() {
  return {
    id : "Missing id",
    app: {
      name   : "Missing app.name",
      version: "Missing app.version",
    },
    os: {
      type    : "Missing os.type",
      platform: "Missing os.platform",
    },
    error: {
      msg  : "Missing error.msg",
      stack: "Missing error.stack",
    },
    format: "",
  };
}

function maybeSetId( id, error ) {
  const idObject = ids.reduce( ( acc, cur ) => { if ( id === cur.id ) return cur; else return acc; }, null );
  const idIsValid = !!idObject;
  const idIsCorrectFormat = typeof id === "string";

  if ( idIsValid && idIsCorrectFormat )
    error.id = id;
  else
    error.format += formatStr( "id", id, true, true );
}

function maybeSetApp( app, error ) {
  function maybeSetName( name, error ) {
    const idObject = ids.reduce( ( acc, cur ) => { if ( name === cur.name ) return cur; else return acc; }, null );
    const nameIsValid = !!idObject;
    const nameIsCorrectFormat = typeof name === "string";

    if ( nameIsValid && nameIsCorrectFormat )
      error.app.name = name;
    else
      error.format += formatStr( "name", name, true, true );
  }

  function maybeSetVersion( version, error ) {
    const versionIsCorrectFormat =
      typeof version === "string" &&
      version.split( "." ).length === 3 &&
      !isNaN( Number( version.split( "." )[0] ) ) &&
      !isNaN( Number( version.split( "." )[1] ) ) &&
      !isNaN( Number( version.split( "." )[2] ) );

    if ( versionIsCorrectFormat )
      error.app.version = version;
    else
      error.format += formatStr( "version", version, true );
  }

  function idIsValidForName( name, id, error ) {
    const defaults = ErrorModel();

    if ( id !== defaults.id && name !== defaults.app.name ) {
      const idObject = ids.reduce( ( acc, cur ) => { if ( id === cur.id ) return cur; else return acc; }, null );

      const idIsValidForName = idObject.name === name && idObject.id === id;
      if ( !idIsValidForName ) {
        error.id = defaults.id;
        error.app = defaults.app;
        error.format += formatStr( `Correct id & app.name, Incorrect relation`, `${id}, ${name}` );
      }
    }
  }

  const appIsCorrectFormat =
    typeof app === "object" &&
    !Array.isArray( app );
  if ( appIsCorrectFormat ) {
    maybeSetName( app.name, error );
    maybeSetVersion( app.version, error );
    idIsValidForName( app.name, error.id, error );
  } else
    error.format += formatStr( "app", app, true );
}

function maybeSetOs( os, error ) {
  function maybeSetType( type, error ) {
    const typeIsCorrectFormat = typeof type === "string";
    const typeIsValid = ~types.indexOf( type );

    if ( typeIsCorrectFormat && typeIsValid )
      error.os.type = type;
    else
      error.format += formatStr( "type", type, true, true );
  }
  function maybeSetPlatform( platform, error ) {
    const platformIsCorrectFormat = typeof platform === "string";
    const platformIsValid = ~platforms.indexOf( platform );

    if ( platformIsCorrectFormat && platformIsValid )
      error.os.platform = platform;
    else
      error.format += formatStr( "platform", platform, true, true );
  }

  const osIsCorrectFormat =
    typeof os === "object" &&
    !Array.isArray( os );

  if ( osIsCorrectFormat ) {
    maybeSetType( os.type, error );
    maybeSetPlatform( os.platform, error );
  } else
    error.format += formatStr( "os", os, true );
}

function maybeSetErr( err, error ) {
  function maybeSetMsg( msg, error ) {
    const msgIsCorrectFormat = typeof msg === "string";

    if ( msgIsCorrectFormat )
      error.error.msg = msg;
    else
      error.format += formatStr( "msg", msg, true );
  }
  function maybeSetStack( stack, error ) {
    const stackIsCorrectFormat = typeof stack === "string";

    if ( stackIsCorrectFormat )
      error.error.stack = stack;
    else
      error.format += formatStr( "stack", stack, true );
  }

  const errIsCorrectFormat =
    typeof err === "object" &&
    !Array.isArray( err );

  if ( errIsCorrectFormat ) {
    maybeSetMsg( err.msg, error );
    maybeSetStack( err.stack, error );
  } else
    error.format += formatStr( "err", err, true );
}

function IncomingError( incomingError ) {
  const error = new ErrorModel();
  const errorIsCorrectFormat =
    incomingError &&
    typeof incomingError === "object" &&
    !Array.isArray( incomingError );

  if ( !errorIsCorrectFormat ) {
    error.format += formatStr( "incomingError", incomingError, true );
    return error;
  }

  maybeSetId( incomingError.id, error );
  maybeSetApp( incomingError.app, error );
  maybeSetOs( incomingError.os, error );
  maybeSetErr( incomingError.error, error );

  return error;
}

module.exports = IncomingError;

