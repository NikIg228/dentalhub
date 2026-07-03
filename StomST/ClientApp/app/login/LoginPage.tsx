"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { createLocalSession, isLocalSessionActive, verifyLocalPassword } from "@/lib/local-auth";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canOpenDemo = process.env.NODE_ENV !== "production";

  useEffect(() => {
    if (isLocalSessionActive()) {
      router.replace(getSafeNextPath());
    }
  }, [router]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    window.setTimeout(() => {
      if (!verifyLocalPassword(password)) {
        setError("Неверный пароль.");
        setIsSubmitting(false);
        return;
      }

      createLocalSession(remember);
      setIsSubmitting(false);
      router.replace(getSafeNextPath());
    }, 250);
  }

  return (
    <main className="login-page">
      <section className="login-hero">
        <div className="login-brand">
          <span>D</span>
          DentHub
        </div>

        <div className="login-copy">
          <h1>Вход в рабочий контур клиники.</h1>
          <p>Доступ к потребностям, поставщикам, заказам и документам в одном защищенном интерфейсе.</p>
        </div>

        <div className="login-showcase" aria-hidden="true">
          <div className="showcase-card primary">
            <span>Сегодня в работе</span>
            <strong>24</strong>
            <small>активных заказа · 538 поставщиков</small>
          </div>
        </div>
      </section>

      <section className="login-panel" aria-label="Форма входа">
        <div className="login-panel-head">
          <span className="lock-icon">
            <LockKeyhole size={22} />
          </span>
          <div>
            <h2>Вход</h2>
            <p>Введите пароль доступа к демонстрационному контуру.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            <span>Пароль</span>
            <div className="password-field">
              <input
                autoComplete="current-password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Введите пароль"
                required
                type={showPassword ? "text" : "password"}
                value={password}
              />
              <button
                type="button"
                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <label className="remember-row">
            <input checked={remember} onChange={(event) => setRemember(event.target.checked)} type="checkbox" />
            <span>Запомнить меня на этом устройстве</span>
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <button className="login-button" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Входим..." : "Войти"}
            <ArrowRight size={18} />
          </button>
        </form>

        {canOpenDemo ? (
          <Link className="demo-link" href="/need">
            Открыть демо-экран
          </Link>
        ) : null}
      </section>
    </main>
  );
}

function getSafeNextPath() {
  if (typeof window === "undefined") {
    return "/need";
  }

  const next = new URLSearchParams(window.location.search).get("next");
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/need";
  }

  return next;
}
