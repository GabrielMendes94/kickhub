import { Box, Stack, Typography } from "@mui/material";

type UserBadgeProps = {
  initials: string;
  name: string;
  role: string;
};

export function UserBadge({ initials, name, role }: UserBadgeProps) {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      alignItems="center"
      sx={{
        backgroundColor: "rgba(255,255,255,0.25)",
        borderRadius: 50,
        px: 2,
        py: 1.5,
        backdropFilter: "blur(8px)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      }}
    >
      <Box
        sx={{
          width: 50,
          height: 50,
          borderRadius: "50%",
          backgroundColor: "#1f2937",
          color: "#ffffff",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {initials}
      </Box>
      <Box>
        <Typography fontWeight={600}>{name}</Typography>
        <Typography variant="body2" sx={{ color: "rgba(17,24,39,0.7)" }}>
          {role}
        </Typography>
      </Box>
    </Stack>
  );
}
