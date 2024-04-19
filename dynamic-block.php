<?php
/**
 * Plugin Name:       Dynamic Block
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       dynamic-block
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 * @param array $attributes The attributes.
 */
function dynamic_block_render_block( $attributes ) {
	$args = array(
		'posts_per_page' => $attributes['numberOfPages'],
		'post_type'      => 'publish',
		'post_type'      => 'post',
		'order'          => $attributes['order'],
		'orderby'        => $attributes['orderBy'],
	);
	if ( isset( $attributes['categories'] ) ) {
		$args['category__in'] = array_column( $attributes['categories'], 'id' );
	}
	$recent_posts = get_posts( $args );

	$posts = '<ul ' . get_block_wrapper_attributes() . '>';
	foreach ( $recent_posts as $post ) {
		$title     = get_the_title( $post );
		$title     = $title ? $title : '(No title)';
		$permalink = get_permalink( $post );
		$excerpt   = get_the_excerpt( $post );
		$posts    .= '<li>';
		$posts    .= '<h4><a href="' . esc_url( $permalink ) . '">' . esc_html( $title ) . '</a></h4>';
		$posts    .= '<time datetime="' . esc_attr( get_the_date( 'c', $post ) ) . '">' . esc_html( get_the_date( '', $post ) ) . '</time>';
		if ( $attributes['displayFutureImage'] && has_post_thumbnail( $post ) ) {
			$posts .= get_the_post_thumbnail( $post, 'medium_large' );
		}
		if ( $excerpt ) {
			$posts .= '<p>' . esc_html( $excerpt ) . '</p>';
		}
		$posts .= '</li>';
	}
	$posts .= '</ul>';
	return $posts;
}
/**
 * Gutenberg block render function.
 *
 * @return void
 */
function create_block_dynamic_block_block_init() {
	register_block_type( __DIR__ . '/build', array( 'render_callback' => 'dynamic_block_render_block' ) );
}
add_action( 'init', 'create_block_dynamic_block_block_init' );


function mrs_dd( $arguments ) {
	echo '<pre>';
	var_dump( $arguments );
	echo '</pre>';
	wp_die();
}
