<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\HomeSection;

class HomeSectionsSeeder extends Seeder
{
    public function run()
    {
        $sections = [
            ['type' => 'five_split', 'category_slug' => 'bangladesh', 'limit' => 5, 'order' => 1],
            ['type' => 'grid', 'category_slug' => 'international', 'limit' => 6, 'order' => 2],
            ['type' => 'nine_split', 'category_slug' => 'politics', 'limit' => 9, 'order' => 3],
            ['type' => 'grid', 'category_slug' => 'sports', 'limit' => 8, 'order' => 4],
            ['type' => 'four_category_block', 'category_slug' => 'education', 'limit' => 6, 'order' => 5],
            ['type' => 'four_category_block', 'category_slug' => 'jobs', 'limit' => 6, 'order' => 6],
            ['type' => 'four_category_block', 'category_slug' => 'technology', 'limit' => 6, 'order' => 7],
            ['type' => 'four_category_block', 'category_slug' => 'gadgets', 'limit' => 6, 'order' => 8],
            ['type' => 'two_column_featured', 'category_slug' => 'entertainment', 'limit' => 6, 'order' => 9],
        ];

        foreach ($sections as $section) {
            HomeSection::updateOrCreate(
                ['category_slug' => $section['category_slug']],
                $section
            );
        }
    }
}