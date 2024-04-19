import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { format, dateI18n, getSettings } from '@wordpress/date';
import { RawHTML } from "@wordpress/element";
import { PanelBody, QueryControls, ToggleControl, Icon } from "@wordpress/components";
import './editor.scss';

export default function Edit({attributes, setAttributes}) {
	const { numberOfPages, displayFutureImage, order, orderBy, categories } = attributes;
	const cateId = categories && categories.length > 0 ? categories.map( cat => cat.id ) : [];

	const posts = useSelect( ( select ) => {
		return select('core').getEntityRecords('postType', 'post', {per_page: numberOfPages, _embed: true, order, orderby: orderBy, categories: cateId });
	}, [ numberOfPages, order, orderBy, categories ] );

	const allCategories = useSelect( ( select ) => {
		return select('core').getEntityRecords('taxonomy', 'category' );
	}, [] );
	
	const categorySuggestions = {}
	if ( allCategories ) {
		for (let i = 0; i < allCategories.length; i++) {
			const cate = allCategories[i];
			categorySuggestions[cate.name] = cate;			
		}
	}

	const onCategoriesChange = ( values ) => {
		const hasNoSuggestions = values.some( (value) => typeof value === 'string' && !categorySuggestions[value]);
		if ( hasNoSuggestions ) return;
		const updateCate = values.map( (value) => {return typeof value === 'string' ? categorySuggestions[value] : value } );
		setAttributes({ categories: updateCate });
	}

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
						categorySuggestions={categorySuggestions}
						selectedCategories={categories}
						onCategoryChange={onCategoriesChange}
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
