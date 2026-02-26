import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Avatar,
  XStack,
  YStack,
  Text,
  Button,
  Input,
  ScrollView,
} from "tamagui";

export interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  timestamp: string;
  content: string;
  replies?: Comment[];
}

interface CommentsSectionProps {
  comments: Comment[];
  onAddComment: (content: string) => void;
  onAddReply: (commentId: string, content: string) => void;
}

export function CommentsSection({
  comments,
  onAddComment,
  onAddReply,
}: CommentsSectionProps) {
  const { t } = useTranslation();
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleAddComment = () => {
    if (commentText.trim()) {
      onAddComment(commentText);
      setCommentText("");
    }
  };

  const handleAddReply = (commentId: string) => {
    if (replyText.trim()) {
      onAddReply(commentId, replyText);
      setReplyText("");
      setReplyingTo(null);
    }
  };

  const startReply = (commentId: string) => {
    setReplyingTo(commentId);
    setReplyText("");
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyText("");
  };

  return (
    <YStack
      gap="$3"
      marginTop="$3"
      borderTopWidth={1}
      borderTopColor="$borderColor"
      paddingTop="$3"
    >
      {comments.length > 0 ? (
        <YStack gap="$3" maxHeight={400}>
          <ScrollView>
            {comments.map((comment) => (
              <YStack key={comment.id} gap="$2" marginBottom="$3">
                <XStack gap="$2">
                  <Avatar circular size="$3">
                    <Avatar.Image src={comment.author.avatar} />
                    <Avatar.Fallback backgroundColor="$accent" />
                  </Avatar>
                  <YStack flex={1} gap="$1">
                    <XStack alignItems="center" gap="$2">
                      <Text fontSize={14} fontWeight="600" color="$text">
                        {comment.author.name}
                      </Text>
                      <Text fontSize={12} color="#8E8E93">
                        {comment.timestamp}
                      </Text>
                    </XStack>
                    <Text fontSize={14} color="$text" lineHeight={20}>
                      {comment.content}
                    </Text>
                    <Button
                      unstyled
                      onPress={() => startReply(comment.id)}
                      pressStyle={{ opacity: 0.7 }}
                      marginTop="$1"
                    >
                      <Text fontSize={12} color="#8B5CF6" fontWeight="600">
                        {t("comments.reply")}
                      </Text>
                    </Button>
                  </YStack>
                </XStack>

                {comment.replies && comment.replies.length > 0 && (
                  <YStack marginLeft="$6" gap="$2" marginTop="$2">
                    {comment.replies.map((reply) => (
                      <XStack key={reply.id} gap="$2">
                        <Avatar circular size="$2.5">
                          <Avatar.Image src={reply.author.avatar} />
                          <Avatar.Fallback backgroundColor="$accent" />
                        </Avatar>
                        <YStack flex={1} gap="$1">
                          <XStack alignItems="center" gap="$2">
                            <Text fontSize={13} fontWeight="600" color="$text">
                              {reply.author.name}
                            </Text>
                            <Text fontSize={11} color="#8E8E93">
                              {reply.timestamp}
                            </Text>
                          </XStack>
                          <Text fontSize={13} color="$text" lineHeight={18}>
                            {reply.content}
                          </Text>
                        </YStack>
                      </XStack>
                    ))}
                  </YStack>
                )}

                {replyingTo === comment.id && (
                  <XStack
                    gap="$2"
                    alignItems="center"
                    marginLeft="$6"
                    marginTop="$2"
                  >
                    <Input
                      flex={1}
                      placeholder={t("comments.writeReply")}
                      value={replyText}
                      onChangeText={setReplyText}
                      backgroundColor="$background"
                      borderColor="$borderColor"
                      borderWidth={1}
                      borderRadius="$3"
                      paddingHorizontal="$3"
                      paddingVertical="$2"
                      fontSize={13}
                      color="$text"
                      placeholderTextColor="#8E8E93"
                    />
                    <Button
                      onPress={() => handleAddReply(comment.id)}
                      backgroundColor="$accent"
                      borderRadius="$3"
                      paddingHorizontal="$3"
                      paddingVertical="$2"
                      pressStyle={{ opacity: 0.8 }}
                      disabled={!replyText.trim()}
                      opacity={replyText.trim() ? 1 : 0.5}
                    >
                      <Ionicons name="send" size={16} color="white" />
                    </Button>
                    <Button
                      onPress={cancelReply}
                      backgroundColor="transparent"
                      borderRadius="$3"
                      paddingHorizontal="$3"
                      paddingVertical="$2"
                      pressStyle={{ opacity: 0.7 }}
                    >
                      <Ionicons name="close" size={16} color="#8E8E93" />
                    </Button>
                  </XStack>
                )}
              </YStack>
            ))}
          </ScrollView>
        </YStack>
      ) : (
        <Text fontSize={14} color="#8E8E93" textAlign="center">
          {t("comments.noComments")}
        </Text>
      )}

      <XStack gap="$2" alignItems="center">
        <Input
          flex={1}
          placeholder={t("comments.addComment")}
          value={commentText}
          onChangeText={setCommentText}
          backgroundColor="$background"
          borderColor="$borderColor"
          borderWidth={1}
          borderRadius="$3"
          paddingHorizontal="$3"
          paddingVertical="$2"
          fontSize={14}
          color="$text"
          placeholderTextColor="#8E8E93"
        />
        <Button
          onPress={handleAddComment}
          backgroundColor="$accent"
          borderRadius="$3"
          paddingHorizontal="$4"
          paddingVertical="$2"
          pressStyle={{ opacity: 0.8 }}
          disabled={!commentText.trim()}
          opacity={commentText.trim() ? 1 : 0.5}
        >
          <Ionicons name="send" size={18} color="white" />
        </Button>
      </XStack>
    </YStack>
  );
}
