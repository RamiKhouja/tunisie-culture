import FileUpload, { imageUrl } from './FileUpload';
import { useLanguage } from '@/i18n';
export const nameOf = (name, locale = 'en') => name?.[locale] || name?.en || name?.fr || name?.ar || '';
export const mediaUrl = imageUrl;
export const links = ['facebook', 'instagram', 'tiktok', 'linkedin', 'youtube', 'website'];
export const inputClass = 'mt-1 w-full rounded-xl border-[#9B7847]/35 bg-white text-sm';
export function Field({ label, type = 'text', value, onChange, ...props }) { return <label className="block text-sm font-semibold">{label}<input {...props} type={type} value={value ?? ''} onChange={e => onChange(e.target.value)} className={inputClass}/></label>; }
export function Check({ label, value, onChange }) { return <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(value)} onChange={e => onChange(e.target.checked)}/>{label}</label>; }
export function Select({ label, value, onChange, options, ...props }) { const { locale, t } = useLanguage(); return <label className="block text-sm font-semibold">{label}<select {...props} required value={value} onChange={e => onChange(e.target.value)} className={inputClass}><option value="">{t('selectState')}</option>{options.map(option => <option key={option.id} value={option.id}>{nameOf(option.name, locale) || option.name}</option>)}</select></label>; }
export const Upload = FileUpload;
export function Errors({ errors }) { return Object.keys(errors).length > 0 && <div role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-800">{Object.entries(errors).map(([key, message]) => <p key={key}>{key}: {message}</p>)}</div>; }
