'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    _ = require('lodash'),
    mongoose = require('mongoose'),
    PostComment = mongoose.model('Comment'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


/**
 *  Create a comment
 */
exports.create = function (req, res) {
    var comment = new PostComment(req.body);
    comment.creator = req.user;
    comment.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(comment);
        }
    });
};

/**
 * List of comments sorted by last creation date
 */
exports.listCommentsForPost = function (req, res) {
    PostComment.find({post:req.model._id}).sort('created').populate('creator','username profileImageURL').limit(req.query.limit).exec(function (err, comments) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        res.json(comments);
    });
};

/**
 * List of comments sorted by creation date
 */
exports.list = function (req, res) {
    PostComment.find(req.query).sort('-created').populate('creator','username profileImageURL').exec(function (err, comments) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        res.json(comments);
    });
};
