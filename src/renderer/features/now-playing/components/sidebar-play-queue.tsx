import type { AgGridReact as AgGridReactType } from '@ag-grid-community/react/lib/agGridReact';

import { useRef } from 'react';

import { PlayQueueListControls } from './play-queue-list-controls';

import { VirtualGridContainer } from '/@/renderer/components/virtual-grid';
import { PlayQueue } from '/@/renderer/features/now-playing/components/play-queue';
import { useWindowSettings } from '/@/renderer/store/settings.store';
import { Box } from '/@/shared/components/box/box';
import { Song } from '/@/shared/types/domain-types';
import { Platform } from '/@/shared/types/types';

export const SidebarPlayQueue = () => {
    const queueRef = useRef<null | { grid: AgGridReactType<Song> }>(null);
    const { windowBarStyle } = useWindowSettings();

    const isWeb = windowBarStyle === Platform.WEB;
    return (
        <VirtualGridContainer>
            <Box
                display={!isWeb ? 'flex' : undefined}
                h="65px"
            >
                <PlayQueueListControls
                    tableRef={queueRef}
                    type="sideQueue"
                />
            </Box>
            <PlayQueue
                ref={queueRef}
                type="sideQueue"
            />
        </VirtualGridContainer>
    );
};
