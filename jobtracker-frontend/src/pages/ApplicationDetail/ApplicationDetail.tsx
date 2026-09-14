import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApplication, useUpdateApplication } from '../../hooks/use-applications';
import { useApplicationNotes, useCreateApplicationNote, useUpdateApplicationNote, useDeleteApplicationNote } from '../../hooks/use-application-notes';
import { Layout } from '../../components/layout/Layout';
import { Card, CardHeader } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { LoadingBlock } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { PrimaryButton, SecondaryButton } from '../../components/ui/Button';
import {
  ArrowLeftIcon,
  PencilIcon,
  PlusIcon,
  MessageSquareIcon,
  LinkIcon,
  TrashIcon,
  FileTextIcon,
  CalendarIcon,
} from '../../components/ui/Icons';
import { ApplicationStatus, APPLICATION_STATUS_LABELS } from '../../types/enums/application-status.enum';
import { NoteType, NOTE_TYPE_LABELS, NOTE_TYPE_COLORS } from '../../types/enums/note-type.enum';
import type { ApplicationNoteDTO } from '../../types/dto/application-note.dto';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const applicationSchema = z.object({
  jobTitle: z.string().min(1, 'O título é obrigatório').max(100, 'Máximo 100 caracteres'),
  jobDescription: z.string().optional(),
  applicationLink: z.string().url('Link inválido').or(z.literal('')),
  status: z.nativeEnum(ApplicationStatus),
  cvVersion: z.string().optional(),
});

const noteSchema = z.object({
  type: z.nativeEnum(NoteType),
  content: z.string().min(1, 'O conteúdo é obrigatório').max(2000, 'Máximo 2000 caracteres'),
});

type ApplicationForm = z.infer<typeof applicationSchema>;
type NoteForm = z.infer<typeof noteSchema>;

const STATUS_KEYS = Object.keys(ApplicationStatus) as Array<keyof typeof ApplicationStatus>;
const NOTE_TYPE_KEYS = Object.keys(NoteType) as Array<keyof typeof NoteType>;

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
};

export const ApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const updateMutation = useUpdateApplication();
  const [showEdit, setShowEdit] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);

  const applicationId = Number(id || 0);
  const { data: application, isLoading, error } = useApplication(applicationId);
  const { data: notes, isLoading: notesLoading } = useApplicationNotes(applicationId);
  const createNoteMutation = useCreateApplicationNote();
  const updateNoteMutation = useUpdateApplicationNote();
  const deleteNoteMutation = useDeleteApplicationNote();

  const noteForm = useForm<NoteForm>({
    resolver: zodResolver(noteSchema),
    defaultValues: { type: NoteType.GENERAL, content: '' },
  });

  const form = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      jobTitle: '',
      jobDescription: '',
      applicationLink: '',
      status: ApplicationStatus.INTERESTED,
      cvVersion: '',
    },
  });

  if (isLoading) {
    return (
      <Layout>
        <LoadingBlock label="Carregando candidatura..." size="lg" />
      </Layout>
    );
  }

  if (error || !application) {
    return (
      <Layout>
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-semibold text-red-800">Erro ao carregar candidatura</p>
            <p className="mt-0.5 text-sm text-red-700">{(error as Error)?.message || 'Candidatura não encontrada.'}</p>
          </div>
          <button
            onClick={() => navigate('/applications')}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
          >
            <ArrowLeftIcon size={14} />
            Voltar para candidaturas
          </button>
        </div>
      </Layout>
    );
  }

  const currentStatus = application.status || ApplicationStatus.INTERESTED;
  const notesList = notes ?? [];

  const onStartEdit = () => {
    form.reset({
      jobTitle: application.jobTitle,
      jobDescription: application.jobDescription || '',
      applicationLink: application.applicationLink || '',
      status: currentStatus,
      cvVersion: application.cvVersion || '',
    });
    setShowEdit(true);
  };

  const onCancelEdit = () => {
    setShowEdit(false);
  };

  const onSubmitEdit = (data: ApplicationForm) => {
    updateMutation.mutate({
      id: applicationId,
      dto: {
        userId: application.userId,
        companyId: application.companyId ?? null,
        jobTitle: data.jobTitle,
        jobDescription: data.jobDescription || '',
        applicationLink: data.applicationLink || '',
        status: data.status,
        cvVersion: data.cvVersion || '',
      },
    });
    setShowEdit(false);
  };

  const openLink = (url: string) => {
    if (url) window.open(url, '_blank');
  };

  const onStartNote = () => {
    noteForm.reset({ type: NoteType.GENERAL, content: '' });
    setEditingNoteId(null);
    setShowNoteForm(true);
  };

  const onCancelNote = () => {
    setShowNoteForm(false);
    setEditingNoteId(null);
  };

  const onStartEditNote = (note: ApplicationNoteDTO) => {
    noteForm.reset({ type: note.type, content: note.content });
    setEditingNoteId(note.id);
    setShowNoteForm(true);
  };

  const onSubmitNote = (data: NoteForm) => {
    if (editingNoteId) {
      updateNoteMutation.mutate({
        id: editingNoteId,
        dto: {
          id: editingNoteId,
          jobApplicationId: applicationId,
          type: data.type,
          content: data.content,
        },
      });
    } else {
      createNoteMutation.mutate({
        jobApplicationId: applicationId,
        type: data.type,
        content: data.content,
      });
    }
    setShowNoteForm(false);
    setEditingNoteId(null);
  };

  const handleDeleteNote = (noteId: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta anotação?')) {
      deleteNoteMutation.mutate(noteId);
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Breadcrumb / back */}
        <button
          onClick={() => navigate('/applications')}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-brand-600"
        >
          <ArrowLeftIcon size={14} />
          Voltar para candidaturas
        </button>

        {/* Header card */}
        <Card>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold text-slate-900">{application.jobTitle}</h1>
                <StatusBadge status={currentStatus} />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarIcon size={14} />
                  {formatDate(application.appliedAt)}
                </span>
                {application.applicationLink && (
                  <button
                    onClick={() => openLink(application.applicationLink)}
                    className="inline-flex items-center gap-1.5 font-medium text-brand-600 transition-colors hover:text-brand-700"
                  >
                    <LinkIcon size={14} />
                    Ver link da vaga
                  </button>
                )}
                {application.cvVersion && (
                  <span className="inline-flex items-center gap-1.5">
                    <FileTextIcon size={14} />
                    CV: {application.cvVersion}
                  </span>
                )}
              </div>
            </div>
            {!showEdit && (
              <SecondaryButton onClick={onStartEdit}>
                <PencilIcon size={14} />
                Editar
              </SecondaryButton>
            )}
          </div>

          {application.jobDescription && (
            <div className="mt-5 border-t border-slate-100 pt-4">
              <h2 className="text-sm font-semibold text-slate-700">Descrição</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">
                {application.jobDescription}
              </p>
            </div>
          )}
        </Card>

        {/* Edit form */}
        {showEdit && (
          <Card>
            <CardHeader title="Editar Candidatura" description="Atualize as informações da candidatura." />
            <form onSubmit={form.handleSubmit(onSubmitEdit)} className="space-y-4">
              <div>
                <label className="label" htmlFor="jobTitle">
                  Título do Cargo <span className="text-red-500">*</span>
                </label>
                <input
                  id="jobTitle"
                  {...form.register('jobTitle')}
                  className="input-field mt-1.5"
                />
                {form.formState.errors.jobTitle?.message && (
                  <p className="form-error mt-1.5">{form.formState.errors.jobTitle.message}</p>
                )}
              </div>

              <div>
                <label className="label" htmlFor="status">
                  Status
                </label>
                <select id="status" {...form.register('status')} className="input-field mt-1.5">
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
                <label className="label" htmlFor="applicationLink">
                  Link da Vaga
                </label>
                <input
                  id="applicationLink"
                  {...form.register('applicationLink')}
                  type="url"
                  placeholder="https://..."
                  className="input-field mt-1.5"
                />
                {form.formState.errors.applicationLink?.message && (
                  <p className="form-error mt-1.5">{form.formState.errors.applicationLink.message}</p>
                )}
              </div>

              <div>
                <label className="label" htmlFor="cvVersion">
                  Versão do CV
                </label>
                <input
                  id="cvVersion"
                  {...form.register('cvVersion')}
                  placeholder="Ex: v2 — versão para tech companies"
                  className="input-field mt-1.5"
                />
              </div>

              <div>
                <label className="label" htmlFor="jobDescription">
                  Descrição
                </label>
                <textarea
                  id="jobDescription"
                  {...form.register('jobDescription')}
                  rows={5}
                  placeholder="Descrição da vaga..."
                  className="input-field mt-1.5 resize-y"
                />
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <PrimaryButton type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Salvando...' : 'Salvar alterações'}
                </PrimaryButton>
                <SecondaryButton onClick={onCancelEdit}>Cancelar</SecondaryButton>
              </div>
            </form>
          </Card>
        )}

        {/* Notes */}
        <Card>
          <CardHeader
            title="Anotações"
            description="Registre desafios, perguntas e observações sobre esta candidatura."
            action={
              !showNoteForm ? (
                <PrimaryButton onClick={onStartNote}>
                  <PlusIcon size={14} />
                  Nova Anotação
                </PrimaryButton>
              ) : undefined
            }
          />

          {showNoteForm ? (
            <form onSubmit={noteForm.handleSubmit(onSubmitNote)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="label" htmlFor="noteType">
                    Tipo
                  </label>
                  <select id="noteType" {...noteForm.register('type')} className="input-field mt-1.5">
                    {NOTE_TYPE_KEYS.map((key) => {
                      const type = NoteType[key];
                      return (
                        <option key={type} value={type}>
                          {NOTE_TYPE_LABELS[type]}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div>
                <label className="label" htmlFor="noteContent">
                  Conteúdo <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="noteContent"
                  {...noteForm.register('content')}
                  rows={4}
                  placeholder="Escreva a anotação..."
                  className="input-field mt-1.5 resize-y"
                />
                {noteForm.formState.errors.content?.message && (
                  <p className="form-error mt-1.5">{noteForm.formState.errors.content.message}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <PrimaryButton
                  type="submit"
                  disabled={editingNoteId ? updateNoteMutation.isPending : createNoteMutation.isPending}
                >
                  {editingNoteId ? 'Salvar anotação' : 'Adicionar anotação'}
                </PrimaryButton>
                <SecondaryButton onClick={onCancelNote}>Cancelar</SecondaryButton>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              {notesLoading ? (
                <LoadingBlock label="Carregando anotações..." />
              ) : notesList.length === 0 ? (
                <EmptyState
                  icon={MessageSquareIcon}
                  title="Nenhuma anotação"
                  description="Adicione desafios, perguntas ou observações sobre esta candidatura."
                  action={
                    <PrimaryButton onClick={onStartNote}>
                      <PlusIcon size={14} />
                      Nova Anotação
                    </PrimaryButton>
                  }
                />
              ) : (
                notesList.map((note) => (
                  <div
                    key={note.id}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${NOTE_TYPE_COLORS[note.type] || NOTE_TYPE_COLORS[NoteType.GENERAL]}`}
                      >
                        {NOTE_TYPE_LABELS[note.type] || 'Geral'}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onStartEditNote(note)}
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-brand-600"
                          title="Editar anotação"
                          aria-label="Editar anotação"
                          disabled={updateNoteMutation.isPending}
                        >
                          <PencilIcon size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          title="Excluir anotação"
                          aria-label="Excluir anotação"
                          disabled={deleteNoteMutation.isPending}
                        >
                          <TrashIcon size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">
                      {note.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};