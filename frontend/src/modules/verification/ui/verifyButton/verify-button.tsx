import { Text, Button } from "tamagui";
import { StyledButton } from "@/src/shared";

interface VerifyButtonProps {
  onPress: () => void;
  isVerifying: boolean;
  isCodeComplete: boolean;
  useConfirmButton: boolean;
  verifyText: string;
  verifyingText: string;
}

export function VerifyButton({
  onPress,
  isVerifying,
  isCodeComplete,
  useConfirmButton,
  verifyText,
  verifyingText,
}: VerifyButtonProps) {
  const disabled = isVerifying || !isCodeComplete;
  const label = isVerifying ? verifyingText : verifyText;

  if (useConfirmButton) {
    return (
      <StyledButton
        onPress={onPress}
        disabled={disabled}
        opacity={disabled ? 0.5 : 1}
        text={label}
      />
    );
  }

  return (
    <Button
      size="$5"
      marginTop="$4"
      onPress={onPress}
      disabled={disabled}
      opacity={disabled ? 0.5 : 1}
      pressStyle={{ opacity: 0.8 }}
      backgroundColor="$accent"
    >
      <Text fontSize="$5" fontWeight="800" color="white">
        {label}
      </Text>
    </Button>
  );
}
