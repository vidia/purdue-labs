API
======

GET /labs/itap
[
{ Lab }, ...
]

Middleware:

1. Get the names of all of the labs
2. For each entry pull from the DB
3. If there is no entry, get it from HTTP
4. Return to client in array

````js
router.get("/labs/itap", function(res, req, next) {
  getLabNames(function(names) {
    res.data.names = names;
    next();
  });

}, function(res, req, next) {
  //for-each name in res.data.names
  getLabDetails(name, function(lab) {
    res.data.labs.push(lab);
  });
  //end for-each
  next();
}, function(req, res, next) {
  //if single lab
  res.send(res.data.labs[0])
  //else
  res.send(res.data.labs);
}
);

getLabDetails(name, callback) {
  Lab.find("name", function(lab) {
    if(exists)
      callback(lab);
    else
      getLabFromHttp(name, function(lab) {
        callback(lab);
      });
  }
}
````

This lets the different api endpoints only change out the first middleware (the one that creates the list of names)
to return only one (or many) labs.
