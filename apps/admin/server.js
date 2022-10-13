const config = require("config");
const spawn = require("child_process").spawn;

const PORT = process.env.PORT || config.get("servers.admin.port");

process.env["SERVERS_SERVER_PUBLICURL"] = config.get("servers.server.publicUrl");

const startServer = (command) => {
    spawn("npx", ["next", command, "-p", PORT], {
        shell: true,
        stdio: "inherit"
    });
};

switch (process.env.NODE_ENV) {
    case "production":
        startServer("start");
        break;

    default:
        startServer("dev");
        break;
}
