import { useState } from 'react';
import { useContacts, useCreateContact, useUpdateContact, useDeleteContact } from '../../hooks/use-contacts';
import { Layout } from '../../components/layout/Layout';
import type { CreateContactDTO, UpdateContactDTO } from '../../types/dto/contact.dto';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { exportContactsCSV } from '../../utils/export';
import { useAuth } from '../../contexts/AuthContext';

const contactSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório').max(100, 'Máximo 100 caracteres'),
  linkedinUrl: z.string().url('URL inválida').or(z.literal('')).optional(),
  notes: z.string().max(500, 'Máximo 500 caracteres').optional(),
});

type ContactForm = z.infer<typeof contactSchema>;

const emptyForm: ContactForm = { name: '', linkedinUrl: '', notes: '' };

export const Contacts = () => {
  const { data: contacts, isLoading, error } = useContacts();
  const createMutation = useCreateContact();
  const updateMutation = useUpdateContact();
  const deleteMutation = useDeleteContact();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: emptyForm,
  });

  const editForm = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: emptyForm,
  });

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

  const onStartEdit = (contactId: number, name: string, linkedinUrl: string | null, notes: string | null) => {
    setEditingId(contactId);
    setShowForm(true);
    editForm.reset({ name, linkedinUrl: linkedinUrl ?? '', notes: notes ?? '' });
  };

  const onCancelEdit = () => {
    setShowForm(false);
    setEditingId(null);
    editForm.reset(emptyForm);
  };

  const onSubmitCreate = (data: ContactForm) => {
    if (!user) {
      alert('Usuário não autenticado. Faça login novamente.');
      return;
    }
    const dto: CreateContactDTO = {
      userId: user.id,
      name: data.name,
      linkedinUrl: data.linkedinUrl || undefined,
      notes: data.notes || undefined,
    };
    createMutation.mutate(dto);
    setShowForm(false);
    form.reset(emptyForm);
  };

  const onSubmitUpdate = (data: ContactForm) => {
    if (!editingId || !user) return;
    const dto: UpdateContactDTO = {
      id: editingId,
      userId: user.id,
      companyId: null,
      name: data.name,
      linkedinUrl: data.linkedinUrl || null,
      notes: data.notes || null,
    };
    updateMutation.mutate({ id: editingId, dto });
    setShowForm(false);
    setEditingId(null);
    editForm.reset(emptyForm);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este contato?')) {
      deleteMutation.mutate(id);
    }
  };

  const openLink = (url: string | null) => {
    if (url) window.open(url, '_blank');
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contatos</h1>
            <p className="text-sm text-gray-500 mt-1">
              {contacts?.length || 0} contato{contacts?.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-2">
            {contacts && contacts.length > 0 && (
              <button
                onClick={() => exportContactsCSV(contacts)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exportar CSV
              </button>
            )}
            <button
              onClick={onStartCreate}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Novo Contato
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p className="font-semibold">Erro ao carregar contatos</p>
            <p className="text-sm">{(error as Error).message}</p>
          </div>
        )}

        {/* Create/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editingId ? 'Editar Contato' : 'Novo Contato'}
            </h2>
            <form
              onSubmit={editingId ? editForm.handleSubmit(onSubmitUpdate) : form.handleSubmit(onSubmitCreate)}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome *</label>
                <input
                  {...editingId ? editForm.register('name') : form.register('name')}
                  placeholder="Nome do contato"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {(editingId ? editForm.formState.errors.name : form.formState.errors.name)?.message && (
                  <p className="text-sm text-red-600 mt-1">
                    {(editingId ? editForm.formState.errors.name : form.formState.errors.name)?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                <input
                  {...editingId ? editForm.register('linkedinUrl') : form.register('linkedinUrl')}
                  placeholder="https://linkedin.com/in/..."
                  type="url"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Observações</label>
                <textarea
                  {...editingId ? editForm.register('notes') : form.register('notes')}
                  rows={3}
                  placeholder="Anotações sobre o contato..."
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={editingId ? updateMutation.isPending : createMutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {editingId ? 'Salvar' : 'Criar'}
                </button>
                <button
                  type="button"
                  onClick={editingId ? onCancelEdit : onCancel}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Empty State */}
        {contacts?.length === 0 && !showForm && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum contato</h3>
            <p className="mt-1 text-sm text-gray-500">Comece adicionando seu primeiro contato.</p>
          </div>
        )}

        {/* List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts?.map((contact) => (
            <div key={contact.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-grow min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{contact.name}</h3>
                  {contact.linkedinUrl && (
                    <button
                      onClick={() => openLink(contact.linkedinUrl)}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline mt-1 inline-flex items-center gap-1"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      LinkedIn
                    </button>
                  )}
                  {contact.notes && (
                    <p className="text-sm text-gray-500 mt-2 line-clamp-3">{contact.notes}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onStartEdit(contact.id, contact.name, contact.linkedinUrl, contact.notes)}
                    className="p-2 text-gray-400 hover:text-blue-600"
                    title="Editar contato"
                    disabled={updateMutation.isPending}
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="p-2 text-gray-400 hover:text-red-600"
                    title="Excluir contato"
                    disabled={deleteMutation.isPending}
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};