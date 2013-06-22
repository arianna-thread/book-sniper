Book sniper [![Build Status](https://travis-ci.org/arianna-thread/book-sniper.png?branch=master)](https://travis-ci.org/arianna-thread/book-sniper)
===========
A set of extensible REST web services to discover and track book prices on differents platforms.

#Architecture (TODO)

#APIs (partial)

##Data Store APIs

### /books
* `GET` -> retrieve the books matching query/uri (the whole dataset if not). Returns:

```JSON
[{
    "isbn": "the ISBN-13 code of the book",
    "title": "the book title",
    "author": "Author Name",
    "refs": [{
        "source": "Amazon",
        "price": 12.34,
        "date": "2013-06-03T21:14:59.742Z"
    }]
},{
    
}]
```
* `POST` -> add a new book to the collection. Data passed to the body must be like this:

```JSON
{
    "isbn": "the ISBN-13 code of the book",
    "title": "the book title",
    "author": "Author Name",
    "refs": [{
        "source": "Ebay",
        "price": 12.34,
        "date": "2013-06-03T21:14:59.742Z"
    }]
}
```
* `PUT` -> not supported
* `DELETE` -> not supported


#### parameters:
specify one or none of the parameters below:

* `uri` -> the uri of the description inside one of the platforms
* `query` -> plain text to search in the books metadata

 


### /books/{isbn}
* `GET` -> retrieve the book with the specified isbn. Returns a single item (as opposed to the /isbn resource)
* `POST` -> not supported
* `PUT` -> update the book with the specified isbn. PUT data shoud be an object
* `DELETE` -> removed the specified book

#### parameters:
no parameters available

### /books/{isbn}/refs
* `GET` -> retrieve the book refs array
* `POST` -> add elements to the refs array. POST data should be an array of the form

```JSON
[{
    "source": "Ebay",
    "price": 12.34,
    "date": "2013-06-03T21:14:59.742Z"
},{
    "source": "Amazon",
    "price": 11.99,
    "date": "2013-06-03T21:14:59.742Z"
}]
```
* `PUT` -> not supported
* `DELETE` -> not supported

#### parameters:
no parameters available

##Manager APIs
### /books
* `GET` -> retrieve the book objects

### parameters:
* `uri` -> the uri of the book

### /prices
* `GET` -> retrieve the updated objects of the books specified by the isbns parameter

### parameters:
* `isbns` -> array of isbn of books to be updaited

#Details
##Platforms considered
* half ebay 
* amazon 
* google books
* itunes (work in progress)

##Technologies
Built on top of node.js and mongodb, uses express to expose RESTfull APIs
