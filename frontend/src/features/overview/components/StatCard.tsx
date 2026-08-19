type CardType = "income" | "expense" | "balance" | "subscriptions";

interface StatCardProps {
  label: string;
  value: number;
  type: CardType;
}

const typeStyles: Record<CardType, { color: string }> = {
  income: { color: "var(--text-green-200)" },
  expense: { color: "var(--text-red-500)" },
  balance: { color: "var(--text-primary-white)" },
  subscriptions: { color: "var(--text-primary-white)" },
};

const StatCard = ({ label, value, type }: StatCardProps) => {
  const styles = typeStyles[type];

  return (
    <div className="grid rounded-[10px] bg-(--card-background) px-[18.8px] py-[16.8px] text-left outline-1 outline-(--content-outline)">
      <span className="font-outfit text-sm text-(--text-gray-400)">
        {label}
      </span>

      <p
        className="font-brains text-2xl font-semibold"
        style={{ color: styles.color }}
      >
        €{Intl.NumberFormat("en-US").format(value)}
      </p>
    </div>
  );
};

export default StatCard;
