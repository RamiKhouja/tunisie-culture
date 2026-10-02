const languages = [['en', 'English'], ['fr', 'Français'], ['ar', 'العربية']];

export default function TranslatableFields({ label, field, value = {}, onChange, errors = {}, multiline = false, required = false }) {
    const Input = multiline ? 'textarea' : 'input';
    return <fieldset>
        <legend className="mb-3 text-sm font-semibold text-[#44301D]">{label}{required && <span className="text-red-700"> *</span>}</legend>
        <div className="grid gap-3 md:grid-cols-3">
            {languages.map(([code, name]) => <label key={code} className="block">
                <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-[#44301D]/55">{name}</span>
                <Input dir={code === 'ar' ? 'rtl' : 'ltr'} rows={multiline ? 4 : undefined} value={value?.[code] || ''} onChange={(e) => onChange({ ...value, [code]: e.target.value })} className="w-full rounded-xl border-[#9B7847]/35 bg-white text-sm focus:border-[#747A3C] focus:ring-[#747A3C]" />
                {(errors[`${field || label.toLowerCase().replaceAll(' ', '_')}.${code}`] || errors[`${label.toLowerCase().replaceAll(' ', '_')}.${code}`]) && <span className="mt-1 block text-xs text-red-700">{errors[`${field || label.toLowerCase().replaceAll(' ', '_')}.${code}`] || errors[`${label.toLowerCase().replaceAll(' ', '_')}.${code}`]}</span>}
            </label>)}
        </div>
    </fieldset>;
}
