<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubmissionController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:255',
            'notes' => 'nullable|string',
            'category' => 'required|string|max:255',
            'procedure' => 'required|string|max:255',
            'pricing_details' => 'nullable|array',
            'total_price' => 'nullable|array'
        ]);

        $submission = Submission::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'notes' => $request->notes,
            'category' => $request->category,
            'procedure' => $request->procedure,
            'pricing_details' => $request->pricing_details,
            'total_price' => $request->total_price,
            'status' => 'pending'
        ]);

        return response()->json([
            'success' => true,
            'data' => $submission
        ]);
    }
}
