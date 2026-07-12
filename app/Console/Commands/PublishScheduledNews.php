<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\NewsPost;

class PublishScheduledNews extends Command
{
    protected $signature = 'news:publish-scheduled';

    protected $description = 'Publish scheduled news posts';

    public function handle()
    {
        $posts = NewsPost::where('status', 'scheduled')
            ->whereNotNull('scheduled_at')
            ->where('scheduled_at', '<=', now())
            ->get();

        foreach ($posts as $post) {
            $post->update([
                'status' => 'published',
                'published_at' => $post->scheduled_at,
            ]);
        }

        $this->info("Published {$posts->count()} scheduled post(s).");

        return self::SUCCESS;
    }
}