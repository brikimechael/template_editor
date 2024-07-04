import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '../../store/store';
import {fetchEventDetails} from '../../store/event/eventDetailsSlice';
import {
    selectEvents,
    selectEventsError,
    selectEventsLoading,
    selectEventsTotalElements,
} from '../../store/event/eventDetailsSelectors';
import {Box, Dialog, DialogContent, DialogTitle, IconButton, Typography} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import {DataGrid, GridColDef, GridRenderCellParams, GridToolbar} from '@mui/x-data-grid';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import GenericTitle from '../Common/GenericTitle';
import {Button, DateRangePicker, Form, Input, InputGroup, SelectPicker} from 'rsuite';
import TagFilter from '@rsuite/icons/TagFilter';
import 'rsuite/dist/rsuite.min.css';
import CloseIcon from '@mui/icons-material/Close';
import GenericSpinner from '../Common/GenericSpinner';
import {DateRange, EventType, FilterRequest, Notification, Status} from "../../types/eventTypes";
import StyledResizableBox from "../Common/StyledResizableBox";
import subDays from 'date-fns/subDays';
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import addDays from 'date-fns/addDays';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import addMonths from 'date-fns/addMonths';
import {RangeType} from "rsuite/esm/DateRangePicker/types";
import {endOfDay, startOfDay} from "rsuite/cjs/internals/utils/date";
import {EventErrorDialog} from "./EventErrorDialog";
import { CheckCircle, XCircle, Clock } from 'lucide-react';
const StatusIcon = ({ status }: { status: Status }) => {
    switch (status) {
      case Status.OK:
        return <CheckCircle className="text-green-500" />;
      case Status.KO:
        return <XCircle className="text-red-500" />;
      case Status.PENDING:
        return <Clock className="text-yellow-500" />;
      default:
        return null;
    }
  };
const predefinedRanges:RangeType[] = [
    {
        label: 'Today',
        value: [
            startOfDay(new Date()),
            new Date()
        ],
        placement: 'left'
    },
    {
        label: 'Yesterday',
        value: [
            startOfDay(subDays(new Date(), 1)),
            endOfDay(subDays(new Date(), 1))
        ],
        placement: 'left'
    },
    {
        label: 'This week',
        value: [startOfWeek(new Date()), endOfWeek(new Date())],
        placement: 'left'
    },
    {
        label: 'Last 7 days',
        value: [subDays(new Date(), 6), new Date()],
        placement: 'left'
    },
    {
        label: 'Last 30 days',
        value: [subDays(new Date(), 29), new Date()],
        placement: 'left'
    },
    {
        label: 'This month',
        value: [startOfMonth(new Date()), new Date()],
        placement: 'left'
    },
    {
        label: 'Last month',
        value: [startOfMonth(addMonths(new Date(), -1)), endOfMonth(addMonths(new Date(), -1))],
        placement: 'left'
    },
    {
        label: 'This year',
        value: [new Date(new Date().getFullYear(), 0, 1), new Date()],
        placement: 'left'
    },
    {
        label: 'Last year',
        value: [new Date(new Date().getFullYear() - 1, 0, 1), new Date(new Date().getFullYear(), 0, 0)],
        placement: 'left'
    },
    {
        label: 'All time',
        value: [new Date(new Date().getFullYear() - 1, 0, 1), new Date()],
        placement: 'left'
    },
    {
        label: 'Last week',
        closeOverlay: false,
        value: (value: DateRange|undefined) => {
            const [start = new Date()] = value || [];
            return [
                addDays(startOfWeek(start, { weekStartsOn: 0 }), -7),
                addDays(endOfWeek(start, { weekStartsOn: 0 }), -7)
            ];
        },
    },
    {
        label: 'Next week',
        closeOverlay: false,
        value: (value: DateRange|undefined) => {
            const [start = new Date()] = value || [];
            return [
                addDays(startOfWeek(start, { weekStartsOn: 0 }), 7),
                addDays(endOfWeek(start, { weekStartsOn: 0 }), 7)
            ];
        },
    }
];

const EventsGrid: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const events = useSelector(selectEvents);
    const loading = useSelector(selectEventsLoading);
    const totalElements = useSelector(selectEventsTotalElements);
    const error = useSelector(selectEventsError);
    const [selectedItem, setSelectedItem] = useState<EventType | undefined>();
    const [selectedText, setSelectedText] = useState<string | null| undefined>();
    const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);

    const [showNotifications, setShowNotifications] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState<Notification | undefined>();
    const [dialogOpen, setDialogOpen] = useState(false);
    const eventsGridRef = React.useRef(null);

    const [request, setRequest] = useState<FilterRequest>({
        dateRange: [
            startOfDay(new Date()),
            new Date()
        ],
        msisdn: undefined,
        apiIdentifier: undefined,
        recipientEmailAddress: undefined,
        adviseStatus: null,
        useCase: undefined,
        page: 0,
        size: 10,
    });

    useEffect(() => {
        dispatch(fetchEventDetails(request));
    }, [request.page, request.size]);

    const handleSubmit = () => {
        dispatch(fetchEventDetails(request));
    };

    const handleFilterChange = (value: any, name: string) => {
        setRequest(prevState => {
            return {
                ...prevState,
                [name]: name === 'adviseStatus' ? (value as Status | null) : value,
                page: 0
            };
        });
    };

    const handleViewNotifications = (item: EventType) => {
        setSelectedItem(item);
        setShowNotifications(true);
    };

    const handleCloseNotifications = () => {
        setShowNotifications(false);
    };

    const handleStatusClick = (item: EventType) => {
        setSelectedEvent(item);
        setSelectedText(item.adviseInfo.error);
        handleOpenDialog();
    };

    const handleNotificationStatusClick = (notification: Notification) => {

        setSelectedText(notification.serviceError);
        handleOpenDialog();
    };


    const handleOpenDialog = () => {
        
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {

        setDialogOpen(false);
        setSelectedEvent(null);

    };

    const renderStatus = (status: Status) => {
        switch (status) {
            case Status.OK:
                return <CheckCircleOutlineIcon style={{color: 'green'}}/>;
            case Status.KO:
                return <HighlightOffIcon style={{color: 'red'}}/>;
            case Status.PENDING:
                return <PendingOutlinedIcon style={{color: 'orange'}}/>;
        }
    };

    const renderNotificationStatus = (notifications: Notification[]) => {
        const counts = {OK: 0, KO: 0, PENDING: 0};
        notifications.forEach(notification => counts[notification.status]++);

        return (
            <Box sx={{display: 'flex', gap: 1}}>
                {Object.entries(counts).map(([status, count]) => (
                    <Box
                        key={status}
                        sx={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.75rem',
                            backgroundColor: status === 'OK' ? 'green' : status === 'KO' ? 'red' : 'orange',
                        }}
                    >
                        {count}
                    </Box>
                ))}
            </Box>
        );
    };

    const columns: GridColDef<EventType>[] = [
        {
            field: 'eventInfo.id',
            headerName: 'Event ID',
            flex: 0.5,
            valueGetter: (value, row) => row.eventInfo.id
        },
        {
            field: 'eventInfo.basicat',
            headerName: 'Basicat',
            flex: 1,
            valueGetter: (value, row) => row.eventInfo.basicat
        },
        {
            field: 'eventInfo.createdDate',
            headerName: 'Created Date',
            flex: 1,
            valueGetter: (value, row) => row.eventInfo.createdDate
        },
        {
            field: 'eventInfo.useCase',
            headerName: 'Use Case',
            flex: 1,
            valueGetter: (value, row) => row.eventInfo.useCase
        },
        {
            field: 'eventInfo.msisdn',
            headerName: 'MSISDN',
            flex: 1,
            valueGetter: (value, row) => row.eventInfo.msisdn
        },
        {
            field: 'eventInfo.apiIdentifier',
            headerName: 'API Identifier',
            flex: 1,
            valueGetter: (value, row) => row.eventInfo.apiIdentifier
        },
        {
            field: 'eventInfo.customerIds',
            headerName: 'Recipient Email',
            flex: 1,
            valueGetter: (value, row) => row.eventInfo.customerIds
        },
        {
            field: 'eventInfo.notificationProcessed',
            headerName: 'Notification Processed',
            flex: 0.5,
            type: 'boolean',
            valueGetter: (value, row) => row.eventInfo.notificationProcessed
        },
        {
            field: "adviseInfo.status",
            headerName: "Advise Status",
            flex: 0.5,
            renderCell: (params: GridRenderCellParams<EventType>) => (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                    }}
                    onClick={() => handleStatusClick( params.row)}
                >
                    {renderStatus(params.row.adviseInfo.status)}
                </Box>
            ),
        },
        {
            field: 'notifications',
            headerName: 'Notifications',
            flex: 1,
            renderCell: (params: GridRenderCellParams<EventType>) => (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    {renderNotificationStatus(params.row.notifications)}
                </Box>
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            renderCell: (params: GridRenderCellParams<EventType>) => (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <IconButton onClick={() => handleViewNotifications(params.row)}>
                        <NotificationsIcon/>
                    </IconButton>
                </Box>
            ),
        },
    ];

    const notificationColumns: GridColDef<Notification>[] = [
        {field: 'serviceName', headerName: 'Service Name', flex: 1},
        {
            field: 'status',
            headerName: 'Status',
            flex: 0.5,
            renderCell: (params) => (
                <Box
                    sx={{cursor: 'pointer'}}
                    onClick={() => handleNotificationStatusClick(params.row)}
                >
                    {renderStatus(params.row.status)}
                </Box>
            )
        },
        {field: 'serviceError', headerName: 'Service Error', flex: 1},
        {field: 'serviceKey', headerName: 'Service Key', flex: 1},
    ];

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', width: '100%'}}>
            <Box sx={{mb: 2}}>
                <GenericTitle>Event Details</GenericTitle>
                <Form layout="inline" onSubmit={handleSubmit}>
                    <Form.Group>
                        <DateRangePicker
                            ranges={predefinedRanges}
                            value={request.dateRange}
                            onChange={(value: DateRange | null) => handleFilterChange(value, 'dateRange')}
                            placeholder="Select Date Range"
                            showOneCalendar
                            format="MM/dd/yyyy HH:mm"
                        />
                    </Form.Group>
                    <Form.Group>
                        <InputGroup>
                            <InputGroup.Addon>Use Case</InputGroup.Addon>
                            <Input
                                value={request.useCase}
                                placeholder="Use Case"
                                onChange={(value: string) => handleFilterChange(value, 'useCase')}
                            />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group>
                        <InputGroup>
                            <InputGroup.Addon>MSISDN</InputGroup.Addon>
                            <Input
                                value={request.msisdn}
                                placeholder="MSISDN"
                                onChange={(value: string) => handleFilterChange(value, 'msisdn')}
                            />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group>
                        <InputGroup>
                            <InputGroup.Addon>SMS Id</InputGroup.Addon>
                            <Input
                                value={request.apiIdentifier}
                                placeholder="API Identifier"
                                onChange={(value: string) => handleFilterChange(value, 'apiIdentifier')}
                            />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group>
                        <InputGroup>
                            <InputGroup.Addon>Recipient Email</InputGroup.Addon>
                            <Input
                                value={request.recipientEmailAddress}
                                placeholder="recipientEmailAddress"
                                onChange={(value: string) => handleFilterChange(value, 'recipientEmailAddress')}
                            />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group>
                        <SelectPicker
                            name="adviseStatus"
                            value={request.adviseStatus}
                            onChange={(value: Status | null) => handleFilterChange(value, 'adviseStatus')}
                            data={[
                                { label: 'OK', value: Status.OK, icon: <StatusIcon status={Status.OK} /> },
    { label: 'KO', value: Status.KO, icon: <StatusIcon status={Status.KO} /> },
    { label: 'Pending', value: Status.PENDING, icon: <StatusIcon status={Status.PENDING} /> }

                            ]}
                            placeholder="Advise Status"
                            //searchable={false}
                            cleanable
                            style={{minWidth: 200}}
                            renderMenuItem={(label, item) => (
                                <div>
                                  {item.icon} <span style={{ marginLeft: 8 }}>{label}</span>
                                </div>
                              )}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Button appearance="primary" type="submit" startIcon={<TagFilter/>}>
                            Filter
                        </Button>
                    </Form.Group>
                </Form>
            </Box>
            <Box sx={{display: 'flex', justifyContent: 'center', gap: 2}}>
                <StyledResizableBox
                    defaultSize={{
                        width: '100%',
                    }}
                    minHeight={200}
                >
                    <GenericSpinner loading={loading}/>
                    {error && <Typography variant="body1" color="error">Error: {error}</Typography>}
                    {!loading && !error && (
                        <DataGrid
                            rows={events}
                            columns={columns}
                            checkboxSelection
                            disableRowSelectionOnClick
                            rowCount={totalElements}
                            pageSizeOptions={[3, 10, 25, 100]}
                            paginationModel={{
                                pageSize: request.size,
                                page: request.page
                            }}
                            onPaginationModelChange={(newModel) => {
                                setRequest({...request, page: newModel.page, size: newModel.pageSize})
                            }}
                            paginationMode="server"
                            getRowId={(row) => row.eventInfo.id}
                            //autoHeight
                            slots={{
                                toolbar: GridToolbar,
                            }}
                            slotProps={{
                                toolbar: {
                                    showQuickFilter: true,
                                    quickFilterProps: {debounceMs: 500},
                                },
                            }}
                            sx={{
                                '& .MuiDataGrid-cell': {
                                    display: 'flex',
                                    alignItems: 'center',
                                },
                                '& .MuiDataGrid-columnHeader': {
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }
                            }}
                        />
                    )}
                </StyledResizableBox>
                {showNotifications && (
                    <StyledResizableBox
                        minHeight={200}
                    >
                        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1}}>
                            <Typography variant="h6">Notifications for Event
                                ID: {selectedItem?.eventInfo.id}</Typography>
                            <IconButton onClick={handleCloseNotifications}>
                                <CloseIcon/>
                            </IconButton>
                        </Box>
                        <DataGrid
                            rows={selectedItem?.notifications || []}
                            columns={notificationColumns}
                            autoHeight
                            getRowId={(row) => `${row.serviceName}-${row.status}`}
                            pageSizeOptions={[5, 10, 25, 100]}
                        />
                    </StyledResizableBox>
                )}
            </Box>
            <EventErrorDialog open={dialogOpen} handleClose={handleCloseDialog} item={selectedEvent}/>
        </Box>
    );
};

export default EventsGrid;