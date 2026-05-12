import React, { useMemo, useState } from "react";
import { useEditor, EditorContent, Extension } from "@tiptap/react";
import * as Y from 'yjs';
import StarterKit from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { ySyncPlugin, yCursorPlugin, yUndoPlugin } from "y-prosemirror";


// Custom FontSize Extension
const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return {
      types: ['textStyle'],
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize?.replace('px', ''),
            renderHTML: attributes => {
              if (!attributes.fontSize) return {}
              return { style: `font-size: ${attributes.fontSize}px` }
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setFontSize: fontSize => ({ chain }) => {
        return chain().setMark('textStyle', { fontSize }).run()
      },
      unsetFontSize: () => ({ chain }) => {
        return chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run()
      },
    }
  },
});

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const fontSizes = ['12', '14', '16', '18', '20', '24', '30', '36', '48'];
  const colors = [
    { name: 'Black', value: '#000000' },
    { name: 'Gray', value: '#718096' },
    { name: 'Red', value: '#f56565' },
    { name: 'Orange', value: '#ed8936' },
    { name: 'Green', value: '#48bb78' },
    { name: 'Blue', value: '#4299e1' },
    { name: 'Indigo', value: '#667eea' },
    { name: 'Purple', value: '#9f7aea' },
  ];

  return (
    <div className="border-b border-gray-100 dark:border-gray-800 p-4 flex flex-wrap items-center gap-1 bg-gray-50/50 dark:bg-gray-900/50 sticky top-0 z-20 backdrop-blur-sm">
      <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-100 dark:border-gray-700 mr-2">
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          icon="fa-bold"
          title="Bold"
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          icon="fa-italic"
          title="Italic"
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          icon="fa-underline"
          title="Underline"
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          icon="fa-strikethrough"
          title="Strike"
        />
      </div>

      <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-100 dark:border-gray-700 mr-2">
        <ToolbarButton 
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          active={editor.isActive({ textAlign: 'left' })}
          icon="fa-align-left"
          title="Align Left"
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          active={editor.isActive({ textAlign: 'center' })}
          icon="fa-align-center"
          title="Align Center"
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          active={editor.isActive({ textAlign: 'right' })}
          icon="fa-align-right"
          title="Align Right"
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          active={editor.isActive({ textAlign: 'justify' })}
          icon="fa-align-justify"
          title="Justify"
        />
      </div>

      <div className="flex items-center gap-2 mr-2">
        <select 
          onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
          className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg px-2 py-1.5 text-[10px] font-bold text-gray-600 dark:text-gray-300 outline-none hover:border-indigo-300 transition"
          value={editor.getAttributes('textStyle').fontSize || '16'}
        >
          {fontSizes.map(size => (
            <option key={size} value={size}>{size}px</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1.5 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-100 dark:border-gray-700">
        {colors.map(color => (
          <button
            key={color.value}
            onClick={() => editor.chain().focus().setColor(color.value).run()}
            className={`w-5 h-5 rounded-md border-2 transition-transform hover:scale-110 ${
              editor.isActive('textStyle', { color: color.value }) ? 'border-gray-400 scale-110' : 'border-transparent'
            }`}
            style={{ backgroundColor: color.value }}
            title={color.name}
          />
        ))}
      </div>

      <div className="flex-grow" />

      <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-100 dark:border-gray-700">
        <ToolbarButton 
          onClick={() => editor.chain().focus().undo().run()}
          icon="fa-undo"
          title="Undo"
          disabled={!editor.can().undo()}
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().redo().run()}
          icon="fa-redo"
          title="Redo"
          disabled={!editor.can().redo()}
        />
      </div>
    </div>
  );
};

const ToolbarButton = ({ onClick, active, icon, title, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`w-8 h-8 flex items-center justify-center rounded-md transition-all ${
      active 
        ? 'bg-indigo-50 dark:bg-indigo text-indigo-600 dark:text-indigo-400' 
        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
    } ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
  >
    <i className={`fas ${icon} text-[11px]`}></i>
  </button>
);

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
        history: false, // Handled by Yjs
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      FontSize,
      Collaboration.configure({
        ydoc,
        provider,
      }),
    ],
    editorProps: {
      attributes: {
        class: 'focus:outline-none',
      },
    },
    content: "",
    autofocus: "end",
  });

  if (!editor) return null;

  return (
    <div className="flex flex-col h-[75vh]">
      <MenuBar editor={editor} />
      <div className="flex-grow p-10 overflow-auto custom-scrollbar workstation-editor prose dark:prose-invert max-w-none text-black">
        <EditorContent editor={editor} />
      </div>
    </div>
  );

};

export default TiptapEditor;

/**
 * Renders a read-only snapshot of a saved version.
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
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      FontSize,
      Extension.create({
        name: 'readOnlySync',
        addProseMirrorPlugins() {
          return [ySyncPlugin(fragment)];
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: 'focus:outline-none',
      },
    },
    content: '',
    editable: false,
  });

  if (!editor) return null;

  return (
    <div className="p-8 h-[50vh] overflow-auto custom-scrollbar opacity-90 pointer-events-none prose dark:prose-invert max-w-none">
      <EditorContent editor={editor} />
    </div>
  );
};

