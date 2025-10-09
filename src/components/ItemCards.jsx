export const ItemCards = ({ 
  label, 
  number, 
  color = "#3b82f6",
  backgroundColor = "#ffffff",
  borderColor = "#e5e7eb"
}) => {
  return (
    <div
      style={{
        backgroundColor: backgroundColor,
        border: `1px solid ${borderColor}`,
        borderRadius: "12px",
        padding: "24px",
        textAlign: "center",
        minWidth: "160px",
        maxWidth: "400px",
        transition: "all 0.2s ease",
        cursor: "default",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      }}
    >
      
      <div
        style={{
          fontSize: "32px",
          fontWeight: "700",
          color: "#1f2937",
          marginBottom: "8px",
          fontFamily: "system-ui, sans-serif",
          lineHeight: "1",
        }}
      >
        {typeof number === 'number' ? number.toLocaleString() : number}
      </div>
      
     
      <div
        style={{
          fontSize: "14px",
          fontWeight: "500",
          color: "#6b7280",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {label}
      </div>
    </div>
  );
};