import { useState } from 'react';
import { useRoles, useCreateRole, useUpdateRole, useDeleteRole } from '../../hooks/use-roles';
import { Layout } from '../../components/layout/Layout';
import type { CreateRoleDTO, UpdateRoleDTO } from '../../types/dto/role.dto';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const roleSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório').max(50, 'Máximo 50 caracteres'),
});

type RoleForm = z.infer<typeof roleSchema>;

const emptyForm: RoleForm = { name: '' };

export const Roles = () => {
  const { data: roles, isLoading, error } = useRoles();
  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole();
  const deleteMutation = useDeleteRole();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const form = useForm<RoleForm>({
    resolver: zodResolver(roleSchema),
    defaultValues: emptyForm,
  });

  const editForm = useForm<RoleForm>({
    resolver: zodResolver(roleSchema),
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

  const onStartEdit = (roleId: number, roleName: string) => {
    setEditingId(roleId);
    setShowForm(true);
    editForm.reset({ name: roleName });
  };

  const onCancelEdit = () => {
    setShowForm(false);
    setEditingId(null);
    editForm.reset(emptyForm);
  };

  const onSubmitCreate = (data: RoleForm) => {
    const dto: CreateRoleDTO = {
      name: data.name,
    };
    createMutation.mutate(dto);
    setShowForm(false);
    form.reset(emptyForm);
  };

  const onSubmitUpdate = (data: RoleForm) => {
    if (!editingId) return;
    const dto: UpdateRoleDTO = {
      id: editingId,
      name: data.name,
    };
    updateMutation.mutate({ id: editingId, dto });
    setShowForm(false);
    setEditingId(null);
    editForm.reset(emptyForm);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta função?')) {
      deleteMutation.mutate(id);
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Funções</h1>
            <p className="text-sm text-gray-500 mt-1">
              {roles?.length || 0} função{roles?.length !== 1 ? 'ões' : ''}
            </p>
          </div>
          <button
            onClick={onStartCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nova Função
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p className="font-semibold">Erro ao carregar funções</p>
            <p className="text-sm">{(error as Error).message}</p>
          </div>
        )}

        {/* Create/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editingId ? 'Editar Função' : 'Nova Função'}
            </h2>
            <form
              onSubmit={editingId ? editForm.handleSubmit(onSubmitUpdate) : form.handleSubmit(onSubmitCreate)}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome da Função *</label>
                <input
                  {...editingId ? editForm.register('name') : form.register('name')}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {(editingId ? editForm.formState.errors.name : form.formState.errors.name)?.message && (
                  <p className="text-sm text-red-600 mt-1">
                    {(editingId ? editForm.formState.errors.name : form.formState.errors.name)?.message}
                  </p>
                )}
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
        {roles?.length === 0 && !showForm && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma função</h3>
            <p className="mt-1 text-sm text-gray-500">Comece adicionando sua primeira função.</p>
          </div>
        )}

        {/* List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles?.map((role) => (
            <div key={role.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                  {role.userId && role.userId.length > 0 && (
                    <p className="text-xs text-gray-400 mt-1">
                      {role.userId.length} usuário{role.userId.length > 1 ? 's' : ''} vinculado{role.userId.length > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onStartEdit(role.id, role.name)}
                    className="p-2 text-gray-400 hover:text-blue-600"
                    title="Editar função"
                    disabled={updateMutation.isPending}
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(role.id)}
                    className="p-2 text-gray-400 hover:text-red-600"
                    title="Excluir função"
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