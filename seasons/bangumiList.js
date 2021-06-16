/**
 * 番剧列表更新整合
 * @param { import("../lib/loaderHost") } host 加载器宿主对象
 */
 module.exports = function(host) {
    const { prepareSeason, addSource, wip, dryRun, hideFromRss } = host;
    const mwPipe = ["mwRevisionIndex", "mwRevisionDiff", "mwRevisionMerge"];
    const moegirlHost = "https://zh.moegirl.org.cn";

    prepareSeason({
        id: "bangumilist",
        name: "番剧列表",
        schedule: "every_30m",
        status: "需要时进行收录",
        scenarioLink: "https://rss.projectxero.top/scenarios/21/export.json",
        rssLink: "https://rss.projectxero.top/bangumi/list.xml",
        viewerLink: "https://rss.projectxero.top/view/?src=bangumi%2Flist.xml",
        maxCount: 1000,
        rss: {
            "icon": "https://rss.projectxero.top/bangumi/icon/common.jpg",
            "title": "番剧列表更新聚合",
            "description": "本RSS源自动从番剧列表网站上获取编辑情况并打包为RSS",
            "link": "https://rss.projectxero.top",
            "copyright": "内容版权归原网站所有",
            "webMaster": "projectxero@163.com"
        }
    });

    addSource({
        id: "202104",
        name: "2021年春季·萌娘百科",
        page: "https://zh.moegirl.org.cn/%E6%97%A5%E6%9C%AC2021%E5%B9%B4%E6%98%A5%E5%AD%A3%E5%8A%A8%E7%94%BB",
        pageId: 412008,
        host: moegirlHost,
        pipe: mwPipe
    });

    addSource({
        id: "202107",
        name: "2021年夏季·萌娘百科",
        page: "https://zh.moegirl.org.cn/%E6%97%A5%E6%9C%AC2021%E5%B9%B4%E5%A4%8F%E5%AD%A3%E5%8A%A8%E7%94%BB",
        pageId: 436218,
        host: moegirlHost,
        pipe: mwPipe
    });
}