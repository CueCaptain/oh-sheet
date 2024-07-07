import { ActionIcon, Box, Button, Flex, Text } from '@mantine/core';
import { useDisclosure} from '@mantine/hooks';
import { useServer } from 'contexts/ServerDataContext';
import { IoTrashOutline, IoAdd } from "react-icons/io5";
import { MdDragIndicator  } from "react-icons/md";

import { useEffect } from 'react';
import GridLayout, { WidthProvider } from "react-grid-layout";

import 'react-grid-layout/css/styles.css' 
import 'react-resizable/css/styles.css' 

const ReactGridLayout = WidthProvider(GridLayout);


function CueDraggableHeaderPiece(props: {showDragIcon: boolean, item: string, onClick?: () => void , icon?: "trash" | "add" }) {
    return (
        <Flex w={'100%'} h={'100%'} p={'xs'} align={'center'} justify={'space-between'} style={{borderRadius:'1rem', backgroundColor: 'var(--mantine-color-dark-6)', cursor: '-webkit-grab' }}>
            <Flex align={'center'}>
                {props.showDragIcon ? <MdDragIndicator  /> : null}
                <Text>{props.item}</Text>
            </Flex>
            {props.icon && props.onClick && <ActionIcon onClick={props.onClick}>
                {props.icon === 'trash' ? <IoTrashOutline /> : <IoAdd />}
            </ActionIcon>}
        </Flex>
    );
}


export function CueListSortWizard() {
    const server = useServer();
    const [isAddView, {toggle: toggleAddView}] = useDisclosure();
    const [isDeleteView, {toggle: toggleDeleteView}] = useDisclosure();


    useEffect(() => {
        if(server.sortedHeaders.length === 0){
            server.setSortedHeaders(Object.keys(server.data.cues[server.data.currentPtr]));
        }
    }, [server]);
    
    const onLayoutChange = (l: any) => {
        l = l.sort((a: any, b: any) => a.y > b.y ? 1 : -1).map((a: any) => a.i);
        server.setSortedHeaders(l);
    }

    const deleteHeader = (val: string) => () => {
        let sortedHeaders = [...server.sortedHeaders];
        const index = sortedHeaders.findIndex((x) => x === val);
        delete sortedHeaders[index];
        server.setSortedHeaders(sortedHeaders.filter((value) => value));
    }

    const addHeader = (val: string) => () => {
        let sortedHeaders = [...server.sortedHeaders, val];
        server.setSortedHeaders(sortedHeaders.filter((value) => value));
    }

    const addHeaderOptions: (JSX.Element | null)[] = Object.keys(server.data.cues[server.data.currentPtr]).filter((val) => !server.sortedHeaders.includes(val)).map((key) => {
        if(key === 'cue' || key === 'item' || key === 'start' || key === 'end' || key === 'duration') return null;
        return (
            <Box m={'xs'} key={key}>
                <CueDraggableHeaderPiece showDragIcon={false} item={key} onClick={addHeader(key)} icon={'add'}/>
            </Box>
        );
    }).filter((val) => val);

    const deleteHeaderOptions: (JSX.Element | null)[] = Object.keys(server.data.cues[server.data.currentPtr]).filter((val) => server.sortedHeaders.includes(val)).map((key) => {
        if(key === 'cue' || key === 'item' || key === 'start' || key === 'end' || key === 'duration') return null;
        return (
            <Box m={'xs'} key={key}>
                <CueDraggableHeaderPiece showDragIcon={false} item={key} onClick={deleteHeader(key)} icon={'trash'}/>
            </Box>
        );
    }).filter((val) => val);

    const renderView = () => {
        if(isAddView) return (
            <Box>
                <Flex w={'100%'}>
                    <Button w={'100%'} m={'xs'} onClick={toggleAddView}>{"Back"}</Button>
                </Flex>
                {addHeaderOptions.length > 0 ? addHeaderOptions : <Flex w={'100%'} justify={'center'} align={'center'}>No headers to add</Flex>}
            </Box>
        );
        if(isDeleteView) return (
            <Box>
                <Flex w={'100%'}>
                    <Button w={'100%'} m={'xs'} onClick={toggleDeleteView}>{"Back"}</Button>
                </Flex>
                {deleteHeaderOptions.length > 0 ? deleteHeaderOptions : <Flex w={'100%'} justify={'center'} align={'center'}>No headers to delete</Flex>}
            </Box>
        );
    }

    return (
        <Box h={'100%'} w={'100%'}>
            {!isAddView && !isDeleteView && <Flex w={'100%'}>
                <Button w={'100%'} m={'xs'} onClick={toggleAddView}>{isAddView ? "Back" :"Add"}</Button>
                <Button w={'100%'} m={'xs'} onClick={toggleDeleteView}>{isDeleteView ? "Back" :"Delete"}</Button>
            </Flex>}
            {
                isAddView || isDeleteView ?
                    renderView()
                : 
                <ReactGridLayout
                    cols={1}
                    rowHeight={60}
                    layout={server.sortedHeaders.map((v, i) => {return {w: 1, h:1, x: 0, y:i, i:v}})}
                    onLayoutChange={(layout) => onLayoutChange(layout)}
                    style={{
                        width: '100%',
                        overflowX: 'hidden',
                        overflowY: 'auto',
                    }}
                    isResizable={false}
                >
                    {server.sortedHeaders.map((key) => {
                        if(key !== 'cue' && key !== 'item' && key !== 'start' && key !== 'end' && key !== 'duration') return (
                            <Box key={key}>
                                <CueDraggableHeaderPiece showDragIcon={true} item={key}/>
                            </Box>
                        );
                        return null;
                    })}
                </ReactGridLayout>
            }
        </Box>
    );
}