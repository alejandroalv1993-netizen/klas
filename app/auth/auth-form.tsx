"use client";

import { useActionState, useState } from "react";
import { ArrowRight, LockKeyhole, Mail, UserRound } from "lucide-react";
import { signIn, signUp, type AuthState } from "@/app/auth/actions";
import Link from "next/link";

const initialState: AuthState = {};

export function AuthForm({ next = "/dashboard" }: { next?: string }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loginState, loginAction, loginPending] = useActionState(signIn, initialState);
  const [registerState, registerAction, registerPending] = useActionState(signUp, initialState);
  const state = mode === "login" ? loginState : registerState;
  const pending = loginPending || registerPending;

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 flex border-b border-black/10">
        {(["login", "register"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setMode(item)}
            className={`relative flex-1 pb-3 text-sm font-black ${mode === item ? "text-carbon" : "text-black/45"}`}
          >
            {item === "login" ? "Iniciar sesión" : "Crear cuenta"}
            {mode === item ? <span className="absolute inset-x-0 -bottom-px h-0.5 bg-indigo" /> : null}
          </button>
        ))}
      </div>

      <form action={mode === "login" ? loginAction : registerAction} className="space-y-4">
        <input type="hidden" name="next" value={next} />
        <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
        {mode === "register" ? (
          <Field icon={UserRound} name="fullName" label="Nombre" autoComplete="name" />
        ) : null}
        <Field icon={Mail} name="email" label="Email" type="email" autoComplete="email" />
        <Field
          icon={LockKeyhole}
          name="password"
          label="Contraseña"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          hint={mode === "register" ? "Mínimo 10 caracteres" : undefined}
        />
        {mode === "register" ? (
          <label className="flex items-start gap-3 text-sm leading-6 text-black/68">
            <input required type="checkbox" name="legalConsent" className="mt-1 size-4 accent-carbon" />
            <span>
              He leído y acepto los <Link href="/legal/terminos" target="_blank" className="font-bold underline underline-offset-2">términos de uso</Link> y la <Link href="/legal/privacidad" target="_blank" className="font-bold underline underline-offset-2">política de privacidad</Link>.
            </span>
          </label>
        ) : null}
        {state.error ? <p role="alert" className="text-sm font-bold text-red-700">{state.error}</p> : null}
        {state.success ? <p className="text-sm font-bold text-green-700">{state.success}</p> : null}
        <button
          disabled={pending}
          className="group flex h-12 w-full items-center justify-center gap-3 rounded-klas bg-carbon px-5 text-sm font-black text-white transition-opacity disabled:opacity-50"
        >
          {pending ? "Procesando..." : mode === "login" ? "Entrar en KLAS" : "Crear cuenta"}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </button>
      </form>
    </div>
  );
}

function Field({ icon: Icon, label, hint, ...props }: {
  icon: typeof Mail;
  label: string;
  hint?: string;
  name: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex justify-between text-sm font-black">
        {label}
        {hint ? <span className="font-medium text-black/45">{hint}</span> : null}
      </span>
      <span className="flex h-12 items-center gap-3 rounded-klas border border-black/12 bg-white px-4 focus-within:border-indigo/60">
        <Icon className="size-4 text-black/45" />
        <input required className="min-w-0 flex-1 bg-transparent text-sm outline-none" {...props} />
      </span>
    </label>
  );
}
