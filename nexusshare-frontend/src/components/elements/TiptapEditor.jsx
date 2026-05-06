import React from "react";
import { useEditor, EditorContent, Extension } from "@tiptap/react";
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
      yCursorPlugin(this.options.provider.awareness),
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
      <style>
        {`
          .workstation-editor .ProseMirror-yjs-cursor > div {
            display: none !important;
          }
        `}
      </style>
    </div>
  );
};

export default TiptapEditor;
