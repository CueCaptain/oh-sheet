import { useRef } from 'react';
import ReactPlayer from 'react-player'
import { useServer } from 'contexts/ServerDataContext';
import { Box } from '@mantine/core';


export default function Stream () {
    
    const playerRef = useRef<ReactPlayer | null>(null);
    const server = useServer();
    const streamKey = server.data.streamKey;
    const streamUrl = import.meta.env.VITE_OHSHEET_BACKEND_SERVER_ADDR.replace(':4001', '') + ":8000/live/" + streamKey + ".flv"; 
    console.log(streamUrl);
    const onPlay = () => {
        playerRef?.current?.seekTo(.97, 'fraction');
    }

    return (
        <> 
        <Box 
            w='100%'
            h='100%'
        >
            <ReactPlayer
                ref={playerRef}
                url = {streamUrl}
                controls={true}
                width='100%'
                height='100%'
                onPlay={onPlay}
            />
        </Box>
        </>
    );
}