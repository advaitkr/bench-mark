/**
 * Configuration.
 */

 import User from "./models/auth/user.js";
 import Client from "./models/auth/client.js";
 import Token from "./models/auth/token.js";
 import bcrypt from "bcrypt";
 
 var config = {
   // clients: [
   //   {
   //     id: "application", // TODO: Needed by refresh_token grant, because there is a bug at line 103 in https://github.com/oauthjs/node-oauth2-server/blob/v3.0.1/lib/grant-types/refresh-token-grant-type.js (used client.id instead of client.clientId)
   //     clientId: "application",
   //     clientSecret: "secret",
   //     grants: ["password", "refresh_token", "otp"],
   //     redirectUris: [],
   //   },
   // ],
   // confidentialClients: [
   //   {
   //     clientId: "confidentialApplication",
   //     clientSecret: "topSecret",
   //     grants: ["password", "client_credentials"],
   //     redirectUris: [],
   //   },
   // ],
   tokens: [],
   users: [
     {
       username: "pedroetb",
       password: "password",
     },
   ],
 };
 
 /**
  * Dump the memory storage content (for debug).
  */
 
 var dump = function () {
   // console.log("clients", config.clients);
   // console.log("confidentialClients", config.confidentialClients);
   // console.log("tokens", config.tokens);
   // console.log("users", config.users);
 };
 
 /*
  * Methods used by all grant types.
  */
 
 var getAccessToken = async function (accessToken) {
   const token = await Token.findOne({ accessToken });
   return token;
 };
 
 var getClient = async function (clientId, clientSecret) {
   const client = await Client.findOne({ clientId, clientSecret });
   return client;
 };
 
 var saveToken = async function (token, client, user) {
   token = await Token.create({ ...token, user: user._id, client: client._id });
   return token;
 };
 
 /*
  * Method used only by password grant type.
  */
 
 var getUser = async function (username, password) {
   const user = await User.findOne({ username });
   console.log(user)
   if (user && user?.status === 1) {
     const validPassword = await bcrypt.compare(password, user.password);
     if (validPassword) return user;
   }
   return false;
 };
 /*
  * Method used only by password grant type.
  */
 
 var getUserByOtp = async function (username, password) {
   const user = await User.findOne({ username });
   return user
   console.log(user)
   if (user && user?.status === 1) {
     const validPassword = (password === user.otp.code)
     if (validPassword) return user;
   }
   return false;
 };
 
 /*
  * Method used only by client_credentials grant type.
  */
 
 var getUserFromClient = async function (client) {
   const clients = await Client.find({ clientSecret, clientId });
   return clients.length;
 };
 
 /*
  * Methods used only by refresh_token grant type.
  */
 
 // var getRefreshToken = async function (refreshToken, callback) {
 //   Token.findOne({
 //     refreshToken: refreshToken,
 //   })
 //     .lean()
 //     .exec(
 //       async function (callback, err, token) {
 //         if (!token) {
 //           console.error("Token not found");
 //         }
 
 //         const client = await Client.findOne({ _id: token.client });
 //         const user = await User.findOne({ _id: token.user });
 //         delete token.client;
 //         delete token.user;
 //         token.client = client;
 //         token.user = user;
 //         console.log(client, user);
 //         callback(err, token);
 //       }.bind(null, callback)
 //     );
 // };
 
 var getRefreshToken = async function (refreshToken) {
   var token = await Token.findOne({ refreshToken: refreshToken });
   if (!token) {
     console.error("Token not found");
     return;
   }
   const client = await Client.findOne({ _id: token.client });
   const user = await User.findOne({ _id: token.user });
   delete token.client;
   delete token.user;
   token.client = client;
   token.user = user;
   return token;
 };
 
 var revokeToken = async function (token) {
   return await Token.deleteOne({ refreshToken: token.refreshToken });
 };
 
 /**
  * Export model definition object.
  */
 
 export default {
   getAccessToken: getAccessToken,
   getClient: getClient,
   saveToken: saveToken,
   getUser: getUser,
   getUserByOtp: getUserByOtp,
   getUserFromClient: getUserFromClient,
   getRefreshToken: getRefreshToken,
   revokeToken: revokeToken,
   config,
 };
 