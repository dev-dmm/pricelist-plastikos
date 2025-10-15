<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schedule pricing estimate emails to be checked every 5 minutes
// This allows emails to be sent 1-2 hours after submission
Schedule::command('emails:send-pricing-estimates')->everyFiveMinutes();
