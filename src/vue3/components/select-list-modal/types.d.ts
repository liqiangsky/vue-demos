import type { Callback, OptionItem } from '@/types/common.d.ts';

export interface ListItem<T> extends OptionItem<T> {
  id: string;
}

export type ModalOptions<Data> = {
  onConfirm?: Callback<Data> | null;
  onCancel?: Callback | null;
};

export type Options<T> = {
  title?: string;
  selected?: (() => Promise<string[]>) | (() => string[]);
  options?: (() => Promise<ListItem<T>[]>) | (() => ListItem<T>[]);
} & ModalOptions<T[]>;

export type SelectListModalInstance<T = unknown> = {
  open: Callback<Options<T>>;
};
