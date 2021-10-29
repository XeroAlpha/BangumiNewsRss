const EventEmitter = require("events");
const fs = require("fs");
const nodePath = require("path");
const tunnel = require("tunnel");
const api = require("./api");
const { AsyncJobManager } = require("./async");
const agentTemplates = require("./agents");
const { arrayForEach, sleepAsync, removeObjectEntry } = require("./utils");

class BangumiRssManager extends EventEmitter {
    constructor(config) {
        super();
        let agent;
        if (config.agent) {
            if (config.agent.type == "http") {
                requestAgent = {
                    // 别听d.ts里瞎说，ca、key、cert都支持string
                    http: tunnel.httpOverHttp(config.agent),
                    https: tunnel.httpsOverHttp(config.agent),
                };
            } else if (config.agent.type == "https") {
                requestAgent = {
                    http: tunnel.httpOverHttps(config.agent),
                    https: tunnel.httpsOverHttps(config.agent),
                };
            }
        }
        Object.assign(this, {
            ...config,
            agents: [],
            scenarios: [],
            gotOptions: { agent },
        });
    }

    resetScriptData() {
        Object.assign(this, {
            sources: {},
            seasons: [],
            shortcuts: [],
            currentSeason: null,
        });
    }

    async callWithTimer(f, label) {
        try {
            this.emit("timeEvent", label, "start");
            return await f();
        } finally {
            this.emit("timeEvent", label, "end");
        }
    }

    async login() {
        this.credential = await this.callWithTimer(
            () => api.login(this.site, this.user, this.pass, this.gotOptions),
            "Login"
        );
    }

    async waitUntilFree() {
        let workerStatus = await api.getWorkerStatus(this.credential);
        while (workerStatus.pending > 0) {
            this.emit("busy", workerStatus);
            await sleepAsync(1000);
            workerStatus = await api.getWorkerStatus(this.credential);
        }
    }

    async reloadAgents() {
        this.agents = await this.callWithTimer(
            () => api.Agent.list(this.credential, { sort: "created_at.desc" }),
            "Reload Agent List"
        );
    }

    async reloadScenarios() {
        this.scenarios = await this.callWithTimer(
            () => api.Scenario.list(this.credential),
            "Reload Scenario List"
        );
    }

    findAgentByName(name) {
        return this.agents.find((agent) => agent.name == name);
    }

    async createAgentIfAbsent(options) {
        let agent = this.findAgentByName(options.name);
        if (!agent) {
            try {
                this.emit("createAgent", options);
                agent = await this.callWithTimer(
                    () => api.Agent.create(this.credential, options),
                    "Create Agent " + options.name
                );
                this.agents.push(agent);
                // 留出 1s，防止邻近的 Agent 由于 created_at 字段相同而排序错误。
                await sleepAsync(1000);
            } catch (err) {
                this.emit("error", err);
                throw err;
            }
        }
        return agent;
    }

    async updateAgent(agent, patch) {
        let index = this.agents.indexOf(agent);
        if (index >= 0) {
            try {
                this.emit("updateAgent", agent);
                let newAgent = await this.callWithTimer(
                    () => api.Agent.update(this.credential, agent.id, patch),
                    "Update Agent " + agent.name
                );
                this.agents[index] = newAgent;
                return newAgent;
            } catch (err) {
                this.emit("error", err);
                throw err;
            }
        }
        return null;
    }

    async updateOrCreateAgent(options, updateIfExists) {
        let agent = this.findAgentByName(options.name);
        if (agent) {
            if (updateIfExists) {
                agent = await this.updateAgent(agent, options);
            }
        } else {
            agent = await this.createAgentIfAbsent(options);
        }
        return agent;
    }

    findScenarioByName(name) {
        return this.scenarios.find((scenario) => scenario.name == name);
    }

    async createScenarioIfAbsent(options) {
        let scenario = this.findScenarioByName(options.name);
        if (!scenario) {
            this.emit("createScenario", options);
            scenario = await this.callWithTimer(
                () => api.Scenario.create(this.credential, options),
                "Create Scenario " + options.name
            );
            this.scenarios.push(scenario);
        }
        return scenario;
    }

    async updateOrCreatePipe(options) {
        let { pipe, controllers, sources, receivers, scenarios, wip } = options;
        let i,
            previousAgentId,
            modifyCount = 0;
        for (i = 0; i < pipe.length; i++) {
            let currentAgentData = pipe[i];
            let oldAgent = this.findAgentByName(currentAgentData.name),
                newAgent;
            if (i > 0) {
                currentAgentData.source_ids = [previousAgentId];
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
    }

    cleanReportDirectory() {
        const path = nodePath.resolve(__dirname, "../reports");
        fs.readdirSync(path)
            .filter((fn) => fn.endsWith(".md"))
            .forEach((fn) => fs.unlinkSync(nodePath.resolve(path, fn)));
    }

    async testPipeAndReport(options) {
        let { pipe, initialEvent } = options;
        let report = ["# Pipe Report"];
        let i,
            lastEvent = initialEvent;
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
            dryRunResult = await api.Agent.dryRun(
                this.credential,
                currentAgentData,
                lastEvent
            );
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
            if (i < pipe.length - 1) {
                if (dryRunResult.outEvents.length) {
                    lastEvent = dryRunResult.outEvents[0];
                } else {
                    report.push("", `## Dry Run Stopped`);
                    break;
                }
            }
        }
        return report.join("\n");
    }

    async prepareSeason(options) {
        this.currentSeason = {
            ...options,
            scenarioId: 0,
            schedulerId: 0,
            rssId: 1,
            sources: [],
            skippedSources: [],
            pendingSources: [],
        };
        this.emit("prepareSeason", options);
        if (!options.offline && !options.dryRun) {
            let scenario = await this.createScenarioIfAbsent(
                agentTemplates.scenario(options)
            );
            let schedulerScenario = await this.createScenarioIfAbsent(
                agentTemplates.schedulerScenario(options)
            );
            let scheduler = await this.updateOrCreateAgent(
                agentTemplates.scheduler(options, scenario, schedulerScenario),
                options.wip
            );
            let rss = await this.updateOrCreateAgent(
                agentTemplates.rss(options, scenario),
                options.wip
            );
            if (scheduler.schedule != options.schedule) {
                scheduler = await this.updateAgent(scheduler, {
                    schedule: options.schedule,
                });
            }
            this.currentSeason.scenarioId = scenario.id;
            this.currentSeason.schedulerId = scheduler.id;
            this.currentSeason.rssId = rss.id;
            this.seasons.push(this.currentSeason);
            let scenarioRedirection = agentTemplates.scenarioLinkRedirect(
                    options,
                    scenario
                ),
                rssRedirection = agentTemplates.rssLinkRedirect(rss);
            this.emit("redirect", scenarioRedirection);
            this.emit("redirect", rssRedirection);
        }
    }

    async addSource(options) {
        let seasonId = options.season || this.currentSeason.id;
        let sourceId = `${seasonId}-${options.name}`;
        let agentPipe = [],
            controller,
            scenarios,
            receivers;
        if (this.currentSeason.offline || options.offline) return;
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
        agentPipe = agentPipe.map((agent) => {
            if (typeof agent != "object") {
                let template = agentTemplates[agent];
                if (!template)
                    throw new Error("Template " + agent + " not found");
                return template.call(
                    agentTemplates,
                    options,
                    this.currentSeason
                );
            } else {
                return agent;
            }
        });
        agentPipe.forEach((e) => (e.name = `${sourceId}-${e.name}`));
        if (sourceId in this.sources) { // 合并此时已定义来源
            let sourceData = this.sources[sourceId];
            scenarios = sourceData.scenarios;
            scenarios.add(this.currentSeason.scenarioId);
            controller = sourceData.controller;
            receivers = sourceData.receivers;
            receivers.add(this.currentSeason.rssId);
        } else {
            scenarios = new Set([this.currentSeason.scenarioId]);
            receivers = new Set([this.currentSeason.rssId]);
            controller = this.currentSeason.schedulerId;
            this.sources[sourceId] = { scenarios, receivers, controller };
        }
        if (options.includedSeasons) { // 合并此时尚未定义的来源
            options.includedSeasons.forEach((seasonId) => {
                let scenarioName = agentTemplates.scenarioName(seasonId),
                    rssName = agentTemplates.rssName(seasonId),
                    scenario = this.findScenarioByName(scenarioName),
                    rss = this.findAgentByName(rssName);
                if (scenario) scenarios.add(scenario.id);
                if (rss) receivers.add(rss.id);
            });
        }
        if (this.currentSeason.dryRun || options.dryRun) {
            this.emit("debugSourcePipe", agentPipe);
        } else {
            let pipeOptions = {
                pipe: agentPipe,
                controllers: [controller],
                sources: [],
                initialEvent: null,
                receivers: [...receivers],
                scenarios: [...scenarios],
                wip: options.wip,
            };
            if (options.testAndReport) {
                let reportPath = nodePath.resolve(
                    __dirname,
                    "../reports",
                    options.guidPrefix + ".md"
                );
                this.emit("generateReport", reportPath);
                fs.writeFileSync(
                    reportPath,
                    await this.callWithTimer(
                        () => this.testPipeAndReport(pipeOptions),
                        "Test Source " + options.name
                    )
                );
            } else {
                let updateCount = await this.updateOrCreatePipe(pipeOptions);
                if (updateCount == 0) {
                    agentPipe.forEach((agentOpt) => {
                        let agent = this.findAgentByName(agentOpt.name);
                        if (!agent) return;
                        let lastErrorTime = Date.parse(agent.last_error_log_at),
                            lastCheckTime = Date.parse(agent.last_check_at);
                        if (Math.abs(lastCheckTime - lastErrorTime) <= 10000) {
                            let agentDetailUrl = api.Agent.getAgentDetailURL(
                                this.credential,
                                agent.id
                            );
                            this.emit("agentError", agent, agentDetailUrl);
                        }
                    });
                } else {
                    this.emit("updateSourceSuccess", updateCount, sourceId);
                }
                this.currentSeason.sources.push({
                    page: options.url,
                    ...options,
                    pipe: agentPipe,
                });
            }
        }
        if (options.wip == "clean") {
            await arrayForEach(agentPipe, async (agentOpt) => {
                let agent = this.findAgentByName(agentOpt.name);
                if (agent) {
                    this.emit("cleanAgent", agent);
                    await api.Agent.removeEvents(this.credential, agent.id);
                    await api.Agent.clearMemory(this.credential, agent.id);
                }
            });
        }
    }

    skipSource(options) {
        this.currentSeason.skippedSources.push(options);
    }

    stubSource(options) {
        this.currentSeason.pendingSources.push(options);
    }

    mockSeason(options) {
        if (!options.skippedSources) options.skippedSources = [];
        if (!options.pendingSources) options.pendingSources = [];
        this.seasons.push(options);
    }

    defineShortcut(options) {
        let ref = this.seasons.find((season) => season.id == options.season);
        ref.shortcut = {
            ...options,
            ref,
        };
        this.shortcuts.push(ref.shortcut);
    }

    async updateIndex() {
        let indexPageAgent = await this.updateOrCreateAgent(
            agentTemplates.liquidHtmlPage({
                name: "RssIndex",
                template: "index",
                data: this,
            }),
            true
        );
        this.emit(
            "updateIndex",
            agentTemplates.liquidHtmlPageUrl(indexPageAgent)
        );
    }

    executeScript() {
        const jm = new AsyncJobManager();
        const host = {
            log: jm.asSyncFunction((...args) =>
                this.emit("scriptLog", ...args)
            ),
            prepareSeason: jm.asSyncFunction(this.prepareSeason, this),
            addSource: jm.asSyncFunction(this.addSource, this),
            skipSource: jm.asSyncFunction(this.skipSource, this),
            stubSource: jm.asSyncFunction(this.stubSource, this),
            mockSeason: jm.asSyncFunction(this.mockSeason, this),
            defineShortcut: jm.asSyncFunction(this.defineShortcut, this),
            offline: true, // 仅用于引用
            dryRun: true,
            wip: true,
            hideFromRss: true,
            testAndReport: true,
            manager: this,
            jobManager: jm,
            api,
        };
        let seasonModule = nodePath.resolve(__dirname, "../seasons");
        removeObjectEntry(
            require.cache,
            (path) => !path.startsWith(seasonModule)
        );
        this.resetScriptData();
        this.cleanReportDirectory();
        require(seasonModule)(host);
        return jm.executePendingJobs();
    }
}

module.exports = { BangumiRssManager };
