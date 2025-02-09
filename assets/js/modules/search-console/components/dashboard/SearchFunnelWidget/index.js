/**
 * SearchFunnelWidget component.
 *
 * Site Kit by Google, Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { isURL } from '@wordpress/url';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import {
	MODULES_SEARCH_CONSOLE,
	DATE_RANGE_OFFSET,
} from '../../../datastore/constants';
import {
	MODULES_ANALYTICS,
	DATE_RANGE_OFFSET as DATE_RANGE_OFFSET_ANALYTICS,
} from '../../../../analytics/datastore/constants';
import { CORE_SITE } from '../../../../../googlesitekit/datastore/site/constants';
import { CORE_USER } from '../../../../../googlesitekit/datastore/user/constants';
import { isZeroReport } from '../../../util';
import { numFmt } from '../../../../../util';
import PreviewBlock from '../../../../../components/PreviewBlock';
import Header from './Header';
import Overview from './Overview';
import SearchConsoleStats from './SearchConsoleStats';
import AnalyticsStats from './AnalyticsStats';
import { CORE_MODULES } from '../../../../../googlesitekit/modules/datastore/constants';
const { useSelect } = Data;

const SearchFunnelWidget = ( {
	Widget,
	WidgetReportZero,
	WidgetReportError,
} ) => {
	const [ selectedStats, setSelectedStats ] = useState( 0 );

	const isAnalyticsConnected = useSelect( ( select ) =>
		select( CORE_MODULES ).isModuleConnected( 'analytics' )
	);

	const dateRangeLength = useSelect( ( select ) =>
		select( CORE_USER ).getDateRangeNumberOfDays()
	);
	const url = useSelect( ( select ) =>
		select( CORE_SITE ).getCurrentEntityURL()
	);

	const { endDate, compareStartDate } = useSelect( ( select ) =>
		select( CORE_USER ).getDateRangeDates( {
			compare: true,
			offsetDays: DATE_RANGE_OFFSET,
		} )
	);
	const analyticsDates = useSelect( ( select ) =>
		select( CORE_USER ).getDateRangeDates( {
			compare: true,
			offsetDays: DATE_RANGE_OFFSET_ANALYTICS,
		} )
	);

	const searchConsoleReportArgs = {
		startDate: compareStartDate,
		endDate,
		dimensions: 'date',
	};

	const analyticsOverviewArgs = {
		...analyticsDates,
		metrics: [
			{
				expression: 'ga:goalCompletionsAll',
				alias: 'Goal Completions',
			},
			'ga:bounceRate',
		],
	};

	const analyticsStatsArgs = {
		...analyticsDates,
		...analyticsOverviewArgs,
		dimensions: 'ga:date',
	};
	const analyticsVisitorsOverviewArgs = {
		...analyticsDates,
		metrics: [
			{
				expression: 'ga:users',
				alias: 'Total Users',
			},
		],
		dimensions: [ 'ga:channelGrouping' ],
		dimensionFilters: { 'ga:channelGrouping': 'Organic Search' },
	};
	const analyticsVisitorsStatsArgs = {
		...analyticsVisitorsOverviewArgs,
		dimensions: [ 'ga:date', 'ga:channelGrouping' ],
	};

	if ( isURL( url ) ) {
		searchConsoleReportArgs.url = url;
		analyticsOverviewArgs.url = url;
		analyticsStatsArgs.url = url;
		analyticsVisitorsOverviewArgs.url = url;
		analyticsVisitorsStatsArgs.url = url;
	}

	const searchConsoleData = useSelect( ( select ) =>
		select( MODULES_SEARCH_CONSOLE ).getReport( searchConsoleReportArgs )
	);
	const searchConsoleError = useSelect( ( select ) =>
		select( MODULES_SEARCH_CONSOLE ).getErrorForSelector( 'getReport', [
			searchConsoleReportArgs,
		] )
	);

	const searchConsoleLoading = useSelect(
		( select ) =>
			! select(
				MODULES_SEARCH_CONSOLE
			).hasFinishedResolution( 'getReport', [ searchConsoleReportArgs ] )
	);

	const analyticsOverviewLoading = useSelect( ( select ) => {
		if ( ! isAnalyticsConnected ) {
			return false;
		}

		return ! select( MODULES_ANALYTICS ).hasFinishedResolution(
			'getReport',
			[ analyticsOverviewArgs ]
		);
	} );
	const analyticsOverviewData = useSelect( ( select ) => {
		if ( ! isAnalyticsConnected ) {
			return null;
		}

		return select( MODULES_ANALYTICS ).getReport( analyticsOverviewArgs );
	} );
	const analyticsOverviewError = useSelect( ( select ) => {
		if ( ! isAnalyticsConnected ) {
			return false;
		}

		return select( MODULES_ANALYTICS ).getErrorForSelector( 'getReport', [
			analyticsOverviewArgs,
		] );
	} );

	const analyticsStatsLoading = useSelect( ( select ) => {
		if ( ! isAnalyticsConnected ) {
			return false;
		}

		return ! select( MODULES_ANALYTICS ).hasFinishedResolution(
			'getReport',
			[ analyticsStatsArgs ]
		);
	} );
	const analyticsStatsData = useSelect( ( select ) => {
		if ( ! isAnalyticsConnected ) {
			return null;
		}

		return select( MODULES_ANALYTICS ).getReport( analyticsStatsArgs );
	} );
	const analyticsStatsError = useSelect( ( select ) => {
		if ( ! isAnalyticsConnected ) {
			return false;
		}

		return select( MODULES_ANALYTICS ).getErrorForSelector( 'getReport', [
			analyticsStatsArgs,
		] );
	} );

	const analyticsVisitorsOverviewLoading = useSelect( ( select ) => {
		if ( ! isAnalyticsConnected ) {
			return false;
		}

		return ! select( MODULES_ANALYTICS ).hasFinishedResolution(
			'getReport',
			[ analyticsVisitorsOverviewArgs ]
		);
	} );
	const analyticsVisitorsOverviewData = useSelect( ( select ) => {
		if ( ! isAnalyticsConnected ) {
			return null;
		}

		return select( MODULES_ANALYTICS ).getReport(
			analyticsVisitorsOverviewArgs
		);
	} );
	const analyticsVisitorsOverviewError = useSelect( ( select ) => {
		if ( ! isAnalyticsConnected ) {
			return false;
		}

		return select( MODULES_ANALYTICS ).getErrorForSelector( 'getReport', [
			analyticsVisitorsOverviewArgs,
		] );
	} );

	const analyticsVisitorsStatsLoading = useSelect( ( select ) => {
		if ( ! isAnalyticsConnected ) {
			return false;
		}

		return ! select( MODULES_ANALYTICS ).hasFinishedResolution(
			'getReport',
			[ analyticsVisitorsStatsArgs ]
		);
	} );
	const analyticsVisitorsStatsData = useSelect( ( select ) => {
		if ( ! isAnalyticsConnected ) {
			return null;
		}

		return select( MODULES_ANALYTICS ).getReport(
			analyticsVisitorsStatsArgs
		);
	} );
	const analyticsVisitorsStatsError = useSelect( ( select ) => {
		if ( ! isAnalyticsConnected ) {
			return null;
		}

		return select( MODULES_ANALYTICS ).getErrorForSelector( 'getReport', [
			analyticsVisitorsStatsArgs,
		] );
	} );

	const WidgetHeader = () => (
		<Header
			metrics={ SearchFunnelWidget.metrics }
			selectedStats={ selectedStats }
		/>
	);

	if (
		searchConsoleLoading ||
		analyticsOverviewLoading ||
		analyticsStatsLoading ||
		analyticsVisitorsOverviewLoading ||
		analyticsVisitorsStatsLoading
	) {
		return (
			<Widget Header={ WidgetHeader } noPadding>
				<PreviewBlock width="100%" height="190px" padding />
				<PreviewBlock width="100%" height="270px" padding />
			</Widget>
		);
	}

	if ( searchConsoleError ) {
		return (
			<Widget Header={ WidgetHeader }>
				<WidgetReportError
					moduleSlug="search-console"
					error={ searchConsoleError }
				/>
			</Widget>
		);
	}

	if ( isZeroReport( searchConsoleData ) ) {
		return (
			<Widget Header={ WidgetHeader }>
				<WidgetReportZero moduleSlug="search-console" />
			</Widget>
		);
	}

	return (
		<Widget noPadding Header={ WidgetHeader }>
			<Overview
				analyticsData={ analyticsOverviewData }
				analyticsVisitorsData={ analyticsVisitorsOverviewData }
				searchConsoleData={ searchConsoleData }
				handleStatsSelection={ setSelectedStats }
				selectedStats={ selectedStats }
				dateRangeLength={ dateRangeLength }
				error={
					analyticsOverviewError ||
					analyticsStatsError ||
					analyticsVisitorsOverviewError ||
					analyticsVisitorsStatsError
				}
				WidgetReportZero={ WidgetReportZero }
				WidgetReportError={ WidgetReportError }
			/>

			{ ( selectedStats === 0 || selectedStats === 1 ) && (
				<SearchConsoleStats
					data={ searchConsoleData }
					dateRangeLength={ dateRangeLength }
					selectedStats={ selectedStats }
					metrics={ SearchFunnelWidget.metrics }
				/>
			) }

			{ selectedStats === 2 && (
				<AnalyticsStats
					data={ analyticsVisitorsStatsData }
					dateRangeLength={ dateRangeLength }
					selectedStats={ 0 }
					metrics={ SearchFunnelWidget.metrics }
					dataLabels={ [
						__( 'Unique Visitors', 'google-site-kit' ),
					] }
					dataFormats={ [
						( x ) => parseFloat( x ).toLocaleString(),
					] }
					statsColor={
						SearchFunnelWidget.metrics[ selectedStats ].color
					}
				/>
			) }

			{ ( selectedStats === 3 || selectedStats === 4 ) && (
				<AnalyticsStats
					data={ analyticsStatsData }
					dateRangeLength={ dateRangeLength }
					// The selected stats order defined in the parent component does not match the order from the API.
					selectedStats={ selectedStats - 3 }
					metrics={ SearchFunnelWidget.metrics }
					dataLabels={ [
						__( 'Goals', 'google-site-kit' ),
						__( 'Bounce Rate %', 'google-site-kit' ),
					] }
					dataFormats={ [
						( x ) => parseFloat( x ).toLocaleString(),
						( x ) =>
							numFmt( x / 100, {
								style: 'percent',
								signDisplay: 'never',
								maximumFractionDigits: 2,
							} ),
					] }
					statsColor={
						SearchFunnelWidget.metrics[ selectedStats ].color
					}
				/>
			) }
		</Widget>
	);
};

SearchFunnelWidget.metrics = [
	{
		id: 'impressions',
		color: '#4285f4',
		label: __( 'Impressions', 'google-site-kit' ),
		metric: 'impressions',
		service: 'search-console',
	},
	{
		id: 'clicks',
		color: '#27bcd4',
		label: __( 'Clicks', 'google-site-kit' ),
		metric: 'clicks',
		service: 'search-console',
	},
	{
		id: 'users',
		color: '#1b9688',
		label: __( 'Users', 'google-site-kit' ),
		service: 'analytics',
	},
	{
		id: 'goals',
		color: '#673ab7',
		label: __( 'Goals', 'google-site-kit' ),
		service: 'analytics',
	},
	{
		id: 'bounce-rate',
		color: '#673ab7',
		label: __( 'Bounce Rate', 'google-site-kit' ),
		service: 'analytics',
	},
];

SearchFunnelWidget.propTypes = {
	Widget: PropTypes.elementType.isRequired,
	WidgetReportZero: PropTypes.elementType.isRequired,
	WidgetReportError: PropTypes.elementType.isRequired,
};

export default SearchFunnelWidget;
