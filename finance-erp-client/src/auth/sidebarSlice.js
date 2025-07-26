import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { logout, reset } from '../auth/authSlice';
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
const API_URL = `${REACT_APP_API_URL}`;
export const fetchSidebarCounts = createAsyncThunk(
    'sidebar/fetchCounts',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth?.user?.token;
            const roles = thunkAPI.getState().auth?.user?.roles || [];
            if (!token) {
                thunkAPI.dispatch(logout());
                thunkAPI.dispatch(reset());
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            };
            const promises = [];
            const resultsMap = {
                grantApplications: 0,
                sieve: 0,
                individualReviewPanelCount: 0,
                cBOReviewPanelCount: 0,
                pitchPanelCount: 0,
                dueDiligenceCount: 0,
                icAssessmentLoansCount: 0,
                usersCount: 0,
            };

            if (roles.includes(5)) {
                promises.push(
                    axios.get(`${API_URL}/programs/grants`, config).then(res =>
                        resultsMap.grantApplications = res?.data?.length
                    )
                );
            }

            if (roles.includes(1)) {
                promises.push(
                    axios.get(`${API_URL}/programs/With_NoinitialSieveDone`, config).then(res =>
                        resultsMap.sieve = res?.data?.length
                    )
                );
            }

            if (roles.includes(2)) {
                promises.push(
                    axios.get(`${API_URL}/programs/grantsWithNoReviewDone?type=Individual`, config).then(res =>
                        resultsMap.individualReviewPanelCount = res?.data?.length
                    )
                );
            }

            if (roles.includes(2)) {
                promises.push(
                    axios.get(`${API_URL}/programs/grantsWithNoReviewDone`, config).then(res =>
                        resultsMap.cBOReviewPanelCount = res?.data?.length
                    )
                );
            }

            if (roles.includes(3)) {
                promises.push(
                    axios.get(`${API_URL}/programs/pitch_scoresheet_list`, config).then(res =>
                        resultsMap.pitchPanelCount = res?.data?.length
                    )
                );
            }

            if (roles.includes(4)) {
                promises.push(
                    axios.get(`${API_URL}/programs/duediligencelist`, config).then(res =>
                        resultsMap.dueDiligenceCount = res?.data?.length
                    )
                );
            }

            if (roles.includes(6)) {
                promises.push(
                    axios.get(`${API_URL}/hevaapplication/getLoansForAssement`, config).then(res =>
                        resultsMap.icAssessmentLoansCount = res?.data?.loans?.length || 0
                    )
                );
            }
            if (roles.includes(5)) {
                promises.push(
                    axios.get(`${API_URL}/api/v1/users`, config).then(res =>
                        resultsMap.usersCount = res?.data?.length
                    )
                );
            }
            await Promise.all(promises);
            return resultsMap;

        } catch (error) {
            if (error?.response?.status === 401) {
                thunkAPI.dispatch(logout());
                thunkAPI.dispatch(reset());
            }

        }
    }
);

const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState: {
        sieve: 0,
        grantApplications: 0,
        individualReviewPanelCount: 0,
        cBOReviewPanelCount: 0, pitchPanelCount: 0,
        dueDiligenceCount: 0,
        icAssessmentLoansCount: 0,
        usersCount: 0,
        loading: false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSidebarCounts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSidebarCounts.fulfilled, (state, action) => {
                state.loading = false;
                state.sieve = action?.payload?.sieve;
                state.individualReviewPanelCount = action?.payload?.individualReviewPanelCount;
                state.cBOReviewPanelCount = action?.payload?.cBOReviewPanelCount;
                state.dueDiligenceCount = action?.payload?.dueDiligenceCount;
                state.pitchPanelCount = action?.payload?.pitchPanelCount;
                state.grantApplications = action?.payload?.grantApplications;
                state.icAssessmentLoansCount = action?.payload?.icAssessmentLoansCount;
                state.usersCount = action?.payload?.usersCount;
            })
            .addCase(fetchSidebarCounts.rejected, (state) => {
                state.loading = false;
            });
    },
});

export default sidebarSlice.reducer;
