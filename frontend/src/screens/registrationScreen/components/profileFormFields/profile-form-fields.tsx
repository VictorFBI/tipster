import { YStack, Text, TextArea } from "tamagui";
import { useTranslation } from "react-i18next";
import { StyledInput } from "@/src/shared";

interface ProfileFormFieldsProps {
  username: string;
  onUsernameChange: (text: string) => void;
  firstName: string;
  onFirstNameChange: (text: string) => void;
  lastName: string;
  onLastNameChange: (text: string) => void;
  bio: string;
  onBioChange: (text: string) => void;
  maxBioLength: number;
}

export function ProfileFormFields({
  username,
  onUsernameChange,
  firstName,
  onFirstNameChange,
  lastName,
  onLastNameChange,
  bio,
  onBioChange,
  maxBioLength,
}: ProfileFormFieldsProps) {
  const { t } = useTranslation();

  return (
    <>
      <YStack gap="$2">
        <Text fontSize={16} fontWeight="600" color="$text">
          {t("profile.filling.username")}
        </Text>
        <StyledInput
          placeholder={t("profile.filling.usernamePlaceholder")}
          value={username}
          onChangeText={onUsernameChange}
          backgroundColor="$input"
          color="$text"
          fontSize={16}
          inputSize="m"
        />
        <Text fontSize={13} color="$placeholder" lineHeight={18}>
          {t("profile.filling.usernameHint")}
        </Text>
      </YStack>

      <YStack gap="$2">
        <Text fontSize={16} fontWeight="600" color="$text">
          {t("profile.filling.firstName")}
        </Text>
        <StyledInput
          placeholder={t("profile.filling.firstNamePlaceholder")}
          value={firstName}
          onChangeText={onFirstNameChange}
          backgroundColor="$input"
          color="$text"
          fontSize={16}
          inputSize="m"
        />
      </YStack>

      <YStack gap="$2">
        <Text fontSize={16} fontWeight="600" color="$text">
          {t("profile.filling.lastName")}
        </Text>
        <StyledInput
          placeholder={t("profile.filling.lastNamePlaceholder")}
          value={lastName}
          onChangeText={onLastNameChange}
          backgroundColor="$input"
          color="$text"
          fontSize={16}
          inputSize="m"
        />
      </YStack>

      <YStack gap="$2">
        <Text fontSize={16} fontWeight="600" color="$text">
          {t("profile.filling.bio")}
        </Text>
        <TextArea
          placeholder={t("profile.filling.bioPlaceholder")}
          value={bio}
          onChangeText={onBioChange}
          backgroundColor="$input"
          borderWidth={1}
          borderColor="$border"
          color="$text"
          placeholderTextColor="$placeholder"
          fontSize={16}
          paddingVertical="$3"
          paddingHorizontal="$4"
          numberOfLines={4}
          minHeight={100}
          borderRadius={12}
          maxLength={maxBioLength}
        />
        <Text fontSize={13} color="$placeholder" textAlign="right">
          {t("profile.filling.bioCounter", { count: bio.length })}
        </Text>
      </YStack>
    </>
  );
}
