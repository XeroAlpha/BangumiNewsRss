const fs = require("fs");
const nodePath = require("path");
const api = require("./api");
const JsonUtil = require("./json");
const Liquid = require("liquidjs").Liquid;

async function arrayForEach(arr, f, thisArg) {
    let i, count = arr.length;
    for (i = 0; i < count; i++) {
        await f.call(thisArg, arr[i], i, arr);
    }
}

/* 一些示例：
1.  { id: "div#id" }
 => { 
        extract: {
            id: {
                css: "div#id",
                value: "paramDefinition.xpath.id"
            }
        }
    }

2.  { category: "span.categoryName" }
 => {
        extract: {
            category: {
                css: "span.categoryName",
                value: "paramDefinition.xpath.default"
            }
        }
    }

3.  { title: { css: "meta[name=title]", value: "@content" } }
 => {
        extract: {
            category: {
                css: "meta[name=title]",
                value: "@content"
            }
        }
    }

4.  { dateTemplate: "{{year}}.{{day}}" }
 => {
        template: {
            date: "{{year}}.{{day}}"
        }
    }

5.  { url: ["a.pagelink", "https://example.com/{{url}}"] }
 => {
        extract: {
            url: {
                css: "a.pagelink",
                value: "paramDefinition.xpath.url",
                hidden: true
            }
        },
        template: {
            url: "https://example.com/{{url}}"
        }
    }

6.  { date: [{ year: "span.year", day: "span.day" }, "{{year}}.{{day}}"] }
 => {
        extract: {
            year: {
                css: "span.year",
                value: "paramDefinition.xpath.default",
                hidden: true
            },
            day: {
                css: "span.day",
                value: "paramDefinition.xpath.default",
                hidden: true
            }
        },
        template: {
            date: "{{year}}.{{day}}"
        }
    }
*/
function generateWebsiteAgentOptions(params, paramDefinition, docFormat) {
    const templateSuffix = "Template";
    const keys = Object.keys(params);
    const getValueXPath = (key, preferredTemplate) => {
        let kvSet = paramDefinition.xpath;
        return kvSet[preferredTemplate] || kvSet[key] || kvSet["default"];
    };
    let extract = {}, template = {};
    keys.forEach(key => {
        const val = params[key];
        if (key.endsWith(templateSuffix)) {
            const fieldName =  key.slice(0, -templateSuffix.length);
            if (typeof val == "string") {
                template[fieldName] = val;
            }
        } else {
            if (Array.isArray(val)) {
                let convertedParam, mergingExtract;
                if (typeof val[0] == "string") {
                    convertedParam = { [key]: val[0] };
                } else {
                    convertedParam = val[0];
                }
                mergingExtract = generateWebsiteAgentOptions(convertedParam, paramDefinition, docFormat).extract || {};
                Object.keys(mergingExtract).forEach(mergingKey => {
                    extract[mergingKey] = {
                        ...mergingExtract[mergingKey],
                        hidden: true
                    };
                });
                template[key] = val[1];
            } else if (typeof val == "object") {
                if (docFormat == "text") {
                    if (!("index" in val)) {
                        val.index = 1;
                    }
                } else if (docFormat != "json") {
                    if (!("value" in val)) {
                        val.value = getValueXPath(key, val.template);
                    }
                }
                extract[key] = val;
            } else if (typeof val == "string") {
                if (docFormat == "json") {
                    extract[key] = { path: val };
                } else if (docFormat == "text") {
                    extract[key] = { regexp: val, index: 1 };
                } else {
                    extract[key] = {
                        css: val, value: getValueXPath(key, "")
                    };
                }
            }
        }
    });
    return { extract, template };
}

// url 直接作为值使用，urlEncoded 用于拼接 JSON
function transformToPhantomJsCloudUrlIfNeeded(options, type, url, urlEncoded) {
    const URLStub = "__URL_OBJECT_STUB__";
    const URLStubEncoded = "%22__URL_OBJECT_STUB__%22";
    if (!urlEncoded) urlEncoded = encodeURIComponent(JSON.stringify(url));
    if (options.phantomJsCloud && options.phantomJsCloud[type]) {
        let request = {
            url: URLStub,
            renderType: "html",
            ...options.phantomJsCloud.common,
            ...options.phantomJsCloud[type]
        };
        let apiKeyLiquid = `{% credential ${options.phantomJsCloud.apiKey || "PhantomJsCloudKey"} %}`;
        let requestEncoded = encodeURIComponent(JSON.stringify(request));
        requestEncoded = requestEncoded.replace(URLStubEncoded, urlEncoded);
        return `https://PhantomJsCloud.com/api/browser/v2/${apiKeyLiquid}/?request=${requestEncoded}`;
    } else {
        return url;
    }
}

const agentTemplates = {
    scenario: function(options) {
        // 每季对应的Scenario，便于导出
        return {
            name: `${options.id}-Rss`,
            public: true
        };
    },
    schedulerScenario: function() {
        // Scheduler对应的Scenario，便于统一管理
        return {
            name: "RssScheduler"
        };
    },
    scenarioName: function(seasonId) {
        return `${seasonId}-Rss`;
    },
    scenarioLinkRedirect: function(options, scenario) {
        return {
            source: `./scenarios/${scenario.id}/export.json`,
            destination: options.scenarioLink
        };
    },
    scheduler: function(options, scenario, schedulerScenario) {
        // 用于触发新闻收集
        return {
            name: `${options.id}-Scheduler`,
            type: "Agents::CommanderAgent",
            scenario_ids: [scenario.id, schedulerScenario.id],
            schedule: options.schedule,
            options: JSON.stringify({
                action: "run"
            }),
        };
    },
    rss: function(options, scenario) {
        // 用于将收集的新闻事件整理为RSS
        return {
            name: `${options.id}-Rss`,
            type: "Agents::DataOutputAgent",
            scenario_ids: [ scenario.id ],
            options: JSON.stringify({
                secrets: [ "bangumi_news" ],
                expected_receive_period_in_days: 2,
                template: {
                    self: options.rssLink,
                    ...options.rss,
                    item: {
                        title: "【{{category}}】{{title}}",
                        pubDate: "{{date}}",
                        link: "{{link}}",
                        description: "{{description}}",
                        guid: "{{guid}}",
                        category: "{{category}}",
                        receivedDate: "{{created_at}}"
                    }
                },
                events_order: [
                    [ "{{date}}", "time", "false" ],
                    [ "{{created_at}}", "time", "false" ]
                ],
                events_to_show: options.maxCount,
                ns_media: "true",
                ns_itunes: "true",
                response_headers: {
                    "Access-Control-Allow-Origin": "*"
                }
            })
        };
    },
    rssName: function(seasonId) {
        return `${seasonId}-Rss`;
    },
    rssLinkRedirect: function(agent) {
        return {
            source: `./users/${agent.user_id}/web_requests/${agent.id}/${agent.options.secrets[0]}.xml`,
            destination: agent.options.template.self
        };
    },
    liquidHtmlPage: function(options) {
        const engine = new Liquid({
            root: nodePath.resolve(__dirname, "liquid"),
            extname: ".liquid"
        });
        let mimeType = "text/html";
        engine.registerTag("mime", {
            parse: function(token) {
                this.mime = token.args;
            },
            render: function() {
                mimeType = this.mime;
            }
        });
        return {
            name: options.name,
            type: "Agents::LiquidOutputAgent",
            options: JSON.stringify({
                secret: options.template,
                expected_receive_period_in_days: 99999999,
                content: engine.renderFileSync(options.template, options.data),
                mime_type: mimeType,
                mode: "Last X events",
                event_limit: 0
            })
        };
    },
    liquidHtmlPageUrl: function(agent) {
        return `./users/${agent.user_id}/web_requests/${agent.id}/${agent.options.secret}.html`;
    },
    agentOptionDefintion: {
        xpath: {
            id: "@id",
            url: "@href",
            text: "normalize-space(.)",
            title: "normalize-space(.)",
            date: "normalize-space(.)",
            image: "@src",
            banner: "./node()",
            cover: "./node()",
            body: "./node()",
            default: "normalize-space(.)"
        }
    },
    index: function(options) {
        // 用于获取新闻索引页的新闻，部分新闻来源需要补充正文
        let agent = {
            name: "Index",
            type: "Agents::WebsiteAgent",
            schedule: "never"
        };
        let agentOptions = {
            expected_update_period_in_days: 7,
            url: transformToPhantomJsCloudUrlIfNeeded(options, "index", options.url),
            type: options.indexFormat || "html",
            mode: "on_change",
            ...generateWebsiteAgentOptions(options.index, this.agentOptionDefintion, options.indexFormat)
        };
        agent.options = JSON.stringify(agentOptions);
        return agent;
    },
    extractorGenerator: function(options) {
        // 用于生成正文提取器
        let code = `const generator = ${options.getExtractor};
        Agent.receive = function() {
            let events = this.incomingEvents();
            events.map(e => {
                this.log("Generating Extractor: " + JSON.stringify(e));
                let extractor = generator(e.payload.url, e.payload);
                if (extractor && extractor.bodySelector && !extractor.bodyXPath) {
                    extractor.bodyXPath = "./node()";
                }
                return {
                    ...e.payload,
                    ...extractor
                };
            }).forEach(e => this.createEvent(e));
        }`.replace(/^\s+/mg, "");
        return {
            name: "ExtractorGenerator",
            type: "Agents::JavaScriptAgent",
            schedule: "never",
            options: JSON.stringify({
                expected_update_period_in_days: 7,
                language: "JavaScript",
                code
            })
        };
    },
    extractorDescription: function(options) {
        // 用于提取正文内容，仅与正文提取器生成器配合使用
        return {
            name: "Description",
            type: "Agents::WebsiteAgent",
            schedule: "never",
            options: {
                expected_update_period_in_days: 7,
                url_from_event: transformToPhantomJsCloudUrlIfNeeded(options, "desc", "{{ url }}", "{{ url | json | url_encode }}"),
                type: "html",
                mode: "merge",
                ...generateWebsiteAgentOptions({
                    body: {
                        css: "{{bodySelector | default: \"body\"}}",
                        value: "{{bodyXPath | default: \'\"请在浏览器里打开\"\'}}"
                    },
                    ...options.description
                }, this.agentOptionDefintion)
            }
        };
    },
    description: function(options) {
        // 用于提取正文内容
        let agent = {
            name: "Description",
            type: "Agents::WebsiteAgent",
            schedule: "never"
        };
        let agentOptions = {
            expected_update_period_in_days: 7,
            url_from_event: transformToPhantomJsCloudUrlIfNeeded(options, "desc", "{{ url }}", "{{ url | json | url_encode }}"),
            type: options.descFormat || "html",
            mode: "merge",
            ...generateWebsiteAgentOptions(options.description, this.agentOptionDefintion, options.descFormat)
        };
        agent.options = JSON.stringify(agentOptions);
        return agent;
    },
    merge: function(options, definition) {
        // 用于生成整合器
        let agent = {
            name: "Merge",
            type: "Agents::EventFormattingAgent"
        };
        let hasDescription = options.description != null || options.getExtractor != null;
        let agentOptions = {
            instructions: {
                link: hasDescription ? "{{url}}" : `${options.url}#{{id}}`,
                title: "{{title}}",
                date: "{{date}}",
                description: "{{body}}",
                guid: `${options.season || definition.id}_${options.guidPrefix}#{{id}}`,
                category: options.name,
                ...options.merge
            },
            matchers: [],
            mode: "clean"
        };
        agent.options = JSON.stringify(agentOptions);
        if (options.hideFromRss) {
            agent.disabled = true;
        }
        return agent;
    },
    mergeJS: function(options) {
        // 用于生成整合器（JavaScript）
        let code = `const merger = ${options.merge};
        Agent.receive = function() {
            let events = this.incomingEvents();
            events.map(e => {
                this.log("Transforming Event: " + JSON.stringify(e));
                return merger(e.payload);
            }).forEach(e => this.createEvent(e));
        }`.replace(/^\s+/mg, "");
        return {
            name: "Merge",
            type: "Agents::JavaScriptAgent",
            schedule: "never",
            options: JSON.stringify({
                expected_update_period_in_days: 7,
                language: "JavaScript",
                code
            })
        };
    },
    mwRevisionIndex: function(options) {
        // 用于获取MediaWiki某一页面的修订版本列表
        let agent = {
            name: "RevisionIndex",
            type: "Agents::WebsiteAgent",
            schedule: "never"
        };
        let agentOptions = {
            expected_update_period_in_days: 7,
            url: `${options.host}/api.php?action=query&format=json&prop=revisions&pageids=${options.pageId}&rvlimit=10&rvprop=ids|timestamp|user|userid|comment`,
            type: "json",
            mode: "on_change",
            extract: {
                title: {
                    path: `query.pages['${options.pageId}'].title`,
                    repeat: true
                },
                revId: {
                    path: `query.pages['${options.pageId}'].revisions[*].revid`
                },
                prevId: {
                    path: `query.pages['${options.pageId}'].revisions[*].parentid`
                },
                user: {
                    path: `query.pages['${options.pageId}'].revisions[*].user`
                },
                userId: {
                    path: `query.pages['${options.pageId}'].revisions[*].userid`
                },
                time: {
                    path: `query.pages['${options.pageId}'].revisions[*].timestamp`
                },
                comment: {
                    path: `query.pages['${options.pageId}'].revisions[*].comment`
                }
            }
        };
        agent.options = JSON.stringify(agentOptions);
        return agent;
    },
    mwRevisionDiff: function(options) {
        // 用于获取MediaWiki某一修订版本列表
        let agent = {
            name: "RevisionDiff",
            type: "Agents::WebsiteAgent",
            schedule: "never"
        };
        let agentOptions = {
            expected_update_period_in_days: 7,
            url: `${options.host}/api.php?action=compare&format=json&fromrev={{prevId}}&torev={{revId}}&prop=diff`,
            type: "json",
            mode: "merge",
            extract: {
                diff: {
                    path: `compare['*']`
                }
            }
        };
        agent.options = JSON.stringify(agentOptions);
        return agent;
    },
    mwRevisionMerge: function(options) {
        // 用于生成MediaWiki修订版本列表
        let agent = {
            name: "Merge",
            type: "Agents::EventFormattingAgent"
        };
        let agentOptions = {
            instructions: {
                link: `${options.host}/index.php?curid=${options.pageId}&type=revision&diff={{revId}}&oldid={{prevId}}`,
                title: "{{user}}：{{ comment | default: '未注释的更改' }}",
                date: "{{time}}",
                description:
                    `<p>条目：<a target="_blank" rel="noopener noreferer" href="${options.host}/index.php?curid=${options.pageId}">{{title}}</a></p>` +
                    `<p>用户：<a target="_blank" rel="noopener noreferer" href="${options.host}/index.php?title=User:{{ user | url_encode }}">{{user}} (uid: {{userId}})</a></p>` +
                    `<p>编辑：<a target="_blank" rel="noopener noreferer" href="${options.host}/index.php?curid=${options.pageId}&&oldid={{revId}}">版本{{revID}}（{{ comment | default: '编辑未标注' }}）</a></p>` +
                    `<p>差异：<br /><table>{{diff}}</table></p>`,
                guid: `${options.host}/${options.pageId}#{{revId}}`,
                category: options.name
            },
            matchers: [],
            mode: "clean"
        };
        agent.options = JSON.stringify(agentOptions);
        return agent;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() { 
    let config = JsonUtil.read(nodePath.resolve(__dirname, "conf.json"));
    let credential, workerStatus;
    let data = {
        sources: {},
        seasons: [],
        shortcuts: [],
        currentSeason: null,
        site: config.site
    };
    console.log(`Logging in as ${config.user} (${config.site})`);
    credential = await api.login(config.site, config.user, config.pass);
    workerStatus = await api.getWorkerStatus(credential);
    while (workerStatus.pending > 5) {
        workerStatus = await api.getWorkerStatus(credential);
        console.log(`Huginn is busy: ${workerStatus.pending} worker(s) is pending`);
        await sleep(3000);
    }
    console.log("Preloading agents");
    data.agents = await api.Agent.list(credential, { sort: "created_at.desc" });
    console.log("Preloading scenarios");
    data.scenarios = await api.Scenario.list(credential);
    let host = {
        jobs: [],
        addPendingJob: function(job) {
            this.jobs.push(job);
        },
        executePendingJobs: function() {
            return arrayForEach(this.jobs, job => job(), this);
        },
        asSyncFunction: function(f, thisArg) {
            const addPendingJob = this.addPendingJob.bind(this);
            return function() {
                const boundThis = thisArg || this, args = Array.from(arguments);
                addPendingJob(() => f.apply(boundThis, args));
            };
        },

        definition: {},
        findAgentByName: function(name) {
            return data.agents.find(agent => agent.name == name);
        },
        createAgentIfAbsent: async function(options) {
            let agent = this.findAgentByName(options.name);
            if (!agent) {
                try {
                    console.log("Creating Agent: " + options.name);
                    agent = await api.Agent.create(credential, options);
                    data.agents.push(agent);
                    // 留出 1s，防止邻近的 Agent 由于 created_at 字段相同而排序错误。
                    await sleep(1000);
                } catch(err) {
                    console.error("Creating Agent Failed: ", options);
                    throw err;
                }
            }
            return agent;
        },
        updateAgent: async function(agent, patch) {
            let index = data.agents.indexOf(agent);
            if (index >= 0) {
                try {
                    console.log("Updating Agent: " + agent.name);
                    let newAgent = await api.Agent.update(credential, agent.id, patch);
                    data.agents[index] = newAgent;
                    return newAgent;
                } catch(err) {
                    console.error("Updating Agent Failed: ", patch);
                    throw err;
                }
            }
            return null;
        },
        updateOrCreateAgent: async function(options, updateIfExists) {
            let agent = this.findAgentByName(options.name);
            if (agent) {
                if (updateIfExists) {
                    agent = await this.updateAgent(agent, options);
                }
            } else {
                agent = await this.createAgentIfAbsent(options);
            }
            return agent;
        },
        findScenarioByName: function(name) {
            return data.scenarios.find(scenario => scenario.name == name);
        },
        createScenarioIfAbsent: async function(options) {
            let scenario = this.findScenarioByName(options.name);
            if (!scenario) {
                scenario = await api.Scenario.create(credential, options);
                data.scenarios.push(scenario);
                console.log("Scenario Created: " + scenario.name);
            }
            return scenario;
        },
        updateOrCreatePipe: async function(options) {
            let { pipe, controllers, sources, receivers, scenarios, wip } = options;
            let i, previousAgentId, modifyCount = 0;
            for (i = 0; i < pipe.length; i++) {
                let currentAgentData = pipe[i];
                let oldAgent = this.findAgentByName(currentAgentData.name), newAgent;
                if (i > 0) {
                    currentAgentData.source_ids = [ previousAgentId ];
                } else {
                    currentAgentData.controller_ids = controllers;
                    currentAgentData.source_ids = sources;
                }
                if (i == pipe.length - 1) {
                    currentAgentData.receiver_ids = receivers;
                }
                currentAgentData.scenario_ids = scenarios;
                newAgent = await this.updateOrCreateAgent(currentAgentData, wip);
                if (newAgent != oldAgent) {
                    modifyCount++;
                }
                previousAgentId = newAgent.id;
            }
            return modifyCount;
        },
        testPipeAndReport: async function(options) {
            let { pipe, initialEvent } = options;
            let report = [
                "# Pipe Report"
            ];
            let i, lastEvent = initialEvent;
            for (i = 0; i < pipe.length; i++) {
                let currentAgentData = pipe[i];
                let currentAgentOptions;
                let dryRunResult;
                if (typeof currentAgentData.options == "string") {
                    currentAgentOptions = JSON.parse(currentAgentData.options);
                } else {
                    currentAgentOptions = currentAgentData.options;
                }
                report.push(
                    "",
                    `## Agent #${i + 1}: ${currentAgentData.name}`,
                    `Type: ${currentAgentData.type}`,
                    "```json",
                    JSON.stringify(currentAgentOptions, null, 2),
                    "```",
                    "",
                    `## Agent #${i + 1}: In Event`,
                    "```json",
                    JSON.stringify(lastEvent, null, 2),
                    "```"
                );
                dryRunResult = await api.Agent.dryRun(credential, currentAgentData, lastEvent);
                report.push(
                    "",
                    `## Agent #${i + 1}: Out Events`,
                    "```json",
                    JSON.stringify(dryRunResult.outEvents, null, 2),
                    "```",
                    "",
                    `## Agent #${i + 1}: Logs`,
                    "```",
                    dryRunResult.logs,
                    "```",
                    "",
                    `## Agent #${i + 1}: Memory`,
                    "```json",
                    JSON.stringify(dryRunResult.memory, null, 2),
                    "```"
                );
                if (i < pipe.length - 1){
                    if (dryRunResult.outEvents.length) {
                        lastEvent = dryRunResult.outEvents[0];
                    } else {
                        report.push(
                            "",
                            `## Dry Run Stopped`
                        );
                        break;
                    }
                }
            }
            return report.join("\n");
        },
        prepareSeason: async function(options) {
            if (options.offline || options.dryRun) {
                this.definition = {
                    id: options.id,
                    scenarioId: 0,
                    schedulerId: 0,
                    rssId: 1,
                    offline: options.offline,
                    dryRun: options.dryRun
                };
            } else {
                let scenario = await this.createScenarioIfAbsent(agentTemplates.scenario(options));
                let schedulerScenario = await this.createScenarioIfAbsent(agentTemplates.schedulerScenario(options));
                let scheduler = await this.updateOrCreateAgent(agentTemplates.scheduler(options, scenario, schedulerScenario), options.wip);
                let rss = await this.updateOrCreateAgent(agentTemplates.rss(options, scenario), options.wip);
                if (scheduler.schedule != options.schedule) {
                    scheduler = await this.updateAgent(scheduler, { schedule: options.schedule });
                }
                this.definition = {
                    id: options.id,
                    scenarioId: scenario.id,
                    schedulerId: scheduler.id,
                    rssId: rss.id
                };    
                data.currentSeason = {
                    ...options,
                    sources: [],
                    skippedSources: [],
                    pendingSources: []
                };
                data.seasons.push(data.currentSeason);
                if (options.wip) {
                    let scenarioRedirection = agentTemplates.scenarioLinkRedirect(options, scenario),
                        rssRedirection = agentTemplates.rssLinkRedirect(rss);
                    console.log(`Redirect: ${scenarioRedirection.source} -> ${scenarioRedirection.destination}`);
                    console.log(`Redirect: ${rssRedirection.source} -> ${rssRedirection.destination}`);
                }
            }
        },
        addSource: async function(options) {
            let sourceId = `${options.season || this.definition.id}-${options.name}`;
            let agentPipe = [], scenarios, receivers;
            if (this.definition.offline || options.offline) return;
            if (options.pipe) {
                agentPipe.push(...options.pipe);
            } else {
                agentPipe.push("index");
                if (options.getExtractor) {
                    agentPipe.push("extractorGenerator", "extractorDescription");
                } else if (options.description) {
                    agentPipe.push("description");
                }
                if (typeof options.merge == "function") {
                    agentPipe.push("mergeJS");
                } else {
                    agentPipe.push("merge");
                }
            }
            agentPipe = agentPipe.map(agent => {
                if (typeof agent != "object") {
                    let template = agentTemplates[agent];
                    if (!template) throw new Error("Template " + agent + " not found");
                    return template.call(agentTemplates, options, this.definition);
                } else {
                    return agent;
                }
            });
            agentPipe.forEach(e => e.name = `${sourceId}-${e.name}`);
            if (sourceId in data.sources) {
                let sourceData = data.sources[sourceId];
                scenarios = sourceData.scenarios;
                scenarios.add(this.definition.scenarioId);
                receivers = sourceData.receivers;
                receivers.add(this.definition.rssId);
            } else {
                scenarios = new Set([ this.definition.scenarioId ]);
                receivers = new Set([ this.definition.rssId ]);
                data.sources[sourceId] = { scenarios, receivers };
            }
            if (options.includedSeasons) {
                options.includedSeasons.forEach(seasonId => {
                    let scenarioName = agentTemplates.scenarioName(seasonId),
                        rssName = agentTemplates.rssName(seasonId);
                    let scenario = this.findScenarioByName(scenarioName),
                        rss = this.findAgentByName(rssName);
                    if (scenario) scenarios.add(scenario.id);
                    if (rss) receivers.add(rss.id);
                });
            }
            if (this.definition.dryRun || options.dryRun) {
                console.log("Add Source:", agentPipe);
            } else {
                let pipeOptions = {
                    pipe: agentPipe,
                    controllers: [ this.definition.schedulerId ],
                    sources: [],
                    initialEvent: null,
                    receivers: [ ...receivers ],
                    scenarios: [ ...scenarios ],
                    wip: options.wip
                };
                if (options.testAndReport) {
                    let reportPath = nodePath.resolve(__dirname, "../reports", options.guidPrefix + ".md");
                    fs.writeFileSync(reportPath, await this.testPipeAndReport(pipeOptions));
                    console.log("Report: " + reportPath);
                } else {
                    let updateCount = await this.updateOrCreatePipe(pipeOptions);
                    if (updateCount == 0) {
                        agentPipe.forEach(agentOpt => {
                            let agent = this.findAgentByName(agentOpt.name);
                            if (agent && Date.parse(agent.last_error_log_at) - Date.parse(agent.last_check_at) >= -10000) {
                                console.log("Warning: Error occured at last execution of " + agent.name + ": " + api.Agent.getAgentDetailURL(credential, agent.id));
                            }
                        });
                    } else {
                        console.log(`Source Updated: ${updateCount} agent(s) of ${sourceId}`);
                    }
                    data.currentSeason.sources.push({
                        page: options.url,
                        ...options,
                        pipe: agentPipe
                    });
                }
            }
            if (options.wip == "clean") {
                await arrayForEach(agentPipe, async agentOpt => {
                    let agent = this.findAgentByName(agentOpt.name);
                    if (agent) {
                        console.log("Cleaning Agent: " + agent.name);
                        await api.Agent.removeEvents(credential, agent.id);
                        await api.Agent.clearMemory(credential, agent.id);
                    }
                });
            }
        },
        skipSource: function(options) {
            data.currentSeason.skippedSources.push(options);
        },
        stubSource: function(options) {
            data.currentSeason.pendingSources.push(options);
        },
        mockSeason: function(options) {
            if (!options.skippedSources) options.skippedSources = [];
            if (!options.pendingSources) options.pendingSources = [];
            data.seasons.push(options);
        },
        defineShortcut: function(options) {
            let ref = data.seasons.find(season => season.id == options.season);
            data.shortcuts.push(ref.shortcut = {
                ...options,
                ref
            });
        }
    }
    let boundHost = {
        log: host.asSyncFunction(console.log, console),
        prepareSeason: host.asSyncFunction(host.prepareSeason, host),
        addSource: host.asSyncFunction(host.addSource, host),
        skipSource: host.asSyncFunction(host.skipSource, host),
        stubSource: host.asSyncFunction(host.stubSource, host),
        mockSeason: host.asSyncFunction(host.mockSeason, host),
        defineShortcut: host.asSyncFunction(host.defineShortcut, host),
        offline: true, // 仅用于引用
        dryRun: true,
        wip: true,
        hideFromRss: true,
        testAndReport: true
    };
    console.log("Executing Script");
    require("../seasons/index")(boundHost);
    host.addPendingJob(async () => {
        let indexPageAgent = await host.updateOrCreateAgent(agentTemplates.liquidHtmlPage({
            name: "RssIndex",
            template: "index",
            data
        }), true);
        console.log("Index Updated: " + agentTemplates.liquidHtmlPageUrl(indexPageAgent));
    });
    await host.executePendingJobs();
}

main().catch(err => {
    console.error(err);
    debugger;
});