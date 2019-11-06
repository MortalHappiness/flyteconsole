import { Typography } from '@material-ui/core';
import ChevronRight from '@material-ui/icons/ChevronRight';
import { SearchResult } from 'components/common';
import { useCommonStyles } from 'components/common/styles';
import {
    SearchableNamedEntity,
    SearchableNamedEntityList,
    SearchableNamedEntityListProps,
    useNamedEntityListStyles
} from 'components/Workflow/SearchableNamedEntityList';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Routes } from 'routes';

export const SearchableWorkflowNameList: React.FC<
    Omit<SearchableNamedEntityListProps, 'renderItem'>
> = props => {
    const commonStyles = useCommonStyles();
    const listStyles = useNamedEntityListStyles();

    const renderItem = ({
        key,
        value,
        content
    }: SearchResult<SearchableNamedEntity>) => (
        <Link
            key={key}
            className={commonStyles.linkUnstyled}
            to={Routes.WorkflowDetails.makeUrl(
                value.id.project,
                value.id.domain,
                value.id.name
            )}
        >
            <div className={listStyles.searchResult}>
                <div className={listStyles.itemName}>
                    <div>{content}</div>
                    {!!value.metadata.description && (
                        <Typography
                            variant="body2"
                            className={commonStyles.hintText}
                        >
                            {value.metadata.description}
                        </Typography>
                    )}
                </div>
                <ChevronRight className={listStyles.itemChevron} />
            </div>
        </Link>
    );
    return <SearchableNamedEntityList {...props} renderItem={renderItem} />;
};
