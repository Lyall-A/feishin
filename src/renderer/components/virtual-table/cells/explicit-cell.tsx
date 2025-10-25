import type { ICellRendererParams } from '@ag-grid-community/core';

import { CellContainer } from '/@/renderer/components/virtual-table/cells/generic-cell';
import { Icon } from '/@/shared/components/icon/icon';

export const ExplicitCell = ({ value }: ICellRendererParams) => {
    return (
        <CellContainer position="center">
            {value === 1 && <Icon fill="default" icon="explicit" size="lg" />}
        </CellContainer>
    );
};
