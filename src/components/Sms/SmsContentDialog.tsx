import { IconButton, Dialog, DialogTitle, DialogContent, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {fillContent} from '../../utils/StringUtils';
import { ParameterizedDataType } from '../../types/smsTypes';
import DOMPurify from 'dompurify'

interface SmsContentDialogProps {
  open: boolean;
  handleClose: () => void;
  item: ParameterizedDataType|undefined;
}

export function SmsContentDialog({ open, handleClose, item }: SmsContentDialogProps) {
  return (
    <Dialog  open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        Preview Content
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
      <DialogContent dangerouslySetInnerHTML={ {__html:DOMPurify.sanitize(fillContent(item?.content,item?.params,item?.delimiter) as string) }}>
      </DialogContent>
      
    </Dialog>
  );
}
