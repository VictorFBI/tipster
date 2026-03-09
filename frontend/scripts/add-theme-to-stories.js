const fs = require("fs");
const path = require("path");

const filesToUpdate = [
  "src/screens/settingsScreen/components/referal-block.stories.tsx",
  "src/screens/settingsScreen/components/setting-item.stories.tsx",
  "src/screens/settingsScreen/components/setting-section.stories.tsx",
  "src/screens/settingsScreen/components/settings-block.stories.tsx",
  "src/modules/posts/components/create-post-button.stories.tsx",
  "src/modules/posts/components/create-post.stories.tsx",
  "src/modules/posts/components/posts-list.stories.tsx",
  "src/modules/verification/components/ForgotPasswordVerify.stories.tsx",
  "src/modules/verification/components/VerificationCodeScreen.stories.tsx",
  "src/modules/verification/components/VerifyEmail.stories.tsx",
];

function addThemeDecorator(content, filePath) {
  // Add import for withTheme if not present
  if (!content.includes("withTheme")) {
    const importMatch = content.match(/^(import.*from.*\n)+/m);
    if (importMatch) {
      const lastImportIndex = importMatch[0].lastIndexOf("\n");
      const beforeImports = content.substring(
        0,
        importMatch.index + lastImportIndex + 1,
      );
      const afterImports = content.substring(
        importMatch.index + lastImportIndex + 1,
      );
      content =
        beforeImports +
        'import { withTheme } from "@/src/shared/storybook/decorators";\n' +
        afterImports;
    }
  }

  // Add decorators to meta if not present
  if (!content.includes("decorators:")) {
    content = content.replace(
      /(const meta = \{[^}]*)(} satisfies Meta)/s,
      "$1  decorators: [withTheme],\n$2",
    );
  }

  return content;
}

function addThemeVariants(content) {
  // Find all story exports
  const storyRegex = /export const (\w+): Story = \{([^}]*)\};/gs;
  let match;
  const stories = [];

  while ((match = storyRegex.exec(content)) !== null) {
    const storyName = match[1];
    const storyContent = match[2];

    // Skip if already has Dark/Light suffix
    if (storyName.endsWith("Dark") || storyName.endsWith("Light")) {
      continue;
    }

    stories.push({
      name: storyName,
      content: storyContent,
      fullMatch: match[0],
      index: match.index,
    });
  }

  // Replace stories with Dark/Light variants
  let offset = 0;
  for (const story of stories) {
    const darkStory = `export const ${story.name}Dark: Story = {${story.content}  parameters: {\n    backgrounds: { default: "dark" },\n  },\n};`;
    const lightStory = `\n\nexport const ${story.name}Light: Story = {${story.content}  parameters: {\n    backgrounds: { default: "light" },\n    theme: "light",\n  },\n};`;

    const replacement = darkStory + lightStory;
    const actualIndex = story.index + offset;

    content =
      content.substring(0, actualIndex) +
      replacement +
      content.substring(actualIndex + story.fullMatch.length);
    offset += replacement.length - story.fullMatch.length;
  }

  return content;
}

// Process each file
filesToUpdate.forEach((file) => {
  const filePath = path.join(__dirname, "..", file);

  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${file} - file not found`);
    return;
  }

  let content = fs.readFileSync(filePath, "utf8");

  // Add theme decorator
  content = addThemeDecorator(content, filePath);

  // Add theme variants
  content = addThemeVariants(content);

  fs.writeFileSync(filePath, content, "utf8");
  console.log(`Updated ${file}`);
});

console.log("Done!");
