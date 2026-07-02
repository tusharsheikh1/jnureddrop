import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';

const ToolbarBtn = ({ onClick, active, title, children }) => (
  <button
    type="button"
    onMouseDown={e => { e.preventDefault(); onClick(); }}
    title={title}
    className={`p-1.5 rounded-lg text-sm transition-colors ${
      active
        ? 'bg-red-100 text-red-700'
        : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
    }`}
  >
    {children}
  </button>
);

const Divider = () => <div className="w-px h-5 bg-gray-200 mx-1 self-center" />;

export default function RichTextEditor({ value, onChange, placeholder = 'Write your post content here...' }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
    ],
    content: value || '',
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[240px] px-4 py-3 text-gray-800',
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || '', false);
    }
  }, [value]);

  if (!editor) return null;

  const chain = () => editor.chain().focus();

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 focus-within:bg-white focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100 transition-all overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-gray-100 bg-white">
        {/* Headings */}
        <ToolbarBtn title="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => chain().toggleHeading({ level: 2 }).run()}>
          <span className="font-bold text-xs">H2</span>
        </ToolbarBtn>
        <ToolbarBtn title="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => chain().toggleHeading({ level: 3 }).run()}>
          <span className="font-bold text-xs">H3</span>
        </ToolbarBtn>

        <Divider />

        {/* Inline */}
        <ToolbarBtn title="Bold" active={editor.isActive('bold')} onClick={() => chain().toggleBold().run()}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h8a4 4 0 010 8H6zm0 8h9a4 4 0 010 8H6z" /></svg>
        </ToolbarBtn>
        <ToolbarBtn title="Italic" active={editor.isActive('italic')} onClick={() => chain().toggleItalic().run()}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M10 4h4l-4 16H6z" /></svg>
        </ToolbarBtn>
        <ToolbarBtn title="Strikethrough" active={editor.isActive('strike')} onClick={() => chain().toggleStrike().run()}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" d="M5 12h14M12 5a4 4 0 014 4m-8 0a4 4 0 000 4 4 4 0 004 3" /></svg>
        </ToolbarBtn>
        <ToolbarBtn title="Code" active={editor.isActive('code')} onClick={() => chain().toggleCode().run()}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
        </ToolbarBtn>

        <Divider />

        {/* Lists */}
        <ToolbarBtn title="Bullet list" active={editor.isActive('bulletList')} onClick={() => chain().toggleBulletList().run()}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
        </ToolbarBtn>
        <ToolbarBtn title="Ordered list" active={editor.isActive('orderedList')} onClick={() => chain().toggleOrderedList().run()}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" /></svg>
        </ToolbarBtn>
        <ToolbarBtn title="Blockquote" active={editor.isActive('blockquote')} onClick={() => chain().toggleBlockquote().run()}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M10 7H6a2 2 0 00-2 2v3a2 2 0 002 2h2l-1 4h2l1.5-4H10V7zm8 0h-4a2 2 0 00-2 2v3a2 2 0 002 2h2l-1 4h2l1.5-4H18V7z" /></svg>
        </ToolbarBtn>
        <ToolbarBtn title="Code block" active={editor.isActive('codeBlock')} onClick={() => chain().toggleCodeBlock().run()}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 9l-3 3 3 3m6-6l3 3-3 3" /></svg>
        </ToolbarBtn>

        <Divider />

        {/* History */}
        <ToolbarBtn title="Undo" active={false} onClick={() => chain().undo().run()}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a6 6 0 016 6v1M3 10l4-4M3 10l4 4" /></svg>
        </ToolbarBtn>
        <ToolbarBtn title="Redo" active={false} onClick={() => chain().redo().run()}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 10H11a6 6 0 00-6 6v1M21 10l-4-4m4 4l-4 4" /></svg>
        </ToolbarBtn>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />
    </div>
  );
}
