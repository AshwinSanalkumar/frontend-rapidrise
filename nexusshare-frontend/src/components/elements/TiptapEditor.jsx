import React, { useMemo } from "react";
import { useEditor, EditorContent, Extension } from "@tiptap/react";
import * as Y from 'yjs';
import StarterKit from "@tiptap/starter-kit";
import { ySyncPlugin, yCursorPlugin, yUndoPlugin } from "y-prosemirror";

const Collaboration = Extension.create({
  name: 'collaboration',
  addOptions() {
    return {
      ydoc: null,
      provider: null,
    }
  },
  addProseMirrorPlugins() {
    return [
      ySyncPlugin(this.options.ydoc.getXmlFragment("prosemirror")),
      yCursorPlugin(this.options.provider.awareness, {
        cursorBuilder: (user) => {
          const cursor = document.createElement('span');
          cursor.classList.add('ProseMirror-yjs-cursor');
          cursor.setAttribute('style', `border-left-color: ${user.color || '#000000'}; border-left-width: 2px; border-left-style: solid; position: absolute; word-break: normal; pointer-events: none; margin-left: -1px;`);
          
          const userDiv = document.createElement('div');
          userDiv.setAttribute('style', `background-color: ${user.color || '#000000'}; position: absolute; top: -1.25em; left: -1px; font-size: 11px; font-weight: bold; font-family: ui-sans-serif, system-ui, sans-serif; color: white; border-radius: 4px; border-bottom-left-radius: 0; padding: 2px 6px; white-space: nowrap; user-select: none; pointer-events: none; z-index: 10;`);
          
          userDiv.appendChild(document.createTextNode(user.name || 'Anonymous'));
          cursor.appendChild(userDiv);
          
          return cursor;
        }
      }),
      yUndoPlugin(),
    ];
  },
});

const TiptapEditor = ({ ydoc, provider }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      Collaboration.configure({
        ydoc,
        provider,
      }),
    ],
    content: "",
    autofocus: "end",
  });

  if (!editor) return null;

  return (
    <div className="p-10 h-[65vh] overflow-auto custom-scrollbar workstation-editor">
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;

/**
 * Renders a read-only snapshot of a saved version.
 * content: the raw string stored in the DB ("yjs:base64..." or plain text)
 */
export const ReadOnlyEditor = ({ content }) => {
  const ydoc = useMemo(() => {
    const doc = new Y.Doc();
    if (content && content.startsWith('yjs:')) {
      try {
        const base64 = content.replace(/^yjs:/, '');
        const binary = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
        Y.applyUpdate(doc, binary);
      } catch (e) {
        console.error('ReadOnlyEditor: failed to decode yjs state', e);
      }
    } else if (content) {
      const fragment = doc.getXmlFragment('prosemirror');
      const para = new Y.XmlElement('paragraph');
      para.insert(0, [new Y.XmlText(content)]);
      fragment.insert(0, [para]);
    }
    return doc;
  }, [content]);

  const fragment = useMemo(() => ydoc.getXmlFragment('prosemirror'), [ydoc]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ history: false }),
      Extension.create({
        name: 'readOnlySync',
        addProseMirrorPlugins() {
          return [ySyncPlugin(fragment)];
        },
      }),
    ],
    content: '',
    editable: false,
  });

  if (!editor) return null;

  return (
    <div className="p-8 h-[50vh] overflow-auto custom-scrollbar opacity-90 pointer-events-none">
      <EditorContent editor={editor} />
    </div>
  );
};
