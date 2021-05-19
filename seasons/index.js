module.exports = async function(host) {
    // 2021年春季番剧新闻
    console.log("Loading 2021-04");
    await require("./2021-04")(host);

    // 通用
    console.log("Loading Common");
    await require("./common")(host);
}