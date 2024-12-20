import { Issuer } from "openid-client";
import { OauthAdapter, type OauthBasicConfig } from "./oauth.js";
import { OidcAdapter, type OidcBasicConfig } from "./oidc.js";

const issuer = new Issuer({
	issuer: "https://github.com",
	authorization_endpoint: "https://github.com/login/oauth/authorize",
	token_endpoint: "https://github.com/login/oauth/access_token",
});

type Config =
	| ({
			mode: "oauth";
	  } & OauthBasicConfig)
	| ({
			mode: "oidc";
	  } & OidcBasicConfig);

export const GithubAdapter =
	/* @__PURE__ */
	(config: Config) => {
		if (config.mode === "oauth") {
			return OauthAdapter({
				issuer,
				...config,
			});
		}
		return OidcAdapter({
			issuer,
			scope: "openid email profile",
			...config,
		});
	};
