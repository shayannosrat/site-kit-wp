<?php
/**
 * Class Google\Site_Kit\Modules\AdSense\AMP_Tag
 *
 * @package   Google\Site_Kit\Modules\AdSense
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://sitekit.withgoogle.com
 */

namespace Google\Site_Kit\Modules\AdSense;

use Google\Site_Kit\Core\Tags\AMP_Tag as Base_AMP_Tag;
use Google\Site_Kit\Core\Util\Method_Proxy_Trait;

/**
 * Class for AMP tag.
 *
 * @since n.e.x.t
 * @access private
 * @ignore
 */
class AMP_Tag extends Base_AMP_Tag {

	use Method_Proxy_Trait;

	/**
	 * Internal flag for whether the AdSense tag has been printed.
	 *
	 * @since n.e.x.t
	 * @var bool
	 */
	private $adsense_tag_printed = false;

	/**
	 * Registers tag hooks.
	 *
	 * @since n.e.x.t
	 */
	protected function register_hooks() {
		// For AMP Reader, and AMP Native and Transitional (if `wp_body_open` supported).
		add_action( 'wp_body_open', $this->get_method_proxy( 'print_amp_auto_ads' ), -9999 );
		// For AMP Reader, and AMP Native and Transitional (as fallback).
		add_filter( 'the_content', $this->get_method_proxy( 'amp_content_add_auto_ads' ) );

		// Load amp-auto-ads component for AMP Reader.
		$this->enqueue_amp_reader_component_script( 'amp-auto-ads', 'https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js' );

		$this->do_init_tag_action();
	}

	/**
	 * Outputs the <amp-auto-ads> tag.
	 *
	 * @since n.e.x.t
	 */
	private function print_amp_auto_ads() {
		if ( $this->adsense_tag_printed ) {
			return;
		}

		$this->adsense_tag_printed = true;

		printf(
			'<amp-auto-ads type="adsense" data-ad-client="%s"%s></amp-auto-ads>',
			esc_attr( $this->tag_id ),
			$this->get_tag_blocked_on_consent_attribute() // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		);
	}

	/**
	 * Adds the AMP auto ads tag if opted in.
	 *
	 * @since n.e.x.t
	 *
	 * @param string $content The page content.
	 * @return string Filtered $content.
	 */
	private function amp_content_add_auto_ads( $content ) {
		// Only run for the primary application of the `the_content` filter.
		if ( $this->adsense_tag_printed || ! in_the_loop() ) {
			return $content;
		}

		$this->adsense_tag_printed = true;

		return sprintf(
			'<amp-auto-ads type="adsense" data-ad-client="%s"%s></amp-auto-ads> %s',
			esc_attr( $this->tag_id ),
			$this->get_tag_blocked_on_consent_attribute(),
			$content
		);
	}

}
