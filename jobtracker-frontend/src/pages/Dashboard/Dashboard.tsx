import { Link } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { Card, CardHeader } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { LoadingBlock } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  FileTextIcon,
  TargetIcon,
  CheckCircleIcon,
  TrendingUpIcon,
  BuildingIcon,
  UsersIcon,
  InboxIcon,
  ChevronRightIcon,
  type IconProps,
} from '../../components/ui/Icons';
import { useApplications } from '../../hooks/use-applications';
import { useCompanies } from '../../hooks/use-companies';
import {
  ApplicationStatus,
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_DOT_COLORS,
} from '../../types/enums/application-status.enum';
import type { CompanyDTO } from '../../types/dto/company.dto';

type StatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: (props: IconProps) => React.ReactElement;
  iconClass: string;
};

function StatCard({ title, value, subtitle, icon: Icon, iconClass }: StatCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-soft-lg">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
          {subtitle ? <p className="mt-1 truncate text-xs text-slate-400">{subtitle}</p> : null}
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
          <Icon size={22} />
        </div>
      </div>
    </Card>
  );
}

const QUICK_ACTIONS = [
  { to: '/applications', label: 'Ver candidaturas', icon: FileTextIcon },
  { to: '/companies', label: 'Ver empresas', icon: BuildingIcon },
  { to: '/contacts', label: 'Ver contatos', icon: UsersIcon },
];

export const Dashboard = () => {
  const { data: applications, isLoading } = useApplications();
  const { data: companies } = useCompanies();

  const applicationsList = applications ?? [];
  const companiesList = companies ?? [];

  const totalApplications = applicationsList.length;
  const totalCompanies = companiesList.length;

  const statusCounts = Object.values(ApplicationStatus).reduce((acc, status) => {
    acc[status] = applicationsList.filter((app) => app.status === status).length;
    return acc;
  }, {} as Record<ApplicationStatus, number>);

  const interviewingCount = statusCounts[ApplicationStatus.INTERVIEWING] || 0;
  const offerCount = statusCounts[ApplicationStatus.OFFER] || 0;
  const recentApplications = [...applicationsList]
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
    .slice(0, 5);

  const formatDateTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 1) return 'Hoje';
      if (diffDays === 2) return 'Ontem';
      if (diffDays <= 7) return `${diffDays} dias atrás`;
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const interviewProgress = totalApplications > 0 ? (interviewingCount / totalApplications) * 100 : 0;
  const offerProgress = totalApplications > 0 ? (offerCount / totalApplications) * 100 : 0;
  const successRate =
    interviewingCount + offerCount > 0
      ? ((offerCount / (interviewingCount + offerCount)) * 100).toFixed(1)
      : '0';

  if (isLoading) {
    return (
      <Layout>
        <LoadingBlock label="Carregando seu dashboard..." size="lg" />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Acompanhe seu progresso na busca por vagas</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total de candidaturas"
            value={totalApplications}
            subtitle={`${totalCompanies} ${totalCompanies === 1 ? 'empresa' : 'empresas'}`}
            icon={FileTextIcon}
            iconClass="bg-brand-50 text-brand-600"
          />
          <StatCard
            title="Em entrevista"
            value={interviewingCount}
            subtitle={totalApplications > 0 ? `${interviewProgress.toFixed(1)}% do total` : 'Sem dados'}
            icon={TargetIcon}
            iconClass="bg-amber-50 text-amber-600"
          />
          <StatCard
            title="Com oferta"
            value={offerCount}
            subtitle={totalApplications > 0 ? `${offerProgress.toFixed(1)}% do total` : 'Sem dados'}
            icon={CheckCircleIcon}
            iconClass="bg-emerald-50 text-emerald-600"
          />
          <StatCard
            title="Taxa de sucesso"
            value={`${successRate}%`}
            subtitle="Entrevista → Oferta"
            icon={TrendingUpIcon}
            iconClass="bg-violet-50 text-violet-600"
          />
        </div>

        {/* Progress Bars */}
        {totalApplications > 0 && (
          <Card>
            <CardHeader title="Progresso por status" description="Distribuição das suas candidaturas" />
            <div className="space-y-4">
              {Object.values(ApplicationStatus).map((status) => {
                const count = statusCounts[status];
                const percentage = totalApplications > 0 ? (count / totalApplications) * 100 : 0;
                if (count === 0) return null;

                return (
                  <div key={status}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <span
                          className={`h-2 w-2 rounded-full ${APPLICATION_STATUS_DOT_COLORS[status]}`}
                          aria-hidden="true"
                        />
                        {APPLICATION_STATUS_LABELS[status]}
                      </span>
                      <span className="text-xs text-slate-500">
                        {count} {count === 1 ? 'candidatura' : 'candidaturas'} · {percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${APPLICATION_STATUS_DOT_COLORS[status]}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="border-brand-100 bg-gradient-to-r from-brand-50 to-white">
          <h2 className="mb-4 text-base font-semibold text-slate-900">Ações rápidas</h2>
          <div className="flex flex-wrap gap-3">
            {QUICK_ACTIONS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="inline-flex items-center gap-2 rounded-lg border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-700 transition-colors hover:border-brand-300 hover:bg-brand-50"
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>
        </Card>

        {/* Recent Applications */}
        <Card>
          <CardHeader
            title="Candidaturas recentes"
            action={
              <Link to="/applications" className="link inline-flex items-center gap-1 text-sm font-medium">
                Ver todas
                <ChevronRightIcon size={14} />
              </Link>
            }
          />
          {recentApplications.length === 0 ? (
            <EmptyState
              icon={InboxIcon}
              title="Nenhuma candidatura registrada"
              description="Comece adicionando sua primeira candidatura para acompanhar seu progresso."
              action={
                <Link to="/applications" className="link text-sm font-medium">
                  Adicionar primeira candidatura →
                </Link>
              }
            />
          ) : (
            <div className="space-y-2">
              {recentApplications.map((app) => (
                <Link
                  key={app.id}
                  to={`/applications/${app.id}`}
                  className="flex items-center justify-between gap-4 rounded-lg border border-transparent bg-slate-50 p-4 transition-colors hover:border-slate-200 hover:bg-slate-100"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">{app.jobTitle}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{formatDateTime(app.appliedAt)}</p>
                  </div>
                  <StatusBadge status={app.status || ApplicationStatus.APPLIED} />
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* Companies Summary */}
        <Card>
          <CardHeader
            title="Empresas"
            action={
              <Link to="/companies" className="link inline-flex items-center gap-1 text-sm font-medium">
                Ver todas
                <ChevronRightIcon size={14} />
              </Link>
            }
          />
          {companiesList.length === 0 ? (
            <EmptyState
              icon={BuildingIcon}
              title="Nenhuma empresa registrada"
              description="Adicione empresas para organizar suas candidaturas por companhia."
              action={
                <Link to="/companies" className="link text-sm font-medium">
                  Adicionar primeira empresa →
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {companiesList.slice(0, 6).map((company: CompanyDTO) => (
                <Link
                  key={company.id}
                  to={`/companies/${company.id}`}
                  className="rounded-lg border border-slate-100 bg-slate-50 p-4 transition-colors hover:border-slate-200 hover:bg-slate-100"
                >
                  <p className="truncate text-sm font-semibold text-slate-900">{company.name}</p>
                  {company.salaryInfoGlassdoor ? (
                    <p className="mt-1 text-xs font-medium text-emerald-600">
                      {formatCurrency(company.salaryInfoGlassdoor)}
                    </p>
                  ) : null}
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};