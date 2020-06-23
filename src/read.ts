import fs from 'fs';
import path from 'path';
import { TreeNode, Options, DirectoryNode } from './types'

export const read = (dir: string, options: Options): DirectoryNode => {
  let stat: fs.Stats;

  try {
    stat = fs.statSync(dir);
  } catch (e) {
    throw new Error(`"${dir}" does not exists.`);
  }

  if (!stat.isDirectory()) {
    throw new Error(`"${dir}" can't be opened as a directory.`);
  }

  const root: DirectoryNode = {
    type: 'directory',
    name: dir,
    children: readDirectory(dir, 1, options),
  };

  return root;
}

const readDirectory = (dir: string, depth: number, options: Options) => {
  if (options.level < depth) {
    return [];
  }

  const dirents = fs.readdirSync(dir, {
    withFileTypes: true,
  });

  const nodes: TreeNode[] = [];

  dirents.forEach((dirent) => {
    if (dirent.name.startsWith('.')) {
      return;
    }

    if (dirent.isFile()) {
      nodes.push({
        type: 'file',
        name: dirent.name,
      });
    } else if (dirent.isDirectory()) {
      nodes.push({
        type: 'directory',
        name: dirent.name,
        children: readDirectory(
          path.join(dir, dirent.name),
          depth + 1,
          options,
        ),
      });
    } else if (dirent.isSymbolicLink()) {
      nodes.push({
        type: 'symlink',
        name: dirent.name,
        link: fs.readlinkSync(path.join(dir, dirent.name)),
      });
    }
  });

  return nodes;
}