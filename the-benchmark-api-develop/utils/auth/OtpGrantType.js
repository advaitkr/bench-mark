import Token from "../../models/auth/token.js";
import User from "../../models/auth/user.js";
import Client from "../../models/auth/client.js";

import crypto from "crypto";
import { AbstractGrantType, InvalidArgumentError } from "oauth2-server";

const generateRandomToken = function () {
  return crypto
    .createHash("sha1")
    .update(crypto.randomBytes(256))
    .digest("hex");
};

class OtpGrantTypes extends AbstractGrantType {
  async handle(request, client) {
    console.log("request.user============");
    console.log(request.body);
    const user = await User.findOne(
      { username: request.body.username },
      { password: 0 }
    );
    console.log(request.body.username);
    if (!user) throw "User not found";
    if (request.body?.otp !== user.otp.code) throw "invalid otp";
    if (user.status !== 1)
      throw "Your account is not activated. Please contact administrator";
    const token = await Token.create({
      accessToken: generateRandomToken(),
      accessTokenExpiresAt: this.getAccessTokenExpiresAt(),
      refreshTokenExpiresAt: this.getRefreshTokenExpiresAt(),
      refreshToken: generateRandomToken(),
      scope: request.body.scope,
      client: await Client.findOne({}),
      user: user,
    });
    return token;
  }
}
export default OtpGrantTypes;
