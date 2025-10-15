<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Material;
use App\Models\PricingType;
use App\Models\Service;
use App\Models\ServiceVariation;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        // Get categories
        $faceCategory = Category::where('name', 'Πρόσωπο')->first();
        $chestCategory = Category::where('name', 'Στήθος')->first();
        $bodyCategory = Category::where('name', 'Σώμα')->first();

        // Create services array
        $services = [
            // Face Services
            [
                'name' => 'Ρινοπλαστική',
                'category_id' => $faceCategory->id,
                'description' => 'Αισθητική ή λειτουργική διόρθωση ρινός',
                'pricing' => [
                    'Αμοιβή Ιατρού (€)' => ['price_from' => 2500, 'price_to' => 2500],
                    'Αναισθησιολόγος (€)' => ['price_from' => 250, 'price_to' => 250],
                    'Κλινική 1 (€)' => ['price_from' => 780, 'price_to' => 780],
                ]
            ],
            [
                'name' => 'Face Lift (ολικό)',
                'category_id' => $faceCategory->id,
                'description' => 'Ανόρθωση και σύσφιξη προσώπου και λαιμού',
                'pricing' => [
                    'Αμοιβή Ιατρού (€)' => ['price_from' => 3500, 'price_to' => 3500],
                    'Αναισθησιολόγος (€)' => ['price_from' => 350, 'price_to' => 350],
                    'Κλινική 1 (€)' => ['price_from' => 1200, 'price_to' => 1200],
                ]
            ],
            [
                'name' => 'Mini Lift',
                'category_id' => $faceCategory->id,
                'description' => 'Μερική ανόρθωση κάτω τριτημορίου προσώπου',
                'pricing' => [
                    'Αμοιβή Ιατρού (€)' => ['price_from' => 2500, 'price_to' => 2500],
                    'Αναισθησιολόγος (€)' => ['price_from' => 250, 'price_to' => 250],
                    'Κλινική 1 (€)' => ['price_from' => 800, 'price_to' => 800],
                ]
            ],
            [
                'name' => 'Βλεφαροπλαστική άνω',
                'category_id' => $faceCategory->id,
                'description' => 'Αφαίρεση χαλάρωσης και περίσσειας δέρματος άνω βλεφάρων',
                'variations' => [
                    [
                        'name' => 'με μέθη',
                        'pricing' => [
                            'Αμοιβή Ιατρού (€)' => ['price_from' => 1000, 'price_to' => 1000],
                            'Αναισθησιολόγος (€)' => ['price_from' => 200, 'price_to' => 200],
                            'Κλινική 1 (€)' => ['price_from' => 380, 'price_to' => 380],
                        ]
                    ],
                    [
                        'name' => 'με τοπική',
                        'pricing' => [
                            'Αμοιβή Ιατρού (€)' => ['price_from' => 1000, 'price_to' => 1000],
                            'Κλινική 1 (€)' => ['price_from' => 280, 'price_to' => 280],
                        ]
                    ]
                ]
            ],
            [
                'name' => 'Βλεφαροπλαστική κάτω (μέθη)',
                'category_id' => $faceCategory->id,
                'description' => 'Αφαίρεση σακουλών και περίσσειας δέρματος κάτω βλεφάρων',
                'pricing' => [
                    'Αμοιβή Ιατρού (€)' => ['price_from' => 1500, 'price_to' => 1500],
                    'Αναισθησιολόγος (€)' => ['price_from' => 200, 'price_to' => 200],
                    'Κλινική 1 (€)' => ['price_from' => 480, 'price_to' => 480],
                ]
            ],
            [
                'name' => 'Βλεφαροπλαστική άνω + κάτω',
                'category_id' => $faceCategory->id,
                'description' => 'Συνδυασμός άνω και κάτω βλεφαροπλαστικής',
                'pricing' => [
                    'Αμοιβή Ιατρού (€)' => ['price_from' => 1800, 'price_to' => 1800],
                    'Αναισθησιολόγος (€)' => ['price_from' => 200, 'price_to' => 200],
                    'Κλινική 1 (€)' => ['price_from' => 680, 'price_to' => 680],
                ]
            ],
            [
                'name' => 'Ωτοπλαστική',
                'category_id' => $faceCategory->id,
                'description' => 'Διόρθωση πεταχτών αυτιών',
                'variations' => [
                    [
                        'name' => 'με μέθη',
                        'pricing' => [
                            'Αμοιβή Ιατρού (€)' => ['price_from' => 1300, 'price_to' => 1300],
                            'Αναισθησιολόγος (€)' => ['price_from' => 200, 'price_to' => 200],
                            'Κλινική 1 (€)' => ['price_from' => 480, 'price_to' => 480],
                        ]
                    ],
                    [
                        'name' => 'με τοπική',
                        'pricing' => [
                            'Αμοιβή Ιατρού (€)' => ['price_from' => 1200, 'price_to' => 1200],
                            'Κλινική 1 (€)' => ['price_from' => 380, 'price_to' => 380],
                        ]
                    ]
                ]
            ],
            [
                'name' => 'Ανόρθωση φρυδιών - Οφρεοπλαστική',
                'category_id' => $faceCategory->id,
                'description' => 'Ανόρθωση και αναζωογόνηση περιοχής φρυδιών',
                'pricing' => [
                    'Αμοιβή Ιατρού (€)' => ['price_from' => 1400, 'price_to' => 1400],
                    'Αναισθησιολόγος (€)' => ['price_from' => 200, 'price_to' => 200],
                    'Κλινική 1 (€)' => ['price_from' => 480, 'price_to' => 480],
                ]
            ],

            // Chest Services
            [
                'name' => 'Αυξητική μαστών',
                'category_id' => $chestCategory->id,
                'description' => 'Ενθέματα σιλικόνης - γενική αναισθησία',
                'pricing' => [
                    'Αμοιβή Ιατρού (€)' => ['price_from' => 2500, 'price_to' => 2500],
                    'Αναισθησιολόγος (€)' => ['price_from' => 250, 'price_to' => 250],
                    'Κλινική 1 (€)' => ['price_from' => 940, 'price_to' => 940],
                    'Υλικά (€)' => ['price_from' => 800, 'price_to' => 800],
                ]
            ],
            [
                'name' => 'Ανόρθωση στήθους',
                'category_id' => $chestCategory->id,
                'description' => 'Ανόρθωση και αναδιαμόρφωση χαλαρού στήθους',
                'pricing' => [
                    'Αμοιβή Ιατρού (€)' => ['price_from' => 2000, 'price_to' => 2000],
                    'Αναισθησιολόγος (€)' => ['price_from' => 250, 'price_to' => 250],
                    'Κλινική 1 (€)' => ['price_from' => 1100, 'price_to' => 1100],
                ]
            ],
            [
                'name' => 'Μείωση στήθους',
                'category_id' => $chestCategory->id,
                'description' => 'Αφαίρεση περίσσειας ιστού και ανόρθωση',
                'pricing' => [
                    'Αμοιβή Ιατρού (€)' => ['price_from' => 2500, 'price_to' => 2500],
                    'Αναισθησιολόγος (€)' => ['price_from' => 250, 'price_to' => 250],
                    'Κλινική 1 (€)' => ['price_from' => 1350, 'price_to' => 1350],
                ]
            ],
            [
                'name' => 'Αντικατάσταση ενθεμάτων',
                'category_id' => $chestCategory->id,
                'description' => 'Αφαίρεση παλαιών και τοποθέτηση νέων ενθεμάτων',
                'pricing' => [
                    'Αμοιβή Ιατρού (€)' => ['price_from' => 2000, 'price_to' => 2000],
                    'Αναισθησιολόγος (€)' => ['price_from' => 250, 'price_to' => 250],
                    'Κλινική 1 (€)' => ['price_from' => 820, 'price_to' => 820],
                ]
            ],
            [
                'name' => 'Αντιμετώπιση γυναικομαστίας',
                'category_id' => $chestCategory->id,
                'description' => 'Αφαίρεση υπερτροφικού μαζικού ιστού σε άνδρα',
                'variations' => [
                    [
                        'name' => '1ρο (μέθη)',
                        'pricing' => [
                            'Αμοιβή Ιατρού (€)' => ['price_from' => 1000, 'price_to' => 1000],
                            'Αναισθησιολόγος (€)' => ['price_from' => 200, 'price_to' => 200],
                            'Κλινική 1 (€)' => ['price_from' => 480, 'price_to' => 480],
                        ]
                    ],
                    [
                        'name' => '1ρο + αδένας',
                        'pricing' => [
                            'Αμοιβή Ιατρού (€)' => ['price_from' => 1500, 'price_to' => 1500],
                            'Αναισθησιολόγος (€)' => ['price_from' => 250, 'price_to' => 250],
                            'Κλινική 1 (€)' => ['price_from' => 550, 'price_to' => 550],
                        ]
                    ],
                    [
                        'name' => '> 2 ώρες',
                        'pricing' => [
                            'Αμοιβή Ιατρού (€)' => ['price_from' => 2500, 'price_to' => 2500],
                            'Αναισθησιολόγος (€)' => ['price_from' => 250, 'price_to' => 250],
                            'Κλινική 1 (€)' => ['price_from' => 920, 'price_to' => 920],
                        ]
                    ]
                ]
            ],

            // Body Services
            [
                'name' => 'Κοιλιοπλαστική',
                'category_id' => $bodyCategory->id,
                'description' => 'Αφαίρεση περίσσειας δέρματος και λίπους κοιλιάς',
                'pricing' => [
                    'Αμοιβή Ιατρού (€)' => ['price_from' => 2500, 'price_to' => 2500],
                    'Βοηθός (€)' => ['price_from' => 300, 'price_to' => 300],
                    'Αναισθησιολόγος (€)' => ['price_from' => 250, 'price_to' => 250],
                    'Κλινική 1 (€)' => ['price_from' => 1400, 'price_to' => 1400],
                ]
            ],
            [
                'name' => 'Λιποαναρρόφηση',
                'category_id' => $bodyCategory->id,
                'description' => 'Αφαίρεση λίπους από πολλαπλές περιοχές σώματος',
                'pricing' => [
                    'Αμοιβή Ιατρού (€)' => ['price_from' => 1000, 'price_to' => 2000],
                    'Αναισθησιολόγος (€)' => ['price_from' => 250, 'price_to' => 250],
                    'Κλινική 1 (€)' => ['price_from' => 580, 'price_to' => 720],
                ]
            ],
            [
                'name' => 'Βραχιονοπλαστική',
                'category_id' => $bodyCategory->id,
                'description' => 'Αφαίρεση περίσσειας δέρματος βραχιόνων',
                'pricing' => [
                    'Αμοιβή Ιατρού (€)' => ['price_from' => 2000, 'price_to' => 2000],
                    'Αναισθησιολόγος (€)' => ['price_from' => 250, 'price_to' => 250],
                    'Κλινική 1 (€)' => ['price_from' => 640, 'price_to' => 640],
                ]
            ],
        ];

        // Create each service
        foreach ($services as $serviceData) {
            $categoryId = $serviceData['category_id'];
            unset($serviceData['category_id']);

            // Create the base service
            $service = Service::create([
                'category_id' => $categoryId,
                'name' => $serviceData['name'],
                'slug' => Str::slug($serviceData['name']),
                'description' => $serviceData['description'],
                'is_active' => true,
                'sort_order' => 0,
            ]);

            // If service has variations, create them
            if (isset($serviceData['variations'])) {
                foreach ($serviceData['variations'] as $variation) {
                    $serviceVariation = ServiceVariation::create([
                        'service_id' => $service->id,
                        'name' => $variation['name'],
                        'is_active' => true,
                        'sort_order' => 0,
                    ]);

                    // Attach pricing types for this variation
                    foreach ($variation['pricing'] as $typeName => $prices) {
                        $pricingType = PricingType::where('name', $typeName)->first();
                        if ($pricingType) {
                            $serviceVariation->pricingTypes()->attach($pricingType->id, [
                                'price_from' => $prices['price_from'],
                                'price_to' => $prices['price_to'],
                            ]);
                        }
                    }
                }
            } else {
                // Attach pricing types for regular service
                foreach ($serviceData['pricing'] as $typeName => $prices) {
                    $pricingType = PricingType::where('name', $typeName)->first();
                    if ($pricingType) {
                        $service->pricingTypes()->attach($pricingType->id, [
                            'price_from' => $prices['price_from'],
                            'price_to' => $prices['price_to'],
                        ]);
                    }
                }
            }
        }
    }
}