import OAuth2Server from "oauth2-server";
// import User from "../models/auth/user.js";
import authmodels from "../model.js";
// import getAuthenticateRequest from "../utils/auth/authenticateRequest.js";
// import CustomerProfile from "../models/app/customerProfile.js";
import Token from "../models/auth/token.js";
import OtpGrantTypes from "../utils/auth/OtpGrantType.js";
// import getUserDetails from "./../utils/auth/getUserDetails.js";
const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;
const loadAuth = async (app) => {
  app.oauth = new OAuth2Server({
    model: authmodels,
    accessTokenLifetime: 60 * 60 * 24 * 365,
    allowBearerTokensInQueryString: true,
  });

  app.post("/oauth/token", obtainToken);
  app.post("/oauth/revoke", revokeToken);
  app.post("/oauth/verify", verifyToken);

  function obtainToken(req, res) {
    var request = new Request(req);
    var response = new Response(res);
    // TO-DO ??Need to check the user is authorised fot the scope requesting
    console.log("otp");
    return app.oauth
      .token(request, response, {
        allowExtendedTokenAttributes: true,
        extendedGrantTypes: {
          otp: OtpGrantTypes,
        },
      })
      .then(function (token) {
        console.log("token");
        console.log(token);
        const {
          accessToken,
          accessTokenExpiresAt,
          refreshTokenExpiresAt,
          refreshToken,
          scope,
        } = token;
        res.json({
          ...{
            accessToken,
            accessTokenExpiresAt,
            refreshTokenExpiresAt,
            refreshToken,
            scope,
          },
          access_token: token.accessToken,
        });
      })
      .catch(function (err) {
        res.status(err.code || 500).json(err);
      });
  }

  async function revokeToken(req, res, option) {
    try {
      console.log("revokeToken");
      res.set(
        "Set-Cookie",
        "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      );
      await Token.deleteOne({ accessToken: req.body.token });
      res.status(200).json({ message: "success" });
    } catch (err) {
      console.log(err);
      res.status(err.code || 500).json(err);
    }
  }

  async function verifyToken(req, res, option) {
    try {
      console.log("revokeToken");
      res.set(
        "Set-Cookie",
        "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      );
      let record = await Token.findOne({ accessToken: req.body.token });
      if (!record) return res.status(404).send();
      return res.status(200).send();
    } catch (err) {
      console.log(err);
      res.status(err.code || 500).json(err);
    }
  }
};

export default loadAuth;
