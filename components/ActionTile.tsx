import Link from "next/link";
import type { ReactNode } from "react";
import { Box, ButtonBase, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

type ActionTileProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  backgroundColor: string;
  href?: string;
  onClick?: () => void;
};

export function ActionTile({ title, description, icon, backgroundColor, href, onClick }: ActionTileProps) {
  const alignCenter = Boolean(icon);

  const content = (
    <Stack
      spacing={0.5}
      alignItems={alignCenter ? "center" : "flex-start"}
      textAlign={alignCenter ? "center" : "left"}
      sx={{ width: "100%" }}
    >
      {icon ? (
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.4)",
            backgroundColor: alpha("#ffffff", 0.18),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 0.5,
            "& svg": {
              width: 26,
              height: 26,
            },
          }}
          aria-hidden="true"
        >
          {icon}
        </Box>
      ) : null}
      <Typography variant="subtitle1" fontWeight={700} component="strong" sx={{ color: "#ffffff" }}>
        {title}
      </Typography>
      {description ? (
        <Typography variant="body2" sx={{ color: alpha("#ffffff", 0.85) }}>
          {description}
        </Typography>
      ) : null}
    </Stack>
  );

  const baseSx = {
    width: "100%",
    borderRadius: 3,
    p: 3,
    color: "#ffffff",
    display: "flex",
    flexDirection: "column" as const,
    gap: 1,
    textDecoration: "none",
    alignItems: alignCenter ? "center" : "flex-start",
    textAlign: alignCenter ? "center" : "left",
    backgroundColor,
    boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 18px 40px rgba(0,0,0,0.25)",
    },
  };

  if (href) {
    return (
      <ButtonBase component={Link} href={href} sx={baseSx} focusRipple>
        {content}
      </ButtonBase>
    );
  }

  return (
    <ButtonBase component="button" type="button" onClick={onClick} sx={baseSx} focusRipple>
      {content}
    </ButtonBase>
  );
}
