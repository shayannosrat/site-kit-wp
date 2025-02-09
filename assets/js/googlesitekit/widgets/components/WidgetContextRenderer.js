/**
 * WidgetContextRenderer component.
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
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import WidgetAreaRenderer from './WidgetAreaRenderer';
import { CORE_WIDGETS } from '../datastore/constants';
import { Grid, Row, Cell } from '../../../material-components';

const { useSelect } = Data;

const WidgetContextRenderer = ( props ) => {
	const { id, slug, className, Header, Footer } = props;

	const widgetAreas = useSelect( ( select ) => {
		if ( slug ) {
			return select( CORE_WIDGETS ).getWidgetAreas( slug );
		}
		return null;
	} );

	return (
		<div
			id={ id }
			className={ classnames(
				'googlesitekit-widget-context',
				className
			) }
		>
			{ Header && (
				<Grid>
					<Row>
						<Cell size={ 12 }>
							<Header />
						</Cell>
					</Row>
				</Grid>
			) }
			{ widgetAreas &&
				widgetAreas.map( ( area ) => {
					return (
						<WidgetAreaRenderer
							key={ area.slug }
							slug={ area.slug }
							totalAreas={ widgetAreas.length }
						/>
					);
				} ) }
			{ Footer && (
				<Grid>
					<Row>
						<Cell size={ 12 }>
							<Footer />
						</Cell>
					</Row>
				</Grid>
			) }
		</div>
	);
};

WidgetContextRenderer.propTypes = {
	id: PropTypes.string,
	slug: PropTypes.string,
	className: PropTypes.string,
	Header: PropTypes.elementType,
	Footer: PropTypes.elementType,
};

export default WidgetContextRenderer;
