import { YStack, Text, Button, ScrollView } from "tamagui";
import { useTranslation } from "react-i18next";
import { useProfileForm } from "./useProfileForm";
import { WelcomeHeader } from "./welcomeHeader/welcome-header";
import { AvatarPicker } from "./avatarPicker/avatar-picker";
import { ProfileFormFields } from "./profileFormFields/profile-form-fields";
import { StyledButton } from "@/src/shared";

export function ProfileFillingScreen() {
  const { t } = useTranslation();

  const {
    username,
    setUsername,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    bio,
    handleBioChange,
    avatar,
    isPending,
    isFormValid,
    handleSave,
    handleAddAvatar,
    maxBioLength,
  } = useProfileForm();

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        paddingBottom: 40,
      }}
      showsVerticalScrollIndicator={false}
      backgroundColor="$background"
    >
      <YStack paddingHorizontal="$4" paddingTop="$12" gap="$4">
        <WelcomeHeader />

        <AvatarPicker avatar={avatar} onPress={handleAddAvatar} />

        <ProfileFormFields
          username={username}
          onUsernameChange={setUsername}
          firstName={firstName}
          onFirstNameChange={setFirstName}
          lastName={lastName}
          onLastNameChange={setLastName}
          bio={bio}
          onBioChange={handleBioChange}
          maxBioLength={maxBioLength}
        />

        <StyledButton
          onPress={handleSave}
          disabled={!isFormValid || isPending}
          opacity={!isFormValid || isPending ? 0.5 : 1}
          buttonSize="m"
          color="accent"
        >
          <Text color="white" fontSize={16} fontWeight="600">
            {isPending
              ? t("common.loading") || "Loading..."
              : t("profile.filling.createProfile")}
          </Text>
        </StyledButton>
      </YStack>
    </ScrollView>
  );
}
