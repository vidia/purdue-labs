var express = require('express');
var router = express.Router();
var LabsHttpProvider = require("../update/itap");
var Lab = require("../models/lab");
var logger = require('log4js').getLogger();
var async = require('async');


router.get("/labs/itap", initData, allNamesMiddleware, populateLabsFromNamesMiddleware, sendLabsMiddleware);

function initData(req, res, next) {
  logger.trace("Initializing req");
  if(req == 'undefined') {
    req = { };
  }
  next();
}

function sendLabsMiddleware(req, res, next) { //TODO: Maybe change this to send an array always (for search consistency)
  logger.trace("Sending labs to client");
  if(req.labs.length == 1)
    res.send(req.labs[0]);
  else
    res.send(req.labs);
}

function populateLabsFromNamesMiddleware(req, res, next) {
  logger.trace("Populating the labs from the given names");
  req.labs = [];

  async.each(req.names, function(name, callback) {
    getLabDetails(name, function(lab) {
      logger.trace("Pushing lab ("+lab.name+") onto req");
      req.labs.push(lab);
      callback();
    });
  }, function(err) {
    if(err) {}
    next();
  });
}

function allNamesMiddleware(req, res, next) {
  logger.trace("Getting all the lab names from http provider");
  LabsHttpProvider.getLabNames(function(names) {
    req.names = names;
    next();
  });
}

//Attempts to pull lab from the db, otherwise pulls from HTTP
function getLabDetails(name, callback) {
  logger.trace("Getting lab details for ("+name+")");
  Lab.findOne({ name : name }, function(lab) {
    if(lab) {
      logger.trace("Found lab ("+name+") in database");
      callback(lab);
    } else {
      logger.trace("Lab ("+name+") not in database, requesting from provider");
      LabsHttpProvider.getLab(name, function(lab) {
        var labobj = new Lab(lab);
        labobj.save(function(err) {
          if(err) {
            logger.error(err);
          }
          logger.trace("Saved lab in database");
        });
        callback(lab);
      });
    }
  });
}

module.exports = router;
