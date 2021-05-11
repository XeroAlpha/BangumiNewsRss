const api = require("./api");
const JsonUtil = require("./json");

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
                extract[key] = val;
            } else if (typeof val == "string") {
                if (docFormat == "json") {
                    extract[key] = { path: val };
                } else if (docFormat == "text") {
                    extract[key] = { regexp: val, index: 1 };
                } else {
                    extract[key] = {
                        css: val, value: paramDefinition.xpath[key] || paramDefinition.xpath.default
                    };
                }
            }
        }
    });
    return { extract, template };
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
    agentOptionDefintion: {
        xpath: {
            id: "@id",
            url: "@href",
            title: "normalize-space(.)",
            date: "normalize-space(.)",
            body: "./node()",
            default: "normalize-space(.)"
        }
    },
    index: function(options, definition) {
        // 用于获取新闻索引页的新闻，部分新闻来源需要补充正文
        let agent = {
            name: "Index",
            type: "Agents::WebsiteAgent",
            schedule: "never"
        };
        let agentOptions = {
            expected_update_period_in_days: 7,
            url: options.url,
            type: options.indexFormat || "html",
            mode: "on_change",
            ...generateWebsiteAgentOptions(options.index, this.agentOptionDefintion, options.indexFormat)
        };
        agent.options = JSON.stringify(agentOptions);
        return agent;
    },
    extractorGenerator: function(options, definition) {
        // 用于生成正文提取器
        let code = `const generator = ${options.getExtractor};
        Agent.receive = function() {
            let events = this.incomingEvents();
            events.map(e => {
                this.log("Generating Extractor: " + JSON.stringify(e));
                let extractor = generator(e.payload.url, e.payload);
                if (extractor.bodySelector && !extractor.bodyXPath) {
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
    extractorDescription: function(options, definition) {
        // 用于提取正文内容，仅与正文提取器生成器配合使用
        return {
            name: "Description",
            type: "Agents::WebsiteAgent",
            schedule: "never",
            options: {
                expected_update_period_in_days: 7,
                url: "{{url}}",
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
    description: function(options, definition) {
        // 用于提取正文内容
        let agent = {
            name: "Description",
            type: "Agents::WebsiteAgent",
            schedule: "never"
        };
        let agentOptions = {
            expected_update_period_in_days: 7,
            url: "{{url}}",
            type: "html",
            mode: "merge",
            ...generateWebsiteAgentOptions(options.description, this.agentOptionDefintion)
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
    mergeJS: function(options, definition) {
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
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() { 
    let config = JsonUtil.read(__dirname + "/conf.json");
    let credential;
    let data = {
        sources: {}
    };
    console.log("Logging in");
    credential = await api.login(config.site, config.user, config.pass);
    console.log("Preloading agents");
    data.agents = await api.Agent.list(credential, { sort: "created_at.desc" });
    console.log("Preloading scenarios");
    data.scenarios = await api.Scenario.list(credential);
    let host = {
        definition: {},
        findAgentByName: function(name) {
            return data.agents.find(agent => agent.name == name);
        },
        createAgentIfAbsent: async function(options) {
            let agent = this.findAgentByName(options.name);
            if (!agent) {
                console.log("Creating Agent: " + options.name);
                agent = await api.Agent.create(credential, options);
                data.agents.push(agent);
                // 留出 1s，防止邻近的 Agent 由于 created_at 字段相同而排序错误。
                await sleep(1000);
            }
            return agent;
        },
        updateAgent: async function(agent, patch) {
            let index = data.agents.indexOf(agent);
            if (index >= 0) {
                console.log("Updating Agent: " + agent.name);
                let newAgent = await api.Agent.update(credential, agent.id, patch);
                data.agents[index] = newAgent;
                return newAgent;
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
            let i, previousAgentId;
            for (i = 0; i < pipe.length; i++) {
                let currentAgentOptions = pipe[i];
                let currentAgent = this.findAgentByName(currentAgentOptions.name);
                if (i > 0) {
                    currentAgentOptions.source_ids = [ previousAgentId ];
                } else {
                    currentAgentOptions.controller_ids = controllers;
                    currentAgentOptions.source_ids = sources;
                }
                if (i == pipe.length - 1) {
                    currentAgentOptions.receiver_ids = receivers;
                }
                currentAgentOptions.scenario_ids = scenarios;
                currentAgent = await this.updateOrCreateAgent(currentAgentOptions, wip);
                previousAgentId = currentAgent.id;
            }
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
                await this.updateOrCreatePipe({
                    pipe: agentPipe,
                    controllers: [ this.definition.schedulerId ],
                    sources: [],
                    receivers: [ ...receivers ],
                    scenarios: [ ...scenarios ],
                    wip: options.wip
                });
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
    }
    let boundHost = {
        prepareSeason: host.prepareSeason.bind(host),
        addSource: host.addSource.bind(host),
        offline: true, // 仅用于引用
        dryRun: true,
        wip: true,
        hideFromRss: true
    };
    console.log("Executing Script");
    await require("../seasons/index")(boundHost);
    console.log("Finish");
}

main().catch(err => console.error(err));