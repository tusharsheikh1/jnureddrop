import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import RichTextEditor from '../../components/RichTextEditor';

const emptyPost = { title: '', slug: '', excerpt: '', body: '', is_published: false };

function formatDate(str) {
  if (!str) return null;
  return new Date(str).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function AdminBlogPage() {
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(null);
  const [form, setForm]       = useState(emptyPost);
  const [errors, setErrors]   = useState({});
  const [saving, setSaving]   = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const load = () => {
    setLoading(true);
    api.get('/admin/posts').then(r => setPosts(r.data.data ?? [])).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => { setForm(emptyPost); setErrors({}); setModal('create'); };

  const openEdit = async (post) => {
    const { data } = await api.get(`/admin/posts/${post.id}`);
    setForm({ ...data, is_published: data.is_published ?? false });
    setErrors({});
    setModal('edit');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title || '');
      formData.append('slug', form.slug || '');
      formData.append('excerpt', form.excerpt || '');
      formData.append('body', form.body || '');
      formData.append('language', form.language || 'en');
      formData.append('is_published', form.is_published ? 1 : 0);
      formData.append('is_featured', form.is_featured ? 1 : 0);

      if (form.cover_image instanceof File) {
        formData.append('cover_image', form.cover_image);
      } else if (typeof form.cover_image === 'string') {
        formData.append('cover_image', form.cover_image);
      }

      if (Array.isArray(form.tags)) {
        form.tags.forEach(tag => formData.append('tags[]', tag));
      }

      if (modal === 'create') {
        await api.post('/admin/posts', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        formData.append('_method', 'PUT');
        await api.post(`/admin/posts/${form.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setModal(null);
      load();
    } catch (err) {
      const d = err.response?.data;
      if (d?.errors) setErrors(d.errors);
    } finally {
      setSaving(false);
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/posts/${id}`);
      load();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-sm text-gray-500 mt-0.5">{posts.length} post{posts.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          New Post
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-16"><Loader fullPage={false} /></div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No posts yet</p>
            <p className="text-sm text-gray-400 mt-1">Create your first blog post to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Post</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Date</th>
                  <th className="px-4 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {posts.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900">{p.title}</p>
                      {p.excerpt && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{p.excerpt}</p>}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                        p.is_published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${p.is_published ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        {p.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-400 text-xs hidden sm:table-cell">
                      {formatDate(p.published_at) ?? '—'}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-2 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit post"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deletePost(p.id)}
                          disabled={deletingId === p.id}
                          className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                          title="Delete post"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {modal === 'create' ? 'New Blog Post' : 'Edit Post'}
              </h2>
              <button
                type="button"
                onClick={() => setModal(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <form id="post-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title <span className="text-red-500">*</span></label>
                  <input
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-sm"
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="Post title"
                    required
                  />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Slug <span className="text-gray-400 font-normal">(optional — auto-generated)</span></label>
                  <input
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-sm font-mono"
                    value={form.slug ?? ''}
                    onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                    placeholder="my-post-slug"
                  />
                  {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Cover Image <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-sm"
                    onChange={e => setForm(f => ({ ...f, cover_image: e.target.files[0] }))}
                  />
                  {form.cover_image && typeof form.cover_image === 'string' && (
                    <div className="mt-2">
                      <img src={form.cover_image} alt="Cover Preview" className="h-20 rounded-md object-cover" />
                    </div>
                  )}
                  {form.cover_image instanceof File && (
                    <div className="mt-2">
                      <img src={URL.createObjectURL(form.cover_image)} alt="Cover Preview" className="h-20 rounded-md object-cover" />
                    </div>
                  )}
                  {errors.cover_image && <p className="text-red-500 text-xs mt-1">{errors.cover_image[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Excerpt</label>
                  <textarea
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-sm resize-none"
                    rows={2}
                    value={form.excerpt ?? ''}
                    onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                    placeholder="Short summary shown in lists..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Body <span className="text-red-500">*</span></label>
                  <RichTextEditor
                    value={form.body ?? ''}
                    onChange={html => setForm(f => ({ ...f, body: html }))}
                  />
                  {errors.body && <p className="text-red-500 text-xs mt-1">{errors.body[0]}</p>}
                </div>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div
                    onClick={() => setForm(f => ({ ...f, is_published: !f.is_published }))}
                    className={`relative w-10 h-6 rounded-full transition-colors ${form.is_published ? 'bg-green-500' : 'bg-gray-200'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.is_published ? 'translate-x-4' : ''}`} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Publish immediately</span>
                </label>
              </form>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-100">
              <button
                form="post-form"
                type="submit"
                disabled={saving}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
              >
                {saving ? 'Saving...' : modal === 'create' ? 'Publish Post' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setModal(null)}
                className="text-gray-500 hover:text-gray-700 font-medium px-5 py-2.5 rounded-xl text-sm border border-gray-200 hover:border-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
