<!DOCTYPE html>
<html lang="bn-BD">
<head>
    <meta charset="UTF-8">
    <title>{{ $news->news_title }}</title>

    <style>
        
        body {
            font-family:'notobengali';
            margin: 40px;
            color: #111;
            line-height: 1.9;
            font-size: 16px;
        }

        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-sm { font-size: 14px; }
        .text-xs { font-size: 12px; }
        .text-gray { color: #555; }
        .font-bold { font-weight: bold; }

        .border-bottom {
            border-bottom: 2px solid #000;
            margin-bottom: 20px;
            padding-bottom: 10px;
        }

        .border-top {
            border-top: 1px solid #999;
            margin-top: 30px;
            padding-top: 10px;
        }

        h1 {
            font-size: 32px;
            margin: 15px 0;
            line-height: 1.4;
        }

        .meta {
            font-size: 14px;
            color: #444;
        }

        .content {
            column-count: 2;
            column-gap: 40px;
            text-align: justify;
        }

        .content p {
            margin-bottom: 12px;
        }

        img {
            max-width: 100%;
        }

        .caption {
            font-size: 12px;
            color: #666;
            margin-top: 4px;
        }

        footer {
            font-size: 13px;
            color: #666;
        }
    </style>
</head>

<body>

    <!-- HEADER -->
    <header class="text-center border-bottom">
        <img src="{{ public_path('logo.png') }}" height="70">

        <h1 class="font-bold">
            {{ $news->news_title }}
        </h1>

        <div class="meta">
            লেখক:
            {{ $news->author->name ?? 'নিজস্ব প্রতিবেদক' }}
            |
            প্রকাশিত:
            {{ $news->created_at->format('d F Y, h:i A') }}
            |
            বিভাগ:
            {{ $news->categories->first()->name ?? '-' }}
        </div>
    </header>

    <!-- FEATURE IMAGE -->
    @if($news->news_thumbnail)
        <div class="text-center" style="margin-bottom:20px;">
            <img src="{{ public_path('storage/'.$news->news_thumbnail) }}">
            @if($news->thumbnail_caption)
                <div class="caption">
                    {{ $news->thumbnail_caption }}
                </div>
            @endif
        </div>
    @endif

    <!-- NEWS CONTENT -->
    <main class="content">
                {!! html_entity_decode($news->news_description) !!}
    </main>

    <!-- FOOTER -->
    <footer class="border-top text-center">
        © {{ date('Y') }} আপনার নিউজ পোর্টাল। সর্বস্বত্ব সংরক্ষিত। <br>
        এই প্রতিবেদনটি আমাদের ওয়েবসাইট থেকে ডাউনলোড করা হয়েছে।
    </footer>

</body>
</html>