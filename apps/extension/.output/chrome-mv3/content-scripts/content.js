var content = (function() {


//#region ../../node_modules/.pnpm/wxt@0.20.25_@types+node@20.19.39_eslint@10.2.0_jiti@2.6.1__jiti@2.6.1_lightningcss@1.32.0_rol_whucav2ajt3lwms4hjehuspq2y/node_modules/wxt/dist/utils/define-content-script.mjs
	function defineContentScript(definition) {
		return definition;
	}

//#endregion
//#region src/content/adapters/base.adapter.ts
	var BaseAdapter = class {};

//#endregion
//#region src/content/adapters/chatgpt.adapter.ts
	var ChatGPTAdapter = class extends BaseAdapter {
		platformId = "chatgpt";
		extract() {
			const messages = [];
			document.querySelectorAll("[data-message-author-role]").forEach((el) => {
				const role = el.getAttribute("data-message-author-role");
				const content = el.textContent || "";
				messages.push({
					role,
					content
				});
			});
			return {
				title: document.title,
				messages,
				url: window.location.href
			};
		}
	};

//#endregion
//#region src/content/adapters/gemini.adapter.ts
	var GeminiAdapter = class extends BaseAdapter {
		platformId = "gemini";
		extract() {
			const messages = [];
			try {
				const chatHistoryContainer = document.querySelector("#chat-history");
				if (!chatHistoryContainer) return this.emptyResult();
				chatHistoryContainer.querySelectorAll(".conversation-container").forEach((block) => {
					const userQueryContainer = block.querySelector("user-query .query-text");
					if (userQueryContainer) {
						const content = this.extractFormattedContent(userQueryContainer);
						if (content) messages.push({
							role: "user",
							content
						});
					}
					const modelResponseEntity = block.querySelector("model-response");
					if (modelResponseEntity) {
						const messageContentContainer = modelResponseEntity.querySelector(".model-response-text");
						if (messageContentContainer) {
							const content = this.extractFormattedContent(messageContentContainer);
							if (content) messages.push({
								role: "assistant",
								content
							});
						}
					}
				});
			} catch (error) {
				console.error("[GeminiAdapter] DOM Extraction Error:", error);
			}
			return {
				title: this.extractTitle(),
				messages,
				url: window.location.href
			};
		}
		extractFormattedContent(element) {
			return (element.innerText || element.textContent || "").split("\n").map((line) => line.trim()).filter((line) => line.length > 0).join("\n").trim();
		}
		extractTitle() {
			const titleDiv = document.querySelector(".conversation-title");
			if (titleDiv) {
				const clone = titleDiv.cloneNode(true);
				clone.querySelectorAll("div").forEach((div) => div.remove());
				return clone.textContent?.trim() || "Untitled Chat";
			}
			return document.title.replace(" - Gemini", "").trim() || "Untitled Chat";
		}
		emptyResult() {
			return {
				title: "Untitled Chat",
				messages: [],
				url: window.location.href
			};
		}
	};

//#endregion
//#region entrypoints/content/index.ts
	var content_default = defineContentScript({
		matches: [
			"https://chatgpt.com/*",
			"https://gemini.google.com/*",
			"http://localhost:3000/extension-auth",
			"https://*.brainbox.ai/extension-auth"
		],
		runAt: "document_idle",
		main() {
			const hostname = window.location.hostname;
			window.addEventListener("message", (event) => {
				if (event.data?.type === "BRAINBOX_AUTH_HANDSHAKE") {
					const { token, user } = event.data.payload;
					if (token) chrome.runtime.sendMessage({
						type: "SET_AUTH",
						payload: {
							token,
							user
						}
					});
				}
			});
			let adapter = null;
			if (hostname.includes("chatgpt.com")) adapter = new ChatGPTAdapter();
			else if (hostname.includes("gemini.google.com")) adapter = new GeminiAdapter();
			chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
				if (message.type === "EXTRACT_CHAT" && adapter) sendResponse({
					success: true,
					data: adapter.extract()
				});
				if (message.type === "INJECT_TEXT") {
					const textarea = document.querySelector("textarea");
					if (textarea) {
						(Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set)?.call(textarea, message.payload.text);
						textarea.dispatchEvent(new Event("input", { bubbles: true }));
						sendResponse({ success: true });
					} else sendResponse({
						success: false,
						reason: "No textarea found"
					});
				}
				return true;
			});
		}
	});

//#endregion
//#region ../../node_modules/.pnpm/wxt@0.20.25_@types+node@20.19.39_eslint@10.2.0_jiti@2.6.1__jiti@2.6.1_lightningcss@1.32.0_rol_whucav2ajt3lwms4hjehuspq2y/node_modules/wxt/dist/utils/internal/logger.mjs
	function print$1(method, ...args) {}
	var logger$1 = {
		debug: (...args) => print$1(console.debug, ...args),
		log: (...args) => print$1(console.log, ...args),
		warn: (...args) => print$1(console.warn, ...args),
		error: (...args) => print$1(console.error, ...args)
	};

//#endregion
//#region ../../node_modules/.pnpm/@wxt-dev+browser@0.1.40/node_modules/@wxt-dev/browser/src/index.mjs
	var browser$1 = globalThis.browser?.runtime?.id ? globalThis.browser : globalThis.chrome;

//#endregion
//#region ../../node_modules/.pnpm/wxt@0.20.25_@types+node@20.19.39_eslint@10.2.0_jiti@2.6.1__jiti@2.6.1_lightningcss@1.32.0_rol_whucav2ajt3lwms4hjehuspq2y/node_modules/wxt/dist/browser.mjs
	var browser = browser$1;

//#endregion
//#region ../../node_modules/.pnpm/wxt@0.20.25_@types+node@20.19.39_eslint@10.2.0_jiti@2.6.1__jiti@2.6.1_lightningcss@1.32.0_rol_whucav2ajt3lwms4hjehuspq2y/node_modules/wxt/dist/utils/internal/custom-events.mjs
	var WxtLocationChangeEvent = class WxtLocationChangeEvent extends Event {
		static EVENT_NAME = getUniqueEventName("wxt:locationchange");
		constructor(newUrl, oldUrl) {
			super(WxtLocationChangeEvent.EVENT_NAME, {});
			this.newUrl = newUrl;
			this.oldUrl = oldUrl;
		}
	};
	function getUniqueEventName(eventName) {
		return `${browser?.runtime?.id}:content:${eventName}`;
	}

//#endregion
//#region ../../node_modules/.pnpm/wxt@0.20.25_@types+node@20.19.39_eslint@10.2.0_jiti@2.6.1__jiti@2.6.1_lightningcss@1.32.0_rol_whucav2ajt3lwms4hjehuspq2y/node_modules/wxt/dist/utils/internal/location-watcher.mjs
	var supportsNavigationApi = typeof globalThis.navigation?.addEventListener === "function";
	function createLocationWatcher(ctx) {
		let lastUrl;
		let watching = false;
		return { run() {
			if (watching) return;
			watching = true;
			lastUrl = new URL(location.href);
			if (supportsNavigationApi) globalThis.navigation.addEventListener("navigate", (event) => {
				const newUrl = new URL(event.destination.url);
				if (newUrl.href === lastUrl.href) return;
				window.dispatchEvent(new WxtLocationChangeEvent(newUrl, lastUrl));
				lastUrl = newUrl;
			}, { signal: ctx.signal });
			else ctx.setInterval(() => {
				const newUrl = new URL(location.href);
				if (newUrl.href !== lastUrl.href) {
					window.dispatchEvent(new WxtLocationChangeEvent(newUrl, lastUrl));
					lastUrl = newUrl;
				}
			}, 1e3);
		} };
	}

//#endregion
//#region ../../node_modules/.pnpm/wxt@0.20.25_@types+node@20.19.39_eslint@10.2.0_jiti@2.6.1__jiti@2.6.1_lightningcss@1.32.0_rol_whucav2ajt3lwms4hjehuspq2y/node_modules/wxt/dist/utils/content-script-context.mjs
	var ContentScriptContext = class ContentScriptContext {
		static SCRIPT_STARTED_MESSAGE_TYPE = getUniqueEventName("wxt:content-script-started");
		id;
		abortController;
		locationWatcher = createLocationWatcher(this);
		constructor(contentScriptName, options) {
			this.contentScriptName = contentScriptName;
			this.options = options;
			this.id = Math.random().toString(36).slice(2);
			this.abortController = new AbortController();
			this.stopOldScripts();
			this.listenForNewerScripts();
		}
		get signal() {
			return this.abortController.signal;
		}
		abort(reason) {
			return this.abortController.abort(reason);
		}
		get isInvalid() {
			if (browser.runtime?.id == null) this.notifyInvalidated();
			return this.signal.aborted;
		}
		get isValid() {
			return !this.isInvalid;
		}
		onInvalidated(cb) {
			this.signal.addEventListener("abort", cb);
			return () => this.signal.removeEventListener("abort", cb);
		}
		block() {
			return new Promise(() => {});
		}
		setInterval(handler, timeout) {
			const id = setInterval(() => {
				if (this.isValid) handler();
			}, timeout);
			this.onInvalidated(() => clearInterval(id));
			return id;
		}
		setTimeout(handler, timeout) {
			const id = setTimeout(() => {
				if (this.isValid) handler();
			}, timeout);
			this.onInvalidated(() => clearTimeout(id));
			return id;
		}
		requestAnimationFrame(callback) {
			const id = requestAnimationFrame((...args) => {
				if (this.isValid) callback(...args);
			});
			this.onInvalidated(() => cancelAnimationFrame(id));
			return id;
		}
		requestIdleCallback(callback, options) {
			const id = requestIdleCallback((...args) => {
				if (!this.signal.aborted) callback(...args);
			}, options);
			this.onInvalidated(() => cancelIdleCallback(id));
			return id;
		}
		addEventListener(target, type, handler, options) {
			if (type === "wxt:locationchange") {
				if (this.isValid) this.locationWatcher.run();
			}
			target.addEventListener?.(type.startsWith("wxt:") ? getUniqueEventName(type) : type, handler, {
				...options,
				signal: this.signal
			});
		}
		notifyInvalidated() {
			this.abort("Content script context invalidated");
			logger$1.debug(`Content script "${this.contentScriptName}" context invalidated`);
		}
		stopOldScripts() {
			document.dispatchEvent(new CustomEvent(ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE, { detail: {
				contentScriptName: this.contentScriptName,
				messageId: this.id
			} }));
			window.postMessage({
				type: ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE,
				contentScriptName: this.contentScriptName,
				messageId: this.id
			}, "*");
		}
		verifyScriptStartedEvent(event) {
			const isSameContentScript = event.detail?.contentScriptName === this.contentScriptName;
			const isFromSelf = event.detail?.messageId === this.id;
			return isSameContentScript && !isFromSelf;
		}
		listenForNewerScripts() {
			const cb = (event) => {
				if (!(event instanceof CustomEvent) || !this.verifyScriptStartedEvent(event)) return;
				this.notifyInvalidated();
			};
			document.addEventListener(ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE, cb);
			this.onInvalidated(() => document.removeEventListener(ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE, cb));
		}
	};

//#endregion
//#region \0virtual:wxt-plugins
	function initPlugins() {}

//#endregion
//#region \0virtual:wxt-content-script-isolated-world-entrypoint?/home/hackamvigo/Projects/BrainBox_/apps/extension/entrypoints/content/index.ts
	function print(method, ...args) {}
	var logger = {
		debug: (...args) => print(console.debug, ...args),
		log: (...args) => print(console.log, ...args),
		warn: (...args) => print(console.warn, ...args),
		error: (...args) => print(console.error, ...args)
	};
	var result = (async () => {
		try {
			/* @__PURE__ */ initPlugins();
			const { main, ...options } = content_default;
			return await main(new ContentScriptContext("content", options));
		} catch (err) {
			logger.error(`The content script "content" crashed on startup!`, err);
			throw err;
		}
	})();

//#endregion
return result;
})();
content;