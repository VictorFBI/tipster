import { YStack, Text } from "tamagui";
import { ReactNode } from "react";

interface SettingSectionProps {
  title: string;
  children: ReactNode;
}

export function SettingSection({ title, children }: SettingSectionProps) {
  return (
    <YStack gap="$3">
      <Text color="$color" fontSize={18} fontWeight="600">
        {title}
      </Text>
      {children}
    </YStack>
  );
}
