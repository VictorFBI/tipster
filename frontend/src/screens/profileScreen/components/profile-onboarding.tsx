import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { TouchableOpacity, ScrollView } from "react-native";
import { Avatar, YStack, Text, Input, TextArea, Button } from "tamagui";
import { useTranslation } from "react-i18next";

interface ProfileOnboardingProps {
  onComplete: (data: {
    displayName: string;
    bio: string;
    avatar: string | null;
  }) => void;
  onSkip: () => void;
}

export function ProfileOnboarding({
  onComplete,
  onSkip,
}: ProfileOnboardingProps) {
  const { t } = useTranslation();

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  const maxBioLength = 160;

  const handleSave = () => {
    if (displayName.trim()) {
      onComplete({
        displayName: displayName.trim(),
        bio: bio.trim(),
        avatar,
      });
    }
  };

  const handleAddAvatar = () => {
    // Placeholder for image picker functionality
    setAvatar("https://i.pravatar.cc/150?img=12");
  };

  const isFormValid = displayName.trim();

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      <YStack paddingHorizontal="$4" paddingTop="$4" gap="$5">
        {/* Welcome Header */}
        <YStack alignItems="center" gap="$2">
          <Text fontSize={28} fontWeight="700" color="$text" textAlign="center">
            {t("profile.onboarding.welcome")}
          </Text>
          <Text
            fontSize={16}
            color="#8E8E93"
            textAlign="center"
            paddingHorizontal="$2"
          >
            {t("profile.onboarding.completeProfile")}
          </Text>
        </YStack>

        <YStack alignItems="center" gap="$2.5">
          <TouchableOpacity onPress={handleAddAvatar}>
            <Avatar circular size="$12" backgroundColor="#2C2C3E">
              {avatar ? (
                <Avatar.Image src={avatar} />
              ) : (
                <Avatar.Fallback
                  backgroundColor="#2C2C3E"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Ionicons name="person-outline" size={56} color="#8E8E93" />
                </Avatar.Fallback>
              )}
            </Avatar>
          </TouchableOpacity>
          <Text fontSize={14} color="#8E8E93">
            {t("profile.onboarding.addAvatar")}
          </Text>
        </YStack>

        <YStack gap="$2">
          <Text fontSize={16} fontWeight="600" color="$text">
            {t("profile.onboarding.displayName")}
          </Text>
          <Input
            placeholder={t("profile.onboarding.displayNamePlaceholder")}
            value={displayName}
            onChangeText={setDisplayName}
            backgroundColor="#1C1C28"
            borderWidth={0}
            color="$text"
            placeholderTextColor="#8E8E93"
            fontSize={16}
            paddingVertical="$3"
            paddingHorizontal="$4"
            borderRadius={12}
          />
          <Text fontSize={13} color="#8E8E93" lineHeight={18}>
            {t("profile.onboarding.displayNameHint")}
          </Text>
        </YStack>

        {/* Bio Input */}
        <YStack gap="$2">
          <Text fontSize={16} fontWeight="600" color="$text">
            {t("profile.onboarding.bio")}
          </Text>
          <TextArea
            placeholder={t("profile.onboarding.bioPlaceholder")}
            value={bio}
            onChangeText={(text) => {
              if (text.length <= maxBioLength) {
                setBio(text);
              }
            }}
            backgroundColor="#1C1C28"
            borderWidth={0}
            color="$text"
            placeholderTextColor="#8E8E93"
            fontSize={16}
            paddingVertical="$3"
            paddingHorizontal="$4"
            numberOfLines={4}
            minHeight={120}
            borderRadius={12}
            maxLength={maxBioLength}
          />
          <Text fontSize={13} color="#8E8E93" textAlign="right">
            {t("profile.onboarding.bioCounter", { count: bio.length })}
          </Text>
        </YStack>

        <YStack
          backgroundColor="#1C1C28"
          borderRadius={12}
          padding="$4"
          borderWidth={1}
          borderColor="#2C2C3E"
        >
          <Text fontSize={15} fontWeight="600" color="$text" marginBottom="$2">
            {t("profile.onboarding.tipTitle")}
          </Text>
          <Text fontSize={14} color="#8E8E93" lineHeight={20}>
            {t("profile.onboarding.tipText")}
          </Text>
        </YStack>

        <Button
          backgroundColor="#8B5CF6"
          color="white"
          fontSize={16}
          fontWeight="600"
          borderRadius={12}
          onPress={handleSave}
          disabled={!isFormValid}
          opacity={!isFormValid ? 0.5 : 1}
          marginTop="$2"
        >
          {t("profile.onboarding.createProfile")}
        </Button>
      </YStack>
    </ScrollView>
  );
}
