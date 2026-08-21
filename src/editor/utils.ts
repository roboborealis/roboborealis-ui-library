import { Editor, Transforms, Element as SlateElement, Text } from 'slate';

import type { SlateValue, CustomElement, CustomText } from './types';

type MarkFormat = keyof Omit<CustomText, 'text'>;

type BlockFormat = CustomElement['type'];

const LIST_TYPES: BlockFormat[] = ['bulleted-list', 'numbered-list'];

/**
 * Checks if a text mark (bold, italic, underline, code) is active at the
 * current editor selection.
 */
export function isMarkActive(editor: Editor, format: MarkFormat): boolean {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
}

/**
 * Toggles a text mark on or off at the current editor selection.
 */
export function toggleMark(editor: Editor, format: MarkFormat): void {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
}

/**
 * Checks if a block type is active at the current editor selection.
 * Pass `blockType` to check a specific property instead of `type`.
 */
export function isBlockActive(
  editor: Editor,
  format: BlockFormat,
  blockType: keyof CustomElement = 'type',
): boolean {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        (n as CustomElement)[blockType] === format,
    }),
  );

  return !!match;
}

/**
 * Toggles a block type (heading, list, paragraph) on the current selection.
 */
export function toggleBlock(editor: Editor, format: BlockFormat): void {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  // Unwrap any existing list wrapper
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes((n as CustomElement).type),
    split: true,
  });

  let newProperties: Partial<SlateElement>;

  if (isActive) {
    // Toggle off — revert to paragraph
    newProperties = { type: 'paragraph' } as Partial<SlateElement>;
  } else if (isList) {
    // Wrap in list — set children to list-item nodes
    newProperties = { type: 'list-item' } as Partial<SlateElement>;
  } else {
    newProperties = { type: format } as Partial<SlateElement>;
  }

  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] } as unknown as CustomElement;
    Transforms.wrapNodes(editor, block);
  }
}

/**
 * Inserts a link element wrapping the current selection (or inserting at cursor).
 * If `text` is provided and there is no selection, inserts the text as the link label.
 */
export function insertLink(editor: Editor, url: string, text?: string): void {
  if (!url) return;

  const { selection } = editor;
  const isCollapsed = selection && selection.anchor.offset === selection.focus.offset;

  if (isCollapsed) {
    // Insert a new link node with the given text (or url as fallback)
    const linkNode = {
      type: 'link' as const,
      url,
      children: [{ text: text ?? url }],
    };
    Transforms.insertNodes(editor, linkNode);
  } else {
    // Wrap the existing selection in a link node
    Transforms.wrapNodes(
      editor,
      { type: 'link' as const, url, children: [] },
      { split: true },
    );
    Transforms.collapse(editor, { edge: 'end' });
  }
}

/**
 * Removes the nearest link element wrapping the current selection.
 */
export function removeLink(editor: Editor): void {
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      (n as CustomElement).type === 'link',
  });
}

/**
 * Extracts plain text from a Slate value (for character count purposes).
 */
export function slateToText(value: SlateValue): string {
  return value
    .map((node) => {
      if (Text.isText(node)) {
        return node.text;
      }
      // Recursively extract text from element children
      const element = node as CustomElement;
      if ('children' in element) {
        return (element.children as Array<{ text?: string; children?: unknown[] }>)
          .map((child) => {
            if ('text' in child && typeof child.text === 'string') {
              return child.text;
            }
            if ('children' in child && Array.isArray(child.children)) {
              return (child.children as Array<{ text?: string }>)
                .map((c) => (typeof c.text === 'string' ? c.text : ''))
                .join('');
            }
            return '';
          })
          .join('');
      }
      return '';
    })
    .join('\n');
}

/**
 * Returns true when the Slate value contains only a single empty paragraph.
 */
export function isSlateValueEmpty(value: SlateValue): boolean {
  if (value.length !== 1) return false;
  const first = value[0] as CustomElement;
  if (!SlateElement.isElement(first) || first.type !== 'paragraph') return false;
  if (first.children.length !== 1) return false;
  const onlyChild = first.children[0];
  return Text.isText(onlyChild) && onlyChild.text === '';
}
