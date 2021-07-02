/**
 * 2021年夏季番剧新闻
 * @param { import("../lib/loaderHost") } host 加载器宿主对象
 */
 module.exports = function(host) {
    const { prepareSeason, addSource, skipSource, stubSource, wip, dryRun, hideFromRss, testAndReport } = host;

    prepareSeason({
        id: "202107",
        name: "2021年夏季",
        schedule: "every_30m",
        status: "来源收录进行中",
        maxCount: 20 * 43,
        scenarioLink: "https://rss.projectxero.top/scenarios/22/export.json",
        rssLink: "https://rss.projectxero.top/bangumi/2021-07.xml",
        viewerLink: "https://rss.projectxero.top/view/?src=bangumi%2F2021-07.xml",
        rss: {
            "icon": "https://rss.projectxero.top/bangumi/icon/2021-07.jpg",
            "title": "2021年夏季番剧新闻",
            "description": "本RSS源自动从番剧网站上收集新闻并打包为RSS",
            "link": "https://rss.projectxero.top",
            "copyright": "内容版权归原网站所有",
            "webMaster": "projectxero@163.com",
        }
    });

    stubSource({
        name: "LoveLive!Superstar!!",
        page: "https://www.lovelive-anime.jp/yuigaoka/news/"
    });
    
    stubSource({
        name: "寒蝉鸣泣之时(第2作)",
        season: "202010",
        page: "https://higurashianime.com/news.html",
        comment: "系列共用源：寒蝉鸣泣之时 卒"
    });
    
    stubSource({
        name: "小林家的龙女仆",
        season: "201701",
        page: "https://maidragon.jp/news/",
        comment: "系列共用源：小林家的龙女仆S"
    });
    
    stubSource({
        name: "魔法纪录 魔法少女小圆外传",
        season: "202001",
        page: "https://anime.magireco.com/news/",
        comment: "系列共用源：魔法纪录 魔法少女小圆外传 2nd SEASON -觉醒前夜-"
    });
    
    stubSource({
        name: "桃子男孩渡海而来",
        page: "https://peachboyriverside.com/news/"
    });
    
    stubSource({
        name: "平稳世代的韦驮天们",
        page: "https://news.noitamina.tv/idaten/"
    });
    
    stubSource({
        name: "关于我转生变成史莱姆这档事 第2期第2部",
        page: "",
        comment: "需要解决连续番剧的问题"
    });
    
    stubSource({
        name: "白砂的水族馆",
        page: "https://aquatope-anime.com/news/"
    });
    
    stubSource({
        name: "漂流少年",
        page: "https://anime.shochiku.co.jp/sonny-boy/news.html"
    });
    
    stubSource({
        name: "盖塔机器人 ARC",
        page: "https://getterrobot-arc.com/news/"
    });
    
    stubSource({
        name: "魔法科高中的优等生",
        page: "https://mahouka-yuutousei.jp/news/"
    });
    
    stubSource({
        name: "死神少爷与黑女仆",
        page: "https://bocchan-anime.com/news/" // getExtractor
    });
    
    stubSource({
        name: "阴晴不定大哥哥",
        page: "http://uramichi-anime.com/news/"
    });
    
    stubSource({
        name: "女友成双",
        page: "https://kanokano-anime.com/news/" // getExtractor
    });
    
    stubSource({
        name: "女神宿舍的管理员",
        page: "https://megamiryou.com/news/"
    });
    
    stubSource({
        name: "月光下的异世界之旅",
        page: "https://tsukimichi.com/news/"
    });
    
    stubSource({
        name: "RE-MAIN",
        page: "https://re-main.net/news/"
    });
    
    stubSource({
        name: "暗芝居 第9期",
        page: "https://www.tv-tokyo.co.jp/anime/yamishibai9/news/"
    });
    
    stubSource({
        name: "歌剧少女!!",
        page: "https://kageki-anime.com/news/"
    });
    
    stubSource({
        name: "瓦尼塔斯的手记",
        page: "https://vanitas-anime.com/news/"
    });
    
    stubSource({
        name: "贾希大人不气馁",
        page: "https://jahysama-anime.com/news/"
    });
    
    stubSource({
        name: "见面5秒开始战斗",
        page: "https://dea5-anime.com/news"
    });
    
    stubSource({
        name: "异世界迷宫黑心企业",
        page: "https://meikyubc-anime.com/"
    });
    
    stubSource({
        name: "我立于百万生命之上 第2季",
        page: "",
        comment: "需要解决连续番剧的问题"
    });
    
    stubSource({
        name: "NIGHT HEAD 2041",
        page: "https://nighthead2041.jp/news/"
    });
    
    stubSource({
        name: "转生成为了只有乙女游戏破灭Flag的邪恶大小姐X",
        page: "https://hamehura-anime.com/news/"
    });
    
    stubSource({
        name: "精灵幻想记",
        page: "https://seireigensouki.com/news-list/"
    });
    
    stubSource({
        name: "现实主义勇者的王国再建记",
        page: "https://genkoku-anime.com/news/"
    });
    
    stubSource({
        name: "我们的重制人生",
        page: "https://bokurema.com/news/"
    });
    
    stubSource({
        name: "侦探已经死了",
        page: "https://tanmoshi-anime.jp/news/" // getExtractor
    });
    
    stubSource({
        name: "开挂药师的异世界悠闲生活～在异世界开药店吧～",
        page: "https://www.cheat-kusushi.jp/"
    });
    
    skipSource({
        name: "生化危机 无尽暗黑",
        page: "https://www.netflix.com/title/80987064",
        reason: "无新闻网页"
    });
    
    stubSource({
        name: "绯红结系",
        page: "https://snx-anime.net/news/"
    });
    
    stubSource({
        name: "D_CIDE TRAUMEREI",
        page: "https://dctm-pj.com/news/"
    });
    
    skipSource({
        name: "Obey Me!",
        page: "https://shallwedate.jp/obeyme/",
        reason: "无新闻网页"
    });
    
    stubSource({
        name: "IDOLiSH7",
        season: "201801",
        page: "https://idolish7.com/aninana/news/",
        comment: "系列共用源：IDOLiSH7 Third BEAT! Part.1"
    });
    
    stubSource({
        name: "TSUKIPRO THE ANIMATION 2",
        page: "https://tsukipro-anime.com/news/"
    });
    
    stubSource({
        name: "百万吨级武藏",
        page: "",
        comment: "？"
    });
    
    stubSource({
        name: "偶像乐园 美妙天堂",
        page: "https://pripara.jp/idolland/"
    });
    
    stubSource({
        name: "Assault Lily",
        season: "202010",
        page: "https://assaultlily-pj.com/news/",
        comment: "系列共用源：Assault Lily Fruits"
    });
    
    stubSource({
        name: "我，小怼",
        page: "https://tsushima-anime.com/news/"
    });
    
    skipSource({
        name: "暗黑家族 蕨小姐",
        page: "https://smash-media.jp/channels/147",
        reason: "无新闻网页"
    });
    
    skipSource({
        name: "指尖传出的真挚热情2-恋人是消防员-",
        page: "https://yubinetsu.cf-anime.com/",
        reason: "R18不收录"
    });
}