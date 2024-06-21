import cx from 'clsx';
import { ActionIcon, Box, Button, Flex, Text } from '@mantine/core';
import { useDisclosure, useListState } from '@mantine/hooks';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import classes from './CueListSortWizard.module.css';
import { useServer } from 'contexts/ServerDataContext';
import { IoTrashOutline } from "react-icons/io5";
import { useEffect } from 'react';


export function CueListSortWizard() {
    const server = useServer();
    const [isAddView, {toggle: toggleAddView}] = useDisclosure();
    const [state, handlers] = useListState(Object.keys(server.data.cues[server.data.currentPtr]));

    useEffect(() => {
        server.setSortedHeaders(state);
    }, [state]);

    const addHeader = (val: string) => () => {
        handlers.append(val);
    }

    const deleteHeader = (index: number) => () => {
        handlers.remove(index);
    }

    const items = state.map((item, index) => {
        if(item === 'cue' || item === 'item' || item === 'start' || item === 'end' || item === 'duration') return null;
        return (
            <Draggable key={item} index={index} draggableId={item}>
                {(provided, snapshot) => (
                    <div
                        className={cx(classes.item, { [classes.itemDragging]: snapshot.isDragging })}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                    >
                        <Flex align={'center'} justify={'space-between'}>
                            <Text>{item}</Text>
                            <ActionIcon onClick={() => deleteHeader(index)}>
                                <IoTrashOutline />
                            </ActionIcon>
                        </Flex>
                    </div>
                )}
            </Draggable>
        );
    });

    const notAddedHeaders: (JSX.Element | null)[] = Object.keys(server.data.cues[server.data.currentPtr]).filter((val) => !server.sortedHeaders.includes(val)).map((item, index) => {
        if(item !== 'cue' && item !== 'item' && item !== 'start' && item !== 'end' && item !== 'duration') return (
            <div
                className={classes.item}
            >
                <Flex align={'center'} justify={'space-between'}>
                    <Text>{item}</Text>
                    <ActionIcon onClick={() => addHeader(item)}>
                        <IoTrashOutline />
                    </ActionIcon>
                </Flex>
            </div>
        );
        return null;
    }).filter((val) => val);

    return (
        <Box>
            <Flex w={'100%'}>
                <Button w={'100%'} m={'2'} onClick={toggleAddView}>{isAddView ? "Back" :"Add"}</Button>
            </Flex>
            {isAddView ?
                <Box>
                    {notAddedHeaders.length > 0 ? notAddedHeaders : <Flex w={'100%'} justify={'center'} align={'center'}>No headers to add</Flex>}
                </Box>
            :
                <DragDropContext
                    onDragEnd={({ destination, source }) =>
                        handlers.reorder({ from: source.index, to: destination?.index || 0 })
                    }
                >
                    <Droppable droppableId="dnd-list" direction="vertical">
                        {(provided) => {
                            return (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {items}
                                    {provided.placeholder}
                                </div>
                            );
                        }}
                    </Droppable>
                </DragDropContext>
            }
        </Box>
    );
}