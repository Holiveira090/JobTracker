import { useParams, useNavigate } from 'react-router-dom';
import { useCompany, useUpdateCompany, useDeleteCompany } from '../../hooks/use-companies';
import { Layout } from '../../components/layout/Layout';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

const companySchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório').max(100, 'Máximo 100 caracteres'),
  companyValues: z.string().optional(),
  salaryInfoGlassdoor: z.number().min(0, 'Salário deve ser positivo').nullable(),
});

type CompanyForm = z.infer<typeof companySchema>;

export const CompanyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const updateMutation = useUpdateCompany();
  const deleteMutation = useDeleteCompany();
  const [showEdit, setShowEdit] = useState(false);

  const companyId = Number(id || 0);
  const { data: company, isLoading, error } = useCompany(companyId);

  const form = useForm<CompanyForm>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: '',
      companyValues: '',
      salaryInfoGlassdoor: null,
    },
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (error || !company) {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-semibold">Erro ao carregar empresa</p>
          <p className="text-sm">{(error as Error)?.message || 'Empresa não encontrada.'}</p>
        </div>
      </Layout>
    );
  }

  const onStartEdit = () => {
    form.reset({
      name: company.name,
      companyValues: company.companyValues || '',
      salaryInfoGlassdoor: company.salaryInfoGlassdoor ?? null,
    });
    setShowEdit(true);
  };

  const onCancelEdit = () => {
    setShowEdit(false);
  };

  const onSubmitEdit = (data: CompanyForm) => {
    updateMutation.mutate({
      id: companyId,
      dto: {
        id: companyId,
        userId: company.userId,
        name: data.name,
        companyValues: data.companyValues || null,
        salaryInfoGlassdoor: data.salaryInfoGlassdoor ?? null,
      },
    });
    setShowEdit(false);
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir esta empresa? As candidaturas associadas podem ser afetadas.')) {
      deleteMutation.mutate(companyId);
      navigate('/companies');
    }
  };

  const formatCurrency = (value: number | null) => {
    if (value == null) return '-';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <button
              onClick={() => navigate('/companies')}
              className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-flex items-center gap-1"
            >
              ← Voltar para empresas
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onStartEdit}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              disabled={deleteMutation.isPending}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Excluir
            </button>
          </div>
        </div>

        {/* Edit Form */}
        {showEdit && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Editar Empresa</h2>
            <form onSubmit={form.handleSubmit(onSubmitEdit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome da Empresa *</label>
                <input {...form.register('name')} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                {form.formState.errors.name && <p className="text-sm text-red-600 mt-1">{form.formState.errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Valores da Empresa</label>
                <textarea {...form.register('companyValues')} rows={4} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Salário (Glassdoor)</label>
                <input {...form.register('salaryInfoGlassdoor')} type="number" step="0.01" placeholder="Opcional" className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                {form.formState.errors.salaryInfoGlassdoor && <p className="text-sm text-red-600 mt-1">{form.formState.errors.salaryInfoGlassdoor.message}</p>}
              </div>

              <div className="flex gap-2">
                <button type="submit" disabled={updateMutation.isPending} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                  Salvar
                </button>
                <button type="button" onClick={onCancelEdit} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h3 className="font-semibold text-gray-900">Informações</h3>
            
            <div>
              <p className="text-sm text-gray-500">Nome</p>
              <p className="mt-1 text-gray-900 font-medium">{company.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">ID</p>
              <p className="mt-1 text-gray-900">{company.id}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Salário Glassdoor</p>
              <p className="mt-1 text-gray-900">{formatCurrency(company.salaryInfoGlassdoor)}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h3 className="font-semibold text-gray-900">Valores da Empresa</h3>
            
            <div>
              <p className="text-sm text-gray-500">Descrição dos valores</p>
              <p className="mt-1 text-gray-900 whitespace-pre-wrap">{company.companyValues || 'Sem informações'}</p>
            </div>
          </div>
        </div>

        {/* Applications for this company */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Candidaturas nesta empresa</h3>
          <p className="text-sm text-gray-500">ID da empresa: {company.id} (use para filtrar candidaturas)</p>
        </div>
      </div>
    </Layout>
  );
};