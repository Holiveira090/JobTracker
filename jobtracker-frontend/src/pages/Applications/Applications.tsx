import { useState } from 'react';
import { useApplications, useCreateApplication, useUpdateApplication, useDeleteApplication } from '../../hooks/use-applications';
import { ApplicationStatus, APPLICATION_STATUS_LABELS, APPLICATION_STATUS_DOT_COLORS } from '../../types/enums/application-status.enum';
import { Layout } from '../../components/layout/Layout';
import { Card, CardHeader } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { LoadingBlock } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { PrimaryButton, SecondaryButton } from '../../components/ui/Button';
import {
  PlusIcon,
  LinkIcon,
  PencilIcon,
  TrashIcon,
  InboxIcon,
  FileTextIcon,
} from '../../components/ui/Icons';
import type { CreateJobApplicationDTO, UpdateJobApplicationDTO } from '../../types/dto/application.dto';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';

const applicationSchema = z.object({
  jobTitle: z.string().min(1, 'O título é obrigatório').max(100, 'Máximo 100 caracteres'),
  companyName: z.string().optional(),
  applicationLink: z.string().url('URL inválida').or(z.literal('')).optional(),
  status: z.nativeEnum(ApplicationStatus),
  notes: z.string().max(2000, 'Máximo 2000 caracteres').optional(),
});

type ApplicationForm = z.infer<typeof applicationSchema>;

const emptyForm: ApplicationForm = {
  jobTitle: '',
  companyName: '',
  applicationLink: '',
  status: ApplicationStatus.INTERESTED,
  notes: '',
};

const STATUS_KEYS = Object.keys(ApplicationStatus) as Array<keyof typeof ApplicationStatus>;

function ApplicationFormFields({ form }: { form: UseFormReturn<ApplicationForm> }) {
  return (
    <>
      <div>
        <label className="label" htmlFor="jobTitle">
          Título do Cargo <span className="text-red-500">*</span>
        </label>
        <input
          id="jobTitle"
          {...form.register('jobTitle')}
          placeholder="Ex: Desenvolvedor Frontend"
          className="input-field mt-1.5"
        />
        {form.formState.errors.jobTitle?.message && (
          <p className="form-error mt-1.5">{form.formState.errors.jobTitle.message}</p>
        )}
      </div>

      <div>
        <label className="label" htmlFor="companyName">
          Empresa
        </label>
        <input
          id="companyName"
          {...form.register('companyName')}
          placeholder="Nome da empresa (opcional)"
          className="input-field mt-1.5"
        />
      </div>

      <div>
        <label className="label" htmlFor="applicationLink">
          Link da Vaga
        </label>
        <input
          id="applicationLink"
          {...form.register('applicationLink')}
          placeholder="https://..."
          type="url"
          className="input-field mt-1.5"
        />
        {form.formState.errors.applicationLink?.message && (
          <p className="form-error mt-1.5">{form.formState.errors.applicationLink.message}</p>
        )}
      </div>

      <div>
        <label className="label" htmlFor="status">
          Status
        </label>
        <select
          id="status"
          {...form.register('status')}
          className="input-field mt-1.5"
        >
          {STATUS_KEYS.map((key) => {
            const status = ApplicationStatus[key];
            return (
              <option key={status} value={status}>
                {APPLICATION_STATUS_LABELS[status]}
              </option>
            );
          })}
        </select>
      </div>

      <div>
        <label className="label" htmlFor="notes">
          Notas
        </label>
        <textarea
          id="notes"
          {...form.register('notes')}
          rows={3}
          placeholder="Anotações sobre a candidatura..."
          className="input-field mt-1.5 resize-y"
        />
        {form.formState.errors.notes?.message && (
          <p className="form-error mt-1.5">{form.formState.errors.notes.message}</p>
        )}
      </div>
    </>
  );
}

export const Applications = () => {
  const { data: applications, isLoading, error } = useApplications();
  const createMutation = useCreateApplication();
  const updateMutation = useUpdateApplication();
  const deleteMutation = useDeleteApplication();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  const form = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
    defaultValues: emptyForm,
  });

  const editForm = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
    defaultValues: emptyForm,
  });

  const applicationsList = applications ?? [];

  const onStartCreate = () => {
    setShowForm(true);
    setEditingId(null);
    form.reset(emptyForm);
  };

  const onCancel = () => {
    setShowForm(false);
    setEditingId(null);
    form.reset(emptyForm);
  };

  const onStartEdit = (app: (typeof applicationsList)[number]) => {
    setEditingId(app.id);
    setShowForm(true);
    editForm.reset({
      jobTitle: app.jobTitle,
      companyName: '',
      applicationLink: app.applicationLink || '',
      status: app.status || ApplicationStatus.INTERESTED,
      notes: app.jobDescription || '',
    });
  };

  const onCancelEdit = () => {
    setShowForm(false);
    setEditingId(null);
    editForm.reset(emptyForm);
  };

  const onSubmitCreate = (data: ApplicationForm) => {
    if (!user) {
      alert('Usuário não autenticado. Faça login novamente.');
      return;
    }
    const dto: CreateJobApplicationDTO = {
      userId: user.id,
      companyId: null,
      jobTitle: data.jobTitle,
      jobDescription: data.notes || '',
      applicationLink: data.applicationLink || '',
      status: data.status,
      cvVersion: '',
    };
    createMutation.mutate(dto);
    setShowForm(false);
    form.reset(emptyForm);
  };

  const onSubmitUpdate = (data: ApplicationForm) => {
    if (!editingId || !user) return;
    const dto: UpdateJobApplicationDTO = {
      userId: user.id,
      companyId: null,
      jobTitle: data.jobTitle,
      jobDescription: data.notes || '',
      applicationLink: data.applicationLink || '',
      status: data.status,
      cvVersion: '',
    };
    updateMutation.mutate({ id: editingId, dto });
    setShowForm(false);
    setEditingId(null);
    editForm.reset(emptyForm);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta candidatura?')) {
      deleteMutation.mutate(id);
    }
  };

  const openLink = (url: string | null) => {
    if (url) window.open(url, '_blank');
  };

  const statusCounts = applicationsList.reduce((acc, app) => {
    const s = app.status || ApplicationStatus.INTERESTED;
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (isLoading) {
    return (
      <Layout>
        <LoadingBlock label="Carregando candidaturas..." size="lg" />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Candidaturas</h1>
            <p className="mt-1 text-sm text-slate-500">
              {applicationsList.length} {applicationsList.length === 1 ? 'candidatura' : 'candidaturas'}
            </p>
          </div>
          <PrimaryButton onClick={onStartCreate}>
            <PlusIcon size={16} />
            Nova Candidatura
          </PrimaryButton>
        </div>

        {/* Status Summary */}
        {applicationsList.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {STATUS_KEYS.map((key) => {
              const status = ApplicationStatus[key];
              const count = statusCounts[status] || 0;
              return (
                <span
                  key={status}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${APPLICATION_STATUS_DOT_COLORS[status]}`} aria-hidden="true" />
                  {APPLICATION_STATUS_LABELS[status]} ({count})
                </span>
              );
            })}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-semibold text-red-800">Erro ao carregar candidaturas</p>
            <p className="mt-0.5 text-sm text-red-700">{(error as Error).message}</p>
          </div>
        )}

        {/* Create/Edit Form */}
        {showForm && (
          <Card>
            <CardHeader
              title={editingId ? 'Editar Candidatura' : 'Nova Candidatura'}
              description={editingId ? 'Atualize as informações da candidatura.' : 'Preencha os dados da nova candidatura.'}
            />
            <form
              onSubmit={editingId ? editForm.handleSubmit(onSubmitUpdate) : form.handleSubmit(onSubmitCreate)}
              className="space-y-4"
            >
              <ApplicationFormFields form={editingId ? editForm : form} />

              <div className="flex flex-wrap gap-3 pt-2">
                <PrimaryButton
                  type="submit"
                  disabled={editingId ? updateMutation.isPending : createMutation.isPending}
                >
                  {editingId ? 'Salvar alterações' : 'Criar candidatura'}
                </PrimaryButton>
                <SecondaryButton onClick={editingId ? onCancelEdit : onCancel}>Cancelar</SecondaryButton>
              </div>
            </form>
          </Card>
        )}

        {/* Empty State */}
        {applicationsList.length === 0 && !showForm && (
          <Card>
            <EmptyState
              icon={InboxIcon}
              title="Nenhuma candidatura"
              description="Comece adicionando sua primeira candidatura para acompanhar seu progresso."
              action={
                <PrimaryButton onClick={onStartCreate}>
                  <PlusIcon size={16} />
                  Nova Candidatura
                </PrimaryButton>
              }
            />
          </Card>
        )}

        {/* List */}
        {applicationsList.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {applicationsList.map((app) => (
              <Card key={app.id} className="flex flex-col transition-shadow hover:shadow-soft-lg">
                <div className="flex flex-1 flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-base font-semibold text-slate-900">{app.jobTitle}</h3>
                      <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                        <FileTextIcon size={12} />
                        {new Date(app.appliedAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <StatusBadge status={app.status || ApplicationStatus.INTERESTED} />
                  </div>

                  {app.applicationLink && (
                    <button
                      onClick={() => openLink(app.applicationLink)}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
                    >
                      <LinkIcon size={14} />
                      Ver link da vaga
                    </button>
                  )}

                  <p className="line-clamp-3 text-sm text-slate-500">
                    {app.jobDescription || 'Sem descrição'}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-end gap-1 border-t border-slate-100 pt-3">
                  <button
                    onClick={() => onStartEdit(app)}
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-brand-600"
                    title="Editar candidatura"
                    aria-label="Editar candidatura"
                    disabled={updateMutation.isPending}
                  >
                    <PencilIcon size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(app.id)}
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    title="Excluir candidatura"
                    aria-label="Excluir candidatura"
                    disabled={deleteMutation.isPending}
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};