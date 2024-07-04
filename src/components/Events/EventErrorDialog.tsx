import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Tooltip,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from '@mui/icons-material/Check';
import { EventType } from "../../types/eventTypes";

interface EventErrorDialogProps {
  open: boolean;
  handleClose: () => void;
  item: EventType | null;
}

export function EventErrorDialog({ open, handleClose, item }: EventErrorDialogProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) {
      setCopied(false);
    }
  }, [open]);

  const handleCopyToClipboard = () => {
    if (item) {
      const content = JSON.stringify(item, null, 2);
      navigator.clipboard.writeText(content).then(() => {
        setCopied(true);
      }).catch(err => {
        console.error("Failed to copy content: ", err);
      });
    }
  };

  const renderHighlightedContent = (obj: any, title: string) => (
    <Box sx={{ marginBottom: 2 }}>
      <Typography variant="h6">{title}</Typography>
      <Box
        component="pre"
        sx={{
          backgroundColor: '#f5f5f5',
          padding: 2,
          borderRadius: 1,
          overflow: 'auto',
          maxHeight: '200px',
        }}
      >
        <code>{JSON.stringify(obj, null, 2)}</code>
      </Box>
    </Box>
  );

  return (
    <Dialog open={open} maxWidth="md" fullWidth onClose={handleClose}>
      <DialogTitle>
        Event Details
        <Tooltip title={copied ? "Copied!" : "Copy to Clipboard"}>
          <IconButton
            aria-label="copy to clipboard"
            onClick={handleCopyToClipboard}
            sx={{
              position: 'absolute',
              right: 48,
              top: 8,
              color: copied ? 'green' : 'inherit',
            }}
          >
            {copied ? <CheckIcon /> : <ContentCopyIcon />}
          </IconButton>
        </Tooltip>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {item ? (
          <>
            {renderHighlightedContent(item.eventInfo, "Event Info")}
            {renderHighlightedContent(item.adviseInfo, "Advise Info")}
            {renderHighlightedContent(item.notifications, "Notifications")}
          </>
        ) : (
          <Typography>No event data available</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}