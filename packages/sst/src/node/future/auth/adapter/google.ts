import { type BaseClient, Issuer } from "openid-client";
import type { Adapter } from "./adapter.js";
import { OauthAdapter, type OauthBasicConfig } from "./oauth.js";
import { OidcAdapter, type OidcBasicConfig } from "./oidc.js";

let issuer: Issuer<BaseClient>;

type GooglePrompt = "none" | "consent" | "select_account";
type GoogleAccessType = "offline" | "online";

type GoogleConfig =
	| (OauthBasicConfig & {
			mode: "oauth";
			prompt?: GooglePrompt;
			accessType?: GoogleAccessType;
	  })
	| (OidcBasicConfig & { mode: "oidc"; prompt?: GooglePrompt });

export function GoogleAdapter(config: GoogleConfig) {
	/* @__PURE__ */
	return (async () => {
		if (!issuer) {
			issuer = await Issuer.discover("https://accounts.google.com");
		}
		if (config.mode === "oauth") {
			return OauthAdapter({
				issuer: issuer as Issuer<BaseClient>,
				...config,
				params: {
					...(config.accessType && { access_type: config.accessType }),
					...config.params,
				},
			})();
		}
		return OidcAdapter({
			issuer: issuer as Issuer<BaseClient>,
			scope: "openid email profile",
			...config,
		})();
	}) satisfies Adapter;
}
