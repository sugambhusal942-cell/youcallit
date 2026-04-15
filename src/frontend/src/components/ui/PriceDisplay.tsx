interface PriceDisplayProps {
  cents: bigint | number;
  className?: string;
  showCurrency?: boolean;
}

export function PriceDisplay({
  cents,
  className = "",
  showCurrency = true,
}: PriceDisplayProps) {
  const amount = Number(cents) / 100;
  const formatted = new Intl.NumberFormat("en-US", {
    style: showCurrency ? "currency" : "decimal",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);

  return <span className={className}>{formatted}</span>;
}
