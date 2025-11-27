import { Alert, Collapse } from "@mui/material";
import type { AlertColor } from "@mui/material";

export type FormSuccessAlertProps = {
  message: string | null;
  severity?: AlertColor;
  onClose?: () => void;
};

export function FormSuccessAlert({ message, severity = "success", onClose }: FormSuccessAlertProps) {
  return (
    <Collapse in={Boolean(message)}>
      <Alert severity={severity} onClose={onClose} sx={{ borderRadius: 2 }}>
        {message}
      </Alert>
    </Collapse>
  );
}
