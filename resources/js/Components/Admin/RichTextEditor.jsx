import { useEffect, useRef } from 'react';

export default function RichTextEditor({ label, value, onChange }) {
    const editor = useRef(null);
    useEffect(() => { if (editor.current.innerHTML !== (value || '')) editor.current.innerHTML = value || ''; }, [value]);
    return <label className="block"><span className="mb-2 block text-sm font-semibold">{label}</span>
        <div className="overflow-hidden rounded-xl border border-[#9B7847]/35 bg-white">
            <div className="flex gap-2 border-b p-2">{[['bold', 'Bold'], ['italic', 'Italic'], ['insertUnorderedList', 'List'], ['removeFormat', 'Clear format']].map(([command, title]) => <button key={command} type="button" className="rounded bg-stone-100 px-3 py-1 text-xs" onMouseDown={e => e.preventDefault()} onClick={() => { editor.current.focus(); document.execCommand(command); onChange(editor.current.innerHTML); }}>{title}</button>)}</div>
            <div ref={editor} role="textbox" aria-label={label} aria-multiline="true" contentEditable suppressContentEditableWarning className="rich-text min-h-32 p-3 outline-none" onInput={e => onChange(e.currentTarget.innerHTML)} onPaste={e => { e.preventDefault(); document.execCommand('insertText', false, e.clipboardData.getData('text/plain')); }}/>
        </div>
    </label>;
}
