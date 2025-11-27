import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

export type AuthHeroPanelProps = {
  title: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
  imageSx?: SxProps<Theme>;
};

export function AuthHeroPanel({ title, description, imageSrc, imageAlt, imageSx }: AuthHeroPanelProps) {
  return (
    <>
      <Typography variant="h1" sx={{ fontSize: { xs: "2rem", md: "2.6rem" } }}>
        {title}
      </Typography>
      <Typography variant="body1" sx={{ maxWidth: 420, color: "rgba(255,255,255,0.9)" }}>
        {description}
      </Typography>
      {imageSrc ? (
        <Box
          component="img"
          src={imageSrc}
          alt={imageAlt ?? "Ilustração"}
          sx={{ width: { xs: 160, md: 220 }, mt: 4, display: { xs: "none", sm: "block" }, ...imageSx }}
        />
      ) : null}
    </>
  );
}
