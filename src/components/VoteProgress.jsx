export default function VoteProgress({ percentage, color, animate = true }) {
  return (
    <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full vote-bar"
        style={{
          width: animate ? `${Math.min(percentage, 100)}%` : '0%',
          backgroundColor: color,
          transition: 'width 0.9s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
    </div>
  );
}
