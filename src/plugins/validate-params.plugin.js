'use strict'

const fp = require('fastify-plugin');
const isEmpty = require('lodash.isempty')
const createError = require('http-errors')

module.exports = fp(function (fastify, opts, next) {
  fastify.decorateRequest('validateParams', (body, params) => {
    try {
      if (isEmpty(body)) throw createError(400, 'Body is empty');

      for (const param of params) {
        if (!body.hasOwnProperty(param)) {
          throw createError(400, `Parameter '${param}' was not sent`);
        }
      }

      return
    } catch (error) {
      throw error
    }
  })

  next()
})
