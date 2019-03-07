/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var express = require('express');
var router = express.Router();

var request = require('request'); // "Request" library
var querystring = require('querystring');
// var cookieParser = require('cookie-parser');
// var cors = require('cors');

const client_id = '2121c1623b45468ba1193d7a31fbcc09'; // Your client id
const client_secret = '9441785efc4f4fbc9a27dc41667e27f1'; // Your secret
const stateKey = 'spotify_auth_state';
const front_end = 'http://localhost:3000/'
const backend_end = 'http://localhost:8888/'
const redirect_uri = `${backend_end}spotify/callback`; // Or Your redirect uri


const generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};


router.get('/login', function (req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email user-read-playback-state playlist-read-private user-modify-playback-state app-remote-control user-read-birthdate streaming';
  const body = querystring.stringify({
    response_type: 'code',
    client_id: client_id,
    scope: scope,
    redirect_uri: redirect_uri,
    state: state
  })
  console.log({ body, state })
  res.redirect('https://accounts.spotify.com/authorize?' + body);
});

router.get('/callback', function (req, res) {
  console.log('callback')
  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;
  console.log({ storedState, state, req, res })
  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
          refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function (error, response, body) {
          console.log(body);
        });
        //TODO: HERE HANDLE CASE WHERE USER IS NOT PREMIUM
        // we can also pass the token to the browser to make requests from there
        //http://localhost:3000/callback?code=AQCVlcFzUQfpCwGW960Nz8Hk_LuNqOloEtrjnLAzWzoAFrLWvFGQypaTb7-EA459_7auVWlNGAn7MbhW8wqgL2e8mm-5oUWbAZcIyuMjCf6BM0mKXwAL7BhI2OeYnskte5ctA8tlHG5TSdROmwpBtr8HK2Lxz7osO2eXbDlKna62PZEFZiHiyBofyRTx79Zjj2NawDk4NFHhvqhGSrwWwdvnHX5eLPtHP28Dn2OvNpUaCp_bR3zl9sEHedo7aFRgZ-vzNcssy8Gh7BBajG18_8H2vM4&state=fFX1ymT8i9cEMpSL
        console.log(access_token, refresh_token)
        res.redirect(`${front_end}spotify-success?` +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

router.get('/refresh_token', function (req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  console.log(refresh_token)
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function (error, response, body) {
    console.log({ error, response, body })
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

module.exports = router;