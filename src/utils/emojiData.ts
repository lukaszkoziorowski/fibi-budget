interface EmojiCategory {
  name: string;
  emojis: Array<{
    emoji: string;
    description: string;
  }>;
}

export const emojiCategories: EmojiCategory[] = [
  {
    name: "Smileys & People",
    emojis: [
      { emoji: "😀", description: "grinning face" },
      { emoji: "😃", description: "grinning face with big eyes" },
      { emoji: "😄", description: "grinning face with smiling eyes" },
      { emoji: "😁", description: "beaming face with smiling eyes" },
      { emoji: "😅", description: "grinning face with sweat" },
      { emoji: "😂", description: "face with tears of joy" },
      { emoji: "🤣", description: "rolling on the floor laughing" },
      { emoji: "😊", description: "smiling face with smiling eyes" },
      { emoji: "😇", description: "smiling face with halo" },
      { emoji: "🙂", description: "slightly smiling face" },
      { emoji: "🙃", description: "upside-down face" },
      { emoji: "😉", description: "winking face" },
      { emoji: "😌", description: "relieved face" },
      { emoji: "😍", description: "smiling face with heart-eyes" },
      { emoji: "🥰", description: "smiling face with hearts" }
    ]
  },
  {
    name: "Activities",
    emojis: [
      { emoji: "⚽", description: "soccer ball" },
      { emoji: "🏀", description: "basketball" },
      { emoji: "🏈", description: "american football" },
      { emoji: "⚾", description: "baseball" },
      { emoji: "🎾", description: "tennis" },
      { emoji: "🏐", description: "volleyball" },
      { emoji: "🏉", description: "rugby football" },
      { emoji: "🎱", description: "pool 8 ball" },
      { emoji: "🏓", description: "ping pong" },
      { emoji: "🏸", description: "badminton" },
      { emoji: "🏒", description: "ice hockey" },
      { emoji: "🏑", description: "field hockey" },
      { emoji: "🥍", description: "lacrosse" },
      { emoji: "🏏", description: "cricket game" },
      { emoji: "🎯", description: "direct hit" }
    ]
  },
  {
    name: "Food & Drink",
    emojis: [
      { emoji: "🍏", description: "green apple" },
      { emoji: "🍎", description: "red apple" },
      { emoji: "🍐", description: "pear" },
      { emoji: "🍊", description: "tangerine" },
      { emoji: "🍋", description: "lemon" },
      { emoji: "🍌", description: "banana" },
      { emoji: "🍉", description: "watermelon" },
      { emoji: "🍇", description: "grapes" },
      { emoji: "🍓", description: "strawberry" },
      { emoji: "🫐", description: "blueberries" },
      { emoji: "🍈", description: "melon" },
      { emoji: "🍒", description: "cherries" },
      { emoji: "🍑", description: "peach" },
      { emoji: "🥭", description: "mango" },
      { emoji: "🍍", description: "pineapple" }
    ]
  },
  {
    name: "Travel & Places",
    emojis: [
      { emoji: "🚗", description: "car" },
      { emoji: "🚕", description: "taxi" },
      { emoji: "🚙", description: "sport utility vehicle" },
      { emoji: "🚌", description: "bus" },
      { emoji: "🚎", description: "trolleybus" },
      { emoji: "🏎️", description: "racing car" },
      { emoji: "🚓", description: "police car" },
      { emoji: "🚑", description: "ambulance" },
      { emoji: "🚒", description: "fire engine" },
      { emoji: "🚐", description: "minibus" },
      { emoji: "🛻", description: "pickup truck" },
      { emoji: "🚚", description: "delivery truck" },
      { emoji: "🚛", description: "articulated lorry" },
      { emoji: "🚜", description: "tractor" },
      { emoji: "🛵", description: "motor scooter" }
    ]
  },
  {
    name: "Objects",
    emojis: [
      { emoji: "💡", description: "light bulb" },
      { emoji: "🔦", description: "flashlight" },
      { emoji: "🕯️", description: "candle" },
      { emoji: "🪔", description: "diya lamp" },
      { emoji: "📱", description: "mobile phone" },
      { emoji: "📲", description: "mobile phone with arrow" },
      { emoji: "💻", description: "laptop" },
      { emoji: "⌨️", description: "keyboard" },
      { emoji: "🖥️", description: "desktop computer" },
      { emoji: "🖨️", description: "printer" },
      { emoji: "🖱️", description: "computer mouse" },
      { emoji: "🖲️", description: "trackball" },
      { emoji: "📷", description: "camera" },
      { emoji: "📸", description: "camera with flash" },
      { emoji: "📹", description: "video camera" }
    ]
  },
  {
    name: "Symbols",
    emojis: [
      { emoji: "❤️", description: "red heart" },
      { emoji: "🧡", description: "orange heart" },
      { emoji: "💛", description: "yellow heart" },
      { emoji: "💚", description: "green heart" },
      { emoji: "💙", description: "blue heart" },
      { emoji: "💜", description: "purple heart" },
      { emoji: "🖤", description: "black heart" },
      { emoji: "🤍", description: "white heart" },
      { emoji: "🤎", description: "brown heart" },
      { emoji: "💔", description: "broken heart" },
      { emoji: "❣️", description: "heart exclamation" },
      { emoji: "💕", description: "two hearts" },
      { emoji: "💞", description: "revolving hearts" },
      { emoji: "💓", description: "beating heart" },
      { emoji: "💗", description: "growing heart" }
    ]
  }
]; 