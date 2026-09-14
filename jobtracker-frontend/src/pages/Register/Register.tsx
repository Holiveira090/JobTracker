import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import {
  BriefcaseIcon,
  MailIcon,
  LockIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  FileTextIcon,
  UsersIcon,
} from '../../components/ui/Icons';

const FEATURES = [
  {
    icon: CheckCircleIcon,
    text: 'Crie sua conta em segundos e mantenha tudo organizado',
  },
  { icon: FileTextIcon, text: 'Registre candidaturas com status e anotações' },
  { icon: UsersIcon, text: 'Construa sua rede de contatos profissionais' },
];

export const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);

    try {
      await register(email, password);
      navigate('/dashboard');
    } catch {
      setError('Falha ao criar conta. O email pode já estar em uso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Painel de marca (desktop) */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-slate-900 p-12 lg:flex">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 50% at 20% 15%, rgba(37,99,235,0.35) 0%, transparent 70%), radial-gradient(50% 40% at 85% 85%, rgba(37,99,235,0.25) 0%, transparent 70%)',
          }}
        />
        <div className="relative flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
            <BriefcaseIcon size={22} />
          </span>
          <span className="text-xl font-bold tracking-tight text-white">JobTracker</span>
        </div>

        <div className="relative">
          <h2 className="text-3xl font-bold leading-tight text-white">
            Comece a organizar
            <br />
            sua busca por vagas hoje.
          </h2>
          <ul className="mt-8 space-y-4">
            {FEATURES.map((feature) => (
              <li key={feature.text} className="flex items-start gap-3 text-slate-300">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-brand-400">
                  <feature.icon size={16} />
                </span>
                <span className="text-sm leading-relaxed">{feature.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-slate-500">
          © {new Date().getFullYear()} JobTracker — Gerenciador de candidaturas
        </p>
      </div>

      {/* Formulário */}
      <div className="flex w-full items-center justify-center p-4 sm:p-8 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center text-center lg:hidden">
            <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white">
              <BriefcaseIcon size={26} />
            </span>
            <h1 className="text-2xl font-bold text-slate-900">JobTracker</h1>
          </div>

          <div className="card p-6 sm:p-8">
            <h1 className="text-xl font-bold text-slate-900">Crie sua conta</h1>
            <p className="mt-1 text-sm text-slate-500">Comece a acompanhar suas candidaturas</p>

            {error && (
              <div
                role="alert"
                className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                <AlertCircleIcon size={16} className="mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="email" className="label mb-1.5">
                  <MailIcon size={14} className="text-slate-400" /> Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="input-field"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="label mb-1.5">
                  <LockIcon size={14} className="text-slate-400" /> Senha
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="label mb-1.5">
                  <LockIcon size={14} className="text-slate-400" /> Confirmar Senha
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full justify-center">
                {loading && <Spinner size="sm" className="text-white" />}
                {loading ? 'Criando conta...' : 'Criar conta'}
              </Button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Já tem uma conta?{' '}
            <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};