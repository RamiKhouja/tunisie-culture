const languages = [['en', 'English'], ['fr', 'Français'], ['ar', 'العربية']];

export default function TranslatableFields({ label, field, value = {}, onChange, errors = {}, multiline = false, required = false }) {
    const Input = multiline ? 'textarea' : 'input';
    return <fieldset>
        <legend className="register-label mb-3">{label}{required && <span className="text-red-700"> *</span>}</legend>
        <div className="grid gap-3 md:grid-cols-3">
            {languages.map(([code, name]) => <label key={code} className="block">
                <span className="register-label mb-1 block text-xs">{name}</span>
                <Input dir={code === 'ar' ? 'rtl' : 'ltr'} rows={multiline ? 4 : undefined} value={value?.[code] || ''} onChange={(e) => onChange({ ...value, [code]: e.target.value })} className="register-input w-full" />
                {(errors[`${field || label.toLowerCase().replaceAll(' ', '_')}.${code}`] || errors[`${label.toLowerCase().replaceAll(' ', '_')}.${code}`]) && <span className="mt-1 block text-xs text-red-700">{errors[`${field || label.toLowerCase().replaceAll(' ', '_')}.${code}`] || errors[`${label.toLowerCase().replaceAll(' ', '_')}.${code}`]}</span>}
            </label>)}
        </div>
    </fieldset>;
}
