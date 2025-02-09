/**
 * Analytics Settings stories.
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
import { storiesOf } from '@storybook/react';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import {
	MODULES_ANALYTICS,
	PROFILE_CREATE,
} from '../assets/js/modules/analytics/datastore/constants';
import { MODULES_ANALYTICS_4 } from '../assets/js/modules/analytics-4/datastore/constants';
import { MODULES_TAGMANAGER } from '../assets/js/modules/tagmanager/datastore/constants';
import { provideModules, provideModuleRegistrations } from '../tests/js/utils';
import { generateGTMAnalyticsPropertyStory } from './utils/generate-gtm-analytics-property-story';
import createLegacySettingsWrapper from './utils/create-legacy-settings-wrapper';
import {
	accountsPropertiesProfiles,
	defaultSettings,
} from '../assets/js/modules/analytics/datastore/__fixtures__';
import { defaultSettings as ga4DefaultSettings } from '../assets/js/modules/analytics-4/datastore/__fixtures__';

/* eslint-disable sitekit/acronym-case */
const { useRegistry } = Data;

const Settings = createLegacySettingsWrapper( 'analytics' );

function usingGenerateGTMAnalyticsPropertyStory( args ) {
	return generateGTMAnalyticsPropertyStory( {
		...args,
		Component( { registry } ) {
			return (
				<Settings
					registry={ registry }
					route="/connected-services/analytics/edit"
				/>
			);
		},
	} );
}

function WithRegistry( Story ) {
	const registry = useRegistry();
	const { dispatch } = registry;

	dispatch( MODULES_ANALYTICS ).receiveGetSettings( {} );
	dispatch( MODULES_ANALYTICS ).receiveGetExistingTag( null );

	dispatch( MODULES_TAGMANAGER ).receiveGetSettings( {} );

	provideModules( registry, [
		{
			slug: 'analytics',
			active: true,
			connected: true,
		},
	] );
	provideModuleRegistrations( registry );

	return <Story registry={ registry } />;
}

storiesOf( 'Analytics Module/Settings', module )
	.add(
		'View, closed',
		( args, { registry } ) => {
			return (
				<Settings registry={ registry } route="/connected-services" />
			);
		},
		{
			decorators: [ WithRegistry ],
		}
	)
	.add(
		'View, open with all settings w/o GA4',
		( args, { registry } ) => {
			registry.dispatch( MODULES_ANALYTICS ).receiveGetSettings( {
				...defaultSettings,
				accountID: '1234567890',
				propertyID: 'UA-1234567890-1',
				internalWebPropertyID: '135791113',
				profileID: '9999999',
			} );

			return (
				<Settings
					registry={ registry }
					route="/connected-services/analytics"
				/>
			);
		},
		{
			decorators: [ WithRegistry ],
		}
	)
	.add(
		'View, open with all settings w/ GA4',
		( args, { registry } ) => {
			provideModules( registry, [
				{
					slug: 'search-console',
					active: false,
					connected: true,
				},
				{
					slug: 'analytics',
					active: true,
					connected: true,
				},
				{
					slug: 'analytics-4',
					active: true,
					connected: true,
					internal: true,
				},
			] );

			registry.dispatch( MODULES_ANALYTICS ).receiveGetSettings( {
				...defaultSettings,
				accountID: '1234567890',
				propertyID: 'UA-1234567890-1',
				internalWebPropertyID: '135791113',
				profileID: '9999999',
			} );

			registry.dispatch( MODULES_ANALYTICS_4 ).receiveGetSettings( {
				...ga4DefaultSettings,
				propertyID: '1001',
				webDataStreamID: '2001',
				measurementID: 'G-12345ABCDE',
			} );

			return (
				<Settings
					registry={ registry }
					route="/connected-services/analytics"
					skipModulesProvide
				/>
			);
		},
		{
			decorators: [ WithRegistry ],
		}
	)
	.add(
		'View, open with all settings, no snippet with existing tag',
		( args, { registry } ) => {
			registry.dispatch( MODULES_ANALYTICS ).receiveGetSettings( {
				...defaultSettings,
				accountID: '1234567890',
				propertyID: 'UA-1234567890-1',
				internalWebPropertyID: '135791113',
				profileID: '9999999',
				useSnippet: false,
			} );
			registry
				.dispatch( MODULES_ANALYTICS )
				.receiveGetExistingTag( 'UA-1234567890-1' );
			registry.dispatch( MODULES_ANALYTICS ).receiveGetTagPermission(
				{
					accountID: '1234567890',
					permission: true,
				},
				{ propertyID: 'UA-1234567890-1' }
			);

			return (
				<Settings
					registry={ registry }
					route="/connected-services/analytics"
				/>
			);
		},
		{
			decorators: [ WithRegistry ],
		}
	)
	.add(
		'Edit, open with all settings w/o GA4',
		( args, { registry } ) => {
			const { dispatch } = registry;
			const {
				accounts,
				properties,
				profiles,
			} = accountsPropertiesProfiles;

			/* eslint-disable sitekit/acronym-case */
			const {
				accountId: accountID,
				webPropertyId: propertyID,
				id: profileID,
			} = profiles[ 0 ];
			/* eslint-enable */

			const {
				internalWebPropertyId: internalWebPropertyID, // eslint-disable-line sitekit/acronym-case
			} = properties.find( ( property ) => propertyID === property.id );

			provideModules( registry, [
				{
					slug: 'search-console',
					active: false,
					connected: true,
				},
				{
					slug: 'analytics',
					active: true,
					connected: true,
				},
				{
					slug: 'analytics-4',
					active: true,
					connected: false,
					internal: true,
				},
			] );

			dispatch( MODULES_ANALYTICS ).receiveGetAccounts( accounts );
			dispatch( MODULES_ANALYTICS ).receiveGetProperties( properties, {
				accountID,
			} );
			dispatch( MODULES_ANALYTICS ).receiveGetProfiles( profiles, {
				accountID,
				propertyID,
			} );
			dispatch( MODULES_ANALYTICS ).receiveGetSettings( {
				...defaultSettings,
				accountID,
				propertyID,
				internalWebPropertyID,
				profileID,
			} );

			dispatch( MODULES_ANALYTICS_4 ).receiveGetProperties( [], {
				accountID,
			} );

			return (
				<Settings
					registry={ registry }
					route="/connected-services/analytics/edit"
				/>
			);
		},
		{
			decorators: [ WithRegistry ],
		}
	)
	.add(
		'Edit, open with all settings w/ GA4',
		( args, { registry } ) => {
			const { dispatch } = registry;
			const {
				accounts,
				properties,
				profiles,
			} = accountsPropertiesProfiles;

			/* eslint-disable sitekit/acronym-case */
			const {
				accountId: accountID,
				webPropertyId,
				id: profileID,
			} = profiles[ 0 ];
			const { internalWebPropertyId } = properties.find(
				( property ) => webPropertyId === property.id
			);
			/* eslint-enable */

			provideModules( registry, [
				{
					slug: 'search-console',
					active: false,
					connected: true,
				},
				{
					slug: 'analytics',
					active: true,
					connected: true,
				},
				{
					slug: 'analytics-4',
					active: true,
					connected: true,
					internal: true,
				},
			] );

			dispatch( MODULES_ANALYTICS ).receiveGetAccounts( accounts );
			dispatch( MODULES_ANALYTICS ).receiveGetProperties( properties, {
				accountID,
			} );
			dispatch( MODULES_ANALYTICS ).receiveGetProfiles( profiles, {
				accountID,
				propertyID: profiles[ 0 ].webPropertyId, // eslint-disable-line sitekit/acronym-case
			} );
			dispatch( MODULES_ANALYTICS ).receiveGetSettings( {
				...defaultSettings,
				accountID,
				propertyID: webPropertyId, // eslint-disable-line sitekit/acronym-case
				internalWebPropertyID: internalWebPropertyId, // eslint-disable-line sitekit/acronym-case
				profileID,
			} );

			dispatch( MODULES_ANALYTICS_4 ).receiveGetSettings( {
				...ga4DefaultSettings,
				propertyID: '1001',
				webDataStreamID: '2001',
				measurementID: 'G-12345ABCDE',
			} );
			dispatch( MODULES_ANALYTICS_4 ).receiveGetProperties(
				[
					{
						_id: '1001',
						displayName: 'GA4 Property',
					},
				],
				{ accountID }
			);
			dispatch( MODULES_ANALYTICS_4 ).receiveGetWebDataStreams(
				[
					{
						_id: '2001',
						/* eslint-disable sitekit/acronym-case */
						measurementId: 'G-12345ABCDE',
						defaultUri: 'http://example.com',
						/* eslint-disable */
					},
				],
				{ propertyID: '1001' }
			);

			return (
				<Settings
					registry={ registry }
					route="/connected-services/analytics/edit"
					skipModulesProvide
				/>
			);
		},
		{
			decorators: [ WithRegistry ],
		}
	)
	.add(
		'Edit, open when creating new view',
		( args, { registry } ) => {
			const { dispatch } = registry;
			const {
				accounts,
				properties,
				profiles,
			} = accountsPropertiesProfiles;

			// eslint-disable-next-line sitekit/acronym-case
			const { accountId, webPropertyId, id: profileID } = profiles[ 0 ];
			// eslint-disable-next-line sitekit/acronym-case
			const { internalWebPropertyId } = properties.find(
				( property ) => webPropertyId === property.id
			);

			dispatch( MODULES_ANALYTICS ).receiveGetAccounts( accounts );
			dispatch( MODULES_ANALYTICS ).receiveGetProperties( properties, {
				accountID: accountId,
			} ); // eslint-disable-line sitekit/acronym-case
			dispatch( MODULES_ANALYTICS ).receiveGetProfiles( profiles, {
				accountID: accountId, // eslint-disable-line sitekit/acronym-case
				propertyID: webPropertyId, // eslint-disable-line sitekit/acronym-case
			} );
			dispatch( MODULES_ANALYTICS ).receiveGetSettings( {
				...defaultSettings,
				accountID: accountId, // eslint-disable-line sitekit/acronym-case
				propertyID: webPropertyId, // eslint-disable-line sitekit/acronym-case
				internalWebPropertyID: internalWebPropertyId, // eslint-disable-line sitekit/acronym-case
				profileID,
			} );
			// This is chosen by the user, not received from API.
			dispatch( MODULES_ANALYTICS ).setSettings( {
				profileID: PROFILE_CREATE,
			} );

			dispatch( MODULES_ANALYTICS_4 ).receiveGetProperties( [], {
				accountID: accountId, // eslint-disable-line sitekit/acronym-case
			} );

			return (
				<Settings
					registry={ registry }
					route="/connected-services/analytics/edit"
				/>
			);
		},
		{
			decorators: [ WithRegistry ],
		}
	)
	.add(
		'Edit, open with no accounts',
		( args, { registry } ) => {
			const { dispatch } = registry;
			dispatch( MODULES_ANALYTICS ).receiveGetAccounts( [] );

			return (
				<Settings
					registry={ registry }
					route="/connected-services/analytics/edit"
				/>
			);
		},
		{
			decorators: [ WithRegistry ],
		}
	)
	.add(
		'Edit, with existing tag w/ access',
		( args, { registry } ) => {
			const { dispatch } = registry;
			const {
				accounts,
				properties,
				profiles,
				matchedProperty,
			} = accountsPropertiesProfiles;
			const existingTag = {
				// eslint-disable-next-line sitekit/acronym-case
				accountID: matchedProperty.accountId,
				propertyID: matchedProperty.id,
			};

			dispatch( MODULES_ANALYTICS ).receiveGetAccounts( accounts );
			dispatch( MODULES_ANALYTICS ).receiveGetProperties( properties, {
				accountID: properties[ 0 ].accountId,
			} ); // eslint-disable-line sitekit/acronym-case
			dispatch( MODULES_ANALYTICS ).receiveGetProfiles( profiles, {
				accountID: properties[ 0 ].accountId, // eslint-disable-line sitekit/acronym-case
				propertyID: profiles[ 0 ].webPropertyId, // eslint-disable-line sitekit/acronym-case
			} );
			dispatch( MODULES_ANALYTICS ).receiveGetSettings( defaultSettings );
			dispatch( MODULES_ANALYTICS ).receiveGetExistingTag(
				existingTag.propertyID
			);
			dispatch( MODULES_ANALYTICS ).receiveGetTagPermission(
				{
					accountID: existingTag.accountID,
					permission: true,
				},
				{ propertyID: existingTag.propertyID }
			);

			dispatch( MODULES_ANALYTICS_4 ).receiveGetProperties(
				[
					{
						_id: '1001',
						displayName: 'GA4 Property',
					},
				],
				{ accountID: existingTag.accountID }
			);

			return (
				<Settings
					registry={ registry }
					route="/connected-services/analytics/edit"
				/>
			);
		},
		{
			decorators: [ WithRegistry ],
		}
	)
	.add(
		'Edit, with existing tag w/o access',
		( args, { registry } ) => {
			const {
				accounts,
				properties,
				profiles,
			} = accountsPropertiesProfiles;

			const existingTag = {
				accountID: '12345678',
				propertyID: 'UA-12345678-1',
			};

			registry
				.dispatch( MODULES_ANALYTICS )
				.receiveGetAccounts( accounts );
			registry
				.dispatch( MODULES_ANALYTICS )
				.receiveGetProperties( properties, {
					accountID: properties[ 0 ].accountId,
				} ); // eslint-disable-line sitekit/acronym-case
			registry
				.dispatch( MODULES_ANALYTICS )
				.receiveGetProfiles( profiles, {
					accountID: properties[ 0 ].accountId, // eslint-disable-line sitekit/acronym-case
					propertyID: profiles[ 0 ].webPropertyId, // eslint-disable-line sitekit/acronym-case
				} );
			registry
				.dispatch( MODULES_ANALYTICS )
				.receiveGetSettings( defaultSettings );
			registry
				.dispatch( MODULES_ANALYTICS )
				.receiveGetExistingTag( existingTag.propertyID );
			registry.dispatch( MODULES_ANALYTICS ).receiveGetTagPermission(
				{
					accountID: existingTag.accountID,
					permission: false,
				},
				{ propertyID: existingTag.propertyID }
			);

			return (
				<Settings
					registry={ registry }
					route="/connected-services/analytics/edit"
				/>
			);
		},
		{
			decorators: [ WithRegistry ],
		}
	)
	.add(
		'No Tag, GTM property w/ access',
		usingGenerateGTMAnalyticsPropertyStory( {
			useExistingTag: false,
			gtmPermission: true,
		} )
	)
	.add(
		'No Tag, GTM property w/o access',
		usingGenerateGTMAnalyticsPropertyStory( {
			useExistingTag: false,
			gtmPermission: false,
		} )
	)
	.add(
		'Existing Tag w/ access, GTM property w/ access',
		usingGenerateGTMAnalyticsPropertyStory( {
			useExistingTag: true,
			gtmPermission: true,
			gaPermission: true,
		} )
	)
	.add(
		'Existing Tag w/ access, GTM property w/o access',
		usingGenerateGTMAnalyticsPropertyStory( {
			useExistingTag: true,
			gtmPermission: false,
			gaPermission: true,
		} )
	)
	.add(
		'Existing Tag w/o access, GTM property w/ access',
		usingGenerateGTMAnalyticsPropertyStory( {
			useExistingTag: true,
			gtmPermission: true,
			gaPermission: false,
		} )
	)
	.add(
		'Existing Tag w/o access, GTM property w/o access',
		usingGenerateGTMAnalyticsPropertyStory( {
			useExistingTag: true,
			gtmPermission: false,
			gaPermission: false,
		} )
	);
