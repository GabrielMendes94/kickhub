import NextLink from "next/link";
import { Box, Divider, Link as MuiLink, Stack, Typography } from "@mui/material";

export type HistoryListEntry = {
  id: string;
  label: string;
  time: string;
  dotColor: string;
};

export type HistoryListProps = {
  entries: HistoryListEntry[];
  summaryText: string;
  footerLinkLabel: string;
  footerLinkHref: string;
};

export function HistoryList({ entries, summaryText, footerLinkHref, footerLinkLabel }: HistoryListProps) {
  return (
    <Stack spacing={3}>
      <Stack spacing={1.5}>
        {entries.map((entry) => (
          <Box
            key={entry.id}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              gap: { xs: 1.5, sm: 2 },
              p: 2,
              borderRadius: 2,
              border: "1px solid rgba(15,23,42,0.08)",
              alignItems: { xs: "flex-start", sm: "center" },
              textAlign: { xs: "left", sm: "left" },
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center" justifyContent={{ xs: "center", sm: "flex-start" }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: entry.dotColor,
                }}
                aria-hidden="true"
              />
              <Typography fontWeight={600}>{entry.label}</Typography>
            </Stack>
            <Typography sx={{ color: "text.secondary", fontWeight: 600 }}>{entry.time}</Typography>
          </Box>
        ))}
      </Stack>

      <Divider />

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
      >
        <Typography color="text.secondary">{summaryText}</Typography>
        <MuiLink component={NextLink} href={footerLinkHref} underline="none" fontWeight={700} sx={{ color: "#387d23" }}>
          {footerLinkLabel}
        </MuiLink>
      </Stack>
    </Stack>
  );
}
