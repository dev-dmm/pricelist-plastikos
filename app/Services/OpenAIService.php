<?php

namespace App\Services;

use App\Models\Submission;
use OpenAI\Laravel\Facades\OpenAI;
use Illuminate\Support\Facades\Config;
use OpenAI\Client;

class OpenAIService
{
    public function generateEmailContent(Submission $submission): string
    {
        $pricingDetails = $this->formatPricingDetails($submission);
        $totalPrice = $this->formatTotalPrice($submission);
        
        $prompt = $this->buildPrompt($submission, $pricingDetails, $totalPrice);
        
        try {
            $response = OpenAI::chat()->create([
                'model' => Config::get('openai.default_model', 'gpt-3.5-turbo'),
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are a Greek medical consultant who helps clients find the best plastic surgeons for their needs. Write a personal, humanized email to a client about pricing estimates from recommended surgeons. Write in a warm, professional, and conversational tone in Greek. Keep it simple and personal, like you are writing to a friend. Do not use formal business language or marketing speak. You are helping them find the right surgeon, not performing the surgery yourself.'
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt
                    ]
                ],
                'max_tokens' => Config::get('openai.default_settings.max_tokens', 1000),
                'temperature' => Config::get('openai.default_settings.temperature', 0.7),
            ]);
            
            return $response->choices[0]->message->content;
        } catch (\Exception $e) {
            // Fallback to default content if OpenAI fails
            return $this->getFallbackContent($submission);
        }
    }
    
    private function buildPrompt(Submission $submission, string $pricingDetails, string $totalPrice): string
    {
        $properGreeting = $this->getProperGreekGreeting($submission->name);
        $prompt = "Write a personal email starting with '{$properGreeting}' about their pricing estimate for {$submission->procedure}.\n\n";
        
        if ($submission->category) {
            $prompt .= "Category: {$submission->category}\n";
        }
        
        if ($pricingDetails) {
            $prompt .= "Pricing details:\n{$pricingDetails}\n";
        }
        
        if ($totalPrice) {
            $prompt .= "Total cost: {$totalPrice}\n";
        }
        
        if ($submission->notes) {
            $prompt .= "Patient concerns/notes (use this to personalize the email but don't mention explicitly): {$submission->notes}\n";
        }
        
        $prompt .= "\nInclude:\n";
        $prompt .= "- A warm greeting\n";
        $prompt .= "- Explanation that you found pricing estimates from recommended surgeons\n";
        $prompt .= "- Mention that these are indicative prices from the surgeons\n";
        $prompt .= "- Invitation to call for consultation to discuss surgeon options (phone: 6946051659)\n";
        $prompt .= "- Personal signature from [Your Name] - Medical Consultant\n";
        $prompt .= "- Keep it conversational and human, not corporate\n";
        $prompt .= "- Emphasize that you help them find the best surgeon for their needs\n";
        
        return $prompt;
    }
    
    private function formatPricingDetails(Submission $submission): string
    {
        if (!$submission->pricing_details || !isset($submission->pricing_details['types'])) {
            return '';
        }
        
        $details = [];
        foreach ($submission->pricing_details['types'] as $item) {
            $name = $item['name'] ?? 'Service';
            $price = $this->formatPrice($item['price_from'] ?? 0, $item['price_to'] ?? null);
            $details[] = "{$name}: {$price}";
        }
        
        return implode("\n", $details);
    }
    
    private function formatTotalPrice(Submission $submission): string
    {
        if (!$submission->total_price) {
            return '';
        }
        
        $min = $submission->total_price['min'];
        $max = $submission->total_price['max'];
        
        if ($min == $max) {
            return "€" . number_format($min, 2);
        }
        
        return "€" . number_format($min, 2) . " - €" . number_format($max, 2);
    }
    
    private function formatPrice($priceFrom, $priceTo): string
    {
        $formattedFrom = "€" . number_format($priceFrom, 2);
        
        if ($priceTo && $priceTo != $priceFrom) {
            return $formattedFrom . " - €" . number_format($priceTo, 2);
        }
        
        return $formattedFrom;
    }
    
    private function getFallbackContent(Submission $submission): string
    {
        $pricingDetails = $this->formatPricingDetails($submission);
        $totalPrice = $this->formatTotalPrice($submission);
        
        $content = $this->getProperGreekGreeting($submission->name) . "\n\n";
        
        // More open-ended introduction that varies
        $introductions = [
            "Ευχαριστούμε που επικοινωνήσατε μαζί μας για την {$submission->procedure}. Μετά από προσεκτική εξέταση της αίτησής σας, βρήκαμε και συγκεντρώσαμε εκτιμήσεις τιμών από προτεινόμενους χειρουργούς για εσάς.",
            "Σας ευχαριστούμε για το ενδιαφέρον σας για την {$submission->procedure}. Έχουμε ερευνήσει τις επιλογές σας και συγκεντρώσαμε εκτιμήσεις τιμών από ειδικευμένους χειρουργούς.",
            "Ευχαριστούμε για την επικοινωνία σας σχετικά με την {$submission->procedure}. Μετά από ανάλυση των αναγκών σας, βρήκαμε και συγκεντρώσαμε εκτιμήσεις τιμών από προτεινόμενους ειδικούς.",
            "Σας ευχαριστούμε που μας εμπιστευτήκατε για την {$submission->procedure}. Έχουμε προετοιμάσει εκτιμήσεις τιμών από προτεινόμενους χειρουργούς που μπορούν να σας βοηθήσουν."
        ];
        
        $content .= $introductions[array_rand($introductions)] . "\n\n";
        
        if ($submission->category) {
            $content .= "Κατηγορία: {$submission->category}\n";
        }
        
        if ($pricingDetails) {
            $content .= "Αναλυτικά τα κόστη:\n{$pricingDetails}\n";
        }
        
        if ($totalPrice) {
            $content .= "Συνολικό κόστος: {$totalPrice}\n";
        }
        
        // Vary the pricing disclaimer
        $disclaimers = [
            "Παρακαλώ να έχετε υπόψη ότι αυτές είναι ενδεικτικές τιμές από τους χειρουργούς. Η ακριβής τιμή θα καθοριστεί μετά από προσωπική εξέταση με τον επιλεγμένο χειρουργό.",
            "Αυτές οι τιμές είναι ενδεικτικές και βασίζονται στις τρέχουσες τιμές των χειρουργών. Η τελική τιμή θα καθοριστεί μετά από προσωπική συνάντηση.",
            "Οι παραπάνω τιμές είναι προσανατολιστικές και μπορεί να διαφέρουν ανάλογα με την περίπτωσή σας. Η ακριβής εκτίμηση θα γίνει μετά από προσωπική εξέταση."
        ];
        
        $content .= "\n" . $disclaimers[array_rand($disclaimers)] . "\n\n";
        
        // Vary the call-to-action
        $callToActions = [
            "Για να προχωρήσουμε και να συζητήσουμε τις επιλογές χειρουργών, μπορείτε να καλέσετε στο 6946051659. Είμαι διαθέσιμος Δευτέρα έως Παρασκευή, 9:00-18:00.",
            "Για να μάθετε περισσότερα και να συζητήσουμε τις επιλογές σας, καλέστε στο 6946051659. Είμαι διαθέσιμος Δευτέρα έως Παρασκευή, 9:00-18:00.",
            "Αν θέλετε να προχωρήσουμε, μπορείτε να καλέσετε στο 6946051659 για να συζητήσουμε τις επιλογές χειρουργών. Είμαι διαθέσιμος Δευτέρα έως Παρασκευή, 9:00-18:00."
        ];
        
        $content .= $callToActions[array_rand($callToActions)] . "\n\n";
        
        // Notes are used in the AI prompt for personalization, not shown explicitly
        
        // Vary the final message
        $finalMessages = [
            "Αν έχετε οποιεσδήποτε ερωτήσεις ή θέλετε να συζητήσουμε τις επιλογές χειρουργών, μη διστάσετε να επικοινωνήσετε μαζί μου.",
            "Εάν χρειάζεστε περισσότερες πληροφορίες ή θέλετε να συζητήσουμε τις επιλογές σας, είμαι εδώ για να σας βοηθήσω.",
            "Αν έχετε ερωτήσεις ή θέλετε να μάθετε περισσότερα για τις διαθέσιμες επιλογές, μη διστάσετε να επικοινωνήσετε μαζί μου."
        ];
        
        $content .= $finalMessages[array_rand($finalMessages)] . "\n\n";
        $content .= "Με εκτίμηση,\nΜανώλης\nSurgeryquote.gr";
        
        return $content;
    }
    
    private function getProperGreekGreeting(string $name): string
    {
        // Extract first name
        $firstName = trim(explode(' ', $name)[0]);
        
        // Common Greek names that use informal addressing
        $informalNames = ['Μαρία', 'Μαρια', 'Άννα', 'Ελένη', 'Ελeni', 'Κατερίνα', 'Κατερινα', 'Σοφία', 'Σοφια'];
        
        // Check if it's a common informal name
        if (in_array($firstName, $informalNames)) {
            return "Γεια σου {$firstName}";
        }
        
        // For male names ending in -ος, use vocative case
        if (preg_match('/ος$/', $firstName)) {
            $vocative = preg_replace('/ος$/', 'ε', $firstName);
            return "Γεια σας κύριε {$vocative}";
        }
        
        // For other names, use formal addressing
        return "Γεια σας κύριε/κυρία {$firstName}";
    }
}
