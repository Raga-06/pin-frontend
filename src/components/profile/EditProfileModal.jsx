import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import FormInput from '../ui/FormInput';
import Button from '../ui/Button';
import { userService } from '../../services/userService';
import { useAuthStore } from '../../store/useAuthStore';
import { getImageSrc } from '../../utils/helpers';
import UserAvatar from '../ui/UserAvatar';

export default function EditProfileModal({ isOpen, onClose, user }) {
  const { updateUser } = useAuthStore();
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    website: user?.website || '',
    location: user?.location || '',
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    if (avatarFile) formData.append('image', avatarFile);
    try {
      const { data } = await userService.updateProfile(formData);
      updateUser(data.data.user);
      toast.success('Profile updated');
      onClose();
    } catch (err) {
      toast.error(err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile" size="md">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-col items-center gap-4">
          {avatarPreview ? (
            <img src={avatarPreview} alt="" className="h-24 w-24 rounded-full object-cover" />
          ) : (
            <UserAvatar user={user} size="xl" />
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files[0];
              if (f) {
                setAvatarFile(f);
                setAvatarPreview(URL.createObjectURL(f));
              }
            }}
          />
          <Button type="button" variant="secondary" onClick={() => fileRef.current?.click()}>
            Change avatar
          </Button>
        </div>
        <FormInput label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <FormInput label="Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        <FormInput label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <FormInput label="Website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
        <Button type="submit" loading={loading} className="w-full">Save changes</Button>
      </form>
    </Modal>
  );
}
