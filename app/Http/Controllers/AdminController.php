<?php

namespace App\Http\Controllers;

use App\Models\Submission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard()
    {
        $submissions = Submission::orderBy('created_at', 'desc')->paginate(10);
        
        $stats = [
            'total' => Submission::count(),
            'pending' => Submission::where('status', 'pending')->count(),
            'contacted' => Submission::where('status', 'contacted')->count(),
            'completed' => Submission::where('status', 'completed')->count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'submissions' => $submissions,
            'stats' => $stats,
        ]);
    }

    public function updateStatus(Request $request, Submission $submission)
    {
        $request->validate([
            'status' => 'required|in:pending,contacted,completed',
        ]);

        $submission->update([
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Status updated successfully.');
    }
}
