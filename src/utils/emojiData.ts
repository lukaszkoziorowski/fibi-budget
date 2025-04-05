export interface EmojiCategory {
  name: string;
  emojis: string[];
}

export const emojiCategories: EmojiCategory[] = [
  {
    name: "Frequently Used",
    emojis: ['📋', '💰', '🏠', '🍔', '🚗', '🛒', '💊', '👕', '🎓', '🎮', '✈️', '🎁']
  },
  {
    name: "Finance",
    emojis: ['💰', '💵', '💸', '💳', '💻', '📊', '📈', '📉', '🏦', '💎', '🧾', '💹', '🏧', '📱', '💼', '🔐', '📝', '📄']
  },
  {
    name: "Home",
    emojis: ['🏠', '🏡', '🏘️', '🏢', '🛋️', '🛏️', '🚿', '🧹', '🧺', '🧼', '🪣', '🧴', '🧽', '🪒', '🛁', '🚽', '⚡', '💡', '🪑', '🖼️']
  },
  {
    name: "Food",
    emojis: ['🍔', '🍕', '🍗', '🥩', '🍖', '🌮', '🌯', '🥗', '🥪', '🍣', '🍱', '🍛', '🍜', '🍝', '🥘', '🧆', '🥙', '🫔', '🌭', '🍟']
  },
  {
    name: "Transportation",
    emojis: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🛵', '🏍️', '🚲', '🛴', '🚅', '✈️']
  },
  {
    name: "Shopping",
    emojis: ['🛒', '🛍️', '👜', '👚', '👕', '👖', '🧥', '👗', '👠', '👟', '👓', '🧢', '👑', '⌚', '💍', '💎', '🥾', '👔', '🩱', '🎽']
  },
  {
    name: "Health",
    emojis: ['💊', '💉', '🩺', '🩹', '🔬', '🧪', '🦷', '🧠', '👁️', '🫀', '🫁', '🦾', '🦿', '🦴', '🏥', '🏃', '🧘', '🏋️', '🚴', '🧬']
  },
  {
    name: "Entertainment",
    emojis: ['🎮', '🎬', '🎵', '🎸', '🎹', '🎤', '🎧', '🎨', '🎭', '🎪', '🎟️', '🎫', '🎯', '🎱', '🎲', '🧩', '🎰', '🎨', '📺', '📚']
  },
  {
    name: "Travel",
    emojis: ['✈️', '🚂', '🚢', '🚁', '🛳️', '🚆', '🚀', '🧳', '🏖️', '🏝️', '🏜️', '⛰️', '🏔️', '🗻', '🏕️', '🏞️', '🏙️', '🌄', '🌅', '🌃']
  },
  {
    name: "Activities",
    emojis: ['🎁', '🎉', '🎊', '🎈', '🎂', '🎄', '🎃', '🎗️', '🎟️', '🎖️', '🏆', '⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🎱', '🏓', '🥊']
  }
];

export const filterEmojis = (searchTerm: string, category: EmojiCategory) => {
  if (!searchTerm) return category.emojis;
  return category.emojis.filter(emoji => 
    emoji.toLowerCase().includes(searchTerm.toLowerCase())
  );
}; 