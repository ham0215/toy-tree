export type TODO_any = any;

interface BaseNode<T> {
  type: T;
  name: string;
}

export interface FileNode extends BaseNode<'file'> { }

export interface DirectoryNode extends BaseNode<'directory'> {
  children: TreeNode[];
}

export interface SymlinkNode extends BaseNode<'symlink'> {
  link: string;
}

export type TreeNode = FileNode | DirectoryNode | SymlinkNode;

export interface Options {
  level: number;
}