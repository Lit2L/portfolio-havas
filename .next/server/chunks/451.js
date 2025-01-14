exports.id = 451;
exports.ids = [451];
exports.modules = {

/***/ 18058:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all)=>{
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = (to, from, except, desc)=>{
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
            get: ()=>from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
    return to;
};
var __toCommonJS = (mod)=>__copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
// pkg/dist-src/index.js
var dist_src_exports = {};
__export(dist_src_exports, {
    App: ()=>App,
    createNodeMiddleware: ()=>createNodeMiddleware
});
module.exports = __toCommonJS(dist_src_exports);
var import_core = __webpack_require__(4032);
var import_auth_app3 = __webpack_require__(17959);
var import_oauth_app2 = __webpack_require__(55480);
// pkg/dist-src/version.js
var VERSION = "14.1.0";
// pkg/dist-src/webhooks.js
var import_auth_app = __webpack_require__(17959);
var import_auth_unauthenticated = __webpack_require__(87410);
var import_webhooks = __webpack_require__(45256);
function webhooks(appOctokit, options) {
    return new import_webhooks.Webhooks({
        secret: options.secret,
        transform: async (event)=>{
            if (!("installation" in event.payload) || typeof event.payload.installation !== "object") {
                const octokit2 = new appOctokit.constructor({
                    authStrategy: import_auth_unauthenticated.createUnauthenticatedAuth,
                    auth: {
                        reason: `"installation" key missing in webhook event payload`
                    }
                });
                return {
                    ...event,
                    octokit: octokit2
                };
            }
            const installationId = event.payload.installation.id;
            const octokit = await appOctokit.auth({
                type: "installation",
                installationId,
                factory (auth) {
                    return new auth.octokit.constructor({
                        ...auth.octokitOptions,
                        authStrategy: import_auth_app.createAppAuth,
                        ...{
                            auth: {
                                ...auth,
                                installationId
                            }
                        }
                    });
                }
            });
            octokit.hook.before("request", (options2)=>{
                options2.headers["x-github-delivery"] = event.id;
            });
            return {
                ...event,
                octokit
            };
        }
    });
}
// pkg/dist-src/each-installation.js
var import_plugin_paginate_rest = __webpack_require__(62929);
// pkg/dist-src/get-installation-octokit.js
var import_auth_app2 = __webpack_require__(17959);
async function getInstallationOctokit(app, installationId) {
    return app.octokit.auth({
        type: "installation",
        installationId,
        factory (auth) {
            const options = {
                ...auth.octokitOptions,
                authStrategy: import_auth_app2.createAppAuth,
                ...{
                    auth: {
                        ...auth,
                        installationId
                    }
                }
            };
            return new auth.octokit.constructor(options);
        }
    });
}
// pkg/dist-src/each-installation.js
function eachInstallationFactory(app) {
    return Object.assign(eachInstallation.bind(null, app), {
        iterator: eachInstallationIterator.bind(null, app)
    });
}
async function eachInstallation(app, callback) {
    const i = eachInstallationIterator(app)[Symbol.asyncIterator]();
    let result = await i.next();
    while(!result.done){
        await callback(result.value);
        result = await i.next();
    }
}
function eachInstallationIterator(app) {
    return {
        async *[Symbol.asyncIterator] () {
            const iterator = import_plugin_paginate_rest.composePaginateRest.iterator(app.octokit, "GET /app/installations");
            for await (const { data: installations } of iterator){
                for (const installation of installations){
                    const installationOctokit = await getInstallationOctokit(app, installation.id);
                    yield {
                        octokit: installationOctokit,
                        installation
                    };
                }
            }
        }
    };
}
// pkg/dist-src/each-repository.js
var import_plugin_paginate_rest2 = __webpack_require__(62929);
function eachRepositoryFactory(app) {
    return Object.assign(eachRepository.bind(null, app), {
        iterator: eachRepositoryIterator.bind(null, app)
    });
}
async function eachRepository(app, queryOrCallback, callback) {
    const i = eachRepositoryIterator(app, callback ? queryOrCallback : void 0)[Symbol.asyncIterator]();
    let result = await i.next();
    while(!result.done){
        if (callback) {
            await callback(result.value);
        } else {
            await queryOrCallback(result.value);
        }
        result = await i.next();
    }
}
function singleInstallationIterator(app, installationId) {
    return {
        async *[Symbol.asyncIterator] () {
            yield {
                octokit: await app.getInstallationOctokit(installationId)
            };
        }
    };
}
function eachRepositoryIterator(app, query) {
    return {
        async *[Symbol.asyncIterator] () {
            const iterator = query ? singleInstallationIterator(app, query.installationId) : app.eachInstallation.iterator();
            for await (const { octokit } of iterator){
                const repositoriesIterator = import_plugin_paginate_rest2.composePaginateRest.iterator(octokit, "GET /installation/repositories");
                for await (const { data: repositories } of repositoriesIterator){
                    for (const repository of repositories){
                        yield {
                            octokit,
                            repository
                        };
                    }
                }
            }
        }
    };
}
// pkg/dist-src/middleware/node/index.js
var import_oauth_app = __webpack_require__(55480);
var import_webhooks2 = __webpack_require__(45256);
function noop() {}
function createNodeMiddleware(app, options = {}) {
    const log = Object.assign({
        debug: noop,
        info: noop,
        warn: console.warn.bind(console),
        error: console.error.bind(console)
    }, options.log);
    const optionsWithDefaults = {
        pathPrefix: "/api/github",
        ...options,
        log
    };
    const webhooksMiddleware = (0, import_webhooks2.createNodeMiddleware)(app.webhooks, {
        path: optionsWithDefaults.pathPrefix + "/webhooks",
        log
    });
    const oauthMiddleware = (0, import_oauth_app.createNodeMiddleware)(app.oauth, {
        pathPrefix: optionsWithDefaults.pathPrefix + "/oauth"
    });
    return middleware.bind(null, optionsWithDefaults.pathPrefix, webhooksMiddleware, oauthMiddleware);
}
async function middleware(pathPrefix, webhooksMiddleware, oauthMiddleware, request, response, next) {
    const { pathname } = new URL(request.url, "http://localhost");
    if (pathname.startsWith(`${pathPrefix}/`)) {
        if (pathname === `${pathPrefix}/webhooks`) {
            webhooksMiddleware(request, response);
        } else if (pathname.startsWith(`${pathPrefix}/oauth/`)) {
            oauthMiddleware(request, response);
        } else {
            (0, import_oauth_app.sendNodeResponse)((0, import_oauth_app.unknownRouteResponse)(request), response);
        }
        return true;
    } else {
        next == null ? void 0 : next();
        return false;
    }
}
// pkg/dist-src/index.js
var _App = class _App {
    static defaults(defaults) {
        const AppWithDefaults = class extends this {
            constructor(...args){
                super({
                    ...defaults,
                    ...args[0]
                });
            }
        };
        return AppWithDefaults;
    }
    constructor(options){
        const Octokit = options.Octokit || import_core.Octokit;
        const authOptions = Object.assign({
            appId: options.appId,
            privateKey: options.privateKey
        }, options.oauth ? {
            clientId: options.oauth.clientId,
            clientSecret: options.oauth.clientSecret
        } : {});
        this.octokit = new Octokit({
            authStrategy: import_auth_app3.createAppAuth,
            auth: authOptions,
            log: options.log
        });
        this.log = Object.assign({
            debug: ()=>{},
            info: ()=>{},
            warn: console.warn.bind(console),
            error: console.error.bind(console)
        }, options.log);
        if (options.webhooks) {
            this.webhooks = webhooks(this.octokit, options.webhooks);
        } else {
            Object.defineProperty(this, "webhooks", {
                get () {
                    throw new Error("[@octokit/app] webhooks option not set");
                }
            });
        }
        if (options.oauth) {
            this.oauth = new import_oauth_app2.OAuthApp({
                ...options.oauth,
                clientType: "github-app",
                Octokit
            });
        } else {
            Object.defineProperty(this, "oauth", {
                get () {
                    throw new Error("[@octokit/app] oauth.clientId / oauth.clientSecret options are not set");
                }
            });
        }
        this.getInstallationOctokit = getInstallationOctokit.bind(null, this);
        this.eachInstallation = eachInstallationFactory(this);
        this.eachRepository = eachRepositoryFactory(this);
    }
};
_App.VERSION = VERSION;
var App = _App;
// Annotate the CommonJS export names for ESM import in node:
0 && (0);


/***/ }),

/***/ 17959:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all)=>{
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = (to, from, except, desc)=>{
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
            get: ()=>from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
    return to;
};
var __toESM = (mod, isNodeMode, target)=>(target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(// If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
        value: mod,
        enumerable: true
    }) : target, mod));
var __toCommonJS = (mod)=>__copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
// pkg/dist-src/index.js
var dist_src_exports = {};
__export(dist_src_exports, {
    createAppAuth: ()=>createAppAuth,
    createOAuthUserAuth: ()=>import_auth_oauth_user2.createOAuthUserAuth
});
module.exports = __toCommonJS(dist_src_exports);
var import_universal_user_agent = __webpack_require__(33716);
var import_request = __webpack_require__(4499);
var import_auth_oauth_app = __webpack_require__(42789);
// pkg/dist-src/auth.js
var import_deprecation = __webpack_require__(753);
var OAuthAppAuth = __toESM(__webpack_require__(42789));
// pkg/dist-src/get-app-authentication.js
var import_universal_github_app_jwt = __webpack_require__(4594);
async function getAppAuthentication({ appId, privateKey, timeDifference }) {
    try {
        const appAuthentication = await (0, import_universal_github_app_jwt.githubAppJwt)({
            id: +appId,
            privateKey,
            now: timeDifference && Math.floor(Date.now() / 1e3) + timeDifference
        });
        return {
            type: "app",
            token: appAuthentication.token,
            appId: appAuthentication.appId,
            expiresAt: new Date(appAuthentication.expiration * 1e3).toISOString()
        };
    } catch (error) {
        if (privateKey === "-----BEGIN RSA PRIVATE KEY-----") {
            throw new Error("The 'privateKey` option contains only the first line '-----BEGIN RSA PRIVATE KEY-----'. If you are setting it using a `.env` file, make sure it is set on a single line with newlines replaced by '\n'");
        } else {
            throw error;
        }
    }
}
// pkg/dist-src/cache.js
var import_lru_cache = __webpack_require__(72951);
function getCache() {
    return new import_lru_cache.LRUCache({
        // cache max. 15000 tokens, that will use less than 10mb memory
        max: 15e3,
        // Cache for 1 minute less than GitHub expiry
        ttl: 1e3 * 60 * 59
    });
}
async function get(cache, options) {
    const cacheKey = optionsToCacheKey(options);
    const result = await cache.get(cacheKey);
    if (!result) {
        return;
    }
    const [token, createdAt, expiresAt, repositorySelection, permissionsString, singleFileName] = result.split("|");
    const permissions = options.permissions || permissionsString.split(/,/).reduce((permissions2, string)=>{
        if (/!$/.test(string)) {
            permissions2[string.slice(0, -1)] = "write";
        } else {
            permissions2[string] = "read";
        }
        return permissions2;
    }, {});
    return {
        token,
        createdAt,
        expiresAt,
        permissions,
        repositoryIds: options.repositoryIds,
        repositoryNames: options.repositoryNames,
        singleFileName,
        repositorySelection
    };
}
async function set(cache, options, data) {
    const key = optionsToCacheKey(options);
    const permissionsString = options.permissions ? "" : Object.keys(data.permissions).map((name)=>`${name}${data.permissions[name] === "write" ? "!" : ""}`).join(",");
    const value = [
        data.token,
        data.createdAt,
        data.expiresAt,
        data.repositorySelection,
        permissionsString,
        data.singleFileName
    ].join("|");
    await cache.set(key, value);
}
function optionsToCacheKey({ installationId, permissions = {}, repositoryIds = [], repositoryNames = [] }) {
    const permissionsString = Object.keys(permissions).sort().map((name)=>permissions[name] === "read" ? name : `${name}!`).join(",");
    const repositoryIdsString = repositoryIds.sort().join(",");
    const repositoryNamesString = repositoryNames.join(",");
    return [
        installationId,
        repositoryIdsString,
        repositoryNamesString,
        permissionsString
    ].filter(Boolean).join("|");
}
// pkg/dist-src/to-token-authentication.js
function toTokenAuthentication({ installationId, token, createdAt, expiresAt, repositorySelection, permissions, repositoryIds, repositoryNames, singleFileName }) {
    return Object.assign({
        type: "token",
        tokenType: "installation",
        token,
        installationId,
        permissions,
        createdAt,
        expiresAt,
        repositorySelection
    }, repositoryIds ? {
        repositoryIds
    } : null, repositoryNames ? {
        repositoryNames
    } : null, singleFileName ? {
        singleFileName
    } : null);
}
// pkg/dist-src/get-installation-authentication.js
async function getInstallationAuthentication(state, options, customRequest) {
    const installationId = Number(options.installationId || state.installationId);
    if (!installationId) {
        throw new Error("[@octokit/auth-app] installationId option is required for installation authentication.");
    }
    if (options.factory) {
        const { type, factory, oauthApp, ...factoryAuthOptions } = {
            ...state,
            ...options
        };
        return factory(factoryAuthOptions);
    }
    const optionsWithInstallationTokenFromState = Object.assign({
        installationId
    }, options);
    if (!options.refresh) {
        const result = await get(state.cache, optionsWithInstallationTokenFromState);
        if (result) {
            const { token: token2, createdAt: createdAt2, expiresAt: expiresAt2, permissions: permissions2, repositoryIds: repositoryIds2, repositoryNames: repositoryNames2, singleFileName: singleFileName2, repositorySelection: repositorySelection2 } = result;
            return toTokenAuthentication({
                installationId,
                token: token2,
                createdAt: createdAt2,
                expiresAt: expiresAt2,
                permissions: permissions2,
                repositorySelection: repositorySelection2,
                repositoryIds: repositoryIds2,
                repositoryNames: repositoryNames2,
                singleFileName: singleFileName2
            });
        }
    }
    const appAuthentication = await getAppAuthentication(state);
    const request = customRequest || state.request;
    const { data: { token, expires_at: expiresAt, repositories, permissions: permissionsOptional, repository_selection: repositorySelectionOptional, single_file: singleFileName } } = await request("POST /app/installations/{installation_id}/access_tokens", {
        installation_id: installationId,
        repository_ids: options.repositoryIds,
        repositories: options.repositoryNames,
        permissions: options.permissions,
        mediaType: {
            previews: [
                "machine-man"
            ]
        },
        headers: {
            authorization: `bearer ${appAuthentication.token}`
        }
    });
    const permissions = permissionsOptional || {};
    const repositorySelection = repositorySelectionOptional || "all";
    const repositoryIds = repositories ? repositories.map((r)=>r.id) : void 0;
    const repositoryNames = repositories ? repositories.map((repo)=>repo.name) : void 0;
    const createdAt = /* @__PURE__ */ new Date().toISOString();
    await set(state.cache, optionsWithInstallationTokenFromState, {
        token,
        createdAt,
        expiresAt,
        repositorySelection,
        permissions,
        repositoryIds,
        repositoryNames,
        singleFileName
    });
    return toTokenAuthentication({
        installationId,
        token,
        createdAt,
        expiresAt,
        repositorySelection,
        permissions,
        repositoryIds,
        repositoryNames,
        singleFileName
    });
}
// pkg/dist-src/auth.js
async function auth(state, authOptions) {
    switch(authOptions.type){
        case "app":
            return getAppAuthentication(state);
        case "oauth":
            state.log.warn(// @ts-expect-error `log.warn()` expects string
            new import_deprecation.Deprecation(`[@octokit/auth-app] {type: "oauth"} is deprecated. Use {type: "oauth-app"} instead`));
        case "oauth-app":
            return state.oauthApp({
                type: "oauth-app"
            });
        case "installation":
            authOptions;
            return getInstallationAuthentication(state, {
                ...authOptions,
                type: "installation"
            });
        case "oauth-user":
            return state.oauthApp(authOptions);
        default:
            throw new Error(`Invalid auth type: ${authOptions.type}`);
    }
}
// pkg/dist-src/hook.js
var import_auth_oauth_user = __webpack_require__(71113);
var import_request_error = __webpack_require__(32806);
// pkg/dist-src/requires-app-auth.js
var PATHS = [
    "/app",
    "/app/hook/config",
    "/app/hook/deliveries",
    "/app/hook/deliveries/{delivery_id}",
    "/app/hook/deliveries/{delivery_id}/attempts",
    "/app/installations",
    "/app/installations/{installation_id}",
    "/app/installations/{installation_id}/access_tokens",
    "/app/installations/{installation_id}/suspended",
    "/app/installation-requests",
    "/marketplace_listing/accounts/{account_id}",
    "/marketplace_listing/plan",
    "/marketplace_listing/plans",
    "/marketplace_listing/plans/{plan_id}/accounts",
    "/marketplace_listing/stubbed/accounts/{account_id}",
    "/marketplace_listing/stubbed/plan",
    "/marketplace_listing/stubbed/plans",
    "/marketplace_listing/stubbed/plans/{plan_id}/accounts",
    "/orgs/{org}/installation",
    "/repos/{owner}/{repo}/installation",
    "/users/{username}/installation"
];
function routeMatcher(paths) {
    const regexes = paths.map((p)=>p.split("/").map((c)=>c.startsWith("{") ? "(?:.+?)" : c).join("/"));
    const regex = `^(?:${regexes.map((r)=>`(?:${r})`).join("|")})$`;
    return new RegExp(regex, "i");
}
var REGEX = routeMatcher(PATHS);
function requiresAppAuth(url) {
    return !!url && REGEX.test(url.split("?")[0]);
}
// pkg/dist-src/hook.js
var FIVE_SECONDS_IN_MS = 5 * 1e3;
function isNotTimeSkewError(error) {
    return !(error.message.match(/'Expiration time' claim \('exp'\) must be a numeric value representing the future time at which the assertion expires/) || error.message.match(/'Issued at' claim \('iat'\) must be an Integer representing the time that the assertion was issued/));
}
async function hook(state, request, route, parameters) {
    const endpoint = request.endpoint.merge(route, parameters);
    const url = endpoint.url;
    if (/\/login\/oauth\/access_token$/.test(url)) {
        return request(endpoint);
    }
    if (requiresAppAuth(url.replace(request.endpoint.DEFAULTS.baseUrl, ""))) {
        const { token: token2 } = await getAppAuthentication(state);
        endpoint.headers.authorization = `bearer ${token2}`;
        let response;
        try {
            response = await request(endpoint);
        } catch (error) {
            if (isNotTimeSkewError(error)) {
                throw error;
            }
            if (typeof error.response.headers.date === "undefined") {
                throw error;
            }
            const diff = Math.floor((Date.parse(error.response.headers.date) - Date.parse(/* @__PURE__ */ new Date().toString())) / 1e3);
            state.log.warn(error.message);
            state.log.warn(`[@octokit/auth-app] GitHub API time and system time are different by ${diff} seconds. Retrying request with the difference accounted for.`);
            const { token: token3 } = await getAppAuthentication({
                ...state,
                timeDifference: diff
            });
            endpoint.headers.authorization = `bearer ${token3}`;
            return request(endpoint);
        }
        return response;
    }
    if ((0, import_auth_oauth_user.requiresBasicAuth)(url)) {
        const authentication = await state.oauthApp({
            type: "oauth-app"
        });
        endpoint.headers.authorization = authentication.headers.authorization;
        return request(endpoint);
    }
    const { token, createdAt } = await getInstallationAuthentication(state, // @ts-expect-error TBD
    {}, request.defaults({
        baseUrl: endpoint.baseUrl
    }));
    endpoint.headers.authorization = `token ${token}`;
    return sendRequestWithRetries(state, request, endpoint, createdAt);
}
async function sendRequestWithRetries(state, request, options, createdAt, retries = 0) {
    const timeSinceTokenCreationInMs = +/* @__PURE__ */ new Date() - +new Date(createdAt);
    try {
        return await request(options);
    } catch (error) {
        if (error.status !== 401) {
            throw error;
        }
        if (timeSinceTokenCreationInMs >= FIVE_SECONDS_IN_MS) {
            if (retries > 0) {
                error.message = `After ${retries} retries within ${timeSinceTokenCreationInMs / 1e3}s of creating the installation access token, the response remains 401. At this point, the cause may be an authentication problem or a system outage. Please check https://www.githubstatus.com for status information`;
            }
            throw error;
        }
        ++retries;
        const awaitTime = retries * 1e3;
        state.log.warn(`[@octokit/auth-app] Retrying after 401 response to account for token replication delay (retry: ${retries}, wait: ${awaitTime / 1e3}s)`);
        await new Promise((resolve)=>setTimeout(resolve, awaitTime));
        return sendRequestWithRetries(state, request, options, createdAt, retries);
    }
}
// pkg/dist-src/version.js
var VERSION = "6.1.2";
// pkg/dist-src/index.js
var import_auth_oauth_user2 = __webpack_require__(71113);
function createAppAuth(options) {
    if (!options.appId) {
        throw new Error("[@octokit/auth-app] appId option is required");
    }
    if (!Number.isFinite(+options.appId)) {
        throw new Error("[@octokit/auth-app] appId option must be a number or numeric string");
    }
    if (!options.privateKey) {
        throw new Error("[@octokit/auth-app] privateKey option is required");
    }
    if ("installationId" in options && !options.installationId) {
        throw new Error("[@octokit/auth-app] installationId is set to a falsy value");
    }
    const log = Object.assign({
        warn: console.warn.bind(console)
    }, options.log);
    const request = options.request || import_request.request.defaults({
        headers: {
            "user-agent": `octokit-auth-app.js/${VERSION} ${(0, import_universal_user_agent.getUserAgent)()}`
        }
    });
    const state = Object.assign({
        request,
        cache: getCache()
    }, options, options.installationId ? {
        installationId: Number(options.installationId)
    } : {}, {
        log,
        oauthApp: (0, import_auth_oauth_app.createOAuthAppAuth)({
            clientType: "github-app",
            clientId: options.clientId || "",
            clientSecret: options.clientSecret || "",
            request
        })
    });
    return Object.assign(auth.bind(null, state), {
        hook: hook.bind(null, state)
    });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (0);


/***/ }),

/***/ 42789:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all)=>{
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = (to, from, except, desc)=>{
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
            get: ()=>from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
    return to;
};
var __toESM = (mod, isNodeMode, target)=>(target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(// If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
        value: mod,
        enumerable: true
    }) : target, mod));
var __toCommonJS = (mod)=>__copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
// pkg/dist-src/index.js
var dist_src_exports = {};
__export(dist_src_exports, {
    createOAuthAppAuth: ()=>createOAuthAppAuth,
    createOAuthUserAuth: ()=>import_auth_oauth_user3.createOAuthUserAuth
});
module.exports = __toCommonJS(dist_src_exports);
var import_universal_user_agent = __webpack_require__(33716);
var import_request = __webpack_require__(4499);
// pkg/dist-src/auth.js
var import_btoa_lite = __toESM(__webpack_require__(95000));
var import_auth_oauth_user = __webpack_require__(71113);
async function auth(state, authOptions) {
    if (authOptions.type === "oauth-app") {
        return {
            type: "oauth-app",
            clientId: state.clientId,
            clientSecret: state.clientSecret,
            clientType: state.clientType,
            headers: {
                authorization: `basic ${(0, import_btoa_lite.default)(`${state.clientId}:${state.clientSecret}`)}`
            }
        };
    }
    if ("factory" in authOptions) {
        const { type, ...options } = {
            ...authOptions,
            ...state
        };
        return authOptions.factory(options);
    }
    const common = {
        clientId: state.clientId,
        clientSecret: state.clientSecret,
        request: state.request,
        ...authOptions
    };
    const userAuth = state.clientType === "oauth-app" ? await (0, import_auth_oauth_user.createOAuthUserAuth)({
        ...common,
        clientType: state.clientType
    }) : await (0, import_auth_oauth_user.createOAuthUserAuth)({
        ...common,
        clientType: state.clientType
    });
    return userAuth();
}
// pkg/dist-src/hook.js
var import_btoa_lite2 = __toESM(__webpack_require__(95000));
var import_auth_oauth_user2 = __webpack_require__(71113);
async function hook(state, request2, route, parameters) {
    let endpoint = request2.endpoint.merge(route, parameters);
    if (/\/login\/(oauth\/access_token|device\/code)$/.test(endpoint.url)) {
        return request2(endpoint);
    }
    if (state.clientType === "github-app" && !(0, import_auth_oauth_user2.requiresBasicAuth)(endpoint.url)) {
        throw new Error(`[@octokit/auth-oauth-app] GitHub Apps cannot use their client ID/secret for basic authentication for endpoints other than "/applications/{client_id}/**". "${endpoint.method} ${endpoint.url}" is not supported.`);
    }
    const credentials = (0, import_btoa_lite2.default)(`${state.clientId}:${state.clientSecret}`);
    endpoint.headers.authorization = `basic ${credentials}`;
    try {
        return await request2(endpoint);
    } catch (error) {
        if (error.status !== 401) throw error;
        error.message = `[@octokit/auth-oauth-app] "${endpoint.method} ${endpoint.url}" does not support clientId/clientSecret basic authentication.`;
        throw error;
    }
}
// pkg/dist-src/version.js
var VERSION = "7.1.0";
// pkg/dist-src/index.js
var import_auth_oauth_user3 = __webpack_require__(71113);
function createOAuthAppAuth(options) {
    const state = Object.assign({
        request: import_request.request.defaults({
            headers: {
                "user-agent": `octokit-auth-oauth-app.js/${VERSION} ${(0, import_universal_user_agent.getUserAgent)()}`
            }
        }),
        clientType: "oauth-app"
    }, options);
    return Object.assign(auth.bind(null, state), {
        hook: hook.bind(null, state)
    });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (0);


/***/ }),

/***/ 11005:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all)=>{
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = (to, from, except, desc)=>{
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
            get: ()=>from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
    return to;
};
var __toCommonJS = (mod)=>__copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
// pkg/dist-src/index.js
var dist_src_exports = {};
__export(dist_src_exports, {
    createOAuthDeviceAuth: ()=>createOAuthDeviceAuth
});
module.exports = __toCommonJS(dist_src_exports);
var import_universal_user_agent = __webpack_require__(33716);
var import_request = __webpack_require__(4499);
// pkg/dist-src/get-oauth-access-token.js
var import_oauth_methods = __webpack_require__(34553);
async function getOAuthAccessToken(state, options) {
    const cachedAuthentication = getCachedAuthentication(state, options.auth);
    if (cachedAuthentication) return cachedAuthentication;
    const { data: verification } = await (0, import_oauth_methods.createDeviceCode)({
        clientType: state.clientType,
        clientId: state.clientId,
        request: options.request || state.request,
        // @ts-expect-error the extra code to make TS happy is not worth it
        scopes: options.auth.scopes || state.scopes
    });
    await state.onVerification(verification);
    const authentication = await waitForAccessToken(options.request || state.request, state.clientId, state.clientType, verification);
    state.authentication = authentication;
    return authentication;
}
function getCachedAuthentication(state, auth2) {
    if (auth2.refresh === true) return false;
    if (!state.authentication) return false;
    if (state.clientType === "github-app") {
        return state.authentication;
    }
    const authentication = state.authentication;
    const newScope = ("scopes" in auth2 && auth2.scopes || state.scopes).join(" ");
    const currentScope = authentication.scopes.join(" ");
    return newScope === currentScope ? authentication : false;
}
async function wait(seconds) {
    await new Promise((resolve)=>setTimeout(resolve, seconds * 1e3));
}
async function waitForAccessToken(request, clientId, clientType, verification) {
    try {
        const options = {
            clientId,
            request,
            code: verification.device_code
        };
        const { authentication } = clientType === "oauth-app" ? await (0, import_oauth_methods.exchangeDeviceCode)({
            ...options,
            clientType: "oauth-app"
        }) : await (0, import_oauth_methods.exchangeDeviceCode)({
            ...options,
            clientType: "github-app"
        });
        return {
            type: "token",
            tokenType: "oauth",
            ...authentication
        };
    } catch (error) {
        if (!error.response) throw error;
        const errorType = error.response.data.error;
        if (errorType === "authorization_pending") {
            await wait(verification.interval);
            return waitForAccessToken(request, clientId, clientType, verification);
        }
        if (errorType === "slow_down") {
            await wait(verification.interval + 5);
            return waitForAccessToken(request, clientId, clientType, verification);
        }
        throw error;
    }
}
// pkg/dist-src/auth.js
async function auth(state, authOptions) {
    return getOAuthAccessToken(state, {
        auth: authOptions
    });
}
// pkg/dist-src/hook.js
async function hook(state, request, route, parameters) {
    let endpoint = request.endpoint.merge(route, parameters);
    if (/\/login\/(oauth\/access_token|device\/code)$/.test(endpoint.url)) {
        return request(endpoint);
    }
    const { token } = await getOAuthAccessToken(state, {
        request,
        auth: {
            type: "oauth"
        }
    });
    endpoint.headers.authorization = `token ${token}`;
    return request(endpoint);
}
// pkg/dist-src/version.js
var VERSION = "6.1.0";
// pkg/dist-src/index.js
function createOAuthDeviceAuth(options) {
    const requestWithDefaults = options.request || import_request.request.defaults({
        headers: {
            "user-agent": `octokit-auth-oauth-device.js/${VERSION} ${(0, import_universal_user_agent.getUserAgent)()}`
        }
    });
    const { request = requestWithDefaults, ...otherOptions } = options;
    const state = options.clientType === "github-app" ? {
        ...otherOptions,
        clientType: "github-app",
        request
    } : {
        ...otherOptions,
        clientType: "oauth-app",
        request,
        scopes: options.scopes || []
    };
    if (!options.clientId) {
        throw new Error('[@octokit/auth-oauth-device] "clientId" option must be set (https://github.com/octokit/auth-oauth-device.js#usage)');
    }
    if (!options.onVerification) {
        throw new Error('[@octokit/auth-oauth-device] "onVerification" option must be a function (https://github.com/octokit/auth-oauth-device.js#usage)');
    }
    return Object.assign(auth.bind(null, state), {
        hook: hook.bind(null, state)
    });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (0);


/***/ }),

/***/ 71113:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all)=>{
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = (to, from, except, desc)=>{
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
            get: ()=>from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
    return to;
};
var __toESM = (mod, isNodeMode, target)=>(target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(// If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
        value: mod,
        enumerable: true
    }) : target, mod));
var __toCommonJS = (mod)=>__copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
// pkg/dist-src/index.js
var dist_src_exports = {};
__export(dist_src_exports, {
    createOAuthUserAuth: ()=>createOAuthUserAuth,
    requiresBasicAuth: ()=>requiresBasicAuth
});
module.exports = __toCommonJS(dist_src_exports);
var import_universal_user_agent = __webpack_require__(33716);
var import_request = __webpack_require__(4499);
// pkg/dist-src/version.js
var VERSION = "4.1.0";
// pkg/dist-src/get-authentication.js
var import_auth_oauth_device = __webpack_require__(11005);
var import_oauth_methods = __webpack_require__(34553);
async function getAuthentication(state) {
    if ("code" in state.strategyOptions) {
        const { authentication } = await (0, import_oauth_methods.exchangeWebFlowCode)({
            clientId: state.clientId,
            clientSecret: state.clientSecret,
            clientType: state.clientType,
            onTokenCreated: state.onTokenCreated,
            ...state.strategyOptions,
            request: state.request
        });
        return {
            type: "token",
            tokenType: "oauth",
            ...authentication
        };
    }
    if ("onVerification" in state.strategyOptions) {
        const deviceAuth = (0, import_auth_oauth_device.createOAuthDeviceAuth)({
            clientType: state.clientType,
            clientId: state.clientId,
            onTokenCreated: state.onTokenCreated,
            ...state.strategyOptions,
            request: state.request
        });
        const authentication = await deviceAuth({
            type: "oauth"
        });
        return {
            clientSecret: state.clientSecret,
            ...authentication
        };
    }
    if ("token" in state.strategyOptions) {
        return {
            type: "token",
            tokenType: "oauth",
            clientId: state.clientId,
            clientSecret: state.clientSecret,
            clientType: state.clientType,
            onTokenCreated: state.onTokenCreated,
            ...state.strategyOptions
        };
    }
    throw new Error("[@octokit/auth-oauth-user] Invalid strategy options");
}
// pkg/dist-src/auth.js
var import_oauth_methods2 = __webpack_require__(34553);
async function auth(state, options = {}) {
    var _a, _b;
    if (!state.authentication) {
        state.authentication = state.clientType === "oauth-app" ? await getAuthentication(state) : await getAuthentication(state);
    }
    if (state.authentication.invalid) {
        throw new Error("[@octokit/auth-oauth-user] Token is invalid");
    }
    const currentAuthentication = state.authentication;
    if ("expiresAt" in currentAuthentication) {
        if (options.type === "refresh" || new Date(currentAuthentication.expiresAt) < /* @__PURE__ */ new Date()) {
            const { authentication } = await (0, import_oauth_methods2.refreshToken)({
                clientType: "github-app",
                clientId: state.clientId,
                clientSecret: state.clientSecret,
                refreshToken: currentAuthentication.refreshToken,
                request: state.request
            });
            state.authentication = {
                tokenType: "oauth",
                type: "token",
                ...authentication
            };
        }
    }
    if (options.type === "refresh") {
        if (state.clientType === "oauth-app") {
            throw new Error("[@octokit/auth-oauth-user] OAuth Apps do not support expiring tokens");
        }
        if (!currentAuthentication.hasOwnProperty("expiresAt")) {
            throw new Error("[@octokit/auth-oauth-user] Refresh token missing");
        }
        await ((_a = state.onTokenCreated) == null ? void 0 : _a.call(state, state.authentication, {
            type: options.type
        }));
    }
    if (options.type === "check" || options.type === "reset") {
        const method = options.type === "check" ? import_oauth_methods2.checkToken : import_oauth_methods2.resetToken;
        try {
            const { authentication } = await method({
                // @ts-expect-error making TS happy would require unnecessary code so no
                clientType: state.clientType,
                clientId: state.clientId,
                clientSecret: state.clientSecret,
                token: state.authentication.token,
                request: state.request
            });
            state.authentication = {
                tokenType: "oauth",
                type: "token",
                // @ts-expect-error TBD
                ...authentication
            };
            if (options.type === "reset") {
                await ((_b = state.onTokenCreated) == null ? void 0 : _b.call(state, state.authentication, {
                    type: options.type
                }));
            }
            return state.authentication;
        } catch (error) {
            if (error.status === 404) {
                error.message = "[@octokit/auth-oauth-user] Token is invalid";
                state.authentication.invalid = true;
            }
            throw error;
        }
    }
    if (options.type === "delete" || options.type === "deleteAuthorization") {
        const method = options.type === "delete" ? import_oauth_methods2.deleteToken : import_oauth_methods2.deleteAuthorization;
        try {
            await method({
                // @ts-expect-error making TS happy would require unnecessary code so no
                clientType: state.clientType,
                clientId: state.clientId,
                clientSecret: state.clientSecret,
                token: state.authentication.token,
                request: state.request
            });
        } catch (error) {
            if (error.status !== 404) throw error;
        }
        state.authentication.invalid = true;
        return state.authentication;
    }
    return state.authentication;
}
// pkg/dist-src/hook.js
var import_btoa_lite = __toESM(__webpack_require__(95000));
// pkg/dist-src/requires-basic-auth.js
var ROUTES_REQUIRING_BASIC_AUTH = /\/applications\/[^/]+\/(token|grant)s?/;
function requiresBasicAuth(url) {
    return url && ROUTES_REQUIRING_BASIC_AUTH.test(url);
}
// pkg/dist-src/hook.js
async function hook(state, request, route, parameters = {}) {
    const endpoint = request.endpoint.merge(route, parameters);
    if (/\/login\/(oauth\/access_token|device\/code)$/.test(endpoint.url)) {
        return request(endpoint);
    }
    if (requiresBasicAuth(endpoint.url)) {
        const credentials = (0, import_btoa_lite.default)(`${state.clientId}:${state.clientSecret}`);
        endpoint.headers.authorization = `basic ${credentials}`;
        return request(endpoint);
    }
    const { token } = state.clientType === "oauth-app" ? await auth({
        ...state,
        request
    }) : await auth({
        ...state,
        request
    });
    endpoint.headers.authorization = "token " + token;
    return request(endpoint);
}
// pkg/dist-src/index.js
function createOAuthUserAuth({ clientId, clientSecret, clientType = "oauth-app", request = import_request.request.defaults({
    headers: {
        "user-agent": `octokit-auth-oauth-app.js/${VERSION} ${(0, import_universal_user_agent.getUserAgent)()}`
    }
}), onTokenCreated, ...strategyOptions }) {
    const state = Object.assign({
        clientType,
        clientId,
        clientSecret,
        onTokenCreated,
        strategyOptions,
        request
    });
    return Object.assign(auth.bind(null, state), {
        // @ts-expect-error not worth the extra code needed to appease TS
        hook: hook.bind(null, state)
    });
}
createOAuthUserAuth.VERSION = VERSION;
// Annotate the CommonJS export names for ESM import in node:
0 && (0);


/***/ }),

/***/ 17806:
/***/ ((module) => {

"use strict";

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all)=>{
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = (to, from, except, desc)=>{
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
            get: ()=>from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
    return to;
};
var __toCommonJS = (mod)=>__copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
// pkg/dist-src/index.js
var dist_src_exports = {};
__export(dist_src_exports, {
    createTokenAuth: ()=>createTokenAuth
});
module.exports = __toCommonJS(dist_src_exports);
// pkg/dist-src/auth.js
var REGEX_IS_INSTALLATION_LEGACY = /^v1\./;
var REGEX_IS_INSTALLATION = /^ghs_/;
var REGEX_IS_USER_TO_SERVER = /^ghu_/;
async function auth(token) {
    const isApp = token.split(/\./).length === 3;
    const isInstallation = REGEX_IS_INSTALLATION_LEGACY.test(token) || REGEX_IS_INSTALLATION.test(token);
    const isUserToServer = REGEX_IS_USER_TO_SERVER.test(token);
    const tokenType = isApp ? "app" : isInstallation ? "installation" : isUserToServer ? "user-to-server" : "oauth";
    return {
        type: "token",
        token,
        tokenType
    };
}
// pkg/dist-src/with-authorization-prefix.js
function withAuthorizationPrefix(token) {
    if (token.split(/\./).length === 3) {
        return `bearer ${token}`;
    }
    return `token ${token}`;
}
// pkg/dist-src/hook.js
async function hook(token, request, route, parameters) {
    const endpoint = request.endpoint.merge(route, parameters);
    endpoint.headers.authorization = withAuthorizationPrefix(token);
    return request(endpoint);
}
// pkg/dist-src/index.js
var createTokenAuth = function createTokenAuth2(token) {
    if (!token) {
        throw new Error("[@octokit/auth-token] No token passed to createTokenAuth");
    }
    if (typeof token !== "string") {
        throw new Error("[@octokit/auth-token] Token passed to createTokenAuth is not a string");
    }
    token = token.replace(/^(token|bearer) +/i, "");
    return Object.assign(auth.bind(null, token), {
        hook: hook.bind(null, token)
    });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (0);


/***/ }),

/***/ 87410:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all)=>{
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = (to, from, except, desc)=>{
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
            get: ()=>from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
    return to;
};
var __toCommonJS = (mod)=>__copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
// pkg/dist-src/index.js
var dist_src_exports = {};
__export(dist_src_exports, {
    createUnauthenticatedAuth: ()=>createUnauthenticatedAuth
});
module.exports = __toCommonJS(dist_src_exports);
// pkg/dist-src/auth.js
async function auth(reason) {
    return {
        type: "unauthenticated",
        reason
    };
}
// pkg/dist-src/is-rate-limit-error.js
var import_request_error = __webpack_require__(32806);
function isRateLimitError(error) {
    if (error.status !== 403) {
        return false;
    }
    if (!error.response) {
        return false;
    }
    return error.response.headers["x-ratelimit-remaining"] === "0";
}
// pkg/dist-src/is-abuse-limit-error.js
var import_request_error2 = __webpack_require__(32806);
var REGEX_ABUSE_LIMIT_MESSAGE = /\babuse\b/i;
function isAbuseLimitError(error) {
    if (error.status !== 403) {
        return false;
    }
    return REGEX_ABUSE_LIMIT_MESSAGE.test(error.message);
}
// pkg/dist-src/hook.js
async function hook(reason, request, route, parameters) {
    const endpoint = request.endpoint.merge(route, parameters);
    return request(endpoint).catch((error)=>{
        if (error.status === 404) {
            error.message = `Not found. May be due to lack of authentication. Reason: ${reason}`;
            throw error;
        }
        if (isRateLimitError(error)) {
            error.message = `API rate limit exceeded. This maybe caused by the lack of authentication. Reason: ${reason}`;
            throw error;
        }
        if (isAbuseLimitError(error)) {
            error.message = `You have triggered an abuse detection mechanism. This maybe caused by the lack of authentication. Reason: ${reason}`;
            throw error;
        }
        if (error.status === 401) {
            error.message = `Unauthorized. "${endpoint.method} ${endpoint.url}" failed most likely due to lack of authentication. Reason: ${reason}`;
            throw error;
        }
        if (error.status >= 400 && error.status < 500) {
            error.message = error.message.replace(/\.?$/, `. May be caused by lack of authentication (${reason}).`);
        }
        throw error;
    });
}
// pkg/dist-src/index.js
var createUnauthenticatedAuth = function createUnauthenticatedAuth2(options) {
    if (!options || !options.reason) {
        throw new Error("[@octokit/auth-unauthenticated] No reason passed to createUnauthenticatedAuth");
    }
    return Object.assign(auth.bind(null, options.reason), {
        hook: hook.bind(null, options.reason)
    });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (0);


/***/ }),

/***/ 4032:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all)=>{
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = (to, from, except, desc)=>{
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
            get: ()=>from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
    return to;
};
var __toCommonJS = (mod)=>__copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
// pkg/dist-src/index.js
var dist_src_exports = {};
__export(dist_src_exports, {
    Octokit: ()=>Octokit
});
module.exports = __toCommonJS(dist_src_exports);
var import_universal_user_agent = __webpack_require__(33716);
var import_before_after_hook = __webpack_require__(24458);
var import_request = __webpack_require__(4499);
var import_graphql = __webpack_require__(16092);
var import_auth_token = __webpack_require__(17806);
// pkg/dist-src/version.js
var VERSION = "5.2.0";
// pkg/dist-src/index.js
var noop = ()=>{};
var consoleWarn = console.warn.bind(console);
var consoleError = console.error.bind(console);
var userAgentTrail = `octokit-core.js/${VERSION} ${(0, import_universal_user_agent.getUserAgent)()}`;
var Octokit = class {
    static{
        this.VERSION = VERSION;
    }
    static defaults(defaults) {
        const OctokitWithDefaults = class extends this {
            constructor(...args){
                const options = args[0] || {};
                if (typeof defaults === "function") {
                    super(defaults(options));
                    return;
                }
                super(Object.assign({}, defaults, options, options.userAgent && defaults.userAgent ? {
                    userAgent: `${options.userAgent} ${defaults.userAgent}`
                } : null));
            }
        };
        return OctokitWithDefaults;
    }
    static{
        this.plugins = [];
    }
    /**
   * Attach a plugin (or many) to your Octokit instance.
   *
   * @example
   * const API = Octokit.plugin(plugin1, plugin2, plugin3, ...)
   */ static plugin(...newPlugins) {
        const currentPlugins = this.plugins;
        const NewOctokit = class extends this {
            static{
                this.plugins = currentPlugins.concat(newPlugins.filter((plugin)=>!currentPlugins.includes(plugin)));
            }
        };
        return NewOctokit;
    }
    constructor(options = {}){
        const hook = new import_before_after_hook.Collection();
        const requestDefaults = {
            baseUrl: import_request.request.endpoint.DEFAULTS.baseUrl,
            headers: {},
            request: Object.assign({}, options.request, {
                // @ts-ignore internal usage only, no need to type
                hook: hook.bind(null, "request")
            }),
            mediaType: {
                previews: [],
                format: ""
            }
        };
        requestDefaults.headers["user-agent"] = options.userAgent ? `${options.userAgent} ${userAgentTrail}` : userAgentTrail;
        if (options.baseUrl) {
            requestDefaults.baseUrl = options.baseUrl;
        }
        if (options.previews) {
            requestDefaults.mediaType.previews = options.previews;
        }
        if (options.timeZone) {
            requestDefaults.headers["time-zone"] = options.timeZone;
        }
        this.request = import_request.request.defaults(requestDefaults);
        this.graphql = (0, import_graphql.withCustomRequest)(this.request).defaults(requestDefaults);
        this.log = Object.assign({
            debug: noop,
            info: noop,
            warn: consoleWarn,
            error: consoleError
        }, options.log);
        this.hook = hook;
        if (!options.authStrategy) {
            if (!options.auth) {
                this.auth = async ()=>({
                        type: "unauthenticated"
                    });
            } else {
                const auth = (0, import_auth_token.createTokenAuth)(options.auth);
                hook.wrap("request", auth.hook);
                this.auth = auth;
            }
        } else {
            const { authStrategy, ...otherOptions } = options;
            const auth = authStrategy(Object.assign({
                request: this.request,
                log: this.log,
                // we pass the current octokit instance as well as its constructor options
                // to allow for authentication strategies that return a new octokit instance
                // that shares the same internal state as the current one. The original
                // requirement for this was the "event-octokit" authentication strategy
                // of https://github.com/probot/octokit-auth-probot.
                octokit: this,
                octokitOptions: otherOptions
            }, options.auth));
            hook.wrap("request", auth.hook);
            this.auth = auth;
        }
        const classConstructor = this.constructor;
        for(let i = 0; i < classConstructor.plugins.length; ++i){
            Object.assign(this, classConstructor.plugins[i](this, options));
        }
    }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (0);


/***/ }),

/***/ 23277:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all)=>{
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = (to, from, except, desc)=>{
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
            get: ()=>from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
    return to;
};
var __toCommonJS = (mod)=>__copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
// pkg/dist-src/index.js
var dist_src_exports = {};
__export(dist_src_exports, {
    endpoint: ()=>endpoint
});
module.exports = __toCommonJS(dist_src_exports);
// pkg/dist-src/defaults.js
var import_universal_user_agent = __webpack_require__(33716);
// pkg/dist-src/version.js
var VERSION = "9.0.5";
// pkg/dist-src/defaults.js
var userAgent = `octokit-endpoint.js/${VERSION} ${(0, import_universal_user_agent.getUserAgent)()}`;
var DEFAULTS = {
    method: "GET",
    baseUrl: "https://api.github.com",
    headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": userAgent
    },
    mediaType: {
        format: ""
    }
};
// pkg/dist-src/util/lowercase-keys.js
function lowercaseKeys(object) {
    if (!object) {
        return {};
    }
    return Object.keys(object).reduce((newObj, key)=>{
        newObj[key.toLowerCase()] = object[key];
        return newObj;
    }, {});
}
// pkg/dist-src/util/is-plain-object.js
function isPlainObject(value) {
    if (typeof value !== "object" || value === null) return false;
    if (Object.prototype.toString.call(value) !== "[object Object]") return false;
    const proto = Object.getPrototypeOf(value);
    if (proto === null) return true;
    const Ctor = Object.prototype.hasOwnProperty.call(proto, "constructor") && proto.constructor;
    return typeof Ctor === "function" && Ctor instanceof Ctor && Function.prototype.call(Ctor) === Function.prototype.call(value);
}
// pkg/dist-src/util/merge-deep.js
function mergeDeep(defaults, options) {
    const result = Object.assign({}, defaults);
    Object.keys(options).forEach((key)=>{
        if (isPlainObject(options[key])) {
            if (!(key in defaults)) Object.assign(result, {
                [key]: options[key]
            });
            else result[key] = mergeDeep(defaults[key], options[key]);
        } else {
            Object.assign(result, {
                [key]: options[key]
            });
        }
    });
    return result;
}
// pkg/dist-src/util/remove-undefined-properties.js
function removeUndefinedProperties(obj) {
    for(const key in obj){
        if (obj[key] === void 0) {
            delete obj[key];
        }
    }
    return obj;
}
// pkg/dist-src/merge.js
function merge(defaults, route, options) {
    if (typeof route === "string") {
        let [method, url] = route.split(" ");
        options = Object.assign(url ? {
            method,
            url
        } : {
            url: method
        }, options);
    } else {
        options = Object.assign({}, route);
    }
    options.headers = lowercaseKeys(options.headers);
    removeUndefinedProperties(options);
    removeUndefinedProperties(options.headers);
    const mergedOptions = mergeDeep(defaults || {}, options);
    if (options.url === "/graphql") {
        if (defaults && defaults.mediaType.previews?.length) {
            mergedOptions.mediaType.previews = defaults.mediaType.previews.filter((preview)=>!mergedOptions.mediaType.previews.includes(preview)).concat(mergedOptions.mediaType.previews);
        }
        mergedOptions.mediaType.previews = (mergedOptions.mediaType.previews || []).map((preview)=>preview.replace(/-preview/, ""));
    }
    return mergedOptions;
}
// pkg/dist-src/util/add-query-parameters.js
function addQueryParameters(url, parameters) {
    const separator = /\?/.test(url) ? "&" : "?";
    const names = Object.keys(parameters);
    if (names.length === 0) {
        return url;
    }
    return url + separator + names.map((name)=>{
        if (name === "q") {
            return "q=" + parameters.q.split("+").map(encodeURIComponent).join("+");
        }
        return `${name}=${encodeURIComponent(parameters[name])}`;
    }).join("&");
}
// pkg/dist-src/util/extract-url-variable-names.js
var urlVariableRegex = /\{[^}]+\}/g;
function removeNonChars(variableName) {
    return variableName.replace(/^\W+|\W+$/g, "").split(/,/);
}
function extractUrlVariableNames(url) {
    const matches = url.match(urlVariableRegex);
    if (!matches) {
        return [];
    }
    return matches.map(removeNonChars).reduce((a, b)=>a.concat(b), []);
}
// pkg/dist-src/util/omit.js
function omit(object, keysToOmit) {
    const result = {
        __proto__: null
    };
    for (const key of Object.keys(object)){
        if (keysToOmit.indexOf(key) === -1) {
            result[key] = object[key];
        }
    }
    return result;
}
// pkg/dist-src/util/url-template.js
function encodeReserved(str) {
    return str.split(/(%[0-9A-Fa-f]{2})/g).map(function(part) {
        if (!/%[0-9A-Fa-f]/.test(part)) {
            part = encodeURI(part).replace(/%5B/g, "[").replace(/%5D/g, "]");
        }
        return part;
    }).join("");
}
function encodeUnreserved(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
        return "%" + c.charCodeAt(0).toString(16).toUpperCase();
    });
}
function encodeValue(operator, value, key) {
    value = operator === "+" || operator === "#" ? encodeReserved(value) : encodeUnreserved(value);
    if (key) {
        return encodeUnreserved(key) + "=" + value;
    } else {
        return value;
    }
}
function isDefined(value) {
    return value !== void 0 && value !== null;
}
function isKeyOperator(operator) {
    return operator === ";" || operator === "&" || operator === "?";
}
function getValues(context, operator, key, modifier) {
    var value = context[key], result = [];
    if (isDefined(value) && value !== "") {
        if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
            value = value.toString();
            if (modifier && modifier !== "*") {
                value = value.substring(0, parseInt(modifier, 10));
            }
            result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
        } else {
            if (modifier === "*") {
                if (Array.isArray(value)) {
                    value.filter(isDefined).forEach(function(value2) {
                        result.push(encodeValue(operator, value2, isKeyOperator(operator) ? key : ""));
                    });
                } else {
                    Object.keys(value).forEach(function(k) {
                        if (isDefined(value[k])) {
                            result.push(encodeValue(operator, value[k], k));
                        }
                    });
                }
            } else {
                const tmp = [];
                if (Array.isArray(value)) {
                    value.filter(isDefined).forEach(function(value2) {
                        tmp.push(encodeValue(operator, value2));
                    });
                } else {
                    Object.keys(value).forEach(function(k) {
                        if (isDefined(value[k])) {
                            tmp.push(encodeUnreserved(k));
                            tmp.push(encodeValue(operator, value[k].toString()));
                        }
                    });
                }
                if (isKeyOperator(operator)) {
                    result.push(encodeUnreserved(key) + "=" + tmp.join(","));
                } else if (tmp.length !== 0) {
                    result.push(tmp.join(","));
                }
            }
        }
    } else {
        if (operator === ";") {
            if (isDefined(value)) {
                result.push(encodeUnreserved(key));
            }
        } else if (value === "" && (operator === "&" || operator === "?")) {
            result.push(encodeUnreserved(key) + "=");
        } else if (value === "") {
            result.push("");
        }
    }
    return result;
}
function parseUrl(template) {
    return {
        expand: expand.bind(null, template)
    };
}
function expand(template, context) {
    var operators = [
        "+",
        "#",
        ".",
        "/",
        ";",
        "?",
        "&"
    ];
    template = template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function(_, expression, literal) {
        if (expression) {
            let operator = "";
            const values = [];
            if (operators.indexOf(expression.charAt(0)) !== -1) {
                operator = expression.charAt(0);
                expression = expression.substr(1);
            }
            expression.split(/,/g).forEach(function(variable) {
                var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
                values.push(getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
            });
            if (operator && operator !== "+") {
                var separator = ",";
                if (operator === "?") {
                    separator = "&";
                } else if (operator !== "#") {
                    separator = operator;
                }
                return (values.length !== 0 ? operator : "") + values.join(separator);
            } else {
                return values.join(",");
            }
        } else {
            return encodeReserved(literal);
        }
    });
    if (template === "/") {
        return template;
    } else {
        return template.replace(/\/$/, "");
    }
}
// pkg/dist-src/parse.js
function parse(options) {
    let method = options.method.toUpperCase();
    let url = (options.url || "/").replace(/:([a-z]\w+)/g, "{$1}");
    let headers = Object.assign({}, options.headers);
    let body;
    let parameters = omit(options, [
        "method",
        "baseUrl",
        "url",
        "headers",
        "request",
        "mediaType"
    ]);
    const urlVariableNames = extractUrlVariableNames(url);
    url = parseUrl(url).expand(parameters);
    if (!/^http/.test(url)) {
        url = options.baseUrl + url;
    }
    const omittedParameters = Object.keys(options).filter((option)=>urlVariableNames.includes(option)).concat("baseUrl");
    const remainingParameters = omit(parameters, omittedParameters);
    const isBinaryRequest = /application\/octet-stream/i.test(headers.accept);
    if (!isBinaryRequest) {
        if (options.mediaType.format) {
            headers.accept = headers.accept.split(/,/).map((format)=>format.replace(/application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/, `application/vnd$1$2.${options.mediaType.format}`)).join(",");
        }
        if (url.endsWith("/graphql")) {
            if (options.mediaType.previews?.length) {
                const previewsFromAcceptHeader = headers.accept.match(/[\w-]+(?=-preview)/g) || [];
                headers.accept = previewsFromAcceptHeader.concat(options.mediaType.previews).map((preview)=>{
                    const format = options.mediaType.format ? `.${options.mediaType.format}` : "+json";
                    return `application/vnd.github.${preview}-preview${format}`;
                }).join(",");
            }
        }
    }
    if ([
        "GET",
        "HEAD"
    ].includes(method)) {
        url = addQueryParameters(url, remainingParameters);
    } else {
        if ("data" in remainingParameters) {
            body = remainingParameters.data;
        } else {
            if (Object.keys(remainingParameters).length) {
                body = remainingParameters;
            }
        }
    }
    if (!headers["content-type"] && typeof body !== "undefined") {
        headers["content-type"] = "application/json; charset=utf-8";
    }
    if ([
        "PATCH",
        "PUT"
    ].includes(method) && typeof body === "undefined") {
        body = "";
    }
    return Object.assign({
        method,
        url,
        headers
    }, typeof body !== "undefined" ? {
        body
    } : null, options.request ? {
        request: options.request
    } : null);
}
// pkg/dist-src/endpoint-with-defaults.js
function endpointWithDefaults(defaults, route, options) {
    return parse(merge(defaults, route, options));
}
// pkg/dist-src/with-defaults.js
function withDefaults(oldDefaults, newDefaults) {
    const DEFAULTS2 = merge(oldDefaults, newDefaults);
    const endpoint2 = endpointWithDefaults.bind(null, DEFAULTS2);
    return Object.assign(endpoint2, {
        DEFAULTS: DEFAULTS2,
        defaults: withDefaults.bind(null, DEFAULTS2),
        merge: merge.bind(null, DEFAULTS2),
        parse
    });
}
// pkg/dist-src/index.js
var endpoint = withDefaults(null, DEFAULTS);
// Annotate the CommonJS export names for ESM import in node:
0 && (0);


/***/ }),

/***/ 16092:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all)=>{
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = (to, from, except, desc)=>{
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
            get: ()=>from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
    return to;
};
var __toCommonJS = (mod)=>__copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
// pkg/dist-src/index.js
var dist_src_exports = {};
__export(dist_src_exports, {
    GraphqlResponseError: ()=>GraphqlResponseError,
    graphql: ()=>graphql2,
    withCustomRequest: ()=>withCustomRequest
});
module.exports = __toCommonJS(dist_src_exports);
var import_request3 = __webpack_require__(4499);
var import_universal_user_agent = __webpack_require__(33716);
// pkg/dist-src/version.js
var VERSION = "7.1.0";
// pkg/dist-src/with-defaults.js
var import_request2 = __webpack_require__(4499);
// pkg/dist-src/graphql.js
var import_request = __webpack_require__(4499);
// pkg/dist-src/error.js
function _buildMessageForResponseErrors(data) {
    return `Request failed due to following response errors:
` + data.errors.map((e)=>` - ${e.message}`).join("\n");
}
var GraphqlResponseError = class extends Error {
    constructor(request2, headers, response){
        super(_buildMessageForResponseErrors(response));
        this.request = request2;
        this.headers = headers;
        this.response = response;
        this.name = "GraphqlResponseError";
        this.errors = response.errors;
        this.data = response.data;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
};
// pkg/dist-src/graphql.js
var NON_VARIABLE_OPTIONS = [
    "method",
    "baseUrl",
    "url",
    "headers",
    "request",
    "query",
    "mediaType"
];
var FORBIDDEN_VARIABLE_OPTIONS = [
    "query",
    "method",
    "url"
];
var GHES_V3_SUFFIX_REGEX = /\/api\/v3\/?$/;
function graphql(request2, query, options) {
    if (options) {
        if (typeof query === "string" && "query" in options) {
            return Promise.reject(new Error(`[@octokit/graphql] "query" cannot be used as variable name`));
        }
        for(const key in options){
            if (!FORBIDDEN_VARIABLE_OPTIONS.includes(key)) continue;
            return Promise.reject(new Error(`[@octokit/graphql] "${key}" cannot be used as variable name`));
        }
    }
    const parsedOptions = typeof query === "string" ? Object.assign({
        query
    }, options) : query;
    const requestOptions = Object.keys(parsedOptions).reduce((result, key)=>{
        if (NON_VARIABLE_OPTIONS.includes(key)) {
            result[key] = parsedOptions[key];
            return result;
        }
        if (!result.variables) {
            result.variables = {};
        }
        result.variables[key] = parsedOptions[key];
        return result;
    }, {});
    const baseUrl = parsedOptions.baseUrl || request2.endpoint.DEFAULTS.baseUrl;
    if (GHES_V3_SUFFIX_REGEX.test(baseUrl)) {
        requestOptions.url = baseUrl.replace(GHES_V3_SUFFIX_REGEX, "/api/graphql");
    }
    return request2(requestOptions).then((response)=>{
        if (response.data.errors) {
            const headers = {};
            for (const key of Object.keys(response.headers)){
                headers[key] = response.headers[key];
            }
            throw new GraphqlResponseError(requestOptions, headers, response.data);
        }
        return response.data.data;
    });
}
// pkg/dist-src/with-defaults.js
function withDefaults(request2, newDefaults) {
    const newRequest = request2.defaults(newDefaults);
    const newApi = (query, options)=>{
        return graphql(newRequest, query, options);
    };
    return Object.assign(newApi, {
        defaults: withDefaults.bind(null, newRequest),
        endpoint: newRequest.endpoint
    });
}
// pkg/dist-src/index.js
var graphql2 = withDefaults(import_request3.request, {
    headers: {
        "user-agent": `octokit-graphql.js/${VERSION} ${(0, import_universal_user_agent.getUserAgent)()}`
    },
    method: "POST",
    url: "/graphql"
});
function withCustomRequest(customRequest) {
    return withDefaults(customRequest, {
        method: "POST",
        url: "/graphql"
    });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (0);


/***/ }),

/***/ 55480:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all)=>{
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = (to, from, except, desc)=>{
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
            get: ()=>from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
    return to;
};
var __toESM = (mod, isNodeMode, target)=>(target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(// If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
        value: mod,
        enumerable: true
    }) : target, mod));
var __toCommonJS = (mod)=>__copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
// pkg/dist-src/index.js
var dist_src_exports = {};
__export(dist_src_exports, {
    OAuthApp: ()=>OAuthApp,
    createAWSLambdaAPIGatewayV2Handler: ()=>createAWSLambdaAPIGatewayV2Handler,
    createNodeMiddleware: ()=>createNodeMiddleware,
    createWebWorkerHandler: ()=>createWebWorkerHandler,
    handleRequest: ()=>handleRequest,
    sendNodeResponse: ()=>sendResponse,
    unknownRouteResponse: ()=>unknownRouteResponse
});
module.exports = __toCommonJS(dist_src_exports);
var import_auth_oauth_app = __webpack_require__(42789);
// pkg/dist-src/version.js
var VERSION = "6.1.0";
// pkg/dist-src/add-event-handler.js
function addEventHandler(state, eventName, eventHandler) {
    if (Array.isArray(eventName)) {
        for (const singleEventName of eventName){
            addEventHandler(state, singleEventName, eventHandler);
        }
        return;
    }
    if (!state.eventHandlers[eventName]) {
        state.eventHandlers[eventName] = [];
    }
    state.eventHandlers[eventName].push(eventHandler);
}
// pkg/dist-src/oauth-app-octokit.js
var import_core = __webpack_require__(4032);
var import_universal_user_agent = __webpack_require__(33716);
var OAuthAppOctokit = import_core.Octokit.defaults({
    userAgent: `octokit-oauth-app.js/${VERSION} ${(0, import_universal_user_agent.getUserAgent)()}`
});
// pkg/dist-src/methods/get-user-octokit.js
var import_auth_oauth_user = __webpack_require__(71113);
// pkg/dist-src/emit-event.js
async function emitEvent(state, context) {
    const { name, action } = context;
    if (state.eventHandlers[`${name}.${action}`]) {
        for (const eventHandler of state.eventHandlers[`${name}.${action}`]){
            await eventHandler(context);
        }
    }
    if (state.eventHandlers[name]) {
        for (const eventHandler of state.eventHandlers[name]){
            await eventHandler(context);
        }
    }
}
// pkg/dist-src/methods/get-user-octokit.js
async function getUserOctokitWithState(state, options) {
    return state.octokit.auth({
        type: "oauth-user",
        ...options,
        async factory (options2) {
            const octokit = new state.Octokit({
                authStrategy: import_auth_oauth_user.createOAuthUserAuth,
                auth: options2
            });
            const authentication = await octokit.auth({
                type: "get"
            });
            await emitEvent(state, {
                name: "token",
                action: "created",
                token: authentication.token,
                scopes: authentication.scopes,
                authentication,
                octokit
            });
            return octokit;
        }
    });
}
// pkg/dist-src/methods/get-web-flow-authorization-url.js
var OAuthMethods = __toESM(__webpack_require__(34553));
function getWebFlowAuthorizationUrlWithState(state, options) {
    const optionsWithDefaults = {
        clientId: state.clientId,
        request: state.octokit.request,
        ...options,
        allowSignup: state.allowSignup ?? options.allowSignup,
        redirectUrl: options.redirectUrl ?? state.redirectUrl,
        scopes: options.scopes ?? state.defaultScopes
    };
    return OAuthMethods.getWebFlowAuthorizationUrl({
        clientType: state.clientType,
        ...optionsWithDefaults
    });
}
// pkg/dist-src/methods/create-token.js
var OAuthAppAuth = __toESM(__webpack_require__(42789));
async function createTokenWithState(state, options) {
    const authentication = await state.octokit.auth({
        type: "oauth-user",
        ...options
    });
    await emitEvent(state, {
        name: "token",
        action: "created",
        token: authentication.token,
        scopes: authentication.scopes,
        authentication,
        octokit: new state.Octokit({
            authStrategy: OAuthAppAuth.createOAuthUserAuth,
            auth: {
                clientType: state.clientType,
                clientId: state.clientId,
                clientSecret: state.clientSecret,
                token: authentication.token,
                scopes: authentication.scopes,
                refreshToken: authentication.refreshToken,
                expiresAt: authentication.expiresAt,
                refreshTokenExpiresAt: authentication.refreshTokenExpiresAt
            }
        })
    });
    return {
        authentication
    };
}
// pkg/dist-src/methods/check-token.js
var OAuthMethods2 = __toESM(__webpack_require__(34553));
async function checkTokenWithState(state, options) {
    const result = await OAuthMethods2.checkToken({
        // @ts-expect-error not worth the extra code to appease TS
        clientType: state.clientType,
        clientId: state.clientId,
        clientSecret: state.clientSecret,
        request: state.octokit.request,
        ...options
    });
    Object.assign(result.authentication, {
        type: "token",
        tokenType: "oauth"
    });
    return result;
}
// pkg/dist-src/methods/reset-token.js
var OAuthMethods3 = __toESM(__webpack_require__(34553));
var import_auth_oauth_user2 = __webpack_require__(71113);
async function resetTokenWithState(state, options) {
    const optionsWithDefaults = {
        clientId: state.clientId,
        clientSecret: state.clientSecret,
        request: state.octokit.request,
        ...options
    };
    if (state.clientType === "oauth-app") {
        const response2 = await OAuthMethods3.resetToken({
            clientType: "oauth-app",
            ...optionsWithDefaults
        });
        const authentication2 = Object.assign(response2.authentication, {
            type: "token",
            tokenType: "oauth"
        });
        await emitEvent(state, {
            name: "token",
            action: "reset",
            token: response2.authentication.token,
            scopes: response2.authentication.scopes || void 0,
            authentication: authentication2,
            octokit: new state.Octokit({
                authStrategy: import_auth_oauth_user2.createOAuthUserAuth,
                auth: {
                    clientType: state.clientType,
                    clientId: state.clientId,
                    clientSecret: state.clientSecret,
                    token: response2.authentication.token,
                    scopes: response2.authentication.scopes
                }
            })
        });
        return {
            ...response2,
            authentication: authentication2
        };
    }
    const response = await OAuthMethods3.resetToken({
        clientType: "github-app",
        ...optionsWithDefaults
    });
    const authentication = Object.assign(response.authentication, {
        type: "token",
        tokenType: "oauth"
    });
    await emitEvent(state, {
        name: "token",
        action: "reset",
        token: response.authentication.token,
        authentication,
        octokit: new state.Octokit({
            authStrategy: import_auth_oauth_user2.createOAuthUserAuth,
            auth: {
                clientType: state.clientType,
                clientId: state.clientId,
                clientSecret: state.clientSecret,
                token: response.authentication.token
            }
        })
    });
    return {
        ...response,
        authentication
    };
}
// pkg/dist-src/methods/refresh-token.js
var OAuthMethods4 = __toESM(__webpack_require__(34553));
var import_auth_oauth_user3 = __webpack_require__(71113);
async function refreshTokenWithState(state, options) {
    if (state.clientType === "oauth-app") {
        throw new Error("[@octokit/oauth-app] app.refreshToken() is not supported for OAuth Apps");
    }
    const response = await OAuthMethods4.refreshToken({
        clientType: "github-app",
        clientId: state.clientId,
        clientSecret: state.clientSecret,
        request: state.octokit.request,
        refreshToken: options.refreshToken
    });
    const authentication = Object.assign(response.authentication, {
        type: "token",
        tokenType: "oauth"
    });
    await emitEvent(state, {
        name: "token",
        action: "refreshed",
        token: response.authentication.token,
        authentication,
        octokit: new state.Octokit({
            authStrategy: import_auth_oauth_user3.createOAuthUserAuth,
            auth: {
                clientType: state.clientType,
                clientId: state.clientId,
                clientSecret: state.clientSecret,
                token: response.authentication.token
            }
        })
    });
    return {
        ...response,
        authentication
    };
}
// pkg/dist-src/methods/scope-token.js
var OAuthMethods5 = __toESM(__webpack_require__(34553));
var import_auth_oauth_user4 = __webpack_require__(71113);
async function scopeTokenWithState(state, options) {
    if (state.clientType === "oauth-app") {
        throw new Error("[@octokit/oauth-app] app.scopeToken() is not supported for OAuth Apps");
    }
    const response = await OAuthMethods5.scopeToken({
        clientType: "github-app",
        clientId: state.clientId,
        clientSecret: state.clientSecret,
        request: state.octokit.request,
        ...options
    });
    const authentication = Object.assign(response.authentication, {
        type: "token",
        tokenType: "oauth"
    });
    await emitEvent(state, {
        name: "token",
        action: "scoped",
        token: response.authentication.token,
        authentication,
        octokit: new state.Octokit({
            authStrategy: import_auth_oauth_user4.createOAuthUserAuth,
            auth: {
                clientType: state.clientType,
                clientId: state.clientId,
                clientSecret: state.clientSecret,
                token: response.authentication.token
            }
        })
    });
    return {
        ...response,
        authentication
    };
}
// pkg/dist-src/methods/delete-token.js
var OAuthMethods6 = __toESM(__webpack_require__(34553));
var import_auth_unauthenticated = __webpack_require__(87410);
async function deleteTokenWithState(state, options) {
    const optionsWithDefaults = {
        clientId: state.clientId,
        clientSecret: state.clientSecret,
        request: state.octokit.request,
        ...options
    };
    const response = state.clientType === "oauth-app" ? await OAuthMethods6.deleteToken({
        clientType: "oauth-app",
        ...optionsWithDefaults
    }) : // istanbul ignore next
    await OAuthMethods6.deleteToken({
        clientType: "github-app",
        ...optionsWithDefaults
    });
    await emitEvent(state, {
        name: "token",
        action: "deleted",
        token: options.token,
        octokit: new state.Octokit({
            authStrategy: import_auth_unauthenticated.createUnauthenticatedAuth,
            auth: {
                reason: `Handling "token.deleted" event. The access for the token has been revoked.`
            }
        })
    });
    return response;
}
// pkg/dist-src/methods/delete-authorization.js
var OAuthMethods7 = __toESM(__webpack_require__(34553));
var import_auth_unauthenticated2 = __webpack_require__(87410);
async function deleteAuthorizationWithState(state, options) {
    const optionsWithDefaults = {
        clientId: state.clientId,
        clientSecret: state.clientSecret,
        request: state.octokit.request,
        ...options
    };
    const response = state.clientType === "oauth-app" ? await OAuthMethods7.deleteAuthorization({
        clientType: "oauth-app",
        ...optionsWithDefaults
    }) : // istanbul ignore next
    await OAuthMethods7.deleteAuthorization({
        clientType: "github-app",
        ...optionsWithDefaults
    });
    await emitEvent(state, {
        name: "token",
        action: "deleted",
        token: options.token,
        octokit: new state.Octokit({
            authStrategy: import_auth_unauthenticated2.createUnauthenticatedAuth,
            auth: {
                reason: `Handling "token.deleted" event. The access for the token has been revoked.`
            }
        })
    });
    await emitEvent(state, {
        name: "authorization",
        action: "deleted",
        token: options.token,
        octokit: new state.Octokit({
            authStrategy: import_auth_unauthenticated2.createUnauthenticatedAuth,
            auth: {
                reason: `Handling "authorization.deleted" event. The access for the app has been revoked.`
            }
        })
    });
    return response;
}
// pkg/dist-src/middleware/unknown-route-response.js
function unknownRouteResponse(request) {
    return {
        status: 404,
        headers: {
            "content-type": "application/json"
        },
        text: JSON.stringify({
            error: `Unknown route: ${request.method} ${request.url}`
        })
    };
}
// pkg/dist-src/middleware/handle-request.js
async function handleRequest(app, { pathPrefix = "/api/github/oauth" }, request) {
    if (request.method === "OPTIONS") {
        return {
            status: 200,
            headers: {
                "access-control-allow-origin": "*",
                "access-control-allow-methods": "*",
                "access-control-allow-headers": "Content-Type, User-Agent, Authorization"
            }
        };
    }
    let { pathname } = new URL(request.url, "http://localhost");
    if (!pathname.startsWith(`${pathPrefix}/`)) {
        return void 0;
    }
    pathname = pathname.slice(pathPrefix.length + 1);
    const route = [
        request.method,
        pathname
    ].join(" ");
    const routes = {
        getLogin: `GET login`,
        getCallback: `GET callback`,
        createToken: `POST token`,
        getToken: `GET token`,
        patchToken: `PATCH token`,
        patchRefreshToken: `PATCH refresh-token`,
        scopeToken: `POST token/scoped`,
        deleteToken: `DELETE token`,
        deleteGrant: `DELETE grant`
    };
    if (!Object.values(routes).includes(route)) {
        return unknownRouteResponse(request);
    }
    let json;
    try {
        const text = await request.text();
        json = text ? JSON.parse(text) : {};
    } catch (error) {
        return {
            status: 400,
            headers: {
                "content-type": "application/json",
                "access-control-allow-origin": "*"
            },
            text: JSON.stringify({
                error: "[@octokit/oauth-app] request error"
            })
        };
    }
    const { searchParams } = new URL(request.url, "http://localhost");
    const query = Object.fromEntries(searchParams);
    const headers = request.headers;
    try {
        if (route === routes.getLogin) {
            const { url } = app.getWebFlowAuthorizationUrl({
                state: query.state,
                scopes: query.scopes ? query.scopes.split(",") : void 0,
                allowSignup: query.allowSignup ? query.allowSignup === "true" : void 0,
                redirectUrl: query.redirectUrl
            });
            return {
                status: 302,
                headers: {
                    location: url
                }
            };
        }
        if (route === routes.getCallback) {
            if (query.error) {
                throw new Error(`[@octokit/oauth-app] ${query.error} ${query.error_description}`);
            }
            if (!query.code) {
                throw new Error('[@octokit/oauth-app] "code" parameter is required');
            }
            const { authentication: { token: token2 } } = await app.createToken({
                code: query.code
            });
            return {
                status: 200,
                headers: {
                    "content-type": "text/html"
                },
                text: `<h1>Token created successfully</h1>

<p>Your token is: <strong>${token2}</strong>. Copy it now as it cannot be shown again.</p>`
            };
        }
        if (route === routes.createToken) {
            const { code, redirectUrl } = json;
            if (!code) {
                throw new Error('[@octokit/oauth-app] "code" parameter is required');
            }
            const result = await app.createToken({
                code,
                redirectUrl
            });
            delete result.authentication.clientSecret;
            return {
                status: 201,
                headers: {
                    "content-type": "application/json",
                    "access-control-allow-origin": "*"
                },
                text: JSON.stringify(result)
            };
        }
        if (route === routes.getToken) {
            const token2 = headers.authorization?.substr("token ".length);
            if (!token2) {
                throw new Error('[@octokit/oauth-app] "Authorization" header is required');
            }
            const result = await app.checkToken({
                token: token2
            });
            delete result.authentication.clientSecret;
            return {
                status: 200,
                headers: {
                    "content-type": "application/json",
                    "access-control-allow-origin": "*"
                },
                text: JSON.stringify(result)
            };
        }
        if (route === routes.patchToken) {
            const token2 = headers.authorization?.substr("token ".length);
            if (!token2) {
                throw new Error('[@octokit/oauth-app] "Authorization" header is required');
            }
            const result = await app.resetToken({
                token: token2
            });
            delete result.authentication.clientSecret;
            return {
                status: 200,
                headers: {
                    "content-type": "application/json",
                    "access-control-allow-origin": "*"
                },
                text: JSON.stringify(result)
            };
        }
        if (route === routes.patchRefreshToken) {
            const token2 = headers.authorization?.substr("token ".length);
            if (!token2) {
                throw new Error('[@octokit/oauth-app] "Authorization" header is required');
            }
            const { refreshToken: refreshToken2 } = json;
            if (!refreshToken2) {
                throw new Error("[@octokit/oauth-app] refreshToken must be sent in request body");
            }
            const result = await app.refreshToken({
                refreshToken: refreshToken2
            });
            delete result.authentication.clientSecret;
            return {
                status: 200,
                headers: {
                    "content-type": "application/json",
                    "access-control-allow-origin": "*"
                },
                text: JSON.stringify(result)
            };
        }
        if (route === routes.scopeToken) {
            const token2 = headers.authorization?.substr("token ".length);
            if (!token2) {
                throw new Error('[@octokit/oauth-app] "Authorization" header is required');
            }
            const result = await app.scopeToken({
                token: token2,
                ...json
            });
            delete result.authentication.clientSecret;
            return {
                status: 200,
                headers: {
                    "content-type": "application/json",
                    "access-control-allow-origin": "*"
                },
                text: JSON.stringify(result)
            };
        }
        if (route === routes.deleteToken) {
            const token2 = headers.authorization?.substr("token ".length);
            if (!token2) {
                throw new Error('[@octokit/oauth-app] "Authorization" header is required');
            }
            await app.deleteToken({
                token: token2
            });
            return {
                status: 204,
                headers: {
                    "access-control-allow-origin": "*"
                }
            };
        }
        const token = headers.authorization?.substr("token ".length);
        if (!token) {
            throw new Error('[@octokit/oauth-app] "Authorization" header is required');
        }
        await app.deleteAuthorization({
            token
        });
        return {
            status: 204,
            headers: {
                "access-control-allow-origin": "*"
            }
        };
    } catch (error) {
        return {
            status: 400,
            headers: {
                "content-type": "application/json",
                "access-control-allow-origin": "*"
            },
            text: JSON.stringify({
                error: error.message
            })
        };
    }
}
// pkg/dist-src/middleware/node/parse-request.js
function parseRequest(request) {
    const { method, url, headers } = request;
    async function text() {
        const text2 = await new Promise((resolve, reject)=>{
            let bodyChunks = [];
            request.on("error", reject).on("data", (chunk)=>bodyChunks.push(chunk)).on("end", ()=>resolve(Buffer.concat(bodyChunks).toString()));
        });
        return text2;
    }
    return {
        method,
        url,
        headers,
        text
    };
}
// pkg/dist-src/middleware/node/send-response.js
function sendResponse(octokitResponse, response) {
    response.writeHead(octokitResponse.status, octokitResponse.headers);
    response.end(octokitResponse.text);
}
// pkg/dist-src/middleware/node/index.js
function createNodeMiddleware(app, options = {}) {
    return async function(request, response, next) {
        const octokitRequest = await parseRequest(request);
        const octokitResponse = await handleRequest(app, options, octokitRequest);
        if (octokitResponse) {
            sendResponse(octokitResponse, response);
            return true;
        } else {
            next?.();
            return false;
        }
    };
}
// pkg/dist-src/middleware/web-worker/parse-request.js
function parseRequest2(request) {
    const headers = Object.fromEntries(request.headers.entries());
    return {
        method: request.method,
        url: request.url,
        headers,
        text: ()=>request.text()
    };
}
// pkg/dist-src/middleware/web-worker/send-response.js
function sendResponse2(octokitResponse) {
    return new Response(octokitResponse.text, {
        status: octokitResponse.status,
        headers: octokitResponse.headers
    });
}
// pkg/dist-src/middleware/web-worker/index.js
function createWebWorkerHandler(app, options = {}) {
    return async function(request) {
        const octokitRequest = await parseRequest2(request);
        const octokitResponse = await handleRequest(app, options, octokitRequest);
        return octokitResponse ? sendResponse2(octokitResponse) : void 0;
    };
}
// pkg/dist-src/middleware/aws-lambda/api-gateway-v2-parse-request.js
function parseRequest3(request) {
    const { method } = request.requestContext.http;
    let url = request.rawPath;
    const { stage } = request.requestContext;
    if (url.startsWith("/" + stage)) url = url.substring(stage.length + 1);
    if (request.rawQueryString) url += "?" + request.rawQueryString;
    const headers = request.headers;
    const text = async ()=>request.body || "";
    return {
        method,
        url,
        headers,
        text
    };
}
// pkg/dist-src/middleware/aws-lambda/api-gateway-v2-send-response.js
function sendResponse3(octokitResponse) {
    return {
        statusCode: octokitResponse.status,
        headers: octokitResponse.headers,
        body: octokitResponse.text
    };
}
// pkg/dist-src/middleware/aws-lambda/api-gateway-v2.js
function createAWSLambdaAPIGatewayV2Handler(app, options = {}) {
    return async function(event) {
        const request = parseRequest3(event);
        const response = await handleRequest(app, options, request);
        return response ? sendResponse3(response) : void 0;
    };
}
// pkg/dist-src/index.js
var OAuthApp = class {
    static{
        this.VERSION = VERSION;
    }
    static defaults(defaults) {
        const OAuthAppWithDefaults = class extends this {
            constructor(...args){
                super({
                    ...defaults,
                    ...args[0]
                });
            }
        };
        return OAuthAppWithDefaults;
    }
    constructor(options){
        const Octokit2 = options.Octokit || OAuthAppOctokit;
        this.type = options.clientType || "oauth-app";
        const octokit = new Octokit2({
            authStrategy: import_auth_oauth_app.createOAuthAppAuth,
            auth: {
                clientType: this.type,
                clientId: options.clientId,
                clientSecret: options.clientSecret
            }
        });
        const state = {
            clientType: this.type,
            clientId: options.clientId,
            clientSecret: options.clientSecret,
            // @ts-expect-error defaultScopes not permitted for GitHub Apps
            defaultScopes: options.defaultScopes || [],
            allowSignup: options.allowSignup,
            baseUrl: options.baseUrl,
            redirectUrl: options.redirectUrl,
            log: options.log,
            Octokit: Octokit2,
            octokit,
            eventHandlers: {}
        };
        this.on = addEventHandler.bind(null, state);
        this.octokit = octokit;
        this.getUserOctokit = getUserOctokitWithState.bind(null, state);
        this.getWebFlowAuthorizationUrl = getWebFlowAuthorizationUrlWithState.bind(null, state);
        this.createToken = createTokenWithState.bind(null, state);
        this.checkToken = checkTokenWithState.bind(null, state);
        this.resetToken = resetTokenWithState.bind(null, state);
        this.refreshToken = refreshTokenWithState.bind(null, state);
        this.scopeToken = scopeTokenWithState.bind(null, state);
        this.deleteToken = deleteTokenWithState.bind(null, state);
        this.deleteAuthorization = deleteAuthorizationWithState.bind(null, state);
    }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (0);


/***/ }),

/***/ 69916:
/***/ ((module) => {

"use strict";

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all)=>{
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = (to, from, except, desc)=>{
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
            get: ()=>from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
    return to;
};
var __toCommonJS = (mod)=>__copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
// pkg/dist-src/index.js
var dist_src_exports = {};
__export(dist_src_exports, {
    oauthAuthorizationUrl: ()=>oauthAuthorizationUrl
});
module.exports = __toCommonJS(dist_src_exports);
function oauthAuthorizationUrl(options) {
    const clientType = options.clientType || "oauth-app";
    const baseUrl = options.baseUrl || "https://github.com";
    const result = {
        clientType,
        allowSignup: options.allowSignup === false ? false : true,
        clientId: options.clientId,
        login: options.login || null,
        redirectUrl: options.redirectUrl || null,
        state: options.state || Math.random().toString(36).substr(2),
        url: ""
    };
    if (clientType === "oauth-app") {
        const scopes = "scopes" in options ? options.scopes : [];
        result.scopes = typeof scopes === "string" ? scopes.split(/[,\s]+/).filter(Boolean) : scopes;
    }
    result.url = urlBuilderAuthorize(`${baseUrl}/login/oauth/authorize`, result);
    return result;
}
function urlBuilderAuthorize(base, options) {
    const map = {
        allowSignup: "allow_signup",
        clientId: "client_id",
        login: "login",
        redirectUrl: "redirect_uri",
        scopes: "scope",
        state: "state"
    };
    let url = base;
    Object.keys(map).filter((k)=>options[k] !== null).filter((k)=>{
        if (k !== "scopes") return true;
        if (options.clientType === "github-app") return false;
        return !Array.isArray(options[k]) || options[k].length > 0;
    }).map((key)=>[
            map[key],
            `${options[key]}`
        ]).forEach(([key, value], index)=>{
        url += index === 0 ? `?` : "&";
        url += `${key}=${encodeURIComponent(value)}`;
    });
    return url;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (0);


/***/ }),

/***/ 34553:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all)=>{
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = (to, from, except, desc)=>{
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
            get: ()=>from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
    return to;
};
var __toESM = (mod, isNodeMode, target)=>(target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(// If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
        value: mod,
        enumerable: true
    }) : target, mod));
var __toCommonJS = (mod)=>__copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
// pkg/dist-src/index.js
var dist_src_exports = {};
__export(dist_src_exports, {
    VERSION: ()=>VERSION,
    checkToken: ()=>checkToken,
    createDeviceCode: ()=>createDeviceCode,
    deleteAuthorization: ()=>deleteAuthorization,
    deleteToken: ()=>deleteToken,
    exchangeDeviceCode: ()=>exchangeDeviceCode,
    exchangeWebFlowCode: ()=>exchangeWebFlowCode,
    getWebFlowAuthorizationUrl: ()=>getWebFlowAuthorizationUrl,
    refreshToken: ()=>refreshToken,
    resetToken: ()=>resetToken,
    scopeToken: ()=>scopeToken
});
module.exports = __toCommonJS(dist_src_exports);
// pkg/dist-src/version.js
var VERSION = "4.1.0";
// pkg/dist-src/get-web-flow-authorization-url.js
var import_oauth_authorization_url = __webpack_require__(69916);
var import_request = __webpack_require__(4499);
// pkg/dist-src/utils.js
var import_request_error = __webpack_require__(32806);
function requestToOAuthBaseUrl(request) {
    const endpointDefaults = request.endpoint.DEFAULTS;
    return /^https:\/\/(api\.)?github\.com$/.test(endpointDefaults.baseUrl) ? "https://github.com" : endpointDefaults.baseUrl.replace("/api/v3", "");
}
async function oauthRequest(request, route, parameters) {
    const withOAuthParameters = {
        baseUrl: requestToOAuthBaseUrl(request),
        headers: {
            accept: "application/json"
        },
        ...parameters
    };
    const response = await request(route, withOAuthParameters);
    if ("error" in response.data) {
        const error = new import_request_error.RequestError(`${response.data.error_description} (${response.data.error}, ${response.data.error_uri})`, 400, {
            request: request.endpoint.merge(route, withOAuthParameters),
            headers: response.headers
        });
        error.response = response;
        throw error;
    }
    return response;
}
// pkg/dist-src/get-web-flow-authorization-url.js
function getWebFlowAuthorizationUrl({ request = import_request.request, ...options }) {
    const baseUrl = requestToOAuthBaseUrl(request);
    return (0, import_oauth_authorization_url.oauthAuthorizationUrl)({
        ...options,
        baseUrl
    });
}
// pkg/dist-src/exchange-web-flow-code.js
var import_request2 = __webpack_require__(4499);
async function exchangeWebFlowCode(options) {
    const request = options.request || /* istanbul ignore next: we always pass a custom request in tests */ import_request2.request;
    const response = await oauthRequest(request, "POST /login/oauth/access_token", {
        client_id: options.clientId,
        client_secret: options.clientSecret,
        code: options.code,
        redirect_uri: options.redirectUrl
    });
    const authentication = {
        clientType: options.clientType,
        clientId: options.clientId,
        clientSecret: options.clientSecret,
        token: response.data.access_token,
        scopes: response.data.scope.split(/\s+/).filter(Boolean)
    };
    if (options.clientType === "github-app") {
        if ("refresh_token" in response.data) {
            const apiTimeInMs = new Date(response.headers.date).getTime();
            authentication.refreshToken = response.data.refresh_token, authentication.expiresAt = toTimestamp(apiTimeInMs, response.data.expires_in), authentication.refreshTokenExpiresAt = toTimestamp(apiTimeInMs, response.data.refresh_token_expires_in);
        }
        delete authentication.scopes;
    }
    return {
        ...response,
        authentication
    };
}
function toTimestamp(apiTimeInMs, expirationInSeconds) {
    return new Date(apiTimeInMs + expirationInSeconds * 1e3).toISOString();
}
// pkg/dist-src/create-device-code.js
var import_request3 = __webpack_require__(4499);
async function createDeviceCode(options) {
    const request = options.request || /* istanbul ignore next: we always pass a custom request in tests */ import_request3.request;
    const parameters = {
        client_id: options.clientId
    };
    if ("scopes" in options && Array.isArray(options.scopes)) {
        parameters.scope = options.scopes.join(" ");
    }
    return oauthRequest(request, "POST /login/device/code", parameters);
}
// pkg/dist-src/exchange-device-code.js
var import_request4 = __webpack_require__(4499);
async function exchangeDeviceCode(options) {
    const request = options.request || /* istanbul ignore next: we always pass a custom request in tests */ import_request4.request;
    const response = await oauthRequest(request, "POST /login/oauth/access_token", {
        client_id: options.clientId,
        device_code: options.code,
        grant_type: "urn:ietf:params:oauth:grant-type:device_code"
    });
    const authentication = {
        clientType: options.clientType,
        clientId: options.clientId,
        token: response.data.access_token,
        scopes: response.data.scope.split(/\s+/).filter(Boolean)
    };
    if ("clientSecret" in options) {
        authentication.clientSecret = options.clientSecret;
    }
    if (options.clientType === "github-app") {
        if ("refresh_token" in response.data) {
            const apiTimeInMs = new Date(response.headers.date).getTime();
            authentication.refreshToken = response.data.refresh_token, authentication.expiresAt = toTimestamp2(apiTimeInMs, response.data.expires_in), authentication.refreshTokenExpiresAt = toTimestamp2(apiTimeInMs, response.data.refresh_token_expires_in);
        }
        delete authentication.scopes;
    }
    return {
        ...response,
        authentication
    };
}
function toTimestamp2(apiTimeInMs, expirationInSeconds) {
    return new Date(apiTimeInMs + expirationInSeconds * 1e3).toISOString();
}
// pkg/dist-src/check-token.js
var import_request5 = __webpack_require__(4499);
var import_btoa_lite = __toESM(__webpack_require__(95000));
async function checkToken(options) {
    const request = options.request || /* istanbul ignore next: we always pass a custom request in tests */ import_request5.request;
    const response = await request("POST /applications/{client_id}/token", {
        headers: {
            authorization: `basic ${(0, import_btoa_lite.default)(`${options.clientId}:${options.clientSecret}`)}`
        },
        client_id: options.clientId,
        access_token: options.token
    });
    const authentication = {
        clientType: options.clientType,
        clientId: options.clientId,
        clientSecret: options.clientSecret,
        token: options.token,
        scopes: response.data.scopes
    };
    if (response.data.expires_at) authentication.expiresAt = response.data.expires_at;
    if (options.clientType === "github-app") {
        delete authentication.scopes;
    }
    return {
        ...response,
        authentication
    };
}
// pkg/dist-src/refresh-token.js
var import_request6 = __webpack_require__(4499);
async function refreshToken(options) {
    const request = options.request || /* istanbul ignore next: we always pass a custom request in tests */ import_request6.request;
    const response = await oauthRequest(request, "POST /login/oauth/access_token", {
        client_id: options.clientId,
        client_secret: options.clientSecret,
        grant_type: "refresh_token",
        refresh_token: options.refreshToken
    });
    const apiTimeInMs = new Date(response.headers.date).getTime();
    const authentication = {
        clientType: "github-app",
        clientId: options.clientId,
        clientSecret: options.clientSecret,
        token: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresAt: toTimestamp3(apiTimeInMs, response.data.expires_in),
        refreshTokenExpiresAt: toTimestamp3(apiTimeInMs, response.data.refresh_token_expires_in)
    };
    return {
        ...response,
        authentication
    };
}
function toTimestamp3(apiTimeInMs, expirationInSeconds) {
    return new Date(apiTimeInMs + expirationInSeconds * 1e3).toISOString();
}
// pkg/dist-src/scope-token.js
var import_request7 = __webpack_require__(4499);
var import_btoa_lite2 = __toESM(__webpack_require__(95000));
async function scopeToken(options) {
    const { request: optionsRequest, clientType, clientId, clientSecret, token, ...requestOptions } = options;
    const request = optionsRequest || /* istanbul ignore next: we always pass a custom request in tests */ import_request7.request;
    const response = await request("POST /applications/{client_id}/token/scoped", {
        headers: {
            authorization: `basic ${(0, import_btoa_lite2.default)(`${clientId}:${clientSecret}`)}`
        },
        client_id: clientId,
        access_token: token,
        ...requestOptions
    });
    const authentication = Object.assign({
        clientType,
        clientId,
        clientSecret,
        token: response.data.token
    }, response.data.expires_at ? {
        expiresAt: response.data.expires_at
    } : {});
    return {
        ...response,
        authentication
    };
}
// pkg/dist-src/reset-token.js
var import_request8 = __webpack_require__(4499);
var import_btoa_lite3 = __toESM(__webpack_require__(95000));
async function resetToken(options) {
    const request = options.request || /* istanbul ignore next: we always pass a custom request in tests */ import_request8.request;
    const auth = (0, import_btoa_lite3.default)(`${options.clientId}:${options.clientSecret}`);
    const response = await request("PATCH /applications/{client_id}/token", {
        headers: {
            authorization: `basic ${auth}`
        },
        client_id: options.clientId,
        access_token: options.token
    });
    const authentication = {
        clientType: options.clientType,
        clientId: options.clientId,
        clientSecret: options.clientSecret,
        token: response.data.token,
        scopes: response.data.scopes
    };
    if (response.data.expires_at) authentication.expiresAt = response.data.expires_at;
    if (options.clientType === "github-app") {
        delete authentication.scopes;
    }
    return {
        ...response,
        authentication
    };
}
// pkg/dist-src/delete-token.js
var import_request9 = __webpack_require__(4499);
var import_btoa_lite4 = __toESM(__webpack_require__(95000));
async function deleteToken(options) {
    const request = options.request || /* istanbul ignore next: we always pass a custom request in tests */ import_request9.request;
    const auth = (0, import_btoa_lite4.default)(`${options.clientId}:${options.clientSecret}`);
    return request("DELETE /applications/{client_id}/token", {
        headers: {
            authorization: `basic ${auth}`
        },
        client_id: options.clientId,
        access_token: options.token
    });
}
// pkg/dist-src/delete-authorization.js
var import_request10 = __webpack_require__(4499);
var import_btoa_lite5 = __toESM(__webpack_require__(95000));
async function deleteAuthorization(options) {
    const request = options.request || /* istanbul ignore next: we always pass a custom request in tests */ import_request10.request;
    const auth = (0, import_btoa_lite5.default)(`${options.clientId}:${options.clientSecret}`);
    return request("DELETE /applications/{client_id}/grant", {
        headers: {
            authorization: `basic ${auth}`
        },
        client_id: options.clientId,
        access_token: options.token
    });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (0);


/***/ }),

/***/ 51499:
/***/ ((module) => {

"use strict";

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all)=>{
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = (to, from, except, desc)=>{
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
            get: ()=>from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
    return to;
};
var __toCommonJS = (mod)=>__copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
// pkg/dist-src/index.js
var dist_src_exports = {};
__export(dist_src_exports, {
    paginateGraphql: ()=>paginateGraphql
});
module.exports = __toCommonJS(dist_src_exports);
// pkg/dist-src/errors.js
var generateMessage = (path, cursorValue)=>`The cursor at "${path.join(",")}" did not change its value "${cursorValue}" after a page transition. Please make sure your that your query is set up correctly.`;
var MissingCursorChange = class extends Error {
    constructor(pageInfo, cursorValue){
        super(generateMessage(pageInfo.pathInQuery, cursorValue));
        this.pageInfo = pageInfo;
        this.cursorValue = cursorValue;
        this.name = "MissingCursorChangeError";
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
};
var MissingPageInfo = class extends Error {
    constructor(response){
        super(`No pageInfo property found in response. Please make sure to specify the pageInfo in your query. Response-Data: ${JSON.stringify(response, null, 2)}`);
        this.response = response;
        this.name = "MissingPageInfo";
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
};
// pkg/dist-src/object-helpers.js
var isObject = (value)=>Object.prototype.toString.call(value) === "[object Object]";
function findPaginatedResourcePath(responseData) {
    const paginatedResourcePath = deepFindPathToProperty(responseData, "pageInfo");
    if (paginatedResourcePath.length === 0) {
        throw new MissingPageInfo(responseData);
    }
    return paginatedResourcePath;
}
var deepFindPathToProperty = (object, searchProp, path = [])=>{
    for (const key of Object.keys(object)){
        const currentPath = [
            ...path,
            key
        ];
        const currentValue = object[key];
        if (currentValue.hasOwnProperty(searchProp)) {
            return currentPath;
        }
        if (isObject(currentValue)) {
            const result = deepFindPathToProperty(currentValue, searchProp, currentPath);
            if (result.length > 0) {
                return result;
            }
        }
    }
    return [];
};
var get = (object, path)=>{
    return path.reduce((current, nextProperty)=>current[nextProperty], object);
};
var set = (object, path, mutator)=>{
    const lastProperty = path[path.length - 1];
    const parentPath = [
        ...path
    ].slice(0, -1);
    const parent = get(object, parentPath);
    if (typeof mutator === "function") {
        parent[lastProperty] = mutator(parent[lastProperty]);
    } else {
        parent[lastProperty] = mutator;
    }
};
// pkg/dist-src/extract-page-info.js
var extractPageInfos = (responseData)=>{
    const pageInfoPath = findPaginatedResourcePath(responseData);
    return {
        pathInQuery: pageInfoPath,
        pageInfo: get(responseData, [
            ...pageInfoPath,
            "pageInfo"
        ])
    };
};
// pkg/dist-src/page-info.js
var isForwardSearch = (givenPageInfo)=>{
    return givenPageInfo.hasOwnProperty("hasNextPage");
};
var getCursorFrom = (pageInfo)=>isForwardSearch(pageInfo) ? pageInfo.endCursor : pageInfo.startCursor;
var hasAnotherPage = (pageInfo)=>isForwardSearch(pageInfo) ? pageInfo.hasNextPage : pageInfo.hasPreviousPage;
// pkg/dist-src/iterator.js
var createIterator = (octokit)=>{
    return (query, initialParameters = {})=>{
        let nextPageExists = true;
        let parameters = {
            ...initialParameters
        };
        return {
            [Symbol.asyncIterator]: ()=>({
                    async next () {
                        if (!nextPageExists) return {
                            done: true,
                            value: {}
                        };
                        const response = await octokit.graphql(query, parameters);
                        const pageInfoContext = extractPageInfos(response);
                        const nextCursorValue = getCursorFrom(pageInfoContext.pageInfo);
                        nextPageExists = hasAnotherPage(pageInfoContext.pageInfo);
                        if (nextPageExists && nextCursorValue === parameters.cursor) {
                            throw new MissingCursorChange(pageInfoContext, nextCursorValue);
                        }
                        parameters = {
                            ...parameters,
                            cursor: nextCursorValue
                        };
                        return {
                            done: false,
                            value: response
                        };
                    }
                })
        };
    };
};
// pkg/dist-src/merge-responses.js
var mergeResponses = (response1, response2)=>{
    if (Object.keys(response1).length === 0) {
        return Object.assign(response1, response2);
    }
    const path = findPaginatedResourcePath(response1);
    const nodesPath = [
        ...path,
        "nodes"
    ];
    const newNodes = get(response2, nodesPath);
    if (newNodes) {
        set(response1, nodesPath, (values)=>{
            return [
                ...values,
                ...newNodes
            ];
        });
    }
    const edgesPath = [
        ...path,
        "edges"
    ];
    const newEdges = get(response2, edgesPath);
    if (newEdges) {
        set(response1, edgesPath, (values)=>{
            return [
                ...values,
                ...newEdges
            ];
        });
    }
    const pageInfoPath = [
        ...path,
        "pageInfo"
    ];
    set(response1, pageInfoPath, get(response2, pageInfoPath));
    return response1;
};
// pkg/dist-src/paginate.js
var createPaginate = (octokit)=>{
    const iterator = createIterator(octokit);
    return async (query, initialParameters = {})=>{
        let mergedResponse = {};
        for await (const response of iterator(query, initialParameters)){
            mergedResponse = mergeResponses(mergedResponse, response);
        }
        return mergedResponse;
    };
};
// pkg/dist-src/index.js
function paginateGraphql(octokit) {
    octokit.graphql;
    return {
        graphql: Object.assign(octokit.graphql, {
            paginate: Object.assign(createPaginate(octokit), {
                iterator: createIterator(octokit)
            })
        })
    };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (0);


/***/ }),

/***/ 77671:
/***/ ((module) => {

"use strict";

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all)=>{
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = (to, from, except, desc)=>{
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
            get: ()=>from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
    return to;
};
var __toCommonJS = (mod)=>__copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
// pkg/dist-src/index.js
var dist_src_exports = {};
__export(dist_src_exports, {
    composePaginateRest: ()=>composePaginateRest,
    isPaginatingEndpoint: ()=>isPaginatingEndpoint,
    paginateRest: ()=>paginateRest,
    paginatingEndpoints: ()=>paginatingEndpoints
});
module.exports = __toCommonJS(dist_src_exports);
// pkg/dist-src/version.js
var VERSION = "11.3.1";
// pkg/dist-src/normalize-paginated-list-response.js
function normalizePaginatedListResponse(response) {
    if (!response.data) {
        return {
            ...response,
            data: []
        };
    }
    const responseNeedsNormalization = "total_count" in response.data && !("url" in response.data);
    if (!responseNeedsNormalization) return response;
    const incompleteResults = response.data.incomplete_results;
    const repositorySelection = response.data.repository_selection;
    const totalCount = response.data.total_count;
    delete response.data.incomplete_results;
    delete response.data.repository_selection;
    delete response.data.total_count;
    const namespaceKey = Object.keys(response.data)[0];
    const data = response.data[namespaceKey];
    response.data = data;
    if (typeof incompleteResults !== "undefined") {
        response.data.incomplete_results = incompleteResults;
    }
    if (typeof repositorySelection !== "undefined") {
        response.data.repository_selection = repositorySelection;
    }
    response.data.total_count = totalCount;
    return response;
}
// pkg/dist-src/iterator.js
function iterator(octokit, route, parameters) {
    const options = typeof route === "function" ? route.endpoint(parameters) : octokit.request.endpoint(route, parameters);
    const requestMethod = typeof route === "function" ? route : octokit.request;
    const method = options.method;
    const headers = options.headers;
    let url = options.url;
    return {
        [Symbol.asyncIterator]: ()=>({
                async next () {
                    if (!url) return {
                        done: true
                    };
                    try {
                        const response = await requestMethod({
                            method,
                            url,
                            headers
                        });
                        const normalizedResponse = normalizePaginatedListResponse(response);
                        url = ((normalizedResponse.headers.link || "").match(/<([^>]+)>;\s*rel="next"/) || [])[1];
                        return {
                            value: normalizedResponse
                        };
                    } catch (error) {
                        if (error.status !== 409) throw error;
                        url = "";
                        return {
                            value: {
                                status: 200,
                                headers: {},
                                data: []
                            }
                        };
                    }
                }
            })
    };
}
// pkg/dist-src/paginate.js
function paginate(octokit, route, parameters, mapFn) {
    if (typeof parameters === "function") {
        mapFn = parameters;
        parameters = void 0;
    }
    return gather(octokit, [], iterator(octokit, route, parameters)[Symbol.asyncIterator](), mapFn);
}
function gather(octokit, results, iterator2, mapFn) {
    return iterator2.next().then((result)=>{
        if (result.done) {
            return results;
        }
        let earlyExit = false;
        function done() {
            earlyExit = true;
        }
        results = results.concat(mapFn ? mapFn(result.value, done) : result.value.data);
        if (earlyExit) {
            return results;
        }
        return gather(octokit, results, iterator2, mapFn);
    });
}
// pkg/dist-src/compose-paginate.js
var composePaginateRest = Object.assign(paginate, {
    iterator
});
// pkg/dist-src/generated/paginating-endpoints.js
var paginatingEndpoints = [
    "GET /advisories",
    "GET /app/hook/deliveries",
    "GET /app/installation-requests",
    "GET /app/installations",
    "GET /assignments/{assignment_id}/accepted_assignments",
    "GET /classrooms",
    "GET /classrooms/{classroom_id}/assignments",
    "GET /enterprises/{enterprise}/copilot/usage",
    "GET /enterprises/{enterprise}/dependabot/alerts",
    "GET /enterprises/{enterprise}/secret-scanning/alerts",
    "GET /events",
    "GET /gists",
    "GET /gists/public",
    "GET /gists/starred",
    "GET /gists/{gist_id}/comments",
    "GET /gists/{gist_id}/commits",
    "GET /gists/{gist_id}/forks",
    "GET /installation/repositories",
    "GET /issues",
    "GET /licenses",
    "GET /marketplace_listing/plans",
    "GET /marketplace_listing/plans/{plan_id}/accounts",
    "GET /marketplace_listing/stubbed/plans",
    "GET /marketplace_listing/stubbed/plans/{plan_id}/accounts",
    "GET /networks/{owner}/{repo}/events",
    "GET /notifications",
    "GET /organizations",
    "GET /orgs/{org}/actions/cache/usage-by-repository",
    "GET /orgs/{org}/actions/permissions/repositories",
    "GET /orgs/{org}/actions/runners",
    "GET /orgs/{org}/actions/secrets",
    "GET /orgs/{org}/actions/secrets/{secret_name}/repositories",
    "GET /orgs/{org}/actions/variables",
    "GET /orgs/{org}/actions/variables/{name}/repositories",
    "GET /orgs/{org}/blocks",
    "GET /orgs/{org}/code-scanning/alerts",
    "GET /orgs/{org}/codespaces",
    "GET /orgs/{org}/codespaces/secrets",
    "GET /orgs/{org}/codespaces/secrets/{secret_name}/repositories",
    "GET /orgs/{org}/copilot/billing/seats",
    "GET /orgs/{org}/copilot/usage",
    "GET /orgs/{org}/dependabot/alerts",
    "GET /orgs/{org}/dependabot/secrets",
    "GET /orgs/{org}/dependabot/secrets/{secret_name}/repositories",
    "GET /orgs/{org}/events",
    "GET /orgs/{org}/failed_invitations",
    "GET /orgs/{org}/hooks",
    "GET /orgs/{org}/hooks/{hook_id}/deliveries",
    "GET /orgs/{org}/installations",
    "GET /orgs/{org}/invitations",
    "GET /orgs/{org}/invitations/{invitation_id}/teams",
    "GET /orgs/{org}/issues",
    "GET /orgs/{org}/members",
    "GET /orgs/{org}/members/{username}/codespaces",
    "GET /orgs/{org}/migrations",
    "GET /orgs/{org}/migrations/{migration_id}/repositories",
    "GET /orgs/{org}/organization-roles/{role_id}/teams",
    "GET /orgs/{org}/organization-roles/{role_id}/users",
    "GET /orgs/{org}/outside_collaborators",
    "GET /orgs/{org}/packages",
    "GET /orgs/{org}/packages/{package_type}/{package_name}/versions",
    "GET /orgs/{org}/personal-access-token-requests",
    "GET /orgs/{org}/personal-access-token-requests/{pat_request_id}/repositories",
    "GET /orgs/{org}/personal-access-tokens",
    "GET /orgs/{org}/personal-access-tokens/{pat_id}/repositories",
    "GET /orgs/{org}/projects",
    "GET /orgs/{org}/properties/values",
    "GET /orgs/{org}/public_members",
    "GET /orgs/{org}/repos",
    "GET /orgs/{org}/rulesets",
    "GET /orgs/{org}/rulesets/rule-suites",
    "GET /orgs/{org}/secret-scanning/alerts",
    "GET /orgs/{org}/security-advisories",
    "GET /orgs/{org}/team/{team_slug}/copilot/usage",
    "GET /orgs/{org}/teams",
    "GET /orgs/{org}/teams/{team_slug}/discussions",
    "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments",
    "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions",
    "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions",
    "GET /orgs/{org}/teams/{team_slug}/invitations",
    "GET /orgs/{org}/teams/{team_slug}/members",
    "GET /orgs/{org}/teams/{team_slug}/projects",
    "GET /orgs/{org}/teams/{team_slug}/repos",
    "GET /orgs/{org}/teams/{team_slug}/teams",
    "GET /projects/columns/{column_id}/cards",
    "GET /projects/{project_id}/collaborators",
    "GET /projects/{project_id}/columns",
    "GET /repos/{owner}/{repo}/actions/artifacts",
    "GET /repos/{owner}/{repo}/actions/caches",
    "GET /repos/{owner}/{repo}/actions/organization-secrets",
    "GET /repos/{owner}/{repo}/actions/organization-variables",
    "GET /repos/{owner}/{repo}/actions/runners",
    "GET /repos/{owner}/{repo}/actions/runs",
    "GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts",
    "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/jobs",
    "GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs",
    "GET /repos/{owner}/{repo}/actions/secrets",
    "GET /repos/{owner}/{repo}/actions/variables",
    "GET /repos/{owner}/{repo}/actions/workflows",
    "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs",
    "GET /repos/{owner}/{repo}/activity",
    "GET /repos/{owner}/{repo}/assignees",
    "GET /repos/{owner}/{repo}/branches",
    "GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations",
    "GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs",
    "GET /repos/{owner}/{repo}/code-scanning/alerts",
    "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances",
    "GET /repos/{owner}/{repo}/code-scanning/analyses",
    "GET /repos/{owner}/{repo}/codespaces",
    "GET /repos/{owner}/{repo}/codespaces/devcontainers",
    "GET /repos/{owner}/{repo}/codespaces/secrets",
    "GET /repos/{owner}/{repo}/collaborators",
    "GET /repos/{owner}/{repo}/comments",
    "GET /repos/{owner}/{repo}/comments/{comment_id}/reactions",
    "GET /repos/{owner}/{repo}/commits",
    "GET /repos/{owner}/{repo}/commits/{commit_sha}/comments",
    "GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls",
    "GET /repos/{owner}/{repo}/commits/{ref}/check-runs",
    "GET /repos/{owner}/{repo}/commits/{ref}/check-suites",
    "GET /repos/{owner}/{repo}/commits/{ref}/status",
    "GET /repos/{owner}/{repo}/commits/{ref}/statuses",
    "GET /repos/{owner}/{repo}/contributors",
    "GET /repos/{owner}/{repo}/dependabot/alerts",
    "GET /repos/{owner}/{repo}/dependabot/secrets",
    "GET /repos/{owner}/{repo}/deployments",
    "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses",
    "GET /repos/{owner}/{repo}/environments",
    "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies",
    "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/apps",
    "GET /repos/{owner}/{repo}/environments/{environment_name}/secrets",
    "GET /repos/{owner}/{repo}/environments/{environment_name}/variables",
    "GET /repos/{owner}/{repo}/events",
    "GET /repos/{owner}/{repo}/forks",
    "GET /repos/{owner}/{repo}/hooks",
    "GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries",
    "GET /repos/{owner}/{repo}/invitations",
    "GET /repos/{owner}/{repo}/issues",
    "GET /repos/{owner}/{repo}/issues/comments",
    "GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions",
    "GET /repos/{owner}/{repo}/issues/events",
    "GET /repos/{owner}/{repo}/issues/{issue_number}/comments",
    "GET /repos/{owner}/{repo}/issues/{issue_number}/events",
    "GET /repos/{owner}/{repo}/issues/{issue_number}/labels",
    "GET /repos/{owner}/{repo}/issues/{issue_number}/reactions",
    "GET /repos/{owner}/{repo}/issues/{issue_number}/timeline",
    "GET /repos/{owner}/{repo}/keys",
    "GET /repos/{owner}/{repo}/labels",
    "GET /repos/{owner}/{repo}/milestones",
    "GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels",
    "GET /repos/{owner}/{repo}/notifications",
    "GET /repos/{owner}/{repo}/pages/builds",
    "GET /repos/{owner}/{repo}/projects",
    "GET /repos/{owner}/{repo}/pulls",
    "GET /repos/{owner}/{repo}/pulls/comments",
    "GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions",
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/comments",
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/commits",
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/files",
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews",
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments",
    "GET /repos/{owner}/{repo}/releases",
    "GET /repos/{owner}/{repo}/releases/{release_id}/assets",
    "GET /repos/{owner}/{repo}/releases/{release_id}/reactions",
    "GET /repos/{owner}/{repo}/rules/branches/{branch}",
    "GET /repos/{owner}/{repo}/rulesets",
    "GET /repos/{owner}/{repo}/rulesets/rule-suites",
    "GET /repos/{owner}/{repo}/secret-scanning/alerts",
    "GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}/locations",
    "GET /repos/{owner}/{repo}/security-advisories",
    "GET /repos/{owner}/{repo}/stargazers",
    "GET /repos/{owner}/{repo}/subscribers",
    "GET /repos/{owner}/{repo}/tags",
    "GET /repos/{owner}/{repo}/teams",
    "GET /repos/{owner}/{repo}/topics",
    "GET /repositories",
    "GET /search/code",
    "GET /search/commits",
    "GET /search/issues",
    "GET /search/labels",
    "GET /search/repositories",
    "GET /search/topics",
    "GET /search/users",
    "GET /teams/{team_id}/discussions",
    "GET /teams/{team_id}/discussions/{discussion_number}/comments",
    "GET /teams/{team_id}/discussions/{discussion_number}/comments/{comment_number}/reactions",
    "GET /teams/{team_id}/discussions/{discussion_number}/reactions",
    "GET /teams/{team_id}/invitations",
    "GET /teams/{team_id}/members",
    "GET /teams/{team_id}/projects",
    "GET /teams/{team_id}/repos",
    "GET /teams/{team_id}/teams",
    "GET /user/blocks",
    "GET /user/codespaces",
    "GET /user/codespaces/secrets",
    "GET /user/emails",
    "GET /user/followers",
    "GET /user/following",
    "GET /user/gpg_keys",
    "GET /user/installations",
    "GET /user/installations/{installation_id}/repositories",
    "GET /user/issues",
    "GET /user/keys",
    "GET /user/marketplace_purchases",
    "GET /user/marketplace_purchases/stubbed",
    "GET /user/memberships/orgs",
    "GET /user/migrations",
    "GET /user/migrations/{migration_id}/repositories",
    "GET /user/orgs",
    "GET /user/packages",
    "GET /user/packages/{package_type}/{package_name}/versions",
    "GET /user/public_emails",
    "GET /user/repos",
    "GET /user/repository_invitations",
    "GET /user/social_accounts",
    "GET /user/ssh_signing_keys",
    "GET /user/starred",
    "GET /user/subscriptions",
    "GET /user/teams",
    "GET /users",
    "GET /users/{username}/events",
    "GET /users/{username}/events/orgs/{org}",
    "GET /users/{username}/events/public",
    "GET /users/{username}/followers",
    "GET /users/{username}/following",
    "GET /users/{username}/gists",
    "GET /users/{username}/gpg_keys",
    "GET /users/{username}/keys",
    "GET /users/{username}/orgs",
    "GET /users/{username}/packages",
    "GET /users/{username}/projects",
    "GET /users/{username}/received_events",
    "GET /users/{username}/received_events/public",
    "GET /users/{username}/repos",
    "GET /users/{username}/social_accounts",
    "GET /users/{username}/ssh_signing_keys",
    "GET /users/{username}/starred",
    "GET /users/{username}/subscriptions"
];
// pkg/dist-src/paginating-endpoints.js
function isPaginatingEndpoint(arg) {
    if (typeof arg === "string") {
        return paginatingEndpoints.includes(arg);
    } else {
        return false;
    }
}
// pkg/dist-src/index.js
function paginateRest(octokit) {
    return {
        paginate: Object.assign(paginate.bind(null, octokit), {
            iterator: iterator.bind(null, octokit)
        })
    };
}
paginateRest.VERSION = VERSION;
// Annotate the CommonJS export names for ESM import in node:
0 && (0);


/***/ }),

/***/ 62929:
/***/ ((module) => {

"use strict";

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all)=>{
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = (to, from, except, desc)=>{
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
            get: ()=>from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
    return to;
};
var __toCommonJS = (mod)=>__copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
// pkg/dist-src/index.js
var dist_src_exports = {};
__export(dist_src_exports, {
    composePaginateRest: ()=>composePaginateRest,
    isPaginatingEndpoint: ()=>isPaginatingEndpoint,
    paginateRest: ()=>paginateRest,
    paginatingEndpoints: ()=>paginatingEndpoints
});
module.exports = __toCommonJS(dist_src_exports);
// pkg/dist-src/version.js
var VERSION = "9.2.1";
// pkg/dist-src/normalize-paginated-list-response.js
function normalizePaginatedListResponse(response) {
    if (!response.data) {
        return {
            ...response,
            data: []
        };
    }
    const responseNeedsNormalization = "total_count" in response.data && !("url" in response.data);
    if (!responseNeedsNormalization) return response;
    const incompleteResults = response.data.incomplete_results;
    const repositorySelection = response.data.repository_selection;
    const totalCount = response.data.total_count;
    delete response.data.incomplete_results;
    delete response.data.repository_selection;
    delete response.data.total_count;
    const namespaceKey = Object.keys(response.data)[0];
    const data = response.data[namespaceKey];
    response.data = data;
    if (typeof incompleteResults !== "undefined") {
        response.data.incomplete_results = incompleteResults;
    }
    if (typeof repositorySelection !== "undefined") {
        response.data.repository_selection = repositorySelection;
    }
    response.data.total_count = totalCount;
    return response;
}
// pkg/dist-src/iterator.js
function iterator(octokit, route, parameters) {
    const options = typeof route === "function" ? route.endpoint(parameters) : octokit.request.endpoint(route, parameters);
    const requestMethod = typeof route === "function" ? route : octokit.request;
    const method = options.method;
    const headers = options.headers;
    let url = options.url;
    return {
        [Symbol.asyncIterator]: ()=>({
                async next () {
                    if (!url) return {
                        done: true
                    };
                    try {
                        const response = await requestMethod({
                            method,
                            url,
                            headers
                        });
                        const normalizedResponse = normalizePaginatedListResponse(response);
                        url = ((normalizedResponse.headers.link || "").match(/<([^>]+)>;\s*rel="next"/) || [])[1];
                        return {
                            value: normalizedResponse
                        };
                    } catch (error) {
                        if (error.status !== 409) throw error;
                        url = "";
                        return {
                            value: {
                                status: 200,
                                headers: {},
                                data: []
                            }
                        };
                    }
                }
            })
    };
}
// pkg/dist-src/paginate.js
function paginate(octokit, route, parameters, mapFn) {
    if (typeof parameters === "function") {
        mapFn = parameters;
        parameters = void 0;
    }
    return gather(octokit, [], iterator(octokit, route, parameters)[Symbol.asyncIterator](), mapFn);
}
function gather(octokit, results, iterator2, mapFn) {
    return iterator2.next().then((result)=>{
        if (result.done) {
            return results;
        }
        let earlyExit = false;
        function done() {
            earlyExit = true;
        }
        results = results.concat(mapFn ? mapFn(result.value, done) : result.value.data);
        if (earlyExit) {
            return results;
        }
        return gather(octokit, results, iterator2, mapFn);
    });
}
// pkg/dist-src/compose-paginate.js
var composePaginateRest = Object.assign(paginate, {
    iterator
});
// pkg/dist-src/generated/paginating-endpoints.js
var paginatingEndpoints = [
    "GET /advisories",
    "GET /app/hook/deliveries",
    "GET /app/installation-requests",
    "GET /app/installations",
    "GET /assignments/{assignment_id}/accepted_assignments",
    "GET /classrooms",
    "GET /classrooms/{classroom_id}/assignments",
    "GET /enterprises/{enterprise}/dependabot/alerts",
    "GET /enterprises/{enterprise}/secret-scanning/alerts",
    "GET /events",
    "GET /gists",
    "GET /gists/public",
    "GET /gists/starred",
    "GET /gists/{gist_id}/comments",
    "GET /gists/{gist_id}/commits",
    "GET /gists/{gist_id}/forks",
    "GET /installation/repositories",
    "GET /issues",
    "GET /licenses",
    "GET /marketplace_listing/plans",
    "GET /marketplace_listing/plans/{plan_id}/accounts",
    "GET /marketplace_listing/stubbed/plans",
    "GET /marketplace_listing/stubbed/plans/{plan_id}/accounts",
    "GET /networks/{owner}/{repo}/events",
    "GET /notifications",
    "GET /organizations",
    "GET /orgs/{org}/actions/cache/usage-by-repository",
    "GET /orgs/{org}/actions/permissions/repositories",
    "GET /orgs/{org}/actions/runners",
    "GET /orgs/{org}/actions/secrets",
    "GET /orgs/{org}/actions/secrets/{secret_name}/repositories",
    "GET /orgs/{org}/actions/variables",
    "GET /orgs/{org}/actions/variables/{name}/repositories",
    "GET /orgs/{org}/blocks",
    "GET /orgs/{org}/code-scanning/alerts",
    "GET /orgs/{org}/codespaces",
    "GET /orgs/{org}/codespaces/secrets",
    "GET /orgs/{org}/codespaces/secrets/{secret_name}/repositories",
    "GET /orgs/{org}/copilot/billing/seats",
    "GET /orgs/{org}/dependabot/alerts",
    "GET /orgs/{org}/dependabot/secrets",
    "GET /orgs/{org}/dependabot/secrets/{secret_name}/repositories",
    "GET /orgs/{org}/events",
    "GET /orgs/{org}/failed_invitations",
    "GET /orgs/{org}/hooks",
    "GET /orgs/{org}/hooks/{hook_id}/deliveries",
    "GET /orgs/{org}/installations",
    "GET /orgs/{org}/invitations",
    "GET /orgs/{org}/invitations/{invitation_id}/teams",
    "GET /orgs/{org}/issues",
    "GET /orgs/{org}/members",
    "GET /orgs/{org}/members/{username}/codespaces",
    "GET /orgs/{org}/migrations",
    "GET /orgs/{org}/migrations/{migration_id}/repositories",
    "GET /orgs/{org}/organization-roles/{role_id}/teams",
    "GET /orgs/{org}/organization-roles/{role_id}/users",
    "GET /orgs/{org}/outside_collaborators",
    "GET /orgs/{org}/packages",
    "GET /orgs/{org}/packages/{package_type}/{package_name}/versions",
    "GET /orgs/{org}/personal-access-token-requests",
    "GET /orgs/{org}/personal-access-token-requests/{pat_request_id}/repositories",
    "GET /orgs/{org}/personal-access-tokens",
    "GET /orgs/{org}/personal-access-tokens/{pat_id}/repositories",
    "GET /orgs/{org}/projects",
    "GET /orgs/{org}/properties/values",
    "GET /orgs/{org}/public_members",
    "GET /orgs/{org}/repos",
    "GET /orgs/{org}/rulesets",
    "GET /orgs/{org}/rulesets/rule-suites",
    "GET /orgs/{org}/secret-scanning/alerts",
    "GET /orgs/{org}/security-advisories",
    "GET /orgs/{org}/teams",
    "GET /orgs/{org}/teams/{team_slug}/discussions",
    "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments",
    "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions",
    "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions",
    "GET /orgs/{org}/teams/{team_slug}/invitations",
    "GET /orgs/{org}/teams/{team_slug}/members",
    "GET /orgs/{org}/teams/{team_slug}/projects",
    "GET /orgs/{org}/teams/{team_slug}/repos",
    "GET /orgs/{org}/teams/{team_slug}/teams",
    "GET /projects/columns/{column_id}/cards",
    "GET /projects/{project_id}/collaborators",
    "GET /projects/{project_id}/columns",
    "GET /repos/{owner}/{repo}/actions/artifacts",
    "GET /repos/{owner}/{repo}/actions/caches",
    "GET /repos/{owner}/{repo}/actions/organization-secrets",
    "GET /repos/{owner}/{repo}/actions/organization-variables",
    "GET /repos/{owner}/{repo}/actions/runners",
    "GET /repos/{owner}/{repo}/actions/runs",
    "GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts",
    "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/jobs",
    "GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs",
    "GET /repos/{owner}/{repo}/actions/secrets",
    "GET /repos/{owner}/{repo}/actions/variables",
    "GET /repos/{owner}/{repo}/actions/workflows",
    "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs",
    "GET /repos/{owner}/{repo}/activity",
    "GET /repos/{owner}/{repo}/assignees",
    "GET /repos/{owner}/{repo}/branches",
    "GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations",
    "GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs",
    "GET /repos/{owner}/{repo}/code-scanning/alerts",
    "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances",
    "GET /repos/{owner}/{repo}/code-scanning/analyses",
    "GET /repos/{owner}/{repo}/codespaces",
    "GET /repos/{owner}/{repo}/codespaces/devcontainers",
    "GET /repos/{owner}/{repo}/codespaces/secrets",
    "GET /repos/{owner}/{repo}/collaborators",
    "GET /repos/{owner}/{repo}/comments",
    "GET /repos/{owner}/{repo}/comments/{comment_id}/reactions",
    "GET /repos/{owner}/{repo}/commits",
    "GET /repos/{owner}/{repo}/commits/{commit_sha}/comments",
    "GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls",
    "GET /repos/{owner}/{repo}/commits/{ref}/check-runs",
    "GET /repos/{owner}/{repo}/commits/{ref}/check-suites",
    "GET /repos/{owner}/{repo}/commits/{ref}/status",
    "GET /repos/{owner}/{repo}/commits/{ref}/statuses",
    "GET /repos/{owner}/{repo}/contributors",
    "GET /repos/{owner}/{repo}/dependabot/alerts",
    "GET /repos/{owner}/{repo}/dependabot/secrets",
    "GET /repos/{owner}/{repo}/deployments",
    "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses",
    "GET /repos/{owner}/{repo}/environments",
    "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies",
    "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/apps",
    "GET /repos/{owner}/{repo}/events",
    "GET /repos/{owner}/{repo}/forks",
    "GET /repos/{owner}/{repo}/hooks",
    "GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries",
    "GET /repos/{owner}/{repo}/invitations",
    "GET /repos/{owner}/{repo}/issues",
    "GET /repos/{owner}/{repo}/issues/comments",
    "GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions",
    "GET /repos/{owner}/{repo}/issues/events",
    "GET /repos/{owner}/{repo}/issues/{issue_number}/comments",
    "GET /repos/{owner}/{repo}/issues/{issue_number}/events",
    "GET /repos/{owner}/{repo}/issues/{issue_number}/labels",
    "GET /repos/{owner}/{repo}/issues/{issue_number}/reactions",
    "GET /repos/{owner}/{repo}/issues/{issue_number}/timeline",
    "GET /repos/{owner}/{repo}/keys",
    "GET /repos/{owner}/{repo}/labels",
    "GET /repos/{owner}/{repo}/milestones",
    "GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels",
    "GET /repos/{owner}/{repo}/notifications",
    "GET /repos/{owner}/{repo}/pages/builds",
    "GET /repos/{owner}/{repo}/projects",
    "GET /repos/{owner}/{repo}/pulls",
    "GET /repos/{owner}/{repo}/pulls/comments",
    "GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions",
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/comments",
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/commits",
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/files",
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews",
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments",
    "GET /repos/{owner}/{repo}/releases",
    "GET /repos/{owner}/{repo}/releases/{release_id}/assets",
    "GET /repos/{owner}/{repo}/releases/{release_id}/reactions",
    "GET /repos/{owner}/{repo}/rules/branches/{branch}",
    "GET /repos/{owner}/{repo}/rulesets",
    "GET /repos/{owner}/{repo}/rulesets/rule-suites",
    "GET /repos/{owner}/{repo}/secret-scanning/alerts",
    "GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}/locations",
    "GET /repos/{owner}/{repo}/security-advisories",
    "GET /repos/{owner}/{repo}/stargazers",
    "GET /repos/{owner}/{repo}/subscribers",
    "GET /repos/{owner}/{repo}/tags",
    "GET /repos/{owner}/{repo}/teams",
    "GET /repos/{owner}/{repo}/topics",
    "GET /repositories",
    "GET /repositories/{repository_id}/environments/{environment_name}/secrets",
    "GET /repositories/{repository_id}/environments/{environment_name}/variables",
    "GET /search/code",
    "GET /search/commits",
    "GET /search/issues",
    "GET /search/labels",
    "GET /search/repositories",
    "GET /search/topics",
    "GET /search/users",
    "GET /teams/{team_id}/discussions",
    "GET /teams/{team_id}/discussions/{discussion_number}/comments",
    "GET /teams/{team_id}/discussions/{discussion_number}/comments/{comment_number}/reactions",
    "GET /teams/{team_id}/discussions/{discussion_number}/reactions",
    "GET /teams/{team_id}/invitations",
    "GET /teams/{team_id}/members",
    "GET /teams/{team_id}/projects",
    "GET /teams/{team_id}/repos",
    "GET /teams/{team_id}/teams",
    "GET /user/blocks",
    "GET /user/codespaces",
    "GET /user/codespaces/secrets",
    "GET /user/emails",
    "GET /user/followers",
    "GET /user/following",
    "GET /user/gpg_keys",
    "GET /user/installations",
    "GET /user/installations/{installation_id}/repositories",
    "GET /user/issues",
    "GET /user/keys",
    "GET /user/marketplace_purchases",
    "GET /user/marketplace_purchases/stubbed",
    "GET /user/memberships/orgs",
    "GET /user/migrations",
    "GET /user/migrations/{migration_id}/repositories",
    "GET /user/orgs",
    "GET /user/packages",
    "GET /user/packages/{package_type}/{package_name}/versions",
    "GET /user/public_emails",
    "GET /user/repos",
    "GET /user/repository_invitations",
    "GET /user/social_accounts",
    "GET /user/ssh_signing_keys",
    "GET /user/starred",
    "GET /user/subscriptions",
    "GET /user/teams",
    "GET /users",
    "GET /users/{username}/events",
    "GET /users/{username}/events/orgs/{org}",
    "GET /users/{username}/events/public",
    "GET /users/{username}/followers",
    "GET /users/{username}/following",
    "GET /users/{username}/gists",
    "GET /users/{username}/gpg_keys",
    "GET /users/{username}/keys",
    "GET /users/{username}/orgs",
    "GET /users/{username}/packages",
    "GET /users/{username}/projects",
    "GET /users/{username}/received_events",
    "GET /users/{username}/received_events/public",
    "GET /users/{username}/repos",
    "GET /users/{username}/social_accounts",
    "GET /users/{username}/ssh_signing_keys",
    "GET /users/{username}/starred",
    "GET /users/{username}/subscriptions"
];
// pkg/dist-src/paginating-endpoints.js
function isPaginatingEndpoint(arg) {
    if (typeof arg === "string") {
        return paginatingEndpoints.includes(arg);
    } else {
        return false;
    }
}
// pkg/dist-src/index.js
function paginateRest(octokit) {
    return {
        paginate: Object.assign(paginate.bind(null, octokit), {
            iterator: iterator.bind(null, octokit)
        })
    };
}
paginateRest.VERSION = VERSION;
// Annotate the CommonJS export names for ESM import in node:
0 && (0);


/***/ }),

/***/ 26312:
/***/ ((module) => {

"use strict";

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all)=>{
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = (to, from, except, desc)=>{
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
            get: ()=>from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
    return to;
};
var __toCommonJS = (mod)=>__copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
// pkg/dist-src/index.js
var dist_src_exports = {};
__export(dist_src_exports, {
    legacyRestEndpointMethods: ()=>legacyRestEndpointMethods,
    restEndpointMethods: ()=>restEndpointMethods
});
module.exports = __toCommonJS(dist_src_exports);
// pkg/dist-src/version.js
var VERSION = "13.2.2";
// pkg/dist-src/generated/endpoints.js
var Endpoints = {
    actions: {
        addCustomLabelsToSelfHostedRunnerForOrg: [
            "POST /orgs/{org}/actions/runners/{runner_id}/labels"
        ],
        addCustomLabelsToSelfHostedRunnerForRepo: [
            "POST /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
        ],
        addSelectedRepoToOrgSecret: [
            "PUT /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"
        ],
        addSelectedRepoToOrgVariable: [
            "PUT /orgs/{org}/actions/variables/{name}/repositories/{repository_id}"
        ],
        approveWorkflowRun: [
            "POST /repos/{owner}/{repo}/actions/runs/{run_id}/approve"
        ],
        cancelWorkflowRun: [
            "POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel"
        ],
        createEnvironmentVariable: [
            "POST /repos/{owner}/{repo}/environments/{environment_name}/variables"
        ],
        createOrUpdateEnvironmentSecret: [
            "PUT /repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}"
        ],
        createOrUpdateOrgSecret: [
            "PUT /orgs/{org}/actions/secrets/{secret_name}"
        ],
        createOrUpdateRepoSecret: [
            "PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}"
        ],
        createOrgVariable: [
            "POST /orgs/{org}/actions/variables"
        ],
        createRegistrationTokenForOrg: [
            "POST /orgs/{org}/actions/runners/registration-token"
        ],
        createRegistrationTokenForRepo: [
            "POST /repos/{owner}/{repo}/actions/runners/registration-token"
        ],
        createRemoveTokenForOrg: [
            "POST /orgs/{org}/actions/runners/remove-token"
        ],
        createRemoveTokenForRepo: [
            "POST /repos/{owner}/{repo}/actions/runners/remove-token"
        ],
        createRepoVariable: [
            "POST /repos/{owner}/{repo}/actions/variables"
        ],
        createWorkflowDispatch: [
            "POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches"
        ],
        deleteActionsCacheById: [
            "DELETE /repos/{owner}/{repo}/actions/caches/{cache_id}"
        ],
        deleteActionsCacheByKey: [
            "DELETE /repos/{owner}/{repo}/actions/caches{?key,ref}"
        ],
        deleteArtifact: [
            "DELETE /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"
        ],
        deleteEnvironmentSecret: [
            "DELETE /repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}"
        ],
        deleteEnvironmentVariable: [
            "DELETE /repos/{owner}/{repo}/environments/{environment_name}/variables/{name}"
        ],
        deleteOrgSecret: [
            "DELETE /orgs/{org}/actions/secrets/{secret_name}"
        ],
        deleteOrgVariable: [
            "DELETE /orgs/{org}/actions/variables/{name}"
        ],
        deleteRepoSecret: [
            "DELETE /repos/{owner}/{repo}/actions/secrets/{secret_name}"
        ],
        deleteRepoVariable: [
            "DELETE /repos/{owner}/{repo}/actions/variables/{name}"
        ],
        deleteSelfHostedRunnerFromOrg: [
            "DELETE /orgs/{org}/actions/runners/{runner_id}"
        ],
        deleteSelfHostedRunnerFromRepo: [
            "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}"
        ],
        deleteWorkflowRun: [
            "DELETE /repos/{owner}/{repo}/actions/runs/{run_id}"
        ],
        deleteWorkflowRunLogs: [
            "DELETE /repos/{owner}/{repo}/actions/runs/{run_id}/logs"
        ],
        disableSelectedRepositoryGithubActionsOrganization: [
            "DELETE /orgs/{org}/actions/permissions/repositories/{repository_id}"
        ],
        disableWorkflow: [
            "PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/disable"
        ],
        downloadArtifact: [
            "GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}"
        ],
        downloadJobLogsForWorkflowRun: [
            "GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs"
        ],
        downloadWorkflowRunAttemptLogs: [
            "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/logs"
        ],
        downloadWorkflowRunLogs: [
            "GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs"
        ],
        enableSelectedRepositoryGithubActionsOrganization: [
            "PUT /orgs/{org}/actions/permissions/repositories/{repository_id}"
        ],
        enableWorkflow: [
            "PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/enable"
        ],
        forceCancelWorkflowRun: [
            "POST /repos/{owner}/{repo}/actions/runs/{run_id}/force-cancel"
        ],
        generateRunnerJitconfigForOrg: [
            "POST /orgs/{org}/actions/runners/generate-jitconfig"
        ],
        generateRunnerJitconfigForRepo: [
            "POST /repos/{owner}/{repo}/actions/runners/generate-jitconfig"
        ],
        getActionsCacheList: [
            "GET /repos/{owner}/{repo}/actions/caches"
        ],
        getActionsCacheUsage: [
            "GET /repos/{owner}/{repo}/actions/cache/usage"
        ],
        getActionsCacheUsageByRepoForOrg: [
            "GET /orgs/{org}/actions/cache/usage-by-repository"
        ],
        getActionsCacheUsageForOrg: [
            "GET /orgs/{org}/actions/cache/usage"
        ],
        getAllowedActionsOrganization: [
            "GET /orgs/{org}/actions/permissions/selected-actions"
        ],
        getAllowedActionsRepository: [
            "GET /repos/{owner}/{repo}/actions/permissions/selected-actions"
        ],
        getArtifact: [
            "GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"
        ],
        getCustomOidcSubClaimForRepo: [
            "GET /repos/{owner}/{repo}/actions/oidc/customization/sub"
        ],
        getEnvironmentPublicKey: [
            "GET /repos/{owner}/{repo}/environments/{environment_name}/secrets/public-key"
        ],
        getEnvironmentSecret: [
            "GET /repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}"
        ],
        getEnvironmentVariable: [
            "GET /repos/{owner}/{repo}/environments/{environment_name}/variables/{name}"
        ],
        getGithubActionsDefaultWorkflowPermissionsOrganization: [
            "GET /orgs/{org}/actions/permissions/workflow"
        ],
        getGithubActionsDefaultWorkflowPermissionsRepository: [
            "GET /repos/{owner}/{repo}/actions/permissions/workflow"
        ],
        getGithubActionsPermissionsOrganization: [
            "GET /orgs/{org}/actions/permissions"
        ],
        getGithubActionsPermissionsRepository: [
            "GET /repos/{owner}/{repo}/actions/permissions"
        ],
        getJobForWorkflowRun: [
            "GET /repos/{owner}/{repo}/actions/jobs/{job_id}"
        ],
        getOrgPublicKey: [
            "GET /orgs/{org}/actions/secrets/public-key"
        ],
        getOrgSecret: [
            "GET /orgs/{org}/actions/secrets/{secret_name}"
        ],
        getOrgVariable: [
            "GET /orgs/{org}/actions/variables/{name}"
        ],
        getPendingDeploymentsForRun: [
            "GET /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments"
        ],
        getRepoPermissions: [
            "GET /repos/{owner}/{repo}/actions/permissions",
            {},
            {
                renamed: [
                    "actions",
                    "getGithubActionsPermissionsRepository"
                ]
            }
        ],
        getRepoPublicKey: [
            "GET /repos/{owner}/{repo}/actions/secrets/public-key"
        ],
        getRepoSecret: [
            "GET /repos/{owner}/{repo}/actions/secrets/{secret_name}"
        ],
        getRepoVariable: [
            "GET /repos/{owner}/{repo}/actions/variables/{name}"
        ],
        getReviewsForRun: [
            "GET /repos/{owner}/{repo}/actions/runs/{run_id}/approvals"
        ],
        getSelfHostedRunnerForOrg: [
            "GET /orgs/{org}/actions/runners/{runner_id}"
        ],
        getSelfHostedRunnerForRepo: [
            "GET /repos/{owner}/{repo}/actions/runners/{runner_id}"
        ],
        getWorkflow: [
            "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}"
        ],
        getWorkflowAccessToRepository: [
            "GET /repos/{owner}/{repo}/actions/permissions/access"
        ],
        getWorkflowRun: [
            "GET /repos/{owner}/{repo}/actions/runs/{run_id}"
        ],
        getWorkflowRunAttempt: [
            "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}"
        ],
        getWorkflowRunUsage: [
            "GET /repos/{owner}/{repo}/actions/runs/{run_id}/timing"
        ],
        getWorkflowUsage: [
            "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/timing"
        ],
        listArtifactsForRepo: [
            "GET /repos/{owner}/{repo}/actions/artifacts"
        ],
        listEnvironmentSecrets: [
            "GET /repos/{owner}/{repo}/environments/{environment_name}/secrets"
        ],
        listEnvironmentVariables: [
            "GET /repos/{owner}/{repo}/environments/{environment_name}/variables"
        ],
        listJobsForWorkflowRun: [
            "GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs"
        ],
        listJobsForWorkflowRunAttempt: [
            "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/jobs"
        ],
        listLabelsForSelfHostedRunnerForOrg: [
            "GET /orgs/{org}/actions/runners/{runner_id}/labels"
        ],
        listLabelsForSelfHostedRunnerForRepo: [
            "GET /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
        ],
        listOrgSecrets: [
            "GET /orgs/{org}/actions/secrets"
        ],
        listOrgVariables: [
            "GET /orgs/{org}/actions/variables"
        ],
        listRepoOrganizationSecrets: [
            "GET /repos/{owner}/{repo}/actions/organization-secrets"
        ],
        listRepoOrganizationVariables: [
            "GET /repos/{owner}/{repo}/actions/organization-variables"
        ],
        listRepoSecrets: [
            "GET /repos/{owner}/{repo}/actions/secrets"
        ],
        listRepoVariables: [
            "GET /repos/{owner}/{repo}/actions/variables"
        ],
        listRepoWorkflows: [
            "GET /repos/{owner}/{repo}/actions/workflows"
        ],
        listRunnerApplicationsForOrg: [
            "GET /orgs/{org}/actions/runners/downloads"
        ],
        listRunnerApplicationsForRepo: [
            "GET /repos/{owner}/{repo}/actions/runners/downloads"
        ],
        listSelectedReposForOrgSecret: [
            "GET /orgs/{org}/actions/secrets/{secret_name}/repositories"
        ],
        listSelectedReposForOrgVariable: [
            "GET /orgs/{org}/actions/variables/{name}/repositories"
        ],
        listSelectedRepositoriesEnabledGithubActionsOrganization: [
            "GET /orgs/{org}/actions/permissions/repositories"
        ],
        listSelfHostedRunnersForOrg: [
            "GET /orgs/{org}/actions/runners"
        ],
        listSelfHostedRunnersForRepo: [
            "GET /repos/{owner}/{repo}/actions/runners"
        ],
        listWorkflowRunArtifacts: [
            "GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts"
        ],
        listWorkflowRuns: [
            "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs"
        ],
        listWorkflowRunsForRepo: [
            "GET /repos/{owner}/{repo}/actions/runs"
        ],
        reRunJobForWorkflowRun: [
            "POST /repos/{owner}/{repo}/actions/jobs/{job_id}/rerun"
        ],
        reRunWorkflow: [
            "POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun"
        ],
        reRunWorkflowFailedJobs: [
            "POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun-failed-jobs"
        ],
        removeAllCustomLabelsFromSelfHostedRunnerForOrg: [
            "DELETE /orgs/{org}/actions/runners/{runner_id}/labels"
        ],
        removeAllCustomLabelsFromSelfHostedRunnerForRepo: [
            "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
        ],
        removeCustomLabelFromSelfHostedRunnerForOrg: [
            "DELETE /orgs/{org}/actions/runners/{runner_id}/labels/{name}"
        ],
        removeCustomLabelFromSelfHostedRunnerForRepo: [
            "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}/labels/{name}"
        ],
        removeSelectedRepoFromOrgSecret: [
            "DELETE /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"
        ],
        removeSelectedRepoFromOrgVariable: [
            "DELETE /orgs/{org}/actions/variables/{name}/repositories/{repository_id}"
        ],
        reviewCustomGatesForRun: [
            "POST /repos/{owner}/{repo}/actions/runs/{run_id}/deployment_protection_rule"
        ],
        reviewPendingDeploymentsForRun: [
            "POST /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments"
        ],
        setAllowedActionsOrganization: [
            "PUT /orgs/{org}/actions/permissions/selected-actions"
        ],
        setAllowedActionsRepository: [
            "PUT /repos/{owner}/{repo}/actions/permissions/selected-actions"
        ],
        setCustomLabelsForSelfHostedRunnerForOrg: [
            "PUT /orgs/{org}/actions/runners/{runner_id}/labels"
        ],
        setCustomLabelsForSelfHostedRunnerForRepo: [
            "PUT /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
        ],
        setCustomOidcSubClaimForRepo: [
            "PUT /repos/{owner}/{repo}/actions/oidc/customization/sub"
        ],
        setGithubActionsDefaultWorkflowPermissionsOrganization: [
            "PUT /orgs/{org}/actions/permissions/workflow"
        ],
        setGithubActionsDefaultWorkflowPermissionsRepository: [
            "PUT /repos/{owner}/{repo}/actions/permissions/workflow"
        ],
        setGithubActionsPermissionsOrganization: [
            "PUT /orgs/{org}/actions/permissions"
        ],
        setGithubActionsPermissionsRepository: [
            "PUT /repos/{owner}/{repo}/actions/permissions"
        ],
        setSelectedReposForOrgSecret: [
            "PUT /orgs/{org}/actions/secrets/{secret_name}/repositories"
        ],
        setSelectedReposForOrgVariable: [
            "PUT /orgs/{org}/actions/variables/{name}/repositories"
        ],
        setSelectedRepositoriesEnabledGithubActionsOrganization: [
            "PUT /orgs/{org}/actions/permissions/repositories"
        ],
        setWorkflowAccessToRepository: [
            "PUT /repos/{owner}/{repo}/actions/permissions/access"
        ],
        updateEnvironmentVariable: [
            "PATCH /repos/{owner}/{repo}/environments/{environment_name}/variables/{name}"
        ],
        updateOrgVariable: [
            "PATCH /orgs/{org}/actions/variables/{name}"
        ],
        updateRepoVariable: [
            "PATCH /repos/{owner}/{repo}/actions/variables/{name}"
        ]
    },
    activity: {
        checkRepoIsStarredByAuthenticatedUser: [
            "GET /user/starred/{owner}/{repo}"
        ],
        deleteRepoSubscription: [
            "DELETE /repos/{owner}/{repo}/subscription"
        ],
        deleteThreadSubscription: [
            "DELETE /notifications/threads/{thread_id}/subscription"
        ],
        getFeeds: [
            "GET /feeds"
        ],
        getRepoSubscription: [
            "GET /repos/{owner}/{repo}/subscription"
        ],
        getThread: [
            "GET /notifications/threads/{thread_id}"
        ],
        getThreadSubscriptionForAuthenticatedUser: [
            "GET /notifications/threads/{thread_id}/subscription"
        ],
        listEventsForAuthenticatedUser: [
            "GET /users/{username}/events"
        ],
        listNotificationsForAuthenticatedUser: [
            "GET /notifications"
        ],
        listOrgEventsForAuthenticatedUser: [
            "GET /users/{username}/events/orgs/{org}"
        ],
        listPublicEvents: [
            "GET /events"
        ],
        listPublicEventsForRepoNetwork: [
            "GET /networks/{owner}/{repo}/events"
        ],
        listPublicEventsForUser: [
            "GET /users/{username}/events/public"
        ],
        listPublicOrgEvents: [
            "GET /orgs/{org}/events"
        ],
        listReceivedEventsForUser: [
            "GET /users/{username}/received_events"
        ],
        listReceivedPublicEventsForUser: [
            "GET /users/{username}/received_events/public"
        ],
        listRepoEvents: [
            "GET /repos/{owner}/{repo}/events"
        ],
        listRepoNotificationsForAuthenticatedUser: [
            "GET /repos/{owner}/{repo}/notifications"
        ],
        listReposStarredByAuthenticatedUser: [
            "GET /user/starred"
        ],
        listReposStarredByUser: [
            "GET /users/{username}/starred"
        ],
        listReposWatchedByUser: [
            "GET /users/{username}/subscriptions"
        ],
        listStargazersForRepo: [
            "GET /repos/{owner}/{repo}/stargazers"
        ],
        listWatchedReposForAuthenticatedUser: [
            "GET /user/subscriptions"
        ],
        listWatchersForRepo: [
            "GET /repos/{owner}/{repo}/subscribers"
        ],
        markNotificationsAsRead: [
            "PUT /notifications"
        ],
        markRepoNotificationsAsRead: [
            "PUT /repos/{owner}/{repo}/notifications"
        ],
        markThreadAsDone: [
            "DELETE /notifications/threads/{thread_id}"
        ],
        markThreadAsRead: [
            "PATCH /notifications/threads/{thread_id}"
        ],
        setRepoSubscription: [
            "PUT /repos/{owner}/{repo}/subscription"
        ],
        setThreadSubscription: [
            "PUT /notifications/threads/{thread_id}/subscription"
        ],
        starRepoForAuthenticatedUser: [
            "PUT /user/starred/{owner}/{repo}"
        ],
        unstarRepoForAuthenticatedUser: [
            "DELETE /user/starred/{owner}/{repo}"
        ]
    },
    apps: {
        addRepoToInstallation: [
            "PUT /user/installations/{installation_id}/repositories/{repository_id}",
            {},
            {
                renamed: [
                    "apps",
                    "addRepoToInstallationForAuthenticatedUser"
                ]
            }
        ],
        addRepoToInstallationForAuthenticatedUser: [
            "PUT /user/installations/{installation_id}/repositories/{repository_id}"
        ],
        checkToken: [
            "POST /applications/{client_id}/token"
        ],
        createFromManifest: [
            "POST /app-manifests/{code}/conversions"
        ],
        createInstallationAccessToken: [
            "POST /app/installations/{installation_id}/access_tokens"
        ],
        deleteAuthorization: [
            "DELETE /applications/{client_id}/grant"
        ],
        deleteInstallation: [
            "DELETE /app/installations/{installation_id}"
        ],
        deleteToken: [
            "DELETE /applications/{client_id}/token"
        ],
        getAuthenticated: [
            "GET /app"
        ],
        getBySlug: [
            "GET /apps/{app_slug}"
        ],
        getInstallation: [
            "GET /app/installations/{installation_id}"
        ],
        getOrgInstallation: [
            "GET /orgs/{org}/installation"
        ],
        getRepoInstallation: [
            "GET /repos/{owner}/{repo}/installation"
        ],
        getSubscriptionPlanForAccount: [
            "GET /marketplace_listing/accounts/{account_id}"
        ],
        getSubscriptionPlanForAccountStubbed: [
            "GET /marketplace_listing/stubbed/accounts/{account_id}"
        ],
        getUserInstallation: [
            "GET /users/{username}/installation"
        ],
        getWebhookConfigForApp: [
            "GET /app/hook/config"
        ],
        getWebhookDelivery: [
            "GET /app/hook/deliveries/{delivery_id}"
        ],
        listAccountsForPlan: [
            "GET /marketplace_listing/plans/{plan_id}/accounts"
        ],
        listAccountsForPlanStubbed: [
            "GET /marketplace_listing/stubbed/plans/{plan_id}/accounts"
        ],
        listInstallationReposForAuthenticatedUser: [
            "GET /user/installations/{installation_id}/repositories"
        ],
        listInstallationRequestsForAuthenticatedApp: [
            "GET /app/installation-requests"
        ],
        listInstallations: [
            "GET /app/installations"
        ],
        listInstallationsForAuthenticatedUser: [
            "GET /user/installations"
        ],
        listPlans: [
            "GET /marketplace_listing/plans"
        ],
        listPlansStubbed: [
            "GET /marketplace_listing/stubbed/plans"
        ],
        listReposAccessibleToInstallation: [
            "GET /installation/repositories"
        ],
        listSubscriptionsForAuthenticatedUser: [
            "GET /user/marketplace_purchases"
        ],
        listSubscriptionsForAuthenticatedUserStubbed: [
            "GET /user/marketplace_purchases/stubbed"
        ],
        listWebhookDeliveries: [
            "GET /app/hook/deliveries"
        ],
        redeliverWebhookDelivery: [
            "POST /app/hook/deliveries/{delivery_id}/attempts"
        ],
        removeRepoFromInstallation: [
            "DELETE /user/installations/{installation_id}/repositories/{repository_id}",
            {},
            {
                renamed: [
                    "apps",
                    "removeRepoFromInstallationForAuthenticatedUser"
                ]
            }
        ],
        removeRepoFromInstallationForAuthenticatedUser: [
            "DELETE /user/installations/{installation_id}/repositories/{repository_id}"
        ],
        resetToken: [
            "PATCH /applications/{client_id}/token"
        ],
        revokeInstallationAccessToken: [
            "DELETE /installation/token"
        ],
        scopeToken: [
            "POST /applications/{client_id}/token/scoped"
        ],
        suspendInstallation: [
            "PUT /app/installations/{installation_id}/suspended"
        ],
        unsuspendInstallation: [
            "DELETE /app/installations/{installation_id}/suspended"
        ],
        updateWebhookConfigForApp: [
            "PATCH /app/hook/config"
        ]
    },
    billing: {
        getGithubActionsBillingOrg: [
            "GET /orgs/{org}/settings/billing/actions"
        ],
        getGithubActionsBillingUser: [
            "GET /users/{username}/settings/billing/actions"
        ],
        getGithubPackagesBillingOrg: [
            "GET /orgs/{org}/settings/billing/packages"
        ],
        getGithubPackagesBillingUser: [
            "GET /users/{username}/settings/billing/packages"
        ],
        getSharedStorageBillingOrg: [
            "GET /orgs/{org}/settings/billing/shared-storage"
        ],
        getSharedStorageBillingUser: [
            "GET /users/{username}/settings/billing/shared-storage"
        ]
    },
    checks: {
        create: [
            "POST /repos/{owner}/{repo}/check-runs"
        ],
        createSuite: [
            "POST /repos/{owner}/{repo}/check-suites"
        ],
        get: [
            "GET /repos/{owner}/{repo}/check-runs/{check_run_id}"
        ],
        getSuite: [
            "GET /repos/{owner}/{repo}/check-suites/{check_suite_id}"
        ],
        listAnnotations: [
            "GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations"
        ],
        listForRef: [
            "GET /repos/{owner}/{repo}/commits/{ref}/check-runs"
        ],
        listForSuite: [
            "GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs"
        ],
        listSuitesForRef: [
            "GET /repos/{owner}/{repo}/commits/{ref}/check-suites"
        ],
        rerequestRun: [
            "POST /repos/{owner}/{repo}/check-runs/{check_run_id}/rerequest"
        ],
        rerequestSuite: [
            "POST /repos/{owner}/{repo}/check-suites/{check_suite_id}/rerequest"
        ],
        setSuitesPreferences: [
            "PATCH /repos/{owner}/{repo}/check-suites/preferences"
        ],
        update: [
            "PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}"
        ]
    },
    codeScanning: {
        deleteAnalysis: [
            "DELETE /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}{?confirm_delete}"
        ],
        getAlert: [
            "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}",
            {},
            {
                renamedParameters: {
                    alert_id: "alert_number"
                }
            }
        ],
        getAnalysis: [
            "GET /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}"
        ],
        getCodeqlDatabase: [
            "GET /repos/{owner}/{repo}/code-scanning/codeql/databases/{language}"
        ],
        getDefaultSetup: [
            "GET /repos/{owner}/{repo}/code-scanning/default-setup"
        ],
        getSarif: [
            "GET /repos/{owner}/{repo}/code-scanning/sarifs/{sarif_id}"
        ],
        listAlertInstances: [
            "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances"
        ],
        listAlertsForOrg: [
            "GET /orgs/{org}/code-scanning/alerts"
        ],
        listAlertsForRepo: [
            "GET /repos/{owner}/{repo}/code-scanning/alerts"
        ],
        listAlertsInstances: [
            "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances",
            {},
            {
                renamed: [
                    "codeScanning",
                    "listAlertInstances"
                ]
            }
        ],
        listCodeqlDatabases: [
            "GET /repos/{owner}/{repo}/code-scanning/codeql/databases"
        ],
        listRecentAnalyses: [
            "GET /repos/{owner}/{repo}/code-scanning/analyses"
        ],
        updateAlert: [
            "PATCH /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}"
        ],
        updateDefaultSetup: [
            "PATCH /repos/{owner}/{repo}/code-scanning/default-setup"
        ],
        uploadSarif: [
            "POST /repos/{owner}/{repo}/code-scanning/sarifs"
        ]
    },
    codesOfConduct: {
        getAllCodesOfConduct: [
            "GET /codes_of_conduct"
        ],
        getConductCode: [
            "GET /codes_of_conduct/{key}"
        ]
    },
    codespaces: {
        addRepositoryForSecretForAuthenticatedUser: [
            "PUT /user/codespaces/secrets/{secret_name}/repositories/{repository_id}"
        ],
        addSelectedRepoToOrgSecret: [
            "PUT /orgs/{org}/codespaces/secrets/{secret_name}/repositories/{repository_id}"
        ],
        checkPermissionsForDevcontainer: [
            "GET /repos/{owner}/{repo}/codespaces/permissions_check"
        ],
        codespaceMachinesForAuthenticatedUser: [
            "GET /user/codespaces/{codespace_name}/machines"
        ],
        createForAuthenticatedUser: [
            "POST /user/codespaces"
        ],
        createOrUpdateOrgSecret: [
            "PUT /orgs/{org}/codespaces/secrets/{secret_name}"
        ],
        createOrUpdateRepoSecret: [
            "PUT /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"
        ],
        createOrUpdateSecretForAuthenticatedUser: [
            "PUT /user/codespaces/secrets/{secret_name}"
        ],
        createWithPrForAuthenticatedUser: [
            "POST /repos/{owner}/{repo}/pulls/{pull_number}/codespaces"
        ],
        createWithRepoForAuthenticatedUser: [
            "POST /repos/{owner}/{repo}/codespaces"
        ],
        deleteForAuthenticatedUser: [
            "DELETE /user/codespaces/{codespace_name}"
        ],
        deleteFromOrganization: [
            "DELETE /orgs/{org}/members/{username}/codespaces/{codespace_name}"
        ],
        deleteOrgSecret: [
            "DELETE /orgs/{org}/codespaces/secrets/{secret_name}"
        ],
        deleteRepoSecret: [
            "DELETE /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"
        ],
        deleteSecretForAuthenticatedUser: [
            "DELETE /user/codespaces/secrets/{secret_name}"
        ],
        exportForAuthenticatedUser: [
            "POST /user/codespaces/{codespace_name}/exports"
        ],
        getCodespacesForUserInOrg: [
            "GET /orgs/{org}/members/{username}/codespaces"
        ],
        getExportDetailsForAuthenticatedUser: [
            "GET /user/codespaces/{codespace_name}/exports/{export_id}"
        ],
        getForAuthenticatedUser: [
            "GET /user/codespaces/{codespace_name}"
        ],
        getOrgPublicKey: [
            "GET /orgs/{org}/codespaces/secrets/public-key"
        ],
        getOrgSecret: [
            "GET /orgs/{org}/codespaces/secrets/{secret_name}"
        ],
        getPublicKeyForAuthenticatedUser: [
            "GET /user/codespaces/secrets/public-key"
        ],
        getRepoPublicKey: [
            "GET /repos/{owner}/{repo}/codespaces/secrets/public-key"
        ],
        getRepoSecret: [
            "GET /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"
        ],
        getSecretForAuthenticatedUser: [
            "GET /user/codespaces/secrets/{secret_name}"
        ],
        listDevcontainersInRepositoryForAuthenticatedUser: [
            "GET /repos/{owner}/{repo}/codespaces/devcontainers"
        ],
        listForAuthenticatedUser: [
            "GET /user/codespaces"
        ],
        listInOrganization: [
            "GET /orgs/{org}/codespaces",
            {},
            {
                renamedParameters: {
                    org_id: "org"
                }
            }
        ],
        listInRepositoryForAuthenticatedUser: [
            "GET /repos/{owner}/{repo}/codespaces"
        ],
        listOrgSecrets: [
            "GET /orgs/{org}/codespaces/secrets"
        ],
        listRepoSecrets: [
            "GET /repos/{owner}/{repo}/codespaces/secrets"
        ],
        listRepositoriesForSecretForAuthenticatedUser: [
            "GET /user/codespaces/secrets/{secret_name}/repositories"
        ],
        listSecretsForAuthenticatedUser: [
            "GET /user/codespaces/secrets"
        ],
        listSelectedReposForOrgSecret: [
            "GET /orgs/{org}/codespaces/secrets/{secret_name}/repositories"
        ],
        preFlightWithRepoForAuthenticatedUser: [
            "GET /repos/{owner}/{repo}/codespaces/new"
        ],
        publishForAuthenticatedUser: [
            "POST /user/codespaces/{codespace_name}/publish"
        ],
        removeRepositoryForSecretForAuthenticatedUser: [
            "DELETE /user/codespaces/secrets/{secret_name}/repositories/{repository_id}"
        ],
        removeSelectedRepoFromOrgSecret: [
            "DELETE /orgs/{org}/codespaces/secrets/{secret_name}/repositories/{repository_id}"
        ],
        repoMachinesForAuthenticatedUser: [
            "GET /repos/{owner}/{repo}/codespaces/machines"
        ],
        setRepositoriesForSecretForAuthenticatedUser: [
            "PUT /user/codespaces/secrets/{secret_name}/repositories"
        ],
        setSelectedReposForOrgSecret: [
            "PUT /orgs/{org}/codespaces/secrets/{secret_name}/repositories"
        ],
        startForAuthenticatedUser: [
            "POST /user/codespaces/{codespace_name}/start"
        ],
        stopForAuthenticatedUser: [
            "POST /user/codespaces/{codespace_name}/stop"
        ],
        stopInOrganization: [
            "POST /orgs/{org}/members/{username}/codespaces/{codespace_name}/stop"
        ],
        updateForAuthenticatedUser: [
            "PATCH /user/codespaces/{codespace_name}"
        ]
    },
    copilot: {
        addCopilotSeatsForTeams: [
            "POST /orgs/{org}/copilot/billing/selected_teams"
        ],
        addCopilotSeatsForUsers: [
            "POST /orgs/{org}/copilot/billing/selected_users"
        ],
        cancelCopilotSeatAssignmentForTeams: [
            "DELETE /orgs/{org}/copilot/billing/selected_teams"
        ],
        cancelCopilotSeatAssignmentForUsers: [
            "DELETE /orgs/{org}/copilot/billing/selected_users"
        ],
        getCopilotOrganizationDetails: [
            "GET /orgs/{org}/copilot/billing"
        ],
        getCopilotSeatDetailsForUser: [
            "GET /orgs/{org}/members/{username}/copilot"
        ],
        listCopilotSeats: [
            "GET /orgs/{org}/copilot/billing/seats"
        ],
        usageMetricsForEnterprise: [
            "GET /enterprises/{enterprise}/copilot/usage"
        ],
        usageMetricsForOrg: [
            "GET /orgs/{org}/copilot/usage"
        ],
        usageMetricsForTeam: [
            "GET /orgs/{org}/team/{team_slug}/copilot/usage"
        ]
    },
    dependabot: {
        addSelectedRepoToOrgSecret: [
            "PUT /orgs/{org}/dependabot/secrets/{secret_name}/repositories/{repository_id}"
        ],
        createOrUpdateOrgSecret: [
            "PUT /orgs/{org}/dependabot/secrets/{secret_name}"
        ],
        createOrUpdateRepoSecret: [
            "PUT /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"
        ],
        deleteOrgSecret: [
            "DELETE /orgs/{org}/dependabot/secrets/{secret_name}"
        ],
        deleteRepoSecret: [
            "DELETE /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"
        ],
        getAlert: [
            "GET /repos/{owner}/{repo}/dependabot/alerts/{alert_number}"
        ],
        getOrgPublicKey: [
            "GET /orgs/{org}/dependabot/secrets/public-key"
        ],
        getOrgSecret: [
            "GET /orgs/{org}/dependabot/secrets/{secret_name}"
        ],
        getRepoPublicKey: [
            "GET /repos/{owner}/{repo}/dependabot/secrets/public-key"
        ],
        getRepoSecret: [
            "GET /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"
        ],
        listAlertsForEnterprise: [
            "GET /enterprises/{enterprise}/dependabot/alerts"
        ],
        listAlertsForOrg: [
            "GET /orgs/{org}/dependabot/alerts"
        ],
        listAlertsForRepo: [
            "GET /repos/{owner}/{repo}/dependabot/alerts"
        ],
        listOrgSecrets: [
            "GET /orgs/{org}/dependabot/secrets"
        ],
        listRepoSecrets: [
            "GET /repos/{owner}/{repo}/dependabot/secrets"
        ],
        listSelectedReposForOrgSecret: [
            "GET /orgs/{org}/dependabot/secrets/{secret_name}/repositories"
        ],
        removeSelectedRepoFromOrgSecret: [
            "DELETE /orgs/{org}/dependabot/secrets/{secret_name}/repositories/{repository_id}"
        ],
        setSelectedReposForOrgSecret: [
            "PUT /orgs/{org}/dependabot/secrets/{secret_name}/repositories"
        ],
        updateAlert: [
            "PATCH /repos/{owner}/{repo}/dependabot/alerts/{alert_number}"
        ]
    },
    dependencyGraph: {
        createRepositorySnapshot: [
            "POST /repos/{owner}/{repo}/dependency-graph/snapshots"
        ],
        diffRange: [
            "GET /repos/{owner}/{repo}/dependency-graph/compare/{basehead}"
        ],
        exportSbom: [
            "GET /repos/{owner}/{repo}/dependency-graph/sbom"
        ]
    },
    emojis: {
        get: [
            "GET /emojis"
        ]
    },
    gists: {
        checkIsStarred: [
            "GET /gists/{gist_id}/star"
        ],
        create: [
            "POST /gists"
        ],
        createComment: [
            "POST /gists/{gist_id}/comments"
        ],
        delete: [
            "DELETE /gists/{gist_id}"
        ],
        deleteComment: [
            "DELETE /gists/{gist_id}/comments/{comment_id}"
        ],
        fork: [
            "POST /gists/{gist_id}/forks"
        ],
        get: [
            "GET /gists/{gist_id}"
        ],
        getComment: [
            "GET /gists/{gist_id}/comments/{comment_id}"
        ],
        getRevision: [
            "GET /gists/{gist_id}/{sha}"
        ],
        list: [
            "GET /gists"
        ],
        listComments: [
            "GET /gists/{gist_id}/comments"
        ],
        listCommits: [
            "GET /gists/{gist_id}/commits"
        ],
        listForUser: [
            "GET /users/{username}/gists"
        ],
        listForks: [
            "GET /gists/{gist_id}/forks"
        ],
        listPublic: [
            "GET /gists/public"
        ],
        listStarred: [
            "GET /gists/starred"
        ],
        star: [
            "PUT /gists/{gist_id}/star"
        ],
        unstar: [
            "DELETE /gists/{gist_id}/star"
        ],
        update: [
            "PATCH /gists/{gist_id}"
        ],
        updateComment: [
            "PATCH /gists/{gist_id}/comments/{comment_id}"
        ]
    },
    git: {
        createBlob: [
            "POST /repos/{owner}/{repo}/git/blobs"
        ],
        createCommit: [
            "POST /repos/{owner}/{repo}/git/commits"
        ],
        createRef: [
            "POST /repos/{owner}/{repo}/git/refs"
        ],
        createTag: [
            "POST /repos/{owner}/{repo}/git/tags"
        ],
        createTree: [
            "POST /repos/{owner}/{repo}/git/trees"
        ],
        deleteRef: [
            "DELETE /repos/{owner}/{repo}/git/refs/{ref}"
        ],
        getBlob: [
            "GET /repos/{owner}/{repo}/git/blobs/{file_sha}"
        ],
        getCommit: [
            "GET /repos/{owner}/{repo}/git/commits/{commit_sha}"
        ],
        getRef: [
            "GET /repos/{owner}/{repo}/git/ref/{ref}"
        ],
        getTag: [
            "GET /repos/{owner}/{repo}/git/tags/{tag_sha}"
        ],
        getTree: [
            "GET /repos/{owner}/{repo}/git/trees/{tree_sha}"
        ],
        listMatchingRefs: [
            "GET /repos/{owner}/{repo}/git/matching-refs/{ref}"
        ],
        updateRef: [
            "PATCH /repos/{owner}/{repo}/git/refs/{ref}"
        ]
    },
    gitignore: {
        getAllTemplates: [
            "GET /gitignore/templates"
        ],
        getTemplate: [
            "GET /gitignore/templates/{name}"
        ]
    },
    interactions: {
        getRestrictionsForAuthenticatedUser: [
            "GET /user/interaction-limits"
        ],
        getRestrictionsForOrg: [
            "GET /orgs/{org}/interaction-limits"
        ],
        getRestrictionsForRepo: [
            "GET /repos/{owner}/{repo}/interaction-limits"
        ],
        getRestrictionsForYourPublicRepos: [
            "GET /user/interaction-limits",
            {},
            {
                renamed: [
                    "interactions",
                    "getRestrictionsForAuthenticatedUser"
                ]
            }
        ],
        removeRestrictionsForAuthenticatedUser: [
            "DELETE /user/interaction-limits"
        ],
        removeRestrictionsForOrg: [
            "DELETE /orgs/{org}/interaction-limits"
        ],
        removeRestrictionsForRepo: [
            "DELETE /repos/{owner}/{repo}/interaction-limits"
        ],
        removeRestrictionsForYourPublicRepos: [
            "DELETE /user/interaction-limits",
            {},
            {
                renamed: [
                    "interactions",
                    "removeRestrictionsForAuthenticatedUser"
                ]
            }
        ],
        setRestrictionsForAuthenticatedUser: [
            "PUT /user/interaction-limits"
        ],
        setRestrictionsForOrg: [
            "PUT /orgs/{org}/interaction-limits"
        ],
        setRestrictionsForRepo: [
            "PUT /repos/{owner}/{repo}/interaction-limits"
        ],
        setRestrictionsForYourPublicRepos: [
            "PUT /user/interaction-limits",
            {},
            {
                renamed: [
                    "interactions",
                    "setRestrictionsForAuthenticatedUser"
                ]
            }
        ]
    },
    issues: {
        addAssignees: [
            "POST /repos/{owner}/{repo}/issues/{issue_number}/assignees"
        ],
        addLabels: [
            "POST /repos/{owner}/{repo}/issues/{issue_number}/labels"
        ],
        checkUserCanBeAssigned: [
            "GET /repos/{owner}/{repo}/assignees/{assignee}"
        ],
        checkUserCanBeAssignedToIssue: [
            "GET /repos/{owner}/{repo}/issues/{issue_number}/assignees/{assignee}"
        ],
        create: [
            "POST /repos/{owner}/{repo}/issues"
        ],
        createComment: [
            "POST /repos/{owner}/{repo}/issues/{issue_number}/comments"
        ],
        createLabel: [
            "POST /repos/{owner}/{repo}/labels"
        ],
        createMilestone: [
            "POST /repos/{owner}/{repo}/milestones"
        ],
        deleteComment: [
            "DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}"
        ],
        deleteLabel: [
            "DELETE /repos/{owner}/{repo}/labels/{name}"
        ],
        deleteMilestone: [
            "DELETE /repos/{owner}/{repo}/milestones/{milestone_number}"
        ],
        get: [
            "GET /repos/{owner}/{repo}/issues/{issue_number}"
        ],
        getComment: [
            "GET /repos/{owner}/{repo}/issues/comments/{comment_id}"
        ],
        getEvent: [
            "GET /repos/{owner}/{repo}/issues/events/{event_id}"
        ],
        getLabel: [
            "GET /repos/{owner}/{repo}/labels/{name}"
        ],
        getMilestone: [
            "GET /repos/{owner}/{repo}/milestones/{milestone_number}"
        ],
        list: [
            "GET /issues"
        ],
        listAssignees: [
            "GET /repos/{owner}/{repo}/assignees"
        ],
        listComments: [
            "GET /repos/{owner}/{repo}/issues/{issue_number}/comments"
        ],
        listCommentsForRepo: [
            "GET /repos/{owner}/{repo}/issues/comments"
        ],
        listEvents: [
            "GET /repos/{owner}/{repo}/issues/{issue_number}/events"
        ],
        listEventsForRepo: [
            "GET /repos/{owner}/{repo}/issues/events"
        ],
        listEventsForTimeline: [
            "GET /repos/{owner}/{repo}/issues/{issue_number}/timeline"
        ],
        listForAuthenticatedUser: [
            "GET /user/issues"
        ],
        listForOrg: [
            "GET /orgs/{org}/issues"
        ],
        listForRepo: [
            "GET /repos/{owner}/{repo}/issues"
        ],
        listLabelsForMilestone: [
            "GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels"
        ],
        listLabelsForRepo: [
            "GET /repos/{owner}/{repo}/labels"
        ],
        listLabelsOnIssue: [
            "GET /repos/{owner}/{repo}/issues/{issue_number}/labels"
        ],
        listMilestones: [
            "GET /repos/{owner}/{repo}/milestones"
        ],
        lock: [
            "PUT /repos/{owner}/{repo}/issues/{issue_number}/lock"
        ],
        removeAllLabels: [
            "DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels"
        ],
        removeAssignees: [
            "DELETE /repos/{owner}/{repo}/issues/{issue_number}/assignees"
        ],
        removeLabel: [
            "DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}"
        ],
        setLabels: [
            "PUT /repos/{owner}/{repo}/issues/{issue_number}/labels"
        ],
        unlock: [
            "DELETE /repos/{owner}/{repo}/issues/{issue_number}/lock"
        ],
        update: [
            "PATCH /repos/{owner}/{repo}/issues/{issue_number}"
        ],
        updateComment: [
            "PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}"
        ],
        updateLabel: [
            "PATCH /repos/{owner}/{repo}/labels/{name}"
        ],
        updateMilestone: [
            "PATCH /repos/{owner}/{repo}/milestones/{milestone_number}"
        ]
    },
    licenses: {
        get: [
            "GET /licenses/{license}"
        ],
        getAllCommonlyUsed: [
            "GET /licenses"
        ],
        getForRepo: [
            "GET /repos/{owner}/{repo}/license"
        ]
    },
    markdown: {
        render: [
            "POST /markdown"
        ],
        renderRaw: [
            "POST /markdown/raw",
            {
                headers: {
                    "content-type": "text/plain; charset=utf-8"
                }
            }
        ]
    },
    meta: {
        get: [
            "GET /meta"
        ],
        getAllVersions: [
            "GET /versions"
        ],
        getOctocat: [
            "GET /octocat"
        ],
        getZen: [
            "GET /zen"
        ],
        root: [
            "GET /"
        ]
    },
    migrations: {
        deleteArchiveForAuthenticatedUser: [
            "DELETE /user/migrations/{migration_id}/archive"
        ],
        deleteArchiveForOrg: [
            "DELETE /orgs/{org}/migrations/{migration_id}/archive"
        ],
        downloadArchiveForOrg: [
            "GET /orgs/{org}/migrations/{migration_id}/archive"
        ],
        getArchiveForAuthenticatedUser: [
            "GET /user/migrations/{migration_id}/archive"
        ],
        getStatusForAuthenticatedUser: [
            "GET /user/migrations/{migration_id}"
        ],
        getStatusForOrg: [
            "GET /orgs/{org}/migrations/{migration_id}"
        ],
        listForAuthenticatedUser: [
            "GET /user/migrations"
        ],
        listForOrg: [
            "GET /orgs/{org}/migrations"
        ],
        listReposForAuthenticatedUser: [
            "GET /user/migrations/{migration_id}/repositories"
        ],
        listReposForOrg: [
            "GET /orgs/{org}/migrations/{migration_id}/repositories"
        ],
        listReposForUser: [
            "GET /user/migrations/{migration_id}/repositories",
            {},
            {
                renamed: [
                    "migrations",
                    "listReposForAuthenticatedUser"
                ]
            }
        ],
        startForAuthenticatedUser: [
            "POST /user/migrations"
        ],
        startForOrg: [
            "POST /orgs/{org}/migrations"
        ],
        unlockRepoForAuthenticatedUser: [
            "DELETE /user/migrations/{migration_id}/repos/{repo_name}/lock"
        ],
        unlockRepoForOrg: [
            "DELETE /orgs/{org}/migrations/{migration_id}/repos/{repo_name}/lock"
        ]
    },
    oidc: {
        getOidcCustomSubTemplateForOrg: [
            "GET /orgs/{org}/actions/oidc/customization/sub"
        ],
        updateOidcCustomSubTemplateForOrg: [
            "PUT /orgs/{org}/actions/oidc/customization/sub"
        ]
    },
    orgs: {
        addSecurityManagerTeam: [
            "PUT /orgs/{org}/security-managers/teams/{team_slug}"
        ],
        assignTeamToOrgRole: [
            "PUT /orgs/{org}/organization-roles/teams/{team_slug}/{role_id}"
        ],
        assignUserToOrgRole: [
            "PUT /orgs/{org}/organization-roles/users/{username}/{role_id}"
        ],
        blockUser: [
            "PUT /orgs/{org}/blocks/{username}"
        ],
        cancelInvitation: [
            "DELETE /orgs/{org}/invitations/{invitation_id}"
        ],
        checkBlockedUser: [
            "GET /orgs/{org}/blocks/{username}"
        ],
        checkMembershipForUser: [
            "GET /orgs/{org}/members/{username}"
        ],
        checkPublicMembershipForUser: [
            "GET /orgs/{org}/public_members/{username}"
        ],
        convertMemberToOutsideCollaborator: [
            "PUT /orgs/{org}/outside_collaborators/{username}"
        ],
        createCustomOrganizationRole: [
            "POST /orgs/{org}/organization-roles"
        ],
        createInvitation: [
            "POST /orgs/{org}/invitations"
        ],
        createOrUpdateCustomProperties: [
            "PATCH /orgs/{org}/properties/schema"
        ],
        createOrUpdateCustomPropertiesValuesForRepos: [
            "PATCH /orgs/{org}/properties/values"
        ],
        createOrUpdateCustomProperty: [
            "PUT /orgs/{org}/properties/schema/{custom_property_name}"
        ],
        createWebhook: [
            "POST /orgs/{org}/hooks"
        ],
        delete: [
            "DELETE /orgs/{org}"
        ],
        deleteCustomOrganizationRole: [
            "DELETE /orgs/{org}/organization-roles/{role_id}"
        ],
        deleteWebhook: [
            "DELETE /orgs/{org}/hooks/{hook_id}"
        ],
        enableOrDisableSecurityProductOnAllOrgRepos: [
            "POST /orgs/{org}/{security_product}/{enablement}"
        ],
        get: [
            "GET /orgs/{org}"
        ],
        getAllCustomProperties: [
            "GET /orgs/{org}/properties/schema"
        ],
        getCustomProperty: [
            "GET /orgs/{org}/properties/schema/{custom_property_name}"
        ],
        getMembershipForAuthenticatedUser: [
            "GET /user/memberships/orgs/{org}"
        ],
        getMembershipForUser: [
            "GET /orgs/{org}/memberships/{username}"
        ],
        getOrgRole: [
            "GET /orgs/{org}/organization-roles/{role_id}"
        ],
        getWebhook: [
            "GET /orgs/{org}/hooks/{hook_id}"
        ],
        getWebhookConfigForOrg: [
            "GET /orgs/{org}/hooks/{hook_id}/config"
        ],
        getWebhookDelivery: [
            "GET /orgs/{org}/hooks/{hook_id}/deliveries/{delivery_id}"
        ],
        list: [
            "GET /organizations"
        ],
        listAppInstallations: [
            "GET /orgs/{org}/installations"
        ],
        listBlockedUsers: [
            "GET /orgs/{org}/blocks"
        ],
        listCustomPropertiesValuesForRepos: [
            "GET /orgs/{org}/properties/values"
        ],
        listFailedInvitations: [
            "GET /orgs/{org}/failed_invitations"
        ],
        listForAuthenticatedUser: [
            "GET /user/orgs"
        ],
        listForUser: [
            "GET /users/{username}/orgs"
        ],
        listInvitationTeams: [
            "GET /orgs/{org}/invitations/{invitation_id}/teams"
        ],
        listMembers: [
            "GET /orgs/{org}/members"
        ],
        listMembershipsForAuthenticatedUser: [
            "GET /user/memberships/orgs"
        ],
        listOrgRoleTeams: [
            "GET /orgs/{org}/organization-roles/{role_id}/teams"
        ],
        listOrgRoleUsers: [
            "GET /orgs/{org}/organization-roles/{role_id}/users"
        ],
        listOrgRoles: [
            "GET /orgs/{org}/organization-roles"
        ],
        listOrganizationFineGrainedPermissions: [
            "GET /orgs/{org}/organization-fine-grained-permissions"
        ],
        listOutsideCollaborators: [
            "GET /orgs/{org}/outside_collaborators"
        ],
        listPatGrantRepositories: [
            "GET /orgs/{org}/personal-access-tokens/{pat_id}/repositories"
        ],
        listPatGrantRequestRepositories: [
            "GET /orgs/{org}/personal-access-token-requests/{pat_request_id}/repositories"
        ],
        listPatGrantRequests: [
            "GET /orgs/{org}/personal-access-token-requests"
        ],
        listPatGrants: [
            "GET /orgs/{org}/personal-access-tokens"
        ],
        listPendingInvitations: [
            "GET /orgs/{org}/invitations"
        ],
        listPublicMembers: [
            "GET /orgs/{org}/public_members"
        ],
        listSecurityManagerTeams: [
            "GET /orgs/{org}/security-managers"
        ],
        listWebhookDeliveries: [
            "GET /orgs/{org}/hooks/{hook_id}/deliveries"
        ],
        listWebhooks: [
            "GET /orgs/{org}/hooks"
        ],
        patchCustomOrganizationRole: [
            "PATCH /orgs/{org}/organization-roles/{role_id}"
        ],
        pingWebhook: [
            "POST /orgs/{org}/hooks/{hook_id}/pings"
        ],
        redeliverWebhookDelivery: [
            "POST /orgs/{org}/hooks/{hook_id}/deliveries/{delivery_id}/attempts"
        ],
        removeCustomProperty: [
            "DELETE /orgs/{org}/properties/schema/{custom_property_name}"
        ],
        removeMember: [
            "DELETE /orgs/{org}/members/{username}"
        ],
        removeMembershipForUser: [
            "DELETE /orgs/{org}/memberships/{username}"
        ],
        removeOutsideCollaborator: [
            "DELETE /orgs/{org}/outside_collaborators/{username}"
        ],
        removePublicMembershipForAuthenticatedUser: [
            "DELETE /orgs/{org}/public_members/{username}"
        ],
        removeSecurityManagerTeam: [
            "DELETE /orgs/{org}/security-managers/teams/{team_slug}"
        ],
        reviewPatGrantRequest: [
            "POST /orgs/{org}/personal-access-token-requests/{pat_request_id}"
        ],
        reviewPatGrantRequestsInBulk: [
            "POST /orgs/{org}/personal-access-token-requests"
        ],
        revokeAllOrgRolesTeam: [
            "DELETE /orgs/{org}/organization-roles/teams/{team_slug}"
        ],
        revokeAllOrgRolesUser: [
            "DELETE /orgs/{org}/organization-roles/users/{username}"
        ],
        revokeOrgRoleTeam: [
            "DELETE /orgs/{org}/organization-roles/teams/{team_slug}/{role_id}"
        ],
        revokeOrgRoleUser: [
            "DELETE /orgs/{org}/organization-roles/users/{username}/{role_id}"
        ],
        setMembershipForUser: [
            "PUT /orgs/{org}/memberships/{username}"
        ],
        setPublicMembershipForAuthenticatedUser: [
            "PUT /orgs/{org}/public_members/{username}"
        ],
        unblockUser: [
            "DELETE /orgs/{org}/blocks/{username}"
        ],
        update: [
            "PATCH /orgs/{org}"
        ],
        updateMembershipForAuthenticatedUser: [
            "PATCH /user/memberships/orgs/{org}"
        ],
        updatePatAccess: [
            "POST /orgs/{org}/personal-access-tokens/{pat_id}"
        ],
        updatePatAccesses: [
            "POST /orgs/{org}/personal-access-tokens"
        ],
        updateWebhook: [
            "PATCH /orgs/{org}/hooks/{hook_id}"
        ],
        updateWebhookConfigForOrg: [
            "PATCH /orgs/{org}/hooks/{hook_id}/config"
        ]
    },
    packages: {
        deletePackageForAuthenticatedUser: [
            "DELETE /user/packages/{package_type}/{package_name}"
        ],
        deletePackageForOrg: [
            "DELETE /orgs/{org}/packages/{package_type}/{package_name}"
        ],
        deletePackageForUser: [
            "DELETE /users/{username}/packages/{package_type}/{package_name}"
        ],
        deletePackageVersionForAuthenticatedUser: [
            "DELETE /user/packages/{package_type}/{package_name}/versions/{package_version_id}"
        ],
        deletePackageVersionForOrg: [
            "DELETE /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"
        ],
        deletePackageVersionForUser: [
            "DELETE /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}"
        ],
        getAllPackageVersionsForAPackageOwnedByAnOrg: [
            "GET /orgs/{org}/packages/{package_type}/{package_name}/versions",
            {},
            {
                renamed: [
                    "packages",
                    "getAllPackageVersionsForPackageOwnedByOrg"
                ]
            }
        ],
        getAllPackageVersionsForAPackageOwnedByTheAuthenticatedUser: [
            "GET /user/packages/{package_type}/{package_name}/versions",
            {},
            {
                renamed: [
                    "packages",
                    "getAllPackageVersionsForPackageOwnedByAuthenticatedUser"
                ]
            }
        ],
        getAllPackageVersionsForPackageOwnedByAuthenticatedUser: [
            "GET /user/packages/{package_type}/{package_name}/versions"
        ],
        getAllPackageVersionsForPackageOwnedByOrg: [
            "GET /orgs/{org}/packages/{package_type}/{package_name}/versions"
        ],
        getAllPackageVersionsForPackageOwnedByUser: [
            "GET /users/{username}/packages/{package_type}/{package_name}/versions"
        ],
        getPackageForAuthenticatedUser: [
            "GET /user/packages/{package_type}/{package_name}"
        ],
        getPackageForOrganization: [
            "GET /orgs/{org}/packages/{package_type}/{package_name}"
        ],
        getPackageForUser: [
            "GET /users/{username}/packages/{package_type}/{package_name}"
        ],
        getPackageVersionForAuthenticatedUser: [
            "GET /user/packages/{package_type}/{package_name}/versions/{package_version_id}"
        ],
        getPackageVersionForOrganization: [
            "GET /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"
        ],
        getPackageVersionForUser: [
            "GET /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}"
        ],
        listDockerMigrationConflictingPackagesForAuthenticatedUser: [
            "GET /user/docker/conflicts"
        ],
        listDockerMigrationConflictingPackagesForOrganization: [
            "GET /orgs/{org}/docker/conflicts"
        ],
        listDockerMigrationConflictingPackagesForUser: [
            "GET /users/{username}/docker/conflicts"
        ],
        listPackagesForAuthenticatedUser: [
            "GET /user/packages"
        ],
        listPackagesForOrganization: [
            "GET /orgs/{org}/packages"
        ],
        listPackagesForUser: [
            "GET /users/{username}/packages"
        ],
        restorePackageForAuthenticatedUser: [
            "POST /user/packages/{package_type}/{package_name}/restore{?token}"
        ],
        restorePackageForOrg: [
            "POST /orgs/{org}/packages/{package_type}/{package_name}/restore{?token}"
        ],
        restorePackageForUser: [
            "POST /users/{username}/packages/{package_type}/{package_name}/restore{?token}"
        ],
        restorePackageVersionForAuthenticatedUser: [
            "POST /user/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"
        ],
        restorePackageVersionForOrg: [
            "POST /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"
        ],
        restorePackageVersionForUser: [
            "POST /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"
        ]
    },
    projects: {
        addCollaborator: [
            "PUT /projects/{project_id}/collaborators/{username}"
        ],
        createCard: [
            "POST /projects/columns/{column_id}/cards"
        ],
        createColumn: [
            "POST /projects/{project_id}/columns"
        ],
        createForAuthenticatedUser: [
            "POST /user/projects"
        ],
        createForOrg: [
            "POST /orgs/{org}/projects"
        ],
        createForRepo: [
            "POST /repos/{owner}/{repo}/projects"
        ],
        delete: [
            "DELETE /projects/{project_id}"
        ],
        deleteCard: [
            "DELETE /projects/columns/cards/{card_id}"
        ],
        deleteColumn: [
            "DELETE /projects/columns/{column_id}"
        ],
        get: [
            "GET /projects/{project_id}"
        ],
        getCard: [
            "GET /projects/columns/cards/{card_id}"
        ],
        getColumn: [
            "GET /projects/columns/{column_id}"
        ],
        getPermissionForUser: [
            "GET /projects/{project_id}/collaborators/{username}/permission"
        ],
        listCards: [
            "GET /projects/columns/{column_id}/cards"
        ],
        listCollaborators: [
            "GET /projects/{project_id}/collaborators"
        ],
        listColumns: [
            "GET /projects/{project_id}/columns"
        ],
        listForOrg: [
            "GET /orgs/{org}/projects"
        ],
        listForRepo: [
            "GET /repos/{owner}/{repo}/projects"
        ],
        listForUser: [
            "GET /users/{username}/projects"
        ],
        moveCard: [
            "POST /projects/columns/cards/{card_id}/moves"
        ],
        moveColumn: [
            "POST /projects/columns/{column_id}/moves"
        ],
        removeCollaborator: [
            "DELETE /projects/{project_id}/collaborators/{username}"
        ],
        update: [
            "PATCH /projects/{project_id}"
        ],
        updateCard: [
            "PATCH /projects/columns/cards/{card_id}"
        ],
        updateColumn: [
            "PATCH /projects/columns/{column_id}"
        ]
    },
    pulls: {
        checkIfMerged: [
            "GET /repos/{owner}/{repo}/pulls/{pull_number}/merge"
        ],
        create: [
            "POST /repos/{owner}/{repo}/pulls"
        ],
        createReplyForReviewComment: [
            "POST /repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies"
        ],
        createReview: [
            "POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews"
        ],
        createReviewComment: [
            "POST /repos/{owner}/{repo}/pulls/{pull_number}/comments"
        ],
        deletePendingReview: [
            "DELETE /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"
        ],
        deleteReviewComment: [
            "DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}"
        ],
        dismissReview: [
            "PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/dismissals"
        ],
        get: [
            "GET /repos/{owner}/{repo}/pulls/{pull_number}"
        ],
        getReview: [
            "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"
        ],
        getReviewComment: [
            "GET /repos/{owner}/{repo}/pulls/comments/{comment_id}"
        ],
        list: [
            "GET /repos/{owner}/{repo}/pulls"
        ],
        listCommentsForReview: [
            "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments"
        ],
        listCommits: [
            "GET /repos/{owner}/{repo}/pulls/{pull_number}/commits"
        ],
        listFiles: [
            "GET /repos/{owner}/{repo}/pulls/{pull_number}/files"
        ],
        listRequestedReviewers: [
            "GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"
        ],
        listReviewComments: [
            "GET /repos/{owner}/{repo}/pulls/{pull_number}/comments"
        ],
        listReviewCommentsForRepo: [
            "GET /repos/{owner}/{repo}/pulls/comments"
        ],
        listReviews: [
            "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews"
        ],
        merge: [
            "PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge"
        ],
        removeRequestedReviewers: [
            "DELETE /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"
        ],
        requestReviewers: [
            "POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"
        ],
        submitReview: [
            "POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/events"
        ],
        update: [
            "PATCH /repos/{owner}/{repo}/pulls/{pull_number}"
        ],
        updateBranch: [
            "PUT /repos/{owner}/{repo}/pulls/{pull_number}/update-branch"
        ],
        updateReview: [
            "PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"
        ],
        updateReviewComment: [
            "PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}"
        ]
    },
    rateLimit: {
        get: [
            "GET /rate_limit"
        ]
    },
    reactions: {
        createForCommitComment: [
            "POST /repos/{owner}/{repo}/comments/{comment_id}/reactions"
        ],
        createForIssue: [
            "POST /repos/{owner}/{repo}/issues/{issue_number}/reactions"
        ],
        createForIssueComment: [
            "POST /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions"
        ],
        createForPullRequestReviewComment: [
            "POST /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions"
        ],
        createForRelease: [
            "POST /repos/{owner}/{repo}/releases/{release_id}/reactions"
        ],
        createForTeamDiscussionCommentInOrg: [
            "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions"
        ],
        createForTeamDiscussionInOrg: [
            "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions"
        ],
        deleteForCommitComment: [
            "DELETE /repos/{owner}/{repo}/comments/{comment_id}/reactions/{reaction_id}"
        ],
        deleteForIssue: [
            "DELETE /repos/{owner}/{repo}/issues/{issue_number}/reactions/{reaction_id}"
        ],
        deleteForIssueComment: [
            "DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions/{reaction_id}"
        ],
        deleteForPullRequestComment: [
            "DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions/{reaction_id}"
        ],
        deleteForRelease: [
            "DELETE /repos/{owner}/{repo}/releases/{release_id}/reactions/{reaction_id}"
        ],
        deleteForTeamDiscussion: [
            "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions/{reaction_id}"
        ],
        deleteForTeamDiscussionComment: [
            "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions/{reaction_id}"
        ],
        listForCommitComment: [
            "GET /repos/{owner}/{repo}/comments/{comment_id}/reactions"
        ],
        listForIssue: [
            "GET /repos/{owner}/{repo}/issues/{issue_number}/reactions"
        ],
        listForIssueComment: [
            "GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions"
        ],
        listForPullRequestReviewComment: [
            "GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions"
        ],
        listForRelease: [
            "GET /repos/{owner}/{repo}/releases/{release_id}/reactions"
        ],
        listForTeamDiscussionCommentInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions"
        ],
        listForTeamDiscussionInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions"
        ]
    },
    repos: {
        acceptInvitation: [
            "PATCH /user/repository_invitations/{invitation_id}",
            {},
            {
                renamed: [
                    "repos",
                    "acceptInvitationForAuthenticatedUser"
                ]
            }
        ],
        acceptInvitationForAuthenticatedUser: [
            "PATCH /user/repository_invitations/{invitation_id}"
        ],
        addAppAccessRestrictions: [
            "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
            {},
            {
                mapToData: "apps"
            }
        ],
        addCollaborator: [
            "PUT /repos/{owner}/{repo}/collaborators/{username}"
        ],
        addStatusCheckContexts: [
            "POST /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
            {},
            {
                mapToData: "contexts"
            }
        ],
        addTeamAccessRestrictions: [
            "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
            {},
            {
                mapToData: "teams"
            }
        ],
        addUserAccessRestrictions: [
            "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
            {},
            {
                mapToData: "users"
            }
        ],
        cancelPagesDeployment: [
            "POST /repos/{owner}/{repo}/pages/deployments/{pages_deployment_id}/cancel"
        ],
        checkAutomatedSecurityFixes: [
            "GET /repos/{owner}/{repo}/automated-security-fixes"
        ],
        checkCollaborator: [
            "GET /repos/{owner}/{repo}/collaborators/{username}"
        ],
        checkPrivateVulnerabilityReporting: [
            "GET /repos/{owner}/{repo}/private-vulnerability-reporting"
        ],
        checkVulnerabilityAlerts: [
            "GET /repos/{owner}/{repo}/vulnerability-alerts"
        ],
        codeownersErrors: [
            "GET /repos/{owner}/{repo}/codeowners/errors"
        ],
        compareCommits: [
            "GET /repos/{owner}/{repo}/compare/{base}...{head}"
        ],
        compareCommitsWithBasehead: [
            "GET /repos/{owner}/{repo}/compare/{basehead}"
        ],
        createAutolink: [
            "POST /repos/{owner}/{repo}/autolinks"
        ],
        createCommitComment: [
            "POST /repos/{owner}/{repo}/commits/{commit_sha}/comments"
        ],
        createCommitSignatureProtection: [
            "POST /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"
        ],
        createCommitStatus: [
            "POST /repos/{owner}/{repo}/statuses/{sha}"
        ],
        createDeployKey: [
            "POST /repos/{owner}/{repo}/keys"
        ],
        createDeployment: [
            "POST /repos/{owner}/{repo}/deployments"
        ],
        createDeploymentBranchPolicy: [
            "POST /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies"
        ],
        createDeploymentProtectionRule: [
            "POST /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules"
        ],
        createDeploymentStatus: [
            "POST /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"
        ],
        createDispatchEvent: [
            "POST /repos/{owner}/{repo}/dispatches"
        ],
        createForAuthenticatedUser: [
            "POST /user/repos"
        ],
        createFork: [
            "POST /repos/{owner}/{repo}/forks"
        ],
        createInOrg: [
            "POST /orgs/{org}/repos"
        ],
        createOrUpdateCustomPropertiesValues: [
            "PATCH /repos/{owner}/{repo}/properties/values"
        ],
        createOrUpdateEnvironment: [
            "PUT /repos/{owner}/{repo}/environments/{environment_name}"
        ],
        createOrUpdateFileContents: [
            "PUT /repos/{owner}/{repo}/contents/{path}"
        ],
        createOrgRuleset: [
            "POST /orgs/{org}/rulesets"
        ],
        createPagesDeployment: [
            "POST /repos/{owner}/{repo}/pages/deployments"
        ],
        createPagesSite: [
            "POST /repos/{owner}/{repo}/pages"
        ],
        createRelease: [
            "POST /repos/{owner}/{repo}/releases"
        ],
        createRepoRuleset: [
            "POST /repos/{owner}/{repo}/rulesets"
        ],
        createTagProtection: [
            "POST /repos/{owner}/{repo}/tags/protection"
        ],
        createUsingTemplate: [
            "POST /repos/{template_owner}/{template_repo}/generate"
        ],
        createWebhook: [
            "POST /repos/{owner}/{repo}/hooks"
        ],
        declineInvitation: [
            "DELETE /user/repository_invitations/{invitation_id}",
            {},
            {
                renamed: [
                    "repos",
                    "declineInvitationForAuthenticatedUser"
                ]
            }
        ],
        declineInvitationForAuthenticatedUser: [
            "DELETE /user/repository_invitations/{invitation_id}"
        ],
        delete: [
            "DELETE /repos/{owner}/{repo}"
        ],
        deleteAccessRestrictions: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"
        ],
        deleteAdminBranchProtection: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"
        ],
        deleteAnEnvironment: [
            "DELETE /repos/{owner}/{repo}/environments/{environment_name}"
        ],
        deleteAutolink: [
            "DELETE /repos/{owner}/{repo}/autolinks/{autolink_id}"
        ],
        deleteBranchProtection: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection"
        ],
        deleteCommitComment: [
            "DELETE /repos/{owner}/{repo}/comments/{comment_id}"
        ],
        deleteCommitSignatureProtection: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"
        ],
        deleteDeployKey: [
            "DELETE /repos/{owner}/{repo}/keys/{key_id}"
        ],
        deleteDeployment: [
            "DELETE /repos/{owner}/{repo}/deployments/{deployment_id}"
        ],
        deleteDeploymentBranchPolicy: [
            "DELETE /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"
        ],
        deleteFile: [
            "DELETE /repos/{owner}/{repo}/contents/{path}"
        ],
        deleteInvitation: [
            "DELETE /repos/{owner}/{repo}/invitations/{invitation_id}"
        ],
        deleteOrgRuleset: [
            "DELETE /orgs/{org}/rulesets/{ruleset_id}"
        ],
        deletePagesSite: [
            "DELETE /repos/{owner}/{repo}/pages"
        ],
        deletePullRequestReviewProtection: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"
        ],
        deleteRelease: [
            "DELETE /repos/{owner}/{repo}/releases/{release_id}"
        ],
        deleteReleaseAsset: [
            "DELETE /repos/{owner}/{repo}/releases/assets/{asset_id}"
        ],
        deleteRepoRuleset: [
            "DELETE /repos/{owner}/{repo}/rulesets/{ruleset_id}"
        ],
        deleteTagProtection: [
            "DELETE /repos/{owner}/{repo}/tags/protection/{tag_protection_id}"
        ],
        deleteWebhook: [
            "DELETE /repos/{owner}/{repo}/hooks/{hook_id}"
        ],
        disableAutomatedSecurityFixes: [
            "DELETE /repos/{owner}/{repo}/automated-security-fixes"
        ],
        disableDeploymentProtectionRule: [
            "DELETE /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/{protection_rule_id}"
        ],
        disablePrivateVulnerabilityReporting: [
            "DELETE /repos/{owner}/{repo}/private-vulnerability-reporting"
        ],
        disableVulnerabilityAlerts: [
            "DELETE /repos/{owner}/{repo}/vulnerability-alerts"
        ],
        downloadArchive: [
            "GET /repos/{owner}/{repo}/zipball/{ref}",
            {},
            {
                renamed: [
                    "repos",
                    "downloadZipballArchive"
                ]
            }
        ],
        downloadTarballArchive: [
            "GET /repos/{owner}/{repo}/tarball/{ref}"
        ],
        downloadZipballArchive: [
            "GET /repos/{owner}/{repo}/zipball/{ref}"
        ],
        enableAutomatedSecurityFixes: [
            "PUT /repos/{owner}/{repo}/automated-security-fixes"
        ],
        enablePrivateVulnerabilityReporting: [
            "PUT /repos/{owner}/{repo}/private-vulnerability-reporting"
        ],
        enableVulnerabilityAlerts: [
            "PUT /repos/{owner}/{repo}/vulnerability-alerts"
        ],
        generateReleaseNotes: [
            "POST /repos/{owner}/{repo}/releases/generate-notes"
        ],
        get: [
            "GET /repos/{owner}/{repo}"
        ],
        getAccessRestrictions: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"
        ],
        getAdminBranchProtection: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"
        ],
        getAllDeploymentProtectionRules: [
            "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules"
        ],
        getAllEnvironments: [
            "GET /repos/{owner}/{repo}/environments"
        ],
        getAllStatusCheckContexts: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts"
        ],
        getAllTopics: [
            "GET /repos/{owner}/{repo}/topics"
        ],
        getAppsWithAccessToProtectedBranch: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps"
        ],
        getAutolink: [
            "GET /repos/{owner}/{repo}/autolinks/{autolink_id}"
        ],
        getBranch: [
            "GET /repos/{owner}/{repo}/branches/{branch}"
        ],
        getBranchProtection: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection"
        ],
        getBranchRules: [
            "GET /repos/{owner}/{repo}/rules/branches/{branch}"
        ],
        getClones: [
            "GET /repos/{owner}/{repo}/traffic/clones"
        ],
        getCodeFrequencyStats: [
            "GET /repos/{owner}/{repo}/stats/code_frequency"
        ],
        getCollaboratorPermissionLevel: [
            "GET /repos/{owner}/{repo}/collaborators/{username}/permission"
        ],
        getCombinedStatusForRef: [
            "GET /repos/{owner}/{repo}/commits/{ref}/status"
        ],
        getCommit: [
            "GET /repos/{owner}/{repo}/commits/{ref}"
        ],
        getCommitActivityStats: [
            "GET /repos/{owner}/{repo}/stats/commit_activity"
        ],
        getCommitComment: [
            "GET /repos/{owner}/{repo}/comments/{comment_id}"
        ],
        getCommitSignatureProtection: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"
        ],
        getCommunityProfileMetrics: [
            "GET /repos/{owner}/{repo}/community/profile"
        ],
        getContent: [
            "GET /repos/{owner}/{repo}/contents/{path}"
        ],
        getContributorsStats: [
            "GET /repos/{owner}/{repo}/stats/contributors"
        ],
        getCustomDeploymentProtectionRule: [
            "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/{protection_rule_id}"
        ],
        getCustomPropertiesValues: [
            "GET /repos/{owner}/{repo}/properties/values"
        ],
        getDeployKey: [
            "GET /repos/{owner}/{repo}/keys/{key_id}"
        ],
        getDeployment: [
            "GET /repos/{owner}/{repo}/deployments/{deployment_id}"
        ],
        getDeploymentBranchPolicy: [
            "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"
        ],
        getDeploymentStatus: [
            "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses/{status_id}"
        ],
        getEnvironment: [
            "GET /repos/{owner}/{repo}/environments/{environment_name}"
        ],
        getLatestPagesBuild: [
            "GET /repos/{owner}/{repo}/pages/builds/latest"
        ],
        getLatestRelease: [
            "GET /repos/{owner}/{repo}/releases/latest"
        ],
        getOrgRuleSuite: [
            "GET /orgs/{org}/rulesets/rule-suites/{rule_suite_id}"
        ],
        getOrgRuleSuites: [
            "GET /orgs/{org}/rulesets/rule-suites"
        ],
        getOrgRuleset: [
            "GET /orgs/{org}/rulesets/{ruleset_id}"
        ],
        getOrgRulesets: [
            "GET /orgs/{org}/rulesets"
        ],
        getPages: [
            "GET /repos/{owner}/{repo}/pages"
        ],
        getPagesBuild: [
            "GET /repos/{owner}/{repo}/pages/builds/{build_id}"
        ],
        getPagesDeployment: [
            "GET /repos/{owner}/{repo}/pages/deployments/{pages_deployment_id}"
        ],
        getPagesHealthCheck: [
            "GET /repos/{owner}/{repo}/pages/health"
        ],
        getParticipationStats: [
            "GET /repos/{owner}/{repo}/stats/participation"
        ],
        getPullRequestReviewProtection: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"
        ],
        getPunchCardStats: [
            "GET /repos/{owner}/{repo}/stats/punch_card"
        ],
        getReadme: [
            "GET /repos/{owner}/{repo}/readme"
        ],
        getReadmeInDirectory: [
            "GET /repos/{owner}/{repo}/readme/{dir}"
        ],
        getRelease: [
            "GET /repos/{owner}/{repo}/releases/{release_id}"
        ],
        getReleaseAsset: [
            "GET /repos/{owner}/{repo}/releases/assets/{asset_id}"
        ],
        getReleaseByTag: [
            "GET /repos/{owner}/{repo}/releases/tags/{tag}"
        ],
        getRepoRuleSuite: [
            "GET /repos/{owner}/{repo}/rulesets/rule-suites/{rule_suite_id}"
        ],
        getRepoRuleSuites: [
            "GET /repos/{owner}/{repo}/rulesets/rule-suites"
        ],
        getRepoRuleset: [
            "GET /repos/{owner}/{repo}/rulesets/{ruleset_id}"
        ],
        getRepoRulesets: [
            "GET /repos/{owner}/{repo}/rulesets"
        ],
        getStatusChecksProtection: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"
        ],
        getTeamsWithAccessToProtectedBranch: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams"
        ],
        getTopPaths: [
            "GET /repos/{owner}/{repo}/traffic/popular/paths"
        ],
        getTopReferrers: [
            "GET /repos/{owner}/{repo}/traffic/popular/referrers"
        ],
        getUsersWithAccessToProtectedBranch: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users"
        ],
        getViews: [
            "GET /repos/{owner}/{repo}/traffic/views"
        ],
        getWebhook: [
            "GET /repos/{owner}/{repo}/hooks/{hook_id}"
        ],
        getWebhookConfigForRepo: [
            "GET /repos/{owner}/{repo}/hooks/{hook_id}/config"
        ],
        getWebhookDelivery: [
            "GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries/{delivery_id}"
        ],
        listActivities: [
            "GET /repos/{owner}/{repo}/activity"
        ],
        listAutolinks: [
            "GET /repos/{owner}/{repo}/autolinks"
        ],
        listBranches: [
            "GET /repos/{owner}/{repo}/branches"
        ],
        listBranchesForHeadCommit: [
            "GET /repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head"
        ],
        listCollaborators: [
            "GET /repos/{owner}/{repo}/collaborators"
        ],
        listCommentsForCommit: [
            "GET /repos/{owner}/{repo}/commits/{commit_sha}/comments"
        ],
        listCommitCommentsForRepo: [
            "GET /repos/{owner}/{repo}/comments"
        ],
        listCommitStatusesForRef: [
            "GET /repos/{owner}/{repo}/commits/{ref}/statuses"
        ],
        listCommits: [
            "GET /repos/{owner}/{repo}/commits"
        ],
        listContributors: [
            "GET /repos/{owner}/{repo}/contributors"
        ],
        listCustomDeploymentRuleIntegrations: [
            "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/apps"
        ],
        listDeployKeys: [
            "GET /repos/{owner}/{repo}/keys"
        ],
        listDeploymentBranchPolicies: [
            "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies"
        ],
        listDeploymentStatuses: [
            "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"
        ],
        listDeployments: [
            "GET /repos/{owner}/{repo}/deployments"
        ],
        listForAuthenticatedUser: [
            "GET /user/repos"
        ],
        listForOrg: [
            "GET /orgs/{org}/repos"
        ],
        listForUser: [
            "GET /users/{username}/repos"
        ],
        listForks: [
            "GET /repos/{owner}/{repo}/forks"
        ],
        listInvitations: [
            "GET /repos/{owner}/{repo}/invitations"
        ],
        listInvitationsForAuthenticatedUser: [
            "GET /user/repository_invitations"
        ],
        listLanguages: [
            "GET /repos/{owner}/{repo}/languages"
        ],
        listPagesBuilds: [
            "GET /repos/{owner}/{repo}/pages/builds"
        ],
        listPublic: [
            "GET /repositories"
        ],
        listPullRequestsAssociatedWithCommit: [
            "GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls"
        ],
        listReleaseAssets: [
            "GET /repos/{owner}/{repo}/releases/{release_id}/assets"
        ],
        listReleases: [
            "GET /repos/{owner}/{repo}/releases"
        ],
        listTagProtection: [
            "GET /repos/{owner}/{repo}/tags/protection"
        ],
        listTags: [
            "GET /repos/{owner}/{repo}/tags"
        ],
        listTeams: [
            "GET /repos/{owner}/{repo}/teams"
        ],
        listWebhookDeliveries: [
            "GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries"
        ],
        listWebhooks: [
            "GET /repos/{owner}/{repo}/hooks"
        ],
        merge: [
            "POST /repos/{owner}/{repo}/merges"
        ],
        mergeUpstream: [
            "POST /repos/{owner}/{repo}/merge-upstream"
        ],
        pingWebhook: [
            "POST /repos/{owner}/{repo}/hooks/{hook_id}/pings"
        ],
        redeliverWebhookDelivery: [
            "POST /repos/{owner}/{repo}/hooks/{hook_id}/deliveries/{delivery_id}/attempts"
        ],
        removeAppAccessRestrictions: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
            {},
            {
                mapToData: "apps"
            }
        ],
        removeCollaborator: [
            "DELETE /repos/{owner}/{repo}/collaborators/{username}"
        ],
        removeStatusCheckContexts: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
            {},
            {
                mapToData: "contexts"
            }
        ],
        removeStatusCheckProtection: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"
        ],
        removeTeamAccessRestrictions: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
            {},
            {
                mapToData: "teams"
            }
        ],
        removeUserAccessRestrictions: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
            {},
            {
                mapToData: "users"
            }
        ],
        renameBranch: [
            "POST /repos/{owner}/{repo}/branches/{branch}/rename"
        ],
        replaceAllTopics: [
            "PUT /repos/{owner}/{repo}/topics"
        ],
        requestPagesBuild: [
            "POST /repos/{owner}/{repo}/pages/builds"
        ],
        setAdminBranchProtection: [
            "POST /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"
        ],
        setAppAccessRestrictions: [
            "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
            {},
            {
                mapToData: "apps"
            }
        ],
        setStatusCheckContexts: [
            "PUT /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
            {},
            {
                mapToData: "contexts"
            }
        ],
        setTeamAccessRestrictions: [
            "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
            {},
            {
                mapToData: "teams"
            }
        ],
        setUserAccessRestrictions: [
            "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
            {},
            {
                mapToData: "users"
            }
        ],
        testPushWebhook: [
            "POST /repos/{owner}/{repo}/hooks/{hook_id}/tests"
        ],
        transfer: [
            "POST /repos/{owner}/{repo}/transfer"
        ],
        update: [
            "PATCH /repos/{owner}/{repo}"
        ],
        updateBranchProtection: [
            "PUT /repos/{owner}/{repo}/branches/{branch}/protection"
        ],
        updateCommitComment: [
            "PATCH /repos/{owner}/{repo}/comments/{comment_id}"
        ],
        updateDeploymentBranchPolicy: [
            "PUT /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"
        ],
        updateInformationAboutPagesSite: [
            "PUT /repos/{owner}/{repo}/pages"
        ],
        updateInvitation: [
            "PATCH /repos/{owner}/{repo}/invitations/{invitation_id}"
        ],
        updateOrgRuleset: [
            "PUT /orgs/{org}/rulesets/{ruleset_id}"
        ],
        updatePullRequestReviewProtection: [
            "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"
        ],
        updateRelease: [
            "PATCH /repos/{owner}/{repo}/releases/{release_id}"
        ],
        updateReleaseAsset: [
            "PATCH /repos/{owner}/{repo}/releases/assets/{asset_id}"
        ],
        updateRepoRuleset: [
            "PUT /repos/{owner}/{repo}/rulesets/{ruleset_id}"
        ],
        updateStatusCheckPotection: [
            "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks",
            {},
            {
                renamed: [
                    "repos",
                    "updateStatusCheckProtection"
                ]
            }
        ],
        updateStatusCheckProtection: [
            "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"
        ],
        updateWebhook: [
            "PATCH /repos/{owner}/{repo}/hooks/{hook_id}"
        ],
        updateWebhookConfigForRepo: [
            "PATCH /repos/{owner}/{repo}/hooks/{hook_id}/config"
        ],
        uploadReleaseAsset: [
            "POST /repos/{owner}/{repo}/releases/{release_id}/assets{?name,label}",
            {
                baseUrl: "https://uploads.github.com"
            }
        ]
    },
    search: {
        code: [
            "GET /search/code"
        ],
        commits: [
            "GET /search/commits"
        ],
        issuesAndPullRequests: [
            "GET /search/issues"
        ],
        labels: [
            "GET /search/labels"
        ],
        repos: [
            "GET /search/repositories"
        ],
        topics: [
            "GET /search/topics"
        ],
        users: [
            "GET /search/users"
        ]
    },
    secretScanning: {
        getAlert: [
            "GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"
        ],
        listAlertsForEnterprise: [
            "GET /enterprises/{enterprise}/secret-scanning/alerts"
        ],
        listAlertsForOrg: [
            "GET /orgs/{org}/secret-scanning/alerts"
        ],
        listAlertsForRepo: [
            "GET /repos/{owner}/{repo}/secret-scanning/alerts"
        ],
        listLocationsForAlert: [
            "GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}/locations"
        ],
        updateAlert: [
            "PATCH /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"
        ]
    },
    securityAdvisories: {
        createFork: [
            "POST /repos/{owner}/{repo}/security-advisories/{ghsa_id}/forks"
        ],
        createPrivateVulnerabilityReport: [
            "POST /repos/{owner}/{repo}/security-advisories/reports"
        ],
        createRepositoryAdvisory: [
            "POST /repos/{owner}/{repo}/security-advisories"
        ],
        createRepositoryAdvisoryCveRequest: [
            "POST /repos/{owner}/{repo}/security-advisories/{ghsa_id}/cve"
        ],
        getGlobalAdvisory: [
            "GET /advisories/{ghsa_id}"
        ],
        getRepositoryAdvisory: [
            "GET /repos/{owner}/{repo}/security-advisories/{ghsa_id}"
        ],
        listGlobalAdvisories: [
            "GET /advisories"
        ],
        listOrgRepositoryAdvisories: [
            "GET /orgs/{org}/security-advisories"
        ],
        listRepositoryAdvisories: [
            "GET /repos/{owner}/{repo}/security-advisories"
        ],
        updateRepositoryAdvisory: [
            "PATCH /repos/{owner}/{repo}/security-advisories/{ghsa_id}"
        ]
    },
    teams: {
        addOrUpdateMembershipForUserInOrg: [
            "PUT /orgs/{org}/teams/{team_slug}/memberships/{username}"
        ],
        addOrUpdateProjectPermissionsInOrg: [
            "PUT /orgs/{org}/teams/{team_slug}/projects/{project_id}"
        ],
        addOrUpdateRepoPermissionsInOrg: [
            "PUT /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"
        ],
        checkPermissionsForProjectInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/projects/{project_id}"
        ],
        checkPermissionsForRepoInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"
        ],
        create: [
            "POST /orgs/{org}/teams"
        ],
        createDiscussionCommentInOrg: [
            "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"
        ],
        createDiscussionInOrg: [
            "POST /orgs/{org}/teams/{team_slug}/discussions"
        ],
        deleteDiscussionCommentInOrg: [
            "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"
        ],
        deleteDiscussionInOrg: [
            "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"
        ],
        deleteInOrg: [
            "DELETE /orgs/{org}/teams/{team_slug}"
        ],
        getByName: [
            "GET /orgs/{org}/teams/{team_slug}"
        ],
        getDiscussionCommentInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"
        ],
        getDiscussionInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"
        ],
        getMembershipForUserInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/memberships/{username}"
        ],
        list: [
            "GET /orgs/{org}/teams"
        ],
        listChildInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/teams"
        ],
        listDiscussionCommentsInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"
        ],
        listDiscussionsInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/discussions"
        ],
        listForAuthenticatedUser: [
            "GET /user/teams"
        ],
        listMembersInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/members"
        ],
        listPendingInvitationsInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/invitations"
        ],
        listProjectsInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/projects"
        ],
        listReposInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/repos"
        ],
        removeMembershipForUserInOrg: [
            "DELETE /orgs/{org}/teams/{team_slug}/memberships/{username}"
        ],
        removeProjectInOrg: [
            "DELETE /orgs/{org}/teams/{team_slug}/projects/{project_id}"
        ],
        removeRepoInOrg: [
            "DELETE /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"
        ],
        updateDiscussionCommentInOrg: [
            "PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"
        ],
        updateDiscussionInOrg: [
            "PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"
        ],
        updateInOrg: [
            "PATCH /orgs/{org}/teams/{team_slug}"
        ]
    },
    users: {
        addEmailForAuthenticated: [
            "POST /user/emails",
            {},
            {
                renamed: [
                    "users",
                    "addEmailForAuthenticatedUser"
                ]
            }
        ],
        addEmailForAuthenticatedUser: [
            "POST /user/emails"
        ],
        addSocialAccountForAuthenticatedUser: [
            "POST /user/social_accounts"
        ],
        block: [
            "PUT /user/blocks/{username}"
        ],
        checkBlocked: [
            "GET /user/blocks/{username}"
        ],
        checkFollowingForUser: [
            "GET /users/{username}/following/{target_user}"
        ],
        checkPersonIsFollowedByAuthenticated: [
            "GET /user/following/{username}"
        ],
        createGpgKeyForAuthenticated: [
            "POST /user/gpg_keys",
            {},
            {
                renamed: [
                    "users",
                    "createGpgKeyForAuthenticatedUser"
                ]
            }
        ],
        createGpgKeyForAuthenticatedUser: [
            "POST /user/gpg_keys"
        ],
        createPublicSshKeyForAuthenticated: [
            "POST /user/keys",
            {},
            {
                renamed: [
                    "users",
                    "createPublicSshKeyForAuthenticatedUser"
                ]
            }
        ],
        createPublicSshKeyForAuthenticatedUser: [
            "POST /user/keys"
        ],
        createSshSigningKeyForAuthenticatedUser: [
            "POST /user/ssh_signing_keys"
        ],
        deleteEmailForAuthenticated: [
            "DELETE /user/emails",
            {},
            {
                renamed: [
                    "users",
                    "deleteEmailForAuthenticatedUser"
                ]
            }
        ],
        deleteEmailForAuthenticatedUser: [
            "DELETE /user/emails"
        ],
        deleteGpgKeyForAuthenticated: [
            "DELETE /user/gpg_keys/{gpg_key_id}",
            {},
            {
                renamed: [
                    "users",
                    "deleteGpgKeyForAuthenticatedUser"
                ]
            }
        ],
        deleteGpgKeyForAuthenticatedUser: [
            "DELETE /user/gpg_keys/{gpg_key_id}"
        ],
        deletePublicSshKeyForAuthenticated: [
            "DELETE /user/keys/{key_id}",
            {},
            {
                renamed: [
                    "users",
                    "deletePublicSshKeyForAuthenticatedUser"
                ]
            }
        ],
        deletePublicSshKeyForAuthenticatedUser: [
            "DELETE /user/keys/{key_id}"
        ],
        deleteSocialAccountForAuthenticatedUser: [
            "DELETE /user/social_accounts"
        ],
        deleteSshSigningKeyForAuthenticatedUser: [
            "DELETE /user/ssh_signing_keys/{ssh_signing_key_id}"
        ],
        follow: [
            "PUT /user/following/{username}"
        ],
        getAuthenticated: [
            "GET /user"
        ],
        getByUsername: [
            "GET /users/{username}"
        ],
        getContextForUser: [
            "GET /users/{username}/hovercard"
        ],
        getGpgKeyForAuthenticated: [
            "GET /user/gpg_keys/{gpg_key_id}",
            {},
            {
                renamed: [
                    "users",
                    "getGpgKeyForAuthenticatedUser"
                ]
            }
        ],
        getGpgKeyForAuthenticatedUser: [
            "GET /user/gpg_keys/{gpg_key_id}"
        ],
        getPublicSshKeyForAuthenticated: [
            "GET /user/keys/{key_id}",
            {},
            {
                renamed: [
                    "users",
                    "getPublicSshKeyForAuthenticatedUser"
                ]
            }
        ],
        getPublicSshKeyForAuthenticatedUser: [
            "GET /user/keys/{key_id}"
        ],
        getSshSigningKeyForAuthenticatedUser: [
            "GET /user/ssh_signing_keys/{ssh_signing_key_id}"
        ],
        list: [
            "GET /users"
        ],
        listBlockedByAuthenticated: [
            "GET /user/blocks",
            {},
            {
                renamed: [
                    "users",
                    "listBlockedByAuthenticatedUser"
                ]
            }
        ],
        listBlockedByAuthenticatedUser: [
            "GET /user/blocks"
        ],
        listEmailsForAuthenticated: [
            "GET /user/emails",
            {},
            {
                renamed: [
                    "users",
                    "listEmailsForAuthenticatedUser"
                ]
            }
        ],
        listEmailsForAuthenticatedUser: [
            "GET /user/emails"
        ],
        listFollowedByAuthenticated: [
            "GET /user/following",
            {},
            {
                renamed: [
                    "users",
                    "listFollowedByAuthenticatedUser"
                ]
            }
        ],
        listFollowedByAuthenticatedUser: [
            "GET /user/following"
        ],
        listFollowersForAuthenticatedUser: [
            "GET /user/followers"
        ],
        listFollowersForUser: [
            "GET /users/{username}/followers"
        ],
        listFollowingForUser: [
            "GET /users/{username}/following"
        ],
        listGpgKeysForAuthenticated: [
            "GET /user/gpg_keys",
            {},
            {
                renamed: [
                    "users",
                    "listGpgKeysForAuthenticatedUser"
                ]
            }
        ],
        listGpgKeysForAuthenticatedUser: [
            "GET /user/gpg_keys"
        ],
        listGpgKeysForUser: [
            "GET /users/{username}/gpg_keys"
        ],
        listPublicEmailsForAuthenticated: [
            "GET /user/public_emails",
            {},
            {
                renamed: [
                    "users",
                    "listPublicEmailsForAuthenticatedUser"
                ]
            }
        ],
        listPublicEmailsForAuthenticatedUser: [
            "GET /user/public_emails"
        ],
        listPublicKeysForUser: [
            "GET /users/{username}/keys"
        ],
        listPublicSshKeysForAuthenticated: [
            "GET /user/keys",
            {},
            {
                renamed: [
                    "users",
                    "listPublicSshKeysForAuthenticatedUser"
                ]
            }
        ],
        listPublicSshKeysForAuthenticatedUser: [
            "GET /user/keys"
        ],
        listSocialAccountsForAuthenticatedUser: [
            "GET /user/social_accounts"
        ],
        listSocialAccountsForUser: [
            "GET /users/{username}/social_accounts"
        ],
        listSshSigningKeysForAuthenticatedUser: [
            "GET /user/ssh_signing_keys"
        ],
        listSshSigningKeysForUser: [
            "GET /users/{username}/ssh_signing_keys"
        ],
        setPrimaryEmailVisibilityForAuthenticated: [
            "PATCH /user/email/visibility",
            {},
            {
                renamed: [
                    "users",
                    "setPrimaryEmailVisibilityForAuthenticatedUser"
                ]
            }
        ],
        setPrimaryEmailVisibilityForAuthenticatedUser: [
            "PATCH /user/email/visibility"
        ],
        unblock: [
            "DELETE /user/blocks/{username}"
        ],
        unfollow: [
            "DELETE /user/following/{username}"
        ],
        updateAuthenticated: [
            "PATCH /user"
        ]
    }
};
var endpoints_default = Endpoints;
// pkg/dist-src/endpoints-to-methods.js
var endpointMethodsMap = /* @__PURE__ */ new Map();
for (const [scope, endpoints] of Object.entries(endpoints_default)){
    for (const [methodName, endpoint] of Object.entries(endpoints)){
        const [route, defaults, decorations] = endpoint;
        const [method, url] = route.split(/ /);
        const endpointDefaults = Object.assign({
            method,
            url
        }, defaults);
        if (!endpointMethodsMap.has(scope)) {
            endpointMethodsMap.set(scope, /* @__PURE__ */ new Map());
        }
        endpointMethodsMap.get(scope).set(methodName, {
            scope,
            methodName,
            endpointDefaults,
            decorations
        });
    }
}
var handler = {
    has ({ scope }, methodName) {
        return endpointMethodsMap.get(scope).has(methodName);
    },
    getOwnPropertyDescriptor (target, methodName) {
        return {
            value: this.get(target, methodName),
            // ensures method is in the cache
            configurable: true,
            writable: true,
            enumerable: true
        };
    },
    defineProperty (target, methodName, descriptor) {
        Object.defineProperty(target.cache, methodName, descriptor);
        return true;
    },
    deleteProperty (target, methodName) {
        delete target.cache[methodName];
        return true;
    },
    ownKeys ({ scope }) {
        return [
            ...endpointMethodsMap.get(scope).keys()
        ];
    },
    set (target, methodName, value) {
        return target.cache[methodName] = value;
    },
    get ({ octokit, scope, cache }, methodName) {
        if (cache[methodName]) {
            return cache[methodName];
        }
        const method = endpointMethodsMap.get(scope).get(methodName);
        if (!method) {
            return void 0;
        }
        const { endpointDefaults, decorations } = method;
        if (decorations) {
            cache[methodName] = decorate(octokit, scope, methodName, endpointDefaults, decorations);
        } else {
            cache[methodName] = octokit.request.defaults(endpointDefaults);
        }
        return cache[methodName];
    }
};
function endpointsToMethods(octokit) {
    const newMethods = {};
    for (const scope of endpointMethodsMap.keys()){
        newMethods[scope] = new Proxy({
            octokit,
            scope,
            cache: {}
        }, handler);
    }
    return newMethods;
}
function decorate(octokit, scope, methodName, defaults, decorations) {
    const requestWithDefaults = octokit.request.defaults(defaults);
    function withDecorations(...args) {
        let options = requestWithDefaults.endpoint.merge(...args);
        if (decorations.mapToData) {
            options = Object.assign({}, options, {
                data: options[decorations.mapToData],
                [decorations.mapToData]: void 0
            });
            return requestWithDefaults(options);
        }
        if (decorations.renamed) {
            const [newScope, newMethodName] = decorations.renamed;
            octokit.log.warn(`octokit.${scope}.${methodName}() has been renamed to octokit.${newScope}.${newMethodName}()`);
        }
        if (decorations.deprecated) {
            octokit.log.warn(decorations.deprecated);
        }
        if (decorations.renamedParameters) {
            const options2 = requestWithDefaults.endpoint.merge(...args);
            for (const [name, alias] of Object.entries(decorations.renamedParameters)){
                if (name in options2) {
                    octokit.log.warn(`"${name}" parameter is deprecated for "octokit.${scope}.${methodName}()". Use "${alias}" instead`);
                    if (!(alias in options2)) {
                        options2[alias] = options2[name];
                    }
                    delete options2[name];
                }
            }
            return requestWithDefaults(options2);
        }
        return requestWithDefaults(...args);
    }
    return Object.assign(withDecorations, requestWithDefaults);
}
// pkg/dist-src/index.js
function restEndpointMethods(octokit) {
    const api = endpointsToMethods(octokit);
    return {
        rest: api
    };
}
restEndpointMethods.VERSION = VERSION;
function legacyRestEndpointMethods(octokit) {
    const api = endpointsToMethods(octokit);
    return {
        ...api,
        rest: api
    };
}
legacyRestEndpointMethods.VERSION = VERSION;
// Annotate the CommonJS export names for ESM import in node:
0 && (0);


/***/ }),

/***/ 89227:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all)=>{
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = (to, from, except, desc)=>{
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
            get: ()=>from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
    return to;
};
var __toESM = (mod, isNodeMode, target)=>(target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(// If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
        value: mod,
        enumerable: true
    }) : target, mod));
var __toCommonJS = (mod)=>__copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
// pkg/dist-src/index.js
var dist_src_exports = {};
__export(dist_src_exports, {
    VERSION: ()=>VERSION,
    retry: ()=>retry
});
module.exports = __toCommonJS(dist_src_exports);
var import_core = __webpack_require__(4032);
// pkg/dist-src/error-request.js
async function errorRequest(state, octokit, error, options) {
    if (!error.request || !error.request.request) {
        throw error;
    }
    if (error.status >= 400 && !state.doNotRetry.includes(error.status)) {
        const retries = options.request.retries != null ? options.request.retries : state.retries;
        const retryAfter = Math.pow((options.request.retryCount || 0) + 1, 2);
        throw octokit.retry.retryRequest(error, retries, retryAfter);
    }
    throw error;
}
// pkg/dist-src/wrap-request.js
var import_light = __toESM(__webpack_require__(84342));
var import_request_error = __webpack_require__(32806);
async function wrapRequest(state, octokit, request, options) {
    const limiter = new import_light.default();
    limiter.on("failed", function(error, info) {
        const maxRetries = ~~error.request.request.retries;
        const after = ~~error.request.request.retryAfter;
        options.request.retryCount = info.retryCount + 1;
        if (maxRetries > info.retryCount) {
            return after * state.retryAfterBaseValue;
        }
    });
    return limiter.schedule(requestWithGraphqlErrorHandling.bind(null, state, octokit, request), options);
}
async function requestWithGraphqlErrorHandling(state, octokit, request, options) {
    const response = await request(request, options);
    if (response.data && response.data.errors && /Something went wrong while executing your query/.test(response.data.errors[0].message)) {
        const error = new import_request_error.RequestError(response.data.errors[0].message, 500, {
            request: options,
            response
        });
        return errorRequest(state, octokit, error, options);
    }
    return response;
}
// pkg/dist-src/index.js
var VERSION = "6.0.1";
function retry(octokit, octokitOptions) {
    const state = Object.assign({
        enabled: true,
        retryAfterBaseValue: 1e3,
        doNotRetry: [
            400,
            401,
            403,
            404,
            422,
            451
        ],
        retries: 3
    }, octokitOptions.retry);
    if (state.enabled) {
        octokit.hook.error("request", errorRequest.bind(null, state, octokit));
        octokit.hook.wrap("request", wrapRequest.bind(null, state, octokit));
    }
    return {
        retry: {
            retryRequest: (error, retries, retryAfter)=>{
                error.request.request = Object.assign({}, error.request.request, {
                    retries,
                    retryAfter
                });
                return error;
            }
        }
    };
}
retry.VERSION = VERSION;
// Annotate the CommonJS export names for ESM import in node:
0 && (0);


/***/ }),

/***/ 75874:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all)=>{
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = (to, from, except, desc)=>{
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
            get: ()=>from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
    return to;
};
var __toESM = (mod, isNodeMode, target)=>(target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(// If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
        value: mod,
        enumerable: true
    }) : target, mod));
var __toCommonJS = (mod)=>__copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
// pkg/dist-src/index.js
var dist_src_exports = {};
__export(dist_src_exports, {
    throttling: ()=>throttling
});
module.exports = __toCommonJS(dist_src_exports);
var import_light = __toESM(__webpack_require__(84342));
var import_core = __webpack_require__(4032);
// pkg/dist-src/version.js
var VERSION = "8.2.0";
// pkg/dist-src/wrap-request.js
var noop = ()=>Promise.resolve();
function wrapRequest(state, request, options) {
    return state.retryLimiter.schedule(doRequest, state, request, options);
}
async function doRequest(state, request, options) {
    const isWrite = options.method !== "GET" && options.method !== "HEAD";
    const { pathname } = new URL(options.url, "http://github.test");
    const isSearch = options.method === "GET" && pathname.startsWith("/search/");
    const isGraphQL = pathname.startsWith("/graphql");
    const retryCount = ~~request.retryCount;
    const jobOptions = retryCount > 0 ? {
        priority: 0,
        weight: 0
    } : {};
    if (state.clustering) {
        jobOptions.expiration = 1e3 * 60;
    }
    if (isWrite || isGraphQL) {
        await state.write.key(state.id).schedule(jobOptions, noop);
    }
    if (isWrite && state.triggersNotification(pathname)) {
        await state.notifications.key(state.id).schedule(jobOptions, noop);
    }
    if (isSearch) {
        await state.search.key(state.id).schedule(jobOptions, noop);
    }
    const req = state.global.key(state.id).schedule(jobOptions, request, options);
    if (isGraphQL) {
        const res = await req;
        if (res.data.errors != null && res.data.errors.some((error)=>error.type === "RATE_LIMITED")) {
            const error = Object.assign(new Error("GraphQL Rate Limit Exceeded"), {
                response: res,
                data: res.data
            });
            throw error;
        }
    }
    return req;
}
// pkg/dist-src/generated/triggers-notification-paths.js
var triggers_notification_paths_default = [
    "/orgs/{org}/invitations",
    "/orgs/{org}/invitations/{invitation_id}",
    "/orgs/{org}/teams/{team_slug}/discussions",
    "/orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments",
    "/repos/{owner}/{repo}/collaborators/{username}",
    "/repos/{owner}/{repo}/commits/{commit_sha}/comments",
    "/repos/{owner}/{repo}/issues",
    "/repos/{owner}/{repo}/issues/{issue_number}/comments",
    "/repos/{owner}/{repo}/pulls",
    "/repos/{owner}/{repo}/pulls/{pull_number}/comments",
    "/repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies",
    "/repos/{owner}/{repo}/pulls/{pull_number}/merge",
    "/repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers",
    "/repos/{owner}/{repo}/pulls/{pull_number}/reviews",
    "/repos/{owner}/{repo}/releases",
    "/teams/{team_id}/discussions",
    "/teams/{team_id}/discussions/{discussion_number}/comments"
];
// pkg/dist-src/route-matcher.js
function routeMatcher(paths) {
    const regexes = paths.map((path)=>path.split("/").map((c)=>c.startsWith("{") ? "(?:.+?)" : c).join("/"));
    const regex2 = `^(?:${regexes.map((r)=>`(?:${r})`).join("|")})[^/]*$`;
    return new RegExp(regex2, "i");
}
// pkg/dist-src/index.js
var regex = routeMatcher(triggers_notification_paths_default);
var triggersNotification = regex.test.bind(regex);
var groups = {};
var createGroups = function(Bottleneck, common) {
    groups.global = new Bottleneck.Group({
        id: "octokit-global",
        maxConcurrent: 10,
        ...common
    });
    groups.search = new Bottleneck.Group({
        id: "octokit-search",
        maxConcurrent: 1,
        minTime: 2e3,
        ...common
    });
    groups.write = new Bottleneck.Group({
        id: "octokit-write",
        maxConcurrent: 1,
        minTime: 1e3,
        ...common
    });
    groups.notifications = new Bottleneck.Group({
        id: "octokit-notifications",
        maxConcurrent: 1,
        minTime: 3e3,
        ...common
    });
};
function throttling(octokit, octokitOptions) {
    const { enabled = true, Bottleneck = import_light.default, id = "no-id", timeout = 1e3 * 60 * 2, // Redis TTL: 2 minutes
    connection } = octokitOptions.throttle || {};
    if (!enabled) {
        return {};
    }
    const common = {
        connection,
        timeout
    };
    if (groups.global == null) {
        createGroups(Bottleneck, common);
    }
    const state = Object.assign({
        clustering: connection != null,
        triggersNotification,
        fallbackSecondaryRateRetryAfter: 60,
        retryAfterBaseValue: 1e3,
        retryLimiter: new Bottleneck(),
        id,
        ...groups
    }, octokitOptions.throttle);
    if (typeof state.onSecondaryRateLimit !== "function" || typeof state.onRateLimit !== "function") {
        throw new Error(`octokit/plugin-throttling error:
        You must pass the onSecondaryRateLimit and onRateLimit error handlers.
        See https://octokit.github.io/rest.js/#throttling

        const octokit = new Octokit({
          throttle: {
            onSecondaryRateLimit: (retryAfter, options) => {/* ... */},
            onRateLimit: (retryAfter, options) => {/* ... */}
          }
        })
    `);
    }
    const events = {};
    const emitter = new Bottleneck.Events(events);
    events.on("secondary-limit", state.onSecondaryRateLimit);
    events.on("rate-limit", state.onRateLimit);
    events.on("error", (e)=>octokit.log.warn("Error in throttling-plugin limit handler", e));
    state.retryLimiter.on("failed", async function(error, info) {
        const [state2, request, options] = info.args;
        const { pathname } = new URL(options.url, "http://github.test");
        const shouldRetryGraphQL = pathname.startsWith("/graphql") && error.status !== 401;
        if (!(shouldRetryGraphQL || error.status === 403)) {
            return;
        }
        const retryCount = ~~request.retryCount;
        request.retryCount = retryCount;
        options.request.retryCount = retryCount;
        const { wantRetry, retryAfter = 0 } = await async function() {
            if (/\bsecondary rate\b/i.test(error.message)) {
                const retryAfter2 = Number(error.response.headers["retry-after"]) || state2.fallbackSecondaryRateRetryAfter;
                const wantRetry2 = await emitter.trigger("secondary-limit", retryAfter2, options, octokit, retryCount);
                return {
                    wantRetry: wantRetry2,
                    retryAfter: retryAfter2
                };
            }
            if (error.response.headers != null && error.response.headers["x-ratelimit-remaining"] === "0" || (error.response.data?.errors ?? []).some((error2)=>error2.type === "RATE_LIMITED")) {
                const rateLimitReset = new Date(~~error.response.headers["x-ratelimit-reset"] * 1e3).getTime();
                const retryAfter2 = Math.max(// Add one second so we retry _after_ the reset time
                // https://docs.github.com/en/rest/overview/resources-in-the-rest-api?apiVersion=2022-11-28#exceeding-the-rate-limit
                Math.ceil((rateLimitReset - Date.now()) / 1e3) + 1, 0);
                const wantRetry2 = await emitter.trigger("rate-limit", retryAfter2, options, octokit, retryCount);
                return {
                    wantRetry: wantRetry2,
                    retryAfter: retryAfter2
                };
            }
            return {};
        }();
        if (wantRetry) {
            request.retryCount++;
            return retryAfter * state2.retryAfterBaseValue;
        }
    });
    octokit.hook.wrap("request", wrapRequest.bind(null, state));
    return {};
}
throttling.VERSION = VERSION;
throttling.triggersNotification = triggersNotification;
// Annotate the CommonJS export names for ESM import in node:
0 && (0);


/***/ }),

/***/ 32806:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all)=>{
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = (to, from, except, desc)=>{
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
            get: ()=>from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
    return to;
};
var __toESM = (mod, isNodeMode, target)=>(target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(// If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
        value: mod,
        enumerable: true
    }) : target, mod));
var __toCommonJS = (mod)=>__copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
// pkg/dist-src/index.js
var dist_src_exports = {};
__export(dist_src_exports, {
    RequestError: ()=>RequestError
});
module.exports = __toCommonJS(dist_src_exports);
var import_deprecation = __webpack_require__(753);
var import_once = __toESM(__webpack_require__(68922));
var logOnceCode = (0, import_once.default)((deprecation)=>console.warn(deprecation));
var logOnceHeaders = (0, import_once.default)((deprecation)=>console.warn(deprecation));
var RequestError = class extends Error {
    constructor(message, statusCode, options){
        super(message);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
        this.name = "HttpError";
        this.status = statusCode;
        let headers;
        if ("headers" in options && typeof options.headers !== "undefined") {
            headers = options.headers;
        }
        if ("response" in options) {
            this.response = options.response;
            headers = options.response.headers;
        }
        const requestCopy = Object.assign({}, options.request);
        if (options.request.headers.authorization) {
            requestCopy.headers = Object.assign({}, options.request.headers, {
                authorization: options.request.headers.authorization.replace(/ .*$/, " [REDACTED]")
            });
        }
        requestCopy.url = requestCopy.url.replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]").replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
        this.request = requestCopy;
        Object.defineProperty(this, "code", {
            get () {
                logOnceCode(new import_deprecation.Deprecation("[@octokit/request-error] `error.code` is deprecated, use `error.status`."));
                return statusCode;
            }
        });
        Object.defineProperty(this, "headers", {
            get () {
                logOnceHeaders(new import_deprecation.Deprecation("[@octokit/request-error] `error.headers` is deprecated, use `error.response.headers`."));
                return headers || {};
            }
        });
    }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (0);


/***/ }),

/***/ 4499:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all)=>{
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = (to, from, except, desc)=>{
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
            get: ()=>from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
    return to;
};
var __toCommonJS = (mod)=>__copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
// pkg/dist-src/index.js
var dist_src_exports = {};
__export(dist_src_exports, {
    request: ()=>request
});
module.exports = __toCommonJS(dist_src_exports);
var import_endpoint = __webpack_require__(23277);
var import_universal_user_agent = __webpack_require__(33716);
// pkg/dist-src/version.js
var VERSION = "8.4.0";
// pkg/dist-src/is-plain-object.js
function isPlainObject(value) {
    if (typeof value !== "object" || value === null) return false;
    if (Object.prototype.toString.call(value) !== "[object Object]") return false;
    const proto = Object.getPrototypeOf(value);
    if (proto === null) return true;
    const Ctor = Object.prototype.hasOwnProperty.call(proto, "constructor") && proto.constructor;
    return typeof Ctor === "function" && Ctor instanceof Ctor && Function.prototype.call(Ctor) === Function.prototype.call(value);
}
// pkg/dist-src/fetch-wrapper.js
var import_request_error = __webpack_require__(32806);
// pkg/dist-src/get-buffer-response.js
function getBufferResponse(response) {
    return response.arrayBuffer();
}
// pkg/dist-src/fetch-wrapper.js
function fetchWrapper(requestOptions) {
    var _a, _b, _c, _d;
    const log = requestOptions.request && requestOptions.request.log ? requestOptions.request.log : console;
    const parseSuccessResponseBody = ((_a = requestOptions.request) == null ? void 0 : _a.parseSuccessResponseBody) !== false;
    if (isPlainObject(requestOptions.body) || Array.isArray(requestOptions.body)) {
        requestOptions.body = JSON.stringify(requestOptions.body);
    }
    let headers = {};
    let status;
    let url;
    let { fetch } = globalThis;
    if ((_b = requestOptions.request) == null ? void 0 : _b.fetch) {
        fetch = requestOptions.request.fetch;
    }
    if (!fetch) {
        throw new Error("fetch is not set. Please pass a fetch implementation as new Octokit({ request: { fetch }}). Learn more at https://github.com/octokit/octokit.js/#fetch-missing");
    }
    return fetch(requestOptions.url, {
        method: requestOptions.method,
        body: requestOptions.body,
        redirect: (_c = requestOptions.request) == null ? void 0 : _c.redirect,
        headers: requestOptions.headers,
        signal: (_d = requestOptions.request) == null ? void 0 : _d.signal,
        // duplex must be set if request.body is ReadableStream or Async Iterables.
        // See https://fetch.spec.whatwg.org/#dom-requestinit-duplex.
        ...requestOptions.body && {
            duplex: "half"
        }
    }).then(async (response)=>{
        url = response.url;
        status = response.status;
        for (const keyAndValue of response.headers){
            headers[keyAndValue[0]] = keyAndValue[1];
        }
        if ("deprecation" in headers) {
            const matches = headers.link && headers.link.match(/<([^>]+)>; rel="deprecation"/);
            const deprecationLink = matches && matches.pop();
            log.warn(`[@octokit/request] "${requestOptions.method} ${requestOptions.url}" is deprecated. It is scheduled to be removed on ${headers.sunset}${deprecationLink ? `. See ${deprecationLink}` : ""}`);
        }
        if (status === 204 || status === 205) {
            return;
        }
        if (requestOptions.method === "HEAD") {
            if (status < 400) {
                return;
            }
            throw new import_request_error.RequestError(response.statusText, status, {
                response: {
                    url,
                    status,
                    headers,
                    data: void 0
                },
                request: requestOptions
            });
        }
        if (status === 304) {
            throw new import_request_error.RequestError("Not modified", status, {
                response: {
                    url,
                    status,
                    headers,
                    data: await getResponseData(response)
                },
                request: requestOptions
            });
        }
        if (status >= 400) {
            const data = await getResponseData(response);
            const error = new import_request_error.RequestError(toErrorMessage(data), status, {
                response: {
                    url,
                    status,
                    headers,
                    data
                },
                request: requestOptions
            });
            throw error;
        }
        return parseSuccessResponseBody ? await getResponseData(response) : response.body;
    }).then((data)=>{
        return {
            status,
            url,
            headers,
            data
        };
    }).catch((error)=>{
        if (error instanceof import_request_error.RequestError) throw error;
        else if (error.name === "AbortError") throw error;
        let message = error.message;
        if (error.name === "TypeError" && "cause" in error) {
            if (error.cause instanceof Error) {
                message = error.cause.message;
            } else if (typeof error.cause === "string") {
                message = error.cause;
            }
        }
        throw new import_request_error.RequestError(message, 500, {
            request: requestOptions
        });
    });
}
async function getResponseData(response) {
    const contentType = response.headers.get("content-type");
    if (/application\/json/.test(contentType)) {
        return response.json().catch(()=>response.text()).catch(()=>"");
    }
    if (!contentType || /^text\/|charset=utf-8$/.test(contentType)) {
        return response.text();
    }
    return getBufferResponse(response);
}
function toErrorMessage(data) {
    if (typeof data === "string") return data;
    let suffix;
    if ("documentation_url" in data) {
        suffix = ` - ${data.documentation_url}`;
    } else {
        suffix = "";
    }
    if ("message" in data) {
        if (Array.isArray(data.errors)) {
            return `${data.message}: ${data.errors.map(JSON.stringify).join(", ")}${suffix}`;
        }
        return `${data.message}${suffix}`;
    }
    return `Unknown error: ${JSON.stringify(data)}`;
}
// pkg/dist-src/with-defaults.js
function withDefaults(oldEndpoint, newDefaults) {
    const endpoint2 = oldEndpoint.defaults(newDefaults);
    const newApi = function(route, parameters) {
        const endpointOptions = endpoint2.merge(route, parameters);
        if (!endpointOptions.request || !endpointOptions.request.hook) {
            return fetchWrapper(endpoint2.parse(endpointOptions));
        }
        const request2 = (route2, parameters2)=>{
            return fetchWrapper(endpoint2.parse(endpoint2.merge(route2, parameters2)));
        };
        Object.assign(request2, {
            endpoint: endpoint2,
            defaults: withDefaults.bind(null, endpoint2)
        });
        return endpointOptions.request.hook(request2, endpointOptions);
    };
    return Object.assign(newApi, {
        endpoint: endpoint2,
        defaults: withDefaults.bind(null, endpoint2)
    });
}
// pkg/dist-src/index.js
var request = withDefaults(import_endpoint.endpoint, {
    headers: {
        "user-agent": `octokit-request.js/${VERSION} ${(0, import_universal_user_agent.getUserAgent)()}`
    }
});
// Annotate the CommonJS export names for ESM import in node:
0 && (0);


/***/ }),

/***/ 10726:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all)=>{
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = (to, from, except, desc)=>{
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
            get: ()=>from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
    return to;
};
var __toCommonJS = (mod)=>__copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
// pkg/dist-src/index.js
var dist_src_exports = {};
__export(dist_src_exports, {
    sign: ()=>sign,
    verify: ()=>verify,
    verifyWithFallback: ()=>verifyWithFallback
});
module.exports = __toCommonJS(dist_src_exports);
// pkg/dist-src/node/sign.js
var import_node_crypto = __webpack_require__(6005);
// pkg/dist-src/types.js
var Algorithm = /* @__PURE__ */ ((Algorithm2)=>{
    Algorithm2["SHA1"] = "sha1";
    Algorithm2["SHA256"] = "sha256";
    return Algorithm2;
})(Algorithm || {});
// pkg/dist-src/version.js
var VERSION = "4.1.0";
// pkg/dist-src/node/sign.js
async function sign(options, payload) {
    const { secret, algorithm } = typeof options === "object" ? {
        secret: options.secret,
        algorithm: options.algorithm || Algorithm.SHA256
    } : {
        secret: options,
        algorithm: Algorithm.SHA256
    };
    if (!secret || !payload) {
        throw new TypeError("[@octokit/webhooks-methods] secret & payload required for sign()");
    }
    if (typeof payload !== "string") {
        throw new TypeError("[@octokit/webhooks-methods] payload must be a string");
    }
    if (!Object.values(Algorithm).includes(algorithm)) {
        throw new TypeError(`[@octokit/webhooks] Algorithm ${algorithm} is not supported. Must be  'sha1' or 'sha256'`);
    }
    return `${algorithm}=${(0, import_node_crypto.createHmac)(algorithm, secret).update(payload).digest("hex")}`;
}
sign.VERSION = VERSION;
// pkg/dist-src/node/verify.js
var import_node_crypto2 = __webpack_require__(6005);
var import_node_buffer = __webpack_require__(72254);
// pkg/dist-src/utils.js
var getAlgorithm = (signature)=>{
    return signature.startsWith("sha256=") ? "sha256" : "sha1";
};
// pkg/dist-src/node/verify.js
async function verify(secret, eventPayload, signature) {
    if (!secret || !eventPayload || !signature) {
        throw new TypeError("[@octokit/webhooks-methods] secret, eventPayload & signature required");
    }
    if (typeof eventPayload !== "string") {
        throw new TypeError("[@octokit/webhooks-methods] eventPayload must be a string");
    }
    const signatureBuffer = import_node_buffer.Buffer.from(signature);
    const algorithm = getAlgorithm(signature);
    const verificationBuffer = import_node_buffer.Buffer.from(await sign({
        secret,
        algorithm
    }, eventPayload));
    if (signatureBuffer.length !== verificationBuffer.length) {
        return false;
    }
    return (0, import_node_crypto2.timingSafeEqual)(signatureBuffer, verificationBuffer);
}
verify.VERSION = VERSION;
// pkg/dist-src/index.js
async function verifyWithFallback(secret, payload, signature, additionalSecrets) {
    const firstPass = await verify(secret, payload, signature);
    if (firstPass) {
        return true;
    }
    if (additionalSecrets !== void 0) {
        for (const s of additionalSecrets){
            const v = await verify(s, payload, signature);
            if (v) {
                return v;
            }
        }
    }
    return false;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (0);


/***/ }),

/***/ 45256:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all)=>{
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = (to, from, except, desc)=>{
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
            get: ()=>from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
    return to;
};
var __toESM = (mod, isNodeMode, target)=>(target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(// If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
        value: mod,
        enumerable: true
    }) : target, mod));
var __toCommonJS = (mod)=>__copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
// pkg/dist-src/index.js
var dist_src_exports = {};
__export(dist_src_exports, {
    Webhooks: ()=>Webhooks,
    createEventHandler: ()=>createEventHandler,
    createNodeMiddleware: ()=>createNodeMiddleware,
    emitterEventNames: ()=>emitterEventNames
});
module.exports = __toCommonJS(dist_src_exports);
// pkg/dist-src/createLogger.js
var createLogger = (logger)=>({
        debug: ()=>{},
        info: ()=>{},
        warn: console.warn.bind(console),
        error: console.error.bind(console),
        ...logger
    });
// pkg/dist-src/generated/webhook-names.js
var emitterEventNames = [
    "branch_protection_configuration",
    "branch_protection_rule.disabled",
    "branch_protection_rule.enabled",
    "branch_protection_rule",
    "branch_protection_rule.created",
    "branch_protection_rule.deleted",
    "branch_protection_rule.edited",
    "check_run",
    "check_run.completed",
    "check_run.created",
    "check_run.requested_action",
    "check_run.rerequested",
    "check_suite",
    "check_suite.completed",
    "check_suite.requested",
    "check_suite.rerequested",
    "code_scanning_alert",
    "code_scanning_alert.appeared_in_branch",
    "code_scanning_alert.closed_by_user",
    "code_scanning_alert.created",
    "code_scanning_alert.fixed",
    "code_scanning_alert.reopened",
    "code_scanning_alert.reopened_by_user",
    "commit_comment",
    "commit_comment.created",
    "create",
    "custom_property",
    "custom_property.created",
    "custom_property.deleted",
    "custom_property_values",
    "custom_property_values.updated",
    "delete",
    "dependabot_alert",
    "dependabot_alert.created",
    "dependabot_alert.dismissed",
    "dependabot_alert.fixed",
    "dependabot_alert.reintroduced",
    "dependabot_alert.reopened",
    "deploy_key",
    "deploy_key.created",
    "deploy_key.deleted",
    "deployment",
    "deployment.created",
    "deployment_protection_rule",
    "deployment_protection_rule.requested",
    "deployment_review",
    "deployment_review.approved",
    "deployment_review.rejected",
    "deployment_review.requested",
    "deployment_status",
    "deployment_status.created",
    "discussion",
    "discussion.answered",
    "discussion.category_changed",
    "discussion.created",
    "discussion.deleted",
    "discussion.edited",
    "discussion.labeled",
    "discussion.locked",
    "discussion.pinned",
    "discussion.transferred",
    "discussion.unanswered",
    "discussion.unlabeled",
    "discussion.unlocked",
    "discussion.unpinned",
    "discussion_comment",
    "discussion_comment.created",
    "discussion_comment.deleted",
    "discussion_comment.edited",
    "fork",
    "github_app_authorization",
    "github_app_authorization.revoked",
    "gollum",
    "installation",
    "installation.created",
    "installation.deleted",
    "installation.new_permissions_accepted",
    "installation.suspend",
    "installation.unsuspend",
    "installation_repositories",
    "installation_repositories.added",
    "installation_repositories.removed",
    "installation_target",
    "installation_target.renamed",
    "issue_comment",
    "issue_comment.created",
    "issue_comment.deleted",
    "issue_comment.edited",
    "issues",
    "issues.assigned",
    "issues.closed",
    "issues.deleted",
    "issues.demilestoned",
    "issues.edited",
    "issues.labeled",
    "issues.locked",
    "issues.milestoned",
    "issues.opened",
    "issues.pinned",
    "issues.reopened",
    "issues.transferred",
    "issues.unassigned",
    "issues.unlabeled",
    "issues.unlocked",
    "issues.unpinned",
    "label",
    "label.created",
    "label.deleted",
    "label.edited",
    "marketplace_purchase",
    "marketplace_purchase.cancelled",
    "marketplace_purchase.changed",
    "marketplace_purchase.pending_change",
    "marketplace_purchase.pending_change_cancelled",
    "marketplace_purchase.purchased",
    "member",
    "member.added",
    "member.edited",
    "member.removed",
    "membership",
    "membership.added",
    "membership.removed",
    "merge_group",
    "merge_group.checks_requested",
    "meta",
    "meta.deleted",
    "milestone",
    "milestone.closed",
    "milestone.created",
    "milestone.deleted",
    "milestone.edited",
    "milestone.opened",
    "org_block",
    "org_block.blocked",
    "org_block.unblocked",
    "organization",
    "organization.deleted",
    "organization.member_added",
    "organization.member_invited",
    "organization.member_removed",
    "organization.renamed",
    "package",
    "package.published",
    "package.updated",
    "page_build",
    "ping",
    "project",
    "project.closed",
    "project.created",
    "project.deleted",
    "project.edited",
    "project.reopened",
    "project_card",
    "project_card.converted",
    "project_card.created",
    "project_card.deleted",
    "project_card.edited",
    "project_card.moved",
    "project_column",
    "project_column.created",
    "project_column.deleted",
    "project_column.edited",
    "project_column.moved",
    "projects_v2_item",
    "projects_v2_item.archived",
    "projects_v2_item.converted",
    "projects_v2_item.created",
    "projects_v2_item.deleted",
    "projects_v2_item.edited",
    "projects_v2_item.reordered",
    "projects_v2_item.restored",
    "public",
    "pull_request",
    "pull_request.assigned",
    "pull_request.auto_merge_disabled",
    "pull_request.auto_merge_enabled",
    "pull_request.closed",
    "pull_request.converted_to_draft",
    "pull_request.demilestoned",
    "pull_request.dequeued",
    "pull_request.edited",
    "pull_request.enqueued",
    "pull_request.labeled",
    "pull_request.locked",
    "pull_request.milestoned",
    "pull_request.opened",
    "pull_request.ready_for_review",
    "pull_request.reopened",
    "pull_request.review_request_removed",
    "pull_request.review_requested",
    "pull_request.synchronize",
    "pull_request.unassigned",
    "pull_request.unlabeled",
    "pull_request.unlocked",
    "pull_request_review",
    "pull_request_review.dismissed",
    "pull_request_review.edited",
    "pull_request_review.submitted",
    "pull_request_review_comment",
    "pull_request_review_comment.created",
    "pull_request_review_comment.deleted",
    "pull_request_review_comment.edited",
    "pull_request_review_thread",
    "pull_request_review_thread.resolved",
    "pull_request_review_thread.unresolved",
    "push",
    "registry_package",
    "registry_package.published",
    "registry_package.updated",
    "release",
    "release.created",
    "release.deleted",
    "release.edited",
    "release.prereleased",
    "release.published",
    "release.released",
    "release.unpublished",
    "repository",
    "repository.archived",
    "repository.created",
    "repository.deleted",
    "repository.edited",
    "repository.privatized",
    "repository.publicized",
    "repository.renamed",
    "repository.transferred",
    "repository.unarchived",
    "repository_dispatch",
    "repository_import",
    "repository_vulnerability_alert",
    "repository_vulnerability_alert.create",
    "repository_vulnerability_alert.dismiss",
    "repository_vulnerability_alert.reopen",
    "repository_vulnerability_alert.resolve",
    "secret_scanning_alert",
    "secret_scanning_alert.created",
    "secret_scanning_alert.reopened",
    "secret_scanning_alert.resolved",
    "secret_scanning_alert.revoked",
    "secret_scanning_alert_location",
    "secret_scanning_alert_location.created",
    "security_advisory",
    "security_advisory.performed",
    "security_advisory.published",
    "security_advisory.updated",
    "security_advisory.withdrawn",
    "sponsorship",
    "sponsorship.cancelled",
    "sponsorship.created",
    "sponsorship.edited",
    "sponsorship.pending_cancellation",
    "sponsorship.pending_tier_change",
    "sponsorship.tier_changed",
    "star",
    "star.created",
    "star.deleted",
    "status",
    "team",
    "team.added_to_repository",
    "team.created",
    "team.deleted",
    "team.edited",
    "team.removed_from_repository",
    "team_add",
    "watch",
    "watch.started",
    "workflow_dispatch",
    "workflow_job",
    "workflow_job.completed",
    "workflow_job.in_progress",
    "workflow_job.queued",
    "workflow_job.waiting",
    "workflow_run",
    "workflow_run.completed",
    "workflow_run.in_progress",
    "workflow_run.requested"
];
// pkg/dist-src/event-handler/on.js
function handleEventHandlers(state, webhookName, handler) {
    if (!state.hooks[webhookName]) {
        state.hooks[webhookName] = [];
    }
    state.hooks[webhookName].push(handler);
}
function receiverOn(state, webhookNameOrNames, handler) {
    if (Array.isArray(webhookNameOrNames)) {
        webhookNameOrNames.forEach((webhookName)=>receiverOn(state, webhookName, handler));
        return;
    }
    if ([
        "*",
        "error"
    ].includes(webhookNameOrNames)) {
        const webhookName = webhookNameOrNames === "*" ? "any" : webhookNameOrNames;
        const message = `Using the "${webhookNameOrNames}" event with the regular Webhooks.on() function is not supported. Please use the Webhooks.on${webhookName.charAt(0).toUpperCase() + webhookName.slice(1)}() method instead`;
        throw new Error(message);
    }
    if (!emitterEventNames.includes(webhookNameOrNames)) {
        state.log.warn(`"${webhookNameOrNames}" is not a known webhook name (https://developer.github.com/v3/activity/events/types/)`);
    }
    handleEventHandlers(state, webhookNameOrNames, handler);
}
function receiverOnAny(state, handler) {
    handleEventHandlers(state, "*", handler);
}
function receiverOnError(state, handler) {
    handleEventHandlers(state, "error", handler);
}
// pkg/dist-src/event-handler/receive.js
var import_aggregate_error = __toESM(__webpack_require__(22906));
// pkg/dist-src/event-handler/wrap-error-handler.js
function wrapErrorHandler(handler, error) {
    let returnValue;
    try {
        returnValue = handler(error);
    } catch (error2) {
        console.log('FATAL: Error occurred in "error" event handler');
        console.log(error2);
    }
    if (returnValue && returnValue.catch) {
        returnValue.catch((error2)=>{
            console.log('FATAL: Error occurred in "error" event handler');
            console.log(error2);
        });
    }
}
// pkg/dist-src/event-handler/receive.js
function getHooks(state, eventPayloadAction, eventName) {
    const hooks = [
        state.hooks[eventName],
        state.hooks["*"]
    ];
    if (eventPayloadAction) {
        hooks.unshift(state.hooks[`${eventName}.${eventPayloadAction}`]);
    }
    return [].concat(...hooks.filter(Boolean));
}
function receiverHandle(state, event) {
    const errorHandlers = state.hooks.error || [];
    if (event instanceof Error) {
        const error = Object.assign(new import_aggregate_error.default([
            event
        ]), {
            event,
            errors: [
                event
            ]
        });
        errorHandlers.forEach((handler)=>wrapErrorHandler(handler, error));
        return Promise.reject(error);
    }
    if (!event || !event.name) {
        throw new import_aggregate_error.default([
            "Event name not passed"
        ]);
    }
    if (!event.payload) {
        throw new import_aggregate_error.default([
            "Event payload not passed"
        ]);
    }
    const hooks = getHooks(state, "action" in event.payload ? event.payload.action : null, event.name);
    if (hooks.length === 0) {
        return Promise.resolve();
    }
    const errors = [];
    const promises = hooks.map((handler)=>{
        let promise = Promise.resolve(event);
        if (state.transform) {
            promise = promise.then(state.transform);
        }
        return promise.then((event2)=>{
            return handler(event2);
        }).catch((error)=>errors.push(Object.assign(error, {
                event
            })));
    });
    return Promise.all(promises).then(()=>{
        if (errors.length === 0) {
            return;
        }
        const error = new import_aggregate_error.default(errors);
        Object.assign(error, {
            event,
            errors
        });
        errorHandlers.forEach((handler)=>wrapErrorHandler(handler, error));
        throw error;
    });
}
// pkg/dist-src/event-handler/remove-listener.js
function removeListener(state, webhookNameOrNames, handler) {
    if (Array.isArray(webhookNameOrNames)) {
        webhookNameOrNames.forEach((webhookName)=>removeListener(state, webhookName, handler));
        return;
    }
    if (!state.hooks[webhookNameOrNames]) {
        return;
    }
    for(let i = state.hooks[webhookNameOrNames].length - 1; i >= 0; i--){
        if (state.hooks[webhookNameOrNames][i] === handler) {
            state.hooks[webhookNameOrNames].splice(i, 1);
            return;
        }
    }
}
// pkg/dist-src/event-handler/index.js
function createEventHandler(options) {
    const state = {
        hooks: {},
        log: createLogger(options && options.log)
    };
    if (options && options.transform) {
        state.transform = options.transform;
    }
    return {
        on: receiverOn.bind(null, state),
        onAny: receiverOnAny.bind(null, state),
        onError: receiverOnError.bind(null, state),
        removeListener: removeListener.bind(null, state),
        receive: receiverHandle.bind(null, state)
    };
}
// pkg/dist-src/index.js
var import_webhooks_methods2 = __webpack_require__(10726);
// pkg/dist-src/verify-and-receive.js
var import_aggregate_error2 = __toESM(__webpack_require__(22906));
var import_webhooks_methods = __webpack_require__(10726);
async function verifyAndReceive(state, event) {
    const matchesSignature = await (0, import_webhooks_methods.verify)(state.secret, event.payload, event.signature).catch(()=>false);
    if (!matchesSignature) {
        const error = new Error("[@octokit/webhooks] signature does not match event payload and secret");
        return state.eventHandler.receive(Object.assign(error, {
            event,
            status: 400
        }));
    }
    let payload;
    try {
        payload = JSON.parse(event.payload);
    } catch (error) {
        error.message = "Invalid JSON";
        error.status = 400;
        throw new import_aggregate_error2.default([
            error
        ]);
    }
    return state.eventHandler.receive({
        id: event.id,
        name: event.name,
        payload
    });
}
// pkg/dist-src/middleware/node/get-missing-headers.js
var WEBHOOK_HEADERS = [
    "x-github-event",
    "x-hub-signature-256",
    "x-github-delivery"
];
function getMissingHeaders(request) {
    return WEBHOOK_HEADERS.filter((header)=>!(header in request.headers));
}
// pkg/dist-src/middleware/node/get-payload.js
var import_aggregate_error3 = __toESM(__webpack_require__(22906));
function getPayload(request) {
    if ("body" in request) {
        if (typeof request.body === "object" && "rawBody" in request && request.rawBody instanceof Buffer) {
            return Promise.resolve(request.rawBody.toString("utf8"));
        } else {
            return Promise.resolve(request.body);
        }
    }
    return new Promise((resolve, reject)=>{
        let data = [];
        request.on("error", (error)=>reject(new import_aggregate_error3.default([
                error
            ])));
        request.on("data", (chunk)=>data.push(chunk));
        request.on("end", ()=>// setImmediate improves the throughput by reducing the pressure from
            // the event loop
            setImmediate(resolve, data.length === 1 ? data[0].toString("utf8") : Buffer.concat(data).toString("utf8")));
    });
}
// pkg/dist-src/middleware/node/on-unhandled-request-default.js
function onUnhandledRequestDefault(request, response) {
    response.writeHead(404, {
        "content-type": "application/json"
    });
    response.end(JSON.stringify({
        error: `Unknown route: ${request.method} ${request.url}`
    }));
}
// pkg/dist-src/middleware/node/middleware.js
async function middleware(webhooks, options, request, response, next) {
    let pathname;
    try {
        pathname = new URL(request.url, "http://localhost").pathname;
    } catch (error) {
        response.writeHead(422, {
            "content-type": "application/json"
        });
        response.end(JSON.stringify({
            error: `Request URL could not be parsed: ${request.url}`
        }));
        return true;
    }
    if (pathname !== options.path) {
        next?.();
        return false;
    } else if (request.method !== "POST") {
        onUnhandledRequestDefault(request, response);
        return true;
    }
    if (!request.headers["content-type"] || !request.headers["content-type"].startsWith("application/json")) {
        response.writeHead(415, {
            "content-type": "application/json",
            accept: "application/json"
        });
        response.end(JSON.stringify({
            error: `Unsupported "Content-Type" header value. Must be "application/json"`
        }));
        return true;
    }
    const missingHeaders = getMissingHeaders(request).join(", ");
    if (missingHeaders) {
        response.writeHead(400, {
            "content-type": "application/json"
        });
        response.end(JSON.stringify({
            error: `Required headers missing: ${missingHeaders}`
        }));
        return true;
    }
    const eventName = request.headers["x-github-event"];
    const signatureSHA256 = request.headers["x-hub-signature-256"];
    const id = request.headers["x-github-delivery"];
    options.log.debug(`${eventName} event received (id: ${id})`);
    let didTimeout = false;
    const timeout = setTimeout(()=>{
        didTimeout = true;
        response.statusCode = 202;
        response.end("still processing\n");
    }, 9e3).unref();
    try {
        const payload = await getPayload(request);
        await webhooks.verifyAndReceive({
            id,
            name: eventName,
            payload,
            signature: signatureSHA256
        });
        clearTimeout(timeout);
        if (didTimeout) return true;
        response.end("ok\n");
        return true;
    } catch (error) {
        clearTimeout(timeout);
        if (didTimeout) return true;
        const err = Array.from(error)[0];
        const errorMessage = err.message ? `${err.name}: ${err.message}` : "Error: An Unspecified error occurred";
        response.statusCode = typeof err.status !== "undefined" ? err.status : 500;
        options.log.error(error);
        response.end(JSON.stringify({
            error: errorMessage
        }));
        return true;
    }
}
// pkg/dist-src/middleware/node/index.js
function createNodeMiddleware(webhooks, { path = "/api/github/webhooks", log = createLogger() } = {}) {
    return middleware.bind(null, webhooks, {
        path,
        log
    });
}
// pkg/dist-src/index.js
var Webhooks = class {
    constructor(options){
        if (!options || !options.secret) {
            throw new Error("[@octokit/webhooks] options.secret required");
        }
        const state = {
            eventHandler: createEventHandler(options),
            secret: options.secret,
            hooks: {},
            log: createLogger(options.log)
        };
        this.sign = import_webhooks_methods2.sign.bind(null, options.secret);
        this.verify = import_webhooks_methods2.verify.bind(null, options.secret);
        this.on = state.eventHandler.on;
        this.onAny = state.eventHandler.onAny;
        this.onError = state.eventHandler.onError;
        this.removeListener = state.eventHandler.removeListener;
        this.receive = state.eventHandler.receive;
        this.verifyAndReceive = verifyAndReceive.bind(null, state);
    }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (0);


/***/ }),

/***/ 22906:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const indentString = __webpack_require__(45979);
const cleanStack = __webpack_require__(86955);
const cleanInternalStack = (stack)=>stack.replace(/\s+at .*aggregate-error\/index.js:\d+:\d+\)?/g, "");
class AggregateError extends Error {
    constructor(errors){
        if (!Array.isArray(errors)) {
            throw new TypeError(`Expected input to be an Array, got ${typeof errors}`);
        }
        errors = [
            ...errors
        ].map((error)=>{
            if (error instanceof Error) {
                return error;
            }
            if (error !== null && typeof error === "object") {
                // Handle plain error objects with message property and/or possibly other metadata
                return Object.assign(new Error(error.message), error);
            }
            return new Error(error);
        });
        let message = errors.map((error)=>{
            // The `stack` property is not standardized, so we can't assume it exists
            return typeof error.stack === "string" ? cleanInternalStack(cleanStack(error.stack)) : String(error);
        }).join("\n");
        message = "\n" + indentString(message, 4);
        super(message);
        this.name = "AggregateError";
        Object.defineProperty(this, "_errors", {
            value: errors
        });
    }
    *[Symbol.iterator]() {
        for (const error of this._errors){
            yield error;
        }
    }
}
module.exports = AggregateError;


/***/ }),

/***/ 24458:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var register = __webpack_require__(80756);
var addHook = __webpack_require__(12159);
var removeHook = __webpack_require__(58668);
// bind with array of arguments: https://stackoverflow.com/a/21792913
var bind = Function.bind;
var bindable = bind.bind(bind);
function bindApi(hook, state, name) {
    var removeHookRef = bindable(removeHook, null).apply(null, name ? [
        state,
        name
    ] : [
        state
    ]);
    hook.api = {
        remove: removeHookRef
    };
    hook.remove = removeHookRef;
    [
        "before",
        "error",
        "after",
        "wrap"
    ].forEach(function(kind) {
        var args = name ? [
            state,
            kind,
            name
        ] : [
            state,
            kind
        ];
        hook[kind] = hook.api[kind] = bindable(addHook, null).apply(null, args);
    });
}
function HookSingular() {
    var singularHookName = "h";
    var singularHookState = {
        registry: {}
    };
    var singularHook = register.bind(null, singularHookState, singularHookName);
    bindApi(singularHook, singularHookState, singularHookName);
    return singularHook;
}
function HookCollection() {
    var state = {
        registry: {}
    };
    var hook = register.bind(null, state);
    bindApi(hook, state);
    return hook;
}
var collectionHookDeprecationMessageDisplayed = false;
function Hook() {
    if (!collectionHookDeprecationMessageDisplayed) {
        console.warn('[before-after-hook]: "Hook()" repurposing warning, use "Hook.Collection()". Read more: https://git.io/upgrade-before-after-hook-to-1.4');
        collectionHookDeprecationMessageDisplayed = true;
    }
    return HookCollection();
}
Hook.Singular = HookSingular.bind();
Hook.Collection = HookCollection.bind();
module.exports = Hook;
// expose constructors as a named property for TypeScript
module.exports.Hook = Hook;
module.exports.Singular = Hook.Singular;
module.exports.Collection = Hook.Collection;


/***/ }),

/***/ 12159:
/***/ ((module) => {

"use strict";

module.exports = addHook;
function addHook(state, kind, name, hook) {
    var orig = hook;
    if (!state.registry[name]) {
        state.registry[name] = [];
    }
    if (kind === "before") {
        hook = function(method, options) {
            return Promise.resolve().then(orig.bind(null, options)).then(method.bind(null, options));
        };
    }
    if (kind === "after") {
        hook = function(method, options) {
            var result;
            return Promise.resolve().then(method.bind(null, options)).then(function(result_) {
                result = result_;
                return orig(result, options);
            }).then(function() {
                return result;
            });
        };
    }
    if (kind === "error") {
        hook = function(method, options) {
            return Promise.resolve().then(method.bind(null, options)).catch(function(error) {
                return orig(error, options);
            });
        };
    }
    state.registry[name].push({
        hook: hook,
        orig: orig
    });
}


/***/ }),

/***/ 80756:
/***/ ((module) => {

"use strict";

module.exports = register;
function register(state, name, method, options) {
    if (typeof method !== "function") {
        throw new Error("method for before hook must be a function");
    }
    if (!options) {
        options = {};
    }
    if (Array.isArray(name)) {
        return name.reverse().reduce(function(callback, name) {
            return register.bind(null, state, name, callback, options);
        }, method)();
    }
    return Promise.resolve().then(function() {
        if (!state.registry[name]) {
            return method(options);
        }
        return state.registry[name].reduce(function(method, registered) {
            return registered.hook.bind(null, method, options);
        }, method)();
    });
}


/***/ }),

/***/ 58668:
/***/ ((module) => {

"use strict";

module.exports = removeHook;
function removeHook(state, name, method) {
    if (!state.registry[name]) {
        return;
    }
    var index = state.registry[name].map(function(registered) {
        return registered.orig;
    }).indexOf(method);
    if (index === -1) {
        return;
    }
    state.registry[name].splice(index, 1);
}


/***/ }),

/***/ 84342:
/***/ ((module) => {

"use strict";

/**
  * This file contains the Bottleneck library (MIT), compiled to ES2017, and without Clustering support.
  * https://github.com/SGrondin/bottleneck
  */ (function(global1, factory) {
     true ? module.exports = factory() : 0;
})(void 0, function() {
    "use strict";
    var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis :  false ? 0 : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
    function getCjsExportFromNamespace(n) {
        return n && n["default"] || n;
    }
    var load = function(received, defaults, onto = {}) {
        var k, ref, v;
        for(k in defaults){
            v = defaults[k];
            onto[k] = (ref = received[k]) != null ? ref : v;
        }
        return onto;
    };
    var overwrite = function(received, defaults, onto = {}) {
        var k, v;
        for(k in received){
            v = received[k];
            if (defaults[k] !== void 0) {
                onto[k] = v;
            }
        }
        return onto;
    };
    var parser = {
        load: load,
        overwrite: overwrite
    };
    var DLList;
    DLList = class DLList {
        constructor(incr, decr){
            this.incr = incr;
            this.decr = decr;
            this._first = null;
            this._last = null;
            this.length = 0;
        }
        push(value) {
            var node;
            this.length++;
            if (typeof this.incr === "function") {
                this.incr();
            }
            node = {
                value,
                prev: this._last,
                next: null
            };
            if (this._last != null) {
                this._last.next = node;
                this._last = node;
            } else {
                this._first = this._last = node;
            }
            return void 0;
        }
        shift() {
            var value;
            if (this._first == null) {
                return;
            } else {
                this.length--;
                if (typeof this.decr === "function") {
                    this.decr();
                }
            }
            value = this._first.value;
            if ((this._first = this._first.next) != null) {
                this._first.prev = null;
            } else {
                this._last = null;
            }
            return value;
        }
        first() {
            if (this._first != null) {
                return this._first.value;
            }
        }
        getArray() {
            var node, ref, results;
            node = this._first;
            results = [];
            while(node != null){
                results.push((ref = node, node = node.next, ref.value));
            }
            return results;
        }
        forEachShift(cb) {
            var node;
            node = this.shift();
            while(node != null){
                cb(node), node = this.shift();
            }
            return void 0;
        }
        debug() {
            var node, ref, ref1, ref2, results;
            node = this._first;
            results = [];
            while(node != null){
                results.push((ref = node, node = node.next, {
                    value: ref.value,
                    prev: (ref1 = ref.prev) != null ? ref1.value : void 0,
                    next: (ref2 = ref.next) != null ? ref2.value : void 0
                }));
            }
            return results;
        }
    };
    var DLList_1 = DLList;
    var Events;
    Events = class Events {
        constructor(instance){
            this.instance = instance;
            this._events = {};
            if (this.instance.on != null || this.instance.once != null || this.instance.removeAllListeners != null) {
                throw new Error("An Emitter already exists for this object");
            }
            this.instance.on = (name, cb)=>{
                return this._addListener(name, "many", cb);
            };
            this.instance.once = (name, cb)=>{
                return this._addListener(name, "once", cb);
            };
            this.instance.removeAllListeners = (name = null)=>{
                if (name != null) {
                    return delete this._events[name];
                } else {
                    return this._events = {};
                }
            };
        }
        _addListener(name, status, cb) {
            var base;
            if ((base = this._events)[name] == null) {
                base[name] = [];
            }
            this._events[name].push({
                cb,
                status
            });
            return this.instance;
        }
        listenerCount(name) {
            if (this._events[name] != null) {
                return this._events[name].length;
            } else {
                return 0;
            }
        }
        async trigger(name, ...args) {
            var e, promises;
            try {
                if (name !== "debug") {
                    this.trigger("debug", `Event triggered: ${name}`, args);
                }
                if (this._events[name] == null) {
                    return;
                }
                this._events[name] = this._events[name].filter(function(listener) {
                    return listener.status !== "none";
                });
                promises = this._events[name].map(async (listener)=>{
                    var e, returned;
                    if (listener.status === "none") {
                        return;
                    }
                    if (listener.status === "once") {
                        listener.status = "none";
                    }
                    try {
                        returned = typeof listener.cb === "function" ? listener.cb(...args) : void 0;
                        if (typeof (returned != null ? returned.then : void 0) === "function") {
                            return await returned;
                        } else {
                            return returned;
                        }
                    } catch (error) {
                        e = error;
                        {
                            this.trigger("error", e);
                        }
                        return null;
                    }
                });
                return (await Promise.all(promises)).find(function(x) {
                    return x != null;
                });
            } catch (error) {
                e = error;
                {
                    this.trigger("error", e);
                }
                return null;
            }
        }
    };
    var Events_1 = Events;
    var DLList$1, Events$1, Queues;
    DLList$1 = DLList_1;
    Events$1 = Events_1;
    Queues = class Queues {
        constructor(num_priorities){
            var i;
            this.Events = new Events$1(this);
            this._length = 0;
            this._lists = (function() {
                var j, ref, results;
                results = [];
                for(i = j = 1, ref = num_priorities; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j){
                    results.push(new DLList$1(()=>{
                        return this.incr();
                    }, ()=>{
                        return this.decr();
                    }));
                }
                return results;
            }).call(this);
        }
        incr() {
            if (this._length++ === 0) {
                return this.Events.trigger("leftzero");
            }
        }
        decr() {
            if (--this._length === 0) {
                return this.Events.trigger("zero");
            }
        }
        push(job) {
            return this._lists[job.options.priority].push(job);
        }
        queued(priority) {
            if (priority != null) {
                return this._lists[priority].length;
            } else {
                return this._length;
            }
        }
        shiftAll(fn) {
            return this._lists.forEach(function(list) {
                return list.forEachShift(fn);
            });
        }
        getFirst(arr = this._lists) {
            var j, len, list;
            for(j = 0, len = arr.length; j < len; j++){
                list = arr[j];
                if (list.length > 0) {
                    return list;
                }
            }
            return [];
        }
        shiftLastFrom(priority) {
            return this.getFirst(this._lists.slice(priority).reverse()).shift();
        }
    };
    var Queues_1 = Queues;
    var BottleneckError;
    BottleneckError = class BottleneckError extends Error {
    };
    var BottleneckError_1 = BottleneckError;
    var BottleneckError$1, DEFAULT_PRIORITY, Job, NUM_PRIORITIES, parser$1;
    NUM_PRIORITIES = 10;
    DEFAULT_PRIORITY = 5;
    parser$1 = parser;
    BottleneckError$1 = BottleneckError_1;
    Job = class Job {
        constructor(task, args, options, jobDefaults, rejectOnDrop, Events, _states, Promise1){
            this.task = task;
            this.args = args;
            this.rejectOnDrop = rejectOnDrop;
            this.Events = Events;
            this._states = _states;
            this.Promise = Promise1;
            this.options = parser$1.load(options, jobDefaults);
            this.options.priority = this._sanitizePriority(this.options.priority);
            if (this.options.id === jobDefaults.id) {
                this.options.id = `${this.options.id}-${this._randomIndex()}`;
            }
            this.promise = new this.Promise((_resolve, _reject)=>{
                this._resolve = _resolve;
                this._reject = _reject;
            });
            this.retryCount = 0;
        }
        _sanitizePriority(priority) {
            var sProperty;
            sProperty = ~~priority !== priority ? DEFAULT_PRIORITY : priority;
            if (sProperty < 0) {
                return 0;
            } else if (sProperty > NUM_PRIORITIES - 1) {
                return NUM_PRIORITIES - 1;
            } else {
                return sProperty;
            }
        }
        _randomIndex() {
            return Math.random().toString(36).slice(2);
        }
        doDrop({ error, message = "This job has been dropped by Bottleneck" } = {}) {
            if (this._states.remove(this.options.id)) {
                if (this.rejectOnDrop) {
                    this._reject(error != null ? error : new BottleneckError$1(message));
                }
                this.Events.trigger("dropped", {
                    args: this.args,
                    options: this.options,
                    task: this.task,
                    promise: this.promise
                });
                return true;
            } else {
                return false;
            }
        }
        _assertStatus(expected) {
            var status;
            status = this._states.jobStatus(this.options.id);
            if (!(status === expected || expected === "DONE" && status === null)) {
                throw new BottleneckError$1(`Invalid job status ${status}, expected ${expected}. Please open an issue at https://github.com/SGrondin/bottleneck/issues`);
            }
        }
        doReceive() {
            this._states.start(this.options.id);
            return this.Events.trigger("received", {
                args: this.args,
                options: this.options
            });
        }
        doQueue(reachedHWM, blocked) {
            this._assertStatus("RECEIVED");
            this._states.next(this.options.id);
            return this.Events.trigger("queued", {
                args: this.args,
                options: this.options,
                reachedHWM,
                blocked
            });
        }
        doRun() {
            if (this.retryCount === 0) {
                this._assertStatus("QUEUED");
                this._states.next(this.options.id);
            } else {
                this._assertStatus("EXECUTING");
            }
            return this.Events.trigger("scheduled", {
                args: this.args,
                options: this.options
            });
        }
        async doExecute(chained, clearGlobalState, run, free) {
            var error, eventInfo, passed;
            if (this.retryCount === 0) {
                this._assertStatus("RUNNING");
                this._states.next(this.options.id);
            } else {
                this._assertStatus("EXECUTING");
            }
            eventInfo = {
                args: this.args,
                options: this.options,
                retryCount: this.retryCount
            };
            this.Events.trigger("executing", eventInfo);
            try {
                passed = await (chained != null ? chained.schedule(this.options, this.task, ...this.args) : this.task(...this.args));
                if (clearGlobalState()) {
                    this.doDone(eventInfo);
                    await free(this.options, eventInfo);
                    this._assertStatus("DONE");
                    return this._resolve(passed);
                }
            } catch (error1) {
                error = error1;
                return this._onFailure(error, eventInfo, clearGlobalState, run, free);
            }
        }
        doExpire(clearGlobalState, run, free) {
            var error, eventInfo;
            if (this._states.jobStatus(this.options.id === "RUNNING")) {
                this._states.next(this.options.id);
            }
            this._assertStatus("EXECUTING");
            eventInfo = {
                args: this.args,
                options: this.options,
                retryCount: this.retryCount
            };
            error = new BottleneckError$1(`This job timed out after ${this.options.expiration} ms.`);
            return this._onFailure(error, eventInfo, clearGlobalState, run, free);
        }
        async _onFailure(error, eventInfo, clearGlobalState, run, free) {
            var retry, retryAfter;
            if (clearGlobalState()) {
                retry = await this.Events.trigger("failed", error, eventInfo);
                if (retry != null) {
                    retryAfter = ~~retry;
                    this.Events.trigger("retry", `Retrying ${this.options.id} after ${retryAfter} ms`, eventInfo);
                    this.retryCount++;
                    return run(retryAfter);
                } else {
                    this.doDone(eventInfo);
                    await free(this.options, eventInfo);
                    this._assertStatus("DONE");
                    return this._reject(error);
                }
            }
        }
        doDone(eventInfo) {
            this._assertStatus("EXECUTING");
            this._states.next(this.options.id);
            return this.Events.trigger("done", eventInfo);
        }
    };
    var Job_1 = Job;
    var BottleneckError$2, LocalDatastore, parser$2;
    parser$2 = parser;
    BottleneckError$2 = BottleneckError_1;
    LocalDatastore = class LocalDatastore {
        constructor(instance, storeOptions, storeInstanceOptions){
            this.instance = instance;
            this.storeOptions = storeOptions;
            this.clientId = this.instance._randomIndex();
            parser$2.load(storeInstanceOptions, storeInstanceOptions, this);
            this._nextRequest = this._lastReservoirRefresh = this._lastReservoirIncrease = Date.now();
            this._running = 0;
            this._done = 0;
            this._unblockTime = 0;
            this.ready = this.Promise.resolve();
            this.clients = {};
            this._startHeartbeat();
        }
        _startHeartbeat() {
            var base;
            if (this.heartbeat == null && (this.storeOptions.reservoirRefreshInterval != null && this.storeOptions.reservoirRefreshAmount != null || this.storeOptions.reservoirIncreaseInterval != null && this.storeOptions.reservoirIncreaseAmount != null)) {
                return typeof (base = this.heartbeat = setInterval(()=>{
                    var amount, incr, maximum, now, reservoir;
                    now = Date.now();
                    if (this.storeOptions.reservoirRefreshInterval != null && now >= this._lastReservoirRefresh + this.storeOptions.reservoirRefreshInterval) {
                        this._lastReservoirRefresh = now;
                        this.storeOptions.reservoir = this.storeOptions.reservoirRefreshAmount;
                        this.instance._drainAll(this.computeCapacity());
                    }
                    if (this.storeOptions.reservoirIncreaseInterval != null && now >= this._lastReservoirIncrease + this.storeOptions.reservoirIncreaseInterval) {
                        ({ reservoirIncreaseAmount: amount, reservoirIncreaseMaximum: maximum, reservoir } = this.storeOptions);
                        this._lastReservoirIncrease = now;
                        incr = maximum != null ? Math.min(amount, maximum - reservoir) : amount;
                        if (incr > 0) {
                            this.storeOptions.reservoir += incr;
                            return this.instance._drainAll(this.computeCapacity());
                        }
                    }
                }, this.heartbeatInterval)).unref === "function" ? base.unref() : void 0;
            } else {
                return clearInterval(this.heartbeat);
            }
        }
        async __publish__(message) {
            await this.yieldLoop();
            return this.instance.Events.trigger("message", message.toString());
        }
        async __disconnect__(flush) {
            await this.yieldLoop();
            clearInterval(this.heartbeat);
            return this.Promise.resolve();
        }
        yieldLoop(t = 0) {
            return new this.Promise(function(resolve, reject) {
                return setTimeout(resolve, t);
            });
        }
        computePenalty() {
            var ref;
            return (ref = this.storeOptions.penalty) != null ? ref : 15 * this.storeOptions.minTime || 5000;
        }
        async __updateSettings__(options) {
            await this.yieldLoop();
            parser$2.overwrite(options, options, this.storeOptions);
            this._startHeartbeat();
            this.instance._drainAll(this.computeCapacity());
            return true;
        }
        async __running__() {
            await this.yieldLoop();
            return this._running;
        }
        async __queued__() {
            await this.yieldLoop();
            return this.instance.queued();
        }
        async __done__() {
            await this.yieldLoop();
            return this._done;
        }
        async __groupCheck__(time) {
            await this.yieldLoop();
            return this._nextRequest + this.timeout < time;
        }
        computeCapacity() {
            var maxConcurrent, reservoir;
            ({ maxConcurrent, reservoir } = this.storeOptions);
            if (maxConcurrent != null && reservoir != null) {
                return Math.min(maxConcurrent - this._running, reservoir);
            } else if (maxConcurrent != null) {
                return maxConcurrent - this._running;
            } else if (reservoir != null) {
                return reservoir;
            } else {
                return null;
            }
        }
        conditionsCheck(weight) {
            var capacity;
            capacity = this.computeCapacity();
            return capacity == null || weight <= capacity;
        }
        async __incrementReservoir__(incr) {
            var reservoir;
            await this.yieldLoop();
            reservoir = this.storeOptions.reservoir += incr;
            this.instance._drainAll(this.computeCapacity());
            return reservoir;
        }
        async __currentReservoir__() {
            await this.yieldLoop();
            return this.storeOptions.reservoir;
        }
        isBlocked(now) {
            return this._unblockTime >= now;
        }
        check(weight, now) {
            return this.conditionsCheck(weight) && this._nextRequest - now <= 0;
        }
        async __check__(weight) {
            var now;
            await this.yieldLoop();
            now = Date.now();
            return this.check(weight, now);
        }
        async __register__(index, weight, expiration) {
            var now, wait;
            await this.yieldLoop();
            now = Date.now();
            if (this.conditionsCheck(weight)) {
                this._running += weight;
                if (this.storeOptions.reservoir != null) {
                    this.storeOptions.reservoir -= weight;
                }
                wait = Math.max(this._nextRequest - now, 0);
                this._nextRequest = now + wait + this.storeOptions.minTime;
                return {
                    success: true,
                    wait,
                    reservoir: this.storeOptions.reservoir
                };
            } else {
                return {
                    success: false
                };
            }
        }
        strategyIsBlock() {
            return this.storeOptions.strategy === 3;
        }
        async __submit__(queueLength, weight) {
            var blocked, now, reachedHWM;
            await this.yieldLoop();
            if (this.storeOptions.maxConcurrent != null && weight > this.storeOptions.maxConcurrent) {
                throw new BottleneckError$2(`Impossible to add a job having a weight of ${weight} to a limiter having a maxConcurrent setting of ${this.storeOptions.maxConcurrent}`);
            }
            now = Date.now();
            reachedHWM = this.storeOptions.highWater != null && queueLength === this.storeOptions.highWater && !this.check(weight, now);
            blocked = this.strategyIsBlock() && (reachedHWM || this.isBlocked(now));
            if (blocked) {
                this._unblockTime = now + this.computePenalty();
                this._nextRequest = this._unblockTime + this.storeOptions.minTime;
                this.instance._dropAllQueued();
            }
            return {
                reachedHWM,
                blocked,
                strategy: this.storeOptions.strategy
            };
        }
        async __free__(index, weight) {
            await this.yieldLoop();
            this._running -= weight;
            this._done += weight;
            this.instance._drainAll(this.computeCapacity());
            return {
                running: this._running
            };
        }
    };
    var LocalDatastore_1 = LocalDatastore;
    var BottleneckError$3, States;
    BottleneckError$3 = BottleneckError_1;
    States = class States {
        constructor(status1){
            this.status = status1;
            this._jobs = {};
            this.counts = this.status.map(function() {
                return 0;
            });
        }
        next(id) {
            var current, next;
            current = this._jobs[id];
            next = current + 1;
            if (current != null && next < this.status.length) {
                this.counts[current]--;
                this.counts[next]++;
                return this._jobs[id]++;
            } else if (current != null) {
                this.counts[current]--;
                return delete this._jobs[id];
            }
        }
        start(id) {
            var initial;
            initial = 0;
            this._jobs[id] = initial;
            return this.counts[initial]++;
        }
        remove(id) {
            var current;
            current = this._jobs[id];
            if (current != null) {
                this.counts[current]--;
                delete this._jobs[id];
            }
            return current != null;
        }
        jobStatus(id) {
            var ref;
            return (ref = this.status[this._jobs[id]]) != null ? ref : null;
        }
        statusJobs(status) {
            var k, pos, ref, results, v;
            if (status != null) {
                pos = this.status.indexOf(status);
                if (pos < 0) {
                    throw new BottleneckError$3(`status must be one of ${this.status.join(", ")}`);
                }
                ref = this._jobs;
                results = [];
                for(k in ref){
                    v = ref[k];
                    if (v === pos) {
                        results.push(k);
                    }
                }
                return results;
            } else {
                return Object.keys(this._jobs);
            }
        }
        statusCounts() {
            return this.counts.reduce((acc, v, i)=>{
                acc[this.status[i]] = v;
                return acc;
            }, {});
        }
    };
    var States_1 = States;
    var DLList$2, Sync;
    DLList$2 = DLList_1;
    Sync = class Sync {
        constructor(name, Promise1){
            this.schedule = this.schedule.bind(this);
            this.name = name;
            this.Promise = Promise1;
            this._running = 0;
            this._queue = new DLList$2();
        }
        isEmpty() {
            return this._queue.length === 0;
        }
        async _tryToRun() {
            var args, cb, error, reject, resolve, returned, task;
            if (this._running < 1 && this._queue.length > 0) {
                this._running++;
                ({ task, args, resolve, reject } = this._queue.shift());
                cb = await async function() {
                    try {
                        returned = await task(...args);
                        return function() {
                            return resolve(returned);
                        };
                    } catch (error1) {
                        error = error1;
                        return function() {
                            return reject(error);
                        };
                    }
                }();
                this._running--;
                this._tryToRun();
                return cb();
            }
        }
        schedule(task, ...args) {
            var promise, reject, resolve;
            resolve = reject = null;
            promise = new this.Promise(function(_resolve, _reject) {
                resolve = _resolve;
                return reject = _reject;
            });
            this._queue.push({
                task,
                args,
                resolve,
                reject
            });
            this._tryToRun();
            return promise;
        }
    };
    var Sync_1 = Sync;
    var version = "2.19.5";
    var version$1 = {
        version: version
    };
    var version$2 = /*#__PURE__*/ Object.freeze({
        version: version,
        default: version$1
    });
    var require$$2 = ()=>console.log("You must import the full version of Bottleneck in order to use this feature.");
    var require$$3 = ()=>console.log("You must import the full version of Bottleneck in order to use this feature.");
    var require$$4 = ()=>console.log("You must import the full version of Bottleneck in order to use this feature.");
    var Events$2, Group, IORedisConnection$1, RedisConnection$1, Scripts$1, parser$3;
    parser$3 = parser;
    Events$2 = Events_1;
    RedisConnection$1 = require$$2;
    IORedisConnection$1 = require$$3;
    Scripts$1 = require$$4;
    Group = (function() {
        class Group {
            constructor(limiterOptions = {}){
                this.deleteKey = this.deleteKey.bind(this);
                this.limiterOptions = limiterOptions;
                parser$3.load(this.limiterOptions, this.defaults, this);
                this.Events = new Events$2(this);
                this.instances = {};
                this.Bottleneck = Bottleneck_1;
                this._startAutoCleanup();
                this.sharedConnection = this.connection != null;
                if (this.connection == null) {
                    if (this.limiterOptions.datastore === "redis") {
                        this.connection = new RedisConnection$1(Object.assign({}, this.limiterOptions, {
                            Events: this.Events
                        }));
                    } else if (this.limiterOptions.datastore === "ioredis") {
                        this.connection = new IORedisConnection$1(Object.assign({}, this.limiterOptions, {
                            Events: this.Events
                        }));
                    }
                }
            }
            key(key = "") {
                var ref;
                return (ref = this.instances[key]) != null ? ref : (()=>{
                    var limiter;
                    limiter = this.instances[key] = new this.Bottleneck(Object.assign(this.limiterOptions, {
                        id: `${this.id}-${key}`,
                        timeout: this.timeout,
                        connection: this.connection
                    }));
                    this.Events.trigger("created", limiter, key);
                    return limiter;
                })();
            }
            async deleteKey(key = "") {
                var deleted, instance;
                instance = this.instances[key];
                if (this.connection) {
                    deleted = await this.connection.__runCommand__([
                        "del",
                        ...Scripts$1.allKeys(`${this.id}-${key}`)
                    ]);
                }
                if (instance != null) {
                    delete this.instances[key];
                    await instance.disconnect();
                }
                return instance != null || deleted > 0;
            }
            limiters() {
                var k, ref, results, v;
                ref = this.instances;
                results = [];
                for(k in ref){
                    v = ref[k];
                    results.push({
                        key: k,
                        limiter: v
                    });
                }
                return results;
            }
            keys() {
                return Object.keys(this.instances);
            }
            async clusterKeys() {
                var cursor, end, found, i, k, keys, len, next, start;
                if (this.connection == null) {
                    return this.Promise.resolve(this.keys());
                }
                keys = [];
                cursor = null;
                start = `b_${this.id}-`.length;
                end = "_settings".length;
                while(cursor !== 0){
                    [next, found] = await this.connection.__runCommand__([
                        "scan",
                        cursor != null ? cursor : 0,
                        "match",
                        `b_${this.id}-*_settings`,
                        "count",
                        10000
                    ]);
                    cursor = ~~next;
                    for(i = 0, len = found.length; i < len; i++){
                        k = found[i];
                        keys.push(k.slice(start, -end));
                    }
                }
                return keys;
            }
            _startAutoCleanup() {
                var base;
                clearInterval(this.interval);
                return typeof (base = this.interval = setInterval(async ()=>{
                    var e, k, ref, results, time, v;
                    time = Date.now();
                    ref = this.instances;
                    results = [];
                    for(k in ref){
                        v = ref[k];
                        try {
                            if (await v._store.__groupCheck__(time)) {
                                results.push(this.deleteKey(k));
                            } else {
                                results.push(void 0);
                            }
                        } catch (error) {
                            e = error;
                            results.push(v.Events.trigger("error", e));
                        }
                    }
                    return results;
                }, this.timeout / 2)).unref === "function" ? base.unref() : void 0;
            }
            updateSettings(options = {}) {
                parser$3.overwrite(options, this.defaults, this);
                parser$3.overwrite(options, options, this.limiterOptions);
                if (options.timeout != null) {
                    return this._startAutoCleanup();
                }
            }
            disconnect(flush = true) {
                var ref;
                if (!this.sharedConnection) {
                    return (ref = this.connection) != null ? ref.disconnect(flush) : void 0;
                }
            }
        }
        Group.prototype.defaults = {
            timeout: 1000 * 60 * 5,
            connection: null,
            Promise: Promise,
            id: "group-key"
        };
        return Group;
    }).call(commonjsGlobal);
    var Group_1 = Group;
    var Batcher, Events$3, parser$4;
    parser$4 = parser;
    Events$3 = Events_1;
    Batcher = (function() {
        class Batcher {
            constructor(options = {}){
                this.options = options;
                parser$4.load(this.options, this.defaults, this);
                this.Events = new Events$3(this);
                this._arr = [];
                this._resetPromise();
                this._lastFlush = Date.now();
            }
            _resetPromise() {
                return this._promise = new this.Promise((res, rej)=>{
                    return this._resolve = res;
                });
            }
            _flush() {
                clearTimeout(this._timeout);
                this._lastFlush = Date.now();
                this._resolve();
                this.Events.trigger("batch", this._arr);
                this._arr = [];
                return this._resetPromise();
            }
            add(data) {
                var ret;
                this._arr.push(data);
                ret = this._promise;
                if (this._arr.length === this.maxSize) {
                    this._flush();
                } else if (this.maxTime != null && this._arr.length === 1) {
                    this._timeout = setTimeout(()=>{
                        return this._flush();
                    }, this.maxTime);
                }
                return ret;
            }
        }
        Batcher.prototype.defaults = {
            maxTime: null,
            maxSize: null,
            Promise: Promise
        };
        return Batcher;
    }).call(commonjsGlobal);
    var Batcher_1 = Batcher;
    var require$$4$1 = ()=>console.log("You must import the full version of Bottleneck in order to use this feature.");
    var require$$8 = getCjsExportFromNamespace(version$2);
    var Bottleneck, DEFAULT_PRIORITY$1, Events$4, Job$1, LocalDatastore$1, NUM_PRIORITIES$1, Queues$1, RedisDatastore$1, States$1, Sync$1, parser$5, splice = [].splice;
    NUM_PRIORITIES$1 = 10;
    DEFAULT_PRIORITY$1 = 5;
    parser$5 = parser;
    Queues$1 = Queues_1;
    Job$1 = Job_1;
    LocalDatastore$1 = LocalDatastore_1;
    RedisDatastore$1 = require$$4$1;
    Events$4 = Events_1;
    States$1 = States_1;
    Sync$1 = Sync_1;
    Bottleneck = (function() {
        class Bottleneck {
            constructor(options = {}, ...invalid){
                var storeInstanceOptions, storeOptions;
                this._addToQueue = this._addToQueue.bind(this);
                this._validateOptions(options, invalid);
                parser$5.load(options, this.instanceDefaults, this);
                this._queues = new Queues$1(NUM_PRIORITIES$1);
                this._scheduled = {};
                this._states = new States$1([
                    "RECEIVED",
                    "QUEUED",
                    "RUNNING",
                    "EXECUTING"
                ].concat(this.trackDoneStatus ? [
                    "DONE"
                ] : []));
                this._limiter = null;
                this.Events = new Events$4(this);
                this._submitLock = new Sync$1("submit", this.Promise);
                this._registerLock = new Sync$1("register", this.Promise);
                storeOptions = parser$5.load(options, this.storeDefaults, {});
                this._store = (function() {
                    if (this.datastore === "redis" || this.datastore === "ioredis" || this.connection != null) {
                        storeInstanceOptions = parser$5.load(options, this.redisStoreDefaults, {});
                        return new RedisDatastore$1(this, storeOptions, storeInstanceOptions);
                    } else if (this.datastore === "local") {
                        storeInstanceOptions = parser$5.load(options, this.localStoreDefaults, {});
                        return new LocalDatastore$1(this, storeOptions, storeInstanceOptions);
                    } else {
                        throw new Bottleneck.prototype.BottleneckError(`Invalid datastore type: ${this.datastore}`);
                    }
                }).call(this);
                this._queues.on("leftzero", ()=>{
                    var ref;
                    return (ref = this._store.heartbeat) != null ? typeof ref.ref === "function" ? ref.ref() : void 0 : void 0;
                });
                this._queues.on("zero", ()=>{
                    var ref;
                    return (ref = this._store.heartbeat) != null ? typeof ref.unref === "function" ? ref.unref() : void 0 : void 0;
                });
            }
            _validateOptions(options, invalid) {
                if (!(options != null && typeof options === "object" && invalid.length === 0)) {
                    throw new Bottleneck.prototype.BottleneckError("Bottleneck v2 takes a single object argument. Refer to https://github.com/SGrondin/bottleneck#upgrading-to-v2 if you're upgrading from Bottleneck v1.");
                }
            }
            ready() {
                return this._store.ready;
            }
            clients() {
                return this._store.clients;
            }
            channel() {
                return `b_${this.id}`;
            }
            channel_client() {
                return `b_${this.id}_${this._store.clientId}`;
            }
            publish(message) {
                return this._store.__publish__(message);
            }
            disconnect(flush = true) {
                return this._store.__disconnect__(flush);
            }
            chain(_limiter) {
                this._limiter = _limiter;
                return this;
            }
            queued(priority) {
                return this._queues.queued(priority);
            }
            clusterQueued() {
                return this._store.__queued__();
            }
            empty() {
                return this.queued() === 0 && this._submitLock.isEmpty();
            }
            running() {
                return this._store.__running__();
            }
            done() {
                return this._store.__done__();
            }
            jobStatus(id) {
                return this._states.jobStatus(id);
            }
            jobs(status) {
                return this._states.statusJobs(status);
            }
            counts() {
                return this._states.statusCounts();
            }
            _randomIndex() {
                return Math.random().toString(36).slice(2);
            }
            check(weight = 1) {
                return this._store.__check__(weight);
            }
            _clearGlobalState(index) {
                if (this._scheduled[index] != null) {
                    clearTimeout(this._scheduled[index].expiration);
                    delete this._scheduled[index];
                    return true;
                } else {
                    return false;
                }
            }
            async _free(index, job, options, eventInfo) {
                var e, running;
                try {
                    ({ running } = await this._store.__free__(index, options.weight));
                    this.Events.trigger("debug", `Freed ${options.id}`, eventInfo);
                    if (running === 0 && this.empty()) {
                        return this.Events.trigger("idle");
                    }
                } catch (error1) {
                    e = error1;
                    return this.Events.trigger("error", e);
                }
            }
            _run(index, job, wait) {
                var clearGlobalState, free, run;
                job.doRun();
                clearGlobalState = this._clearGlobalState.bind(this, index);
                run = this._run.bind(this, index, job);
                free = this._free.bind(this, index, job);
                return this._scheduled[index] = {
                    timeout: setTimeout(()=>{
                        return job.doExecute(this._limiter, clearGlobalState, run, free);
                    }, wait),
                    expiration: job.options.expiration != null ? setTimeout(function() {
                        return job.doExpire(clearGlobalState, run, free);
                    }, wait + job.options.expiration) : void 0,
                    job: job
                };
            }
            _drainOne(capacity) {
                return this._registerLock.schedule(()=>{
                    var args, index, next, options, queue;
                    if (this.queued() === 0) {
                        return this.Promise.resolve(null);
                    }
                    queue = this._queues.getFirst();
                    ({ options, args } = next = queue.first());
                    if (capacity != null && options.weight > capacity) {
                        return this.Promise.resolve(null);
                    }
                    this.Events.trigger("debug", `Draining ${options.id}`, {
                        args,
                        options
                    });
                    index = this._randomIndex();
                    return this._store.__register__(index, options.weight, options.expiration).then(({ success, wait, reservoir })=>{
                        var empty;
                        this.Events.trigger("debug", `Drained ${options.id}`, {
                            success,
                            args,
                            options
                        });
                        if (success) {
                            queue.shift();
                            empty = this.empty();
                            if (empty) {
                                this.Events.trigger("empty");
                            }
                            if (reservoir === 0) {
                                this.Events.trigger("depleted", empty);
                            }
                            this._run(index, next, wait);
                            return this.Promise.resolve(options.weight);
                        } else {
                            return this.Promise.resolve(null);
                        }
                    });
                });
            }
            _drainAll(capacity, total = 0) {
                return this._drainOne(capacity).then((drained)=>{
                    var newCapacity;
                    if (drained != null) {
                        newCapacity = capacity != null ? capacity - drained : capacity;
                        return this._drainAll(newCapacity, total + drained);
                    } else {
                        return this.Promise.resolve(total);
                    }
                }).catch((e)=>{
                    return this.Events.trigger("error", e);
                });
            }
            _dropAllQueued(message) {
                return this._queues.shiftAll(function(job) {
                    return job.doDrop({
                        message
                    });
                });
            }
            stop(options = {}) {
                var done, waitForExecuting;
                options = parser$5.load(options, this.stopDefaults);
                waitForExecuting = (at)=>{
                    var finished;
                    finished = ()=>{
                        var counts;
                        counts = this._states.counts;
                        return counts[0] + counts[1] + counts[2] + counts[3] === at;
                    };
                    return new this.Promise((resolve, reject)=>{
                        if (finished()) {
                            return resolve();
                        } else {
                            return this.on("done", ()=>{
                                if (finished()) {
                                    this.removeAllListeners("done");
                                    return resolve();
                                }
                            });
                        }
                    });
                };
                done = options.dropWaitingJobs ? (this._run = function(index, next) {
                    return next.doDrop({
                        message: options.dropErrorMessage
                    });
                }, this._drainOne = ()=>{
                    return this.Promise.resolve(null);
                }, this._registerLock.schedule(()=>{
                    return this._submitLock.schedule(()=>{
                        var k, ref, v;
                        ref = this._scheduled;
                        for(k in ref){
                            v = ref[k];
                            if (this.jobStatus(v.job.options.id) === "RUNNING") {
                                clearTimeout(v.timeout);
                                clearTimeout(v.expiration);
                                v.job.doDrop({
                                    message: options.dropErrorMessage
                                });
                            }
                        }
                        this._dropAllQueued(options.dropErrorMessage);
                        return waitForExecuting(0);
                    });
                })) : this.schedule({
                    priority: NUM_PRIORITIES$1 - 1,
                    weight: 0
                }, ()=>{
                    return waitForExecuting(1);
                });
                this._receive = function(job) {
                    return job._reject(new Bottleneck.prototype.BottleneckError(options.enqueueErrorMessage));
                };
                this.stop = ()=>{
                    return this.Promise.reject(new Bottleneck.prototype.BottleneckError("stop() has already been called"));
                };
                return done;
            }
            async _addToQueue(job) {
                var args, blocked, error, options, reachedHWM, shifted, strategy;
                ({ args, options } = job);
                try {
                    ({ reachedHWM, blocked, strategy } = await this._store.__submit__(this.queued(), options.weight));
                } catch (error1) {
                    error = error1;
                    this.Events.trigger("debug", `Could not queue ${options.id}`, {
                        args,
                        options,
                        error
                    });
                    job.doDrop({
                        error
                    });
                    return false;
                }
                if (blocked) {
                    job.doDrop();
                    return true;
                } else if (reachedHWM) {
                    shifted = strategy === Bottleneck.prototype.strategy.LEAK ? this._queues.shiftLastFrom(options.priority) : strategy === Bottleneck.prototype.strategy.OVERFLOW_PRIORITY ? this._queues.shiftLastFrom(options.priority + 1) : strategy === Bottleneck.prototype.strategy.OVERFLOW ? job : void 0;
                    if (shifted != null) {
                        shifted.doDrop();
                    }
                    if (shifted == null || strategy === Bottleneck.prototype.strategy.OVERFLOW) {
                        if (shifted == null) {
                            job.doDrop();
                        }
                        return reachedHWM;
                    }
                }
                job.doQueue(reachedHWM, blocked);
                this._queues.push(job);
                await this._drainAll();
                return reachedHWM;
            }
            _receive(job) {
                if (this._states.jobStatus(job.options.id) != null) {
                    job._reject(new Bottleneck.prototype.BottleneckError(`A job with the same id already exists (id=${job.options.id})`));
                    return false;
                } else {
                    job.doReceive();
                    return this._submitLock.schedule(this._addToQueue, job);
                }
            }
            submit(...args) {
                var cb, fn, job, options, ref, ref1, task;
                if (typeof args[0] === "function") {
                    ref = args, [fn, ...args] = ref, [cb] = splice.call(args, -1);
                    options = parser$5.load({}, this.jobDefaults);
                } else {
                    ref1 = args, [options, fn, ...args] = ref1, [cb] = splice.call(args, -1);
                    options = parser$5.load(options, this.jobDefaults);
                }
                task = (...args)=>{
                    return new this.Promise(function(resolve, reject) {
                        return fn(...args, function(...args) {
                            return (args[0] != null ? reject : resolve)(args);
                        });
                    });
                };
                job = new Job$1(task, args, options, this.jobDefaults, this.rejectOnDrop, this.Events, this._states, this.Promise);
                job.promise.then(function(args) {
                    return typeof cb === "function" ? cb(...args) : void 0;
                }).catch(function(args) {
                    if (Array.isArray(args)) {
                        return typeof cb === "function" ? cb(...args) : void 0;
                    } else {
                        return typeof cb === "function" ? cb(args) : void 0;
                    }
                });
                return this._receive(job);
            }
            schedule(...args) {
                var job, options, task;
                if (typeof args[0] === "function") {
                    [task, ...args] = args;
                    options = {};
                } else {
                    [options, task, ...args] = args;
                }
                job = new Job$1(task, args, options, this.jobDefaults, this.rejectOnDrop, this.Events, this._states, this.Promise);
                this._receive(job);
                return job.promise;
            }
            wrap(fn) {
                var schedule, wrapped;
                schedule = this.schedule.bind(this);
                wrapped = function(...args) {
                    return schedule(fn.bind(this), ...args);
                };
                wrapped.withOptions = function(options, ...args) {
                    return schedule(options, fn, ...args);
                };
                return wrapped;
            }
            async updateSettings(options = {}) {
                await this._store.__updateSettings__(parser$5.overwrite(options, this.storeDefaults));
                parser$5.overwrite(options, this.instanceDefaults, this);
                return this;
            }
            currentReservoir() {
                return this._store.__currentReservoir__();
            }
            incrementReservoir(incr = 0) {
                return this._store.__incrementReservoir__(incr);
            }
        }
        Bottleneck.default = Bottleneck;
        Bottleneck.Events = Events$4;
        Bottleneck.version = Bottleneck.prototype.version = require$$8.version;
        Bottleneck.strategy = Bottleneck.prototype.strategy = {
            LEAK: 1,
            OVERFLOW: 2,
            OVERFLOW_PRIORITY: 4,
            BLOCK: 3
        };
        Bottleneck.BottleneckError = Bottleneck.prototype.BottleneckError = BottleneckError_1;
        Bottleneck.Group = Bottleneck.prototype.Group = Group_1;
        Bottleneck.RedisConnection = Bottleneck.prototype.RedisConnection = require$$2;
        Bottleneck.IORedisConnection = Bottleneck.prototype.IORedisConnection = require$$3;
        Bottleneck.Batcher = Bottleneck.prototype.Batcher = Batcher_1;
        Bottleneck.prototype.jobDefaults = {
            priority: DEFAULT_PRIORITY$1,
            weight: 1,
            expiration: null,
            id: "<no-id>"
        };
        Bottleneck.prototype.storeDefaults = {
            maxConcurrent: null,
            minTime: 0,
            highWater: null,
            strategy: Bottleneck.prototype.strategy.LEAK,
            penalty: null,
            reservoir: null,
            reservoirRefreshInterval: null,
            reservoirRefreshAmount: null,
            reservoirIncreaseInterval: null,
            reservoirIncreaseAmount: null,
            reservoirIncreaseMaximum: null
        };
        Bottleneck.prototype.localStoreDefaults = {
            Promise: Promise,
            timeout: null,
            heartbeatInterval: 250
        };
        Bottleneck.prototype.redisStoreDefaults = {
            Promise: Promise,
            timeout: null,
            heartbeatInterval: 5000,
            clientTimeout: 10000,
            Redis: null,
            clientOptions: {},
            clusterNodes: null,
            clearDatastore: false,
            connection: null
        };
        Bottleneck.prototype.instanceDefaults = {
            datastore: "local",
            connection: null,
            id: "<no-id>",
            rejectOnDrop: true,
            trackDoneStatus: false,
            Promise: Promise
        };
        Bottleneck.prototype.stopDefaults = {
            enqueueErrorMessage: "This limiter has been stopped and cannot accept new jobs.",
            dropWaitingJobs: true,
            dropErrorMessage: "This limiter has been stopped."
        };
        return Bottleneck;
    }).call(commonjsGlobal);
    var Bottleneck_1 = Bottleneck;
    var lib = Bottleneck_1;
    return lib;
});


/***/ }),

/***/ 95000:
/***/ ((module) => {

"use strict";

module.exports = function btoa(str) {
    return new Buffer(str).toString("base64");
};


/***/ }),

/***/ 71275:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*jshint node:true */ 
var Buffer = (__webpack_require__(14300).Buffer); // browserify
var SlowBuffer = (__webpack_require__(14300).SlowBuffer);
module.exports = bufferEq;
function bufferEq(a, b) {
    // shortcutting on type is necessary for correctness
    if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
        return false;
    }
    // buffer sizes should be well-known information, so despite this
    // shortcutting, it doesn't leak any information about the *contents* of the
    // buffers.
    if (a.length !== b.length) {
        return false;
    }
    var c = 0;
    for(var i = 0; i < a.length; i++){
        /*jshint bitwise:false */ c |= a[i] ^ b[i]; // XOR
    }
    return c === 0;
}
bufferEq.install = function() {
    Buffer.prototype.equal = SlowBuffer.prototype.equal = function equal(that) {
        return bufferEq(this, that);
    };
};
var origBufEqual = Buffer.prototype.equal;
var origSlowBufEqual = SlowBuffer.prototype.equal;
bufferEq.restore = function() {
    Buffer.prototype.equal = origBufEqual;
    SlowBuffer.prototype.equal = origSlowBufEqual;
};


/***/ }),

/***/ 86955:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const os = __webpack_require__(22037);
const extractPathRegex = /\s+at.*(?:\(|\s)(.*)\)?/;
const pathRegex = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:babel-polyfill|pirates)\/.*)?\w+)\.js:\d+:\d+)|native)/;
const homeDir = typeof os.homedir === "undefined" ? "" : os.homedir();
module.exports = (stack, options)=>{
    options = Object.assign({
        pretty: false
    }, options);
    return stack.replace(/\\/g, "/").split("\n").filter((line)=>{
        const pathMatches = line.match(extractPathRegex);
        if (pathMatches === null || !pathMatches[1]) {
            return true;
        }
        const match = pathMatches[1];
        // Electron
        if (match.includes(".app/Contents/Resources/electron.asar") || match.includes(".app/Contents/Resources/default_app.asar")) {
            return false;
        }
        return !pathRegex.test(match);
    }).filter((line)=>line.trim() !== "").map((line)=>{
        if (options.pretty) {
            return line.replace(extractPathRegex, (m, p1)=>m.replace(p1, p1.replace(homeDir, "~")));
        }
        return line;
    }).join("\n");
};


/***/ }),

/***/ 753:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
class Deprecation extends Error {
    constructor(message){
        super(message); // Maintains proper stack trace (only available on V8)
        /* istanbul ignore next */ if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
        this.name = "Deprecation";
    }
}
exports.Deprecation = Deprecation;


/***/ }),

/***/ 17659:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var Buffer = (__webpack_require__(31371).Buffer);
var getParamBytesForAlg = __webpack_require__(33036);
var MAX_OCTET = 0x80, CLASS_UNIVERSAL = 0, PRIMITIVE_BIT = 0x20, TAG_SEQ = 0x10, TAG_INT = 0x02, ENCODED_TAG_SEQ = TAG_SEQ | PRIMITIVE_BIT | CLASS_UNIVERSAL << 6, ENCODED_TAG_INT = TAG_INT | CLASS_UNIVERSAL << 6;
function base64Url(base64) {
    return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function signatureAsBuffer(signature) {
    if (Buffer.isBuffer(signature)) {
        return signature;
    } else if ("string" === typeof signature) {
        return Buffer.from(signature, "base64");
    }
    throw new TypeError("ECDSA signature must be a Base64 string or a Buffer");
}
function derToJose(signature, alg) {
    signature = signatureAsBuffer(signature);
    var paramBytes = getParamBytesForAlg(alg);
    // the DER encoded param should at most be the param size, plus a padding
    // zero, since due to being a signed integer
    var maxEncodedParamLength = paramBytes + 1;
    var inputLength = signature.length;
    var offset = 0;
    if (signature[offset++] !== ENCODED_TAG_SEQ) {
        throw new Error('Could not find expected "seq"');
    }
    var seqLength = signature[offset++];
    if (seqLength === (MAX_OCTET | 1)) {
        seqLength = signature[offset++];
    }
    if (inputLength - offset < seqLength) {
        throw new Error('"seq" specified length of "' + seqLength + '", only "' + (inputLength - offset) + '" remaining');
    }
    if (signature[offset++] !== ENCODED_TAG_INT) {
        throw new Error('Could not find expected "int" for "r"');
    }
    var rLength = signature[offset++];
    if (inputLength - offset - 2 < rLength) {
        throw new Error('"r" specified length of "' + rLength + '", only "' + (inputLength - offset - 2) + '" available');
    }
    if (maxEncodedParamLength < rLength) {
        throw new Error('"r" specified length of "' + rLength + '", max of "' + maxEncodedParamLength + '" is acceptable');
    }
    var rOffset = offset;
    offset += rLength;
    if (signature[offset++] !== ENCODED_TAG_INT) {
        throw new Error('Could not find expected "int" for "s"');
    }
    var sLength = signature[offset++];
    if (inputLength - offset !== sLength) {
        throw new Error('"s" specified length of "' + sLength + '", expected "' + (inputLength - offset) + '"');
    }
    if (maxEncodedParamLength < sLength) {
        throw new Error('"s" specified length of "' + sLength + '", max of "' + maxEncodedParamLength + '" is acceptable');
    }
    var sOffset = offset;
    offset += sLength;
    if (offset !== inputLength) {
        throw new Error('Expected to consume entire buffer, but "' + (inputLength - offset) + '" bytes remain');
    }
    var rPadding = paramBytes - rLength, sPadding = paramBytes - sLength;
    var dst = Buffer.allocUnsafe(rPadding + rLength + sPadding + sLength);
    for(offset = 0; offset < rPadding; ++offset){
        dst[offset] = 0;
    }
    signature.copy(dst, offset, rOffset + Math.max(-rPadding, 0), rOffset + rLength);
    offset = paramBytes;
    for(var o = offset; offset < o + sPadding; ++offset){
        dst[offset] = 0;
    }
    signature.copy(dst, offset, sOffset + Math.max(-sPadding, 0), sOffset + sLength);
    dst = dst.toString("base64");
    dst = base64Url(dst);
    return dst;
}
function countPadding(buf, start, stop) {
    var padding = 0;
    while(start + padding < stop && buf[start + padding] === 0){
        ++padding;
    }
    var needsSign = buf[start + padding] >= MAX_OCTET;
    if (needsSign) {
        --padding;
    }
    return padding;
}
function joseToDer(signature, alg) {
    signature = signatureAsBuffer(signature);
    var paramBytes = getParamBytesForAlg(alg);
    var signatureBytes = signature.length;
    if (signatureBytes !== paramBytes * 2) {
        throw new TypeError('"' + alg + '" signatures must be "' + paramBytes * 2 + '" bytes, saw "' + signatureBytes + '"');
    }
    var rPadding = countPadding(signature, 0, paramBytes);
    var sPadding = countPadding(signature, paramBytes, signature.length);
    var rLength = paramBytes - rPadding;
    var sLength = paramBytes - sPadding;
    var rsBytes = 1 + 1 + rLength + 1 + 1 + sLength;
    var shortLength = rsBytes < MAX_OCTET;
    var dst = Buffer.allocUnsafe((shortLength ? 2 : 3) + rsBytes);
    var offset = 0;
    dst[offset++] = ENCODED_TAG_SEQ;
    if (shortLength) {
        // Bit 8 has value "0"
        // bits 7-1 give the length.
        dst[offset++] = rsBytes;
    } else {
        // Bit 8 of first octet has value "1"
        // bits 7-1 give the number of additional length octets.
        dst[offset++] = MAX_OCTET | 1;
        // length, base 256
        dst[offset++] = rsBytes & 0xff;
    }
    dst[offset++] = ENCODED_TAG_INT;
    dst[offset++] = rLength;
    if (rPadding < 0) {
        dst[offset++] = 0;
        offset += signature.copy(dst, offset, 0, paramBytes);
    } else {
        offset += signature.copy(dst, offset, rPadding, paramBytes);
    }
    dst[offset++] = ENCODED_TAG_INT;
    dst[offset++] = sLength;
    if (sPadding < 0) {
        dst[offset++] = 0;
        signature.copy(dst, offset, paramBytes);
    } else {
        signature.copy(dst, offset, paramBytes + sPadding);
    }
    return dst;
}
module.exports = {
    derToJose: derToJose,
    joseToDer: joseToDer
};


/***/ }),

/***/ 33036:
/***/ ((module) => {

"use strict";

function getParamSize(keySize) {
    var result = (keySize / 8 | 0) + (keySize % 8 === 0 ? 0 : 1);
    return result;
}
var paramBytesForAlg = {
    ES256: getParamSize(256),
    ES384: getParamSize(384),
    ES512: getParamSize(521)
};
function getParamBytesForAlg(alg) {
    var paramBytes = paramBytesForAlg[alg];
    if (paramBytes) {
        return paramBytes;
    }
    throw new Error('Unknown algorithm "' + alg + '"');
}
module.exports = getParamBytesForAlg;


/***/ }),

/***/ 45979:
/***/ ((module) => {

"use strict";

module.exports = (string, count = 1, options)=>{
    options = {
        indent: " ",
        includeEmptyLines: false,
        ...options
    };
    if (typeof string !== "string") {
        throw new TypeError(`Expected \`input\` to be a \`string\`, got \`${typeof string}\``);
    }
    if (typeof count !== "number") {
        throw new TypeError(`Expected \`count\` to be a \`number\`, got \`${typeof count}\``);
    }
    if (typeof options.indent !== "string") {
        throw new TypeError(`Expected \`options.indent\` to be a \`string\`, got \`${typeof options.indent}\``);
    }
    if (count === 0) {
        return string;
    }
    const regex = options.includeEmptyLines ? /^/gm : /^(?!\s*$)/gm;
    return string.replace(regex, options.indent.repeat(count));
};


/***/ }),

/***/ 24896:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var jws = __webpack_require__(37687);
module.exports = function(jwt, options) {
    options = options || {};
    var decoded = jws.decode(jwt, options);
    if (!decoded) {
        return null;
    }
    var payload = decoded.payload;
    //try parse the payload
    if (typeof payload === "string") {
        try {
            var obj = JSON.parse(payload);
            if (obj !== null && typeof obj === "object") {
                payload = obj;
            }
        } catch (e) {}
    }
    //return header if `complete` option is enabled.  header includes claims
    //such as `kid` and `alg` used to select the key within a JWKS needed to
    //verify the signature
    if (options.complete === true) {
        return {
            header: decoded.header,
            payload: payload,
            signature: decoded.signature
        };
    }
    return payload;
};


/***/ }),

/***/ 15232:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = {
    decode: __webpack_require__(24896),
    verify: __webpack_require__(41094),
    sign: __webpack_require__(15187),
    JsonWebTokenError: __webpack_require__(30330),
    NotBeforeError: __webpack_require__(23615),
    TokenExpiredError: __webpack_require__(25372)
};


/***/ }),

/***/ 30330:
/***/ ((module) => {

"use strict";

var JsonWebTokenError = function(message, error) {
    Error.call(this, message);
    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
    }
    this.name = "JsonWebTokenError";
    this.message = message;
    if (error) this.inner = error;
};
JsonWebTokenError.prototype = Object.create(Error.prototype);
JsonWebTokenError.prototype.constructor = JsonWebTokenError;
module.exports = JsonWebTokenError;


/***/ }),

/***/ 23615:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var JsonWebTokenError = __webpack_require__(30330);
var NotBeforeError = function(message, date) {
    JsonWebTokenError.call(this, message);
    this.name = "NotBeforeError";
    this.date = date;
};
NotBeforeError.prototype = Object.create(JsonWebTokenError.prototype);
NotBeforeError.prototype.constructor = NotBeforeError;
module.exports = NotBeforeError;


/***/ }),

/***/ 25372:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var JsonWebTokenError = __webpack_require__(30330);
var TokenExpiredError = function(message, expiredAt) {
    JsonWebTokenError.call(this, message);
    this.name = "TokenExpiredError";
    this.expiredAt = expiredAt;
};
TokenExpiredError.prototype = Object.create(JsonWebTokenError.prototype);
TokenExpiredError.prototype.constructor = TokenExpiredError;
module.exports = TokenExpiredError;


/***/ }),

/***/ 40061:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const semver = __webpack_require__(37644);
module.exports = semver.satisfies(process.version, ">=15.7.0");


/***/ }),

/***/ 62131:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var semver = __webpack_require__(37644);
module.exports = semver.satisfies(process.version, "^6.12.0 || >=8.0.0");


/***/ }),

/***/ 70773:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const semver = __webpack_require__(37644);
module.exports = semver.satisfies(process.version, ">=16.9.0");


/***/ }),

/***/ 38651:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var ms = __webpack_require__(87569);
module.exports = function(time, iat) {
    var timestamp = iat || Math.floor(Date.now() / 1000);
    if (typeof time === "string") {
        var milliseconds = ms(time);
        if (typeof milliseconds === "undefined") {
            return;
        }
        return Math.floor(timestamp + milliseconds / 1000);
    } else if (typeof time === "number") {
        return timestamp + time;
    } else {
        return;
    }
};


/***/ }),

/***/ 54008:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const ASYMMETRIC_KEY_DETAILS_SUPPORTED = __webpack_require__(40061);
const RSA_PSS_KEY_DETAILS_SUPPORTED = __webpack_require__(70773);
const allowedAlgorithmsForKeys = {
    "ec": [
        "ES256",
        "ES384",
        "ES512"
    ],
    "rsa": [
        "RS256",
        "PS256",
        "RS384",
        "PS384",
        "RS512",
        "PS512"
    ],
    "rsa-pss": [
        "PS256",
        "PS384",
        "PS512"
    ]
};
const allowedCurves = {
    ES256: "prime256v1",
    ES384: "secp384r1",
    ES512: "secp521r1"
};
module.exports = function(algorithm, key) {
    if (!algorithm || !key) return;
    const keyType = key.asymmetricKeyType;
    if (!keyType) return;
    const allowedAlgorithms = allowedAlgorithmsForKeys[keyType];
    if (!allowedAlgorithms) {
        throw new Error(`Unknown key type "${keyType}".`);
    }
    if (!allowedAlgorithms.includes(algorithm)) {
        throw new Error(`"alg" parameter for "${keyType}" key type must be one of: ${allowedAlgorithms.join(", ")}.`);
    }
    /*
   * Ignore the next block from test coverage because it gets executed
   * conditionally depending on the Node version. Not ignoring it would
   * prevent us from reaching the target % of coverage for versions of
   * Node under 15.7.0.
   */ /* istanbul ignore next */ if (ASYMMETRIC_KEY_DETAILS_SUPPORTED) {
        switch(keyType){
            case "ec":
                const keyCurve = key.asymmetricKeyDetails.namedCurve;
                const allowedCurve = allowedCurves[algorithm];
                if (keyCurve !== allowedCurve) {
                    throw new Error(`"alg" parameter "${algorithm}" requires curve "${allowedCurve}".`);
                }
                break;
            case "rsa-pss":
                if (RSA_PSS_KEY_DETAILS_SUPPORTED) {
                    const length = parseInt(algorithm.slice(-3), 10);
                    const { hashAlgorithm, mgf1HashAlgorithm, saltLength } = key.asymmetricKeyDetails;
                    if (hashAlgorithm !== `sha${length}` || mgf1HashAlgorithm !== hashAlgorithm) {
                        throw new Error(`Invalid key for this operation, its RSA-PSS parameters do not meet the requirements of "alg" ${algorithm}.`);
                    }
                    if (saltLength !== undefined && saltLength > length >> 3) {
                        throw new Error(`Invalid key for this operation, its RSA-PSS parameter saltLength does not meet the requirements of "alg" ${algorithm}.`);
                    }
                }
                break;
        }
    }
};


/***/ }),

/***/ 15187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const timespan = __webpack_require__(38651);
const PS_SUPPORTED = __webpack_require__(62131);
const validateAsymmetricKey = __webpack_require__(54008);
const jws = __webpack_require__(37687);
const includes = __webpack_require__(75141);
const isBoolean = __webpack_require__(36471);
const isInteger = __webpack_require__(56652);
const isNumber = __webpack_require__(60379);
const isPlainObject = __webpack_require__(56111);
const isString = __webpack_require__(39458);
const once = __webpack_require__(81320);
const { KeyObject, createSecretKey, createPrivateKey } = __webpack_require__(6113);
const SUPPORTED_ALGS = [
    "RS256",
    "RS384",
    "RS512",
    "ES256",
    "ES384",
    "ES512",
    "HS256",
    "HS384",
    "HS512",
    "none"
];
if (PS_SUPPORTED) {
    SUPPORTED_ALGS.splice(3, 0, "PS256", "PS384", "PS512");
}
const sign_options_schema = {
    expiresIn: {
        isValid: function(value) {
            return isInteger(value) || isString(value) && value;
        },
        message: '"expiresIn" should be a number of seconds or string representing a timespan'
    },
    notBefore: {
        isValid: function(value) {
            return isInteger(value) || isString(value) && value;
        },
        message: '"notBefore" should be a number of seconds or string representing a timespan'
    },
    audience: {
        isValid: function(value) {
            return isString(value) || Array.isArray(value);
        },
        message: '"audience" must be a string or array'
    },
    algorithm: {
        isValid: includes.bind(null, SUPPORTED_ALGS),
        message: '"algorithm" must be a valid string enum value'
    },
    header: {
        isValid: isPlainObject,
        message: '"header" must be an object'
    },
    encoding: {
        isValid: isString,
        message: '"encoding" must be a string'
    },
    issuer: {
        isValid: isString,
        message: '"issuer" must be a string'
    },
    subject: {
        isValid: isString,
        message: '"subject" must be a string'
    },
    jwtid: {
        isValid: isString,
        message: '"jwtid" must be a string'
    },
    noTimestamp: {
        isValid: isBoolean,
        message: '"noTimestamp" must be a boolean'
    },
    keyid: {
        isValid: isString,
        message: '"keyid" must be a string'
    },
    mutatePayload: {
        isValid: isBoolean,
        message: '"mutatePayload" must be a boolean'
    },
    allowInsecureKeySizes: {
        isValid: isBoolean,
        message: '"allowInsecureKeySizes" must be a boolean'
    },
    allowInvalidAsymmetricKeyTypes: {
        isValid: isBoolean,
        message: '"allowInvalidAsymmetricKeyTypes" must be a boolean'
    }
};
const registered_claims_schema = {
    iat: {
        isValid: isNumber,
        message: '"iat" should be a number of seconds'
    },
    exp: {
        isValid: isNumber,
        message: '"exp" should be a number of seconds'
    },
    nbf: {
        isValid: isNumber,
        message: '"nbf" should be a number of seconds'
    }
};
function validate(schema, allowUnknown, object, parameterName) {
    if (!isPlainObject(object)) {
        throw new Error('Expected "' + parameterName + '" to be a plain object.');
    }
    Object.keys(object).forEach(function(key) {
        const validator = schema[key];
        if (!validator) {
            if (!allowUnknown) {
                throw new Error('"' + key + '" is not allowed in "' + parameterName + '"');
            }
            return;
        }
        if (!validator.isValid(object[key])) {
            throw new Error(validator.message);
        }
    });
}
function validateOptions(options) {
    return validate(sign_options_schema, false, options, "options");
}
function validatePayload(payload) {
    return validate(registered_claims_schema, true, payload, "payload");
}
const options_to_payload = {
    "audience": "aud",
    "issuer": "iss",
    "subject": "sub",
    "jwtid": "jti"
};
const options_for_objects = [
    "expiresIn",
    "notBefore",
    "noTimestamp",
    "audience",
    "issuer",
    "subject",
    "jwtid"
];
module.exports = function(payload, secretOrPrivateKey, options, callback) {
    if (typeof options === "function") {
        callback = options;
        options = {};
    } else {
        options = options || {};
    }
    const isObjectPayload = typeof payload === "object" && !Buffer.isBuffer(payload);
    const header = Object.assign({
        alg: options.algorithm || "HS256",
        typ: isObjectPayload ? "JWT" : undefined,
        kid: options.keyid
    }, options.header);
    function failure(err) {
        if (callback) {
            return callback(err);
        }
        throw err;
    }
    if (!secretOrPrivateKey && options.algorithm !== "none") {
        return failure(new Error("secretOrPrivateKey must have a value"));
    }
    if (secretOrPrivateKey != null && !(secretOrPrivateKey instanceof KeyObject)) {
        try {
            secretOrPrivateKey = createPrivateKey(secretOrPrivateKey);
        } catch (_) {
            try {
                secretOrPrivateKey = createSecretKey(typeof secretOrPrivateKey === "string" ? Buffer.from(secretOrPrivateKey) : secretOrPrivateKey);
            } catch (_) {
                return failure(new Error("secretOrPrivateKey is not valid key material"));
            }
        }
    }
    if (header.alg.startsWith("HS") && secretOrPrivateKey.type !== "secret") {
        return failure(new Error(`secretOrPrivateKey must be a symmetric key when using ${header.alg}`));
    } else if (/^(?:RS|PS|ES)/.test(header.alg)) {
        if (secretOrPrivateKey.type !== "private") {
            return failure(new Error(`secretOrPrivateKey must be an asymmetric key when using ${header.alg}`));
        }
        if (!options.allowInsecureKeySizes && !header.alg.startsWith("ES") && secretOrPrivateKey.asymmetricKeyDetails !== undefined && //KeyObject.asymmetricKeyDetails is supported in Node 15+
        secretOrPrivateKey.asymmetricKeyDetails.modulusLength < 2048) {
            return failure(new Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${header.alg}`));
        }
    }
    if (typeof payload === "undefined") {
        return failure(new Error("payload is required"));
    } else if (isObjectPayload) {
        try {
            validatePayload(payload);
        } catch (error) {
            return failure(error);
        }
        if (!options.mutatePayload) {
            payload = Object.assign({}, payload);
        }
    } else {
        const invalid_options = options_for_objects.filter(function(opt) {
            return typeof options[opt] !== "undefined";
        });
        if (invalid_options.length > 0) {
            return failure(new Error("invalid " + invalid_options.join(",") + " option for " + typeof payload + " payload"));
        }
    }
    if (typeof payload.exp !== "undefined" && typeof options.expiresIn !== "undefined") {
        return failure(new Error('Bad "options.expiresIn" option the payload already has an "exp" property.'));
    }
    if (typeof payload.nbf !== "undefined" && typeof options.notBefore !== "undefined") {
        return failure(new Error('Bad "options.notBefore" option the payload already has an "nbf" property.'));
    }
    try {
        validateOptions(options);
    } catch (error) {
        return failure(error);
    }
    if (!options.allowInvalidAsymmetricKeyTypes) {
        try {
            validateAsymmetricKey(header.alg, secretOrPrivateKey);
        } catch (error) {
            return failure(error);
        }
    }
    const timestamp = payload.iat || Math.floor(Date.now() / 1000);
    if (options.noTimestamp) {
        delete payload.iat;
    } else if (isObjectPayload) {
        payload.iat = timestamp;
    }
    if (typeof options.notBefore !== "undefined") {
        try {
            payload.nbf = timespan(options.notBefore, timestamp);
        } catch (err) {
            return failure(err);
        }
        if (typeof payload.nbf === "undefined") {
            return failure(new Error('"notBefore" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'));
        }
    }
    if (typeof options.expiresIn !== "undefined" && typeof payload === "object") {
        try {
            payload.exp = timespan(options.expiresIn, timestamp);
        } catch (err) {
            return failure(err);
        }
        if (typeof payload.exp === "undefined") {
            return failure(new Error('"expiresIn" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'));
        }
    }
    Object.keys(options_to_payload).forEach(function(key) {
        const claim = options_to_payload[key];
        if (typeof options[key] !== "undefined") {
            if (typeof payload[claim] !== "undefined") {
                return failure(new Error('Bad "options.' + key + '" option. The payload already has an "' + claim + '" property.'));
            }
            payload[claim] = options[key];
        }
    });
    const encoding = options.encoding || "utf8";
    if (typeof callback === "function") {
        callback = callback && once(callback);
        jws.createSign({
            header: header,
            privateKey: secretOrPrivateKey,
            payload: payload,
            encoding: encoding
        }).once("error", callback).once("done", function(signature) {
            // TODO: Remove in favor of the modulus length check before signing once node 15+ is the minimum supported version
            if (!options.allowInsecureKeySizes && /^(?:RS|PS)/.test(header.alg) && signature.length < 256) {
                return callback(new Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${header.alg}`));
            }
            callback(null, signature);
        });
    } else {
        let signature = jws.sign({
            header: header,
            payload: payload,
            secret: secretOrPrivateKey,
            encoding: encoding
        });
        // TODO: Remove in favor of the modulus length check before signing once node 15+ is the minimum supported version
        if (!options.allowInsecureKeySizes && /^(?:RS|PS)/.test(header.alg) && signature.length < 256) {
            throw new Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${header.alg}`);
        }
        return signature;
    }
};


/***/ }),

/***/ 41094:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const JsonWebTokenError = __webpack_require__(30330);
const NotBeforeError = __webpack_require__(23615);
const TokenExpiredError = __webpack_require__(25372);
const decode = __webpack_require__(24896);
const timespan = __webpack_require__(38651);
const validateAsymmetricKey = __webpack_require__(54008);
const PS_SUPPORTED = __webpack_require__(62131);
const jws = __webpack_require__(37687);
const { KeyObject, createSecretKey, createPublicKey } = __webpack_require__(6113);
const PUB_KEY_ALGS = [
    "RS256",
    "RS384",
    "RS512"
];
const EC_KEY_ALGS = [
    "ES256",
    "ES384",
    "ES512"
];
const RSA_KEY_ALGS = [
    "RS256",
    "RS384",
    "RS512"
];
const HS_ALGS = [
    "HS256",
    "HS384",
    "HS512"
];
if (PS_SUPPORTED) {
    PUB_KEY_ALGS.splice(PUB_KEY_ALGS.length, 0, "PS256", "PS384", "PS512");
    RSA_KEY_ALGS.splice(RSA_KEY_ALGS.length, 0, "PS256", "PS384", "PS512");
}
module.exports = function(jwtString, secretOrPublicKey, options, callback) {
    if (typeof options === "function" && !callback) {
        callback = options;
        options = {};
    }
    if (!options) {
        options = {};
    }
    //clone this object since we are going to mutate it.
    options = Object.assign({}, options);
    let done;
    if (callback) {
        done = callback;
    } else {
        done = function(err, data) {
            if (err) throw err;
            return data;
        };
    }
    if (options.clockTimestamp && typeof options.clockTimestamp !== "number") {
        return done(new JsonWebTokenError("clockTimestamp must be a number"));
    }
    if (options.nonce !== undefined && (typeof options.nonce !== "string" || options.nonce.trim() === "")) {
        return done(new JsonWebTokenError("nonce must be a non-empty string"));
    }
    if (options.allowInvalidAsymmetricKeyTypes !== undefined && typeof options.allowInvalidAsymmetricKeyTypes !== "boolean") {
        return done(new JsonWebTokenError("allowInvalidAsymmetricKeyTypes must be a boolean"));
    }
    const clockTimestamp = options.clockTimestamp || Math.floor(Date.now() / 1000);
    if (!jwtString) {
        return done(new JsonWebTokenError("jwt must be provided"));
    }
    if (typeof jwtString !== "string") {
        return done(new JsonWebTokenError("jwt must be a string"));
    }
    const parts = jwtString.split(".");
    if (parts.length !== 3) {
        return done(new JsonWebTokenError("jwt malformed"));
    }
    let decodedToken;
    try {
        decodedToken = decode(jwtString, {
            complete: true
        });
    } catch (err) {
        return done(err);
    }
    if (!decodedToken) {
        return done(new JsonWebTokenError("invalid token"));
    }
    const header = decodedToken.header;
    let getSecret;
    if (typeof secretOrPublicKey === "function") {
        if (!callback) {
            return done(new JsonWebTokenError("verify must be called asynchronous if secret or public key is provided as a callback"));
        }
        getSecret = secretOrPublicKey;
    } else {
        getSecret = function(header, secretCallback) {
            return secretCallback(null, secretOrPublicKey);
        };
    }
    return getSecret(header, function(err, secretOrPublicKey) {
        if (err) {
            return done(new JsonWebTokenError("error in secret or public key callback: " + err.message));
        }
        const hasSignature = parts[2].trim() !== "";
        if (!hasSignature && secretOrPublicKey) {
            return done(new JsonWebTokenError("jwt signature is required"));
        }
        if (hasSignature && !secretOrPublicKey) {
            return done(new JsonWebTokenError("secret or public key must be provided"));
        }
        if (!hasSignature && !options.algorithms) {
            return done(new JsonWebTokenError('please specify "none" in "algorithms" to verify unsigned tokens'));
        }
        if (secretOrPublicKey != null && !(secretOrPublicKey instanceof KeyObject)) {
            try {
                secretOrPublicKey = createPublicKey(secretOrPublicKey);
            } catch (_) {
                try {
                    secretOrPublicKey = createSecretKey(typeof secretOrPublicKey === "string" ? Buffer.from(secretOrPublicKey) : secretOrPublicKey);
                } catch (_) {
                    return done(new JsonWebTokenError("secretOrPublicKey is not valid key material"));
                }
            }
        }
        if (!options.algorithms) {
            if (secretOrPublicKey.type === "secret") {
                options.algorithms = HS_ALGS;
            } else if ([
                "rsa",
                "rsa-pss"
            ].includes(secretOrPublicKey.asymmetricKeyType)) {
                options.algorithms = RSA_KEY_ALGS;
            } else if (secretOrPublicKey.asymmetricKeyType === "ec") {
                options.algorithms = EC_KEY_ALGS;
            } else {
                options.algorithms = PUB_KEY_ALGS;
            }
        }
        if (options.algorithms.indexOf(decodedToken.header.alg) === -1) {
            return done(new JsonWebTokenError("invalid algorithm"));
        }
        if (header.alg.startsWith("HS") && secretOrPublicKey.type !== "secret") {
            return done(new JsonWebTokenError(`secretOrPublicKey must be a symmetric key when using ${header.alg}`));
        } else if (/^(?:RS|PS|ES)/.test(header.alg) && secretOrPublicKey.type !== "public") {
            return done(new JsonWebTokenError(`secretOrPublicKey must be an asymmetric key when using ${header.alg}`));
        }
        if (!options.allowInvalidAsymmetricKeyTypes) {
            try {
                validateAsymmetricKey(header.alg, secretOrPublicKey);
            } catch (e) {
                return done(e);
            }
        }
        let valid;
        try {
            valid = jws.verify(jwtString, decodedToken.header.alg, secretOrPublicKey);
        } catch (e) {
            return done(e);
        }
        if (!valid) {
            return done(new JsonWebTokenError("invalid signature"));
        }
        const payload = decodedToken.payload;
        if (typeof payload.nbf !== "undefined" && !options.ignoreNotBefore) {
            if (typeof payload.nbf !== "number") {
                return done(new JsonWebTokenError("invalid nbf value"));
            }
            if (payload.nbf > clockTimestamp + (options.clockTolerance || 0)) {
                return done(new NotBeforeError("jwt not active", new Date(payload.nbf * 1000)));
            }
        }
        if (typeof payload.exp !== "undefined" && !options.ignoreExpiration) {
            if (typeof payload.exp !== "number") {
                return done(new JsonWebTokenError("invalid exp value"));
            }
            if (clockTimestamp >= payload.exp + (options.clockTolerance || 0)) {
                return done(new TokenExpiredError("jwt expired", new Date(payload.exp * 1000)));
            }
        }
        if (options.audience) {
            const audiences = Array.isArray(options.audience) ? options.audience : [
                options.audience
            ];
            const target = Array.isArray(payload.aud) ? payload.aud : [
                payload.aud
            ];
            const match = target.some(function(targetAudience) {
                return audiences.some(function(audience) {
                    return audience instanceof RegExp ? audience.test(targetAudience) : audience === targetAudience;
                });
            });
            if (!match) {
                return done(new JsonWebTokenError("jwt audience invalid. expected: " + audiences.join(" or ")));
            }
        }
        if (options.issuer) {
            const invalid_issuer = typeof options.issuer === "string" && payload.iss !== options.issuer || Array.isArray(options.issuer) && options.issuer.indexOf(payload.iss) === -1;
            if (invalid_issuer) {
                return done(new JsonWebTokenError("jwt issuer invalid. expected: " + options.issuer));
            }
        }
        if (options.subject) {
            if (payload.sub !== options.subject) {
                return done(new JsonWebTokenError("jwt subject invalid. expected: " + options.subject));
            }
        }
        if (options.jwtid) {
            if (payload.jti !== options.jwtid) {
                return done(new JsonWebTokenError("jwt jwtid invalid. expected: " + options.jwtid));
            }
        }
        if (options.nonce) {
            if (payload.nonce !== options.nonce) {
                return done(new JsonWebTokenError("jwt nonce invalid. expected: " + options.nonce));
            }
        }
        if (options.maxAge) {
            if (typeof payload.iat !== "number") {
                return done(new JsonWebTokenError("iat required when maxAge is specified"));
            }
            const maxAgeTimestamp = timespan(options.maxAge, payload.iat);
            if (typeof maxAgeTimestamp === "undefined") {
                return done(new JsonWebTokenError('"maxAge" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'));
            }
            if (clockTimestamp >= maxAgeTimestamp + (options.clockTolerance || 0)) {
                return done(new TokenExpiredError("maxAge exceeded", new Date(maxAgeTimestamp * 1000)));
            }
        }
        if (options.complete === true) {
            const signature = decodedToken.signature;
            return done(null, {
                header: header,
                payload: payload,
                signature: signature
            });
        }
        return done(null, payload);
    });
};


/***/ }),

/***/ 81638:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var bufferEqual = __webpack_require__(71275);
var Buffer = (__webpack_require__(31371).Buffer);
var crypto = __webpack_require__(6113);
var formatEcdsa = __webpack_require__(17659);
var util = __webpack_require__(73837);
var MSG_INVALID_ALGORITHM = '"%s" is not a valid algorithm.\n  Supported algorithms are:\n  "HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "PS256", "PS384", "PS512", "ES256", "ES384", "ES512" and "none".';
var MSG_INVALID_SECRET = "secret must be a string or buffer";
var MSG_INVALID_VERIFIER_KEY = "key must be a string or a buffer";
var MSG_INVALID_SIGNER_KEY = "key must be a string, a buffer or an object";
var supportsKeyObjects = typeof crypto.createPublicKey === "function";
if (supportsKeyObjects) {
    MSG_INVALID_VERIFIER_KEY += " or a KeyObject";
    MSG_INVALID_SECRET += "or a KeyObject";
}
function checkIsPublicKey(key) {
    if (Buffer.isBuffer(key)) {
        return;
    }
    if (typeof key === "string") {
        return;
    }
    if (!supportsKeyObjects) {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
    }
    if (typeof key !== "object") {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
    }
    if (typeof key.type !== "string") {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
    }
    if (typeof key.asymmetricKeyType !== "string") {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
    }
    if (typeof key.export !== "function") {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
    }
}
;
function checkIsPrivateKey(key) {
    if (Buffer.isBuffer(key)) {
        return;
    }
    if (typeof key === "string") {
        return;
    }
    if (typeof key === "object") {
        return;
    }
    throw typeError(MSG_INVALID_SIGNER_KEY);
}
;
function checkIsSecretKey(key) {
    if (Buffer.isBuffer(key)) {
        return;
    }
    if (typeof key === "string") {
        return key;
    }
    if (!supportsKeyObjects) {
        throw typeError(MSG_INVALID_SECRET);
    }
    if (typeof key !== "object") {
        throw typeError(MSG_INVALID_SECRET);
    }
    if (key.type !== "secret") {
        throw typeError(MSG_INVALID_SECRET);
    }
    if (typeof key.export !== "function") {
        throw typeError(MSG_INVALID_SECRET);
    }
}
function fromBase64(base64) {
    return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function toBase64(base64url) {
    base64url = base64url.toString();
    var padding = 4 - base64url.length % 4;
    if (padding !== 4) {
        for(var i = 0; i < padding; ++i){
            base64url += "=";
        }
    }
    return base64url.replace(/\-/g, "+").replace(/_/g, "/");
}
function typeError(template) {
    var args = [].slice.call(arguments, 1);
    var errMsg = util.format.bind(util, template).apply(null, args);
    return new TypeError(errMsg);
}
function bufferOrString(obj) {
    return Buffer.isBuffer(obj) || typeof obj === "string";
}
function normalizeInput(thing) {
    if (!bufferOrString(thing)) thing = JSON.stringify(thing);
    return thing;
}
function createHmacSigner(bits) {
    return function sign(thing, secret) {
        checkIsSecretKey(secret);
        thing = normalizeInput(thing);
        var hmac = crypto.createHmac("sha" + bits, secret);
        var sig = (hmac.update(thing), hmac.digest("base64"));
        return fromBase64(sig);
    };
}
function createHmacVerifier(bits) {
    return function verify(thing, signature, secret) {
        var computedSig = createHmacSigner(bits)(thing, secret);
        return bufferEqual(Buffer.from(signature), Buffer.from(computedSig));
    };
}
function createKeySigner(bits) {
    return function sign(thing, privateKey) {
        checkIsPrivateKey(privateKey);
        thing = normalizeInput(thing);
        // Even though we are specifying "RSA" here, this works with ECDSA
        // keys as well.
        var signer = crypto.createSign("RSA-SHA" + bits);
        var sig = (signer.update(thing), signer.sign(privateKey, "base64"));
        return fromBase64(sig);
    };
}
function createKeyVerifier(bits) {
    return function verify(thing, signature, publicKey) {
        checkIsPublicKey(publicKey);
        thing = normalizeInput(thing);
        signature = toBase64(signature);
        var verifier = crypto.createVerify("RSA-SHA" + bits);
        verifier.update(thing);
        return verifier.verify(publicKey, signature, "base64");
    };
}
function createPSSKeySigner(bits) {
    return function sign(thing, privateKey) {
        checkIsPrivateKey(privateKey);
        thing = normalizeInput(thing);
        var signer = crypto.createSign("RSA-SHA" + bits);
        var sig = (signer.update(thing), signer.sign({
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
            saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST
        }, "base64"));
        return fromBase64(sig);
    };
}
function createPSSKeyVerifier(bits) {
    return function verify(thing, signature, publicKey) {
        checkIsPublicKey(publicKey);
        thing = normalizeInput(thing);
        signature = toBase64(signature);
        var verifier = crypto.createVerify("RSA-SHA" + bits);
        verifier.update(thing);
        return verifier.verify({
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
            saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST
        }, signature, "base64");
    };
}
function createECDSASigner(bits) {
    var inner = createKeySigner(bits);
    return function sign() {
        var signature = inner.apply(null, arguments);
        signature = formatEcdsa.derToJose(signature, "ES" + bits);
        return signature;
    };
}
function createECDSAVerifer(bits) {
    var inner = createKeyVerifier(bits);
    return function verify(thing, signature, publicKey) {
        signature = formatEcdsa.joseToDer(signature, "ES" + bits).toString("base64");
        var result = inner(thing, signature, publicKey);
        return result;
    };
}
function createNoneSigner() {
    return function sign() {
        return "";
    };
}
function createNoneVerifier() {
    return function verify(thing, signature) {
        return signature === "";
    };
}
module.exports = function jwa(algorithm) {
    var signerFactories = {
        hs: createHmacSigner,
        rs: createKeySigner,
        ps: createPSSKeySigner,
        es: createECDSASigner,
        none: createNoneSigner
    };
    var verifierFactories = {
        hs: createHmacVerifier,
        rs: createKeyVerifier,
        ps: createPSSKeyVerifier,
        es: createECDSAVerifer,
        none: createNoneVerifier
    };
    var match = algorithm.match(/^(RS|PS|ES|HS)(256|384|512)$|^(none)$/i);
    if (!match) throw typeError(MSG_INVALID_ALGORITHM, algorithm);
    var algo = (match[1] || match[3]).toLowerCase();
    var bits = match[2];
    return {
        sign: signerFactories[algo](bits),
        verify: verifierFactories[algo](bits)
    };
};


/***/ }),

/***/ 37687:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/*global exports*/ var SignStream = __webpack_require__(82554);
var VerifyStream = __webpack_require__(81858);
var ALGORITHMS = [
    "HS256",
    "HS384",
    "HS512",
    "RS256",
    "RS384",
    "RS512",
    "PS256",
    "PS384",
    "PS512",
    "ES256",
    "ES384",
    "ES512"
];
exports.ALGORITHMS = ALGORITHMS;
exports.sign = SignStream.sign;
exports.verify = VerifyStream.verify;
exports.decode = VerifyStream.decode;
exports.isValid = VerifyStream.isValid;
exports.createSign = function createSign(opts) {
    return new SignStream(opts);
};
exports.createVerify = function createVerify(opts) {
    return new VerifyStream(opts);
};


/***/ }),

/***/ 99332:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*global module, process*/ 
var Buffer = (__webpack_require__(31371).Buffer);
var Stream = __webpack_require__(12781);
var util = __webpack_require__(73837);
function DataStream(data) {
    this.buffer = null;
    this.writable = true;
    this.readable = true;
    // No input
    if (!data) {
        this.buffer = Buffer.alloc(0);
        return this;
    }
    // Stream
    if (typeof data.pipe === "function") {
        this.buffer = Buffer.alloc(0);
        data.pipe(this);
        return this;
    }
    // Buffer or String
    // or Object (assumedly a passworded key)
    if (data.length || typeof data === "object") {
        this.buffer = data;
        this.writable = false;
        process.nextTick((function() {
            this.emit("end", data);
            this.readable = false;
            this.emit("close");
        }).bind(this));
        return this;
    }
    throw new TypeError("Unexpected data type (" + typeof data + ")");
}
util.inherits(DataStream, Stream);
DataStream.prototype.write = function write(data) {
    this.buffer = Buffer.concat([
        this.buffer,
        Buffer.from(data)
    ]);
    this.emit("data", data);
};
DataStream.prototype.end = function end(data) {
    if (data) this.write(data);
    this.emit("end", data);
    this.emit("close");
    this.writable = false;
    this.readable = false;
};
module.exports = DataStream;


/***/ }),

/***/ 82554:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*global module*/ 
var Buffer = (__webpack_require__(31371).Buffer);
var DataStream = __webpack_require__(99332);
var jwa = __webpack_require__(81638);
var Stream = __webpack_require__(12781);
var toString = __webpack_require__(32076);
var util = __webpack_require__(73837);
function base64url(string, encoding) {
    return Buffer.from(string, encoding).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function jwsSecuredInput(header, payload, encoding) {
    encoding = encoding || "utf8";
    var encodedHeader = base64url(toString(header), "binary");
    var encodedPayload = base64url(toString(payload), encoding);
    return util.format("%s.%s", encodedHeader, encodedPayload);
}
function jwsSign(opts) {
    var header = opts.header;
    var payload = opts.payload;
    var secretOrKey = opts.secret || opts.privateKey;
    var encoding = opts.encoding;
    var algo = jwa(header.alg);
    var securedInput = jwsSecuredInput(header, payload, encoding);
    var signature = algo.sign(securedInput, secretOrKey);
    return util.format("%s.%s", securedInput, signature);
}
function SignStream(opts) {
    var secret = opts.secret || opts.privateKey || opts.key;
    var secretStream = new DataStream(secret);
    this.readable = true;
    this.header = opts.header;
    this.encoding = opts.encoding;
    this.secret = this.privateKey = this.key = secretStream;
    this.payload = new DataStream(opts.payload);
    this.secret.once("close", (function() {
        if (!this.payload.writable && this.readable) this.sign();
    }).bind(this));
    this.payload.once("close", (function() {
        if (!this.secret.writable && this.readable) this.sign();
    }).bind(this));
}
util.inherits(SignStream, Stream);
SignStream.prototype.sign = function sign() {
    try {
        var signature = jwsSign({
            header: this.header,
            payload: this.payload.buffer,
            secret: this.secret.buffer,
            encoding: this.encoding
        });
        this.emit("done", signature);
        this.emit("data", signature);
        this.emit("end");
        this.readable = false;
        return signature;
    } catch (e) {
        this.readable = false;
        this.emit("error", e);
        this.emit("close");
    }
};
SignStream.sign = jwsSign;
module.exports = SignStream;


/***/ }),

/***/ 32076:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*global module*/ 
var Buffer = (__webpack_require__(14300).Buffer);
module.exports = function toString(obj) {
    if (typeof obj === "string") return obj;
    if (typeof obj === "number" || Buffer.isBuffer(obj)) return obj.toString();
    return JSON.stringify(obj);
};


/***/ }),

/***/ 81858:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*global module*/ 
var Buffer = (__webpack_require__(31371).Buffer);
var DataStream = __webpack_require__(99332);
var jwa = __webpack_require__(81638);
var Stream = __webpack_require__(12781);
var toString = __webpack_require__(32076);
var util = __webpack_require__(73837);
var JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;
function isObject(thing) {
    return Object.prototype.toString.call(thing) === "[object Object]";
}
function safeJsonParse(thing) {
    if (isObject(thing)) return thing;
    try {
        return JSON.parse(thing);
    } catch (e) {
        return undefined;
    }
}
function headerFromJWS(jwsSig) {
    var encodedHeader = jwsSig.split(".", 1)[0];
    return safeJsonParse(Buffer.from(encodedHeader, "base64").toString("binary"));
}
function securedInputFromJWS(jwsSig) {
    return jwsSig.split(".", 2).join(".");
}
function signatureFromJWS(jwsSig) {
    return jwsSig.split(".")[2];
}
function payloadFromJWS(jwsSig, encoding) {
    encoding = encoding || "utf8";
    var payload = jwsSig.split(".")[1];
    return Buffer.from(payload, "base64").toString(encoding);
}
function isValidJws(string) {
    return JWS_REGEX.test(string) && !!headerFromJWS(string);
}
function jwsVerify(jwsSig, algorithm, secretOrKey) {
    if (!algorithm) {
        var err = new Error("Missing algorithm parameter for jws.verify");
        err.code = "MISSING_ALGORITHM";
        throw err;
    }
    jwsSig = toString(jwsSig);
    var signature = signatureFromJWS(jwsSig);
    var securedInput = securedInputFromJWS(jwsSig);
    var algo = jwa(algorithm);
    return algo.verify(securedInput, signature, secretOrKey);
}
function jwsDecode(jwsSig, opts) {
    opts = opts || {};
    jwsSig = toString(jwsSig);
    if (!isValidJws(jwsSig)) return null;
    var header = headerFromJWS(jwsSig);
    if (!header) return null;
    var payload = payloadFromJWS(jwsSig);
    if (header.typ === "JWT" || opts.json) payload = JSON.parse(payload, opts.encoding);
    return {
        header: header,
        payload: payload,
        signature: signatureFromJWS(jwsSig)
    };
}
function VerifyStream(opts) {
    opts = opts || {};
    var secretOrKey = opts.secret || opts.publicKey || opts.key;
    var secretStream = new DataStream(secretOrKey);
    this.readable = true;
    this.algorithm = opts.algorithm;
    this.encoding = opts.encoding;
    this.secret = this.publicKey = this.key = secretStream;
    this.signature = new DataStream(opts.signature);
    this.secret.once("close", (function() {
        if (!this.signature.writable && this.readable) this.verify();
    }).bind(this));
    this.signature.once("close", (function() {
        if (!this.secret.writable && this.readable) this.verify();
    }).bind(this));
}
util.inherits(VerifyStream, Stream);
VerifyStream.prototype.verify = function verify() {
    try {
        var valid = jwsVerify(this.signature.buffer, this.algorithm, this.key.buffer);
        var obj = jwsDecode(this.signature.buffer, this.encoding);
        this.emit("done", valid, obj);
        this.emit("data", valid);
        this.emit("end");
        this.readable = false;
        return valid;
    } catch (e) {
        this.readable = false;
        this.emit("error", e);
        this.emit("close");
    }
};
VerifyStream.decode = jwsDecode;
VerifyStream.isValid = isValidJws;
VerifyStream.verify = jwsVerify;
module.exports = VerifyStream;


/***/ }),

/***/ 75141:
/***/ ((module) => {

"use strict";
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */ /** Used as references for various `Number` constants. */ 
var INFINITY = 1 / 0, MAX_SAFE_INTEGER = 9007199254740991, MAX_INTEGER = 1.7976931348623157e+308, NAN = 0 / 0;
/** `Object#toString` result references. */ var argsTag = "[object Arguments]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", stringTag = "[object String]", symbolTag = "[object Symbol]";
/** Used to match leading and trailing whitespace. */ var reTrim = /^\s+|\s+$/g;
/** Used to detect bad signed hexadecimal string values. */ var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
/** Used to detect binary string values. */ var reIsBinary = /^0b[01]+$/i;
/** Used to detect octal string values. */ var reIsOctal = /^0o[0-7]+$/i;
/** Used to detect unsigned integer values. */ var reIsUint = /^(?:0|[1-9]\d*)$/;
/** Built-in method references without a dependency on `root`. */ var freeParseInt = parseInt;
/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */ function arrayMap(array, iteratee) {
    var index = -1, length = array ? array.length : 0, result = Array(length);
    while(++index < length){
        result[index] = iteratee(array[index], index, array);
    }
    return result;
}
/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */ function baseFindIndex(array, predicate, fromIndex, fromRight) {
    var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
    while(fromRight ? index-- : ++index < length){
        if (predicate(array[index], index, array)) {
            return index;
        }
    }
    return -1;
}
/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */ function baseIndexOf(array, value, fromIndex) {
    if (value !== value) {
        return baseFindIndex(array, baseIsNaN, fromIndex);
    }
    var index = fromIndex - 1, length = array.length;
    while(++index < length){
        if (array[index] === value) {
            return index;
        }
    }
    return -1;
}
/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */ function baseIsNaN(value) {
    return value !== value;
}
/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */ function baseTimes(n, iteratee) {
    var index = -1, result = Array(n);
    while(++index < n){
        result[index] = iteratee(index);
    }
    return result;
}
/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */ function baseValues(object, props) {
    return arrayMap(props, function(key) {
        return object[key];
    });
}
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */ function overArg(func, transform) {
    return function(arg) {
        return func(transform(arg));
    };
}
/** Used for built-in method references. */ var objectProto = Object.prototype;
/** Used to check objects for own properties. */ var hasOwnProperty = objectProto.hasOwnProperty;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */ var objectToString = objectProto.toString;
/** Built-in value references. */ var propertyIsEnumerable = objectProto.propertyIsEnumerable;
/* Built-in method references for those with the same name as other `lodash` methods. */ var nativeKeys = overArg(Object.keys, Object), nativeMax = Math.max;
/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */ function arrayLikeKeys(value, inherited) {
    // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
    // Safari 9 makes `arguments.length` enumerable in strict mode.
    var result = isArray(value) || isArguments(value) ? baseTimes(value.length, String) : [];
    var length = result.length, skipIndexes = !!length;
    for(var key in value){
        if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == "length" || isIndex(key, length)))) {
            result.push(key);
        }
    }
    return result;
}
/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */ function baseKeys(object) {
    if (!isPrototype(object)) {
        return nativeKeys(object);
    }
    var result = [];
    for(var key in Object(object)){
        if (hasOwnProperty.call(object, key) && key != "constructor") {
            result.push(key);
        }
    }
    return result;
}
/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */ function isIndex(value, length) {
    length = length == null ? MAX_SAFE_INTEGER : length;
    return !!length && (typeof value == "number" || reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}
/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */ function isPrototype(value) {
    var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
    return value === proto;
}
/**
 * Checks if `value` is in `collection`. If `collection` is a string, it's
 * checked for a substring of `value`, otherwise
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * is used for equality comparisons. If `fromIndex` is negative, it's used as
 * the offset from the end of `collection`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object|string} collection The collection to inspect.
 * @param {*} value The value to search for.
 * @param {number} [fromIndex=0] The index to search from.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
 * @returns {boolean} Returns `true` if `value` is found, else `false`.
 * @example
 *
 * _.includes([1, 2, 3], 1);
 * // => true
 *
 * _.includes([1, 2, 3], 1, 2);
 * // => false
 *
 * _.includes({ 'a': 1, 'b': 2 }, 1);
 * // => true
 *
 * _.includes('abcd', 'bc');
 * // => true
 */ function includes(collection, value, fromIndex, guard) {
    collection = isArrayLike(collection) ? collection : values(collection);
    fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
    var length = collection.length;
    if (fromIndex < 0) {
        fromIndex = nativeMax(length + fromIndex, 0);
    }
    return isString(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf(collection, value, fromIndex) > -1;
}
/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */ function isArguments(value) {
    // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
    return isArrayLikeObject(value) && hasOwnProperty.call(value, "callee") && (!propertyIsEnumerable.call(value, "callee") || objectToString.call(value) == argsTag);
}
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */ var isArray = Array.isArray;
/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */ function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
}
/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */ function isArrayLikeObject(value) {
    return isObjectLike(value) && isArrayLike(value);
}
/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */ function isFunction(value) {
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 8-9 which returns 'object' for typed array and other constructors.
    var tag = isObject(value) ? objectToString.call(value) : "";
    return tag == funcTag || tag == genTag;
}
/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */ function isLength(value) {
    return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */ function isObject(value) {
    var type = typeof value;
    return !!value && (type == "object" || type == "function");
}
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */ function isObjectLike(value) {
    return !!value && typeof value == "object";
}
/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */ function isString(value) {
    return typeof value == "string" || !isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag;
}
/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */ function isSymbol(value) {
    return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
}
/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */ function toFinite(value) {
    if (!value) {
        return value === 0 ? value : 0;
    }
    value = toNumber(value);
    if (value === INFINITY || value === -INFINITY) {
        var sign = value < 0 ? -1 : 1;
        return sign * MAX_INTEGER;
    }
    return value === value ? value : 0;
}
/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */ function toInteger(value) {
    var result = toFinite(value), remainder = result % 1;
    return result === result ? remainder ? result - remainder : result : 0;
}
/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */ function toNumber(value) {
    if (typeof value == "number") {
        return value;
    }
    if (isSymbol(value)) {
        return NAN;
    }
    if (isObject(value)) {
        var other = typeof value.valueOf == "function" ? value.valueOf() : value;
        value = isObject(other) ? other + "" : other;
    }
    if (typeof value != "string") {
        return value === 0 ? value : +value;
    }
    value = value.replace(reTrim, "");
    var isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */ function keys(object) {
    return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}
/**
 * Creates an array of the own enumerable string keyed property values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property values.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.values(new Foo);
 * // => [1, 2] (iteration order is not guaranteed)
 *
 * _.values('hi');
 * // => ['h', 'i']
 */ function values(object) {
    return object ? baseValues(object, keys(object)) : [];
}
module.exports = includes;


/***/ }),

/***/ 36471:
/***/ ((module) => {

"use strict";
/**
 * lodash 3.0.3 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */ /** `Object#toString` result references. */ 
var boolTag = "[object Boolean]";
/** Used for built-in method references. */ var objectProto = Object.prototype;
/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */ var objectToString = objectProto.toString;
/**
 * Checks if `value` is classified as a boolean primitive or object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isBoolean(false);
 * // => true
 *
 * _.isBoolean(null);
 * // => false
 */ function isBoolean(value) {
    return value === true || value === false || isObjectLike(value) && objectToString.call(value) == boolTag;
}
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */ function isObjectLike(value) {
    return !!value && typeof value == "object";
}
module.exports = isBoolean;


/***/ }),

/***/ 56652:
/***/ ((module) => {

"use strict";
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */ /** Used as references for various `Number` constants. */ 
var INFINITY = 1 / 0, MAX_INTEGER = 1.7976931348623157e+308, NAN = 0 / 0;
/** `Object#toString` result references. */ var symbolTag = "[object Symbol]";
/** Used to match leading and trailing whitespace. */ var reTrim = /^\s+|\s+$/g;
/** Used to detect bad signed hexadecimal string values. */ var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
/** Used to detect binary string values. */ var reIsBinary = /^0b[01]+$/i;
/** Used to detect octal string values. */ var reIsOctal = /^0o[0-7]+$/i;
/** Built-in method references without a dependency on `root`. */ var freeParseInt = parseInt;
/** Used for built-in method references. */ var objectProto = Object.prototype;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */ var objectToString = objectProto.toString;
/**
 * Checks if `value` is an integer.
 *
 * **Note:** This method is based on
 * [`Number.isInteger`](https://mdn.io/Number/isInteger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an integer, else `false`.
 * @example
 *
 * _.isInteger(3);
 * // => true
 *
 * _.isInteger(Number.MIN_VALUE);
 * // => false
 *
 * _.isInteger(Infinity);
 * // => false
 *
 * _.isInteger('3');
 * // => false
 */ function isInteger(value) {
    return typeof value == "number" && value == toInteger(value);
}
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */ function isObject(value) {
    var type = typeof value;
    return !!value && (type == "object" || type == "function");
}
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */ function isObjectLike(value) {
    return !!value && typeof value == "object";
}
/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */ function isSymbol(value) {
    return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
}
/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */ function toFinite(value) {
    if (!value) {
        return value === 0 ? value : 0;
    }
    value = toNumber(value);
    if (value === INFINITY || value === -INFINITY) {
        var sign = value < 0 ? -1 : 1;
        return sign * MAX_INTEGER;
    }
    return value === value ? value : 0;
}
/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */ function toInteger(value) {
    var result = toFinite(value), remainder = result % 1;
    return result === result ? remainder ? result - remainder : result : 0;
}
/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */ function toNumber(value) {
    if (typeof value == "number") {
        return value;
    }
    if (isSymbol(value)) {
        return NAN;
    }
    if (isObject(value)) {
        var other = typeof value.valueOf == "function" ? value.valueOf() : value;
        value = isObject(other) ? other + "" : other;
    }
    if (typeof value != "string") {
        return value === 0 ? value : +value;
    }
    value = value.replace(reTrim, "");
    var isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
module.exports = isInteger;


/***/ }),

/***/ 60379:
/***/ ((module) => {

"use strict";
/**
 * lodash 3.0.3 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */ /** `Object#toString` result references. */ 
var numberTag = "[object Number]";
/** Used for built-in method references. */ var objectProto = Object.prototype;
/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */ var objectToString = objectProto.toString;
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */ function isObjectLike(value) {
    return !!value && typeof value == "object";
}
/**
 * Checks if `value` is classified as a `Number` primitive or object.
 *
 * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are classified
 * as numbers, use the `_.isFinite` method.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isNumber(3);
 * // => true
 *
 * _.isNumber(Number.MIN_VALUE);
 * // => true
 *
 * _.isNumber(Infinity);
 * // => true
 *
 * _.isNumber('3');
 * // => false
 */ function isNumber(value) {
    return typeof value == "number" || isObjectLike(value) && objectToString.call(value) == numberTag;
}
module.exports = isNumber;


/***/ }),

/***/ 56111:
/***/ ((module) => {

"use strict";
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */ /** `Object#toString` result references. */ 
var objectTag = "[object Object]";
/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */ function isHostObject(value) {
    // Many host objects are `Object` objects that can coerce to strings
    // despite having improperly defined `toString` methods.
    var result = false;
    if (value != null && typeof value.toString != "function") {
        try {
            result = !!(value + "");
        } catch (e) {}
    }
    return result;
}
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */ function overArg(func, transform) {
    return function(arg) {
        return func(transform(arg));
    };
}
/** Used for built-in method references. */ var funcProto = Function.prototype, objectProto = Object.prototype;
/** Used to resolve the decompiled source of functions. */ var funcToString = funcProto.toString;
/** Used to check objects for own properties. */ var hasOwnProperty = objectProto.hasOwnProperty;
/** Used to infer the `Object` constructor. */ var objectCtorString = funcToString.call(Object);
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */ var objectToString = objectProto.toString;
/** Built-in value references. */ var getPrototype = overArg(Object.getPrototypeOf, Object);
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */ function isObjectLike(value) {
    return !!value && typeof value == "object";
}
/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */ function isPlainObject(value) {
    if (!isObjectLike(value) || objectToString.call(value) != objectTag || isHostObject(value)) {
        return false;
    }
    var proto = getPrototype(value);
    if (proto === null) {
        return true;
    }
    var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
    return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
}
module.exports = isPlainObject;


/***/ }),

/***/ 39458:
/***/ ((module) => {

"use strict";
/**
 * lodash 4.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */ /** `Object#toString` result references. */ 
var stringTag = "[object String]";
/** Used for built-in method references. */ var objectProto = Object.prototype;
/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */ var objectToString = objectProto.toString;
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */ var isArray = Array.isArray;
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */ function isObjectLike(value) {
    return !!value && typeof value == "object";
}
/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */ function isString(value) {
    return typeof value == "string" || !isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag;
}
module.exports = isString;


/***/ }),

/***/ 81320:
/***/ ((module) => {

"use strict";
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */ /** Used as the `TypeError` message for "Functions" methods. */ 
var FUNC_ERROR_TEXT = "Expected a function";
/** Used as references for various `Number` constants. */ var INFINITY = 1 / 0, MAX_INTEGER = 1.7976931348623157e+308, NAN = 0 / 0;
/** `Object#toString` result references. */ var symbolTag = "[object Symbol]";
/** Used to match leading and trailing whitespace. */ var reTrim = /^\s+|\s+$/g;
/** Used to detect bad signed hexadecimal string values. */ var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
/** Used to detect binary string values. */ var reIsBinary = /^0b[01]+$/i;
/** Used to detect octal string values. */ var reIsOctal = /^0o[0-7]+$/i;
/** Built-in method references without a dependency on `root`. */ var freeParseInt = parseInt;
/** Used for built-in method references. */ var objectProto = Object.prototype;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */ var objectToString = objectProto.toString;
/**
 * Creates a function that invokes `func`, with the `this` binding and arguments
 * of the created function, while it's called less than `n` times. Subsequent
 * calls to the created function return the result of the last `func` invocation.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Function
 * @param {number} n The number of calls at which `func` is no longer invoked.
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @example
 *
 * jQuery(element).on('click', _.before(5, addContactToList));
 * // => Allows adding up to 4 contacts to the list.
 */ function before(n, func) {
    var result;
    if (typeof func != "function") {
        throw new TypeError(FUNC_ERROR_TEXT);
    }
    n = toInteger(n);
    return function() {
        if (--n > 0) {
            result = func.apply(this, arguments);
        }
        if (n <= 1) {
            func = undefined;
        }
        return result;
    };
}
/**
 * Creates a function that is restricted to invoking `func` once. Repeat calls
 * to the function return the value of the first invocation. The `func` is
 * invoked with the `this` binding and arguments of the created function.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @example
 *
 * var initialize = _.once(createApplication);
 * initialize();
 * initialize();
 * // => `createApplication` is invoked once
 */ function once(func) {
    return before(2, func);
}
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */ function isObject(value) {
    var type = typeof value;
    return !!value && (type == "object" || type == "function");
}
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */ function isObjectLike(value) {
    return !!value && typeof value == "object";
}
/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */ function isSymbol(value) {
    return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
}
/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */ function toFinite(value) {
    if (!value) {
        return value === 0 ? value : 0;
    }
    value = toNumber(value);
    if (value === INFINITY || value === -INFINITY) {
        var sign = value < 0 ? -1 : 1;
        return sign * MAX_INTEGER;
    }
    return value === value ? value : 0;
}
/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */ function toInteger(value) {
    var result = toFinite(value), remainder = result % 1;
    return result === result ? remainder ? result - remainder : result : 0;
}
/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */ function toNumber(value) {
    if (typeof value == "number") {
        return value;
    }
    if (isSymbol(value)) {
        return NAN;
    }
    if (isObject(value)) {
        var other = typeof value.valueOf == "function" ? value.valueOf() : value;
        value = isObject(other) ? other + "" : other;
    }
    if (typeof value != "string") {
        return value === 0 ? value : +value;
    }
    value = value.replace(reTrim, "");
    var isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
module.exports = once;


/***/ }),

/***/ 87569:
/***/ ((module) => {

"use strict";
/**
 * Helpers.
 */ 
var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;
/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */ module.exports = function(val, options) {
    options = options || {};
    var type = typeof val;
    if (type === "string" && val.length > 0) {
        return parse(val);
    } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
    }
    throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(val));
};
/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */ function parse(str) {
    str = String(str);
    if (str.length > 100) {
        return;
    }
    var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
    if (!match) {
        return;
    }
    var n = parseFloat(match[1]);
    var type = (match[2] || "ms").toLowerCase();
    switch(type){
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
            return n * y;
        case "weeks":
        case "week":
        case "w":
            return n * w;
        case "days":
        case "day":
        case "d":
            return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
            return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
            return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
            return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
            return n;
        default:
            return undefined;
    }
}
/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */ function fmtShort(ms) {
    var msAbs = Math.abs(ms);
    if (msAbs >= d) {
        return Math.round(ms / d) + "d";
    }
    if (msAbs >= h) {
        return Math.round(ms / h) + "h";
    }
    if (msAbs >= m) {
        return Math.round(ms / m) + "m";
    }
    if (msAbs >= s) {
        return Math.round(ms / s) + "s";
    }
    return ms + "ms";
}
/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */ function fmtLong(ms) {
    var msAbs = Math.abs(ms);
    if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
    }
    if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
    }
    if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
    }
    if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
    }
    return ms + " ms";
}
/**
 * Pluralization helper.
 */ function plural(ms, msAbs, n, name) {
    var isPlural = msAbs >= n * 1.5;
    return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
}


/***/ }),

/***/ 60971:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({
    value: true
});
Object.defineProperty(exports, "Z", ({
    enumerable: true,
    get: function() {
        return createActionProxy;
    }
}));
function createActionProxy(id, bound, action, originalAction) {
    function bindImpl(_, ...boundArgs) {
        const currentAction = this;
        const newAction = async function(...args) {
            if (originalAction) {
                return originalAction(newAction.$$bound.concat(args));
            } else {
                // In this case we're calling the user-defined action directly.
                return currentAction(...newAction.$$bound, ...args);
            }
        };
        for (const key of [
            "$$typeof",
            "$$id",
            "$$FORM_ACTION"
        ]){
            // @ts-ignore
            newAction[key] = currentAction[key];
        }
        // Rebind args
        newAction.$$bound = (currentAction.$$bound || []).concat(boundArgs);
        // Assign bind method
        newAction.bind = bindImpl.bind(newAction);
        return newAction;
    }
    action.$$typeof = Symbol.for("react.server.reference");
    action.$$id = id;
    action.$$bound = bound;
    action.bind = bindImpl.bind(action);
} //# sourceMappingURL=action-proxy.js.map


/***/ }),

/***/ 6256:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({
    value: true
});
Object.defineProperty(exports, "Z", ({
    enumerable: true,
    get: function() {
        return ensureServerEntryExports;
    }
}));
function ensureServerEntryExports(actions) {
    for(let i = 0; i < actions.length; i++){
        const action = actions[i];
        if (typeof action !== "function") {
            throw new Error(`A "use server" file can only export async functions, found ${typeof action}.`);
        }
    }
} //# sourceMappingURL=action-validate.js.map


/***/ }),

/***/ 15704:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all)=>{
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = (to, from, except, desc)=>{
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
            get: ()=>from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
    return to;
};
var __toCommonJS = (mod)=>__copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
// pkg/dist-src/index.js
var dist_src_exports = {};
__export(dist_src_exports, {
    App: ()=>App,
    OAuthApp: ()=>OAuthApp,
    Octokit: ()=>Octokit,
    RequestError: ()=>import_request_error.RequestError,
    createNodeMiddleware: ()=>import_app2.createNodeMiddleware
});
module.exports = __toCommonJS(dist_src_exports);
// pkg/dist-src/octokit.js
var import_core = __webpack_require__(4032);
var import_plugin_paginate_rest = __webpack_require__(77671);
var import_plugin_paginate_graphql = __webpack_require__(51499);
var import_plugin_rest_endpoint_methods = __webpack_require__(26312);
var import_plugin_retry = __webpack_require__(89227);
var import_plugin_throttling = __webpack_require__(75874);
// pkg/dist-src/version.js
var VERSION = "3.2.1";
// pkg/dist-src/octokit.js
var import_request_error = __webpack_require__(32806);
var Octokit = import_core.Octokit.plugin(import_plugin_rest_endpoint_methods.restEndpointMethods, import_plugin_paginate_rest.paginateRest, import_plugin_paginate_graphql.paginateGraphql, import_plugin_retry.retry, import_plugin_throttling.throttling).defaults({
    userAgent: `octokit.js/${VERSION}`,
    throttle: {
        onRateLimit,
        onSecondaryRateLimit
    }
});
function onRateLimit(retryAfter, options, octokit) {
    octokit.log.warn(`Request quota exhausted for request ${options.method} ${options.url}`);
    if (options.request.retryCount === 0) {
        octokit.log.info(`Retrying after ${retryAfter} seconds!`);
        return true;
    }
}
function onSecondaryRateLimit(retryAfter, options, octokit) {
    octokit.log.warn(`SecondaryRateLimit detected for request ${options.method} ${options.url}`);
    if (options.request.retryCount === 0) {
        octokit.log.info(`Retrying after ${retryAfter} seconds!`);
        return true;
    }
}
// pkg/dist-src/app.js
var import_app = __webpack_require__(18058);
var import_oauth_app = __webpack_require__(55480);
var import_app2 = __webpack_require__(18058);
var App = import_app.App.defaults({
    Octokit
});
var OAuthApp = import_oauth_app.OAuthApp.defaults({
    Octokit
});
// Annotate the CommonJS export names for ESM import in node:
0 && (0);


/***/ }),

/***/ 68922:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var wrappy = __webpack_require__(37412);
module.exports = wrappy(once);
module.exports.strict = wrappy(onceStrict);
once.proto = once(function() {
    Object.defineProperty(Function.prototype, "once", {
        value: function() {
            return once(this);
        },
        configurable: true
    });
    Object.defineProperty(Function.prototype, "onceStrict", {
        value: function() {
            return onceStrict(this);
        },
        configurable: true
    });
});
function once(fn) {
    var f = function() {
        if (f.called) return f.value;
        f.called = true;
        return f.value = fn.apply(this, arguments);
    };
    f.called = false;
    return f;
}
function onceStrict(fn) {
    var f = function() {
        if (f.called) throw new Error(f.onceError);
        f.called = true;
        return f.value = fn.apply(this, arguments);
    };
    var name = fn.name || "Function wrapped with `once`";
    f.onceError = name + " shouldn't be called more than once";
    f.called = false;
    return f;
}


/***/ }),

/***/ 31371:
/***/ ((module, exports, __webpack_require__) => {

"use strict";
/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */ /* eslint-disable node/no-deprecated-api */ 
var buffer = __webpack_require__(14300);
var Buffer = buffer.Buffer;
// alternative to using Object.keys for old browsers
function copyProps(src, dst) {
    for(var key in src){
        dst[key] = src[key];
    }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
    module.exports = buffer;
} else {
    // Copy properties from require('buffer')
    copyProps(buffer, exports);
    exports.Buffer = SafeBuffer;
}
function SafeBuffer(arg, encodingOrOffset, length) {
    return Buffer(arg, encodingOrOffset, length);
}
SafeBuffer.prototype = Object.create(Buffer.prototype);
// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer);
SafeBuffer.from = function(arg, encodingOrOffset, length) {
    if (typeof arg === "number") {
        throw new TypeError("Argument must not be a number");
    }
    return Buffer(arg, encodingOrOffset, length);
};
SafeBuffer.alloc = function(size, fill, encoding) {
    if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
    }
    var buf = Buffer(size);
    if (fill !== undefined) {
        if (typeof encoding === "string") {
            buf.fill(fill, encoding);
        } else {
            buf.fill(fill);
        }
    } else {
        buf.fill(0);
    }
    return buf;
};
SafeBuffer.allocUnsafe = function(size) {
    if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
    }
    return Buffer(size);
};
SafeBuffer.allocUnsafeSlow = function(size) {
    if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
    }
    return buffer.SlowBuffer(size);
};


/***/ }),

/***/ 67953:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const ANY = Symbol("SemVer ANY");
// hoisted class for cyclic dependency
class Comparator {
    static get ANY() {
        return ANY;
    }
    constructor(comp, options){
        options = parseOptions(options);
        if (comp instanceof Comparator) {
            if (comp.loose === !!options.loose) {
                return comp;
            } else {
                comp = comp.value;
            }
        }
        comp = comp.trim().split(/\s+/).join(" ");
        debug("comparator", comp, options);
        this.options = options;
        this.loose = !!options.loose;
        this.parse(comp);
        if (this.semver === ANY) {
            this.value = "";
        } else {
            this.value = this.operator + this.semver.version;
        }
        debug("comp", this);
    }
    parse(comp) {
        const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
        const m = comp.match(r);
        if (!m) {
            throw new TypeError(`Invalid comparator: ${comp}`);
        }
        this.operator = m[1] !== undefined ? m[1] : "";
        if (this.operator === "=") {
            this.operator = "";
        }
        // if it literally is just '>' or '' then allow anything.
        if (!m[2]) {
            this.semver = ANY;
        } else {
            this.semver = new SemVer(m[2], this.options.loose);
        }
    }
    toString() {
        return this.value;
    }
    test(version) {
        debug("Comparator.test", version, this.options.loose);
        if (this.semver === ANY || version === ANY) {
            return true;
        }
        if (typeof version === "string") {
            try {
                version = new SemVer(version, this.options);
            } catch (er) {
                return false;
            }
        }
        return cmp(version, this.operator, this.semver, this.options);
    }
    intersects(comp, options) {
        if (!(comp instanceof Comparator)) {
            throw new TypeError("a Comparator is required");
        }
        if (this.operator === "") {
            if (this.value === "") {
                return true;
            }
            return new Range(comp.value, options).test(this.value);
        } else if (comp.operator === "") {
            if (comp.value === "") {
                return true;
            }
            return new Range(this.value, options).test(comp.semver);
        }
        options = parseOptions(options);
        // Special cases where nothing can possibly be lower
        if (options.includePrerelease && (this.value === "<0.0.0-0" || comp.value === "<0.0.0-0")) {
            return false;
        }
        if (!options.includePrerelease && (this.value.startsWith("<0.0.0") || comp.value.startsWith("<0.0.0"))) {
            return false;
        }
        // Same direction increasing (> or >=)
        if (this.operator.startsWith(">") && comp.operator.startsWith(">")) {
            return true;
        }
        // Same direction decreasing (< or <=)
        if (this.operator.startsWith("<") && comp.operator.startsWith("<")) {
            return true;
        }
        // same SemVer and both sides are inclusive (<= or >=)
        if (this.semver.version === comp.semver.version && this.operator.includes("=") && comp.operator.includes("=")) {
            return true;
        }
        // opposite directions less than
        if (cmp(this.semver, "<", comp.semver, options) && this.operator.startsWith(">") && comp.operator.startsWith("<")) {
            return true;
        }
        // opposite directions greater than
        if (cmp(this.semver, ">", comp.semver, options) && this.operator.startsWith("<") && comp.operator.startsWith(">")) {
            return true;
        }
        return false;
    }
}
module.exports = Comparator;
const parseOptions = __webpack_require__(1354);
const { safeRe: re, t } = __webpack_require__(57473);
const cmp = __webpack_require__(71158);
const debug = __webpack_require__(63901);
const SemVer = __webpack_require__(33930);
const Range = __webpack_require__(96907);


/***/ }),

/***/ 96907:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const SPACE_CHARACTERS = /\s+/g;
// hoisted class for cyclic dependency
class Range {
    constructor(range, options){
        options = parseOptions(options);
        if (range instanceof Range) {
            if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) {
                return range;
            } else {
                return new Range(range.raw, options);
            }
        }
        if (range instanceof Comparator) {
            // just put it in the set and return
            this.raw = range.value;
            this.set = [
                [
                    range
                ]
            ];
            this.formatted = undefined;
            return this;
        }
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        // First reduce all whitespace as much as possible so we do not have to rely
        // on potentially slow regexes like \s*. This is then stored and used for
        // future error messages as well.
        this.raw = range.trim().replace(SPACE_CHARACTERS, " ");
        // First, split on ||
        this.set = this.raw.split("||")// map the range to a 2d array of comparators
        .map((r)=>this.parseRange(r.trim()))// throw out any comparator lists that are empty
        // this generally means that it was not a valid range, which is allowed
        // in loose mode, but will still throw if the WHOLE range is invalid.
        .filter((c)=>c.length);
        if (!this.set.length) {
            throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
        }
        // if we have any that are not the null set, throw out null sets.
        if (this.set.length > 1) {
            // keep the first one, in case they're all null sets
            const first = this.set[0];
            this.set = this.set.filter((c)=>!isNullSet(c[0]));
            if (this.set.length === 0) {
                this.set = [
                    first
                ];
            } else if (this.set.length > 1) {
                // if we have any that are *, then the range is just *
                for (const c of this.set){
                    if (c.length === 1 && isAny(c[0])) {
                        this.set = [
                            c
                        ];
                        break;
                    }
                }
            }
        }
        this.formatted = undefined;
    }
    get range() {
        if (this.formatted === undefined) {
            this.formatted = "";
            for(let i = 0; i < this.set.length; i++){
                if (i > 0) {
                    this.formatted += "||";
                }
                const comps = this.set[i];
                for(let k = 0; k < comps.length; k++){
                    if (k > 0) {
                        this.formatted += " ";
                    }
                    this.formatted += comps[k].toString().trim();
                }
            }
        }
        return this.formatted;
    }
    format() {
        return this.range;
    }
    toString() {
        return this.range;
    }
    parseRange(range) {
        // memoize range parsing for performance.
        // this is a very hot path, and fully deterministic.
        const memoOpts = (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE);
        const memoKey = memoOpts + ":" + range;
        const cached = cache.get(memoKey);
        if (cached) {
            return cached;
        }
        const loose = this.options.loose;
        // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
        const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
        range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
        debug("hyphen replace", range);
        // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
        range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
        debug("comparator trim", range);
        // `~ 1.2.3` => `~1.2.3`
        range = range.replace(re[t.TILDETRIM], tildeTrimReplace);
        debug("tilde trim", range);
        // `^ 1.2.3` => `^1.2.3`
        range = range.replace(re[t.CARETTRIM], caretTrimReplace);
        debug("caret trim", range);
        // At this point, the range is completely trimmed and
        // ready to be split into comparators.
        let rangeList = range.split(" ").map((comp)=>parseComparator(comp, this.options)).join(" ").split(/\s+/)// >=0.0.0 is equivalent to *
        .map((comp)=>replaceGTE0(comp, this.options));
        if (loose) {
            // in loose mode, throw out any that are not valid comparators
            rangeList = rangeList.filter((comp)=>{
                debug("loose invalid filter", comp, this.options);
                return !!comp.match(re[t.COMPARATORLOOSE]);
            });
        }
        debug("range list", rangeList);
        // if any comparators are the null set, then replace with JUST null set
        // if more than one comparator, remove any * comparators
        // also, don't include the same comparator more than once
        const rangeMap = new Map();
        const comparators = rangeList.map((comp)=>new Comparator(comp, this.options));
        for (const comp of comparators){
            if (isNullSet(comp)) {
                return [
                    comp
                ];
            }
            rangeMap.set(comp.value, comp);
        }
        if (rangeMap.size > 1 && rangeMap.has("")) {
            rangeMap.delete("");
        }
        const result = [
            ...rangeMap.values()
        ];
        cache.set(memoKey, result);
        return result;
    }
    intersects(range, options) {
        if (!(range instanceof Range)) {
            throw new TypeError("a Range is required");
        }
        return this.set.some((thisComparators)=>{
            return isSatisfiable(thisComparators, options) && range.set.some((rangeComparators)=>{
                return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator)=>{
                    return rangeComparators.every((rangeComparator)=>{
                        return thisComparator.intersects(rangeComparator, options);
                    });
                });
            });
        });
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(version) {
        if (!version) {
            return false;
        }
        if (typeof version === "string") {
            try {
                version = new SemVer(version, this.options);
            } catch (er) {
                return false;
            }
        }
        for(let i = 0; i < this.set.length; i++){
            if (testSet(this.set[i], version, this.options)) {
                return true;
            }
        }
        return false;
    }
}
module.exports = Range;
const LRU = __webpack_require__(14770);
const cache = new LRU();
const parseOptions = __webpack_require__(1354);
const Comparator = __webpack_require__(67953);
const debug = __webpack_require__(63901);
const SemVer = __webpack_require__(33930);
const { safeRe: re, t, comparatorTrimReplace, tildeTrimReplace, caretTrimReplace } = __webpack_require__(57473);
const { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = __webpack_require__(70621);
const isNullSet = (c)=>c.value === "<0.0.0-0";
const isAny = (c)=>c.value === "";
// take a set of comparators and determine whether there
// exists a version which can satisfy it
const isSatisfiable = (comparators, options)=>{
    let result = true;
    const remainingComparators = comparators.slice();
    let testComparator = remainingComparators.pop();
    while(result && remainingComparators.length){
        result = remainingComparators.every((otherComparator)=>{
            return testComparator.intersects(otherComparator, options);
        });
        testComparator = remainingComparators.pop();
    }
    return result;
};
// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
const parseComparator = (comp, options)=>{
    debug("comp", comp, options);
    comp = replaceCarets(comp, options);
    debug("caret", comp);
    comp = replaceTildes(comp, options);
    debug("tildes", comp);
    comp = replaceXRanges(comp, options);
    debug("xrange", comp);
    comp = replaceStars(comp, options);
    debug("stars", comp);
    return comp;
};
const isX = (id)=>!id || id.toLowerCase() === "x" || id === "*";
// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0-0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0-0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0-0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0-0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0-0
// ~0.0.1 --> >=0.0.1 <0.1.0-0
const replaceTildes = (comp, options)=>{
    return comp.trim().split(/\s+/).map((c)=>replaceTilde(c, options)).join(" ");
};
const replaceTilde = (comp, options)=>{
    const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
    return comp.replace(r, (_, M, m, p, pr)=>{
        debug("tilde", comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
            ret = "";
        } else if (isX(m)) {
            ret = `>=${M}.0.0 <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
            // ~1.2 == >=1.2.0 <1.3.0-0
            ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`;
        } else if (pr) {
            debug("replaceTilde pr", pr);
            ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
        } else {
            // ~1.2.3 == >=1.2.3 <1.3.0-0
            ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
        }
        debug("tilde return", ret);
        return ret;
    });
};
// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0-0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0-0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0-0
// ^1.2.3 --> >=1.2.3 <2.0.0-0
// ^1.2.0 --> >=1.2.0 <2.0.0-0
// ^0.0.1 --> >=0.0.1 <0.0.2-0
// ^0.1.0 --> >=0.1.0 <0.2.0-0
const replaceCarets = (comp, options)=>{
    return comp.trim().split(/\s+/).map((c)=>replaceCaret(c, options)).join(" ");
};
const replaceCaret = (comp, options)=>{
    debug("caret", comp, options);
    const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
    const z = options.includePrerelease ? "-0" : "";
    return comp.replace(r, (_, M, m, p, pr)=>{
        debug("caret", comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
            ret = "";
        } else if (isX(m)) {
            ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
            if (M === "0") {
                ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
            } else {
                ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
            }
        } else if (pr) {
            debug("replaceCaret pr", pr);
            if (M === "0") {
                if (m === "0") {
                    ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
                } else {
                    ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
                }
            } else {
                ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
            }
        } else {
            debug("no pr");
            if (M === "0") {
                if (m === "0") {
                    ret = `>=${M}.${m}.${p}${z} <${M}.${m}.${+p + 1}-0`;
                } else {
                    ret = `>=${M}.${m}.${p}${z} <${M}.${+m + 1}.0-0`;
                }
            } else {
                ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
            }
        }
        debug("caret return", ret);
        return ret;
    });
};
const replaceXRanges = (comp, options)=>{
    debug("replaceXRanges", comp, options);
    return comp.split(/\s+/).map((c)=>replaceXRange(c, options)).join(" ");
};
const replaceXRange = (comp, options)=>{
    comp = comp.trim();
    const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
    return comp.replace(r, (ret, gtlt, M, m, p, pr)=>{
        debug("xRange", comp, ret, gtlt, M, m, p, pr);
        const xM = isX(M);
        const xm = xM || isX(m);
        const xp = xm || isX(p);
        const anyX = xp;
        if (gtlt === "=" && anyX) {
            gtlt = "";
        }
        // if we're including prereleases in the match, then we need
        // to fix this to -0, the lowest possible prerelease value
        pr = options.includePrerelease ? "-0" : "";
        if (xM) {
            if (gtlt === ">" || gtlt === "<") {
                // nothing is allowed
                ret = "<0.0.0-0";
            } else {
                // nothing is forbidden
                ret = "*";
            }
        } else if (gtlt && anyX) {
            // we know patch is an x, because we have any x at all.
            // replace X with 0
            if (xm) {
                m = 0;
            }
            p = 0;
            if (gtlt === ">") {
                // >1 => >=2.0.0
                // >1.2 => >=1.3.0
                gtlt = ">=";
                if (xm) {
                    M = +M + 1;
                    m = 0;
                    p = 0;
                } else {
                    m = +m + 1;
                    p = 0;
                }
            } else if (gtlt === "<=") {
                // <=0.7.x is actually <0.8.0, since any 0.7.x should
                // pass.  Similarly, <=7.x is actually <8.0.0, etc.
                gtlt = "<";
                if (xm) {
                    M = +M + 1;
                } else {
                    m = +m + 1;
                }
            }
            if (gtlt === "<") {
                pr = "-0";
            }
            ret = `${gtlt + M}.${m}.${p}${pr}`;
        } else if (xm) {
            ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
        } else if (xp) {
            ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
        }
        debug("xRange return", ret);
        return ret;
    });
};
// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
const replaceStars = (comp, options)=>{
    debug("replaceStars", comp, options);
    // Looseness is ignored here.  star is always as loose as it gets!
    return comp.trim().replace(re[t.STAR], "");
};
const replaceGTE0 = (comp, options)=>{
    debug("replaceGTE0", comp, options);
    return comp.trim().replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], "");
};
// This function is passed to string.replace(re[t.HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0-0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0-0
// TODO build?
const hyphenReplace = (incPr)=>($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr)=>{
        if (isX(fM)) {
            from = "";
        } else if (isX(fm)) {
            from = `>=${fM}.0.0${incPr ? "-0" : ""}`;
        } else if (isX(fp)) {
            from = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
        } else if (fpr) {
            from = `>=${from}`;
        } else {
            from = `>=${from}${incPr ? "-0" : ""}`;
        }
        if (isX(tM)) {
            to = "";
        } else if (isX(tm)) {
            to = `<${+tM + 1}.0.0-0`;
        } else if (isX(tp)) {
            to = `<${tM}.${+tm + 1}.0-0`;
        } else if (tpr) {
            to = `<=${tM}.${tm}.${tp}-${tpr}`;
        } else if (incPr) {
            to = `<${tM}.${tm}.${+tp + 1}-0`;
        } else {
            to = `<=${to}`;
        }
        return `${from} ${to}`.trim();
    };
const testSet = (set, version, options)=>{
    for(let i = 0; i < set.length; i++){
        if (!set[i].test(version)) {
            return false;
        }
    }
    if (version.prerelease.length && !options.includePrerelease) {
        // Find the set of versions that are allowed to have prereleases
        // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
        // That should allow `1.2.3-pr.2` to pass.
        // However, `1.2.4-alpha.notready` should NOT be allowed,
        // even though it's within the range set by the comparators.
        for(let i = 0; i < set.length; i++){
            debug(set[i].semver);
            if (set[i].semver === Comparator.ANY) {
                continue;
            }
            if (set[i].semver.prerelease.length > 0) {
                const allowed = set[i].semver;
                if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) {
                    return true;
                }
            }
        }
        // Version has a -pre, but it's not one of the ones we like.
        return false;
    }
    return true;
};


/***/ }),

/***/ 33930:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const debug = __webpack_require__(63901);
const { MAX_LENGTH, MAX_SAFE_INTEGER } = __webpack_require__(70621);
const { safeRe: re, t } = __webpack_require__(57473);
const parseOptions = __webpack_require__(1354);
const { compareIdentifiers } = __webpack_require__(26476);
class SemVer {
    constructor(version, options){
        options = parseOptions(options);
        if (version instanceof SemVer) {
            if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) {
                return version;
            } else {
                version = version.version;
            }
        } else if (typeof version !== "string") {
            throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`);
        }
        if (version.length > MAX_LENGTH) {
            throw new TypeError(`version is longer than ${MAX_LENGTH} characters`);
        }
        debug("SemVer", version, options);
        this.options = options;
        this.loose = !!options.loose;
        // this isn't actually relevant for versions, but keep it so that we
        // don't run into trouble passing this.options around.
        this.includePrerelease = !!options.includePrerelease;
        const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
        if (!m) {
            throw new TypeError(`Invalid Version: ${version}`);
        }
        this.raw = version;
        // these are actually numbers
        this.major = +m[1];
        this.minor = +m[2];
        this.patch = +m[3];
        if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
            throw new TypeError("Invalid major version");
        }
        if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
            throw new TypeError("Invalid minor version");
        }
        if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
            throw new TypeError("Invalid patch version");
        }
        // numberify any prerelease numeric ids
        if (!m[4]) {
            this.prerelease = [];
        } else {
            this.prerelease = m[4].split(".").map((id)=>{
                if (/^[0-9]+$/.test(id)) {
                    const num = +id;
                    if (num >= 0 && num < MAX_SAFE_INTEGER) {
                        return num;
                    }
                }
                return id;
            });
        }
        this.build = m[5] ? m[5].split(".") : [];
        this.format();
    }
    format() {
        this.version = `${this.major}.${this.minor}.${this.patch}`;
        if (this.prerelease.length) {
            this.version += `-${this.prerelease.join(".")}`;
        }
        return this.version;
    }
    toString() {
        return this.version;
    }
    compare(other) {
        debug("SemVer.compare", this.version, this.options, other);
        if (!(other instanceof SemVer)) {
            if (typeof other === "string" && other === this.version) {
                return 0;
            }
            other = new SemVer(other, this.options);
        }
        if (other.version === this.version) {
            return 0;
        }
        return this.compareMain(other) || this.comparePre(other);
    }
    compareMain(other) {
        if (!(other instanceof SemVer)) {
            other = new SemVer(other, this.options);
        }
        return compareIdentifiers(this.major, other.major) || compareIdentifiers(this.minor, other.minor) || compareIdentifiers(this.patch, other.patch);
    }
    comparePre(other) {
        if (!(other instanceof SemVer)) {
            other = new SemVer(other, this.options);
        }
        // NOT having a prerelease is > having one
        if (this.prerelease.length && !other.prerelease.length) {
            return -1;
        } else if (!this.prerelease.length && other.prerelease.length) {
            return 1;
        } else if (!this.prerelease.length && !other.prerelease.length) {
            return 0;
        }
        let i = 0;
        do {
            const a = this.prerelease[i];
            const b = other.prerelease[i];
            debug("prerelease compare", i, a, b);
            if (a === undefined && b === undefined) {
                return 0;
            } else if (b === undefined) {
                return 1;
            } else if (a === undefined) {
                return -1;
            } else if (a === b) {
                continue;
            } else {
                return compareIdentifiers(a, b);
            }
        }while (++i);
    }
    compareBuild(other) {
        if (!(other instanceof SemVer)) {
            other = new SemVer(other, this.options);
        }
        let i = 0;
        do {
            const a = this.build[i];
            const b = other.build[i];
            debug("build compare", i, a, b);
            if (a === undefined && b === undefined) {
                return 0;
            } else if (b === undefined) {
                return 1;
            } else if (a === undefined) {
                return -1;
            } else if (a === b) {
                continue;
            } else {
                return compareIdentifiers(a, b);
            }
        }while (++i);
    }
    // preminor will bump the version up to the next minor release, and immediately
    // down to pre-release. premajor and prepatch work the same way.
    inc(release, identifier, identifierBase) {
        switch(release){
            case "premajor":
                this.prerelease.length = 0;
                this.patch = 0;
                this.minor = 0;
                this.major++;
                this.inc("pre", identifier, identifierBase);
                break;
            case "preminor":
                this.prerelease.length = 0;
                this.patch = 0;
                this.minor++;
                this.inc("pre", identifier, identifierBase);
                break;
            case "prepatch":
                // If this is already a prerelease, it will bump to the next version
                // drop any prereleases that might already exist, since they are not
                // relevant at this point.
                this.prerelease.length = 0;
                this.inc("patch", identifier, identifierBase);
                this.inc("pre", identifier, identifierBase);
                break;
            // If the input is a non-prerelease version, this acts the same as
            // prepatch.
            case "prerelease":
                if (this.prerelease.length === 0) {
                    this.inc("patch", identifier, identifierBase);
                }
                this.inc("pre", identifier, identifierBase);
                break;
            case "major":
                // If this is a pre-major version, bump up to the same major version.
                // Otherwise increment major.
                // 1.0.0-5 bumps to 1.0.0
                // 1.1.0 bumps to 2.0.0
                if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
                    this.major++;
                }
                this.minor = 0;
                this.patch = 0;
                this.prerelease = [];
                break;
            case "minor":
                // If this is a pre-minor version, bump up to the same minor version.
                // Otherwise increment minor.
                // 1.2.0-5 bumps to 1.2.0
                // 1.2.1 bumps to 1.3.0
                if (this.patch !== 0 || this.prerelease.length === 0) {
                    this.minor++;
                }
                this.patch = 0;
                this.prerelease = [];
                break;
            case "patch":
                // If this is not a pre-release version, it will increment the patch.
                // If it is a pre-release it will bump up to the same patch version.
                // 1.2.0-5 patches to 1.2.0
                // 1.2.0 patches to 1.2.1
                if (this.prerelease.length === 0) {
                    this.patch++;
                }
                this.prerelease = [];
                break;
            // This probably shouldn't be used publicly.
            // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
            case "pre":
                {
                    const base = Number(identifierBase) ? 1 : 0;
                    if (!identifier && identifierBase === false) {
                        throw new Error("invalid increment argument: identifier is empty");
                    }
                    if (this.prerelease.length === 0) {
                        this.prerelease = [
                            base
                        ];
                    } else {
                        let i = this.prerelease.length;
                        while(--i >= 0){
                            if (typeof this.prerelease[i] === "number") {
                                this.prerelease[i]++;
                                i = -2;
                            }
                        }
                        if (i === -1) {
                            // didn't increment anything
                            if (identifier === this.prerelease.join(".") && identifierBase === false) {
                                throw new Error("invalid increment argument: identifier already exists");
                            }
                            this.prerelease.push(base);
                        }
                    }
                    if (identifier) {
                        // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
                        // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
                        let prerelease = [
                            identifier,
                            base
                        ];
                        if (identifierBase === false) {
                            prerelease = [
                                identifier
                            ];
                        }
                        if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
                            if (isNaN(this.prerelease[1])) {
                                this.prerelease = prerelease;
                            }
                        } else {
                            this.prerelease = prerelease;
                        }
                    }
                    break;
                }
            default:
                throw new Error(`invalid increment argument: ${release}`);
        }
        this.raw = this.format();
        if (this.build.length) {
            this.raw += `+${this.build.join(".")}`;
        }
        return this;
    }
}
module.exports = SemVer;


/***/ }),

/***/ 59302:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const parse = __webpack_require__(60816);
const clean = (version, options)=>{
    const s = parse(version.trim().replace(/^[=v]+/, ""), options);
    return s ? s.version : null;
};
module.exports = clean;


/***/ }),

/***/ 71158:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const eq = __webpack_require__(95969);
const neq = __webpack_require__(60119);
const gt = __webpack_require__(89456);
const gte = __webpack_require__(16696);
const lt = __webpack_require__(52697);
const lte = __webpack_require__(1488);
const cmp = (a, op, b, loose)=>{
    switch(op){
        case "===":
            if (typeof a === "object") {
                a = a.version;
            }
            if (typeof b === "object") {
                b = b.version;
            }
            return a === b;
        case "!==":
            if (typeof a === "object") {
                a = a.version;
            }
            if (typeof b === "object") {
                b = b.version;
            }
            return a !== b;
        case "":
        case "=":
        case "==":
            return eq(a, b, loose);
        case "!=":
            return neq(a, b, loose);
        case ">":
            return gt(a, b, loose);
        case ">=":
            return gte(a, b, loose);
        case "<":
            return lt(a, b, loose);
        case "<=":
            return lte(a, b, loose);
        default:
            throw new TypeError(`Invalid operator: ${op}`);
    }
};
module.exports = cmp;


/***/ }),

/***/ 34238:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const SemVer = __webpack_require__(33930);
const parse = __webpack_require__(60816);
const { safeRe: re, t } = __webpack_require__(57473);
const coerce = (version, options)=>{
    if (version instanceof SemVer) {
        return version;
    }
    if (typeof version === "number") {
        version = String(version);
    }
    if (typeof version !== "string") {
        return null;
    }
    options = options || {};
    let match = null;
    if (!options.rtl) {
        match = version.match(options.includePrerelease ? re[t.COERCEFULL] : re[t.COERCE]);
    } else {
        // Find the right-most coercible string that does not share
        // a terminus with a more left-ward coercible string.
        // Eg, '1.2.3.4' wants to coerce '2.3.4', not '3.4' or '4'
        // With includePrerelease option set, '1.2.3.4-rc' wants to coerce '2.3.4-rc', not '2.3.4'
        //
        // Walk through the string checking with a /g regexp
        // Manually set the index so as to pick up overlapping matches.
        // Stop when we get a match that ends at the string end, since no
        // coercible string can be more right-ward without the same terminus.
        const coerceRtlRegex = options.includePrerelease ? re[t.COERCERTLFULL] : re[t.COERCERTL];
        let next;
        while((next = coerceRtlRegex.exec(version)) && (!match || match.index + match[0].length !== version.length)){
            if (!match || next.index + next[0].length !== match.index + match[0].length) {
                match = next;
            }
            coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length;
        }
        // leave it in a clean state
        coerceRtlRegex.lastIndex = -1;
    }
    if (match === null) {
        return null;
    }
    const major = match[2];
    const minor = match[3] || "0";
    const patch = match[4] || "0";
    const prerelease = options.includePrerelease && match[5] ? `-${match[5]}` : "";
    const build = options.includePrerelease && match[6] ? `+${match[6]}` : "";
    return parse(`${major}.${minor}.${patch}${prerelease}${build}`, options);
};
module.exports = coerce;


/***/ }),

/***/ 7752:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const SemVer = __webpack_require__(33930);
const compareBuild = (a, b, loose)=>{
    const versionA = new SemVer(a, loose);
    const versionB = new SemVer(b, loose);
    return versionA.compare(versionB) || versionA.compareBuild(versionB);
};
module.exports = compareBuild;


/***/ }),

/***/ 47344:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const compare = __webpack_require__(89029);
const compareLoose = (a, b)=>compare(a, b, true);
module.exports = compareLoose;


/***/ }),

/***/ 89029:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const SemVer = __webpack_require__(33930);
const compare = (a, b, loose)=>new SemVer(a, loose).compare(new SemVer(b, loose));
module.exports = compare;


/***/ }),

/***/ 27057:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const parse = __webpack_require__(60816);
const diff = (version1, version2)=>{
    const v1 = parse(version1, null, true);
    const v2 = parse(version2, null, true);
    const comparison = v1.compare(v2);
    if (comparison === 0) {
        return null;
    }
    const v1Higher = comparison > 0;
    const highVersion = v1Higher ? v1 : v2;
    const lowVersion = v1Higher ? v2 : v1;
    const highHasPre = !!highVersion.prerelease.length;
    const lowHasPre = !!lowVersion.prerelease.length;
    if (lowHasPre && !highHasPre) {
        // Going from prerelease -> no prerelease requires some special casing
        // If the low version has only a major, then it will always be a major
        // Some examples:
        // 1.0.0-1 -> 1.0.0
        // 1.0.0-1 -> 1.1.1
        // 1.0.0-1 -> 2.0.0
        if (!lowVersion.patch && !lowVersion.minor) {
            return "major";
        }
        // Otherwise it can be determined by checking the high version
        if (highVersion.patch) {
            // anything higher than a patch bump would result in the wrong version
            return "patch";
        }
        if (highVersion.minor) {
            // anything higher than a minor bump would result in the wrong version
            return "minor";
        }
        // bumping major/minor/patch all have same result
        return "major";
    }
    // add the `pre` prefix if we are going to a prerelease version
    const prefix = highHasPre ? "pre" : "";
    if (v1.major !== v2.major) {
        return prefix + "major";
    }
    if (v1.minor !== v2.minor) {
        return prefix + "minor";
    }
    if (v1.patch !== v2.patch) {
        return prefix + "patch";
    }
    // high and low are preleases
    return "prerelease";
};
module.exports = diff;


/***/ }),

/***/ 95969:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const compare = __webpack_require__(89029);
const eq = (a, b, loose)=>compare(a, b, loose) === 0;
module.exports = eq;


/***/ }),

/***/ 89456:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const compare = __webpack_require__(89029);
const gt = (a, b, loose)=>compare(a, b, loose) > 0;
module.exports = gt;


/***/ }),

/***/ 16696:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const compare = __webpack_require__(89029);
const gte = (a, b, loose)=>compare(a, b, loose) >= 0;
module.exports = gte;


/***/ }),

/***/ 11228:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const SemVer = __webpack_require__(33930);
const inc = (version, release, options, identifier, identifierBase)=>{
    if (typeof options === "string") {
        identifierBase = identifier;
        identifier = options;
        options = undefined;
    }
    try {
        return new SemVer(version instanceof SemVer ? version.version : version, options).inc(release, identifier, identifierBase).version;
    } catch (er) {
        return null;
    }
};
module.exports = inc;


/***/ }),

/***/ 52697:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const compare = __webpack_require__(89029);
const lt = (a, b, loose)=>compare(a, b, loose) < 0;
module.exports = lt;


/***/ }),

/***/ 1488:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const compare = __webpack_require__(89029);
const lte = (a, b, loose)=>compare(a, b, loose) <= 0;
module.exports = lte;


/***/ }),

/***/ 80731:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const SemVer = __webpack_require__(33930);
const major = (a, loose)=>new SemVer(a, loose).major;
module.exports = major;


/***/ }),

/***/ 73289:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const SemVer = __webpack_require__(33930);
const minor = (a, loose)=>new SemVer(a, loose).minor;
module.exports = minor;


/***/ }),

/***/ 60119:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const compare = __webpack_require__(89029);
const neq = (a, b, loose)=>compare(a, b, loose) !== 0;
module.exports = neq;


/***/ }),

/***/ 60816:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const SemVer = __webpack_require__(33930);
const parse = (version, options, throwErrors = false)=>{
    if (version instanceof SemVer) {
        return version;
    }
    try {
        return new SemVer(version, options);
    } catch (er) {
        if (!throwErrors) {
            return null;
        }
        throw er;
    }
};
module.exports = parse;


/***/ }),

/***/ 90470:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const SemVer = __webpack_require__(33930);
const patch = (a, loose)=>new SemVer(a, loose).patch;
module.exports = patch;


/***/ }),

/***/ 43832:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const parse = __webpack_require__(60816);
const prerelease = (version, options)=>{
    const parsed = parse(version, options);
    return parsed && parsed.prerelease.length ? parsed.prerelease : null;
};
module.exports = prerelease;


/***/ }),

/***/ 79690:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const compare = __webpack_require__(89029);
const rcompare = (a, b, loose)=>compare(b, a, loose);
module.exports = rcompare;


/***/ }),

/***/ 78128:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const compareBuild = __webpack_require__(7752);
const rsort = (list, loose)=>list.sort((a, b)=>compareBuild(b, a, loose));
module.exports = rsort;


/***/ }),

/***/ 55264:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const Range = __webpack_require__(96907);
const satisfies = (version, range, options)=>{
    try {
        range = new Range(range, options);
    } catch (er) {
        return false;
    }
    return range.test(version);
};
module.exports = satisfies;


/***/ }),

/***/ 76625:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const compareBuild = __webpack_require__(7752);
const sort = (list, loose)=>list.sort((a, b)=>compareBuild(a, b, loose));
module.exports = sort;


/***/ }),

/***/ 89097:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const parse = __webpack_require__(60816);
const valid = (version, options)=>{
    const v = parse(version, options);
    return v ? v.version : null;
};
module.exports = valid;


/***/ }),

/***/ 37644:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// just pre-load all the stuff that index.js lazily exports

const internalRe = __webpack_require__(57473);
const constants = __webpack_require__(70621);
const SemVer = __webpack_require__(33930);
const identifiers = __webpack_require__(26476);
const parse = __webpack_require__(60816);
const valid = __webpack_require__(89097);
const clean = __webpack_require__(59302);
const inc = __webpack_require__(11228);
const diff = __webpack_require__(27057);
const major = __webpack_require__(80731);
const minor = __webpack_require__(73289);
const patch = __webpack_require__(90470);
const prerelease = __webpack_require__(43832);
const compare = __webpack_require__(89029);
const rcompare = __webpack_require__(79690);
const compareLoose = __webpack_require__(47344);
const compareBuild = __webpack_require__(7752);
const sort = __webpack_require__(76625);
const rsort = __webpack_require__(78128);
const gt = __webpack_require__(89456);
const lt = __webpack_require__(52697);
const eq = __webpack_require__(95969);
const neq = __webpack_require__(60119);
const gte = __webpack_require__(16696);
const lte = __webpack_require__(1488);
const cmp = __webpack_require__(71158);
const coerce = __webpack_require__(34238);
const Comparator = __webpack_require__(67953);
const Range = __webpack_require__(96907);
const satisfies = __webpack_require__(55264);
const toComparators = __webpack_require__(70225);
const maxSatisfying = __webpack_require__(70628);
const minSatisfying = __webpack_require__(496);
const minVersion = __webpack_require__(18046);
const validRange = __webpack_require__(85011);
const outside = __webpack_require__(12080);
const gtr = __webpack_require__(61532);
const ltr = __webpack_require__(14796);
const intersects = __webpack_require__(11720);
const simplifyRange = __webpack_require__(79130);
const subset = __webpack_require__(77561);
module.exports = {
    parse,
    valid,
    clean,
    inc,
    diff,
    major,
    minor,
    patch,
    prerelease,
    compare,
    rcompare,
    compareLoose,
    compareBuild,
    sort,
    rsort,
    gt,
    lt,
    eq,
    neq,
    gte,
    lte,
    cmp,
    coerce,
    Comparator,
    Range,
    satisfies,
    toComparators,
    maxSatisfying,
    minSatisfying,
    minVersion,
    validRange,
    outside,
    gtr,
    ltr,
    intersects,
    simplifyRange,
    subset,
    SemVer,
    re: internalRe.re,
    src: internalRe.src,
    tokens: internalRe.t,
    SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
    RELEASE_TYPES: constants.RELEASE_TYPES,
    compareIdentifiers: identifiers.compareIdentifiers,
    rcompareIdentifiers: identifiers.rcompareIdentifiers
};


/***/ }),

/***/ 70621:
/***/ ((module) => {

"use strict";
// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.

const SEMVER_SPEC_VERSION = "2.0.0";
const MAX_LENGTH = 256;
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */ 9007199254740991;
// Max safe segment length for coercion.
const MAX_SAFE_COMPONENT_LENGTH = 16;
// Max safe length for a build identifier. The max length minus 6 characters for
// the shortest version with a build 0.0.0+BUILD.
const MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6;
const RELEASE_TYPES = [
    "major",
    "premajor",
    "minor",
    "preminor",
    "patch",
    "prepatch",
    "prerelease"
];
module.exports = {
    MAX_LENGTH,
    MAX_SAFE_COMPONENT_LENGTH,
    MAX_SAFE_BUILD_LENGTH,
    MAX_SAFE_INTEGER,
    RELEASE_TYPES,
    SEMVER_SPEC_VERSION,
    FLAG_INCLUDE_PRERELEASE: 1,
    FLAG_LOOSE: 2
};


/***/ }),

/***/ 63901:
/***/ ((module) => {

"use strict";

const debug = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args)=>console.error("SEMVER", ...args) : ()=>{};
module.exports = debug;


/***/ }),

/***/ 26476:
/***/ ((module) => {

"use strict";

const numeric = /^[0-9]+$/;
const compareIdentifiers = (a, b)=>{
    const anum = numeric.test(a);
    const bnum = numeric.test(b);
    if (anum && bnum) {
        a = +a;
        b = +b;
    }
    return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
};
const rcompareIdentifiers = (a, b)=>compareIdentifiers(b, a);
module.exports = {
    compareIdentifiers,
    rcompareIdentifiers
};


/***/ }),

/***/ 14770:
/***/ ((module) => {

"use strict";

class LRUCache {
    constructor(){
        this.max = 1000;
        this.map = new Map();
    }
    get(key) {
        const value = this.map.get(key);
        if (value === undefined) {
            return undefined;
        } else {
            // Remove the key from the map and add it to the end
            this.map.delete(key);
            this.map.set(key, value);
            return value;
        }
    }
    delete(key) {
        return this.map.delete(key);
    }
    set(key, value) {
        const deleted = this.delete(key);
        if (!deleted && value !== undefined) {
            // If cache is full, delete the least recently used item
            if (this.map.size >= this.max) {
                const firstKey = this.map.keys().next().value;
                this.delete(firstKey);
            }
            this.map.set(key, value);
        }
        return this;
    }
}
module.exports = LRUCache;


/***/ }),

/***/ 1354:
/***/ ((module) => {

"use strict";
// parse out just the options we care about

const looseOption = Object.freeze({
    loose: true
});
const emptyOpts = Object.freeze({});
const parseOptions = (options)=>{
    if (!options) {
        return emptyOpts;
    }
    if (typeof options !== "object") {
        return looseOption;
    }
    return options;
};
module.exports = parseOptions;


/***/ }),

/***/ 57473:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

const { MAX_SAFE_COMPONENT_LENGTH, MAX_SAFE_BUILD_LENGTH, MAX_LENGTH } = __webpack_require__(70621);
const debug = __webpack_require__(63901);
exports = module.exports = {};
// The actual regexps go on exports.re
const re = exports.re = [];
const safeRe = exports.safeRe = [];
const src = exports.src = [];
const t = exports.t = {};
let R = 0;
const LETTERDASHNUMBER = "[a-zA-Z0-9-]";
// Replace some greedy regex tokens to prevent regex dos issues. These regex are
// used internally via the safeRe object since all inputs in this library get
// normalized first to trim and collapse all extra whitespace. The original
// regexes are exported for userland consumption and lower level usage. A
// future breaking change could export the safer regex only with a note that
// all input should have extra whitespace removed.
const safeRegexReplacements = [
    [
        "\\s",
        1
    ],
    [
        "\\d",
        MAX_LENGTH
    ],
    [
        LETTERDASHNUMBER,
        MAX_SAFE_BUILD_LENGTH
    ]
];
const makeSafeRegex = (value)=>{
    for (const [token, max] of safeRegexReplacements){
        value = value.split(`${token}*`).join(`${token}{0,${max}}`).split(`${token}+`).join(`${token}{1,${max}}`);
    }
    return value;
};
const createToken = (name, value, isGlobal)=>{
    const safe = makeSafeRegex(value);
    const index = R++;
    debug(name, index, value);
    t[name] = index;
    src[index] = value;
    re[index] = new RegExp(value, isGlobal ? "g" : undefined);
    safeRe[index] = new RegExp(safe, isGlobal ? "g" : undefined);
};
// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.
// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.
createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
createToken("NUMERICIDENTIFIERLOOSE", "\\d+");
// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.
createToken("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
// ## Main Version
// Three dot-separated numeric identifiers.
createToken("MAINVERSION", `(${src[t.NUMERICIDENTIFIER]})\\.` + `(${src[t.NUMERICIDENTIFIER]})\\.` + `(${src[t.NUMERICIDENTIFIER]})`);
createToken("MAINVERSIONLOOSE", `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` + `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` + `(${src[t.NUMERICIDENTIFIERLOOSE]})`);
// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.
createToken("PRERELEASEIDENTIFIER", `(?:${src[t.NUMERICIDENTIFIER]}|${src[t.NONNUMERICIDENTIFIER]})`);
createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src[t.NUMERICIDENTIFIERLOOSE]}|${src[t.NONNUMERICIDENTIFIER]})`);
// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.
createToken("PRERELEASE", `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);
createToken("PRERELEASELOOSE", `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);
// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.
createToken("BUILDIDENTIFIER", `${LETTERDASHNUMBER}+`);
// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.
createToken("BUILD", `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);
// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.
// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.
createToken("FULLPLAIN", `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`);
createToken("FULL", `^${src[t.FULLPLAIN]}$`);
// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
createToken("LOOSEPLAIN", `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${src[t.BUILD]}?`);
createToken("LOOSE", `^${src[t.LOOSEPLAIN]}$`);
createToken("GTLT", "((?:<|>)?=?)");
// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
createToken("XRANGEIDENTIFIERLOOSE", `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
createToken("XRANGEIDENTIFIER", `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);
createToken("XRANGEPLAIN", `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})` + `(?:\\.(${src[t.XRANGEIDENTIFIER]})` + `(?:\\.(${src[t.XRANGEIDENTIFIER]})` + `(?:${src[t.PRERELEASE]})?${src[t.BUILD]}?` + `)?)?`);
createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})` + `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` + `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` + `(?:${src[t.PRERELEASELOOSE]})?${src[t.BUILD]}?` + `)?)?`);
createToken("XRANGE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
createToken("XRANGELOOSE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);
// Coercion.
// Extract anything that could conceivably be a part of a valid semver
createToken("COERCEPLAIN", `${"(^|[^\\d])" + "(\\d{1,"}${MAX_SAFE_COMPONENT_LENGTH}})` + `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` + `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`);
createToken("COERCE", `${src[t.COERCEPLAIN]}(?:$|[^\\d])`);
createToken("COERCEFULL", src[t.COERCEPLAIN] + `(?:${src[t.PRERELEASE]})?` + `(?:${src[t.BUILD]})?` + `(?:$|[^\\d])`);
createToken("COERCERTL", src[t.COERCE], true);
createToken("COERCERTLFULL", src[t.COERCEFULL], true);
// Tilde ranges.
// Meaning is "reasonably at or greater than"
createToken("LONETILDE", "(?:~>?)");
createToken("TILDETRIM", `(\\s*)${src[t.LONETILDE]}\\s+`, true);
exports.tildeTrimReplace = "$1~";
createToken("TILDE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
createToken("TILDELOOSE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);
// Caret ranges.
// Meaning is "at least and backwards compatible with"
createToken("LONECARET", "(?:\\^)");
createToken("CARETTRIM", `(\\s*)${src[t.LONECARET]}\\s+`, true);
exports.caretTrimReplace = "$1^";
createToken("CARET", `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
createToken("CARETLOOSE", `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);
// A simple gt/lt/eq thing, or just "" to indicate "any version"
createToken("COMPARATORLOOSE", `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
createToken("COMPARATOR", `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);
// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
createToken("COMPARATORTRIM", `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
exports.comparatorTrimReplace = "$1$2$3";
// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
createToken("HYPHENRANGE", `^\\s*(${src[t.XRANGEPLAIN]})` + `\\s+-\\s+` + `(${src[t.XRANGEPLAIN]})` + `\\s*$`);
createToken("HYPHENRANGELOOSE", `^\\s*(${src[t.XRANGEPLAINLOOSE]})` + `\\s+-\\s+` + `(${src[t.XRANGEPLAINLOOSE]})` + `\\s*$`);
// Star ranges basically just allow anything at all.
createToken("STAR", "(<|>)?=?\\s*\\*");
// >=0.0.0 is like a star
createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");


/***/ }),

/***/ 61532:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// Determine if version is greater than all the versions possible in the range.

const outside = __webpack_require__(12080);
const gtr = (version, range, options)=>outside(version, range, ">", options);
module.exports = gtr;


/***/ }),

/***/ 11720:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const Range = __webpack_require__(96907);
const intersects = (r1, r2, options)=>{
    r1 = new Range(r1, options);
    r2 = new Range(r2, options);
    return r1.intersects(r2, options);
};
module.exports = intersects;


/***/ }),

/***/ 14796:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const outside = __webpack_require__(12080);
// Determine if version is less than all the versions possible in the range
const ltr = (version, range, options)=>outside(version, range, "<", options);
module.exports = ltr;


/***/ }),

/***/ 70628:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const SemVer = __webpack_require__(33930);
const Range = __webpack_require__(96907);
const maxSatisfying = (versions, range, options)=>{
    let max = null;
    let maxSV = null;
    let rangeObj = null;
    try {
        rangeObj = new Range(range, options);
    } catch (er) {
        return null;
    }
    versions.forEach((v)=>{
        if (rangeObj.test(v)) {
            // satisfies(v, range, options)
            if (!max || maxSV.compare(v) === -1) {
                // compare(max, v, true)
                max = v;
                maxSV = new SemVer(max, options);
            }
        }
    });
    return max;
};
module.exports = maxSatisfying;


/***/ }),

/***/ 496:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const SemVer = __webpack_require__(33930);
const Range = __webpack_require__(96907);
const minSatisfying = (versions, range, options)=>{
    let min = null;
    let minSV = null;
    let rangeObj = null;
    try {
        rangeObj = new Range(range, options);
    } catch (er) {
        return null;
    }
    versions.forEach((v)=>{
        if (rangeObj.test(v)) {
            // satisfies(v, range, options)
            if (!min || minSV.compare(v) === 1) {
                // compare(min, v, true)
                min = v;
                minSV = new SemVer(min, options);
            }
        }
    });
    return min;
};
module.exports = minSatisfying;


/***/ }),

/***/ 18046:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const SemVer = __webpack_require__(33930);
const Range = __webpack_require__(96907);
const gt = __webpack_require__(89456);
const minVersion = (range, loose)=>{
    range = new Range(range, loose);
    let minver = new SemVer("0.0.0");
    if (range.test(minver)) {
        return minver;
    }
    minver = new SemVer("0.0.0-0");
    if (range.test(minver)) {
        return minver;
    }
    minver = null;
    for(let i = 0; i < range.set.length; ++i){
        const comparators = range.set[i];
        let setMin = null;
        comparators.forEach((comparator)=>{
            // Clone to avoid manipulating the comparator's semver object.
            const compver = new SemVer(comparator.semver.version);
            switch(comparator.operator){
                case ">":
                    if (compver.prerelease.length === 0) {
                        compver.patch++;
                    } else {
                        compver.prerelease.push(0);
                    }
                    compver.raw = compver.format();
                /* fallthrough */ case "":
                case ">=":
                    if (!setMin || gt(compver, setMin)) {
                        setMin = compver;
                    }
                    break;
                case "<":
                case "<=":
                    break;
                /* istanbul ignore next */ default:
                    throw new Error(`Unexpected operation: ${comparator.operator}`);
            }
        });
        if (setMin && (!minver || gt(minver, setMin))) {
            minver = setMin;
        }
    }
    if (minver && range.test(minver)) {
        return minver;
    }
    return null;
};
module.exports = minVersion;


/***/ }),

/***/ 12080:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const SemVer = __webpack_require__(33930);
const Comparator = __webpack_require__(67953);
const { ANY } = Comparator;
const Range = __webpack_require__(96907);
const satisfies = __webpack_require__(55264);
const gt = __webpack_require__(89456);
const lt = __webpack_require__(52697);
const lte = __webpack_require__(1488);
const gte = __webpack_require__(16696);
const outside = (version, range, hilo, options)=>{
    version = new SemVer(version, options);
    range = new Range(range, options);
    let gtfn, ltefn, ltfn, comp, ecomp;
    switch(hilo){
        case ">":
            gtfn = gt;
            ltefn = lte;
            ltfn = lt;
            comp = ">";
            ecomp = ">=";
            break;
        case "<":
            gtfn = lt;
            ltefn = gte;
            ltfn = gt;
            comp = "<";
            ecomp = "<=";
            break;
        default:
            throw new TypeError('Must provide a hilo val of "<" or ">"');
    }
    // If it satisfies the range it is not outside
    if (satisfies(version, range, options)) {
        return false;
    }
    // From now on, variable terms are as if we're in "gtr" mode.
    // but note that everything is flipped for the "ltr" function.
    for(let i = 0; i < range.set.length; ++i){
        const comparators = range.set[i];
        let high = null;
        let low = null;
        comparators.forEach((comparator)=>{
            if (comparator.semver === ANY) {
                comparator = new Comparator(">=0.0.0");
            }
            high = high || comparator;
            low = low || comparator;
            if (gtfn(comparator.semver, high.semver, options)) {
                high = comparator;
            } else if (ltfn(comparator.semver, low.semver, options)) {
                low = comparator;
            }
        });
        // If the edge version comparator has a operator then our version
        // isn't outside it
        if (high.operator === comp || high.operator === ecomp) {
            return false;
        }
        // If the lowest version comparator has an operator and our version
        // is less than it then it isn't higher than the range
        if ((!low.operator || low.operator === comp) && ltefn(version, low.semver)) {
            return false;
        } else if (low.operator === ecomp && ltfn(version, low.semver)) {
            return false;
        }
    }
    return true;
};
module.exports = outside;


/***/ }),

/***/ 79130:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// given a set of versions and a range, create a "simplified" range
// that includes the same versions that the original range does
// If the original range is shorter than the simplified one, return that.

const satisfies = __webpack_require__(55264);
const compare = __webpack_require__(89029);
module.exports = (versions, range, options)=>{
    const set = [];
    let first = null;
    let prev = null;
    const v = versions.sort((a, b)=>compare(a, b, options));
    for (const version of v){
        const included = satisfies(version, range, options);
        if (included) {
            prev = version;
            if (!first) {
                first = version;
            }
        } else {
            if (prev) {
                set.push([
                    first,
                    prev
                ]);
            }
            prev = null;
            first = null;
        }
    }
    if (first) {
        set.push([
            first,
            null
        ]);
    }
    const ranges = [];
    for (const [min, max] of set){
        if (min === max) {
            ranges.push(min);
        } else if (!max && min === v[0]) {
            ranges.push("*");
        } else if (!max) {
            ranges.push(`>=${min}`);
        } else if (min === v[0]) {
            ranges.push(`<=${max}`);
        } else {
            ranges.push(`${min} - ${max}`);
        }
    }
    const simplified = ranges.join(" || ");
    const original = typeof range.raw === "string" ? range.raw : String(range);
    return simplified.length < original.length ? simplified : range;
};


/***/ }),

/***/ 77561:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const Range = __webpack_require__(96907);
const Comparator = __webpack_require__(67953);
const { ANY } = Comparator;
const satisfies = __webpack_require__(55264);
const compare = __webpack_require__(89029);
// Complex range `r1 || r2 || ...` is a subset of `R1 || R2 || ...` iff:
// - Every simple range `r1, r2, ...` is a null set, OR
// - Every simple range `r1, r2, ...` which is not a null set is a subset of
//   some `R1, R2, ...`
//
// Simple range `c1 c2 ...` is a subset of simple range `C1 C2 ...` iff:
// - If c is only the ANY comparator
//   - If C is only the ANY comparator, return true
//   - Else if in prerelease mode, return false
//   - else replace c with `[>=0.0.0]`
// - If C is only the ANY comparator
//   - if in prerelease mode, return true
//   - else replace C with `[>=0.0.0]`
// - Let EQ be the set of = comparators in c
// - If EQ is more than one, return true (null set)
// - Let GT be the highest > or >= comparator in c
// - Let LT be the lowest < or <= comparator in c
// - If GT and LT, and GT.semver > LT.semver, return true (null set)
// - If any C is a = range, and GT or LT are set, return false
// - If EQ
//   - If GT, and EQ does not satisfy GT, return true (null set)
//   - If LT, and EQ does not satisfy LT, return true (null set)
//   - If EQ satisfies every C, return true
//   - Else return false
// - If GT
//   - If GT.semver is lower than any > or >= comp in C, return false
//   - If GT is >=, and GT.semver does not satisfy every C, return false
//   - If GT.semver has a prerelease, and not in prerelease mode
//     - If no C has a prerelease and the GT.semver tuple, return false
// - If LT
//   - If LT.semver is greater than any < or <= comp in C, return false
//   - If LT is <=, and LT.semver does not satisfy every C, return false
//   - If GT.semver has a prerelease, and not in prerelease mode
//     - If no C has a prerelease and the LT.semver tuple, return false
// - Else return true
const subset = (sub, dom, options = {})=>{
    if (sub === dom) {
        return true;
    }
    sub = new Range(sub, options);
    dom = new Range(dom, options);
    let sawNonNull = false;
    OUTER: for (const simpleSub of sub.set){
        for (const simpleDom of dom.set){
            const isSub = simpleSubset(simpleSub, simpleDom, options);
            sawNonNull = sawNonNull || isSub !== null;
            if (isSub) {
                continue OUTER;
            }
        }
        // the null set is a subset of everything, but null simple ranges in
        // a complex range should be ignored.  so if we saw a non-null range,
        // then we know this isn't a subset, but if EVERY simple range was null,
        // then it is a subset.
        if (sawNonNull) {
            return false;
        }
    }
    return true;
};
const minimumVersionWithPreRelease = [
    new Comparator(">=0.0.0-0")
];
const minimumVersion = [
    new Comparator(">=0.0.0")
];
const simpleSubset = (sub, dom, options)=>{
    if (sub === dom) {
        return true;
    }
    if (sub.length === 1 && sub[0].semver === ANY) {
        if (dom.length === 1 && dom[0].semver === ANY) {
            return true;
        } else if (options.includePrerelease) {
            sub = minimumVersionWithPreRelease;
        } else {
            sub = minimumVersion;
        }
    }
    if (dom.length === 1 && dom[0].semver === ANY) {
        if (options.includePrerelease) {
            return true;
        } else {
            dom = minimumVersion;
        }
    }
    const eqSet = new Set();
    let gt, lt;
    for (const c of sub){
        if (c.operator === ">" || c.operator === ">=") {
            gt = higherGT(gt, c, options);
        } else if (c.operator === "<" || c.operator === "<=") {
            lt = lowerLT(lt, c, options);
        } else {
            eqSet.add(c.semver);
        }
    }
    if (eqSet.size > 1) {
        return null;
    }
    let gtltComp;
    if (gt && lt) {
        gtltComp = compare(gt.semver, lt.semver, options);
        if (gtltComp > 0) {
            return null;
        } else if (gtltComp === 0 && (gt.operator !== ">=" || lt.operator !== "<=")) {
            return null;
        }
    }
    // will iterate one or zero times
    for (const eq of eqSet){
        if (gt && !satisfies(eq, String(gt), options)) {
            return null;
        }
        if (lt && !satisfies(eq, String(lt), options)) {
            return null;
        }
        for (const c of dom){
            if (!satisfies(eq, String(c), options)) {
                return false;
            }
        }
        return true;
    }
    let higher, lower;
    let hasDomLT, hasDomGT;
    // if the subset has a prerelease, we need a comparator in the superset
    // with the same tuple and a prerelease, or it's not a subset
    let needDomLTPre = lt && !options.includePrerelease && lt.semver.prerelease.length ? lt.semver : false;
    let needDomGTPre = gt && !options.includePrerelease && gt.semver.prerelease.length ? gt.semver : false;
    // exception: <1.2.3-0 is the same as <1.2.3
    if (needDomLTPre && needDomLTPre.prerelease.length === 1 && lt.operator === "<" && needDomLTPre.prerelease[0] === 0) {
        needDomLTPre = false;
    }
    for (const c of dom){
        hasDomGT = hasDomGT || c.operator === ">" || c.operator === ">=";
        hasDomLT = hasDomLT || c.operator === "<" || c.operator === "<=";
        if (gt) {
            if (needDomGTPre) {
                if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomGTPre.major && c.semver.minor === needDomGTPre.minor && c.semver.patch === needDomGTPre.patch) {
                    needDomGTPre = false;
                }
            }
            if (c.operator === ">" || c.operator === ">=") {
                higher = higherGT(gt, c, options);
                if (higher === c && higher !== gt) {
                    return false;
                }
            } else if (gt.operator === ">=" && !satisfies(gt.semver, String(c), options)) {
                return false;
            }
        }
        if (lt) {
            if (needDomLTPre) {
                if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomLTPre.major && c.semver.minor === needDomLTPre.minor && c.semver.patch === needDomLTPre.patch) {
                    needDomLTPre = false;
                }
            }
            if (c.operator === "<" || c.operator === "<=") {
                lower = lowerLT(lt, c, options);
                if (lower === c && lower !== lt) {
                    return false;
                }
            } else if (lt.operator === "<=" && !satisfies(lt.semver, String(c), options)) {
                return false;
            }
        }
        if (!c.operator && (lt || gt) && gtltComp !== 0) {
            return false;
        }
    }
    // if there was a < or >, and nothing in the dom, then must be false
    // UNLESS it was limited by another range in the other direction.
    // Eg, >1.0.0 <1.0.1 is still a subset of <2.0.0
    if (gt && hasDomLT && !lt && gtltComp !== 0) {
        return false;
    }
    if (lt && hasDomGT && !gt && gtltComp !== 0) {
        return false;
    }
    // we needed a prerelease range in a specific tuple, but didn't get one
    // then this isn't a subset.  eg >=1.2.3-pre is not a subset of >=1.0.0,
    // because it includes prereleases in the 1.2.3 tuple
    if (needDomGTPre || needDomLTPre) {
        return false;
    }
    return true;
};
// >=1.2.3 is lower than >1.2.3
const higherGT = (a, b, options)=>{
    if (!a) {
        return b;
    }
    const comp = compare(a.semver, b.semver, options);
    return comp > 0 ? a : comp < 0 ? b : b.operator === ">" && a.operator === ">=" ? b : a;
};
// <=1.2.3 is higher than <1.2.3
const lowerLT = (a, b, options)=>{
    if (!a) {
        return b;
    }
    const comp = compare(a.semver, b.semver, options);
    return comp < 0 ? a : comp > 0 ? b : b.operator === "<" && a.operator === "<=" ? b : a;
};
module.exports = subset;


/***/ }),

/***/ 70225:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const Range = __webpack_require__(96907);
// Mostly just for testing and legacy API reasons
const toComparators = (range, options)=>new Range(range, options).set.map((comp)=>comp.map((c)=>c.value).join(" ").trim().split(" "));
module.exports = toComparators;


/***/ }),

/***/ 85011:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const Range = __webpack_require__(96907);
const validRange = (range, options)=>{
    try {
        // Return '*' instead of '' so that truthiness works.
        // This will throw if it's invalid anyway
        return new Range(range, options).range || "*";
    } catch (er) {
        return null;
    }
};
module.exports = validRange;


/***/ }),

/***/ 4594:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
function _interopDefault(ex) {
    return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
}
var jsonwebtoken = _interopDefault(__webpack_require__(15232));
async function getToken({ privateKey, payload }) {
    return jsonwebtoken.sign(payload, privateKey, {
        algorithm: "RS256"
    });
}
async function githubAppJwt({ id, privateKey, now = Math.floor(Date.now() / 1000) }) {
    // When creating a JSON Web Token, it sets the "issued at time" (iat) to 30s
    // in the past as we have seen people running situations where the GitHub API
    // claimed the iat would be in future. It turned out the clocks on the
    // different machine were not in sync.
    const nowWithSafetyMargin = now - 30;
    const expiration = nowWithSafetyMargin + 60 * 10; // JWT expiration time (10 minute maximum)
    const payload = {
        iat: nowWithSafetyMargin,
        exp: expiration,
        iss: id
    };
    const token = await getToken({
        privateKey,
        payload
    });
    return {
        appId: id,
        expiration,
        token
    };
}
exports.githubAppJwt = githubAppJwt; //# sourceMappingURL=index.js.map


/***/ }),

/***/ 33716:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
function getUserAgent() {
    if (typeof navigator === "object" && "userAgent" in navigator) {
        return navigator.userAgent;
    }
    if (typeof process === "object" && process.version !== undefined) {
        return `Node.js/${process.version.substr(1)} (${process.platform}; ${process.arch})`;
    }
    return "<environment undetectable>";
}
exports.getUserAgent = getUserAgent; //# sourceMappingURL=index.js.map


/***/ }),

/***/ 37412:
/***/ ((module) => {

"use strict";
// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.

module.exports = wrappy;
function wrappy(fn, cb) {
    if (fn && cb) return wrappy(fn)(cb);
    if (typeof fn !== "function") throw new TypeError("need wrapper function");
    Object.keys(fn).forEach(function(k) {
        wrapper[k] = fn[k];
    });
    return wrapper;
    function wrapper() {
        var args = new Array(arguments.length);
        for(var i = 0; i < args.length; i++){
            args[i] = arguments[i];
        }
        var ret = fn.apply(this, args);
        var cb = args[args.length - 1];
        if (typeof ret === "function" && ret !== cb) {
            Object.keys(cb).forEach(function(k) {
                ret[k] = cb[k];
            });
        }
        return ret;
    }
}


/***/ }),

/***/ 72951:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/**
 * @module LRUCache
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.LRUCache = void 0;
const perf = typeof performance === "object" && performance && typeof performance.now === "function" ? performance : Date;
const warned = new Set();
/* c8 ignore start */ const PROCESS = typeof process === "object" && !!process ? process : {};
/* c8 ignore start */ const emitWarning = (msg, type, code, fn)=>{
    typeof PROCESS.emitWarning === "function" ? PROCESS.emitWarning(msg, type, code, fn) : console.error(`[${code}] ${type}: ${msg}`);
};
let AC = globalThis.AbortController;
let AS = globalThis.AbortSignal;
/* c8 ignore start */ if (typeof AC === "undefined") {
    //@ts-ignore
    AS = class AbortSignal {
        addEventListener(_, fn) {
            this._onabort.push(fn);
        }
        constructor(){
            this._onabort = [];
            this.aborted = false;
        }
    };
    //@ts-ignore
    AC = class AbortController {
        constructor(){
            this.signal = new AS();
            warnACPolyfill();
        }
        abort(reason) {
            if (this.signal.aborted) return;
            //@ts-ignore
            this.signal.reason = reason;
            //@ts-ignore
            this.signal.aborted = true;
            //@ts-ignore
            for (const fn of this.signal._onabort){
                fn(reason);
            }
            this.signal.onabort?.(reason);
        }
    };
    let printACPolyfillWarning = PROCESS.env?.LRU_CACHE_IGNORE_AC_WARNING !== "1";
    const warnACPolyfill = ()=>{
        if (!printACPolyfillWarning) return;
        printACPolyfillWarning = false;
        emitWarning("AbortController is not defined. If using lru-cache in " + "node 14, load an AbortController polyfill from the " + "`node-abort-controller` package. A minimal polyfill is " + "provided for use by LRUCache.fetch(), but it should not be " + "relied upon in other contexts (eg, passing it to other APIs that " + "use AbortController/AbortSignal might have undesirable effects). " + "You may disable this with LRU_CACHE_IGNORE_AC_WARNING=1 in the env.", "NO_ABORT_CONTROLLER", "ENOTSUP", warnACPolyfill);
    };
}
/* c8 ignore stop */ const shouldWarn = (code)=>!warned.has(code);
const TYPE = Symbol("type");
const isPosInt = (n)=>n && n === Math.floor(n) && n > 0 && isFinite(n);
/* c8 ignore start */ // This is a little bit ridiculous, tbh.
// The maximum array length is 2^32-1 or thereabouts on most JS impls.
// And well before that point, you're caching the entire world, I mean,
// that's ~32GB of just integers for the next/prev links, plus whatever
// else to hold that many keys and values.  Just filling the memory with
// zeroes at init time is brutal when you get that big.
// But why not be complete?
// Maybe in the future, these limits will have expanded.
const getUintArray = (max)=>!isPosInt(max) ? null : max <= Math.pow(2, 8) ? Uint8Array : max <= Math.pow(2, 16) ? Uint16Array : max <= Math.pow(2, 32) ? Uint32Array : max <= Number.MAX_SAFE_INTEGER ? ZeroArray : null;
/* c8 ignore stop */ class ZeroArray extends Array {
    constructor(size){
        super(size);
        this.fill(0);
    }
}
class Stack {
    // private constructor
    static #constructing = false;
    static create(max) {
        const HeapCls = getUintArray(max);
        if (!HeapCls) return [];
        Stack.#constructing = true;
        const s = new Stack(max, HeapCls);
        Stack.#constructing = false;
        return s;
    }
    constructor(max, HeapCls){
        /* c8 ignore start */ if (!Stack.#constructing) {
            throw new TypeError("instantiate Stack using Stack.create(n)");
        }
        /* c8 ignore stop */ this.heap = new HeapCls(max);
        this.length = 0;
    }
    push(n) {
        this.heap[this.length++] = n;
    }
    pop() {
        return this.heap[--this.length];
    }
}
let prop;
/**
 * Default export, the thing you're using this module to get.
 *
 * The `K` and `V` types define the key and value types, respectively. The
 * optional `FC` type defines the type of the `context` object passed to
 * `cache.fetch()` and `cache.memo()`.
 *
 * Keys and values **must not** be `null` or `undefined`.
 *
 * All properties from the options object (with the exception of `max`,
 * `maxSize`, `fetchMethod`, `memoMethod`, `dispose` and `disposeAfter`) are
 * added as normal public members. (The listed options are read-only getters.)
 *
 * Changing any of these will alter the defaults for subsequent method calls.
 */ class LRUCache {
    static{
        prop = Symbol.toStringTag;
    }
    // options that cannot be changed without disaster
    #max;
    #maxSize;
    #dispose;
    #disposeAfter;
    #fetchMethod;
    #memoMethod;
    // computed properties
    #size;
    #calculatedSize;
    #keyMap;
    #keyList;
    #valList;
    #next;
    #prev;
    #head;
    #tail;
    #free;
    #disposed;
    #sizes;
    #starts;
    #ttls;
    #hasDispose;
    #hasFetchMethod;
    #hasDisposeAfter;
    /**
     * Do not call this method unless you need to inspect the
     * inner workings of the cache.  If anything returned by this
     * object is modified in any way, strange breakage may occur.
     *
     * These fields are private for a reason!
     *
     * @internal
     */ static unsafeExposeInternals(c) {
        return {
            // properties
            starts: c.#starts,
            ttls: c.#ttls,
            sizes: c.#sizes,
            keyMap: c.#keyMap,
            keyList: c.#keyList,
            valList: c.#valList,
            next: c.#next,
            prev: c.#prev,
            get head () {
                return c.#head;
            },
            get tail () {
                return c.#tail;
            },
            free: c.#free,
            // methods
            isBackgroundFetch: (p)=>c.#isBackgroundFetch(p),
            backgroundFetch: (k, index, options, context)=>c.#backgroundFetch(k, index, options, context),
            moveToTail: (index)=>c.#moveToTail(index),
            indexes: (options)=>c.#indexes(options),
            rindexes: (options)=>c.#rindexes(options),
            isStale: (index)=>c.#isStale(index)
        };
    }
    // Protected read-only members
    /**
     * {@link LRUCache.OptionsBase.max} (read-only)
     */ get max() {
        return this.#max;
    }
    /**
     * {@link LRUCache.OptionsBase.maxSize} (read-only)
     */ get maxSize() {
        return this.#maxSize;
    }
    /**
     * The total computed size of items in the cache (read-only)
     */ get calculatedSize() {
        return this.#calculatedSize;
    }
    /**
     * The number of items stored in the cache (read-only)
     */ get size() {
        return this.#size;
    }
    /**
     * {@link LRUCache.OptionsBase.fetchMethod} (read-only)
     */ get fetchMethod() {
        return this.#fetchMethod;
    }
    get memoMethod() {
        return this.#memoMethod;
    }
    /**
     * {@link LRUCache.OptionsBase.dispose} (read-only)
     */ get dispose() {
        return this.#dispose;
    }
    /**
     * {@link LRUCache.OptionsBase.disposeAfter} (read-only)
     */ get disposeAfter() {
        return this.#disposeAfter;
    }
    constructor(options){
        // conditionally set private methods related to TTL
        this.#updateItemAge = ()=>{};
        this.#statusTTL = ()=>{};
        this.#setItemTTL = ()=>{};
        /* c8 ignore stop */ this.#isStale = ()=>false;
        this.#removeItemSize = (_i)=>{};
        this.#addItemSize = (_i, _s, _st)=>{};
        this.#requireSize = (_k, _v, size, sizeCalculation)=>{
            if (size || sizeCalculation) {
                throw new TypeError("cannot set size without setting maxSize or maxEntrySize on cache");
            }
            return 0;
        };
        /**
     * A String value that is used in the creation of the default string
     * description of an object. Called by the built-in method
     * `Object.prototype.toString`.
     */ this[prop] = "LRUCache";
        const { max = 0, ttl, ttlResolution = 1, ttlAutopurge, updateAgeOnGet, updateAgeOnHas, allowStale, dispose, disposeAfter, noDisposeOnSet, noUpdateTTL, maxSize = 0, maxEntrySize = 0, sizeCalculation, fetchMethod, memoMethod, noDeleteOnFetchRejection, noDeleteOnStaleGet, allowStaleOnFetchRejection, allowStaleOnFetchAbort, ignoreFetchAbort } = options;
        if (max !== 0 && !isPosInt(max)) {
            throw new TypeError("max option must be a nonnegative integer");
        }
        const UintArray = max ? getUintArray(max) : Array;
        if (!UintArray) {
            throw new Error("invalid max value: " + max);
        }
        this.#max = max;
        this.#maxSize = maxSize;
        this.maxEntrySize = maxEntrySize || this.#maxSize;
        this.sizeCalculation = sizeCalculation;
        if (this.sizeCalculation) {
            if (!this.#maxSize && !this.maxEntrySize) {
                throw new TypeError("cannot set sizeCalculation without setting maxSize or maxEntrySize");
            }
            if (typeof this.sizeCalculation !== "function") {
                throw new TypeError("sizeCalculation set to non-function");
            }
        }
        if (memoMethod !== undefined && typeof memoMethod !== "function") {
            throw new TypeError("memoMethod must be a function if defined");
        }
        this.#memoMethod = memoMethod;
        if (fetchMethod !== undefined && typeof fetchMethod !== "function") {
            throw new TypeError("fetchMethod must be a function if specified");
        }
        this.#fetchMethod = fetchMethod;
        this.#hasFetchMethod = !!fetchMethod;
        this.#keyMap = new Map();
        this.#keyList = new Array(max).fill(undefined);
        this.#valList = new Array(max).fill(undefined);
        this.#next = new UintArray(max);
        this.#prev = new UintArray(max);
        this.#head = 0;
        this.#tail = 0;
        this.#free = Stack.create(max);
        this.#size = 0;
        this.#calculatedSize = 0;
        if (typeof dispose === "function") {
            this.#dispose = dispose;
        }
        if (typeof disposeAfter === "function") {
            this.#disposeAfter = disposeAfter;
            this.#disposed = [];
        } else {
            this.#disposeAfter = undefined;
            this.#disposed = undefined;
        }
        this.#hasDispose = !!this.#dispose;
        this.#hasDisposeAfter = !!this.#disposeAfter;
        this.noDisposeOnSet = !!noDisposeOnSet;
        this.noUpdateTTL = !!noUpdateTTL;
        this.noDeleteOnFetchRejection = !!noDeleteOnFetchRejection;
        this.allowStaleOnFetchRejection = !!allowStaleOnFetchRejection;
        this.allowStaleOnFetchAbort = !!allowStaleOnFetchAbort;
        this.ignoreFetchAbort = !!ignoreFetchAbort;
        // NB: maxEntrySize is set to maxSize if it's set
        if (this.maxEntrySize !== 0) {
            if (this.#maxSize !== 0) {
                if (!isPosInt(this.#maxSize)) {
                    throw new TypeError("maxSize must be a positive integer if specified");
                }
            }
            if (!isPosInt(this.maxEntrySize)) {
                throw new TypeError("maxEntrySize must be a positive integer if specified");
            }
            this.#initializeSizeTracking();
        }
        this.allowStale = !!allowStale;
        this.noDeleteOnStaleGet = !!noDeleteOnStaleGet;
        this.updateAgeOnGet = !!updateAgeOnGet;
        this.updateAgeOnHas = !!updateAgeOnHas;
        this.ttlResolution = isPosInt(ttlResolution) || ttlResolution === 0 ? ttlResolution : 1;
        this.ttlAutopurge = !!ttlAutopurge;
        this.ttl = ttl || 0;
        if (this.ttl) {
            if (!isPosInt(this.ttl)) {
                throw new TypeError("ttl must be a positive integer if specified");
            }
            this.#initializeTTLTracking();
        }
        // do not allow completely unbounded caches
        if (this.#max === 0 && this.ttl === 0 && this.#maxSize === 0) {
            throw new TypeError("At least one of max, maxSize, or ttl is required");
        }
        if (!this.ttlAutopurge && !this.#max && !this.#maxSize) {
            const code = "LRU_CACHE_UNBOUNDED";
            if (shouldWarn(code)) {
                warned.add(code);
                const msg = "TTL caching without ttlAutopurge, max, or maxSize can " + "result in unbounded memory consumption.";
                emitWarning(msg, "UnboundedCacheWarning", code, LRUCache);
            }
        }
    }
    /**
     * Return the number of ms left in the item's TTL. If item is not in cache,
     * returns `0`. Returns `Infinity` if item is in cache without a defined TTL.
     */ getRemainingTTL(key) {
        return this.#keyMap.has(key) ? Infinity : 0;
    }
    #initializeTTLTracking() {
        const ttls = new ZeroArray(this.#max);
        const starts = new ZeroArray(this.#max);
        this.#ttls = ttls;
        this.#starts = starts;
        this.#setItemTTL = (index, ttl, start = perf.now())=>{
            starts[index] = ttl !== 0 ? start : 0;
            ttls[index] = ttl;
            if (ttl !== 0 && this.ttlAutopurge) {
                const t = setTimeout(()=>{
                    if (this.#isStale(index)) {
                        this.#delete(this.#keyList[index], "expire");
                    }
                }, ttl + 1);
                // unref() not supported on all platforms
                /* c8 ignore start */ if (t.unref) {
                    t.unref();
                }
            /* c8 ignore stop */ }
        };
        this.#updateItemAge = (index)=>{
            starts[index] = ttls[index] !== 0 ? perf.now() : 0;
        };
        this.#statusTTL = (status, index)=>{
            if (ttls[index]) {
                const ttl = ttls[index];
                const start = starts[index];
                /* c8 ignore next */ if (!ttl || !start) return;
                status.ttl = ttl;
                status.start = start;
                status.now = cachedNow || getNow();
                const age = status.now - start;
                status.remainingTTL = ttl - age;
            }
        };
        // debounce calls to perf.now() to 1s so we're not hitting
        // that costly call repeatedly.
        let cachedNow = 0;
        const getNow = ()=>{
            const n = perf.now();
            if (this.ttlResolution > 0) {
                cachedNow = n;
                const t = setTimeout(()=>cachedNow = 0, this.ttlResolution);
                // not available on all platforms
                /* c8 ignore start */ if (t.unref) {
                    t.unref();
                }
            /* c8 ignore stop */ }
            return n;
        };
        this.getRemainingTTL = (key)=>{
            const index = this.#keyMap.get(key);
            if (index === undefined) {
                return 0;
            }
            const ttl = ttls[index];
            const start = starts[index];
            if (!ttl || !start) {
                return Infinity;
            }
            const age = (cachedNow || getNow()) - start;
            return ttl - age;
        };
        this.#isStale = (index)=>{
            const s = starts[index];
            const t = ttls[index];
            return !!t && !!s && (cachedNow || getNow()) - s > t;
        };
    }
    #updateItemAge;
    #statusTTL;
    #setItemTTL;
    #isStale;
    #initializeSizeTracking() {
        const sizes = new ZeroArray(this.#max);
        this.#calculatedSize = 0;
        this.#sizes = sizes;
        this.#removeItemSize = (index)=>{
            this.#calculatedSize -= sizes[index];
            sizes[index] = 0;
        };
        this.#requireSize = (k, v, size, sizeCalculation)=>{
            // provisionally accept background fetches.
            // actual value size will be checked when they return.
            if (this.#isBackgroundFetch(v)) {
                return 0;
            }
            if (!isPosInt(size)) {
                if (sizeCalculation) {
                    if (typeof sizeCalculation !== "function") {
                        throw new TypeError("sizeCalculation must be a function");
                    }
                    size = sizeCalculation(v, k);
                    if (!isPosInt(size)) {
                        throw new TypeError("sizeCalculation return invalid (expect positive integer)");
                    }
                } else {
                    throw new TypeError("invalid size value (must be positive integer). " + "When maxSize or maxEntrySize is used, sizeCalculation " + "or size must be set.");
                }
            }
            return size;
        };
        this.#addItemSize = (index, size, status)=>{
            sizes[index] = size;
            if (this.#maxSize) {
                const maxSize = this.#maxSize - sizes[index];
                while(this.#calculatedSize > maxSize){
                    this.#evict(true);
                }
            }
            this.#calculatedSize += sizes[index];
            if (status) {
                status.entrySize = size;
                status.totalCalculatedSize = this.#calculatedSize;
            }
        };
    }
    #removeItemSize;
    #addItemSize;
    #requireSize;
    *#indexes({ allowStale = this.allowStale } = {}) {
        if (this.#size) {
            for(let i = this.#tail; true;){
                if (!this.#isValidIndex(i)) {
                    break;
                }
                if (allowStale || !this.#isStale(i)) {
                    yield i;
                }
                if (i === this.#head) {
                    break;
                } else {
                    i = this.#prev[i];
                }
            }
        }
    }
    *#rindexes({ allowStale = this.allowStale } = {}) {
        if (this.#size) {
            for(let i = this.#head; true;){
                if (!this.#isValidIndex(i)) {
                    break;
                }
                if (allowStale || !this.#isStale(i)) {
                    yield i;
                }
                if (i === this.#tail) {
                    break;
                } else {
                    i = this.#next[i];
                }
            }
        }
    }
    #isValidIndex(index) {
        return index !== undefined && this.#keyMap.get(this.#keyList[index]) === index;
    }
    /**
     * Return a generator yielding `[key, value]` pairs,
     * in order from most recently used to least recently used.
     */ *entries() {
        for (const i of this.#indexes()){
            if (this.#valList[i] !== undefined && this.#keyList[i] !== undefined && !this.#isBackgroundFetch(this.#valList[i])) {
                yield [
                    this.#keyList[i],
                    this.#valList[i]
                ];
            }
        }
    }
    /**
     * Inverse order version of {@link LRUCache.entries}
     *
     * Return a generator yielding `[key, value]` pairs,
     * in order from least recently used to most recently used.
     */ *rentries() {
        for (const i of this.#rindexes()){
            if (this.#valList[i] !== undefined && this.#keyList[i] !== undefined && !this.#isBackgroundFetch(this.#valList[i])) {
                yield [
                    this.#keyList[i],
                    this.#valList[i]
                ];
            }
        }
    }
    /**
     * Return a generator yielding the keys in the cache,
     * in order from most recently used to least recently used.
     */ *keys() {
        for (const i of this.#indexes()){
            const k = this.#keyList[i];
            if (k !== undefined && !this.#isBackgroundFetch(this.#valList[i])) {
                yield k;
            }
        }
    }
    /**
     * Inverse order version of {@link LRUCache.keys}
     *
     * Return a generator yielding the keys in the cache,
     * in order from least recently used to most recently used.
     */ *rkeys() {
        for (const i of this.#rindexes()){
            const k = this.#keyList[i];
            if (k !== undefined && !this.#isBackgroundFetch(this.#valList[i])) {
                yield k;
            }
        }
    }
    /**
     * Return a generator yielding the values in the cache,
     * in order from most recently used to least recently used.
     */ *values() {
        for (const i of this.#indexes()){
            const v = this.#valList[i];
            if (v !== undefined && !this.#isBackgroundFetch(this.#valList[i])) {
                yield this.#valList[i];
            }
        }
    }
    /**
     * Inverse order version of {@link LRUCache.values}
     *
     * Return a generator yielding the values in the cache,
     * in order from least recently used to most recently used.
     */ *rvalues() {
        for (const i of this.#rindexes()){
            const v = this.#valList[i];
            if (v !== undefined && !this.#isBackgroundFetch(this.#valList[i])) {
                yield this.#valList[i];
            }
        }
    }
    /**
     * Iterating over the cache itself yields the same results as
     * {@link LRUCache.entries}
     */ [Symbol.iterator]() {
        return this.entries();
    }
    /**
     * Find a value for which the supplied fn method returns a truthy value,
     * similar to `Array.find()`. fn is called as `fn(value, key, cache)`.
     */ find(fn, getOptions = {}) {
        for (const i of this.#indexes()){
            const v = this.#valList[i];
            const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
            if (value === undefined) continue;
            if (fn(value, this.#keyList[i], this)) {
                return this.get(this.#keyList[i], getOptions);
            }
        }
    }
    /**
     * Call the supplied function on each item in the cache, in order from most
     * recently used to least recently used.
     *
     * `fn` is called as `fn(value, key, cache)`.
     *
     * If `thisp` is provided, function will be called in the `this`-context of
     * the provided object, or the cache if no `thisp` object is provided.
     *
     * Does not update age or recenty of use, or iterate over stale values.
     */ forEach(fn, thisp = this) {
        for (const i of this.#indexes()){
            const v = this.#valList[i];
            const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
            if (value === undefined) continue;
            fn.call(thisp, value, this.#keyList[i], this);
        }
    }
    /**
     * The same as {@link LRUCache.forEach} but items are iterated over in
     * reverse order.  (ie, less recently used items are iterated over first.)
     */ rforEach(fn, thisp = this) {
        for (const i of this.#rindexes()){
            const v = this.#valList[i];
            const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
            if (value === undefined) continue;
            fn.call(thisp, value, this.#keyList[i], this);
        }
    }
    /**
     * Delete any stale entries. Returns true if anything was removed,
     * false otherwise.
     */ purgeStale() {
        let deleted = false;
        for (const i of this.#rindexes({
            allowStale: true
        })){
            if (this.#isStale(i)) {
                this.#delete(this.#keyList[i], "expire");
                deleted = true;
            }
        }
        return deleted;
    }
    /**
     * Get the extended info about a given entry, to get its value, size, and
     * TTL info simultaneously. Returns `undefined` if the key is not present.
     *
     * Unlike {@link LRUCache#dump}, which is designed to be portable and survive
     * serialization, the `start` value is always the current timestamp, and the
     * `ttl` is a calculated remaining time to live (negative if expired).
     *
     * Always returns stale values, if their info is found in the cache, so be
     * sure to check for expirations (ie, a negative {@link LRUCache.Entry#ttl})
     * if relevant.
     */ info(key) {
        const i = this.#keyMap.get(key);
        if (i === undefined) return undefined;
        const v = this.#valList[i];
        const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
        if (value === undefined) return undefined;
        const entry = {
            value
        };
        if (this.#ttls && this.#starts) {
            const ttl = this.#ttls[i];
            const start = this.#starts[i];
            if (ttl && start) {
                const remain = ttl - (perf.now() - start);
                entry.ttl = remain;
                entry.start = Date.now();
            }
        }
        if (this.#sizes) {
            entry.size = this.#sizes[i];
        }
        return entry;
    }
    /**
     * Return an array of [key, {@link LRUCache.Entry}] tuples which can be
     * passed to {@link LRLUCache#load}.
     *
     * The `start` fields are calculated relative to a portable `Date.now()`
     * timestamp, even if `performance.now()` is available.
     *
     * Stale entries are always included in the `dump`, even if
     * {@link LRUCache.OptionsBase.allowStale} is false.
     *
     * Note: this returns an actual array, not a generator, so it can be more
     * easily passed around.
     */ dump() {
        const arr = [];
        for (const i of this.#indexes({
            allowStale: true
        })){
            const key = this.#keyList[i];
            const v = this.#valList[i];
            const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
            if (value === undefined || key === undefined) continue;
            const entry = {
                value
            };
            if (this.#ttls && this.#starts) {
                entry.ttl = this.#ttls[i];
                // always dump the start relative to a portable timestamp
                // it's ok for this to be a bit slow, it's a rare operation.
                const age = perf.now() - this.#starts[i];
                entry.start = Math.floor(Date.now() - age);
            }
            if (this.#sizes) {
                entry.size = this.#sizes[i];
            }
            arr.unshift([
                key,
                entry
            ]);
        }
        return arr;
    }
    /**
     * Reset the cache and load in the items in entries in the order listed.
     *
     * The shape of the resulting cache may be different if the same options are
     * not used in both caches.
     *
     * The `start` fields are assumed to be calculated relative to a portable
     * `Date.now()` timestamp, even if `performance.now()` is available.
     */ load(arr) {
        this.clear();
        for (const [key, entry] of arr){
            if (entry.start) {
                // entry.start is a portable timestamp, but we may be using
                // node's performance.now(), so calculate the offset, so that
                // we get the intended remaining TTL, no matter how long it's
                // been on ice.
                //
                // it's ok for this to be a bit slow, it's a rare operation.
                const age = Date.now() - entry.start;
                entry.start = perf.now() - age;
            }
            this.set(key, entry.value, entry);
        }
    }
    /**
     * Add a value to the cache.
     *
     * Note: if `undefined` is specified as a value, this is an alias for
     * {@link LRUCache#delete}
     *
     * Fields on the {@link LRUCache.SetOptions} options param will override
     * their corresponding values in the constructor options for the scope
     * of this single `set()` operation.
     *
     * If `start` is provided, then that will set the effective start
     * time for the TTL calculation. Note that this must be a previous
     * value of `performance.now()` if supported, or a previous value of
     * `Date.now()` if not.
     *
     * Options object may also include `size`, which will prevent
     * calling the `sizeCalculation` function and just use the specified
     * number if it is a positive integer, and `noDisposeOnSet` which
     * will prevent calling a `dispose` function in the case of
     * overwrites.
     *
     * If the `size` (or return value of `sizeCalculation`) for a given
     * entry is greater than `maxEntrySize`, then the item will not be
     * added to the cache.
     *
     * Will update the recency of the entry.
     *
     * If the value is `undefined`, then this is an alias for
     * `cache.delete(key)`. `undefined` is never stored in the cache.
     */ set(k, v, setOptions = {}) {
        if (v === undefined) {
            this.delete(k);
            return this;
        }
        const { ttl = this.ttl, start, noDisposeOnSet = this.noDisposeOnSet, sizeCalculation = this.sizeCalculation, status } = setOptions;
        let { noUpdateTTL = this.noUpdateTTL } = setOptions;
        const size = this.#requireSize(k, v, setOptions.size || 0, sizeCalculation);
        // if the item doesn't fit, don't do anything
        // NB: maxEntrySize set to maxSize by default
        if (this.maxEntrySize && size > this.maxEntrySize) {
            if (status) {
                status.set = "miss";
                status.maxEntrySizeExceeded = true;
            }
            // have to delete, in case something is there already.
            this.#delete(k, "set");
            return this;
        }
        let index = this.#size === 0 ? undefined : this.#keyMap.get(k);
        if (index === undefined) {
            // addition
            index = this.#size === 0 ? this.#tail : this.#free.length !== 0 ? this.#free.pop() : this.#size === this.#max ? this.#evict(false) : this.#size;
            this.#keyList[index] = k;
            this.#valList[index] = v;
            this.#keyMap.set(k, index);
            this.#next[this.#tail] = index;
            this.#prev[index] = this.#tail;
            this.#tail = index;
            this.#size++;
            this.#addItemSize(index, size, status);
            if (status) status.set = "add";
            noUpdateTTL = false;
        } else {
            // update
            this.#moveToTail(index);
            const oldVal = this.#valList[index];
            if (v !== oldVal) {
                if (this.#hasFetchMethod && this.#isBackgroundFetch(oldVal)) {
                    oldVal.__abortController.abort(new Error("replaced"));
                    const { __staleWhileFetching: s } = oldVal;
                    if (s !== undefined && !noDisposeOnSet) {
                        if (this.#hasDispose) {
                            this.#dispose?.(s, k, "set");
                        }
                        if (this.#hasDisposeAfter) {
                            this.#disposed?.push([
                                s,
                                k,
                                "set"
                            ]);
                        }
                    }
                } else if (!noDisposeOnSet) {
                    if (this.#hasDispose) {
                        this.#dispose?.(oldVal, k, "set");
                    }
                    if (this.#hasDisposeAfter) {
                        this.#disposed?.push([
                            oldVal,
                            k,
                            "set"
                        ]);
                    }
                }
                this.#removeItemSize(index);
                this.#addItemSize(index, size, status);
                this.#valList[index] = v;
                if (status) {
                    status.set = "replace";
                    const oldValue = oldVal && this.#isBackgroundFetch(oldVal) ? oldVal.__staleWhileFetching : oldVal;
                    if (oldValue !== undefined) status.oldValue = oldValue;
                }
            } else if (status) {
                status.set = "update";
            }
        }
        if (ttl !== 0 && !this.#ttls) {
            this.#initializeTTLTracking();
        }
        if (this.#ttls) {
            if (!noUpdateTTL) {
                this.#setItemTTL(index, ttl, start);
            }
            if (status) this.#statusTTL(status, index);
        }
        if (!noDisposeOnSet && this.#hasDisposeAfter && this.#disposed) {
            const dt = this.#disposed;
            let task;
            while(task = dt?.shift()){
                this.#disposeAfter?.(...task);
            }
        }
        return this;
    }
    /**
     * Evict the least recently used item, returning its value or
     * `undefined` if cache is empty.
     */ pop() {
        try {
            while(this.#size){
                const val = this.#valList[this.#head];
                this.#evict(true);
                if (this.#isBackgroundFetch(val)) {
                    if (val.__staleWhileFetching) {
                        return val.__staleWhileFetching;
                    }
                } else if (val !== undefined) {
                    return val;
                }
            }
        } finally{
            if (this.#hasDisposeAfter && this.#disposed) {
                const dt = this.#disposed;
                let task;
                while(task = dt?.shift()){
                    this.#disposeAfter?.(...task);
                }
            }
        }
    }
    #evict(free) {
        const head = this.#head;
        const k = this.#keyList[head];
        const v = this.#valList[head];
        if (this.#hasFetchMethod && this.#isBackgroundFetch(v)) {
            v.__abortController.abort(new Error("evicted"));
        } else if (this.#hasDispose || this.#hasDisposeAfter) {
            if (this.#hasDispose) {
                this.#dispose?.(v, k, "evict");
            }
            if (this.#hasDisposeAfter) {
                this.#disposed?.push([
                    v,
                    k,
                    "evict"
                ]);
            }
        }
        this.#removeItemSize(head);
        // if we aren't about to use the index, then null these out
        if (free) {
            this.#keyList[head] = undefined;
            this.#valList[head] = undefined;
            this.#free.push(head);
        }
        if (this.#size === 1) {
            this.#head = this.#tail = 0;
            this.#free.length = 0;
        } else {
            this.#head = this.#next[head];
        }
        this.#keyMap.delete(k);
        this.#size--;
        return head;
    }
    /**
     * Check if a key is in the cache, without updating the recency of use.
     * Will return false if the item is stale, even though it is technically
     * in the cache.
     *
     * Check if a key is in the cache, without updating the recency of
     * use. Age is updated if {@link LRUCache.OptionsBase.updateAgeOnHas} is set
     * to `true` in either the options or the constructor.
     *
     * Will return `false` if the item is stale, even though it is technically in
     * the cache. The difference can be determined (if it matters) by using a
     * `status` argument, and inspecting the `has` field.
     *
     * Will not update item age unless
     * {@link LRUCache.OptionsBase.updateAgeOnHas} is set.
     */ has(k, hasOptions = {}) {
        const { updateAgeOnHas = this.updateAgeOnHas, status } = hasOptions;
        const index = this.#keyMap.get(k);
        if (index !== undefined) {
            const v = this.#valList[index];
            if (this.#isBackgroundFetch(v) && v.__staleWhileFetching === undefined) {
                return false;
            }
            if (!this.#isStale(index)) {
                if (updateAgeOnHas) {
                    this.#updateItemAge(index);
                }
                if (status) {
                    status.has = "hit";
                    this.#statusTTL(status, index);
                }
                return true;
            } else if (status) {
                status.has = "stale";
                this.#statusTTL(status, index);
            }
        } else if (status) {
            status.has = "miss";
        }
        return false;
    }
    /**
     * Like {@link LRUCache#get} but doesn't update recency or delete stale
     * items.
     *
     * Returns `undefined` if the item is stale, unless
     * {@link LRUCache.OptionsBase.allowStale} is set.
     */ peek(k, peekOptions = {}) {
        const { allowStale = this.allowStale } = peekOptions;
        const index = this.#keyMap.get(k);
        if (index === undefined || !allowStale && this.#isStale(index)) {
            return;
        }
        const v = this.#valList[index];
        // either stale and allowed, or forcing a refresh of non-stale value
        return this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
    }
    #backgroundFetch(k, index, options, context) {
        const v = index === undefined ? undefined : this.#valList[index];
        if (this.#isBackgroundFetch(v)) {
            return v;
        }
        const ac = new AC();
        const { signal } = options;
        // when/if our AC signals, then stop listening to theirs.
        signal?.addEventListener("abort", ()=>ac.abort(signal.reason), {
            signal: ac.signal
        });
        const fetchOpts = {
            signal: ac.signal,
            options,
            context
        };
        const cb = (v, updateCache = false)=>{
            const { aborted } = ac.signal;
            const ignoreAbort = options.ignoreFetchAbort && v !== undefined;
            if (options.status) {
                if (aborted && !updateCache) {
                    options.status.fetchAborted = true;
                    options.status.fetchError = ac.signal.reason;
                    if (ignoreAbort) options.status.fetchAbortIgnored = true;
                } else {
                    options.status.fetchResolved = true;
                }
            }
            if (aborted && !ignoreAbort && !updateCache) {
                return fetchFail(ac.signal.reason);
            }
            // either we didn't abort, and are still here, or we did, and ignored
            const bf = p;
            if (this.#valList[index] === p) {
                if (v === undefined) {
                    if (bf.__staleWhileFetching) {
                        this.#valList[index] = bf.__staleWhileFetching;
                    } else {
                        this.#delete(k, "fetch");
                    }
                } else {
                    if (options.status) options.status.fetchUpdated = true;
                    this.set(k, v, fetchOpts.options);
                }
            }
            return v;
        };
        const eb = (er)=>{
            if (options.status) {
                options.status.fetchRejected = true;
                options.status.fetchError = er;
            }
            return fetchFail(er);
        };
        const fetchFail = (er)=>{
            const { aborted } = ac.signal;
            const allowStaleAborted = aborted && options.allowStaleOnFetchAbort;
            const allowStale = allowStaleAborted || options.allowStaleOnFetchRejection;
            const noDelete = allowStale || options.noDeleteOnFetchRejection;
            const bf = p;
            if (this.#valList[index] === p) {
                // if we allow stale on fetch rejections, then we need to ensure that
                // the stale value is not removed from the cache when the fetch fails.
                const del = !noDelete || bf.__staleWhileFetching === undefined;
                if (del) {
                    this.#delete(k, "fetch");
                } else if (!allowStaleAborted) {
                    // still replace the *promise* with the stale value,
                    // since we are done with the promise at this point.
                    // leave it untouched if we're still waiting for an
                    // aborted background fetch that hasn't yet returned.
                    this.#valList[index] = bf.__staleWhileFetching;
                }
            }
            if (allowStale) {
                if (options.status && bf.__staleWhileFetching !== undefined) {
                    options.status.returnedStale = true;
                }
                return bf.__staleWhileFetching;
            } else if (bf.__returned === bf) {
                throw er;
            }
        };
        const pcall = (res, rej)=>{
            const fmp = this.#fetchMethod?.(k, v, fetchOpts);
            if (fmp && fmp instanceof Promise) {
                fmp.then((v)=>res(v === undefined ? undefined : v), rej);
            }
            // ignored, we go until we finish, regardless.
            // defer check until we are actually aborting,
            // so fetchMethod can override.
            ac.signal.addEventListener("abort", ()=>{
                if (!options.ignoreFetchAbort || options.allowStaleOnFetchAbort) {
                    res(undefined);
                    // when it eventually resolves, update the cache.
                    if (options.allowStaleOnFetchAbort) {
                        res = (v)=>cb(v, true);
                    }
                }
            });
        };
        if (options.status) options.status.fetchDispatched = true;
        const p = new Promise(pcall).then(cb, eb);
        const bf = Object.assign(p, {
            __abortController: ac,
            __staleWhileFetching: v,
            __returned: undefined
        });
        if (index === undefined) {
            // internal, don't expose status.
            this.set(k, bf, {
                ...fetchOpts.options,
                status: undefined
            });
            index = this.#keyMap.get(k);
        } else {
            this.#valList[index] = bf;
        }
        return bf;
    }
    #isBackgroundFetch(p) {
        if (!this.#hasFetchMethod) return false;
        const b = p;
        return !!b && b instanceof Promise && b.hasOwnProperty("__staleWhileFetching") && b.__abortController instanceof AC;
    }
    async fetch(k, fetchOptions = {}) {
        const { // get options
        allowStale = this.allowStale, updateAgeOnGet = this.updateAgeOnGet, noDeleteOnStaleGet = this.noDeleteOnStaleGet, // set options
        ttl = this.ttl, noDisposeOnSet = this.noDisposeOnSet, size = 0, sizeCalculation = this.sizeCalculation, noUpdateTTL = this.noUpdateTTL, // fetch exclusive options
        noDeleteOnFetchRejection = this.noDeleteOnFetchRejection, allowStaleOnFetchRejection = this.allowStaleOnFetchRejection, ignoreFetchAbort = this.ignoreFetchAbort, allowStaleOnFetchAbort = this.allowStaleOnFetchAbort, context, forceRefresh = false, status, signal } = fetchOptions;
        if (!this.#hasFetchMethod) {
            if (status) status.fetch = "get";
            return this.get(k, {
                allowStale,
                updateAgeOnGet,
                noDeleteOnStaleGet,
                status
            });
        }
        const options = {
            allowStale,
            updateAgeOnGet,
            noDeleteOnStaleGet,
            ttl,
            noDisposeOnSet,
            size,
            sizeCalculation,
            noUpdateTTL,
            noDeleteOnFetchRejection,
            allowStaleOnFetchRejection,
            allowStaleOnFetchAbort,
            ignoreFetchAbort,
            status,
            signal
        };
        let index = this.#keyMap.get(k);
        if (index === undefined) {
            if (status) status.fetch = "miss";
            const p = this.#backgroundFetch(k, index, options, context);
            return p.__returned = p;
        } else {
            // in cache, maybe already fetching
            const v = this.#valList[index];
            if (this.#isBackgroundFetch(v)) {
                const stale = allowStale && v.__staleWhileFetching !== undefined;
                if (status) {
                    status.fetch = "inflight";
                    if (stale) status.returnedStale = true;
                }
                return stale ? v.__staleWhileFetching : v.__returned = v;
            }
            // if we force a refresh, that means do NOT serve the cached value,
            // unless we are already in the process of refreshing the cache.
            const isStale = this.#isStale(index);
            if (!forceRefresh && !isStale) {
                if (status) status.fetch = "hit";
                this.#moveToTail(index);
                if (updateAgeOnGet) {
                    this.#updateItemAge(index);
                }
                if (status) this.#statusTTL(status, index);
                return v;
            }
            // ok, it is stale or a forced refresh, and not already fetching.
            // refresh the cache.
            const p = this.#backgroundFetch(k, index, options, context);
            const hasStale = p.__staleWhileFetching !== undefined;
            const staleVal = hasStale && allowStale;
            if (status) {
                status.fetch = isStale ? "stale" : "refresh";
                if (staleVal && isStale) status.returnedStale = true;
            }
            return staleVal ? p.__staleWhileFetching : p.__returned = p;
        }
    }
    async forceFetch(k, fetchOptions = {}) {
        const v = await this.fetch(k, fetchOptions);
        if (v === undefined) throw new Error("fetch() returned undefined");
        return v;
    }
    memo(k, memoOptions = {}) {
        const memoMethod = this.#memoMethod;
        if (!memoMethod) {
            throw new Error("no memoMethod provided to constructor");
        }
        const { context, forceRefresh, ...options } = memoOptions;
        const v = this.get(k, options);
        if (!forceRefresh && v !== undefined) return v;
        const vv = memoMethod(k, v, {
            options,
            context
        });
        this.set(k, vv, options);
        return vv;
    }
    /**
     * Return a value from the cache. Will update the recency of the cache
     * entry found.
     *
     * If the key is not found, get() will return `undefined`.
     */ get(k, getOptions = {}) {
        const { allowStale = this.allowStale, updateAgeOnGet = this.updateAgeOnGet, noDeleteOnStaleGet = this.noDeleteOnStaleGet, status } = getOptions;
        const index = this.#keyMap.get(k);
        if (index !== undefined) {
            const value = this.#valList[index];
            const fetching = this.#isBackgroundFetch(value);
            if (status) this.#statusTTL(status, index);
            if (this.#isStale(index)) {
                if (status) status.get = "stale";
                // delete only if not an in-flight background fetch
                if (!fetching) {
                    if (!noDeleteOnStaleGet) {
                        this.#delete(k, "expire");
                    }
                    if (status && allowStale) status.returnedStale = true;
                    return allowStale ? value : undefined;
                } else {
                    if (status && allowStale && value.__staleWhileFetching !== undefined) {
                        status.returnedStale = true;
                    }
                    return allowStale ? value.__staleWhileFetching : undefined;
                }
            } else {
                if (status) status.get = "hit";
                // if we're currently fetching it, we don't actually have it yet
                // it's not stale, which means this isn't a staleWhileRefetching.
                // If it's not stale, and fetching, AND has a __staleWhileFetching
                // value, then that means the user fetched with {forceRefresh:true},
                // so it's safe to return that value.
                if (fetching) {
                    return value.__staleWhileFetching;
                }
                this.#moveToTail(index);
                if (updateAgeOnGet) {
                    this.#updateItemAge(index);
                }
                return value;
            }
        } else if (status) {
            status.get = "miss";
        }
    }
    #connect(p, n) {
        this.#prev[n] = p;
        this.#next[p] = n;
    }
    #moveToTail(index) {
        // if tail already, nothing to do
        // if head, move head to next[index]
        // else
        //   move next[prev[index]] to next[index] (head has no prev)
        //   move prev[next[index]] to prev[index]
        // prev[index] = tail
        // next[tail] = index
        // tail = index
        if (index !== this.#tail) {
            if (index === this.#head) {
                this.#head = this.#next[index];
            } else {
                this.#connect(this.#prev[index], this.#next[index]);
            }
            this.#connect(this.#tail, index);
            this.#tail = index;
        }
    }
    /**
     * Deletes a key out of the cache.
     *
     * Returns true if the key was deleted, false otherwise.
     */ delete(k) {
        return this.#delete(k, "delete");
    }
    #delete(k, reason) {
        let deleted = false;
        if (this.#size !== 0) {
            const index = this.#keyMap.get(k);
            if (index !== undefined) {
                deleted = true;
                if (this.#size === 1) {
                    this.#clear(reason);
                } else {
                    this.#removeItemSize(index);
                    const v = this.#valList[index];
                    if (this.#isBackgroundFetch(v)) {
                        v.__abortController.abort(new Error("deleted"));
                    } else if (this.#hasDispose || this.#hasDisposeAfter) {
                        if (this.#hasDispose) {
                            this.#dispose?.(v, k, reason);
                        }
                        if (this.#hasDisposeAfter) {
                            this.#disposed?.push([
                                v,
                                k,
                                reason
                            ]);
                        }
                    }
                    this.#keyMap.delete(k);
                    this.#keyList[index] = undefined;
                    this.#valList[index] = undefined;
                    if (index === this.#tail) {
                        this.#tail = this.#prev[index];
                    } else if (index === this.#head) {
                        this.#head = this.#next[index];
                    } else {
                        const pi = this.#prev[index];
                        this.#next[pi] = this.#next[index];
                        const ni = this.#next[index];
                        this.#prev[ni] = this.#prev[index];
                    }
                    this.#size--;
                    this.#free.push(index);
                }
            }
        }
        if (this.#hasDisposeAfter && this.#disposed?.length) {
            const dt = this.#disposed;
            let task;
            while(task = dt?.shift()){
                this.#disposeAfter?.(...task);
            }
        }
        return deleted;
    }
    /**
     * Clear the cache entirely, throwing away all values.
     */ clear() {
        return this.#clear("delete");
    }
    #clear(reason) {
        for (const index of this.#rindexes({
            allowStale: true
        })){
            const v = this.#valList[index];
            if (this.#isBackgroundFetch(v)) {
                v.__abortController.abort(new Error("deleted"));
            } else {
                const k = this.#keyList[index];
                if (this.#hasDispose) {
                    this.#dispose?.(v, k, reason);
                }
                if (this.#hasDisposeAfter) {
                    this.#disposed?.push([
                        v,
                        k,
                        reason
                    ]);
                }
            }
        }
        this.#keyMap.clear();
        this.#valList.fill(undefined);
        this.#keyList.fill(undefined);
        if (this.#ttls && this.#starts) {
            this.#ttls.fill(0);
            this.#starts.fill(0);
        }
        if (this.#sizes) {
            this.#sizes.fill(0);
        }
        this.#head = 0;
        this.#tail = 0;
        this.#free.length = 0;
        this.#calculatedSize = 0;
        this.#size = 0;
        if (this.#hasDisposeAfter && this.#disposed) {
            const dt = this.#disposed;
            let task;
            while(task = dt?.shift()){
                this.#disposeAfter?.(...task);
            }
        }
    }
}
exports.LRUCache = LRUCache; //# sourceMappingURL=index.js.map


/***/ })

};
;