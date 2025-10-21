<!DOCTYPE html>
<html lang="el">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Εκτίμηση Τιμών Plastikos</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .header p {
            margin: 10px 0 0;
            font-size: 16px;
            opacity: 0.9;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            color: #2d3748;
            margin-bottom: 20px;
        }
        .intro-text {
            color: #4a5568;
            margin-bottom: 30px;
            font-size: 15px;
        }
        .service-card {
            background: #f7fafc;
            border-left: 4px solid #667eea;
            padding: 20px;
            margin: 20px 0;
            border-radius: 6px;
        }
        .service-title {
            font-size: 20px;
            font-weight: 600;
            color: #2d3748;
            margin: 0 0 15px;
        }
        .pricing-table {
            width: 100%;
            margin-top: 15px;
        }
        .pricing-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        .pricing-row:last-child {
            border-bottom: none;
        }
        .pricing-label {
            color: #4a5568;
            font-size: 14px;
        }
        .pricing-value {
            color: #2d3748;
            font-weight: 600;
            font-size: 14px;
        }
        .total-row {
            background: #edf2f7;
            padding: 15px;
            margin-top: 10px;
            border-radius: 6px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .total-label {
            font-size: 16px;
            font-weight: 600;
            color: #2d3748;
        }
        .total-value {
            font-size: 20px;
            font-weight: 700;
            color: #667eea;
        }
        .doctor-section {
            background: #edf2f7;
            border-radius: 8px;
            padding: 25px;
            margin: 30px 0;
            text-align: center;
        }
        .doctor-title {
            font-size: 18px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 15px;
        }
        .doctor-info {
            color: #4a5568;
            margin-bottom: 20px;
        }
        .phone-button {
            display: inline-block;
            background: #48bb78;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 16px;
            margin-top: 10px;
        }
        .phone-button:hover {
            background: #38a169;
        }
        .note {
            background: #fff5f5;
            border-left: 4px solid #f56565;
            padding: 15px;
            margin: 20px 0;
            color: #742a2a;
            font-size: 14px;
            border-radius: 6px;
        }
        .footer {
            background: #2d3748;
            color: #a0aec0;
            text-align: center;
            padding: 30px;
            font-size: 13px;
        }
        .footer a {
            color: #667eea;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Η Εκτίμηση Τιμών σας είναι έτοιμη!</h1>
            <p>Plastikos - Πλαστική Χειρουργική</p>
        </div>

        <div class="content">
            <div class="greeting">
                Γεια σας {{ $submission->name }},
            </div>

            <p class="intro-text">
                Ελέγξαμε προσεκτικά την αίτησή σας και έχουμε εκτιμήσει τις τιμές για {{ $submission->procedure }} που σας ενδιαφέρει. 
                Παρακάτω θα βρείτε μια λεπτομερή ανάλυση των εκτιμώμενων κοστών:
            </p>

            <div class="service-card">
                <h2 class="service-title">{{ $submission->procedure }}</h2>
                
                @if($submission->category)
                    <p style="color: #718096; font-size: 14px; margin-bottom: 10px;">
                        <strong>Κατηγορία:</strong> {{ $submission->category }}
                    </p>
                @endif

                @if($submission->pricing_details && isset($submission->pricing_details['types']))
                    <div class="pricing-table">
                        @foreach($submission->pricing_details['types'] as $item)
                            <div class="pricing-row">
                                <span class="pricing-label">{{ $item['name'] ?? 'Service' }}</span>
                                <span class="pricing-value">
                                    @if(isset($item['price_to']) && $item['price_to'] != $item['price_from'])
                                        €{{ number_format($item['price_from'] ?? 0, 2) }} - €{{ number_format($item['price_to'] ?? 0, 2) }}
                                    @else
                                        €{{ number_format($item['price_from'] ?? 0, 2) }}
                                    @endif
                                </span>
                            </div>
                        @endforeach
                    </div>
                @endif

                @if($submission->total_price)
                    <div class="total-row">
                        <span class="total-label">Συνολικό Κόστος:</span>
                        <span class="total-value">
                            @if($submission->total_price['min'] == $submission->total_price['max'])
                                €{{ number_format($submission->total_price['min'], 2) }}
                            @else
                                €{{ number_format($submission->total_price['min'], 2) }} - €{{ number_format($submission->total_price['max'], 2) }}
                            @endif
                        </span>
                    </div>
                @endif
            </div>

            <div class="note">
                <strong>Σημείωση:</strong> Οι τιμές που αναφέρονται είναι ενδεικτικές. Η τελική τιμή θα καθοριστεί μετά από προσωπική εξέταση και συνάντηση με τον γιατρό.
            </div>

            <div class="doctor-section">
                <div class="doctor-title">🏥 Ο Ιδανικός Γιατρός για τις Ανάγκες σας</div>
                <p class="doctor-info">
                    Βάσει της εμπειρίας μας και της ειδικότητας που απαιτείται για τη συγκεκριμένη επέμβαση, 
                    σας προτείνουμε να επικοινωνήσετε με τον ειδικό μας γιατρό.
                </p>
                <p style="font-size: 15px; color: #2d3748; margin: 15px 0;">
                    <strong>Καλέστε τώρα για ραντεβού:</strong>
                </p>
                <a href="tel:{{ $doctorPhone }}" class="phone-button">
                    📞 {{ $doctorPhone }}
                </a>
                <p style="margin-top: 15px; font-size: 13px; color: #718096;">
                    Διαθέσιμοι Δευτέρα - Παρασκευή, 9:00 - 18:00
                </p>
            </div>

            @if($submission->notes)
                <div style="margin-top: 25px; padding: 15px; background: #f7fafc; border-radius: 6px;">
                    <p style="margin: 0; color: #4a5568; font-size: 14px;">
                        <strong>Οι σημειώσεις σας:</strong><br>
                        {{ $submission->notes }}
                    </p>
                </div>
            @endif

            <p style="margin-top: 30px; color: #4a5568; font-size: 14px;">
                Εάν έχετε οποιεσδήποτε ερωτήσεις ή χρειάζεστε περαιτέρω πληροφορίες, 
                μη διστάσετε να επικοινωνήσετε μαζί μας στο παραπάνω τηλέφωνο ή να απαντήσετε σε αυτό το email.
            </p>

            <p style="margin-top: 20px; color: #2d3748; font-weight: 600;">
                Σας ευχαριστούμε για την εμπιστοσύνη σας!<br>
                <span style="color: #667eea;">Η Ομάδα Plastikos</span>
            </p>
        </div>

        <div class="footer">
            <p style="margin: 0 0 10px;">
                © {{ date('Y') }} Plastikos - Πλαστική Χειρουργική. Με επιφύλαξη παντός δικαιώματος.
            </p>
            <p style="margin: 0;">
                Αυτό το email στάλθηκε σε απάντηση του αιτήματός σας για εκτίμηση τιμών.
            </p>
        </div>
    </div>
</body>
</html>

