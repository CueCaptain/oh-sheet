import { useState } from 'react';
import { 
    Box, 
    Flex, 
    Input, 
    Button,
    Text,   
    NumberInput,
    Loader,
    Select,
    Center
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useServer } from 'contexts/ServerDataContext';

export interface IGoogleSheetImportWizardProps {
    onLoadCallback?: () => void
}



export default function GoogleSheetImportWizard(props : IGoogleSheetImportWizardProps) {
    const server = useServer();
    const [newSheetUrl, setNewSheetUrl] = useState<string>('');
    const [headerRow, setHeaderRow] = useState<string | number>(4);
    const [selectedSheet, setSelectedSheet] = useState<string | null>(null);
    const [sheets, setSheets] = useState<string []>([]);
    const [loading, setLoading] = useState(false);

    const getSheetNames = () => {
        setLoading(true);
        const url = new URL(import.meta.env.VITE_OHSHEET_BACKEND_SERVER_ADDR+"/cuesheet/get_sheet_names_from_google_sheets");
        url.searchParams.append('spreadsheetUrl', newSheetUrl);
        fetch(url.toString()).then(async res => {
            if(res.ok) {
                return res.json();
            }
            const e = await res.json();
            throw new Error(e.message);
        }).then(response => {
            setSheets(response);
            setLoading(false);
        }).catch((error: Error) => {
            setLoading(false);
            notifications.show({
                title: 'Invalid URL',
                message: error.message,
                color: 'red',
                autoClose: 5000,
            });
        })
    }

    const loadGoogleSheet = () => async () => {
        if(!selectedSheet){
            notifications.show({
                title: 'Oops',
                message: "Please select a sheet to continue",
                color: 'red',
                autoClose: 5000,
            });
            return false;
        }
        setLoading(true);
        const body = {
            spreadsheetUrl:  newSheetUrl,
            sheetName: selectedSheet,
            headerRow: headerRow
        };
        fetch(import.meta.env.VITE_OHSHEET_BACKEND_SERVER_ADDR+'/cuesheet/google_sheet', { 
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify(body) 
        }).then(async (res) => {
            if(res.ok) {
                return res.json();
            }
            const e = await res.json();
            throw new Error(e.message);
        }).then(() => {
            server.setSortedHeaders([]);
            if(props.onLoadCallback) props.onLoadCallback();
        }).catch((error: Error) => {
            setLoading(false);
            notifications.show({
                title: 'Oops',
                message: error.message,
                color: 'red',
                autoClose: 5000,
            });
        })
    }

    if(loading){
        return <Center>
            <Loader />
        </Center>
    }

    return (
        <Box>
            {
                sheets.length === 0 ?
                <Flex direction={'column'}>
                    <Flex mb={'md'}>
                        <Input style={{flexGrow: 1}} placeholder="Google Sheet URL" onChange={(e) => setNewSheetUrl(e.target.value)} />
                    </Flex>
                    <Button mb={'xs'} onClick={getSheetNames}>Import</Button>
                    <Button variant={'outline'} onClick={() => window.open('https://docs.google.com/spreadsheets/d/1CccKfkQ8Y-mryWyUK21l6oxeJV3Wyhb7OmEo1qv18kk/template/preview', '_blank')}>Create From Template</Button>
                </Flex>
            : 
                <Flex direction={'column'}>
                    <NumberInput
                        label="header row:"
                        description="row number of headers"
                        placeholder="header row #"
                        min={1}
                        value={headerRow} 
                        onChange={setHeaderRow}
                    />
                    <Select
                        label="timesheet:"
                        description="select the timesheet you wish to load"
                        placeholder="Pick your timesheet"
                        data={sheets}
                        value={selectedSheet}
                        onChange={setSelectedSheet}
                        mb={'sm'}
                    />
                    <Button onClick={loadGoogleSheet()}>load</Button>
                </Flex>
            }
        </Box>
    );
}
