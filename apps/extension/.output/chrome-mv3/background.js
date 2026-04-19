var background = (function() {


//#region ../../node_modules/.pnpm/wxt@0.20.25_@types+node@20.19.39_eslint@10.2.0_jiti@2.6.1__jiti@2.6.1_lightningcss@1.32.0_rol_whucav2ajt3lwms4hjehuspq2y/node_modules/wxt/dist/utils/define-background.mjs
	function defineBackground(arg) {
		if (arg == null || typeof arg === "function") return { main: arg };
		return arg;
	}

//#endregion
//#region entrypoints/background.ts
	var background_default = defineBackground(() => {
		const DASHBOARD_URL = "http://localhost:3000";
		chrome.runtime.onInstalled.addListener(() => {
			chrome.contextMenus.create({
				id: "brainbox-capture",
				title: "Save to BrainBox",
				contexts: ["selection"]
			});
		});
		chrome.contextMenus.onClicked.addListener(async (info, tab) => {
			if (info.menuItemId === "brainbox-capture" && info.selectionText) await syncToDashboard({
				id: `capture-${Date.now()}`,
				title: "Captured Snippet",
				description: `From: ${tab?.title || "Unknown Page"}`,
				content: info.selectionText,
				url: tab?.url,
				platform: "chatgpt",
				type: "chat",
				messages: [{
					role: "user",
					content: info.selectionText
				}]
			});
		});
		chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
			if (message.type === "PING") sendResponse({ status: "alive" });
			if (message.type === "SET_AUTH") {
				chrome.storage.local.set({ auth: message.payload });
				sendResponse({ success: true });
			}
			if (message.type === "SYNC_CHAT") {
				syncToDashboard(message.payload).then((res) => sendResponse(res)).catch((err) => sendResponse({
					success: false,
					error: err.message
				}));
				return true;
			}
			return true;
		});
		async function syncToDashboard(data) {
			const { auth } = await chrome.storage.local.get("auth");
			if (!auth?.token) return {
				success: false,
				error: "Unauthorized"
			};
			try {
				const response = await fetch(`${DASHBOARD_URL}/api/chats/extension`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${auth.token}`
					},
					body: JSON.stringify(data)
				});
				if (!response.ok) throw new Error(`HTTP ${response.status}`);
				return {
					success: true,
					data: await response.json()
				};
			} catch (error) {
				return {
					success: false,
					error: error.message
				};
			}
		}
	});

//#endregion
//#region \0virtual:wxt-plugins
	function initPlugins() {}

//#endregion
//#region ../../node_modules/.pnpm/@wxt-dev+browser@0.1.40/node_modules/@wxt-dev/browser/src/index.mjs
	var browser = globalThis.browser?.runtime?.id ? globalThis.browser : globalThis.chrome;

//#endregion
//#region ../../node_modules/.pnpm/@webext-core+match-patterns@1.0.3/node_modules/@webext-core/match-patterns/lib/index.js
	var _MatchPattern = class {
		constructor(matchPattern) {
			if (matchPattern === "<all_urls>") {
				this.isAllUrls = true;
				this.protocolMatches = [..._MatchPattern.PROTOCOLS];
				this.hostnameMatch = "*";
				this.pathnameMatch = "*";
			} else {
				const groups = /(.*):\/\/(.*?)(\/.*)/.exec(matchPattern);
				if (groups == null) throw new InvalidMatchPattern(matchPattern, "Incorrect format");
				const [_, protocol, hostname, pathname] = groups;
				validateProtocol(matchPattern, protocol);
				validateHostname(matchPattern, hostname);
				validatePathname(matchPattern, pathname);
				this.protocolMatches = protocol === "*" ? ["http", "https"] : [protocol];
				this.hostnameMatch = hostname;
				this.pathnameMatch = pathname;
			}
		}
		includes(url) {
			if (this.isAllUrls) return true;
			const u = typeof url === "string" ? new URL(url) : url instanceof Location ? new URL(url.href) : url;
			return !!this.protocolMatches.find((protocol) => {
				if (protocol === "http") return this.isHttpMatch(u);
				if (protocol === "https") return this.isHttpsMatch(u);
				if (protocol === "file") return this.isFileMatch(u);
				if (protocol === "ftp") return this.isFtpMatch(u);
				if (protocol === "urn") return this.isUrnMatch(u);
			});
		}
		isHttpMatch(url) {
			return url.protocol === "http:" && this.isHostPathMatch(url);
		}
		isHttpsMatch(url) {
			return url.protocol === "https:" && this.isHostPathMatch(url);
		}
		isHostPathMatch(url) {
			if (!this.hostnameMatch || !this.pathnameMatch) return false;
			const hostnameMatchRegexs = [this.convertPatternToRegex(this.hostnameMatch), this.convertPatternToRegex(this.hostnameMatch.replace(/^\*\./, ""))];
			const pathnameMatchRegex = this.convertPatternToRegex(this.pathnameMatch);
			return !!hostnameMatchRegexs.find((regex) => regex.test(url.hostname)) && pathnameMatchRegex.test(url.pathname);
		}
		isFileMatch(url) {
			throw Error("Not implemented: file:// pattern matching. Open a PR to add support");
		}
		isFtpMatch(url) {
			throw Error("Not implemented: ftp:// pattern matching. Open a PR to add support");
		}
		isUrnMatch(url) {
			throw Error("Not implemented: urn:// pattern matching. Open a PR to add support");
		}
		convertPatternToRegex(pattern) {
			const starsReplaced = this.escapeForRegex(pattern).replace(/\\\*/g, ".*");
			return RegExp(`^${starsReplaced}$`);
		}
		escapeForRegex(string) {
			return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		}
	};
	var MatchPattern = _MatchPattern;
	MatchPattern.PROTOCOLS = [
		"http",
		"https",
		"file",
		"ftp",
		"urn"
	];
	var InvalidMatchPattern = class extends Error {
		constructor(matchPattern, reason) {
			super(`Invalid match pattern "${matchPattern}": ${reason}`);
		}
	};
	function validateProtocol(matchPattern, protocol) {
		if (!MatchPattern.PROTOCOLS.includes(protocol) && protocol !== "*") throw new InvalidMatchPattern(matchPattern, `${protocol} not a valid protocol (${MatchPattern.PROTOCOLS.join(", ")})`);
	}
	function validateHostname(matchPattern, hostname) {
		if (hostname.includes(":")) throw new InvalidMatchPattern(matchPattern, `Hostname cannot include a port`);
		if (hostname.includes("*") && hostname.length > 1 && !hostname.startsWith("*.")) throw new InvalidMatchPattern(matchPattern, `If using a wildcard (*), it must go at the start of the hostname`);
	}
	function validatePathname(matchPattern, pathname) {}

//#endregion
//#region \0virtual:wxt-background-entrypoint?/home/hackamvigo/Projects/BrainBox_/apps/extension/entrypoints/background.ts
	function print(method, ...args) {}
	var logger = {
		debug: (...args) => print(console.debug, ...args),
		log: (...args) => print(console.log, ...args),
		warn: (...args) => print(console.warn, ...args),
		error: (...args) => print(console.error, ...args)
	};
	var result;
	try {
		/* @__PURE__ */ initPlugins();
		result = background_default.main();
		if (result instanceof Promise) console.warn("The background's main() function return a promise, but it must be synchronous");
	} catch (err) {
		logger.error("The background crashed on startup!");
		throw err;
	}
	var background_entrypoint_default = result;

//#endregion
return background_entrypoint_default;
})();