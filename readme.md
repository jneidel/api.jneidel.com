# api.jneidel.com

> Public API for jneidel.com

The public endpoint is: `api.jneidel.com`.

## `/mangareader`

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

### All routes:

- [`POST /mangareader/create-id`](#post-mangareadercreate-id)
- [`POST /mangareader/add-manga`](#post-mangareaderadd-manga)
- [`POST /mangareader/remove-manga`](#post-mangareaderremove-manga)
- [`POST /mangareader/update-provider`](#post-mangareaderupdate-provider)
- [`POST /mangareader/updates`](#post-mangareaderupdates)

### `POST /mangareader/create-id`

Create user id for usage of the mangareader API. Has to be include on every other request to `/mangareader` routes.

```
$ curl -X POST https://api.jneidel.com/mangareader/create-id

=> { "meta": {...} }
```

### `POST /mangareader/add-manga`

<table><tr>
  <td>Param: <code>id</code>, <code>manga</code>, <code>provider</code></td>
</tr></table>

Add the manga with the corresponding chapter to the given userid.

```
$ curl https://api.jneidel.com/mangareader/add-manga -d '{ "id": "b8a47508-9701-44f6-b93d-e70167549155", "manga": "shingeki-no-kyojin", "provider": "mangareader" }' -H "Content-Type: application/json"

=> { "meta": {...} }
```

### `POST /mangareader/remove-manga`

<table><tr>
  <td>Param: <code>id</code>, <code>manga</code>, <code>provider</code></td>
</tr></table>

Add the manga from the given userid.

```
$ curl https://api.jneidel.com/mangareader/remove-manga -d '{ "id": "b8a47508-9701-44f6-b93d-e70167549155", "manga": "shingeki-no-kyojin", "provider": "mangareader" }' -H "Content-Type: application/json"

=> { "meta": {...} }
```

### `POST /mangareader/update-provider`

<table><tr>
  <td>Param: <code>id</code>, <code>manga</code>, <code>provider</code></td>
</tr></table>

Update the provider of manga for given user id.

```
$ curl https://api.jneidel.com/mangareader/update-provider -d '{ "id": "b8a47508-9701-44f6-b93d-e70167549155", "manga": "shingeki-no-kyojin", "provider": "mangareader" }' -H "Content-Type: application/json"

=> { "meta": {...} }
```

### `POST /mangareader/updates`

<table><tr>
  <td>Param: <code>id</code>, <code>mangaList</code></td>
  <td>Return: <code>data</code></td>
</tr></table>

Get list of manga with available updates.

```
$ curl https://api.jneidel.com/mangareader/updates -d '{ "id": "b8a47508-9701-44f6-b93d-e70167549155", "mangaList": [ { "name": "shingeki-no-kyojin", "provider": "mangareader", "chapter": 93 }, { "name": "onepunch-man", "provider": "readmng", "chapter": 129 } ] }' -H "Content-Type: application/json"

=> {
  "meta": {...},
  "data": [ { "name": "shingeki-no-kyojin", "chapter": 94 },
            { "name": "onepunch-man", "chapter": 130 } ]
}
```

`mangaList` Schema:

```json
[
  {
    "name":     "<manga-name>",
    "provider": "<manga-provider>",
    "chapter":  "<manga-chapter>"
  }
]
```
