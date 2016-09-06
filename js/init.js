var settings = {
	/////////////////////////////////////////////////////////////////


	headerOrientation:		'vertical',
	horizontalOn1000px:		true,
	introSpeed:				1500,
	speed:					1000,
	use3D:					true,
	use3DParallax:			true,
	parallaxSize:			10,
	alwaysCenter:			true,
	useKeys:				true,


	/////////////////////////////////////////////////////////////////
	use3DFilter:			false,
	slideSpacing:			(_5grid.is1000px ? 15 : 30)
};

_5grid.ready(function() {

	if (_5grid.isDesktop)
	{
		/**************************************************************/
		/* MAIN                                                       */
		/**************************************************************/

			// Helper functions
				$.x23_has3D = function() {
					// via gist.github.com/3794226
					var el = document.createElement('p'), has3d, transforms = {'webkitTransform':'-webkit-transform','OTransform':'-o-transform','msTransform':'-ms-transform','MozTransform':'-moz-transform','transform':'transform'};
					document.body.insertBefore(el, null);
					for (var t in transforms) { if (el.style[t] !== undefined) { el.style[t] = 'translate3d(1px,1px,1px)'; has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]); } }
					document.body.removeChild(el);
					return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
				}
				$.x23_setUnlock = function(f) { window.setTimeout(function() { isLocked = false; if (f) (f)(); }, settings.speed); }
				$.fn.x23_css = function(k, v) { 
					if (k == 'filter' && !settings.use3DFilter)
						return $(this);

					return $(this)
						.css('-webkit-' + k, v)
						.css('-moz-' + k, v)
						.css('-o-' + k, v)
						.css('-ms-' + k, v)
						.css(k, v);
				}

			// Automatic settings tweaks

				// Force horizontal on 1000px?
					if (settings.horizontalOn1000px && _5grid.is1000px)
						settings.headerOrientation = 'horizontal';

				// Disable 3D acceleration on browsers that don't support it
					if (!$.x23_has3D())
						settings.use3D = false;

				// Disable 3D filters on mobile devices
					if ((isTouch = !!('ontouchstart' in window)) === true)
						settings.use3DFilter = false;
			
				// Turn off the introSpeed for <= IE8
					if ($.browser.msie && $.browser.version <= 8)
						settings.introSpeed = 0;
			
			// Vars
				var	_window = $(window),
					_body = $('body'),
					_bg = $('#bg'), _bg_increment,
					_header = $('#header'), _header_useWidth, _header_useHeight, _header_inner = _header.find('.inner'),
					_nav = $('#nav'), _nav_links = _nav.find('li'),
					_viewer = $('#viewer'),
					_reel = _viewer.find('.reel'), _reel_upperLimit, _reel_lowerLimit,
					_slides = _reel.find('.slide'), _slides_length = _slides.length, _slides_map = [], _slides_posMap = [],
					_firstSlide = _slides.eq(0), _firstSlide_width = (_firstSlide.outerWidth() + (settings.slideSpacing * 2));

				var pos = 0,
					isLocked = false,
					_window_offset = 0;

			// 3D Only: Disable backface visibility on pretty much everything
				$().add(_bg).add(_header).add(_nav).add(_viewer).add(_reel).add(_slides)
					.x23_css('backface-visibility', 'hidden');		

			// Mobile fixes
				$('head').append('<meta name="viewport" content="initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0" />');

			// Window
				if (settings.useKeys)
				{
					_window
						.keydown(function(e) {
							switch (e.keyCode)
							{
								case 37:
									_reel.trigger('previousSlide');
									return false;
									
								case 39:
									_reel.trigger('nextSlide');
									return false;

								case 35: //end
									_reel.trigger('lastSlide');
									return false;

								case 36: //home
									_reel.trigger('firstSlide');
									return false;
								
								case 33: //pgup
								case 34: //pgdown
								case 38: //up
								case 40: //down
									return false;
									
								default:
									break;
							}
						});
				}

				_window
					.bind('resize', function() {
						_viewer.width(_window.width());
						
						if (settings.alwaysCenter)
							_window_offset = (_viewer.width() - _header_useWidth - _firstSlide_width - (settings.slideSpacing * 2)) / 2;
						else
							_window_offset = settings.slideSpacing;
						
						_reel_lowerLimit = 0;
						_reel_upperLimit = -1 * (_firstSlide_width * (_slides_length - 1) - (_window_offset * 2));
					});

			// Wrapper
				if (settings.use3DParallax)
				{
					_bg_increment = Math.round(_window.width() * (settings.parallaxSize / 100.00));
					
					_bg
						.css('width', _window.width() + (_slides_length * _bg_increment))
						.css('height', _window.height() * (1.0 + (settings.parallaxSize / 100.00)))
						.bind('switchSlide', function(e, n) {
							_bg.x23_css('transform', 'translateX(' + (-1 * pos * _bg_increment) + 'px)');
						});
				}

			// Body
				_body
					.css('overflow-y', 'hidden')
					.x23_css('perspective', '0px');

			// Header
				if (settings.headerOrientation == 'vertical')
				{
					_body.addClass('vertical');
					_header_useHeight = 0;
					_header_useWidth = _header.width();

					_header_inner
						.css('top', '50%')
						.css('margin-top', (-1 * (_header_inner.height() / 2)) + 'px');
				}
				else
				{
					_body.addClass('horizontal');
					_header_useHeight = _header.height();
					_header_useWidth = 0;
				}

			// Nav
				_nav_links.each(function() {
				
					var t = $(this), a = t.find('a'), id = a.attr('href').substring(1);

					_slides_map[id] = {
						link:	t,
						slide:	null,
						pos:	null
					};

					t
						.bind('activate', function() {
							/*
							_nav_links.trigger('deactivate');
							t.addClass('current_page_item');
							*/
						})
						.click(function(e) {
							e.preventDefault();
							e.stopPropagation();

							if (isLocked)
								return false;

							_slides_map[id].slide.trigger('activate');
						});
				});
				
				_nav_links
					.bind('deactivate', function() {
						/*
						_nav_links.removeClass('current_page_item');
						*/
					});

			// Viewer
				_viewer
					.css('overflow', 'hidden')
					.css('top', '50%')
					.css('margin-top', (-1 * ((_firstSlide.outerHeight() / 2)) + (_header_useHeight / 2) + 'px'));

			// Reel
				_reel
					.width( _firstSlide_width * _slides_length )
					.css('margin-left', _header_useWidth + settings.slideSpacing)
					.bind('firstSlide', function() {
						_reel.trigger('switchSlide', [0]);
					})
					.bind('lastSlide', function() {
						_reel.trigger('switchSlide', [_slides_length - 1]);
					})
					.bind('nextSlide', function() {
						if (_slides_posMap[pos + 1])
							_slides_map[ _slides_posMap[pos + 1] ].slide.trigger('activate');
						else
							_reel.trigger('switchSlide', [pos + 1]);
					})
					.bind('previousSlide', function() {
						if (_slides_posMap[pos - 1])
							_slides_map[ _slides_posMap[pos - 1] ].slide.trigger('activate');
						else
							_reel.trigger('switchSlide', [pos - 1]);
					})
					.bind('gotoSlide', function(e, id) {
						if (isLocked)
							return;
					
						if (!_slides_map[id])
							return;
							
						if (_slides_map[id].link)
							_slides_map[id].link.trigger('activate');
							
						_reel.trigger('switchSlide', _slides_map[id].pos);
					});

				if (settings.use3D)
				{
					_reel
						.x23_css('transform', 'translate3d(0,0,0)')
						.x23_css('transition-duration', settings.speed + 'ms')
						.bind('switchSlide', function(e, n) {
							if (pos == n)
								return;

							if (isLocked || n < 0 || n >= _slides_length)
								return;
							
							isLocked = true;
							pos = n;
							_reel.x23_css('transform', 'translateX(' + Math.max(Math.min(((-1 * (_firstSlide_width * pos)) + _window_offset), _reel_lowerLimit), _reel_upperLimit) + 'px)');
							_bg.trigger('switchSlide', pos);
							$.x23_setUnlock(function() {
								_slides.eq(pos).find('.scrollArea-beta').focus();
								_viewer.scrollLeft(0);
							});
							
						});
				}
				else
				{
					_reel
						.bind('switchSlide', function(e, n) {
							if (pos == n)
								return;

							if (isLocked || n < 0 || n >= _slides_length)
								return;
							
							isLocked = true;
							pos = n;
							_reel.animate({ left: Math.max(Math.min(((-1 * (_firstSlide_width * pos)) + _window_offset), _reel_lowerLimit), _reel_upperLimit) }, settings.speed, 'swing', function() {
								isLocked = false;
								_slides.eq(pos).find('.scrollArea-beta').focus();
								_viewer.scrollLeft(0);
							});
						});
				}

			// Slides
				_slides
					.css('margin-left', settings.slideSpacing)
					.css('margin-right', settings.slideSpacing)
					.each(function(i) {
						var t = $(this), tsa, tsb, id = t.attr('id');

						if (!_slides_map[id])
							_slides_map[id] = { link: null, slide: t, pos: null }
						else
						{
							_slides_map[id].slide = t;
							_slides_map[id].pos = i;
						}
						
						_slides_posMap[i] = id;
						
						t
							.bind('activate', function() {
								_reel.trigger('gotoSlide', [id]);
							})
							.click(function() {
								t.trigger('activate');
							});

						t.wrapInner('<div class="scrollArea-beta"></div>');
						tsb = t.find('.scrollArea-beta');

						t.wrapInner('<div class="scrollArea-alpha"></div>');
						tsa = t.find('.scrollArea-alpha');

						tsb
							.width(t.width() - 10)
							.height(t.height() + tsb.height() - 10)
							.x23_css('transform', 'translateX(0px)')
							.attr('tabindex', '1000');
						
						if (settings.useKeys)
						{
							tsb
								.keydown(function(e) {
									switch (e.keyCode)
									{
										case 37:
											_reel.trigger('previousSlide');
											return false;
											
										case 39:
											_reel.trigger('nextSlide');
											return false;

										case 35: //end
											_reel.trigger('lastSlide');
											return false;

										case 36: //home
											_reel.trigger('firstSlide');
											return false;
													
										default:
											break;
									}
								});
						}

					});

			// Slide links
				$('.slidelink').click(function(e) {
					e.preventDefault();
					e.stopPropagation();

					var id = $(this).attr('href').substring(1);
					
					if (isLocked || !_slides_map[id])
						return false;

					_slides_map[id].slide.trigger('activate');
				});

			// Init
				_window.trigger('resize');

				if (settings.use3D)
				{
					_bg
						.x23_css('transition-duration', '0ms')
						.x23_css('filter', 'blur(20px)')
						.css('opacity', '0.0');

					if (settings.use3DParallax)
						_bg
							.x23_css('transform', 'translateX(' + (-1 * _slides_length * _bg_increment) + 'px)');
					else
						_bg
							.x23_css('transform', 'translateX(0px)');

					window.setTimeout(function() {
						_bg
							.x23_css('transition-duration', settings.introSpeed + 'ms')
							.x23_css('filter', 'blur(0px)')
							.css('opacity', '1.0');
					}, 0);

					window.setTimeout(function() {

						_header
							.show()
							.x23_css('transform', 'translate3d(' + (-1 * _header_useWidth) + 'px, ' + (-1 * _header_useHeight) + 'px, 0)')
							.x23_css('transition-duration', '0ms')
							.x23_css('filter', 'blur(3px)')
							.css('opacity', '0.0');
					
						_reel
							.show()
							.x23_css('transform', 'translateX(' + (-1 * (_firstSlide_width * (_slides_length - 1) * 0.80)) + 'px)')
							.x23_css('transition-duration', '0ms')
							.x23_css('filter', 'blur(6px)')
							.css('opacity', '0.0');

						window.setTimeout(function() {
							_bg
								.x23_css('transition-duration', settings.speed + 'ms')
								.x23_css('transform', 'translateX(0px)');

							_header
								.x23_css('transform', 'translate3d(0,0,0)')
								.x23_css('transition-duration', settings.speed + 'ms')
								.x23_css('filter', 'blur(0px)')
								.css('opacity', '1.0');

							_reel
								.x23_css('transition-duration', settings.speed + 'ms')
								.x23_css('transform', 'translate3d(0,0,0)')
								.x23_css('filter', 'blur(0px)')
								.css('opacity', '1.0');
								
							window.setTimeout(function() {
								_slides.find('.scrollArea-beta').scrollTop(0);
								_slides.eq(0).find('.scrollArea-beta').focus();
							}, settings.speed);

						}, 0);
					}, settings.introSpeed);
				}
				else
				{
					_bg.fadeTo(settings.introSpeed, 1.0, function() {
						_header.fadeTo('slow', 1.0);
						_reel.fadeIn('slow', function() {
							_slides.find('.scrollArea-beta').scrollTop(0);
							_slides.eq(0).find('.scrollArea-beta').focus();
						});
					});
				}

			// Init scrollbars
				window.setTimeout(function() {
					_slides.each(function() {
						var t = $(this), tsa = t.find('.scrollArea-alpha'), tsb = t.find('.scrollArea-beta');
						tsb
							.niceScroll({
								body:		tsa,
								zindex:		2
							});
					});
				}, settings.introSpeed);

		/**************************************************************/
		/* GALLERY                                                    */
		/**************************************************************/

			$('.widget-gallery').poptrox({
				baseZIndex: 10000,
				useBodyOverflow: false,
				usePopupCloser: false,
				usePopupCaption: true
			});
	}
	else
	{
		/**************************************************************/
		/* MAIN                                                       */
		/**************************************************************/

			var _bg = $('#bg'),
				_header = $('#header'),
				_reel = $('#viewer .reel');

			_bg.show();
			_header.show();
			_reel.show();

		/**************************************************************/
		/* GALLERY                                                    */
		/**************************************************************/

			$('.widget-gallery').poptrox({
				baseZIndex: 10000,
				useBodyOverflow: false,
				usePopupCloser: false,
				usePopupCaption: true,
				popupSpeed: 0,
				windowMargin: 5,
				fadeSpeed: 0,
				popupPadding: 2,
				popupCaptionHeight: 40,
				fadeSpeed: 0
			});
	}
	
}, true);