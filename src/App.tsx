import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Header from '@cloudscape-design/components/header';
import Table from '@cloudscape-design/components/table';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { useEffect, useState } from 'react';

import '@cloudscape-design/global-styles/index.css';
import { Checkbox } from '@cloudscape-design/components';

const CLIENT_ID = '1051970565091-7esc45fhu74d8bc0t6potp3dfl2bpb9n.apps.googleusercontent.com';

export function App() {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    return (
        <GoogleOAuthProvider clientId={CLIENT_ID}>
            {accessToken == null ? <AuthButton setAccessToken={setAccessToken} /> : <Content accessToken={accessToken} />}
        </GoogleOAuthProvider>
    );
}

interface AuthButtonProps {
    setAccessToken: (token: string) => void;
}

function AuthButton({setAccessToken}: AuthButtonProps) {
    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => setAccessToken(tokenResponse.access_token),
        onError: () => console.log('Login Failed'),
        scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
    });

    return (
        <Box margin='s'>
            <Button variant='primary' onClick={() => login()}>
                Sign in with Google
            </Button>
        </Box>
    );
}

interface ContentProps {
    accessToken: string;
}

interface TeamCheckInInfo {
    teamName: string,
    onSiteCheckIn: boolean,
    borrowingAgreement: boolean,
    checkInForm: boolean,
    v3: boolean,
    v1: boolean,
    engineer: boolean,
}

function Content({accessToken}: ContentProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [items, setItems] = useState<Array<TeamCheckInInfo>>([]);

    const fetchSheetData = async () => {
        setIsLoading(true);
        try {
            const spreadsheetId = '1a7yJ99EzJahVLS5el3syLsOcsRdmFco3PUMAaaujjt0';
            const range = 'Team Information!A2:G8';
            
            const response = await fetch(
                `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch sheet data');
            }

            const data = await response.json();
            const rows = data.values || [];
            
            const formattedItems: TeamCheckInInfo[] = rows.map((row: string[]) => ({
                teamName: row[0],
                onSiteCheckIn: row[1] === 'TRUE',
                borrowingAgreement: row[2] === 'TRUE',
                checkInForm: row[3] === 'TRUE',
                v3: row[4] === 'TRUE',
                v1: row[5] === 'TRUE',
                engineer: row[6] === 'TRUE',
            }));

            setItems(formattedItems);
        } catch (error) {
            console.error('Error fetching sheet data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSheetData();
    }, [accessToken])

    return (
        <Box margin='m'>
            <Table 
                header={
                    <Header 
                        variant='h1'
                        actions={
                            <Button 
                                iconName='refresh' 
                                onClick={fetchSheetData}
                                loading={isLoading}
                            >
                                Refresh
                            </Button>
                        }
                    >
                        Lightning
                    </Header>
                }
                variant='full-page'
                loadingText='Loading...'
                loading={isLoading}
                empty={<Box textAlign='center' color='inherit'>No resources found</Box>}
                columnDefinitions={[
                    {
                        id: 'teamName',
                        header: 'Team Name',
                        cell: item => item.teamName,
                        sortingField: 'teamName'
                    },
                    {
                        id: 'onSiteCheckIn',
                        header: 'On-Site Check-In',
                        cell: item => <Checkbox checked={item.onSiteCheckIn} readOnly />,
                        sortingField: 'onSiteCheckIn'
                    },
                    {
                        id: 'borrowingAgreement',
                        header: 'Borrowing Agreement',
                        cell: item => <Checkbox checked={item.borrowingAgreement} readOnly />,
                        sortingField: 'borrowingAgreement'
                    },
                    {
                        id: 'checkInForm',
                        header: 'Check-In Form',
                        cell: item => <Checkbox checked={item.checkInForm} readOnly />,
                        sortingField: 'checkInForm'
                    },
                    {
                        id: '3v3',
                        header: '3v3',
                        cell: item => <Checkbox checked={item.v3} readOnly />,
                        sortingField: '3v3'
                    },
                    {
                        id: '1v1',
                        header: '1v1',
                        cell: item => <Checkbox checked={item.v1} readOnly />,
                        sortingField: '1v1'
                    },
                    {
                        id: 'engineer',
                        header: 'Engineer Challenge',
                        cell: item => <Checkbox checked={item.engineer} readOnly />,
                        sortingField: 'engineer'
                    },
                ]}
                items={items} />
        </Box>
    );
}

export default App;
