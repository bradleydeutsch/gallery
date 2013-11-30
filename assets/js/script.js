var global = {},
	gallery;

function Gallery(imagesArr) {
	var gallery = {
			CONSTANTS: {
				SINGLE_WIDTH: 200,
				MARGIN: 20,
				BORDER: 1,
				GAP_THRESHOLD: 150
			},
		};

	gallery.CALCULATED_IMAGE_WIDTH = gallery.CONSTANTS.SINGLE_WIDTH + (gallery.CONSTANTS.BORDER * 2);

	this.imagesArr = imagesArr;

	this.setupGallery = function () {
		var _this = this,
			windowWidth = $(window).width(),
			columns = 3;

		if (windowWidth > 1800) {
			columns = 6;
		} else if (windowWidth > 1500) {
			columns = 5;
		} else if (windowWidth > 1000) {
			columns = 4;
		}
		_this.buildGallery(columns);
	}

	this.buildGallery = function (columns) {
		var _this = this,
			galleryContainer = $('div#gallery'),
			galleryWidth = (columns * gallery.CALCULATED_IMAGE_WIDTH) + (gallery.CONSTANTS.MARGIN * (columns - 1));

		galleryContainer.width(galleryWidth);
		_this.arrangeGallery(galleryContainer, columns);
	}

	this.arrangeGallery = function (galleryContainer, columns) {
		var _this = this,
			colHeights = [],
			colCount = 0,
			image,
			$image,
			single,
			max,
			i;

		for (i = 0; i < columns; i++) {
			colHeights[i] = 0;
		}

		for (i = 0; i < _this.imagesArr.length; i++) {
			image = _this.imagesArr[i];
			$image = $('div#image-' + image.id);

			if ($image.length === 0) {
				$image = $(_.template($('#image-template').html())(_.extend(image, {
					src: 'http://placekitten.com/' + (((Math.floor(Math.random()*3) + 1) % 3 === 0) ? 'g/' : '') + image.width + '/' + image.height + '/'
				})));

				$image.find('a').bind('click', function (evt) {
					evt.preventDefault();

					alert('Woof!');
				});

				galleryContainer.append($image);
			}

			single = ($image.width() === gallery.CALCULATED_IMAGE_WIDTH);

			if ((colCount + ((single) ? 1 : 2)) > colHeights.length) {
				colCount = 0;
			}

			$image.css({
				left		: (colCount * (gallery.CALCULATED_IMAGE_WIDTH + gallery.CONSTANTS.MARGIN)) + 'px',
				top			: ((single) ? colHeights[colCount] : Math.max(colHeights[colCount], colHeights[colCount + 1])) + 'px',
				transform	: 'rotate(0)'
			});

			colHeights[colCount] += ($image.height() + gallery.CONSTANTS.MARGIN);
			if (!single) {
				colHeights[colCount + 1] += ($image.height() + gallery.CONSTANTS.MARGIN);
				max = Math.max(colHeights[colCount], colHeights[colCount + 1]);

				colHeights[colCount] = max;
				colHeights[colCount + 1] = max;	
			}

			if ((colCount === 0) || ((colHeights[colCount - 1] - colHeights[colCount]) <= gallery.CONSTANTS.GAP_THRESHOLD)) {
				colCount += ((single) ? 1 : 2);
			}
		}
		galleryContainer.height(Math.max.apply(_this, colHeights));
	}

	this.setupGallery();
}

global.handleScrollToTop = function (evt) {
	global.$scrollToTop.toggleClass('hidden', (global.$window.scrollTop() < global.$window.height()));
}

$(document).ready(function() {
	gallery = new Gallery(galleryImages);

	$(window).bind('resize', function () {
		gallery.setupGallery();
	});

	global.$scrollToTop = $('a#scrollToTop');
	global.$window = $(window);
	global.$page = $('body, html');

	$(window).bind('scroll', global.handleScrollToTop);

	global.$scrollToTop.bind('click', function (evt) {
		evt.preventDefault();
		
		global.$page.animate({
			scrollTop: 0
		}, 500);
	});
});