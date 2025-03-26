import React, { useState, useEffect } from 'react';
import { fetchUserProfile, updateUserProfile, UserProfile } from '../services/ProfileService';

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userData = await fetchUserProfile();
        setProfile(userData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile');
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      setIsEditing(false);
      setEditedProfile({});
    } else {
      setIsEditing(true);
      setEditedProfile({
        firstName: profile?.firstName || '',
        lastName: profile?.lastName || '',
        phone: profile?.phone || '',
        country: profile?.country || '',
        profession: profile?.profession || '',
        bio: profile?.bio || ''
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const updatedProfile = await updateUserProfile(editedProfile);
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>No profile found</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">User Profile</h1>
          <button 
            onClick={handleEditToggle}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {isEditing ? (
          <form className="space-y-4">
            <div>
              <label className="block mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={editedProfile.firstName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={editedProfile.lastName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2">Phone</label>
              <input
                type="text"
                name="phone"
                value={editedProfile.phone}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2">Country</label>
              <select
                name="country"
                value={editedProfile.country}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Country</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
                <option value="IN">India</option>
              </select>
            </div>
            <div>
              <label className="block mb-2">Profession</label>
              <input
                type="text"
                name="profession"
                value={editedProfile.profession}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2">Bio</label>
              <textarea
                name="bio"
                value={editedProfile.bio}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                rows={4}
              />
            </div>
            <button
              type="button"
              onClick={handleSaveProfile}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Save Profile
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <strong>Username:</strong> {profile.username}
            </div>
            <div>
              <strong>Email:</strong> {profile.email}
            </div>
            {profile.firstName && (
              <div>
                <strong>Name:</strong> {profile.firstName} {profile.lastName}
              </div>
            )}
            {profile.phone && (
              <div>
                <strong>Phone:</strong> {profile.phone}
              </div>
            )}
            {profile.country && (
              <div>
                <strong>Country:</strong> {profile.country}
              </div>
            )}
            {profile.profession && (
              <div>
                <strong>Profession:</strong> {profile.profession}
              </div>
            )}
            {profile.bio && (
              <div>
                <strong>Bio:</strong> {profile.bio}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;