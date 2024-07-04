import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {  AppDispatch } from '../../store/store';
import { fetchSmsDetails, setPage, setSize } from '../../store/sms/smsDetailsSlice';
import {
  selectSmsDetails,
  selectSmsDetailsLoading,
  selectSmsDetailsError,
  selectSmsDetailsPage,
  selectSmsDetailsSize,
  selectSmsDetailsTotalElements,
} from '../../store/sms/smsDetailsSelectors';
import {
  Grid,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import { SmsContentDialog } from './SmsContentDialog';
import { DataGrid, GridColDef,GridValueGetter } from '@mui/x-data-grid';
import { ParameterizedDataType, Status } from '../../types/smsTypes';
import { SmsDetailsDialog } from './SmsDetailsDialog';
import GenericSpinner from '../Common/GenericSpinner';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import MoodBadIcon from '@mui/icons-material/MoodBad';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import GenericTitle from '../Common/GenericTitle';

const SmsGrid: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const dataState = useSelector(selectSmsDetails);
  const loading = useSelector(selectSmsDetailsLoading);
  const totalElements = useSelector(selectSmsDetailsTotalElements);
  const error = useSelector(selectSmsDetailsError);
  const page = useSelector(selectSmsDetailsPage);
  const size = useSelector(selectSmsDetailsSize);
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: size,
    page: page,
  });
  const [openContentDialog, setOpenContentDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ParameterizedDataType | undefined>();

  useEffect(() => {
    dispatch(fetchSmsDetails({ page: paginationModel.page, size: paginationModel.pageSize }));
  }, [dispatch, paginationModel.page, paginationModel.pageSize]);

  const handleViewDetailsClick = (item: any) => {
    setSelectedItem(item);
    setOpenDetailsDialog(true);
  };

  const handleViewContentClick = (item: any) => {
    setSelectedItem(item);
    setOpenContentDialog(true);
  };

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
  };

  const handleCloseContentDialog = () => {
    setOpenContentDialog(false);
  };



  const columns: GridColDef[] = [
    { field: 'criteria[msisdn]', headerName: 'Tel Number', flex: 1 ,
      valueGetter: (value,row) => row.criteria.msisdn
    },
    { field: 'criteria[sms_id]', headerName: 'Sms id', flex: 0.5 ,
      valueGetter: (value,row) => row.criteria.sms_id
    },
    { field: 'createdDate', headerName: 'Created Date', flex: 1, valueFormatter: (params) => new Date(params).toLocaleDateString() },
    { field: 'useCase', headerName: 'Use Case', flex: 1 },
    { field: 'basicat', headerName: 'Basicat', flex: 0.5 },
    { field: 'modelId', headerName: 'Model ID', flex: 1 },
    {
      field: "adviseStatus",
      headerName: "Status",
      flex: 0.5,
      renderCell: ({ row: { adviseStatus } }) => {
        let icon;
        switch (adviseStatus.toString()) {
          case 'OK':
            icon = <CheckCircleOutlineIcon style ={{color:'green'}}/>;
            break;
          case 'KO':
            icon = <HighlightOffIcon style ={{color:'red'}}/>;
            break;
          case 'PENDING':
            icon = <PendingOutlinedIcon style ={{color:'orange'}}/>;
            break;
          default:
            icon = <MoodBadIcon           
/>;
        }
    
        return (
          <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%'
          }}
          >
            {icon}

          </Box>
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.75,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleViewDetailsClick(params.row)}>
          <ReadMoreIcon />
          </IconButton>
          <IconButton onClick={() => handleViewContentClick(params.row)}>
            <VisibilityIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <GenericTitle>SMS Details</GenericTitle>
        </Grid>
        <Grid item xs={12}>
        <GenericSpinner loading={loading}/>
               {error && <Typography variant="body1" color="error">Error: {error}</Typography>}
          {!loading && !error && (
              <DataGrid style={{display:'flex'}}
              rows={dataState}
              columns={columns}
              checkboxSelection disableRowSelectionOnClick
              rowCount={totalElements}
              pageSizeOptions={[5, 10, 25]}
              paginationModel={paginationModel}
              onPaginationModelChange={(newModel) => {
                setPaginationModel(newModel);
                dispatch(setPage(newModel.page));
                dispatch(setSize(newModel.pageSize));
              }}
              paginationMode="server"

              />
          )}
        </Grid>
      </Grid>

      <SmsContentDialog open={openContentDialog} item={selectedItem} handleClose={handleCloseContentDialog} />
      <SmsDetailsDialog open={openDetailsDialog} item={selectedItem} handleClose={handleCloseDetailsDialog} />
    </>
  );
};

export default SmsGrid;
