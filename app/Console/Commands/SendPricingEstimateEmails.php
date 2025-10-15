<?php

namespace App\Console\Commands;

use App\Mail\PricingEstimateEmail;
use App\Models\Submission;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendPricingEstimateEmails extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'emails:send-pricing-estimates';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send pricing estimate emails to submissions scheduled to be sent (1-2 hours after submission)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking for submissions ready to receive pricing estimates...');

        // Get submissions that:
        // 1. Haven't received an email yet (email_sent_at is null)
        // 2. Have reached their scheduled send time (email_scheduled_for is in the past)
        // 3. Have an email address
        $submissions = Submission::whereNull('email_sent_at')
            ->whereNotNull('email')
            ->where('email', '!=', '')
            ->whereNotNull('email_scheduled_for')
            ->where('email_scheduled_for', '<=', Carbon::now())
            ->get();

        if ($submissions->isEmpty()) {
            $this->info('No submissions found that need pricing estimates.');
            return 0;
        }

        $this->info("Found {$submissions->count()} submission(s) to process.");

        $successCount = 0;
        $errorCount = 0;

        foreach ($submissions as $submission) {
            try {
                // Send the email
                Mail::to($submission->email)->send(new PricingEstimateEmail($submission));

                // Mark as sent
                $submission->update([
                    'email_sent_at' => Carbon::now()
                ]);

                $this->info("✓ Sent email to: {$submission->email} ({$submission->name})");
                $successCount++;
            } catch (\Exception $e) {
                $this->error("✗ Failed to send email to: {$submission->email}");
                $this->error("  Error: {$e->getMessage()}");
                $errorCount++;
            }
        }

        $this->newLine();
        $this->info("Summary:");
        $this->info("  Successfully sent: {$successCount}");
        
        if ($errorCount > 0) {
            $this->error("  Failed: {$errorCount}");
        }

        return 0;
    }
}
