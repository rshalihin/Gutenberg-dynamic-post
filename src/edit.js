import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { format, dateI18n, getSettings } from '@wordpress/date';
import { RawHTML } from "@wordpress/element";
import { PanelBody, QueryControls, ToggleControl } from "@wordpress/components";
import './editor.scss';

export default function Edit({attributes, setAttributes}) {
	const { numberOfPages, displayFutureImage, order, orderBy } = attributes;
	const posts = useSelect( ( select ) => {
		return select('core').getEntityRecords('postType', 'post', {per_page: numberOfPages, _embed: true, order, orderby: orderBy });
	}, [ numberOfPages, order, orderBy ] );
	const onChangeFeatureImageToggle = () => {
		setAttributes({ displayFutureImage: !displayFutureImage });
	}
	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Posts Settings')}>
                    <QueryControls
                        numberOfItems={numberOfPages}
                        onNumberOfItemsChange={(value) => setAttributes({numberOfPages: value})}
						minItems={1}
						maxItems={20}
						orderBy={orderBy}
						onOrderByChange = { (newOrderBy) => setAttributes({ orderBy: newOrderBy}) }
						order={order}
						onOrderChange={ (newOrder) => setAttributes({order: newOrder}) }
                    />
					<ToggleControl
						 checked={displayFutureImage}
						 help="This will help you turn on/off feature images."
						 label="Enable or disable Feature Images"
						 onChange={onChangeFeatureImageToggle}
					/>
                </PanelBody>
			</InspectorControls>
				<ul  { ...useBlockProps() }>
					{posts && posts.map((post) => {
						const featuredImage =
						post._embedded &&
						post._embedded['wp:featuredmedia'] &&
						post._embedded['wp:featuredmedia'].length > 0 &&
						post._embedded['wp:featuredmedia'][0];
						return (
							<li key={post.id}>
								{ post.title && 
								(<h5>
									<a href={post.link} target="_blank">
										{ post.title.rendered ? <RawHTML>{post.title.rendered}</RawHTML> : __('(No Title)', 'dynamic-block') }
									</a>
								</h5>) 
								}
								{ post.date_gmt &&(
								<time dateTime={format( 'c', post.date_gmt )}>
									{ dateI18n( getSettings().formats.date, post.date_gmt ) }
								</time>
								)}
								{ displayFutureImage && featuredImage && (
								<img src={featuredImage.source_url} alt={featuredImage.alt_text} />
								) }
								{ post.excerpt.rendered && (
									<RawHTML>{post.excerpt.rendered}</RawHTML>
								)}
							</li>
						);
					})}
				</ul>
		</>
	);
}
