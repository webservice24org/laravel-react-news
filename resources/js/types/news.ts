export interface News {
  id: number
  top_title?: string | null
  news_title: string
  hanger_title?: string | null
  slug: string
  news_description: string
  news_thumbnail: string
  thumbnail_caption?: string | null
  meta_title?: string | null
  meta_description?: string | null
  is_lead: boolean
  is_sub_lead: boolean
  view_count: number
  status: number
  scheduled_at?: string | null
  created_at: string
  updated_at: string
}