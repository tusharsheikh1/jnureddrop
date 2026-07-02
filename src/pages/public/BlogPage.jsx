import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import ModernHeader from '../../components/ModernHeader';
import Loader from '../../components/Loader';
import SEO from '../../components/SEO';

function readTime(body = '') {
  const text  = body.replace(/<[^>]*>/g, '');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function ClockIcon() {
  return (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function FeaturedCard({ post }) {
  const isBn  = post.language === 'bn';
  const mins  = post.read_time ?? readTime(post.body ?? '');
  const date  = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group block bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="md:flex">
        {/* Image */}
        <div className="relative md:w-[58%] h-52 md:h-80 overflow-hidden bg-gradient-to-br from-red-500 to-red-700 flex-shrink-0">
          {post.cover_image ? (
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center select-none">
              <span className="text-white/10 text-[120px] font-extrabold leading-none">
                {post.title[0]?.toUpperCase()}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          {post.is_featured && (
            <span className="absolute top-4 left-4 text-[10px] font-bold bg-yellow-400 text-yellow-900 px-2.5 py-0.5 rounded-full uppercase tracking-wide shadow-sm">
              Featured
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 flex flex-col justify-center flex-1">
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {post.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-[10px] font-semibold bg-red-50 text-red-500 px-2.5 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h2 className={`text-2xl md:text-3xl font-extrabold text-gray-900 leading-snug mb-3 group-hover:text-red-600 transition-colors ${isBn ? 'bangla' : ''}`}>
            {post.title}
          </h2>
          {post.excerpt && (
            <p className={`text-gray-500 text-sm leading-relaxed line-clamp-3 mb-5 ${isBn ? 'bangla' : ''}`}>
              {post.excerpt}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-auto pt-2">
            {post.author?.name && (
              <span className="flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                  {post.author.name[0]}
                </span>
                <span className="font-medium text-gray-600">{post.author.name}</span>
              </span>
            )}
            {date && <span>{date}</span>}
            <span className="ml-auto flex items-center gap-1">
              <ClockIcon />{mins} min read
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function PostCard({ post }) {
  const isBn = post.language === 'bn';
  const mins = post.read_time ?? readTime(post.body ?? '');
  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
    >
      {/* Cover */}
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-red-400 to-red-600 flex-shrink-0">
        {post.cover_image ? (
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center select-none">
            <span className="text-white/10 text-8xl font-extrabold leading-none">
              {post.title[0]?.toUpperCase()}
            </span>
          </div>
        )}
        {post.language === 'bn' && (
          <span className="absolute top-2 right-2 text-[9px] font-bold bg-white/90 text-gray-600 px-1.5 py-0.5 rounded-full">
            বাংলা
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {post.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-[10px] font-semibold bg-red-50 text-red-500 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
        <h3 className={`font-bold text-gray-900 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-red-600 transition-colors flex-1 ${isBn ? 'bangla' : ''}`}>
          {post.title}
        </h3>
        {post.excerpt && (
          <p className={`text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3 ${isBn ? 'bangla' : ''}`}>
            {post.excerpt}
          </p>
        )}
        <div className="flex items-center justify-between text-xs text-gray-400 pt-2.5 border-t border-gray-50 mt-auto">
          {date ? <span>{date}</span> : <span />}
          <span className="flex items-center gap-1">
            <ClockIcon />{mins} min
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function BlogPage() {
  const [posts, setPosts]     = useState([]);
  const [meta, setMeta]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(1);

  useEffect(() => {
    setLoading(true);
    api.get('/blog', { params: { page } })
      .then(r => { setPosts(r.data.data); setMeta(r.data); })
      .finally(() => setLoading(false));
  }, [page]);

  const featured = page === 1 ? posts[0] : null;
  const rest     = page === 1 ? posts.slice(1) : posts;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <SEO
        title="Blog — Blood Donation Stories & Tips"
        description="Articles, tips, and community stories about blood donation from JnU RedDrop. Learn about eligibility, the process, and how to save lives."
        url="/blog"
      />
      <ModernHeader title="Blog" />

      {/* Desktop hero */}
      <div className="hidden md:block bg-gradient-to-br from-red-600 to-red-700 py-12">
        <div className="max-w-6xl mx-auto px-8">
          <p className="text-red-200 text-xs font-semibold tracking-widest uppercase mb-2">JnURedDrop</p>
          <h1 className="text-4xl font-extrabold text-white mb-2">Blog</h1>
          <p className="text-red-100">Stories, tips &amp; updates from the JnU RedDrop community.</p>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="max-w-6xl mx-auto px-4 py-6 md:px-8 md:py-10">
          {posts.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No posts published yet.</p>
              <p className="text-gray-400 text-sm mt-1">Check back soon for stories &amp; updates!</p>
            </div>
          ) : (
            <>
              {featured && (
                <div className="mb-8">
                  <FeaturedCard post={featured} />
                </div>
              )}

              {rest.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {rest.map(post => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </>
          )}

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <div className="mt-10 flex justify-center items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border text-gray-500 hover:bg-red-50 disabled:opacity-40 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold transition-colors ${
                    p === meta.current_page
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-white text-gray-600 border hover:bg-red-50'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
                disabled={page === meta.last_page}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border text-gray-500 hover:bg-red-50 disabled:opacity-40 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
