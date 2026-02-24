import React, { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Card from "../components/ui/Card";

type LoginValues = {
  email: string;
  password: string;
  remember: boolean;
};

export default function LoginPage() {
  const [values, setValues] = useState<LoginValues>({
    email: "",
    password: "",
    remember: true,
  });

  const [showPassword, setShowPassword] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    alert(`Login UI: ${values.email}`);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070D18] px-4">
      <div className="w-full max-w-md">
        <Card className="p-8">
          <div className="text-center">
            <div className="text-xs uppercase tracking-[0.25em] text-white/50">
              SmartOps ERP
            </div>

            <h1 className="mt-3 text-2xl font-semibold tracking-tight">
              Inicio de sesión
            </h1>

            <p className="mt-2 text-sm text-white/60">
              Accede a tu panel de control
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {/* Email */}
            <div>
              <label className="mb-2 block text-sm text-white/70">
                Correo
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <Mail size={16} className="text-white/50" />
                <input
                  value={values.email}
                  onChange={(e) =>
                    setValues((p) => ({ ...p, email: e.target.value }))
                  }
                  type="email"
                  placeholder="correo@ejemplo.com"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-white/40"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm text-white/70">
                Contraseña
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <Lock size={16} className="text-white/50" />
                <input
                  value={values.password}
                  onChange={(e) =>
                    setValues((p) => ({ ...p, password: e.target.value }))
                  }
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-white/40"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="rounded-lg p-1 text-white/60 hover:bg-white/10 hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember */}
            <label className="flex cursor-pointer items-center gap-2 text-sm text-white/70">
              <input
                type="checkbox"
                checked={values.remember}
                onChange={(e) =>
                  setValues((p) => ({ ...p, remember: e.target.checked }))
                }
                className="h-4 w-4 accent-white"
              />
              Recordarme
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/15"
            >
              Iniciar sesión
            </button>

            <div className="pt-4 text-center text-xs text-white/40">
              v1 · SmartOperations
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}