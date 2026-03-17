import React, { useState } from "react";
import { Platform, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useForm } from "react-hook-form";
import { YStack, XStack, Text, View } from "tamagui";
import { useTranslation } from "react-i18next";
import { ConfirmButton } from "../../shared/ui/confirmButton/confirmButton";
import { PasswordInput } from "../../modules/auth/components/passwordInput/passwordInput";
import { EmailInput } from "../../modules/auth/components/emailInput/emailInput";
import { ErrorMessage } from "../../shared/ui/errorMessage/errorMessage";
import { getErrorMessage } from "../../core/utils";
import { useLogin } from "@/src/modules/auth";

type LoginFormData = {
  email: string;
  password: string;
};

export function Login() {
  const { t } = useTranslation();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string>("");

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useLogin();

  const onSubmit = async (data: LoginFormData) => {
    try {
      setErrorMsg("");

      // TODO API
      // await loginMutation.mutateAsync({
      //   email: data.email,
      //   password: data.password,
      // });

      router.replace("/(tabs)");
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.log("fa", errorMessage);
      setErrorMsg(errorMessage);
      console.error("Login error:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <StatusBar style="light" />
      <View flex={1} backgroundColor="$background2">
        <YStack
          flex={1}
          paddingHorizontal="$6"
          paddingTop="$12"
          paddingBottom="$8"
          gap="$4"
        >
          <YStack alignItems="center">
            <YStack
              width={80}
              height={80}
              borderRadius={40}
              backgroundColor="$accent"
              alignItems="center"
              justifyContent="center"
              marginBottom="$4"
            >
              <Text fontSize={40}>🔗</Text>
            </YStack>
          </YStack>

          <Text
            fontSize="$9"
            fontWeight="bold"
            color="$text"
            textAlign="center"
          >
            Tipster
          </Text>
          <Text
            fontSize="$3"
            color="$text"
            opacity={0.7}
            textAlign="center"
            marginBottom="$8"
          >
            {t("auth.earnCrypto")}
          </Text>

          <YStack gap="$4" width="100%">
            <YStack gap="$2">
              <EmailInput
                control={control}
                errors={errors.email}
                message={errors.email?.message}
              />
              <PasswordInput
                label={t("auth.password")}
                control={control}
                errors={errors.password}
                message={errors.password?.message}
                rules={{
                  required: t("auth.passwordRequired"),
                  minLength: {
                    value: 6,
                    message:
                      t("auth.passwordMinLength") ||
                      "Password must be at least 6 characters",
                  },
                }}
              />

              <XStack justifyContent="flex-end" marginTop="$1">
                <TouchableOpacity
                  onPress={() => router.push("/forgot-password")}
                >
                  <Text fontSize="$3" color="$accent" fontWeight="600">
                    {t("auth.forgotPassword")}
                  </Text>
                </TouchableOpacity>
              </XStack>
            </YStack>

            <ErrorMessage message={errorMsg} visible={!!errorMsg} />

            <ConfirmButton
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting || loginMutation.isPending}
              opacity={isSubmitting || loginMutation.isPending ? 0.5 : 1}
              text={
                isSubmitting || loginMutation.isPending
                  ? t("auth.loggingIn")
                  : t("auth.login")
              }
            />

            <Text
              fontSize="$3"
              color="$text"
              opacity={0.5}
              textAlign="center"
              marginVertical="$2"
            >
              {t("auth.or")}
            </Text>

            <XStack justifyContent="center" alignItems="center" gap="$2">
              <Text fontSize="$3" color="$text" opacity={0.7}>
                {t("auth.dontHaveAccount")}
              </Text>

              <Link href="/register" asChild>
                <TouchableOpacity>
                  <Text fontSize="$3" color={"$accent"} fontWeight="800">
                    {t("auth.register")}
                  </Text>
                </TouchableOpacity>
              </Link>
            </XStack>
          </YStack>
        </YStack>
      </View>
    </KeyboardAvoidingView>
  );
}
