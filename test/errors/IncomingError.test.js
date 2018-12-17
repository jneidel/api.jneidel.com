const test = require( "ava" );

const IncomingError = require( "../../models/errors/Error.js" );

const time = new Date();

// IncomingError
test( "correct incomingError", t => t.deepEqual(
  new IncomingError( {
    id : "4163815d-3851-4c20-8f0e-518cddd0c783",
    app: {
      name   : "lock-me-out-cli",
      version: "0.2.5",
    },
    os: {
      type    : "Darwin",
      platform: "darwin",
    },
    error: {
      msg  : "this is err",
      stack: "stack",
    },
  } ),
  { id    : "4163815d-3851-4c20-8f0e-518cddd0c783",
    time  : `${time.getDate()}-${time.getMonth()} ${time.getHours()}:${time.getMinutes()}`,
    app   : { name: "lock-me-out-cli", version: "0.2.5" },
    os    : { type: "Darwin", platform: "darwin" },
    error : { msg: "this is err", stack: "stack" },
    format: "" }
) );

