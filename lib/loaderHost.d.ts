interface SeasonOptions {
    /**
     * 季度 ID，附加在所有所属 Agent 名称之前。
     */
    id: string;

    /**
     * 季度名称。
     */
    name: string;

    /**
     * Huginn 计划常量，指示 Scheduler 应该在何时触发。
     */
    schedule: HuginnSchedule;

    /**
     * RSS 源包含的最大新闻条目数，通常为 20 * 新闻来源数。
     */
    maxCount: number;

    /**
     * RSS 文件内包含在 `channel` 块下的参数列表。
     * @see https://zh.wikipedia.org/wiki/RSS
     */
    rss: RssOptions;

    /**
     * Scenario 描述文件的 URL。
     */
    scenarioLink: string;

    /**
     * RSS 文件的 URL。
     */
    rssLink: string;

    /**
     * RSS 文件对应阅览器的 URL。
     */
    viewerLink: string;

    /**
     * 指示是否忽略这个季度。
     */
    offline?: boolean;

    /**
     * 指示是否只输出 Agent 参数而不实际创建或更新 Agent 或 Scenario。
     */
    dryRun?: boolean;

    /**
     * 指示在季度共用 Agent 或 Scenario 已存在时，是否强制更新季度参数
     */
    wip?: boolean;
}

type HuginnSchedule = "every_1m" | "every_2m" | "every_5m" | "every_10m" | "every_30m" | 
                      "every_1h" | "every_2h" | "every_5h" | "every_12h" |
                      "every_1d" | "every_2d" | "every_7d" |
                      "midnight" | "1am" | "2am" | "3am" | "4am" | "5am" | "6am" | "7am" |
                      "8am" |"9am" | "10am" | "11am" | "noon" | "1pm" | "2pm" | "3pm" |
                      "4pm" | "5pm" | "6pm" | "7pm" | "8pm" | "9pm" | "10pm" | "11pm" |
                      "never";

interface RssOptions {
    [key: string]: string | number;
}

interface SourceOptions {
    /**
     * 新闻来源名称，通常为番剧名。
     */
    name: string;

    /**
     * 起始季度名，用于覆盖这条新闻来源的 Agent 的前缀。通常为番剧（系列）开播的季度。
     */
    season?: string;

    /**
     * 所属季度列表，表示这一新闻来源同时包含在其他季度的描述文件中。
     * 
     * 只需填写在执行顺序之后的季度ID。
     */
    includedSeasons?: Array<string>;

    /**
     * 此来源的注释。
     */
    comment: string;

    /**
     * RSS 新闻条目的唯一标识符前缀
     */
    guidPrefix?: string;

    /**
     * 显示新闻的网页 URL，与新闻来源 URL 相同时可省略。
     */
    page?: string;

    /**
     * 新闻来源 URL
     */
    url?: string;

    /**
     * PhantomJsCloud 的配置列表。注意此选项只会复制浅层的属性。
     */
    phantomJsCloud?: PhantomJsCloudOptions;

    /**
     * 自定义收集器管道
     */
    pipe?: Array<AgentOptions | AgentTemplateId>;

    /**
     * Index Agent 所抓取内容的格式。默认为 `"html"`。
     */
    indexFormat?: WebsiteFormatEnum;

    /**
     * Index Agent 的抓取参数
     */
    index?: WebsiteAgentOptions;

    /**
     * Description Agent 所抓取内容的格式。默认为 `"html"`。  
     * ExtractorGenerator 与 ExtractorDescription 均假定这一参数为 `"html"`。
     */
    descFormat?: WebsiteFormatEnum;

    /**
     * ExtractorGenerator Agent 的生成器函数
     */
    getExtractor?: (url: string, payload: WebsiteAgentResult) => ExtractorGeneratorResult;

    /**
     * Description Agent 的抓取参数
     */
    description?: WebsiteAgentOptions;

    /**
     * Merge Agent 的格式化参数或格式化函数
     */
    merge?: MergeAgentOptions | MergeAgentFunc;

    /**
     * 指示是否忽略这个这个新闻来源。
     */
    offline?: boolean;

    /**
     * 指示是否只输出 Agent 参数而不实际创建或更新 Agent。
     */
    dryRun?: boolean;

    /**
     * 指示是否只运行测试并输出报告而不实际创建 Agent。
     */
    testAndReport?: boolean;

    /**
     * 指示在新闻来源 Agent 已存在时，是否强制更新新闻来源参数。  
     * 当值为 `"clean"` 时，同时会清除 Agent 创建的事件与使用的存储。
     */
    wip?: boolean | "clean";

    /**
     * 指示是否在 Rss 的新闻条目列表中隐藏所有来自此项新闻来源的消息。
     */
    hideFromRss?: boolean;
}

type AgentTemplateId = "index" | "extractorGenerator" | "extractorDescription" | "description" | "merge" | "mergeJS";

interface AgentOptions {
    type: string;
    name: string;
    schedule?: HuginnSchedule;
    [key: string]: any;
}

type WebsiteFormatEnum = "html" | "xml" | "json" | "text";

type WebsiteAgentExtractParamTemplateId = "id" | "url" | "text" | "title" | "date" | "image" | "banner" | "body" | "default";

interface WebsiteAgentXmlExtractParam {
    /**
     * CSS 选择器。仅在提取 HTML 或 XML 时使用。
     */
    css?: string;

    /**
     * XPath 选择器。仅在提取 HTML 或 XML 时使用。
     */
    xpath?: string;

    /**
     * 值的 XPath 表达式。仅在提取 HTML 或 XML 时使用。
     */
    value?: string;

    /**
     * 值的 XPath 模板 ID。仅在提取 HTML 或 XML 时使用。
     */
    template?: WebsiteAgentExtractParamTemplateId
}

interface WebsiteAgentJsonExtractParam {
    /**
     * JSON 路径。仅在提取 JSON 时使用。
     */
    path: string;
}

interface WebsiteAgentTextExtractParam {
    /**
     * 匹配内容的正则表达式。仅在提取文本时使用。
     */
    regexp: string;

    /**
     * 匹配结果中内容对应的索引。仅在提取文本时使用。
     */
    index?: number;
}

type WebsiteAgentExtractParam = WebsiteAgentXmlExtractParam | WebsiteAgentJsonExtractParam | WebsiteAgentTextExtractParam;

type WebsiteAgentOptionValue = string | WebsiteAgentExtractParam | [string, string] | [WebsiteAgentOptions, string];

interface WebsiteAgentOptions {
    /**
     * 新闻条目 ID
     */
    id?: WebsiteAgentOptionValue;

    /**
     * 新闻条目链接 URL
     */
    url?: WebsiteAgentOptionValue;

    /**
     * 新闻条目标题
     */
    title?: WebsiteAgentOptionValue;

    /**
     * 新闻条目发布日期
     */
    date?: WebsiteAgentOptionValue;

    /**
     * 新闻条目内容
     */
    body?: WebsiteAgentOptionValue;

    [key: string]: WebsiteAgentOptionValue;
}

interface WebsiteAgentResult {
    /**
     * 新闻条目 ID
     */
    id?: string;

    /**
     * 新闻条目链接 URL
     */
    url?: string;

    /**
     * 新闻条目标题
     */
    title?: string;

    /**
     * 新闻条目发布日期
     */
    date?: string;

    /**
     * 新闻条目内容
     */
    body?: string;

    [key: string]: string;
}

interface ExtractorGeneratorResult extends WebsiteAgentResult {
    /**
     * 新闻条目内容的 CSS 选择器。默认为 `"body"` 。
     */
    bodySelector?: string;

    /**
     * 新闻条目内容的 XPath 表达式。默认为 `"./node()"` 。
     */
    bodyXPath?: string;
}

interface MergeAgentOptions {
    /**
     * 新闻条目链接 URL
     */
    link?: string;

    /**
     * 新闻条目标题
     */
    title?: string;

    /**
     * 新闻条目发布日期
     */
    date?: string;

    /**
     * 新闻条目内容
     */
    description?: string;

    /**
     * 新闻条目唯一标识符
     */
    guid?: string;

    /**
     * 新闻条目所属类别
     */
    category?: string;
}

type MergeAgentResult = MergeAgentOptions;

type MergeAgentFunc = (payload: WebsiteAgentResult) => MergeAgentResult;

interface PhantomJsCloudOptions {
    /**
     * 公用配置条目，仅会被浅层复制。
     */
    common?: PhantomJsCloudRequest;

    /**
     * Index Agent 配置条目
     */
    index?: true | PhantomJsCloudRequest;

    /**
     * Description Agent 配置条目
     */
    desc?: true | PhantomJsCloudRequest;

    /**
     * 保存 Api-Key 的 Credential 名称
     */
    apiKey?: string;
}

// source: 
type PhantomJsCloudRequest = import("./phantomjscloud-io-data-types").IPageRequest;

interface SeasonInfo {
    /**
     * 季度 ID。
     */
    id: string;

    /**
     * 季度名称。
     */
    name: string;

    /**
     * Huginn 计划常量。
     */
    schedule: HuginnSchedule;

    /**
     * Scenario 描述文件的 URL。
     */
    scenarioLink: string;

    /**
     * RSS 文件的 URL。
     */
    rssLink: string;

    /**
     * RSS 文件对应阅览器的 URL。
     */
    viewerLink: string;

    /**
     * 包含的新闻来源信息。
     */
    sources: SourceInfo[];

    /**
     * 跳过的的新闻来源信息。
     */
    skippedSources?: SkippedSourceInfo[];
}

interface SourceInfo {
    /**
     * 新闻来源名称。
     */
    name: string;

    /**
     * 起始季度名。
     */
    season?: string;

    /**
     * 所属季度列表。
     */
    includedSeasons?: Array<string>;

    /**
     * 显示新闻的网页 URL。
     */
    page: string;

    /**
     * 此来源的注释。
     */
    comment: string;
}

interface SkippedSourceInfo extends SourceInfo {
    /**
     * 被跳过的原因。
     */
    reason: string;
}

interface ShortcutOptions {
    /**
     * 重定向 ID。
     */
    id: string;
    
    /**
     * 重定向名称。
     */
    name: string;
 
    /**
     * RSS 文件的 URL。
     */
    rssLink: string;
 
    /**
     * RSS 文件对应阅览器的 URL。
     */
    viewerLink: string;

    /**
     * 重定向指向的季度 ID。
     * 若在调用时不存在此季度则调用无效。
     */
    season: string;
}

/**
 * 以任务形式调用 `console.log(...data)`。
 * @param data 要打印至控制台的内容
 */
export function log(...data: any[]): void;

/**
 * 创建或更新每个季度共用的 Agent 和 Scenario。
 * @param season 季度参数
 */
export function prepareSeason(season: SeasonOptions): void;

/**
 * 创建或更新每个新闻来源使用的 Agent。
 * @param source 新闻来源参数
 */
export function addSource(source: SourceOptions): void;

/**
 * 标记某个新闻来源为“跳过”。
 * @param source 新闻来源参数
 */
export function skipSource(source: SkippedSourceInfo): void;

/**
 * 标记某个新闻来源为“待填写”。
 * @param source 新闻来源参数
 */
export function stubSource(source: SourceInfo): void;

/**
 * 为指定季度添加描述信息，便于生成 RSS 索引。
 * @param season 季度参数
 */
export function mockSeason(season: SeasonInfo): void;

/**
 * 定义隐式重定向链接。
 * @param shortcut 重定向参数
 */
export function defineShortcut(shortcut: ShortcutOptions): void;

/**
 * 预定义常量，表示启用 `offline` 选项。
 */
export const offline = true;

/**
 * 预定义常量，表示启用 `dryRun` 选项。
 */
export const dryRun = true;

/**
 * 预定义常量，表示启用 `wip` 选项。
 */
export const wip = true;

/**
 * 预定义常量，表示启用 `hideFromRss` 选项。
 */
export const hideFromRss = true;

/**
 * 预定义常量，表示启用 `testAndReport` 选项。
 */
export const testAndReport = true;