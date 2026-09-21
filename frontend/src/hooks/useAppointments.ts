import { useCallback, useEffect, useState } from "react";
import type {
  Appointment,
  AppointmentForm,
  Category,
  FilterValue,
  Priority,
  Status,
} from "../interfaces/Appointment";
import {
  createAppointment,
  getAppointmentSummary,
  listAppointments,
  updateAppointmentStatus,
} from "../services/appointments";

const initialForm: AppointmentForm = {
  nome_solicitante: "",
  categoria: "CONSULTA",
  prioridade: "MEDIA",
  descricao: "",
  justificativa_prioridade: "",
};

export default function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [summary, setSummary] = useState<Array<{ status: Status; total: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<AppointmentForm>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<FilterValue<Status>>("");
  const [categoryFilter, setCategoryFilter] = useState<FilterValue<Category>>("");
  const [priorityFilter, setPriorityFilter] = useState<FilterValue<Priority>>("");
  const [appliedStatusFilter, setAppliedStatusFilter] =
    useState<FilterValue<Status>>("");
  const [appliedCategoryFilter, setAppliedCategoryFilter] =
    useState<FilterValue<Category>>("");
  const [appliedPriorityFilter, setAppliedPriorityFilter] =
    useState<FilterValue<Priority>>("");

  const fetchAppointments = useCallback(
    async (page = currentPage) => {
      setLoading(true);
      setError(null);

      try {
        const filters = {
          status: appliedStatusFilter || undefined,
          categoria: appliedCategoryFilter || undefined,
          prioridade: appliedPriorityFilter || undefined,
        };
        const [data, summaryData] = await Promise.all([
          listAppointments({ ...filters, page }),
          getAppointmentSummary(filters),
        ]);

        setAppointments(data.data);
        setCurrentPage(data.current_page);
        setLastPage(data.last_page);
        setTotal(data.total);
        setSummary(summaryData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar dados.");
      } finally {
        setLoading(false);
      }
    },
    [
      appliedCategoryFilter,
      appliedPriorityFilter,
      appliedStatusFilter,
      currentPage,
    ],
  );

  useEffect(() => {
    void fetchAppointments();
  }, [fetchAppointments]);

  function applyFilters() {
    setAppliedStatusFilter(statusFilter);
    setAppliedCategoryFilter(categoryFilter);
    setAppliedPriorityFilter(priorityFilter);
    setCurrentPage(1);
  }

  async function submitAppointment() {
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);

    try {
      await createAppointment(form);
      setForm(initialForm);
      setSubmitSuccess(true);
      await fetchAppointments(1);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Erro ao salvar solicitação.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function updateStatus(id: number, status: Status) {
    try {
      await updateAppointmentStatus(id, status);
      await fetchAppointments();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao atualizar status.",
      );
      throw err;
    }
  }

  return {
    appointments,
    summary,
    loading,
    error,
    statusFilter,
    categoryFilter,
    priorityFilter,
    setStatusFilter,
    setCategoryFilter,
    setPriorityFilter,
    applyFilters,
    hasAppliedFilters: Boolean(
      appliedStatusFilter || appliedCategoryFilter || appliedPriorityFilter,
    ),
    retry: fetchAppointments,
    currentPage,
    lastPage,
    total,
    setCurrentPage,
    form,
    setForm,
    submitAppointment,
    isSubmitting,
    submitSuccess,
    submitError,
    updateStatus,
  };
}
