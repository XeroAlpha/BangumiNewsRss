/**
 * 2021年春季番剧新闻
 * @param { import("../lib/loaderHost") } host 加载器宿主对象
 */
module.exports = async function(host) {
    const { prepareSeason, addSource, skipSource, wip, dryRun, hideFromRss } = host;

    await prepareSeason({
        id: "202104",
        name: "2021年春季",
        schedule: "every_30m",
        status: "正在收集来源",
        maxCount: 20 * 63,
        scenarioLink: "https://rss.projectxero.top/scenarios/18/export.json",
        rssLink: "https://rss.projectxero.top/bangumi/2021-04.xml",
        viewerLink: "https://rss.projectxero.top/view/?src=bangumi%2F2021-04.xml",
        rss: {
            "icon": "https://rss.projectxero.top/bangumi/icon/2021-04.jpg",
            "title": "2021年春季番剧新闻",
            "description": "本RSS源自动从番剧网站上收集新闻并打包为RSS",
            "link": "https://rss.projectxero.top",
            "copyright": "内容版权归原网站所有",
            "webMaster": "projectxero@163.com",
        }
    });

    await addSource({
        name: "通灵王(第2作)",
        guidPrefix: "shamanking",
        url: "https://shamanking-project.com/news",
        index: {
            url: "div.md-newslist>ul li>a",
            idTemplate: "{{url}}",
            title: "div.md-newslist>ul li h3",
            date: "div.md-newslist>ul li em.date",
        },
        description: {
            body: "main.news--detail__main"
        }
    });

    await addSource({
        name: "伊甸星原",
        guidPrefix: "eden-zero",
        url: "https://edens-zero.net/news/",
        index: {
            title: "ul.modNewsList__list.all_case li.item p.text",
            date: "ul.modNewsList__list.all_case li.item time",
            url: "ul.modNewsList__list.all_case li.item>a",
            category: "ul.modNewsList__list.all_case li.item span.tag"
        },
        getExtractor: function(url) {
            if (url.startsWith("#")) {
                let id = url.slice(1);
                return {
                    url: "https://edens-zero.net/news/" + url,
                    id: id,
                    bodySelector: `div#${id} div.content`
                };
            } else {
                return {
                    id: url
                };
            }
        },
        merge: {
            title: "[{{category}}]{{title}}"
        }
    });

    await addSource({
        name: "我的英雄学院",
        guidPrefix: "heroaca",
        url: "https://heroaca.com/news/",
        season: "201604",
        index: {
            title: "ul.newsLists li.cBorderWrap_w5 p.newsList__title",
            date: "ul.newsLists li.cBorderWrap_w5 p.newsList__date>time",
            url: ["ul.newsLists li.cBorderWrap_w5>a", "https://heroaca.com{{url}}"],
            idTemplate: "{{url}}"
        },
        description: {
            body: "div.newsDetail__text"
        },
        hideFromRss
    });

    await addSource({
        name: "王者天下3",
        guidPrefix: "kingdom",
        url: "https://kingdom-anime.com/news/",
        season: "202004",
        index: {
            url: ["ul#news_list li>a", "https://kingdom-anime.com/news/{{url}}"],
            idTemplate: "{{url}}",
            title: "ul#news_list li p.newsTitle",
            date: "ul#news_list li p.newsDate"
        },
        description: {
            body: "p#newsDetailText"
        }
    });

    await addSource({
        name: "水果篮子",
        guidPrefix: "fruba",
        url: "https://fruba.jp/news/",
        season: "201904",
        index: {
            url: ["ul.news_archive__list li.news_archive__list__item>a", "https://fruba.jp/news/{{url}}"],
            idTemplate: "{{url}}",
            title: "ul.news_archive__list li.news_archive__list__item p.ttl",
            date: "ul.news_archive__list li.news_archive__list__item p.date"
        },
        description: {
            body: "div.c-single_cont"
        }
    });

    await addSource({
        name: "哥斯拉 奇异点",
        guidPrefix: "godzillasp",
        url: "https://godzilla-sp.jp/news/",
        season: "201904",
        index: {
            url: ["ul.subNews__lists li.subNews__list a.subNews__list__link", "https://godzilla-sp.jp/news/{{url}}"],
            idTemplate: "{{url}}",
            title: "ul.subNews__lists li.subNews__list span.subNews__list__link--title",
            date: "ul.subNews__lists li.subNews__list span.subNews__list__link--date>time"
        },
        description: {
            body: "div.subNews__detal__textArea"
        }
    });

    await addSource({
        name: "大运动会 ReSTART!",
        guidPrefix: "daiundoukai",
        url: "https://daiundoukai-restart.jp/news.php",
        index: {
            url: ["div.text-farame table.news-list>tr>td>a", "https://daiundoukai-restart.jp/{{url}}"],
            idTemplate: "{{url}}",
            title: "div.text-farame table.news-list>tr>td>a",
            date: "div.text-farame table.news-list>tr>th"
        },
        description: {
            body: "div.text-farame"
        }
    });

    await addSource({
        name: "佐贺偶像是传奇 Revenge",
        guidPrefix: "zombielandsaga_revenge",
        url: "https://zombielandsaga.com/news/",
        index: {
            url: ["ul.article__lists li.article__list a.article__list--link", "https://zombielandsaga.com/news/{{url}}"],
            idTemplate: "{{url}}",
            title: "ul.article__lists li.article__list p.article__list--title",
            date: "ul.article__lists li.article__list time.article__list--time"
        },
        description: {
            body: "div.article__main"
        }
    });

    await addSource({
        name: "SSSS.GRIDMAN",
        comment: "SSSS动画系列共用源",
        season: "201810",
        guidPrefix: "gridman",
        url: "https://gridman.net/news/",
        index: {
            url: ["section.c-entry-list article.c-entry-item a.c-entry-item__link", "https://gridman.net{{url}}"],
            idTemplate: "{{url}}",
            title: "section.c-entry-list article.c-entry-item h1.c-entry-item__title",
            date: "section.c-entry-list article.c-entry-item span.c-entry-date",
            tag: "section.c-entry-list article.c-entry-item span.c-entry-tag",
            category: "section.c-entry-list article.c-entry-item span.c-entry-category"
        },
        description: {
            body: "div.c-entry-body"
        },
        merge: {
            title: "[{{category}}]{{title}}",
            category: "SSSS.{{tag}}"
        }
    });

    await addSource({
        name: "86 -不存在的战区-",
        guidPrefix: "anime-86",
        url: "https://anime-86.com/news/",
        index: {
            url: ["ul.c-list li.c-list__item a", "{{ url | to_uri: 'https://anime-86.com/news/' }}"],
            idTemplate: "{{url}}",
            title: "ul.c-list li.c-list__item div.c-list__item-title",
            date: "ul.c-list li.c-list__item div.c-list__item-date>p"
        },
        description: {
            body: "div.p-news__detail"
        }
    });

    await addSource({
        name: "美少年侦探团",
        guidPrefix: "bishonen_tanteidan",
        url: "https://bishonen-tanteidan.com/news/",
        index: {
            url: ["ul.c-newsList li.c-newsList__item a.c-newsList__link", "https://bishonen-tanteidan.com/news/{{url}}"],
            id: "ul.c-newsList li.c-newsList__item",
            title: "ul.c-newsList li.c-newsList__item p.c-newsList__head",
            date: "ul.c-newsList li.c-newsList__item p.c-newsList__date"
        },
        description: {
            body: "div.c-article__body"
        }
    });

    await addSource({
        name: "Tropical-Rouge!光之美少女",
        guidPrefix: "precure",
        url: "https://www.toei-anim.co.jp/tv/precure/news/",
        index: {
            url: "ul.m-list-topics li .topics-link",
            title: "ul.m-list-topics li .topics-link>dl>dd",
            dateAndCategory: "ul.m-list-topics li .topics-link>dl>dt",
            category: "ul.m-list-topics li .topics-link>dl>dt>span.link-cat"
        },
        getExtractor: function(url, payload) {
            /**
             * @type { import("../lib/loaderHost").ExtractorGeneratorResult }
             */
            let result = { id: url };
            result.date = payload.dateAndCategory.replace(payload.category, "");
            if (url.startsWith("/tv/precure/news/")) {
                result.url = "https://www.toei-anim.co.jp" + url;
                result.bodySelector = "div.m-box-entry";
            } else if (url.startsWith("http")) {
                result.url = url;
            } else if (url != "") {
                result.url = "https://www.toei-anim.co.jp" + url;
            } else {
                result.id = payload.title;
                result.url = "https://www.toei-anim.co.jp/tv/precure/news/#" + encodeURIComponent(payload.title);
            }
            return result;
        }
    });

    // TODO: 添加转生史莱姆日记（链接形式）

    await addSource({
        name: "影宅",
        guidPrefix: "shadowshouse",
        url: "https://shadowshouse-anime.com/news/",
        index: {
            url: ["ul.p-news__list li.p-news__item a.p-news__link", "{{ url | to_uri: 'https://shadowshouse-anime.com/news/' }}"],
            idTemplate: "{{url}}",
            title: "ul.p-news__list li.p-news__item div.p-news__title",
            date: "ul.p-news__list li.p-news__item div.p-news__date"
        },
        description: {
            body: "div.c-article__body"
        }
    });

    await addSource({
        name: "真白之音",
        guidPrefix: "mashironooto",
        url: "https://mashironooto-official.com/news/",
        index: {
            url: "div.news-lineup article.news-lineup__block>a",
            idTemplate: "{{url}}",
            title: "div.news-lineup article.news-lineup__block>h2.ttl",
            date: "div.news-lineup article.news-lineup__block>span.date"
        },
        description: {
            body: "div.post-style__cont"
        }
    });

    await addSource({
        name: "再见我的克拉默",
        guidPrefix: "sayonara_cramer",
        url: "https://sayonara-cramer.com/news/",
        index: {
            url: "div.news-main article.news-main__block>a.link",
            idTemplate: "{{url}}",
            title: "div.news-main article.news-main__block>div.news-main__block--ttl>div.ttl",
            date: "div.news-main article.news-main__block>div.news-main__block--date>span"
        },
        description: {
            body: "div.news-article__main"
        }
    });

    await addSource({
        name: "致不灭的你", // 《论模块化网站结构的重要性》
        guidPrefix: "fumetsunoanatae",
        page: "https://www.anime-fumetsunoanatae.com/",
        url: "https://www.anime-fumetsunoanatae.com/assets/data/topics-ja.json",
        indexFormat: "json",
        index: {
            topics: "topics"
        },
        merge: {
            link: "{{url}}"
        },
        pipe: [
            "index",
            {
                name: "DateFiller",
                type: "Agents::JavaScriptAgent",
                schedule: "never",
                options: JSON.stringify({
                    expected_update_period_in_days: 7,
                    language: "JavaScript",
                    code: "Agent.receive = " + (function(){
                        let events = this.incomingEvents();
                        events.forEach(event => {
                            let i, lastDate = event.created_at;
                            let uniqueEvents = this.memory("unique_events") || [];
                            let topics = event.payload.topics;
                            for (i = 0; i < topics.length; i++) {
                                let topic = topics[i];
                                let isNotUnique = uniqueEvents.find(ev => ev.text == topic.text && ev.url == topic.url);
                                topic.date = topic.date || lastDate;
                                if (!isNotUnique) {
                                    let url;
                                    if (topic.url) {
                                        url = "https://www.anime-fumetsunoanatae.com" + topic.url;
                                    } else {
                                        url = "https://www.anime-fumetsunoanatae.com/#" + topic.text;
                                    }
                                    this.createEvent({
                                        id: topic.text,
                                        url,
                                        title: topic.text,
                                        date: topic.date,
                                        body: "请在浏览器里打开"
                                    });
                                    uniqueEvents.push(topic);
                                }
                                lastDate = topic.date;
                            }
                            this.memory("unique_events", uniqueEvents);
                        });
                    }).toString().replace(/^\s+/mg, "")
                })
            },
            "merge"
        ]
    });

    await addSource({
        name: "不要欺负我，长瀞同学",
        guidPrefix: "nagatorosan",
        url: "https://www.nagatorosan.jp/news/",
        index: {
            url: ["ul.list>li>a", "https://www.nagatorosan.jp/news/{{url}}"],
            title: "ul.list>li>a>p",
            date: "ul.list>li>a>time"
        },
        description: {
            body: "div.detail>div.bg"
        }
    });

    await addSource({
        name: "龙先生、想要买个家。",
        guidPrefix: "doraie",
        url: "https://doraie.com/news/",
        index: {
            url: ["section.news-list article.news-item a.news-item__link", "https://doraie.com{{url}}"],
            title: "section.news-list article.news-item span.news-item__title",
            date: "section.news-list article.news-item span.news-item__date"
        },
        description: {
            body: "div.c-article-body"
        }
    });

    await addSource({
        name: "如果这叫爱情感觉会很恶心",
        guidPrefix: "koikimo",
        page: "https://koikimo.jp/news",
        url: "https://koikimo.jp/api/article?category=0&limit=10&page=1",
        indexFormat: "json",
        index: {
            id: "list[*].uuid",
            urlTemplate: "https://koikimo.jp/api/article/{{id}}",
            title: "list[*].title",
            date: "list[*].publish_start_at"
        },
        descFormat: "json",
        description: { // 这个新闻内容是 markdown 格式
            body: ["body", "<pre style=\"white-space: pre-wrap\">{{ body | escape }}</pre>"]
        }
    });

    await addSource({
        name: "忧国的莫里亚蒂",
        comment: "系列共用源",
        guidPrefix: "moriarty",
        url: "https://moriarty-anime.com/news",
        season: "202010",
        index: {
            url: "div.news-contents-inner article.news-box a.news-box-link",
            idTemplate: "{{url}}",
            // Nokogiri 不允许在 h3 标签内包含 p 标签，因此将 p 解析为了 h3 的兄弟元素
            title: "div.news-contents-inner article.news-box h3.news-box-ttl+p",
            // Liquid 似乎会将 &nbsp;(%C2%A0) 等字符串自动转换为空格，进而导致替换失败
            date: ["div.news-contents-inner article.news-box p.news-box-date", "{{ date | url_encode | remove: '%C2%A0%7C%C2%A0' | url_decode }}"]
        },
        description: {
            body: "div.news-detail-content"
        }
    });

    await addSource({
        name: "东京卍复仇者",
        guidPrefix: "tokyo_revengers",
        url: "https://tokyo-revengers-anime.com/news/",
        index: {
            url: ["section.news-list article.c-news-item a.c-news-item__link", "https://tokyo-revengers-anime.com{{url}}"],
            title: "section.news-list article.c-news-item span.c-news-item__title",
            date: "section.news-list article.c-news-item span.c-news-date"
        },
        description: {
            body: "div.c-news-body"
        }
    });

    await addSource({
        name: "灼热卡巴迪",
        guidPrefix: "kabaddi",
        url: "https://www.tv-tokyo.co.jp/anime/kabaddi/news/",
        index: {
            id: "main.ly_main>a",
            urlTemplate: "https://www.tv-tokyo.co.jp/anime/kabaddi/news/#{{id}}",
            title: "main.ly_main>article.bl_news h2.bl_news_ttl",
            date: "main.ly_main>article.bl_news time.bl_news_date",
            body: "main.ly_main>article.bl_news div.bl_news_body"
        }
    });

    skipSource({
        name: "席斯坦 -The Roman Fighter-",
        page: "https://cestvs-anime.com/",
        reason: "暂不支持读取 Firebase Firestore 服务的内容"
    });

    await addSource({
        name: "烧窑的话也要马克杯",
        guidPrefix: "yakumo",
        url: "https://yakumo-project.com/news/",
        index: {
            url: ["div.news__wrap>ul li>a", "https://yakumo-project.com/news/{{url}}"],
            idTemplate: "{{url}}",
            title: "div.news__wrap>ul li>a>p",
            date: "div.news__wrap>ul li>a>time"
        },
        description: {
            body: "div.articleSingleCont"
        }
    });

    await addSource({
        name: "刮掉胡子的我与捡到的女高中生",
        guidPrefix: "higehiro",
        url: "http://higehiro-anime.com/news",
        index: {
            id: "ul.news>li",
            urlTemplate: "http://higehiro-anime.com/news#{{id}}",
            title: [{ titleAndDate: "ul.news>li>h3" }, "{{ titleAndDate | remove_first: date }}"],
            date: "ul.news>li>h3>span",
            body: "ul.news>li div.txt"
        }
    });

    await addSource({
        name: "青梅竹马绝对不会输的恋爱喜剧",
        guidPrefix: "osamake",
        url: "https://osamake.com/news.html",
        index: {
            id: "div#Entries article.content-entry",
            urlTemplate: "https://osamake.com/news.html#{{id}}",
            title: "div#Entries article.content-entry h2.entry-title>span",
            date: "div#Entries article.content-entry div.entry-date>span",
            body: "div#Entries article.content-entry div.entry-body"
        }
    });

    await addSource({
        name: "持续狩猎史莱姆三百年，不知不觉就练到LV MAX",
        guidPrefix: "slime300",
        url: "https://slime300-anime.com/news/",
        index: {
            url: { xpath: "//div[starts-with(@class, \"news__ContentWrap\")]/a" },
            urlTemplate: "https://slime300-anime.com{{url}}",
            idTemplate: "{{url}}",
            title: { xpath: "//div[starts-with(@class, \"news__ContentWrap\")]/a/div/p[position() = last()]" },
            date: { xpath: "//div[starts-with(@class, \"news__ContentWrap\")]/a/div/p[starts-with(@class, \"news__Date\")]" }
        },
        description: {
            body: [{
                image: { xpath: "//div[starts-with(@class, \"news__ImageWrap\")]", template: "banner" },
                body: { xpath: "//div[starts-with(@class, \"news__Value\")]" }
            }, "<p>{{image}}</p>{{body}}"]
        }
    });

    await addSource({
        name: "战斗员派遣中!",
        guidPrefix: "kisaragi",
        url: "https://kisaragi-co.jp/news.html",
        index: {
            id: "div#Entries article.content-entry",
            urlTemplate: "https://kisaragi-co.jp/news.html#{{id}}",
            title: "div#Entries article.content-entry h2.entry-title>span",
            date: "div#Entries article.content-entry div.entry-date>span",
            body: "div#Entries article.content-entry div.entry-body"
        }
    });

    await addSource({
        name: "圣女魔力无所不能",
        guidPrefix: "seijyonomaryoku",
        url: "https://seijyonomaryoku.jp/news.php",
        index: {
            id: "div.m-newspage-article-container article.m-newspage-article",
            urlTemplate: "https://seijyonomaryoku.jp/news.php#{{id}}",
            title: "div.m-newspage-article-container article.m-newspage-article h1.m-newspage-article-heading",
            date: {
                css: "div.m-newspage-article-container article.m-newspage-article time.m-newspage-article-time",
                value: "@datetime"
            },
            body: {
                css: "div.m-newspage-article-container article.m-newspage-article",
                value: ".//div[contains(@class, \"m-newspage-article-text-box\")]/node()"
            }
        }
    });

    await addSource({
        name: "本田小狼与我",
        guidPrefix: "supercub",
        url: "https://supercub-anime.com/news/",
        index: {
            url: ["div#list_01>table tr div.title a", "{{ url | to_uri: 'https://supercub-anime.com/news/' }}"],
            idTemplate: "{{url}}",
            title: "div#list_01>table tr div.title a",
            date: "div#list_01>table tr td.day"
        },
        getExtractor: function(url) {
            if (url.startsWith("https://supercub-anime.com/news/")) {
                return { bodySelector: "div#news_block>div:first-of-type" };
            }
        }
    });

    await addSource({
        name: "异世界魔王与召唤少女的奴隶魔术Ω",
        guidPrefix: "isekaimaou",
        url: "https://isekaimaou-anime.com/news/",
        index: {
            url: "div.news--lineup article.md-newsblock a.linkwrap",
            idTemplate: "{{url}}",
            title: "div.news--lineup article.md-newsblock h3.ttl",
            date: "div.news--lineup article.md-newsblock div.date",
            thumb: {
                css: "div.news--lineup article.md-newsblock div.thumb>div.thumb",
                template: "body"
            }
        },
        description: {
            body: ["div.md-newsdetail--main", "{{thumb}}<br />{{body}}"]
        }
    });

    await addSource({
        name: "如果究极进化的完全沉浸RPG比现实还更像垃圾游戏的话",
        guidPrefix: "fulldiverpg",
        url: "https://fulldive-rpg.com/news.html",
        index: {
            url: ["div.page_contents_wrapper>ul li p.page_news_title>a", "https://fulldive-rpg.com/{{url}}"],
            idTemplate: "{{url}}",
            title: "div.page_contents_wrapper>ul li p.page_news_title>a",
            date: ["div.page_contents_wrapper>ul li p.page_news_date", "{{ date | replace: '. ', '.' }}"]
        },
        description: {
            body: "div.page_contents_wrapper"
        }
    });

    await addSource({
        name: "美妙世界 The Animation",
        guidPrefix: "subarashiki",
        url: "https://subarashiki-anime.jp/news",
        index: {
            url: "section.newsList>ul li>a",
            idTemplate: "{{url}}",
            title: "section.newsList>ul li>a>p",
            date: "section.newsList>ul li>a>span.date"
        },
        description: {
            body: "section.newsDetail>article"
        }
    });

    await addSource({
        name: "七骑士 -英雄的继承者-",
        guidPrefix: "sevenknights",
        url: "https://sevenknights-anime.jp/news/?page_id=1",
        index: {
            url: ["div.newslist>ul li>a", "https://sevenknights-anime.jp/news/{{url}}"],
            idTemplate: "{{url}}",
            title: [{ titleAndDate: "div.newslist>ul li>a" }, "{{ titleAndDate | remove_first: date }}"],
            date: "div.newslist>ul li>a>span"
        },
        description: {
            body: "div.newstext"
        }
    });

    await addSource({
        name: "BLUE REFLECTION RAY/澪",
        guidPrefix: "bluereflection_ray",
        url: "https://www.bluereflection-ray.com/news/",
        index: {
            url: "ul.news_list li>a",
            idTemplate: "{{url}}",
        },
        description: {
            title: "h1.news_title",
            date: ["p.news_date_label>span.date", "{{ date | regex_replace: '(\\d+)年(\\d+)月(\\d+)日', '\\1.\\2.\\3' }}"],
            body: "div.news_body"
        }
    });
}