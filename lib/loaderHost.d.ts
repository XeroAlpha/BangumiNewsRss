interface SeasonOptions {
    /**
     * 季度 ID，附加在所有所属 Agent 名称之前。
     */
    id: string;

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
     * 指示是否忽略这个季度。
     */
    offline?: boolean = false;

    /**
     * 指示是否只输出 Agent 参数而不实际创建或更新 Agent 或 Scenario。
     */
    dryRun?: boolean = false;

    /**
     * 指示在季度共用 Agent 或 Scenario 已存在时，是否强制更新季度参数
     */
    wip?: boolean = false;
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
     * 季度名，用于覆盖这条新闻来源的 Agent 的前缀。通常为番剧（系列）开播的季度。
     */
    season?: string;

    /**
     * RSS 新闻条目的唯一标识符前缀
     */
    guidPrefix: string;

    /**
     * 新闻来源 URL
     */
    url: string;

    /**
     * Index Agent 的抓取参数
     */
    index: WebsiteAgentOptions;

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
    offline?: boolean = false;

    /**
     * 指示是否只输出 Agent 参数而不实际创建或更新 Agent。
     */
    dryRun?: boolean = false;

    /**
     * 指示在新闻来源 Agent 已存在时，是否强制更新新闻来源参数。  
     * 当值为 `"clean"` 时，同时会清除 Agent 创建的事件与使用的存储。
     */
    wip?: boolean | "clean" = false;

    /**
     * 指示是否在 Rss 的新闻条目列表中隐藏所有来自此项新闻来源的消息。
     */
    hideFromRss?: boolean = false;
}

type WebsiteAgentOptionValue = string | [string, string] | [WebsiteAgentOptionValue, string];

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
     * 新闻条目内容的 CSS 选择器
     */
    bodySelector?: string;

    /**
     * 新闻条目内容的 XPath
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

/**
 * 创建或更新每个季度共用的 Agent 和 Scenario。
 * @param season 季度参数
 */
export function prepareSeason(season: SeasonOptions): Promise<void>;

/**
 * 创建或更新每个新闻来源使用的 Agent。
 * @param source 新闻来源参数
 */
export function addSource(source: SourceOptions): Promise<void>;

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