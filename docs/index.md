# REST API documentation

## Zombies

### <span style="color: blue">`GET`</span> `api/zombies`

Retrieves a list of all the zombies.

#### Response body

The list of all the zombies:

*`JSON`*
```
[
  {  
    "id": <number>,
    "name": <string>,
    "createdTimestamp": <number>
  },
  {  
    ...
  },
  ...
]
```
* `id` The id of each zombie,
* `name` The name of each zombie,
* `createdTimestamp` The time of creation of each zombie represented in the Unix epoch.

#### Response codes
* `200` The list of all the zombies was retrieved successfully.

<hr>

### <span style="color: blue">`GET`</span> <code>api/zombies/*{id}*</code>

Retrieves a specific zombie given by the id *`{id}`*.

#### Path parameters

* *`{id}`* The `id` of the specific zombie that we want to retrieve

#### Response body

The specific zombie object:

*`JSON`*
```
{  
  "id": <number>,
  "name": <string>,
  "createdTimestamp": <number>
}
```
* `id` The id of the specific zombie,
* `name` The name of the specific zombie,
* `createdTimestamp` The time of creation the specific zombie represented in the Unix epoch.

#### Response codes
* `200` The specific zombie was found and retrieved.
* `404` Could not find the given zombie.

<hr>

### <span style="color: green">`POST`</span> `api/zombies`

Creates a new zombie.

#### Request body

*`JSON`*
```
{
  "name": <string>
}
```
* `name` The name of a new zombie.

#### Response body

The new zombie object that was succesfully added:

*`JSON`*
```
{
  "id": <number>,
  "name": <string>,
  "createdTimestamp": <number>
}
```
* `id` The id assigned to a newly created zombie,
* `name` The name of a newly created zombie (the same as as given in the request),
* `createdTimestamp` The time of creation of a newly created zombie represented in the Unix epoch.

#### Response codes
* `201` The new zombie was created successfully.

<hr>

### <span style="color: orange">`PUT`</span> <code>api/zombies/*{id}*</code>

Updates the zombie with a given *`{id}`*.

#### Path parameters

* *`{id}`* The `id` of the specific zombie that we want to update.

#### Request body

*`JSON`*
```
{
  "name": <string>
}
```
* `name` The name that we want to update the given zombie to.

#### Response body

The updated zombie object:

*`JSON`*
```
{
  "id": <number>,
  "name": <string>,
  "createdTimestamp": <number>
}
```
* `id` The id assigned to the updated zombie,
* `name` The name of the updated zombie (the same as as given in the request),
* `createdTimestamp` The time of creation of the updated zombie represented in the Unix epoch.

#### Response codes
* `201` The specific zombie was updated successfully.
* `404` The zombie to be updated was not found.

<hr>

### <span style="color: red">`DELETE`</span> <code>api/zombies/*{id}*</code>

Deletes a specific zombie given by the id *`{id}`*.

#### Path parameters

* *`{id}`* The `id` of the specific zombie that we want to delete.

#### Response codes
* `200` The specific zombie was successfully deleted.
* `404` The zombie to be deleted was not found.

<strong class="caution">This operation will result in deleting all the related items (owned by the given zombie).</strong>

## Items

### <span style="color: blue">`GET`</span> <code>api/zombies/*{zombie-id}*/items</code>

Retrieves a list of all the items belonging to the given zombie.

#### Path parameters
* *`{zombie-id}`* The `id` of the zombie whose items we want to retrieve

#### Response body

The list of all the items belonging to the given zombie.

*`JSON`*
```
[
  {  
    "id": <number>,
    "externalId": <number>,
    "name": <string>,
    "price": <number>,
    "links": [
      {
        "rel": "owner",
        "href": "zombies/<number>"
      }
    ]
  },
  {  
    ...
  },
  ...
]
```
* `id` The id of each item,
* `externalId` The id of each item as in the item store,
* `name` The name of each item (taken from the item store),
* `price` The price of each item in Polish Grosze (0.01 PLN),
* `links[0].href` The hyperlink to the zombie owning each item.


#### Response codes
* `200` The list of all the items owned by the given zombie was retrieved successfully.
* `404` Could not find the given zombie.

<hr>

### <span style="color: blue">`GET`</span> <code>api/zombies/*{zombie-id}*/items/totals</code>

Retrieves an object containing total prices of all the items belonging to the given zombie in three different currencies.

#### Path parameters
* *`{zombie-id}`* The `id` of the zombie for whose items we want to find total values


#### Response body

*`JSON`*
```
{
  "pln": <number>,
  "eur": <number>,
  "usd": <number>
}
```
* `pln` The total value of all the items belonging to the given zombie in Polish grosze (0.01 PLN),
* `eur` The total value of all the items belonging to the given zombie in eurocents (0.01 EUR),
* `usd` The total value of all the items belonging to the given zombie in United States' cents (0.01 USD).

#### Response codes
* `200` The object containing total prices was retrieved successfully.
* `404` Could not find the given zombie.

<hr>

### <span style="color: blue">`GET`</span> <code>api/zombies/*{zombie-id}*/items/*{item-id}*</code>

Retrieves a specific item belonging to the given zombie.

#### Path parameters
* *`{zombie-id}`* The `id` of the zombie whose item we want to retrieve
* *`{item-id}`* The `id` of the item that we want to retrieve

#### Response body

A specific item object belonging to the given zombie.

*`JSON`*
```
{  
  "id": <number>,
  "externalId": <number>,
  "name": <string>,
  "price": <number>,
  "links": [
     {
       "rel": "owner",
       "href": "zombies/<number>"
     }
  ]
}
```
* `id` The id of specific item,
* `externalId` The id of specific item as in the item store,
* `name` The name of specific item (taken from the item store),
* `price` The price of specific item in Polish Grosze (0.01 PLN),
* `links[0].href` The hyperlink to the zombie owning specific item.

#### Response codes
* `200` The specific item was found and retrieved.
* `404` Could not find the given zombie.
* `404` Could not find the specific item.

<hr>

### <span style="color: green">`POST`</span> <code>api/zombies/*{zombie-id}*/items</code>

Creates a single new item **or** many new items.

#### Path parameters
* *`{zombie-id}`* The `id` of the zombie to which we want to add new item(s).

#### Request body

Two variants are possible:

*`JSON 1`*
```
{
  "externalId": <number>
}
```

or

*`JSON 2`*
```
{
  "externalIds": [
    <number>,
    ...
  ]
}
```
`externalIds` The list of `id`s of items from the store that we want to purchase and add to the given zombie. 


#### Response body

Two variants are possible:

In case of including *`JSON 1`* in the request body:

*`JSON`*
```

{  
  "id": <number>,
  "externalId": <number>,
  "name": <string>,
  "price": <number>,
  "links": [
     {
       "rel": "owner",
       "href": "zombies/<number>"
     }
  ]
}
```
* `id` The id of the newly added item,
* `externalId` The id of the newly added item as in the item store,
* `name` The name of the newly added item (taken from the item store),
* `price` The price of the newly added item in Polish Grosze (0.01 PLN),
* `links[0].href` The hyperlink to the zombie owning the newly added item.

Or, in case of including *`JSON 2`* in the request body:

*`JSON`*
```
[
  {  
    "id": <number>,
    "externalId": <number>,
    "name": <string>,
    "price": <number>,
    "links": [
      {
        "rel": "owner",
        "href": "zombies/<number>"
      }
    ]
  },
  {  
    ...
  },
  ...
]
```
* `id` The id of each newly added item,
* `externalId` The id of each newly added item as in the item store,
* `name` The name of each newly added item (taken from the item store),
* `price` The price of each newly added item in Polish Grosze (0.01 PLN),
* `links[0].href` The hyperlink to the zombie owning each newly added item.

#### Response codes
* `201` Item(s) were successfully added to the zombie.
* `403` Tried to add the number of item(s), which would result in exceeding the maximum number of items per zombie. 

<strong style="color: #d30;">This is a costly operation paid for each single request.</strong>

<hr>

### <span style="color: red;">`DELETE`</span> <code>api/zombies/*{zombie-id}*/items/*{item-id}*</code>

Deletes a specific item belonging to the given zombie.

#### Path parameters
* *`{zombie-id}`* The `id` of the zombie whose item we want to delete
* *`{item-id}`* The `id` of the item that we want to delete

#### Response codes
* `200` The specific item was successfully deleted.
* `404` The item to be deleted was not found.

<hr>