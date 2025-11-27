import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

export type SummaryStatCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
};

export function SummaryStatCard({ icon, label, value }: SummaryStatCardProps) {
  return (
    <Box
      sx={{
        borderRadius: 3,
        border: "1px solid rgba(15,23,42,0.08)",
        p: 3,
        display: "flex",
        alignItems: "center",
        gap: 2,
        background: "linear-gradient(180deg, rgba(101,227,63,0.08) 0%, rgba(56,125,35,0.05) 100%)",
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: 2,
          border: "1px solid rgba(15,23,42,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#387d23",
          backgroundColor: "#ffffff",
        }}
        aria-hidden="true"
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h6" fontWeight={700} sx={{ color: "#111827" }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}
