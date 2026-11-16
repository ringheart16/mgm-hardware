<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $query = Payment::with(['sale.customer', 'receivedByUser']);

        if ($request->filled('payment_method')) {
            $query->where('payment_method', $request->payment_method);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('payment_date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('payment_date', '<=', $request->date_to);
        }

        if (!$request->user()->isAdmin()) {
            $query->where('received_by', $request->user()->user_id);
        }

        return response()->json($query->orderBy('payment_id', 'desc')->get());
    }

    public function show(int $id)
    {
        $payment = Payment::with(['sale.customer', 'sale.details.product', 'receivedByUser'])->findOrFail($id);
        return response()->json($payment);
    }
}
