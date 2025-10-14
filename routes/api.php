<?php

use App\Http\Controllers\SubmissionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/submissions', function (Request $request) {
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'phone' => 'required|string|max:20',
        'notes' => 'nullable|string',
        'category' => 'required|string|max:255',
        'procedure' => 'required|string|max:255',
        'variant' => 'nullable|string|max:255',
    ]);

    $submission = \App\Models\Submission::create([
        'name' => $request->name,
        'email' => $request->email,
        'phone' => $request->phone,
        'notes' => $request->notes,
        'category' => $request->category,
        'procedure' => $request->procedure,
        'variant' => $request->variant,
        'status' => 'pending',
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Submission created successfully',
        'submission' => $submission
    ]);
});
