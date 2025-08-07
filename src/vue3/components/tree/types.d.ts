export interface TreeNodeBase {
  id: string;
  children?: TreeNodeBase[];
}

export type TreeNodeStoreMeta<T extends TreeNodeBase> = {
  id: string;
  data: T;
  parent: TreeNodeStoreMeta<T> | null;
  level: number;
  isExpand: boolean;
  isActive: boolean;
};

export type TreeNodeScope<T extends TreeNodeBase> = {
  node: TreeNodeStoreMeta<T>;
  data: T;
};

export type TreeNode<T extends TreeNodeBase> = {
  id: string;
  data: T;
  children: TreeNode<T>[];
};

export type Filter = (value: string) => void;
export type NodeToggle<T> = (node: TreeNodeStoreMeta<T>) => void;
export type NodeHighlight = (dataId: string, isPath?: boolean) => void;
export type GetNodeMeta<T> = (id: string) => TreeNodeStoreMeta<T> | undefined | null;
export type NodeClick<T> = (node: TreeNodeStoreMeta<T>, data: T) => void;

export type TreeProvideInject<T extends TreeNodeBase> = {
  getNodeMeta: GetNodeMeta<T>;
  nodeClick: NodeClick<T>;
};

export type TreeInstance<T extends TreeNodeBase> = {
  filter: Filter<T>;
  nodeToggle: NodeToggle<T>;
  nodeHighlight: NodeHighlight<T>;
  getNodeMeta: GetNodeMeta<T>;
};
