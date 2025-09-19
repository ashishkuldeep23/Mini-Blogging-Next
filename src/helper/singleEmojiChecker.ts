function isSingleEmoji(str: string): boolean {
  // Match exactly one emoji, nothing else
  const emojiRegex = /^\p{Emoji}$/u;
  return emojiRegex.test(str);
}

export default isSingleEmoji;