			var $body = $('body');					
			
			
			//toggle menu
			var menuToggle = $('header .burger');
				menuToggle.click(function(event) {
					event.preventDefault();
					$body.toggleClass('nav-active');
				});
			
			//carousel
			$('.fyre-carousel').owlCarousel({
				loop:				true,
				margin:				32,
				items:				1,
				responsiveClass:	true,
				responsive:{
					0:{
						dots:		true,
						nav:		false
					},
					768:{
						dots:		false,
						nav:		true
					}
				}
			});

			
			var isMobile = $('video').is(':not(:visible)');
			//console.log('mobile:', isMobile)
			
			//modal
			var $modal = $('.overlay');

				$modal.on('click', function(e){
					$modal.trigger('close');
				})
				$modal.find('.modal-box').on('click', function(e){
					e.stopPropagation();
				})
				$modal.find('.close').on('click', function(e){
					e.preventDefault();
					$modal.trigger('close');
				})
                $(document).keyup(function(e) {
                  if (e.keyCode == 27) { // escape key maps to keycode `27`
                    $modal.trigger('close');
                  }
                });
				$modal.on('close', function(e){
					$body.removeClass('noScroll');
					$modal.removeClass('active');
					
					var $target = $modal.find('.content.active');
						$target.removeClass('active');
						
					if($target.find('form')[0]){
						$body.removeClass('noScroll-form');
					}
					
					if($target.hasClass('video')){
						var $iframe = $target.find('iframe');
						$iframe.data('player').pause();
					}
					
					if($modal.data('style')){
						$modal.removeClass($modal.data('style'));
						$modal.data('style', null);
					}
					
					$(window).scrollTop($modal.data('pos'));
					
					delayCookieModal();
					
				})
				$modal.on('open', function(e, target, style){
					clearTimeout(modalTimer);
					
					console.log(target)
					console.log(style)

					$modal.data('pos', $(window).scrollTop());
					
					if(style){
						$modal.addClass(style);
						$modal.data('style', style);
					}
					
					$body.addClass('noScroll');
					$modal.addClass('active');
					
					var $target = $modal.find('#'+target);
					
					if($target.find('form')[0]){
						$body.addClass('noScroll-form');
					}
					
					$target.addClass('active');
					
					if($target.hasClass('video')){
						var $iframe = $target.find('iframe');
						
						if(!$iframe.data('player')){
							$iframe.data('player', new Vimeo.Player($iframe));
						}
						
						$iframe.data('player').play();
							//$iframe.data('src', $iframe.attr('src'));
							//$iframe.attr('src', $iframe.attr('src')+'&autoplay=1');
					}
				})
			
			$('[data-modal]').on('click', function(e){
				e.preventDefault();
				
				var $this = $(this);
				$modal.trigger('open', [$this.attr('data-modal'), $this.attr('data-modal-style')]);
			})
			
			
			//cookie
			var modalCookie = Cookies.get('modal'),
				modalTimer = 0;
				
			var infoModal = function(){
				$modal.trigger('open', 'auto');
				Cookies.set('modal', true);
				modalCookie = Cookies.get('modal');
			}
			
			var delayCookieModal = function(){
				if($modal.find('#auto')[0]){
					if(!modalCookie){
						modalTimer = setTimeout(infoModal, 3*1000);
					}
				}
			}
			delayCookieModal();
			
			//videos
			$modal.find('.video').each(function(){
				var $iframe = $(this).find('iframe');
				if(!$iframe.data('player')){
					$iframe.data('player', new Vimeo.Player($iframe));
				}
			})

			//ios kill scroll
			var killTouchScroll = $('.killTouchScroll');
			killTouchScroll.on('touchmove', function(e){ 
				e.preventDefault();
			});
			
			var controller = new ScrollMagic.Controller();
				controller.scrollTo(function (newpos) {
					TweenMax.to(window, 1, {scrollTo: {y: newpos}, ease:Quint.easeOut});
				});
			
			//navigation
			$('a[href^="#"]').on('click', function(e){
				var id = $(this).attr('href');
				if($(id)[0]){
					$body.removeClass('nav-active');
					if(!isMobile){
						e.preventDefault();
						controller.scrollTo(id);
					}
				}
			})

			
			$('section').each(function(num){
				//console.log(this)
				var $section = $(this);
					
				//pagination
				new ScrollMagic.Scene({
					triggerElement: $section[0],
					triggerHook: 0.25,
					duration: function(){return $section.outerHeight()}
				})
				.setClassToggle($('.nav-pagination li a[href="#'+$section.attr('data-section')+'"]').parent()[0], 'active')
				//.addIndicators({name: 'dots: '+$section.attr('class')})
				.addTo(controller);
					
				
				if($section.attr('data-fade') != undefined){
					
					var fadeTimeline = new TimelineMax();
					
					$section.find('.page-width .col, .page-width .col-top, .page-width .col-bottom').children().each(function(){
						fadeTimeline.add(TweenMax.fromTo($(this), 0.25, {opacity:0}, {opacity:1, ease:Quint.easeIn}), '-=0.3');
					})
					
					new ScrollMagic.Scene({
						triggerElement: $section[0],
						triggerHook: 0.75,
						duration: 0
					})
					.setTween(fadeTimeline)
					//.addIndicators({name: 'fade: '+$section.attr('class')})
					.addTo(controller);
				}
				
				if($section.attr('data-nav') == 'blue'){
					
					new ScrollMagic.Scene({
						triggerElement: $section[0],
						triggerHook: 0.01,
						duration: function(){return $section.outerHeight()}
					})
					.setClassToggle($('header')[0], 'header-blue')
					//.addIndicators({name: 'nav: '+$section.attr('class')})
					.addTo(controller);
					
					//sceneNav.setClassToggle($('header')[0], 'header-blue');
				}
				
				if($section.attr('id') == 'journey'){
					
					var $svg = $section.find('svg path').eq(1);
					//console.log($svg[0])
						$svg.css("stroke-dasharray", 10);
						$svg.css("stroke-dashoffset", $svg[0].getTotalLength());
					
					new ScrollMagic.Scene({
						triggerElement: $section[0],
						triggerHook: 1,
						duration: function(){return $section.outerHeight()+$(window).height()}
					})
					.setTween(TweenMax.to($svg, 0.25, {strokeDashoffset: 0, ease:Linear.easeNone}))
					.addTo(controller);
				}
				
				
				$section.find('[data-fade]').each(function(){
					var $this = $(this);
					//console.log(this)
					new ScrollMagic.Scene({
						triggerElement: $section[0],
						triggerHook: 0.75,
						duration: 0
					})
					.setTween(TweenMax.fromTo($(this), 0.5, {opacity:0}, {opacity:1, ease:Quint.easeIn, delay:$this.attr('data-fade')||0}))
					.addTo(controller);
				})
				
				$section.find('[data-parallax-start]').each(function(){
					var $this = $(this);
					//console.log(this)
					new ScrollMagic.Scene({
						triggerElement: $section[0],
						triggerHook: 'onEnter',
						duration: function(){return $section.outerHeight()+$(window).height()}
					})
					.setTween(TweenMax.fromTo($this, 0.25, {y:$this.attr('data-parallax-start'), x:$this.attr('data-parallax-x-start')||0}, {y:$this.attr('data-parallax-end'), x:$this.attr('data-parallax-x-end')||0, ease:Linear.easeNone}))
					.addTo(controller);
				})
				
				
				//start / stop video
				$section.find('video').each(function(){
					//console.log('video')
					var $video = this,
						timer = 0;

						
						new ScrollMagic.Scene({
							triggerElement: $section[0],
							triggerHook: 'onEnter',
							duration: function(){return $section.outerHeight()+$(window).height()}
						})
						.addTo(controller)
						//.addIndicators()
						.on('enter', function(e){
							//console.log('start video')
							clearTimeout(timer);
							timer = setTimeout(function(){$video.currentTime = 0;$video.play();},150);
						})
						.on('leave', function(e){
							//console.log('stop video')
							clearTimeout(timer);
							$video.pause();
							$video.currentTime = 0;
						});

					
				})
			})

      //  FAQ accordion
      var accordion_target = $('.faq__title');
      accordion_target.click(function(){

        var $active = $(this).closest('.faq__item');


        if ($active.hasClass('faq-is-active')){
          $active.removeClass('faq-is-active');
        } else {
          $active.addClass('faq-is-active');
        }

        $(this).siblings(".faq__body").slideToggle(400);
      });
