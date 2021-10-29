const fs = require("fs");
const nodePath = require("path");
const { BangumiRssManager } = require("./manager");
const { awaitEvent } = require("./utils");

async function main() {
    let config = require("./conf.json");
    let manager = new BangumiRssManager(config);
    manager
        .on("error", (err) => console.error(err))
        .on("timeEvent", (label, startOrEnd) => {
            if (startOrEnd == "start") {
                console.time(label);
            } else {
                console.timeEnd(label);
            }
        })
        .on("busy", (workerStatus) =>
            console.log(
                `Huginn is busy: ${workerStatus.pending} worker(s) is pending`
            )
        )
        .on("createAgent", (agentOptions) =>
            console.log("Creating Agent: " + agentOptions.name)
        )
        .on("updateAgent", (agentOptions) =>
            console.log("Updating Agent: " + agentOptions.name)
        )
        .on("createScenario", (scenarioOptions) =>
            console.log("Creating Scenario: " + scenarioOptions.name)
        )
        .on("cleanAgent", (agentOptions) =>
            console.log("Cleaning Agent: " + agentOptions.name)
        )
        .on("debugSourcePipe", (agentPipe) =>
            console.log("Add Source:", agentPipe)
        )
        .on("generateReport", (reportPath) =>
            console.log("Generating Report: " + reportPath)
        )
        .on("agentError", (agent, detailUrl) =>
            console.log(
                `Warning: Error occured at last execution of ${agent.name}: ${detailUrl}`
            )
        )
        .on("updateSourceSuccess", (updateCount, sourceId) =>
            console.log(
                `Source Updated: ${updateCount} agent(s) of ${sourceId}`
            )
        )
        .on("scriptLog", console.log.bind(console));
    console.log(`Logging in as ${config.user} (${config.site})`);
    await manager.login();
    console.log("Preloading");
    await Promise.all([
        manager.reloadAgents(),
        manager.reloadScenarios(),
        manager.waitUntilFree()
    ]);
    let watcher = fs.watch(nodePath.resolve(__dirname, "../seasons"));
    let indexUpdateRequired = false, indexLock = false;
    process.nextTick(async function self() {
        if (indexUpdateRequired && !indexLock) {
            indexUpdateRequired = false;
            try {
                console.log("Updating Index");
                await manager.updateIndex();
            } catch (err) {
                console.error(err);
            }
        }
        setTimeout(self, 10000);
    });
    while (true) {
        try {
            indexLock = true;
            console.log("----- Script executed");
            await manager.executeScript();
            console.log("----- Script execute successfully");
            indexLock = false;
            indexUpdateRequired = true;
        } catch (err) {
            console.error(err);
        }
        await awaitEvent(watcher, "change");
    }
}

main().catch((err) => {
    console.error(err);
    debugger;
});
