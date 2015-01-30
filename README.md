# Purdue Labs Backend

This server will serve as a backend to the labs portion of the Purdue application. It will Pull and update all of the lab information from Itap, ECN, and CS and other labs on campus and hold them in Redis. Creating an PAI for Lab info on campus. 


To get started with NODE.js on Heroku look at: [Getting Started with Node on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs) article - check it out.


## API reference

An API will be defined in the WIKI of this repo. 

##Contributing

Any member of SigApp is welcome to add to this repo. I will have issues created for what is being worked on. Feel free to create more issues and add to the project. 

I will review PRs with any updates. 

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku Toolbelt](https://toolbelt.heroku.com/) installed.

```sh
$ git clone https://github.com/vidia/purdue-labs.git # or clone your own fork
$ cd purdue-labs
$ npm install
$ npm start

# or

$ foreman start web
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to Heroku

```
$ heroku create
$ git push heroku master
$ heroku open
```

## Documentation

For more information about using Node.js on Heroku, see these Dev Center articles:

- [Getting Started with Node.js on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
- [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
- [Using WebSockets on Heroku with Node.js](https://devcenter.heroku.com/articles/node-websockets)
