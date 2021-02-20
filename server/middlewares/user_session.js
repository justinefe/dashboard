import RBAC from 'easy-rbac';
import debug from 'debug';
import chalk from 'chalk';
import helpers from '../helpers';

const log = debug('dev');
const { errorStat, generateToken, verifyToken } = helpers;

module.exports.main = function easySessionMain(connect, opts) {
  if (!connect) {
    throw new TypeError(
      'expected connect or express or express-session object as first argument'
    );
  }
  const Session = connect.Session || connect.session.Session;

  // Get options
  opts = opts || {};
  if (typeof opts !== 'object') {
    throw new TypeError('expected an options object as second argument');
  }

  const uaCheck = opts.uaCheck === undefined ? true : !!opts.uaCheck;
  const freshTimeout = opts.freshTimeout || 5 * 60 * 1000;
  const maxFreshTimeout = opts.maxFreshTimeout || 10 * 60 * 1000;
  let rbac;
  if (opts.rbac) {
    rbac = new RBAC(opts.rbac);
  }

  /**
   * Function for logging the user in.
   * @description Regenerates the session and adds _loggedInAt to the session object.
   * Depending on the configuration also adds _ip and _ua for continuity checks.
   * @param {string} role - optional role for the logged in user
   * @param {object} extend - optional properties to set on created session
   * @param {object} res - response object to set another cookie in browser
   * @returns {string} role
   */
  Session.prototype.login = async function login(role, extend, res) {
    if (typeof extend === 'function') {
      throw new TypeError('Callbacks no longer supported as of v2');
    } else if (extend && typeof extend !== 'object') {
      throw new TypeError('Second parameter expected to be an object');
    }
    const { req } = this;

    const token = await generateToken(extend);

    return new Promise((resolve, reject) => {
      this.regenerate((err) => {
        if (err) {
          return reject(err);
        }

        const split = token.split('.');
        const clientToken = [split[0], split[1]].join('.');
        const [, , signature] = split;
        res.cookie('pax_nify', clientToken, { maxAge: freshTimeout });

        // set the signature of the token in the secure token
        req.session.accessload = signature;
        req.session.loggedInAt = Date.now();
        req.session.lastRequestAt = Date.now();
        req.session.setRole(role);

        if (uaCheck) {
          req.session.ua = req.headers['user-agent'];
        }
        if (extend) {
          Object.assign(req.session, extend);
        }
        req.session.save();
        resolve(role);
      });
    });
  };

  /**
   * @Function
   * @param {Object} cb - Call back to be run if successful
   * @description logs out the user by destroting the user session
   * @returns {null} null
   * @memberof Helper
   */
  Session.prototype.logout = async function logout(cb) {
    this.regenerate((err) => (err ? new Error(err) : cb));
  };

  const oldResetMaxAge = Session.prototype.resetMaxAge;

  Session.prototype.resetMaxAge = function resetMaxAge() {
    this.lastRequestAt = Date.now();
    return oldResetMaxAge.call(this);
  };

  /**
   * @Function
   * @description Function for setting the last request for current moment
   * @returns {null} null
   * @memberof Helper
   */
  Session.prototype.setLastRequest = function setLastRequest() {
    this.lastRequestAt = Date.now();
  };

  /**
   * @Function
   * @param {Object} cb - Call back to be run if successful
   * @description Function for checking if the user is a guest.
   * @returns {bool} Returns true if logged out, false if logged in.
   * @memberof Helper
   */
  Session.prototype.isGuest = function isGuest() {
    return !this.loggedInAt; // If this is not set then we are not logged in
  };

  /**
   * @Function
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - Function to next function
   * @description Function for checking if the user is logged in.
   * @returns {bool} Returns true if logged id, false if logged out.
   * @memberof Helper
   */
  Session.prototype.isLoggedIn = async function isLoggedIn(req, res) {
    if (this.isGuest()) {
      throw new Error('You are not logged in');
    }

    const { pax_nify } = req.cookies;
    const signature = req.session.accessload;

    if (!pax_nify || !signature) {
      throw new Error('Not logged in');
    }

    const token = [pax_nify, signature].join('.');

    await verifyToken(token, async (err) => {
      if (err) {
        throw new Error('Invalid Access');
      }
    });

    res.cookie('pax_nify', pax_nify, { maxAge: maxFreshTimeout });
  };

  /**
   * @Function
   * @description Function for checking if the logged in session is fresh or stale.
   * @returns {bool} Returns true if fresh, false if stale.
   * @memberof Helper
   */
  Session.prototype.isFresh = function isFresh() {
    if (!this.loggedInAt) {
      return false;
    }
    const age = Date.now() - this.loggedInAt;
    if (age > maxFreshTimeout) {
      return false;
    }
    if (age < freshTimeout || Date.now() - this.lastRequestAt < freshTimeout) {
      return true;
    }
    return false;
  };

  /**
   * @Function
   * @param {string} role the user role
   * @description Function getting a role from the session
   * @returns {string} Defines the user role as a guest if the user is not logged in
   * @memberof Helper
   */
  Session.prototype.setRole = function setRole(role) {
    this.role = role;
    return role;
  };

  /**
   * @Function
   * @description Function getting a role from the session
   * @returns {string} Defines the user role as a guest if the user is not logged in
   * @memberof Helper
   */
  Session.prototype.getRole = function getRole() {
    return this.role || 'guest';
  };

  /**
   * @Function
   * @param {String} role - If present the user is also checked for the role
   * @param {bool} reverse - Check if the user doesnt have the role
   * @description Function checking the session role
   * @returns {bool} returns true if given role matches the session role, false otherwise
   * @memberof Helper
   */
  Session.prototype.hasRole = function hasRole(role, reverse) {
    if (reverse) {
      return this.hasNotRole(role);
    }

    const current = this.getRole();
    if (Array.isArray(role)) {
      return role.indexOf(current) !== -1;
    }

    return current === role;
  };

  /**
   * @Function
   * @param {String} role - If present the user is also checked for the role
   * @description Function checking the session role not to match a set
   * @returns {bool} returns false if given role matches the session role, true otherwise
   * @memberof Helper
   */
  Session.prototype.hasNotRole = function hasNotRole(role) {
    const current = this.getRole();
    if (Array.isArray(role)) {
      return role.indexOf(current) === -1;
    }

    return current !== role;
  };

  if (rbac) {
    Session.prototype.can = function can(operation, params, cb) {
      return rbac.can(this.getRole(), operation, params, cb);
    };
  }

  /**
   * Middleware for removing cookies from browser cache and
   * depending on configuration checking if users IP and UA have changed mid session.
   */

  /**
   * @Function
   * @param {Object} req - request object
   * @param {Object} res - respone object
   * @param {Function} next - next funcion
   * @description Middleware for removing cookies from browser cache and
   * depending on configuration checking if users IP and UA have changed mid session.
   * @returns {null} null
   * @memberof Helper
   */
  return function sessionMiddleware(req, res, next) {
    // Remove cookies from cache - a security feature
    res.header('Cache-Control', 'no-cache="Set-Cookie, Set-Cookie2"');

    if (!req.session) {
      next(new Error('Session object missing'));
      return;
    }

    function refresh() {
      res.removeListener('finish', refresh);
      res.removeListener('close', refresh);

      if (req.session) {
        req.session.setLastRequest();
      }
    }

    res.on('finish', refresh);
    res.on('close', refresh);

    if (req.session.isGuest()) {
      next();
      return;
    }

    if (uaCheck && req.session.ua !== req.headers['user-agent']) {
      log(chalk.red('The request User Agent did not match session user agent'));

      // Generate a new unauthenticated session
      return req.session
        .logout()
        .then(() => next())
        .catch(next);
    }

    // Everything checks out so continue
    next();
  };
};

/**
 * @description  middleware for checking if the is allowed for operation
 * @param {string} operation - operation to check for
 * @param {string} params - secondary parameter for can
 * @param {function} errorCallback
 * @returns {Function} resolve
 */
module.exports.can = function can(operation, params, errorCallback) {
  if (typeof operation !== 'string') {
    throw new TypeError('Expected first parameter to be string');
  }
  return async function canAccess(req, res, next) {
    try {
      await req.session.isLoggedIn(req, res);
    } catch (err) {
      return errorStat(res, 401, err.message);
    }

    const param_result =
      typeof params === 'function' ? await params(req, res) : params;

    try {
      const accessGranted = await req.session.can(operation, param_result);

      if (!accessGranted) {
        throw new Error('forbidden');
      }
      next();
    } catch (err) {
      if (errorCallback) {
        errorCallback(req, res, next);
        return;
      }
      errorStat(res, 403, 'Forbidden to perform this action');
    }
  };
};
