import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { shareCommand } from "./commands/share.js";
import { htmlCommand } from "./commands/html.js";
import { webCommand } from "./commands/web.js";
import { desktopCommand } from "./commands/desktop.js";

yargs(hideBin(process.argv))
  .scriptName("stlite")
  .command(shareCommand)
  .command(htmlCommand)
  .command(webCommand)
  .command(desktopCommand)
  .demandCommand(1)
  .strict()
  .fail((msg, err) => {
    if (err) {
      console.error(`stlite: ${err.message}`);
    } else {
      console.error(msg);
    }
    process.exit(1);
  })
  .help()
  .parse();
