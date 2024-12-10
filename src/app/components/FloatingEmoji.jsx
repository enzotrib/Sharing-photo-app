const FloatingEmoji = ({ item }) => (
    <div
      className="floating-item"
      style={{
        left: item.left,
        animationDuration: item.animationDuration,
        fontSize: item.size,
      }}
    >
      {item.emoji}
    </div>
  );