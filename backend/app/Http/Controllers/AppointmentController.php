<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Services\AppointmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AppointmentController extends Controller
{
    public function __construct(
        private readonly AppointmentService $appointmentService
    ) {}

    public function index(): JsonResponse
    {
        $appointments = Appointment::query()->orderByDesc('created_at')->paginate(15);

        return response()->json($appointments);
    }

    public function show(int $id): JsonResponse
    {
        $appointment = Appointment::findOrFail($id);

        return response()->json($appointment);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->all();
        $errors = $this->appointmentService->validateCreation($data);

        if (!empty($errors)) {
            throw ValidationException::withMessages($errors);
        }

        $appointment = $this->appointmentService->create($data);

        return response()->json($appointment, 201);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $appointment = Appointment::findOrFail($id);
        $newStatus = $request->input('status');

        if (empty($newStatus)) {
            throw ValidationException::withMessages([
                'status' => 'O campo status é obrigatório.',
            ]);
        }

        if (!in_array($newStatus, AppointmentService::VALID_STATUSES, true)) {
            throw ValidationException::withMessages([
                'status' => 'Status inválido.',
            ]);
        }

        try {
            $updatedAppointment = $this->appointmentService->updateStatus($appointment, $newStatus);
        } catch (\RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return response()->json($updatedAppointment);
    }
}
