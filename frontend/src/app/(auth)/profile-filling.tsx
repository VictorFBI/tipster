import { ProfileFillingScreen } from "@/src/screens/registrationScreen/components/profile-filling";
import { useRouter } from "expo-router";
import React from "react";

export default function ProfileFilling() {
  const router = useRouter();

  const handleComplete = (data: {
    username: string;
    firstName: string;
    lastName: string;
    displayName: string;
    bio: string;
    avatar: string | null;
  }) => {
    // TODO: Save profile data to backend
    console.log("Profile data:", data);

    // Navigate to tabs after profile completion
    router.replace("/(tabs)");
  };

  const handleSkip = () => {
    // Navigate to tabs even if user skips profile filling
    router.replace("/(tabs)");
  };

  return (
    <ProfileFillingScreen onComplete={handleComplete} onSkip={handleSkip} />
  );
}
