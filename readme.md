# api.jneidel.com

> Public API for jneidel.com

The public endpoint is: `api.jneidel.com`.

## `/errors`

Error collection point for all my apps. The apps send anonymous data here once an error occurs. The error data will then be stored in the application specific log file, for later review.

### `POST /errors/submit`

Main route to submit errors.

```
$ curl https://api.jneidel.com:62220/errors/submit -d '{"id": "4163815d-3851-4c20-8f0e-518cddd0c783", "app": { "name": "lock-me-out-cli", "version": "0.2.5" }, "os": {"type":"Darwin","platform":"darwin"},"error":{"msg": "this","stack":"that"} }' -H "Content-Type: application/json"     

#=> { "success": true }
```

The route accepts the following data:

```js
{
  id : "string",
  app: {
    name   : "string",
    version: "string",
  },
  os: {
    type    : "string",
    platform: "string",
  },
  error: {
    msg  : "string",
    stack: "string",
  }
}
```

## Legacy endpoints

Browse [mangareader-dl](https://github.com/jneidel/api.jneidel.com/tree/d36244c0e621ec8abe0f94d6ecf2ea9da7f95ddc) routes.

