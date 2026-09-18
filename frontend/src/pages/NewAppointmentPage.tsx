import type { Dispatch, FormEvent, SetStateAction } from "react";
import AppointmentRequest from "../components/AppointmentRequest";
import type { AppointmentForm } from "../interfaces/Appointment";

type NewAppointmentPageProps = {
  form: AppointmentForm;
  setForm: Dispatch<SetStateAction<AppointmentForm>>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  submitSuccess: boolean;
  submitError: string | null;
};

export default function NewAppointmentPage(props: NewAppointmentPageProps) {
  return <AppointmentRequest {...props} />;
}
