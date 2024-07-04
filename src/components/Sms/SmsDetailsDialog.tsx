import {IconButton,Dialog, DialogTitle, DialogContent,List, ListItem, ListItemText, Grid, Card, CardContent, CardHeader, Typography,} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ParameterizedDataType } from '../../types/smsTypes';

interface SmsDetailsDialogProps {
  open: boolean;
  handleClose: () => void;
  item: ParameterizedDataType | undefined;
}

export function SmsDetailsDialog({ open, handleClose, item }: SmsDetailsDialogProps) {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        Details
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
      <DialogContent dividers>
        {item && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="General Information" />
                <CardContent>
                  <List>
                    <ListItem>
                      <ListItemText primary="Customer IDs" secondary={item.customerIds} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Created Date" secondary={new Date(item.createdDate).toLocaleDateString()} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Use Case" secondary={item.useCase} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Basicat" secondary={item.basicat} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Model ID" secondary={item.modelId} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Status" secondary={item.adviseStatus} />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Criteria" />
                <CardContent>
                  <List>
                    {Object.keys(item.criteria).map((key) => (
                      <ListItem key={key}>
                        <ListItemText primary={key} secondary={item.criteria[key]} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardHeader title="Template" />
                <CardContent>
                  <Typography variant="body1">{item.content}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardHeader title="Parameters" />
                <CardContent>
                  <List>
                    {Object.keys(item.params).map((key) => (
                      <ListItem key={key}>
                        <ListItemText primary={key} secondary={item.params[key]} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
}
