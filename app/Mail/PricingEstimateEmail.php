<?php

namespace App\Mail;

use App\Models\Submission;
use App\Services\OpenAIService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PricingEstimateEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $submission;
    public $doctorPhone = '6946051659';
    public $generatedContent;

    /**
     * Create a new message instance.
     */
    public function __construct(Submission $submission)
    {
        $this->submission = $submission;
        
        // Generate AI content
        $openAIService = new OpenAIService();
        $this->generatedContent = $openAIService->generateEmailContent($submission);
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Η Εκτίμηση Τιμών για τις Υπηρεσίες σας - Plastikos',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.pricing-estimate',
            with: [
                'submission' => $this->submission,
                'doctorPhone' => $this->doctorPhone,
                'generatedContent' => $this->generatedContent,
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
