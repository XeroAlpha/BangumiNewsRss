const got = require("got").default;
const cheerio = require("cheerio");
const tough = require("tough-cookie");
const nodeUrl = require("url");

async function fetchAsDOM(client, url) {
    return cheerio.load((await client.get(url, { responseType: "text" })));
}

async function fetchCSRFToken(client, url) {
    const dom$ = await fetchAsDOM(client, url);
    return dom$("meta[name=csrf-token]").attr("content");
}

exports.login = async function(url, user, pass) {
    const cookieJar = new tough.CookieJar();
    const pageClient = got.extend({
        prefixUrl: url,
        timeout: 10000,
        resolveBodyOnly: true,
        cookieJar,
        // agent: { // only for test
        //     http: require("tunnel").httpOverHttp({ proxy: { host: "127.0.0.1", port: 8080 } })
        // }
    });
    const client = pageClient.extend({ responseType: "json" });
    const csrfToken = await fetchCSRFToken(pageClient, "./users/sign_in");
    await pageClient.post("./users/sign_in", {
        json: {
            "authenticity_token": csrfToken,
            "user": {
                "login": user,
                "password": pass,
                "remember_me": 0
            },
            "commit": "Log in"
        },
        followRedirect: false
    });
    return {
        client,
        pageClient,
        relativeToURL: (relative) => new URL(relative, url),
        fetchCSRFToken: fetchCSRFToken.bind(null, pageClient)
    };
}

const pagination = {
    paginate: (response, allItems, currentItems) => {
        const previousSearchParams = response.request.options.searchParams || new nodeUrl.URLSearchParams();
        const previousPageIndex = previousSearchParams.get("page") || 1;
        const itemCountLimit = previousSearchParams.get("limit") || Infinity; // Huginn doesn't use it
        if (currentItems.length == 0 || allItems.length >= itemCountLimit) {
            return false;
        }
        return {
            searchParams: {
                ...previousSearchParams,
                page: Number(previousPageIndex) + 1
            }
        };
    }
};

exports.Agent = {
    list: async function(credential, options) {
        return await credential.client.paginate.all("./agents", { searchParams: options, pagination });
    },
    postManualEvent: async function(credential, id, payload) {
        const csrfToken = await credential.fetchCSRFToken("./agents");
        return await credential.client.post(`./agents/${id}/handle_details_post`, {
            json: {
                authenticity_token: csrfToken,
                payload
            }
        });
    },
    run: async function(credential, id) {
        const csrfToken = await credential.fetchCSRFToken("./agents");
        return await credential.client.post(`./agents/${id}/run`, {
            json: {
                authenticity_token: csrfToken
            }
        });
    },
    getTypeDetails: async function(credential, agentType) {
        return await credential.client.get("./agents/type_details", { searchParams: { type: agentType } });
    },
    getEventDescription: async function(credential, agentIds) {
        return await credential.client.get("./agents/event_descriptions", { searchParams: { ids: agentIds.json(",") } });
    },
    reemitEvents: async function(credential, id, deleteOldEvents) {
        const csrfToken = await credential.fetchCSRFToken("./agents");
        return await credential.client.post(`./agents/${id}/reemit_events`, {
            json: {
                authenticity_token: csrfToken,
                commit: "Re-emit all events",
                delete_old_events: deleteOldEvents ? 1 : 0
            }
        });
    },
    removeEvents: async function(credential, id) {
        const csrfToken = await credential.fetchCSRFToken("./agents");
        return await credential.client.delete(`./agents/${id}/remove_events`, {
            json: {
                authenticity_token: csrfToken
            }
        });
    },
    propagateEvents: async function(credential) {
        const csrfToken = await credential.fetchCSRFToken("./agents");
        return await credential.client.post("./agents/propagate", {
            json: {
                authenticity_token: csrfToken
            }
        });
    },
    clearMemory: async function(credential, id) {
        const csrfToken = await credential.fetchCSRFToken("./agents");
        return await credential.client.delete(`./agents/${id}/memory`, {
            json: {
                authenticity_token: csrfToken
            }
        });
    },
    get: async function(credential, id) {
        return await credential.client.get(`./agents/${id}`);
    },
    getDefault: async function(credential) {
        return await credential.client.post("./agents/new");
    },
    create: async function(credential, data) {
        const csrfToken = await credential.fetchCSRFToken("./agents");
        return await credential.client.post("./agents", {
            json: {
                authenticity_token: csrfToken,
                agent: data,
                commit: "Save"
            }
        });
    },
    update: async function(credential, id, data) {
        const csrfToken = await credential.fetchCSRFToken("./agents");
        return await credential.client.put(`./agents/${id}`, {
            json: {
                authenticity_token: csrfToken,
                agent: data,
                commit: "Save"
            }
        });
    },
    remove: async function(credential, id) {
        const csrfToken = await credential.fetchCSRFToken("./agents");
        return await credential.client.delete(`./agents/${id}`, {
            json: {
                authenticity_token: csrfToken
            }
        });
    },
    getAgentDetailURL: function(credential, id) {
        return credential.relativeToURL(`./agents/${id}`);
    },
    dryRun: async function(credential, data, inEvent) {
        const csrfToken = await credential.fetchCSRFToken("./agents/new");
        const resultHTML = await credential.pageClient.post("./dry_runs", {
            searchParams: { type: data.type },
            json: {
                authenticity_token: csrfToken,
                event: JSON.stringify(inEvent),
                agent: data
            }
        });
        const resultDOM = cheerio.load(resultHTML, null, false);
        return {
            outEvents: JSON.parse(resultDOM(".agent-dry-run-events").text()),
            logs: resultDOM(".agent-dry-run-log").text(),
            memory: JSON.parse(resultDOM(".agent-dry-run-memory").text())
        };
    }
}

exports.Scenario = {
    list: async function(credential, options) {
        return await credential.client.paginate.all("./scenarios", { searchParams: options, pagination });
    },
    getDefault: async function(credential) {
        return await credential.client.post("./scenarios/new");
    },
    get: async function(credential, id) {
        return await credential.client.get(`./scenarios/${id}`);
    },
    export: async function(credential, id) {
        return await credential.client.get(`./scenarios/${id}/export`);
    },
    create: async function(credential, data) {
        const csrfToken = await credential.fetchCSRFToken("./scenarios");
        return await credential.client.post("./scenarios", {
            json: {
                authenticity_token: csrfToken,
                scenario: data,
                commit: "Save"
            }
        });
    },
    update: async function(credential, id, data) {
        const csrfToken = await credential.fetchCSRFToken("./scenarios");
        return await credential.client.put(`./scenarios/${id}`, {
            json: {
                authenticity_token: csrfToken,
                scenario: data,
                commit: "Save"
            }
        });
    },
    remove: async function(credential, id) {
        const csrfToken = await credential.fetchCSRFToken("./scenarios");
        return await credential.client.delete(`./scenarios/${id}`, {
            json: {
                authenticity_token: csrfToken
            }
        });
    }
}

exports.listEvents = async function(credential, options) {
    return await credential.client.paginate.all("./events", { searchParams: options, pagination });
}

exports.listJobs = async function(credential, options) {
    return await credential.client.paginate.all("./jobs", { searchParams: options, pagination });
}

exports.getWorkerStatus = async function(credential, options) {
    return await credential.client.get("./worker_status", { searchParams: options });
}