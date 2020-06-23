import meow from 'meow';
import { read } from './read';
import { format } from './format';
import { DirectoryNode, Options } from './types'

type Writer = (...args: any[]) => void;

export const main = (argv: Array<string>, stdout: Writer, stderr: Writer) => {
  const cli = meow(
    `
    Usage
      $ toy-tree <directory>

    Examples
      $ toy-tree
      $ toy-tree path/to/dir
    `,
    {
      flags: {
        level: {
          type: 'number',
          alias: 'L',
          default: Infinity,
        },
      },
      argv,
    },
  );

  const dir = cli.input[0] || '.';

  const options: Options = {
    level: cli.flags.level,
  };

  if (options.level < 1) {
    stderr('Error: Invalid level, must be greater than 0.');
    return 1;
  }

  let root: DirectoryNode;

  try {
    root = read(dir, options);
  } catch (e) {
    stderr(`Error: ${e.message}`);
    return 1;
  }

  const output = format(root);

  stdout(output);

  return 0;
};
