import { useState } from 'react';

export default function AuthScreen({ onSignIn, onSignUp }) {
  const [mode, setMode]         = useState('signin'); // 'signin' | 'signup' | 'confirm'
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [busy, setBusy]         = useState(false);

  const reset = (m) => { setMode(m); setError(''); };

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setBusy(true);

    if (mode === 'signin') {
      const err = await onSignIn(email.trim(), password);
      setBusy(false);
      if (err) setError(err);
      return;
    }

    // signup
    const res = await onSignUp(email.trim(), password);
    setBusy(false);
    if (res.error) { setError(res.error); return; }
    if (res.needsConfirm) { setMode('confirm'); return; }
    // res.ok → logged in automatically
  };

  // ── Confirmation-pending screen ──
  if (mode === 'confirm') {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <h1 className="auth-logo">Проверь почту</h1>
          <p className="auth-sub" style={{ marginBottom: 20 }}>
            Мы отправили письмо на <b>{email.trim()}</b>. Открой его и нажми
            ссылку <b>«Confirm email address»</b> — приложение откроется уже с твоим аккаунтом.
          </p>
          <button className="btn-primary auth-submit" onClick={() => reset('signin')}>
            Я подтвердил — войти
          </button>
          <p className="muted" style={{ textAlign: 'center', marginTop: 16, fontSize: '0.78rem' }}>
            Письмо не пришло? Проверь «Спам». Встроенная почта Supabase иногда
            доставляет с задержкой.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <h1 className="auth-logo">Weight Tracker</h1>
        <p className="auth-sub">
          {mode === 'signin' ? 'Вход в аккаунт' : 'Создание аккаунта'}
        </p>

        <form onSubmit={submit} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <input
            type="password"
            placeholder="Пароль (мин. 6 символов)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            minLength={6}
            required
          />

          {error && <p className="error" style={{ textAlign: 'center' }}>{error}</p>}

          <button type="submit" className="btn-primary auth-submit" disabled={busy}>
            {busy ? '...' : mode === 'signin' ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>

        <button className="auth-switch" onClick={() => reset(mode === 'signin' ? 'signup' : 'signin')}>
          {mode === 'signin'
            ? 'Нет аккаунта? Зарегистрироваться'
            : 'Уже есть аккаунт? Войти'}
        </button>
      </div>
    </div>
  );
}
