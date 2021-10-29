const nodePath = require("path");
const Liquid = require("liquidjs").Liquid;

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
    let extract = {},
        template = {};
    keys.forEach((key) => {
        const val = params[key];
        if (key.endsWith(templateSuffix)) {
            const fieldName = key.slice(0, -templateSuffix.length);
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
                mergingExtract =
                    generateWebsiteAgentOptions(
                        convertedParam,
                        paramDefinition,
                        docFormat
                    ).extract || {};
                Object.keys(mergingExtract).forEach((mergingKey) => {
                    extract[mergingKey] = {
                        ...mergingExtract[mergingKey],
                        hidden: true,
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
                        css: val,
                        value: getValueXPath(key, ""),
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
            ...options.phantomJsCloud[type],
        };
        let apiKeyLiquid = `{% credential ${
            options.phantomJsCloud.apiKey || "PhantomJsCloudKey"
        } %}`;
        let requestEncoded = encodeURIComponent(JSON.stringify(request));
        requestEncoded = requestEncoded.replace(URLStubEncoded, urlEncoded);
        return `https://PhantomJsCloud.com/api/browser/v2/${apiKeyLiquid}/?request=${requestEncoded}`;
    } else {
        return url;
    }
}

module.exports = {
    scenario: function (options) {
        // 每季对应的Scenario，便于导出
        return {
            name: `${options.id}-Rss`,
            public: true,
        };
    },
    schedulerScenario: function () {
        // Scheduler对应的Scenario，便于统一管理
        return {
            name: "RssScheduler",
        };
    },
    scenarioName: function (seasonId) {
        return `${seasonId}-Rss`;
    },
    scenarioLinkRedirect: function (options, scenario) {
        return {
            source: `./scenarios/${scenario.id}/export.json`,
            destination: options.scenarioLink,
        };
    },
    scheduler: function (options, scenario, schedulerScenario) {
        // 用于触发新闻收集
        return {
            name: `${options.id}-Scheduler`,
            type: "Agents::CommanderAgent",
            scenario_ids: [scenario.id, schedulerScenario.id],
            schedule: options.schedule,
            options: JSON.stringify({
                action: "run",
            }),
        };
    },
    rss: function (options, scenario) {
        // 用于将收集的新闻事件整理为RSS
        return {
            name: `${options.id}-Rss`,
            type: "Agents::DataOutputAgent",
            scenario_ids: [scenario.id],
            options: JSON.stringify({
                secrets: ["bangumi_news"],
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
                        receivedDate: "{{created_at}}",
                    },
                },
                events_order: [
                    ["{{date}}", "time", "false"],
                    ["{{created_at}}", "time", "false"],
                ],
                events_to_show: options.maxCount,
                ns_media: "true",
                ns_itunes: "true",
                response_headers: {
                    "Access-Control-Allow-Origin": "*",
                },
            }),
        };
    },
    rssName: function (seasonId) {
        return `${seasonId}-Rss`;
    },
    rssLinkRedirect: function (agent) {
        return {
            source: `./users/${agent.user_id}/web_requests/${agent.id}/${agent.options.secrets[0]}.xml`,
            destination: agent.options.template.self,
        };
    },
    liquidHtmlPage: function (options) {
        const engine = new Liquid({
            root: nodePath.resolve(__dirname, "liquid"),
            extname: ".liquid",
        });
        let mimeType = "text/html";
        engine.registerTag("mime", {
            parse: function (token) {
                this.mime = token.args;
            },
            render: function () {
                mimeType = this.mime;
            },
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
                event_limit: 0,
            }),
        };
    },
    liquidHtmlPageUrl: function (agent) {
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
            default: "normalize-space(.)",
        },
    },
    index: function (options) {
        // 用于获取新闻索引页的新闻，部分新闻来源需要补充正文
        let agent = {
            name: "Index",
            type: "Agents::WebsiteAgent",
            schedule: "never",
        };
        let agentOptions = {
            expected_update_period_in_days: 7,
            url: transformToPhantomJsCloudUrlIfNeeded(
                options,
                "index",
                options.url
            ),
            type: options.indexFormat || "html",
            mode: "on_change",
            ...generateWebsiteAgentOptions(
                options.index,
                this.agentOptionDefintion,
                options.indexFormat
            ),
        };
        agent.options = JSON.stringify(agentOptions);
        return agent;
    },
    extractorGenerator: function (options) {
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
        }`.replace(/^\s+/gm, "");
        return {
            name: "ExtractorGenerator",
            type: "Agents::JavaScriptAgent",
            schedule: "never",
            options: JSON.stringify({
                expected_update_period_in_days: 7,
                language: "JavaScript",
                code,
            }),
        };
    },
    extractorDescription: function (options) {
        // 用于提取正文内容，仅与正文提取器生成器配合使用
        return {
            name: "Description",
            type: "Agents::WebsiteAgent",
            schedule: "never",
            options: {
                expected_update_period_in_days: 7,
                url_from_event: transformToPhantomJsCloudUrlIfNeeded(
                    options,
                    "desc",
                    "{{ url }}",
                    "{{ url | json | url_encode }}"
                ),
                type: "html",
                mode: "merge",
                ...generateWebsiteAgentOptions(
                    {
                        body: {
                            css: '{{bodySelector | default: "body"}}',
                            value: "{{bodyXPath | default: '\"请在浏览器里打开\"'}}",
                        },
                        ...options.description,
                    },
                    this.agentOptionDefintion
                ),
            },
        };
    },
    description: function (options) {
        // 用于提取正文内容
        let agent = {
            name: "Description",
            type: "Agents::WebsiteAgent",
            schedule: "never",
        };
        let agentOptions = {
            expected_update_period_in_days: 7,
            url_from_event: transformToPhantomJsCloudUrlIfNeeded(
                options,
                "desc",
                "{{ url }}",
                "{{ url | json | url_encode }}"
            ),
            type: options.descFormat || "html",
            mode: "merge",
            ...generateWebsiteAgentOptions(
                options.description,
                this.agentOptionDefintion,
                options.descFormat
            ),
        };
        agent.options = JSON.stringify(agentOptions);
        return agent;
    },
    merge: function (options, currentSeason) {
        // 用于生成整合器
        let agent = {
            name: "Merge",
            type: "Agents::EventFormattingAgent",
        };
        let hasDescription =
            options.description != null || options.getExtractor != null || options.urlInIndex;
        let seasonId = options.season || currentSeason.id;
        let agentOptions = {
            instructions: {
                link: hasDescription ? "{{url}}" : `${options.url}#{{id}}`,
                title: "{{title}}",
                date: "{{date}}",
                description: "{{body}}",
                guid: `${seasonId}_${options.guidPrefix}#{{id}}`,
                category: options.name,
                ...options.merge,
            },
            matchers: [],
            mode: "clean",
        };
        agent.options = JSON.stringify(agentOptions);
        if (options.hideFromRss) {
            agent.disabled = true;
        }
        return agent;
    },
    mergeJS: function (options) {
        // 用于生成整合器（JavaScript）
        let code = `const merger = ${options.merge};
        Agent.receive = function() {
            let events = this.incomingEvents();
            events.map(e => {
                this.log("Transforming Event: " + JSON.stringify(e));
                return merger(e.payload);
            }).forEach(e => this.createEvent(e));
        }`.replace(/^\s+/gm, "");
        return {
            name: "Merge",
            type: "Agents::JavaScriptAgent",
            schedule: "never",
            options: JSON.stringify({
                expected_update_period_in_days: 7,
                language: "JavaScript",
                code,
            }),
        };
    },
    mwRevisionIndex: function (options) {
        // 用于获取MediaWiki某一页面的修订版本列表
        let agent = {
            name: "RevisionIndex",
            type: "Agents::WebsiteAgent",
            schedule: "never",
        };
        let agentOptions = {
            expected_update_period_in_days: 7,
            url: `${options.host}/api.php?action=query&format=json&prop=revisions&pageids=${options.pageId}&rvlimit=10&rvprop=ids|timestamp|user|userid|comment`,
            type: "json",
            mode: "on_change",
            extract: {
                title: {
                    path: `query.pages['${options.pageId}'].title`,
                    repeat: true,
                },
                revId: {
                    path: `query.pages['${options.pageId}'].revisions[*].revid`,
                },
                prevId: {
                    path: `query.pages['${options.pageId}'].revisions[*].parentid`,
                },
                user: {
                    path: `query.pages['${options.pageId}'].revisions[*].user`,
                },
                userId: {
                    path: `query.pages['${options.pageId}'].revisions[*].userid`,
                },
                time: {
                    path: `query.pages['${options.pageId}'].revisions[*].timestamp`,
                },
                comment: {
                    path: `query.pages['${options.pageId}'].revisions[*].comment`,
                },
            },
        };
        agent.options = JSON.stringify(agentOptions);
        return agent;
    },
    mwRevisionDiff: function (options) {
        // 用于获取MediaWiki某一修订版本列表
        let agent = {
            name: "RevisionDiff",
            type: "Agents::WebsiteAgent",
            schedule: "never",
        };
        let agentOptions = {
            expected_update_period_in_days: 7,
            url: `${options.host}/api.php?action=compare&format=json&fromrev={{prevId}}&torev={{revId}}&prop=diff`,
            type: "json",
            mode: "merge",
            extract: {
                diff: {
                    path: `compare['*']`,
                },
            },
        };
        agent.options = JSON.stringify(agentOptions);
        return agent;
    },
    mwRevisionMerge: function (options) {
        // 用于生成MediaWiki修订版本列表
        let agent = {
            name: "Merge",
            type: "Agents::EventFormattingAgent",
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
                category: options.name,
            },
            matchers: [],
            mode: "clean",
        };
        agent.options = JSON.stringify(agentOptions);
        return agent;
    },
};
