import { useState } from 'react';
import { useCompanies, useCreateCompany, useUpdateCompany, useDeleteCompany } from '../../hooks/use-companies';
import { Layout } from '../../components/layout/Layout';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { PlusIcon, PencilIcon, TrashIcon, BuildingIcon } from '../../components/ui/Icons';
import type { CompanyDTO, CreateCompanyDTO, UpdateCompanyDTO } from '../../types/dto/company.dto';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';

const companySchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório').max(100, 'O nome não pode exceder 100 caracteres'),
  companyValues: z.string().optional(),
  salaryInfoGlassdoor: z.union([z.number().min(0, 'Salário deve ser positivo'), z.null(), z.string()]).optional(),
});

type CompanyForm = z.infer<typeof companySchema>;

const emptyForm: CompanyForm = { name: '', companyValues: '', salaryInfoGlassdoor: null };

// Converte o valor do input para decimal/null corretamente
const parseSalary = (value: number | string | null | undefined): number | null => {
  if (value === '' || value === null || value === undefined || value === 'null') return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
};

export const Companies = () => {
  const { data: companies, isLoading, error } = useCompanies();
  const createMutation = useCreateCompany();
  const updateMutation = useUpdateCompany();
  const deleteMutation = useDeleteCompany();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  const form = useForm<CompanyForm>({
    resolver: zodResolver(companySchema),
    defaultValues: emptyForm,
  });

  const editForm = useForm<CompanyForm>({
    resolver: zodResolver(companySchema),
    defaultValues: { ...emptyForm, salaryInfoGlassdoor: '' },
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

  const onStartEdit = (company: CompanyDTO) => {
    setEditingId(company.id);
    setShowForm(true);
    editForm.reset({
      name: company.name,
      companyValues: company.companyValues || '',
      salaryInfoGlassdoor: company.salaryInfoGlassdoor ?? '',
    });
  };

  const onCancelEdit = () => {
    setShowForm(false);
    setEditingId(null);
    editForm.reset(emptyForm);
  };

  const onSubmitCreate = (data: CompanyForm) => {
    if (!user) {
      alert('Usuário não autenticado. Faça login novamente.');
      return;
    }
    const dto: CreateCompanyDTO = {
      userId: user.id,
      name: data.name,
      companyValues: data.companyValues || null,
      salaryInfoGlassdoor: parseSalary(data.salaryInfoGlassdoor as number | string | null | undefined),
    };
    createMutation.mutate(dto);
    setShowForm(false);
    form.reset(emptyForm);
  };

  const onSubmitUpdate = (data: CompanyForm) => {
    if (!editingId || !user) return;
    const dto: UpdateCompanyDTO = {
      id: editingId,
      userId: user.id,
      name: data.name,
      companyValues: data.companyValues || null,
      salaryInfoGlassdoor: parseSalary(data.salaryInfoGlassdoor as number | string | null | undefined),
    };
    updateMutation.mutate({ id: editingId, dto });
    setShowForm(false);
    setEditingId(null);
    editForm.reset(emptyForm);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta empresa?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-24">
          <Spinner className="h-10 w-10" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader
          title="Empresas"
          subtitle={`${companies?.length || 0} empresa${companies?.length !== 1 ? 's' : ''}`}
          action={
            <Button onClick={onStartCreate}>
              <PlusIcon className="h-4 w-4" />
              Nova Empresa
            </Button>
          }
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-semibold">Erro ao carregar empresas</p>
            <p className="text-sm">{(error as Error).message}</p>
            <p className="text-xs mt-1">Verifique se você está autenticado.</p>
          </div>
        )}

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? 'Editar Empresa' : 'Nova Empresa'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={editingId ? editForm.handleSubmit(onSubmitUpdate) : form.handleSubmit(onSubmitCreate)}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label htmlFor="company-name" className="text-sm font-medium text-slate-700">
                    Nome da Empresa
                  </label>
                  <Input
                    id="company-name"
                    required
                    placeholder="Ex: Google, Nubank..."
                    {...(editingId ? editForm.register('name') : form.register('name'))}
                  />
                  {(editingId ? editForm.formState.errors.name : form.formState.errors.name)?.message && (
                    <p className="text-sm text-red-600">
                      {(editingId ? editForm.formState.errors.name : form.formState.errors.name)?.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="company-values" className="text-sm font-medium text-slate-700">
                    Valores da Empresa
                  </label>
                  <Textarea
                    id="company-values"
                    rows={3}
                    placeholder="Ex: Inovação, colaboração, diversidade..."
                    {...(editingId ? editForm.register('companyValues') : form.register('companyValues'))}
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="company-salary" className="text-sm font-medium text-slate-700">
                    Salário (Glassdoor)
                  </label>
                  <Input
                    id="company-salary"
                    type="number"
                    step="0.01"
                    min={0}
                    placeholder="Opcional"
                    {...(editingId ? editForm.register('salaryInfoGlassdoor') : form.register('salaryInfoGlassdoor'))}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={editingId ? updateMutation.isPending : createMutation.isPending}>
                    {editingId ? 'Salvar' : 'Criar'}
                  </Button>
                  <Button type="button" variant="secondary" onClick={editingId ? onCancelEdit : onCancel}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {companies?.length === 0 && !showForm && (
          <EmptyState
            icon="building"
            title="Nenhuma empresa"
            description="Comece adicionando sua primeira empresa."
            action={
              <Button onClick={onStartCreate}>
                <PlusIcon className="h-4 w-4" />
                Nova Empresa
              </Button>
            }
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {companies?.map((company) => (
            <Card key={company.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <BuildingIcon className="h-5 w-5 text-slate-400 shrink-0" />
                      <h3 className="text-base font-semibold text-slate-900 truncate">{company.name}</h3>
                    </div>
                    {company.companyValues && (
                      <p className="text-sm text-slate-500 mt-2 line-clamp-2">{company.companyValues}</p>
                    )}
                    {company.salaryInfoGlassdoor != null && (
                      <p className="text-sm text-slate-500 mt-1">
                        Salário Glassdoor: R$ {company.salaryInfoGlassdoor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Editar empresa"
                      onClick={() => onStartEdit(company)}
                      disabled={updateMutation.isPending}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Excluir empresa"
                      className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(company.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};