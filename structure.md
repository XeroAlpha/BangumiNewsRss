---
title: 番剧新闻聚合收集器
---

# 番剧新闻聚合收集器
一套番剧新闻聚合收集器由 [Scheduler](#Scheduler)、[Rss](#Rss)、（各网站的）[Index Agent](#Index-Agent)、（各网站的）[Merge Agent](#Merge-Agent) 组成，有些情况下需要 [Description Agent](#Description-Agent) 与 [ExtractorGenerator Agent](#ExtractorGenerator-Agent)。

[TOC]

## Huginn 及相关概念

[Huginn](https://github.com/huginn/huginn) 是基于 [Ruby on Rails](https://github.com/rails/rails) 开发的在线自动化任务执行服务。用户通过配置一系列的 Agent，可以执行一系列的自动化任务。这些 Agent 创建、消费事件，并且根据一个直观的图表将这些事件传递给另一个 Agent。
Huginn 支持大量的 Agent 种类，这里仅对使用到的 Agent 作简单介绍：

- Commander Agent：根据计划或事件触发、启用、禁用或配置其他 Agent。
- Website Agent：访问指定的 URL，并根据一定的规则提取数据。
- JavaScript Agent：可使用 JavaScript 编程的 Agent。
- Event Formatting Agent：根据指定的规则提取传入的事件的内容，并整合为新的事件再传出。
- Data Output Agent：以 RSS 或 JSON 的形式向外部公开传入的事件。

另外，Huginn 支持将 Agent 归为一组 Scenario 进行统一的操作，例如启用/禁用、删除、导入、分享等。

## Scheduler
Scheduler 为数据收集的触发端，是一个 Commander Agent。对于上季、当季与下季番剧每半小时触发一次，其余按小时分布在 24 个小整点。超过 6 年的 Scheduler 将被删除。不使用 Scheduler Agent 是因为 Scheduler Agent 不支持手动运行。

## Index Agent
Index Agent 为新闻索引端，是一个 Website Agent，用于解析新闻索引。通常由 [Scheduler](#Scheduler) 触发，本身不直接作为 Huginn 的计划任务执行。一般分两种。

适用于聚合式新闻页面的 Index Agent 格式如下：
```json
{
  "expected_update_period_in_days": "7",
  "url": "新闻页面URL",
  "type": "html",
  "mode": "on_change",
  "extract": {
    "id": {
      "css": "锚点",
      "value": "@id"
    },
    "title": {
      "css": "标题",
      "value": "normalize-space(.)"
    },
    "date": {
      "css": "发布日期",
      "value": "normalize-space(.)"
    },
    "body": {
      "css": "新闻正文",
      "value": "./node()"
    }
  },
  "template": {
    "url": "相对URL请补上前缀{{id}}"
  }
}
```

适用于分离式新闻页面的 Index Agent 格式如下：
```json
{
  "expected_update_period_in_days": "7",
  "url": "新闻索引页面URL",
  "type": "html",
  "mode": "on_change",
  "extract": {
    "id": {
      "css": "可选的ID，用于唯一标识新闻",
      "value": "@id"
    },
    "url": {
      "css": "详情URL",
      "value": "@href"
    },
    "title": {
      "css": "标题（可在Description Agent中获得）",
      "value": "normalize-space(.)"
    },
    "date": {
      "css": "发布日期（可在Description Agent中获得）",
      "value": "normalize-space(.)"
    }
  },
  "template": {
    "url": "相对URL请补上前缀{{url}}",
    "id": "{{url}}"
  }
}
```

## ExtractorGenerator Agent
ExtractorGenerator Agent 是一个 JavaScript Agent，用于生成正文解析器。这个部分一般只用于正文解析器不唯一的情况。通常格式如下：
```javascript
Agent.receive = function() {
  let events = this.incomingEvents();
  events.map(e => {
    let url = e.payload.url, bodySelector, bodyXPath;
    this.log("Generating Extractor: " + JSON.stringify(e));
    if (url.match(/^正则表达式/)) {
      bodySelector = "正文CSS选择器";
      bodyXPath = "./node()"
    } else if (url.match(/^正则表达式/)) {
      bodySelector = "正文CSS选择器";
      bodyXPath = "./node()"
    } else {
      bodySelector = "body";
      bodyXPath = "\"请在浏览器里打开\"";
    }
    return {
      ...e.payload,
      bodySelector, bodyXPath
    };
  }).forEach(e => this.createEvent(e));
}
```

## Description Agent
Description Agent 为新闻正文解析端，是一个 Website Agent。这个部分只用于分离式新闻收集。通常格式如下：
```json
{
  "expected_update_period_in_days": "7",
  "url": "{{url}}",
  "type": "html",
  "mode": "merge",
  "extract": {
    "body": {
      "css": "正文",
      "value": "./node()"
    }
  }
}
```

与ExtractorGenerator Agent配套使用则使用此固定Description Agent：
```json
{
  "expected_update_period_in_days": "7",
  "url": "{{url}}",
  "type": "html",
  "mode": "merge",
  "extract": {
    "body": {
      "css": "{{bodySelector}}",
      "value": "{{bodyXPath}}"
    }
  }
}
```

## Merge Agent
Merge Agent 为新闻收集的整合端，是一个 JavaScript Agent，用于将 [Index Agent](#Index-Agent) 与 [Description Agent](#Description-Agent)（若有）的数据转换为 RSS 可接受的格式。Index Agent 与 Description Agent 的格式可以与示例不同，但 Merge Agent 的输出格式必须相同。通常格式如下：
```javascript
Agent.receive = function() {
  let events = this.incomingEvents();
  events.map(e => {
    this.log("Transforming Event: " + JSON.stringify(e));
    return {
      "link": e.payload.url,
      "title": e.payload.title,
      "date": e.payload.date,
      "description": e.payload.body,
      "guid": "(XML ID)_(番剧ID)#" + e.payload.id,
      "category": "番剧名"
    };
  }).forEach(e => this.createEvent(e));
}
```

有时也会将上面的 JavaScript Agent 优化为一个 Event Formatting Agent ：
```json
{
  "instructions": {
    "link": "{{url}}",
    "title": "{{title}}",
    "date": "{{date}}",
    "description": "{{body}}",
    "guid": "(XML ID)_(番剧ID)#{{id}}",
    "category": "番剧名"
  },
  "matchers": [],
  "mode": "clean"
}
```

##　Rss
Rss 为数据的收集端，是一个 Data Output Agent，用于收集所有 [Merge Agent](#Merge-Agent) 提供的事件并整合为一个 RSS 源。通常格式如下：
```json
{
  "secrets": [
    "bangumi_news"
  ],
  "expected_receive_period_in_days": 2,
  "template": {
    "self": "http://rss.projectxero.top/bangumi/（XML_ID）.xml",
    "icon": "http://rss.projectxero.top/bangumi/icon/（XML_ID）.jpg",
    "title": "（季度）番剧新闻",
    "description": "本RSS源自动从番剧网站上收集新闻并打包为RSS",
    "link": "http://rss.projectxero.top",
    "copyright": "内容版权归原网站所有",
    "webMaster": "projectxero@163.com",
    "item": {
      "title": "【{{category}}】{{title}}",
      "pubDate": "{{date}}",
      "link": "{{link}}",
      "description": "{{description}}",
      "guid": "{{guid}}",
      "category": "{{category}}",
      "receivedDate": "{{created_at}}"
    }
  },
  "events_order": [
    [
      "{{date}}",
      "time",
      "false"
    ],
    [
      "{{created_at}}",
      "time",
      "false"
    ]
  ],
  "events_to_show": 20 * 收录的来源数量,
  "ns_media": "true",
  "ns_itunes": "true",
  "response_headers": {
    "Access-Control-Allow-Origin": "*"
  }
}
```

## 命名相关
推荐命名格式为：`{{季度ID}}-{{番剧名}}-{{Agent名}}`，其中季度 ID 为季度开始的月份的六位数字缩写。例如，`202101-工作细胞!!-Merge`。

## Scenario 相关
每个季度需要的所有 Agent 需要全部归入一个 Scenario，推荐命名格式为：`{{季度ID}}-Rss`。

为了方便整理所有 [Scheduler](#Scheduler)，需要将所有 Scheduler 归入一个 Scenario，推荐命名为：`RssScheduler`。
