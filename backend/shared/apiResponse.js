'use strict';

class ApiResponse {
  /**
   * Send a successful JSON response.
   * @param {import('express').Response} res
   * @param {string} message
   * @param {*} data
   * @param {number} statusCode
   */
  static success(res, message = 'Success', data = {}, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  /**
   * Send an error JSON response.
   * @param {import('express').Response} res
   * @param {string} message
   * @param {number} statusCode
   * @param {*} errors
   */
  static error(res, message = 'An error occurred', statusCode = 500, errors = null) {
    const body = { success: false, message };
    if (errors) body.errors = errors;
    return res.status(statusCode).json(body);
  }
}

module.exports = ApiResponse;
