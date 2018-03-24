# api.jneidel.com

> Personal API for utility scripts

## API

### /mangareader

API for working with [mangareader-dl](https://github.com/jneidel/mangareader-dl).

One can created a list of mangas that the server will update upon release of new chapters. The `/updates` route give a convienient overview of newly available mangas. It also includes links for downloading the new chapters via [mangareader-dl](https://github.com/jneidel/mangareader-dl).

A rewrite of the mangareader-cli that includes this functionality is planned.

#### /mangareader/create-id?id=*id*

Method: POST

Create id for usage of mangareader API. Has to be include on every request to `mangareader` routes.

```
$ curl -X POST http://api.jneidel.com/mangareader/create-id\?id\=rACZ48SEPF
```

**id:**

Required

Id to be created.

#### /mangareader/add-manga?id=*id*&manga=*manga*

Method: POST

Add manga for which to receive update notifications.

```
$ curl -X POST http://api.jneidel.com/mangareader/add-manga\?id\=rACZ48SEPF\&manga\=shingeki-no-kyojin
```

**id:**

Required

Id to validate request.

**manga:**

Required

Manga to be added.

Format: `shingeki-no-kyojin`, taken from the url `https://www.mangareader.net/shingeki-no-kyojin`.

#### /mangareader/updates?id=*id*[&clear=*1*[&format=*json*]]

Method: GET

```
$ curl -X GET http://api.jneidel.com/mangareader/updates\?id\=rACZ48SEPF

❯ The following updates are available:
 • https://www.mangareader.net/shingeki-no-kyojin/100/
```

**id:**

Required

Id to specify account to access.

**clear:**

Optional

Value: `1`

Updates the current chapters, removing them from future `/updates` calls.

```
$ curl -X GET http://api.jneidel.com/mangareader/updates\?id\=rACZ48SEPF\&clear\=1
```

**format:**

Optional

Value: `json`

Include to return data as json object. For viewing in browsers with [JSON Formatter](https://chrome.google.com/webstore/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa).

`http://api.jneidel.com/mangareader/updates?id=rACZ48SEPF&format=json`

```json
{
  "data": [
    {
      "manga": "shingeki-no-kyojin",
      "chapter": "100"
    }
  ]
}
```
