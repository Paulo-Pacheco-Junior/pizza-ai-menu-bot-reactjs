interface Props {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PizzaLogo({ size = "md", className = "" }: Props) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-11 h-11",
    lg: "w-14 h-14",
  };

  const svgSize = {
    sm: "w-5 h-5",
    md: "w-7 h-7",
    lg: "w-9 h-9",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-orange-500 to-red-600 border-2 border-amber-300 shadow-sm flex items-center justify-center overflow-hidden shrink-0 ${className}`}
    >
      {/* Fatia de pizza virada para baixo e inclinada (~ -35deg) igual ao ícone de Pedido Online */}
      <svg
        className={`${svgSize[size]} transform rotate-[145deg] drop-shadow-xs`}
        viewBox="0 0 24 24"
        fill="none"
      >
        {/* Chama externa */}
        <path
          d="M12 2C9.5 5 7 8.5 8 13C5.5 11.5 6 8.5 6 8.5C4 11 3 14 4.5 17.5C6 21 9.5 22 12 22C17 22 20 18 19.5 13C19 8 14.5 6 12 2Z"
          fill="#C2410C"
        />
        {/* Fatia de pizza central */}
        <path
          d="M12 6L16.5 17C15 18 13.5 18 12 18C10.5 18 9 18 7.5 17L12 6Z"
          fill="#FDE047"
        />
        {/* Borda da massa */}
        <path
          d="M7.5 17C9 18 10.5 18 12 18C13.5 18 15 18 16.5 17"
          stroke="#B45309"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        {/* Pepperonis */}
        <circle cx="12" cy="11" r="1.1" fill="#DC2626" />
        <circle cx="10.5" cy="14.5" r="1.2" fill="#DC2626" />
        <circle cx="13.5" cy="15" r="1.1" fill="#DC2626" />
      </svg>
    </div>
  );
}
