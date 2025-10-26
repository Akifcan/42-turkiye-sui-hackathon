import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types';
import { useUserProfiles } from '../hooks/useUserProfiles';

interface ProfileContextType {
  selectedProfile: UserProfile | null;
  profiles: UserProfile[];
  selectProfile: (profileId: string) => void;
  refreshProfiles: () => void;
  isLoading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
}

export function ProfileProvider({ children }: ProfileProviderProps) {
  const { data: profiles = [], isLoading, refetch } = useUserProfiles();
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);

  // Auto-select first profile or restore from localStorage
  useEffect(() => {
    if (profiles.length === 0) {
      setSelectedProfile(null);
      return;
    }

    // Try to restore selected profile from localStorage
    const savedProfileId = localStorage.getItem('selectedProfileId');
    
    if (savedProfileId) {
      const profile = profiles.find(p => p.objectId === savedProfileId);
      if (profile) {
        setSelectedProfile(profile);
        return;
      }
    }

    // Default to first profile
    setSelectedProfile(profiles[0]);
  }, [profiles]);

  const selectProfile = (profileId: string) => {
    const profile = profiles.find(p => p.objectId === profileId);
    if (profile) {
      setSelectedProfile(profile);
      localStorage.setItem('selectedProfileId', profileId);
    }
  };

  const refreshProfiles = async () => {
    // Add a small delay to ensure blockchain transaction has been finalized
    await new Promise(resolve => setTimeout(resolve, 1500));
    await refetch();
  };

  return (
    <ProfileContext.Provider
      value={{
        selectedProfile,
        profiles,
        selectProfile,
        refreshProfiles,
        isLoading,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfileContext() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfileContext must be used within a ProfileProvider');
  }
  return context;
}

