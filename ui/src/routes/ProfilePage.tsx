import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useProfileData } from "../hooks/useProfileData";
import { ProfileCard } from "../components/ui/ProfileCard";
import { ProfileData } from "../types";

export function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { fetchProfile, loading, error } = useProfileData();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (username) {
        try {
          const data = await fetchProfile(username);
          setProfileData(data);
        } catch (err) {
          console.error("Error fetching profile:", err);
        }
      }
    };

    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        // background: '#f0f0f0', // Reverted: Remove light gray background
      }}
    >
      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Loading State */}
        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "60vh",
            }}
          >
            <p
              style={{
                fontSize: "20px",
                color: "rgba(255, 255, 255, 0.8)",
                fontFamily: "var(--font-family-body)",
              }}
            >
              Loading profile...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "60vh",
              padding: "var(--spacing-xl)",
            }}
          >
            <div
              style={{
                padding: "var(--spacing-xl)",
                borderRadius: "32px",
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 100, 100, 0.3)",
                textAlign: "center",
                maxWidth: "500px",
              }}
            >
              <p
                style={{
                  color: "rgba(255, 100, 100, 0.9)",
                  fontSize: "18px",
                  fontFamily: "var(--font-family-body)",
                }}
              >
                ❌ {error}
              </p>
            </div>
          </div>
        )}

        {/* Profile Card */}
        {!loading && !error && profileData && (
          <ProfileCard
            profile={profileData?.profile || null}
            links={profileData?.links || []}
            nfts={profileData?.nfts || []}
          />
        )}

        {/* No Profile Data State */}
        {!loading && !error && !profileData && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "60vh",
              padding: "var(--spacing-xl)",
            }}
          >
            <div
              style={{
                padding: "var(--spacing-xl)",
                borderRadius: "32px",
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                textAlign: "center",
                maxWidth: "500px",
              }}
            >
              <p
                style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "18px",
                  fontFamily: "var(--font-family-body)",
                }}
              >
                No profile data found for this username
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
