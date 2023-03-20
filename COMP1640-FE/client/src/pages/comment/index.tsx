import React, { useEffect, useState } from 'react'
import { Box, Button, useTheme } from "@mui/material";
import { DataGrid, GridColDef, GridToolbar, GridValueFormatterParams, GridValueGetterParams } from "@mui/x-data-grid";
import { commentData } from '../../dataTest';
import Header from '../../app/components/Header';
import Loading from '../../app/components/Loading';
import Moment from 'moment';
import { AddCircleOutline } from '@mui/icons-material';
import IdeaForm from '../ideaDetail/ideaForm';
import { Idea } from '../../app/models/Idea';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../app/store/configureStore';
import { getCategories } from '../category/categorySlice';
import Comment from '../../app/components/Comment';

const CommentPage = () => {
    const theme: any = useTheme();
    const [loading, setLoading] = useState(false);
    const [pageSize, setPageSize] = React.useState<number>(5);
    const [data, setData] = useState(commentData);
    const { categories } = useSelector((state: RootState) => state.category);
    const [editMode, setEditMode] = useState(false);
    const [recordForEdit, setRecordForEdit] = useState<Idea | undefined>(undefined);
    function cancelEdit() {
        if (recordForEdit) setRecordForEdit(undefined);
        setEditMode(false);
    }
    const dispatch = useAppDispatch();
    let fetchMount = true;
    useEffect(() => {
        if (fetchMount) {
            dispatch(getCategories());
        }
        return () => {
            fetchMount = false;
        };
    }, []);
    useEffect(() => {
        setData(commentData);
    }, []);
    const columns: any = [
        {
            field: "ordinal",
            headerName: "#",
            flex: 0.2,
            valueGetter: (params: GridValueGetterParams) => {
                const { row } = params;
                const index = data.findIndex((r) => r.id === row.id);
                return index + 1;
            }
        },
        {
            field: "content",
            headerName: "Content",
            flex: 0.5,
            minWidth: 350,
        },
        {
            field: "createdDate",
            headerName: "Created Date",
            flex: 1,
            minWidth: 250,
            renderCell: (params: { value: string; }) => {
                return Moment(params.value).format('DD-MM-YYYY');
            },
        },
        {
            field: "userID",
            headerName: "User Name",
            flex: 0.5,
            minWidth: 250,
        },
        {
            field: "ideaID",
            headerName: "Idea Title",
            flex: 0.4,
            minWidth: 250,
        },
    ];
    if (!data) {
        setLoading(true);
    }
    if (editMode)
        return <IdeaForm cancelEdit={cancelEdit} categories={categories} />
    return (
        <>
            {loading ? (<Loading />) : (
                <Box m="1.5rem 2.5rem">
                    <Header title="COMMENTS" subtitle="List of Comments" />
                    <Button variant="contained" size="medium" color="success" onClick={() => setEditMode(true)}
                        startIcon={<AddCircleOutline />}>
                        Create a new Idea
                    </Button>
                    <Box
                        mt="40px"
                        style={{ height: '55vh' }}
                        sx={{
                            "& .MuiDataGrid-root": {
                                border: "none",
                                [theme.breakpoints.up('sm')]: {
                                    width: '100%',
                                },
                                [theme.breakpoints.down('sm')]: {
                                    width: '130%',
                                },
                            },
                            "& .MuiDataGrid-cell": {
                                borderBottom: "none",
                            },
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: theme.palette.background.alt,
                                color: theme.palette.secondary[100],
                                borderBottom: "none",
                            },
                            "& .MuiDataGrid-virtualScroller": {
                                backgroundColor: theme.palette.primary.light,
                            },
                            "& .MuiDataGrid-footerContainer": {
                                backgroundColor: theme.palette.background.alt,
                                color: theme.palette.secondary[100],
                                borderTop: "none",
                            },
                            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                                color: `${theme.palette.secondary[200]} !important`,
                            },
                        }}
                    >

                        <DataGrid
                            loading={loading || !data}
                            getRowId={(row) => row.id}
                            rows={data || []}
                            pageSize={pageSize}
                            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                            rowsPerPageOptions={[5, 10, 20]}
                            columns={columns}
                            components={{ Toolbar: GridToolbar }}
                            componentsProps={{
                                toolbar: {
                                    showQuickFilter: true,
                                    quickFilterProps: { field: "content", debounceMs: 500 },
                                },
                            }}
                        />
                    </Box>
                    {/* <Comment ideaId='e306eecb-4499-4426-b4af-4443663f7adb' /> */}
                </Box>
            )
            }

        </>
    )
}

export default CommentPage