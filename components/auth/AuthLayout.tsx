import type { ReactNode } from "react";
import { Box, Stack } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

export type AuthLayoutProps = {
  hero: ReactNode;
  children: ReactNode;
  heroWrapperSx?: SxProps<Theme>;
  contentWrapperSx?: SxProps<Theme>;
};

export function AuthLayout({ hero, children, heroWrapperSx, contentWrapperSx }: AuthLayoutProps) {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        py: { xs: 4, md: 0 },
        px: { xs: 2, md: 0 },
      }}
    >
      <Stack direction={{ xs: "column", md: "row" }} sx={{ flex: 1, width: "100%", gap: { xs: 4, md: 0 } }}>
        <Box
          sx={{
            flex: 1,
            background: "linear-gradient(180deg, #65E33F 0%, #387D23 100%)",
            color: "#ffffff",
            p: { xs: 5, sm: 6, md: 10 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: { xs: "center", md: "flex-start" },
            textAlign: { xs: "center", md: "left" },
            gap: 3,
            ...heroWrapperSx,
          }}
        >
          {hero}
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 3, sm: 4, md: 8 },
            ...contentWrapperSx,
          }}
        >
          {children}
        </Box>
      </Stack>
    </Box>
  );
}
