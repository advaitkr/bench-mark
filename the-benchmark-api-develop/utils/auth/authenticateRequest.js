import OAuth2Server from "oauth2-server";
const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;
export default function getAuthenticateRequest(app) {
  return function authenticateRequest(req, res, next) {
    var request = new Request(req);
    var response = new Response(res);

    return app.oauth
      .authenticate(request, response)
      .then(function (token) {
        req.token = token;
        next();
      })
      .catch(function (err) {
        res.status(err.code || 500).json(err);
      });
    next();
  };
}

function tokenScopeContaines(token, scopes) {
  console.log(token.scope.split(" "), scopes);
  // TO-DO update the code to check nested values
  console.log(
    "scope",
    scopes.filter((s) => {
      return !s.includes("_ME");
    })
  );

  return isSubsetOf(
    token.scope.split(" ").filter((s) => {
      return !s.includes("_ME");
    }),
    scopes
  );
}

function isSubsetOf(set, subset) {
  return (
    Array.from(new Set([...[...new Set(set)], ...[...new Set(subset)]]))
      .length === set.length
  );
}
