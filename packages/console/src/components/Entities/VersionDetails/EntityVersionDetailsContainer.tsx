import React, { useMemo, FC } from 'react';
import { withRouteParams } from 'components/common/withRouteParams';
import { ResourceIdentifier, ResourceType } from 'models/Common/types';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useProject } from 'components/hooks/useProjects';
import { StaticGraphContainer } from 'components/Workflow/StaticGraphContainer';
import { WorkflowId } from 'models/Workflow/types';
import { entitySections } from 'components/Entities/constants';
import { EntityDetailsHeader } from 'components/Entities/EntityDetailsHeader';
import { EntityVersions } from 'components/Entities/EntityVersions';
import { RouteComponentProps } from 'react-router-dom';
import { LoadingSpinner } from 'components/common';
import { Box } from '@material-ui/core';
import { FeatureFlag, useFeatureFlag } from 'basics/FeatureFlags';
import { typeNameToEntityResource } from '../constants';
import { versionsDetailsSections } from './constants';
import { EntityVersionDetails } from './EntityVersionDetails';

interface StyleProps {
  resourceType: ResourceType;
}

const useStyles = makeStyles<Theme, StyleProps>((theme: Theme) => ({
  verionDetailsContainer: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    overflow: 'hidden',
    height: `calc(100vh - ${theme.spacing(17)}px)`,
    padding: theme.spacing(0, 2),
  },
  staticGraphContainer: {
    display: 'flex',
    height: '60%',
    width: '100%',
    flex: '1',
  },
  versionDetailsContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '55%',
    width: '100%',
    flex: '1',
    overflowY: 'scroll',
    padding: theme.spacing(0, 2),
  },
  versionsContainer: {
    display: 'flex',
    flex: '0 1 auto',
    padding: theme.spacing(0, 2),
    height: ({ resourceType }) =>
      resourceType === ResourceType.LAUNCH_PLAN ? '100%' : '40%',
    flexDirection: 'column',
    overflowY: 'auto',
  },
}));

interface WorkflowVersionDetailsRouteParams {
  projectId: string;
  domainId: string;
  entityType: string;
  entityName: string;
  entityVersion: string;
}

/**
 * The view component for the Workflow Versions page
 * @param projectId
 * @param domainId
 * @param workflowName
 */
const EntityVersionsDetailsContainerImpl: FC<
  WorkflowVersionDetailsRouteParams
> = ({ projectId, domainId, entityType, entityName, entityVersion }) => {
  const workflowId = useMemo<WorkflowId>(
    () => ({
      resourceType: typeNameToEntityResource[entityType],
      project: projectId,
      domain: domainId,
      name: entityName,
      version: entityVersion,
    }),
    [entityType, projectId, domainId, entityName, entityVersion],
  );

  const id = workflowId as ResourceIdentifier;
  const sections = entitySections[id.resourceType];
  const versionsSections = versionsDetailsSections[id.resourceType];
  const [project] = useProject(workflowId.project);
  const styles = useStyles({ resourceType: id.resourceType });

  const isBreadcrumbsFlag = useFeatureFlag(FeatureFlag.breadcrumbs);

  if (!project?.id) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Box px={isBreadcrumbsFlag ? 0 : 2}>
        <EntityDetailsHeader
          id={id}
          launchable={sections.launch}
          project={project}
          backToWorkflow
        />
      </Box>
      <div className={styles.verionDetailsContainer}>
        {versionsSections.details && (
          <div className={styles.versionDetailsContainer}>
            <EntityVersionDetails id={id} />
          </div>
        )}
        {versionsSections.graph && (
          <div className={styles.staticGraphContainer}>
            <StaticGraphContainer workflowId={workflowId} />
          </div>
        )}
        <div className={styles.versionsContainer}>
          <EntityVersions id={id} showAll />
        </div>
      </div>
    </>
  );
};

export const EntityVersionsDetailsContainer: FC<
  RouteComponentProps<WorkflowVersionDetailsRouteParams>
> = withRouteParams<WorkflowVersionDetailsRouteParams>(
  EntityVersionsDetailsContainerImpl,
);
