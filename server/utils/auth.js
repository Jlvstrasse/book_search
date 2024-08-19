const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // function for our authenticated routes in GraphQL
  authMiddleware: function ({ req }) {
    // allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return req; 
      // If no token, return the request object as is
    }

    try {
      // verify token and get user data out of it
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data; // add the user data to the request object
    } catch {
      console.log('Invalid token');
    }

    // return the request object, whether or not a token was provided
    return req;
  },

  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
