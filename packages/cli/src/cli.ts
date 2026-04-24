import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { shareCommand } from './share';

yargs(hideBin(process.argv))
  .command({
    command: 'share <path>',
    describe: 'Share the current project',
    builder: (yargs) =>
      yargs.positional('path', {
        type: 'string',
        describe: 'The path to the project to share',
        demandOption: true,
      }),
    handler: (argv) => {
      shareCommand(argv.path);
    }
  })
  .demandCommand()
  .help()
  .parse();
