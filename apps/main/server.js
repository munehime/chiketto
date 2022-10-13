const config = require("config");
const spawn = require("child_process").spawn;

const PORT = process.env.PORT || config.get("server.main.port");

process.env["SERVER_API_PUBLICURL"] = config.get("server.server.publicUrl");

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
