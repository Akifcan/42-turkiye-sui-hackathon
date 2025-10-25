interface UniqueLoadingProps {
  variant?: "morph";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function UniqueLoading({
  variant = "morph",
  size = "md",
  className,
}: UniqueLoadingProps) {
  const containerSizes = {
    sm: { width: "80px", height: "80px" },
    md: { width: "120px", height: "120px" },
    lg: { width: "160px", height: "160px" },
  };
  
  const dotSizes = {
    sm: { width: "20px", height: "20px" },
    md: { width: "28px", height: "28px" },
    lg: { width: "36px", height: "36px" },
  };

  if (variant === "morph") {
    return (
      <div
        style={{
          position: "relative",
          ...containerSizes[size],
        }}
        className={className}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                ...dotSizes[size],
                backgroundColor: "#000000",
                animation: `morph-${i} 2s infinite ease-in-out`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return null;
}

