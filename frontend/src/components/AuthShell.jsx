import React from "react";

const AuthShell = ({
  eyebrow,
  title,
  description,
  asideTitle,
  asideDescription,
  asideStats = [],
  showAside = true,
  children,
}) => {
  return (
    <div className="auth-shell">
      <div className={`auth-card ${showAside ? "" : "auth-card-simple"}`}>
        {showAside && (
          <section className="auth-hero">
            <div className="auth-hero-orb auth-hero-orb-one" />
            <div className="auth-hero-orb auth-hero-orb-two" />

            <div className="relative z-10">
              <p className="auth-eyebrow">{eyebrow}</p>
              <h1 className="auth-hero-title">{asideTitle}</h1>
              <p className="auth-hero-copy">{asideDescription}</p>
            </div>

            {asideStats.length > 0 && (
              <div className="relative z-10 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {asideStats.map((item) => (
                  <div key={item.label} className="auth-stat">
                    <p className="auth-stat-label">{item.label}</p>
                    <p className="auth-stat-value">{item.value}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        <section className="auth-form-panel">
          <div className="auth-form-copy">
            <p className="auth-eyebrow text-slate-500">{eyebrow}</p>
            <h2 className="auth-form-title">{title}</h2>
            <p className="auth-form-description">{description}</p>
          </div>

          {children}
        </section>
      </div>
    </div>
  );
};

export default AuthShell;
