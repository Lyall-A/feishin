import debounce from 'lodash/debounce';
import { ChangeEvent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useGenreList } from '/@/renderer/features/genres';
import { AlbumListFilter, useListStoreActions, useListStoreByKey } from '/@/renderer/store';
import { Divider } from '/@/shared/components/divider/divider';
import { Group } from '/@/shared/components/group/group';
import { NumberInput } from '/@/shared/components/number-input/number-input';
import { Select } from '/@/shared/components/select/select';
import { Stack } from '/@/shared/components/stack/stack';
import { Switch } from '/@/shared/components/switch/switch';
import { Text } from '/@/shared/components/text/text';
import {
    AlbumListQuery,
    GenreListSort,
    LibraryItem,
    SortOrder,
} from '/@/shared/types/domain-types';

interface SubsonicAlbumFiltersProps {
    onFilterChange: (filters: AlbumListFilter) => void;
    pageKey: string;
    serverId?: string;
}

export const SubsonicAlbumFilters = ({
    onFilterChange,
    pageKey,
    serverId,
}: SubsonicAlbumFiltersProps) => {
    const { t } = useTranslation();
    const { filter } = useListStoreByKey<AlbumListQuery>({ key: pageKey });
    const { setFilter } = useListStoreActions();

    const genreListQuery = useGenreList({
        query: {
            sortBy: GenreListSort.NAME,
            sortOrder: SortOrder.ASC,
            startIndex: 0,
        },
        serverId,
    });

    const genreList = useMemo(() => {
        if (!genreListQuery?.data) return [];
        return genreListQuery.data.items.map((genre) => ({
            label: genre.name,
            value: genre.id,
        }));
    }, [genreListQuery.data]);

    const handleGenresFilter = debounce((e: null | string) => {
        const updatedFilters = setFilter({
            data: {
                genres: e ? [e] : undefined,
            },
            itemType: LibraryItem.ALBUM,
            key: pageKey,
        }) as AlbumListFilter;

        onFilterChange(updatedFilters);
    }, 250);

    const toggleFilters = [
        {
            label: t('filter.isFavorited', { postProcess: 'sentenceCase' }),
            onChange: (e: ChangeEvent<HTMLInputElement>) => {
                const updatedFilters = setFilter({
                    data: {
                        favorite: e.target.checked ? true : undefined,
                    },
                    itemType: LibraryItem.ALBUM,
                    key: pageKey,
                }) as AlbumListFilter;
                onFilterChange(updatedFilters);
            },
            value: filter.favorite,
        },
    ];

    const handleYearFilter = debounce((e: number | string, type: 'max' | 'min') => {
        let data: Partial<AlbumListQuery> = {};

        if (type === 'min') {
            data = {
                minYear: e ? Number(e) : undefined,
            };
        } else {
            data = {
                maxYear: e ? Number(e) : undefined,
            };
        }

        const updatedFilters = setFilter({
            data,
            itemType: LibraryItem.ALBUM,
            key: pageKey,
        }) as AlbumListFilter;

        onFilterChange(updatedFilters);
    }, 500);

    return (
        <Stack p="0.8rem">
            {toggleFilters.map((filter) => (
                <Group
                    justify="space-between"
                    key={`nd-filter-${filter.label}`}
                >
                    <Text>{filter.label}</Text>
                    <Switch
                        checked={filter?.value || false}
                        onChange={filter.onChange}
                    />
                </Group>
            ))}
            <Divider my="0.5rem" />
            <Group grow>
                <NumberInput
                    defaultValue={filter.minYear}
                    disabled={filter.genres?.length !== undefined}
                    hideControls={false}
                    label={t('filter.fromYear', { postProcess: 'sentenceCase' })}
                    max={5000}
                    min={0}
                    onChange={(e) => handleYearFilter(e, 'min')}
                />
                <NumberInput
                    defaultValue={filter.maxYear}
                    disabled={filter.genres?.length !== undefined}
                    hideControls={false}
                    label={t('filter.toYear', { postProcess: 'sentenceCase' })}
                    max={5000}
                    min={0}
                    onChange={(e) => handleYearFilter(e, 'max')}
                />
            </Group>
            <Group grow>
                <Select
                    clearable
                    data={genreList}
                    defaultValue={filter.genres?.length ? filter.genres[0] : undefined}
                    disabled={Boolean(filter.minYear || filter.maxYear)}
                    label={t('entity.genre', { count: 1, postProcess: 'titleCase' })}
                    onChange={handleGenresFilter}
                    searchable
                />
            </Group>
        </Stack>
    );
};
