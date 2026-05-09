import '../styles/auth.css';

export default function AuthPageShell({ title, subtitle, children, footer }) {
  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <h1 className="auth-title">{title}</h1>
        {subtitle ? <p className="auth-subtitle">{subtitle}</p> : null}
        {children}
        {footer}
      </div>
    </div>
  );
}
