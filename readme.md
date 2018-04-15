# api.jneidel.com

> Personal API for utility scripts

## /mangareader

API for [mangareader-dl](https://github.com/jneidel/mangareader-dl).

One can created a list of manga that the server will update upon release of new chapters. The `/updates` route give a convienient overview of newly available manga. It also includes links for downloading the new chapters via [mangareader-dl](https://github.com/jneidel/mangareader-dl).

The response will always be structured like this:

```
{
  "meta": {
    "id": "b8a47508-9701-44f6-b93d-e70167549155",
    "err": null //Or error message, eg: "Please include the 'id' parameter in your request."
  },
  "data": {} //If data is specified for route
}
```

### /mangareader/create-id

<table><tr>
  <td>Method: <code>POST</code></td>
</tr></table>

Create user id for usage of the mangareader API. Has to be include on every other request to `/mangareader` routes.

```
$ curl -X POST https://api.jneidel.com/mangareader/create-id
```

### /mangareader/add-manga

<table><tr>
  <td>Method: <code>POST</code></td>
</tr></table>

<table><tr>
  <td>Param:</td>
  <td><code>id</code></td>
  <td><code>manga</code></td>
  <td><code>chapter</code></td>
</tr></table>

Add the manga with the corresponding chapter to the given userid.

```
$ curl https://api.jneidel.com/mangareader/add-manga -d '{ "id": "b8a47508-9701-44f6-b93d-e70167549155", "manga": "shingeki-no-kyojin", "chapter": 42 }' -H "Content-Type: application/json"
```

### /mangareader/remove-manga

<table><tr>
  <td>Method: <code>POST</code></td>
</tr></table>

<table><tr>
  <td>Param:</td>
  <td><code>id</code></td>
  <td><code>manga</code></td>
</tr></table>

Add the manga from the given userid.

```
$ curl https://api.jneidel.com/mangareader/remove-manga -d '{ "id": "b8a47508-9701-44f6-b93d-e70167549155", "manga": "shingeki-no-kyojin" }' -H "Content-Type: application/json"
```

### /mangareader/update-manga

<table><tr>
  <td>Method: <code>POST</code></td>
</tr></table>

<table><tr>
  <td>Param:</td>
  <td><code>id</code></td>
  <td><code>manga</code></td>
  <td><code>chapter</code></td>
</tr></table>

Update the chapter of manga for given user id.

```
$ curl https://api.jneidel.com/mangareader/update-manga -d '{ "id": "b8a47508-9701-44f6-b93d-e70167549155", "manga": "shingeki-no-kyojin", "chapter": 128 }' -H "Content-Type: application/json"
```