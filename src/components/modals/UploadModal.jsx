import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import FormInput from '../ui/FormInput';
import { postService } from '../../services/postService';
import { CATEGORIES } from '../../constants';

export default function UploadModal({ isOpen, onClose, onSuccess }) {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'photography', tags: '' });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (f) => {
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select an image');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('category', form.category);
    formData.append('tags', form.tags);
    try {
      const { data } = await postService.createPost(formData);
      toast.success('Pin created successfully!');
      onSuccess?.(data.data.post);
      onClose();
      setPreview(null);
      setFile(null);
      setForm({ title: '', description: '', category: 'photography', tags: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to upload');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a Pin" size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-colors ${
            dragActive ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-gray-300 dark:border-gray-600'
          }`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
            aria-label="Upload image"
          />
          {preview ? (
            <div className="relative w-full p-4">
              <img src={preview} alt="Preview" className="mx-auto max-h-64 rounded-xl object-contain" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setPreview(null); setFile(null); }}
                className="absolute right-6 top-6 rounded-full bg-black/50 p-1 text-white"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <>
              <Upload className="mb-3 h-10 w-10 text-gray-400" />
              <p className="font-medium">Drag & drop or click to upload</p>
              <p className="mt-1 text-sm text-gray-500">PNG, JPG, GIF, WEBP up to 5MB</p>
            </>
          )}
        </div>
        <FormInput
          label="Title"
          id="title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <FormInput
          label="Description"
          id="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div>
          <label htmlFor="category" className="mb-1.5 block text-sm font-medium">Category</label>
          <select
            id="category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="input-field"
          >
            {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
        <FormInput
          label="Tags (comma separated)"
          id="tags"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          placeholder="design, ui, inspiration"
        />
        <Button type="submit" loading={loading} className="w-full">
          Publish Pin
        </Button>
      </form>
    </Modal>
  );
}
