import { useEffect, useId, useState } from 'react';

export const imageUrl = path => /^(https?:\/\/|\/|blob:|data:)/i.test(path) ? path : `/storage/${path}`;

export default function FileUpload({ label, required, accept = 'image/*', multiple = false, onChange, current, error }) {
    const inputId = useId();
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const images = accept.includes('image');

    useEffect(() => {
        const next = files.filter(file => file.type.startsWith('image/')).map(file => ({ url: URL.createObjectURL(file), name: file.name }));
        setPreviews(next);
        return () => next.forEach(preview => URL.revokeObjectURL(preview.url));
    }, [files]);

    const saved = images && (multiple || !files.length)
        ? (Array.isArray(current) ? current : current ? [current] : []) : [];

    return <div className="rounded-xl border border-dashed border-[#9B7847]/50 bg-white/60 p-4">
        <label htmlFor={inputId} className="mb-2 block cursor-pointer text-sm font-semibold">{label}{required && ' *'}</label>
        <input id={inputId} type="file" accept={accept} multiple={multiple} aria-required={required || undefined} aria-invalid={Boolean(error)} onChange={event => {
            const selected = Array.from(event.target.files || []);
            const next = multiple
                ? [...files, ...selected].filter((file, index, all) => all.findIndex(candidate => candidate.name === file.name && candidate.size === file.size && candidate.lastModified === file.lastModified) === index)
                : selected;
            setFiles(next);
            onChange(multiple ? next : next[0] || null);
            event.target.value = '';
        }} className="block w-full text-xs file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-[#EED9AE] file:px-3 file:py-2" />
        {(saved.length > 0 || previews.length > 0) && <div className="mt-4 flex flex-wrap gap-3" aria-live="polite">
            {saved.map((path, index) => <figure key={`${path}-${index}`} className="w-32"><img src={imageUrl(path)} alt={`Saved ${label.toLowerCase()} ${index + 1}`} className="h-28 w-full rounded-lg border border-[#9B7847]/20 bg-white object-contain" /><figcaption className="mt-1 text-xs text-[#80674c]">Saved image</figcaption></figure>)}
            {previews.map((preview, index) => <figure key={`${preview.url}-${index}`} className="w-32"><img src={preview.url} alt={`Selected ${label.toLowerCase()}: ${preview.name}`} className="h-28 w-full rounded-lg border border-[#9B7847]/20 bg-white object-contain" /><figcaption className="mt-1 truncate text-xs text-[#80674c]" title={preview.name}>{preview.name}</figcaption></figure>)}
        </div>}
        {!images && current && <span className="mt-2 block text-xs text-[#80674c]">Current: {current}</span>}
        {error && <span role="alert" className="mt-2 block text-xs text-red-700">{error}</span>}
    </div>;
}
