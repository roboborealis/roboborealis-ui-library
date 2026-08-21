import type { BaseEditor, Descendant } from 'slate';
import type { ReactEditor } from 'slate-react';
import type { HistoryEditor } from 'slate-history';

export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
};

export type HeadingElement = {
  type: 'heading-one' | 'heading-two' | 'heading-three' | 'heading-four';
  children: CustomText[];
};

export type ParagraphElement = {
  type: 'paragraph';
  children: CustomText[];
};

export type BulletedListElement = {
  type: 'bulleted-list';
  children: ListItemElement[];
};

export type NumberedListElement = {
  type: 'numbered-list';
  children: ListItemElement[];
};

export type ListItemElement = {
  type: 'list-item';
  children: CustomText[];
};

export type LinkElement = {
  type: 'link';
  url: string;
  children: CustomText[];
};

export type HorizontalRuleElement = {
  type: 'horizontal-rule';
  children: [{ text: '' }];
};

export type CustomElement =
  | HeadingElement
  | ParagraphElement
  | BulletedListElement
  | NumberedListElement
  | ListItemElement
  | LinkElement
  | HorizontalRuleElement;

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

export type SlateValue = Descendant[];

export const EMPTY_SLATE_VALUE: SlateValue = [
  { type: 'paragraph', children: [{ text: '' }] },
];
