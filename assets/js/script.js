var global = {},
	gallery;

function Gallery(imagesArr) {
	var CONSTANTS = {
			SINGLE_WIDTH: 200,
			MARGIN: 20,
			BORDER: 1,
			GAP_THRESHOLD: 150
		};

	this.calculatedImageWidth = CONSTANTS.SINGLE_WIDTH + (CONSTANTS.BORDER * 2);
	this.imagesArr = imagesArr;
	this.galleryContainer = $('div#gallery');
	this.columnCount = 3;

	this.init = function () {
		var _this = this;

		//_this.imagesArr = _this.randomizeImages(_this.imagesArr);
		_this.determineColumns();
		_this.setupGalleryContainer();
		_this.arrangeGallery();
	}

	this.randomizeImages = function (imagesArr) {
		for(var j, x, i = imagesArr.length; i; j = Math.floor(Math.random() * i), x = imagesArr[--i], imagesArr[i] = imagesArr[j], imagesArr[j] = x);
		
		return imagesArr;
	}

	this.determineColumns = function () {
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

		_this.columnCount = columns;
	}

	this.setupGalleryContainer = function () {
		var _this = this,
			galleryWidth = (_this.columnCount * _this.calculatedImageWidth) + (CONSTANTS.MARGIN * (_this.columnCount - 1));

		_this.galleryContainer.width(galleryWidth);
	}

	this.createImage = function (image) {
		var _this = this,
			$image = $('div#image-' + image.id);

		if ($image.length === 0) {
			$image = $(_.template($('#image-template').html())(_.extend(image, {
				src: 'http://placekitten.com/' + (((Math.floor(Math.random() * 3) + 1) % 3 === 0) ? 'g/' : '') + image.width + '/' + image.height + '/'
			})));

			$image.find('a').bind('click', function (evt) {
				evt.preventDefault();

				alert('Woof!');
			});

			_this.galleryContainer.append($image);
		}

		return $image;
	}

	this.arrangeGallery = function () {
		var _this = this,
			colHeights = [],
			colCount = 0,
			image,
			$image,
			isSingle,
			max,
			i;

		for (i = 0; i < _this.columnCount; i++) {
			colHeights[i] = 0;
		}

		for (i = 0; i < _this.imagesArr.length; i++) {
			image = _this.imagesArr[i];
			$image = _this.createImage(image);

			isSingle = ($image.width() === _this.calculatedImageWidth);

			if ((colCount + ((isSingle) ? 1 : 2)) > colHeights.length) {
				colCount = 0;
			}

			$image.css({
				left		: (colCount * (_this.calculatedImageWidth + CONSTANTS.MARGIN)) + 'px',
				top			: ((isSingle) ? colHeights[colCount] : Math.max(colHeights[colCount], colHeights[colCount + 1])) + 'px',
				transform	: 'rotate(0)'
			});

			colHeights[colCount] += ($image.height() + CONSTANTS.MARGIN);
			if (!isSingle) {
				colHeights[colCount + 1] += ($image.height() + CONSTANTS.MARGIN);
				max = Math.max(colHeights[colCount], colHeights[colCount + 1]);

				colHeights[colCount] = max;
				colHeights[colCount + 1] = max;	
			}

			if ((colCount === 0) || ((colHeights[colCount - 1] - colHeights[colCount]) <= CONSTANTS.GAP_THRESHOLD)) {
				colCount += ((isSingle) ? 1 : 2);
			}
		}

		_this.galleryContainer.height(Math.max.apply(_this, colHeights));
	}

	this.init();
}

global.handleScrollToTop = function (evt) {
	global.$scrollToTop.toggleClass('hidden', (global.$window.scrollTop() < global.$window.height()));
}

$(document).ready(function() {
	global.$scrollToTop = $('a#scrollToTop');
	global.$window = $(window);
	global.$page = $('body, html');

	gallery = new Gallery(galleryImages);
	$(window).bind('resize', function () {
		gallery.init();
	});

	$(window).bind('scroll', global.handleScrollToTop);

	global.$scrollToTop.bind('click', function (evt) {
		evt.preventDefault();

		global.$page.animate({
			scrollTop: 0
		}, 500);
	});
});