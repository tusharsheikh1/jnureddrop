import ModernHeader from '../../components/ModernHeader';
import Loader from '../../components/Loader';

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import SEO, { SITE_URL } from '../../components/SEO';
import { PostCard } from './BlogPage';

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost]       = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  useEffect(() => {
    api.get(`/blog/${slug}`)
      .then(r => {
        setPost(r.data.post);
        setRelated(r.data.related || []);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loader />;
  if (error) return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans">
      <SEO title="Article Not Found" noIndex />
      <ModernHeader title="Article" />
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">Post not found.</p>
        <Link to="/blog" className="btn-primary">← Back to Blog</Link>
      </div>
    </div>
  );

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || '',
    image: post.cover_image || `${SITE_URL}/logo.png`,
    url: `${SITE_URL}/blog/${post.slug}`,
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'JnU RedDrop',
    },
    publisher: {
      '@type': 'Organization',
      name: 'JnU RedDrop',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.slug}`,
    },
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans">
      <SEO
        title={post.title}
        description={post.excerpt || `Read "${post.title}" on JnU RedDrop Blog.`}
        url={`/blog/${post.slug}`}
        image={post.cover_image || undefined}
        type="article"
        jsonLd={articleJsonLd}
      />
      <ModernHeader title="Article" />
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <Link to="/blog" className="text-red-600 hover:underline text-sm mb-6 inline-block">← Back to Blog</Link>

        <article className="card">
          <p className="text-xs text-gray-400 mb-2">
            {post.author?.name && `By ${post.author.name} · `}
            {new Date(post.published_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h1>
          {post.excerpt && <p className="text-lg text-gray-500 mb-6 border-l-4 border-red-200 pl-4 italic">{post.excerpt}</p>}
          {post.cover_image && (
            <div className="mb-8 rounded-2xl overflow-hidden shadow-sm">
              <img src={post.cover_image} alt={post.title} className="w-full h-auto object-cover max-h-[450px]" />
            </div>
          )}
          <div className="text-gray-700 leading-relaxed space-y-4">
            {post.body.split('\n').map((paragraph, index) => (
              paragraph.trim() ? (
                <p key={index}>{paragraph}</p>
              ) : null
            ))}
          </div>
        </article>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">More from our blog</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map(r => (
                <PostCard key={r.id} post={r} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
