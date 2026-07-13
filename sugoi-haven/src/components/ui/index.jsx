/* shadcn-style primitives, themed to the Sugoi Haven token system.
   (shadcn registry is unreachable in the build sandbox; these mirror its anatomy.) */
import { Link } from 'react-router-dom';

const btn = {
  primary: 'bg-ume text-washi hover:bg-ume-deep', // warm accent: CTAs only
  indigo: 'bg-aizuri text-washi hover:bg-aizuri-deep',
  outline: 'border border-sumi/25 text-sumi hover:border-aizuri hover:text-aizuri bg-transparent',
  ghost: 'text-aizuri hover:text-aizuri-deep underline-offset-4 hover:underline bg-transparent',
};
const btnBase =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded px-5 py-2.5 text-sm font-medium tracking-wide transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-45';

export function Button({ variant = 'primary', to, className = '', ...props }) {
  const cls = `${btnBase} ${btn[variant]} ${className}`;
  return to ? <Link to={to} className={cls} {...props} /> : <button type="button" className={cls} {...props} />;
}

export function Badge({ tone = 'indigo', className = '', children }) {
  const tones = {
    indigo: 'bg-aizuri text-washi',
    mist: 'bg-aizuri-mist/30 text-aizuri-deep',
    ume: 'bg-ume text-washi', // price/accent use only
    paper: 'bg-washi-deep text-sumi-soft border border-sumi/15',
  };
  return (
    <span className={`inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium tracking-wide ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}

export function Card({ className = '', children, ...props }) {
  return (
    <div className={`rounded-md border border-sumi/12 bg-washi shadow-[0_1px_3px_rgba(34,31,27,0.07)] ${className}`} {...props}>
      {children}
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-sumi-soft">{label}</span>
      {children}
    </label>
  );
}

export const inputCls =
  'w-full rounded border border-sumi/25 bg-washi px-3 py-2 text-sm text-sumi placeholder:text-sumi-soft/60 focus:border-aizuri';
