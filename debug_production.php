<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Submission;

echo "=== Production Submission Debug ===\n";

// Check all submissions
$allSubmissions = Submission::all();
echo "Total submissions: " . $allSubmissions->count() . "\n\n";

foreach ($allSubmissions as $submission) {
    echo "ID: " . $submission->id . "\n";
    echo "Email: " . $submission->email . "\n";
    echo "Name: " . $submission->name . "\n";
    echo "Email sent at: " . ($submission->email_sent_at ?? 'NULL') . "\n";
    echo "Email scheduled for: " . ($submission->email_scheduled_for ?? 'NULL') . "\n";
    echo "Created at: " . $submission->created_at . "\n";
    echo "Current time: " . now() . "\n";
    
    if ($submission->email_scheduled_for) {
        $isReady = $submission->email_scheduled_for <= now();
        echo "Is ready to send: " . ($isReady ? 'YES' : 'NO') . "\n";
        if (!$isReady) {
            $diff = now()->diffInMinutes($submission->email_scheduled_for);
            echo "Time until ready: " . $diff . " minutes\n";
        }
    }
    echo "---\n";
}

// Check the specific query used by the command
echo "\n=== Command Query Debug ===\n";
$readySubmissions = Submission::whereNull('email_sent_at')
    ->whereNotNull('email')
    ->where('email', '!=', '')
    ->whereNotNull('email_scheduled_for')
    ->where('email_scheduled_for', '<=', now())
    ->get();

echo "Submissions ready to send: " . $readySubmissions->count() . "\n";
