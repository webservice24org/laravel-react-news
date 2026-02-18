<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsPost;
use App\Models\Category;
use App\Models\SubCategory;
use App\Models\Tag;
use App\Models\User;
use App\Models\Division;
use App\Models\District;
use App\Models\Upazila;
use App\Models\Union;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Inertia\Inertia;
use DB;


class NewsPostController extends Controller
{
    /**
     * Display a listing of news posts.
     */
    public function index()
    {
        $newsPosts = NewsPost::with([
                'categories:id,name',
                'tags:id,name',
                'author:id,name',
            ])
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/News/Index', [
            'newsPosts' => $newsPosts,
        ]);
    }

    /**
     * Show the form for creating a new news post.
     */
    public function create()
    {
        return Inertia::render('Admin/News/Create', [
            'categories'    => Category::where('status', true)->get(['id', 'name']),
            'subcategories' => SubCategory::where('status', true)->get(['id', 'name', 'category_id']),
            'tags'          => Tag::orderBy('name')->get(['id', 'name']),
            'divisions'     => Division::where('status', true)->get(['id', 'name']),
            'districts'     => District::where('status', true)->get(['id', 'name', 'division_id']),
            'upazilas'      => Upazila::where('status', true)->get(['id', 'name', 'district_id']),
            'unions'        => Union::where('status', true)->get(['id', 'name', 'upazila_id']),
            'users'         => User::orderBy('name')->get(['id','name','email']),

        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'top_title'          => 'nullable|string|max:255',
            'news_title'         => 'required|string|max:255',
            'hanger_title'       => 'nullable|string|max:255',
            'slug'               => 'nullable|string|max:255|unique:news_posts,slug',
            'news_description'   => 'required|string',

            'news_thumbnail'     => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
            'thumbnail_caption'  => 'nullable|string|max:255',

            'meta_title' => 'nullable|string|max:60',
            'meta_description' => 'nullable|string|max:170',


            'is_lead'            => 'nullable|boolean',
            'is_sub_lead'        => 'nullable|boolean',
            'status'             => 'required|in:published,draft,scheduled',
            'scheduled_at'       => 'nullable|date',

            // ✅ taxonomy pivots
            'categories'         => 'required|array',
            'categories.*'       => 'integer|exists:categories,id',

            'subcategories'      => 'nullable|array',
            'subcategories.*'    => 'integer|exists:sub_categories,id',

            'tags'               => 'nullable|array',
            'tags.*'             => 'integer|exists:tags,id',
            'new_tags' => 'nullable|array',
            'new_tags.*' => 'string|max:50',


            // ✅ WP LocationSelector payload
            'unions'             => 'nullable|array',
            'unions.*'           => 'integer|exists:unions,id',
            'primary_union_id'   => 'nullable|integer|exists:unions,id',

            // optional author
            'user_id'            => 'nullable|integer|exists:users,id',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['news_title']);
        }

        $validated['user_id'] = $validated['user_id'] ?? auth()->id();
        $validated['view_count'] = 0;

        // ✅ Save thumbnail (webp)
        if ($request->hasFile('news_thumbnail')) {
            $manager = new ImageManager(new Driver());
            $image = $manager->read($request->file('news_thumbnail'));
            $webp = $image->toWebp(80);

            $filename = (string) Str::uuid() . '.webp';
            $path = 'news-thumbnails/' . $filename;

            Storage::disk('public')->put($path, (string) $webp);
            $validated['news_thumbnail'] = $path;
        }

        // ❗ remove non-columns
        unset($validated['categories'], $validated['subcategories'], $validated['tags'], $validated['unions'], $validated['primary_union_id']);

        $newsPost = NewsPost::create($validated);

        // ✅ sync taxonomy
        $newsPost->categories()->sync($request->input('categories', []));
        $newsPost->subCategories()->sync($request->input('subcategories', []));
        $newsPost->tags()->sync($request->input('tags', []));
        $tagIds = $request->input('tags', []);
        $newNames = $request->input('new_tags', []);

        if (is_array($newNames) && count($newNames)) {
            foreach ($newNames as $name) {
                $name = trim(preg_replace('/\s+/', ' ', $name));
                if ($name === '') continue;

                $tag = Tag::firstOrCreate(
                    ['name' => $name],
                    ['slug' => Str::slug($name)]
                );

                $tagIds[] = $tag->id;
            }
        }

        $tagIds = array_values(array_unique(array_map('intval', $tagIds)));
        $newsPost->tags()->sync($tagIds);

        // ✅ sync location pivots from unions[]
        [$divisionIds, $districtIds, $upazilaIds, $unionIds] = $this->resolveLocationPivotIdsFromUnionArray(
            $request->input('unions', [])
        );

        $newsPost->divisions()->sync($divisionIds);
        $newsPost->districts()->sync($districtIds);
        $newsPost->upazilas()->sync($upazilaIds);
        $newsPost->unions()->sync($unionIds);

        return redirect()
            ->route('admin.news-posts.index')
            ->with('success', 'News post created successfully.');
    }

    /**
     * Show the form for editing the specified news post.
     */
    public function edit(NewsPost $newsPost)
    {
        $newsPost->load([
            'categories:id',
            'subCategories:id',
            'tags:id',
            'author:id,name',
            'divisions:id',
            'districts:id',
            'upazilas:id',
            'unions:id', // unions pivot (selected)
        ]);

        return Inertia::render('Admin/News/Edit', [
            'newsPost' => [
                ...$newsPost->toArray(),

                'categories'    => $newsPost->categories->pluck('id')->values(),
                'subcategories' => $newsPost->subCategories->pluck('id')->values(),
                'tags'          => $newsPost->tags->pluck('id')->values(),

                // ✅ WP LocationSelector expects arrays
                'divisions' => $newsPost->divisions->pluck('id')->values(),
                'districts' => $newsPost->districts->pluck('id')->values(),
                'upazilas'  => $newsPost->upazilas->pluck('id')->values(),
                'unions'    => $newsPost->unions->pluck('id')->values(),

                // (optional) if you store primary in DB later, return it here:
                'primary_union_id' => $newsPost->primary_union_id ?? "",

                'news_thumbnail_url' => $newsPost->news_thumbnail
                    ? Storage::url($newsPost->news_thumbnail)
                    : null,
            ],

            // lists
            'categories'    => Category::where('status', true)->get(['id', 'name']),
            'subcategories' => SubCategory::where('status', true)->get(['id', 'name', 'category_id']),
            'tags'          => Tag::orderBy('name')->get(['id', 'name']),
            'users'         => User::select('id', 'name')->orderBy('name')->get(),

            'divisions' => Division::where('status', true)->get(['id', 'name']),
            'districts' => District::where('status', true)->get(['id', 'name', 'division_id']),
            'upazilas'  => Upazila::where('status', true)->get(['id', 'name', 'district_id']),
            'unions'    => Union::where('status', true)->get(['id', 'name', 'upazila_id']),
        ]);
    }


    /**
     * Update the specified news post.
     * NOTE: If new thumbnail uploaded -> delete old one, else keep old.
     */
  public function update(Request $request, NewsPost $newsPost)
{
    $validated = $request->validate([
        'top_title'          => 'nullable|string|max:255',
        'news_title'         => 'required|string|max:255',
        'hanger_title'       => 'nullable|string|max:255',
        'slug'               => 'nullable|string|max:255|unique:news_posts,slug,' . $newsPost->id,
        'news_description'   => 'required|string',

        // thumbnail optional
        'news_thumbnail'     => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
        'thumbnail_caption'  => 'nullable|string|max:255',

        'meta_title'         => 'nullable|string|max:255',
        'meta_description'   => 'nullable|string|max:255',

        'is_lead'            => 'nullable|boolean',
        'is_sub_lead'        => 'nullable|boolean',
        'status'             => 'required|in:published,draft,scheduled',
        'scheduled_at'       => 'nullable|date',

        'categories'         => 'nullable|array',
        'categories.*'       => 'integer|exists:categories,id',

        'subcategories'      => 'nullable|array',
        'subcategories.*'    => 'integer|exists:sub_categories,id',

        'tags'               => 'nullable|array',
        'tags.*'             => 'integer|exists:tags,id',

        // LocationSelector payload
        'unions'             => 'nullable|array',
        'unions.*'           => 'integer|exists:unions,id',
        'primary_union_id'   => 'nullable|integer|exists:unions,id',

        'user_id'            => 'nullable|integer|exists:users,id',
    ]);

    // ✅ auto slug
    if (empty($validated['slug'])) {
        $validated['slug'] = Str::slug($validated['news_title']);
    }

    // ✅ keep existing author if not sent
    if (!$request->filled('user_id')) {
        unset($validated['user_id']);
    }

    /**
     * ✅ AUTO-CLEAN REMOVED EDITOR IMAGES
     * Compare old vs new HTML before updating DB.
     */
    $oldHtml = (string) ($newsPost->news_description ?? "");
    $newHtml = (string) ($validated['news_description'] ?? "");

    $oldPaths = $this->extractNewsImagePathsFromHtml($oldHtml); // ['news-images/a.jpg', ...]
    $newPaths = $this->extractNewsImagePathsFromHtml($newHtml);

    $removedPaths = array_values(array_diff($oldPaths, $newPaths));

    // ✅ If new thumbnail uploaded -> delete old + store new
    if ($request->hasFile('news_thumbnail')) {
        if ($newsPost->news_thumbnail) {
            Storage::disk('public')->delete($newsPost->news_thumbnail);
        }

        $manager = new ImageManager(new Driver());
        $image = $manager->read($request->file('news_thumbnail'));
        $webp = $image->toWebp(80);

        $filename = (string) Str::uuid() . '.webp';
        $path = 'news-thumbnails/' . $filename;

        Storage::disk('public')->put($path, (string) $webp);
        $validated['news_thumbnail'] = $path;
    } else {
        unset($validated['news_thumbnail']); // don’t overwrite old
    }

    // ❗ remove non-columns before update
    unset(
        $validated['categories'],
        $validated['subcategories'],
        $validated['tags'],
        $validated['unions'],
        $validated['primary_union_id']
    );

    // ✅ update main row
    $newsPost->update($validated);

    // ✅ sync taxonomy
    $newsPost->categories()->sync($request->input('categories', []));
    $newsPost->subCategories()->sync($request->input('subcategories', []));
    $newsPost->tags()->sync($request->input('tags', []));

    // ✅ sync location pivots from unions[]
    [$divisionIds, $districtIds, $upazilaIds, $unionIds] =
        $this->resolveLocationPivotIdsFromUnionArray($request->input('unions', []));

    $newsPost->divisions()->sync($divisionIds);
    $newsPost->districts()->sync($districtIds);
    $newsPost->upazilas()->sync($upazilaIds);
    $newsPost->unions()->sync($unionIds);

    /**
     * ✅ Delete removed editor images AFTER successful update
     * (so if validation/update fails, we don’t delete files incorrectly)
     */
    foreach ($removedPaths as $p) {
        if (Storage::disk('public')->exists($p)) {
            Storage::disk('public')->delete($p);
        }
    }

    return back()->with('success', 'News post updated successfully.');
}




    /**
     * Resolve pivot IDs in WP style:
     * - if union picked -> also sync its parents (upazila, district, division)
     * - else if upazila picked -> also sync its parents
     * - else if district picked -> also sync its parent
     * - else if division picked -> only division
     */
    private function resolveLocationPivotIdsFromUnionArray(array $unionIds): array
{
    $unionIds = array_values(array_unique(array_map('intval', $unionIds)));

    if (empty($unionIds)) {
        return [[], [], [], []];
    }

    $divisionIds = [];
    $districtIds = [];
    $upazilaIds  = [];

    $unions = Union::with('upazila.district.division')
        ->whereIn('id', $unionIds)
        ->get();

    foreach ($unions as $union) {
        $u = $union->upazila;
        $d = $u?->district;
        $v = $d?->division;

        if ($u) $upazilaIds[] = $u->id;
        if ($d) $districtIds[] = $d->id;
        if ($v) $divisionIds[] = $v->id;
    }

    return [
        array_values(array_unique($divisionIds)),
        array_values(array_unique($districtIds)),
        array_values(array_unique($upazilaIds)),
        $unionIds,
    ];
}

    


    private function extractNewsImagePathsFromHtml(?string $html): array
    {
        if (!$html) return [];

        libxml_use_internal_errors(true);

        $doc = new \DOMDocument();
        // Force UTF-8 safe load
        $doc->loadHTML('<?xml encoding="utf-8" ?>' . $html, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);

        $paths = [];

        /** @var \DOMElement $img */
        foreach ($doc->getElementsByTagName('img') as $img) {
            $src = $img->getAttribute('src');
            if (!$src) continue;

            $path = $this->normalizeStoragePath($src);

            // ✅ only delete editor uploads under news-images/
            if ($path && str_starts_with($path, 'news-images/')) {
                $paths[] = $path;
            }
        }

        libxml_clear_errors();

        return array_values(array_unique($paths));
    }

    /**
     * Accepts:
     * - full URL: http://site.com/storage/news-images/a.jpg
     * - /storage/news-images/a.jpg
     * - storage/news-images/a.jpg
     * - news-images/a.jpg
     *
     * Returns:
     * - news-images/a.jpg  (disk path for Storage::disk('public'))
     */
    private function normalizeStoragePath(string $src): ?string
    {
        $path = trim($src);

        // If full URL -> take only the path
        if (filter_var($path, FILTER_VALIDATE_URL)) {
            $path = parse_url($path, PHP_URL_PATH) ?? '';
        }

        $path = ltrim($path, '/'); // remove leading /

        // remove "storage/" prefix if present
        if (str_starts_with($path, 'storage/')) {
            $path = substr($path, strlen('storage/'));
        }

        // now it should be like: news-images/...
        if (!$path) return null;

        return $path;
    }

    /**
     * Remove the specified news post.
     */
    public function destroy(NewsPost $newsPost)
    {
        // ✅ 1) delete editor inline images from news_description
        $editorImagePaths = $this->extractNewsImagePathsFromHtml($newsPost->news_description);

        foreach ($editorImagePaths as $p) {
            if (Storage::disk('public')->exists($p)) {
                Storage::disk('public')->delete($p);
            }
        }

        // ✅ 2) delete featured thumbnail
        if ($newsPost->news_thumbnail) {
            Storage::disk('public')->delete($newsPost->news_thumbnail);
        }

        // ✅ 3) detach pivots (optional but nice; cascades also work)
        $newsPost->categories()->detach();
        $newsPost->subCategories()->detach();
        $newsPost->tags()->detach();
        $newsPost->divisions()->detach();
        $newsPost->districts()->detach();
        $newsPost->upazilas()->detach();
        $newsPost->unions()->detach();

        // ✅ 4) delete post
        $newsPost->delete();

        return redirect()
            ->route('admin.news-posts.index')
            ->with('success', 'News post deleted successfully.');  
    }


  public function bulkDestroy(Request $request)
    {
        $ids = $request->input('ids', []);

        $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'integer|exists:news_posts,id',
        ]);

        $posts = NewsPost::whereIn('id', $ids)->get();

        foreach ($posts as $post) {
            // delete thumbnail if exists
            if ($post->news_thumbnail) {
                Storage::disk('public')->delete($post->news_thumbnail);
            }

            // delete post (cascade will clear pivots if foreign keys have cascade)
            $post->delete();
        }

        return back()->with('success', 'Selected news posts deleted successfully.');
    }



}
