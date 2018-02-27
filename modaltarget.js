$(function(){
	var getComponent = function(){
		if(window._modal_component){
			var component = window._modal_component;
		}else{
			var Modal = Vue.component("modal");
			var component = new Modal().$mount();
			$(document.body).append(component.$el);
			window._modal_component = component;
		}

		$(component.$el).on('hidden.bs.modal', function (e) {
		  window._modal_component = undefined;
		  $(component.$el).remove();
		})

		$(component.$el).modal({});
		return component;
	}

	var getModal = function(el, ev, func){
		try{
			var next = function(){
				var target = el.attr('target');			
				var modal = false;
				var size = 'normal';
				var height = el.attr('modal-height')
				var width = el.attr('modal-width')
				if(target=='#modal-normal'){
					modal = true;
				}else if(target=='#modal'){
					modal = true;
				}else if(target=='#modal-large'){
					modal = true;
					size = 'large';
				}else if(target=='#modal-small'){
					modal = true;
					size = 'small';
				}else if(target=='#modal-custom'){
					modal = true;
				}

				if(modal){
					var component = getComponent();
					if(size=='large'){
						component.large = true;
					}else if(size=='small'){
						component.small = true;
					}
					if(height) $(component.$el).find('.modal-body').height(height+'px')
					if(width) $(component.$el).find('.modal-dialog').width(width+'px')
					component.loading = true;
					component.minH = '40vh';
					ev.stopPropagation();
			        ev.preventDefault();
					func(component);
					return true;
				}
				return false;
			}

			var confirm = el.attr('data-modal-confirm');
			if(confirm && !ev.originalEvent.confirmed){
				var win = getComponent();
				win.confirmMode = true;
				$(win.$refs.body).html('<h3 style="text-align:center">'+confirm+'</h3>');
				ev.stopPropagation();
		        ev.preventDefault();

		        $(win.$el).on('confirm', function(newEv){
					newEv.stopPropagation();

		        	$(win.$el).modal('hide');
		        	var processed = next();
		        	if(!processed){
						var event;
						if (document.createEvent) {
							event = document.createEvent("HTMLEvents");
							event.initEvent(ev.type, true, true);
						} else {
							event = document.createEventObject();
							event.eventType = ev.type;
						}

						event.confirmed = true;

						if (document.createEvent) {
							el[0].dispatchEvent(event);
						} else {
							el[0].fireEvent("on" + event.eventType, event);
						}
		        	}
		        })
			}else{
				next();
			}
		}catch(error){
			console.error(error);
		}
	}

	var modaltarget = function(el){
	  var that = this;
	  $(el).bind('submit', function(e){
	      var el = e.target;
	      if(el.tagName!='FORM'){
	        el = $(el).parents('form');
	        if(el.length==0){
	          return;
	        }
	      }
	      el = $(el);
	      getModal(el, e, function(modal){
			modal.title = el.attr('data-modal-title');
	        $.ajax({
	        	url: href,
	            method: el.attr('method'),
	            data: el.serialize()
	        }).done(function(ret){
	        	modal.loading = false;
	        	$(modal.$refs.body).html(ret);
	        });
	      });
	  });

	  $(el).bind('click', function(e){
	      var el = e.target;
	      if(e.target.className.indexOf('specialbtn')>=0){
      	      setTimeout(function(){
      	      	      var els = $(e.target).parents('form');
      	      	      getModal(els, e, function(modal){
      	      			modal.title = els.attr('data-modal-title');
      	      	        $.ajax({
      	      	        	url: href,
      	      	            method: els.attr('method'),
      	      	            data: els.serialize()
      	      	        }).done(function(ret){
      	      	        	modal.loading = false;
      	      	        	$(modal.$refs.body).html(ret);
      	      	        });
      	      	      });
      	      	  },300)
	      }else {
	      		if(el.tagName!='A'){
	      		  el = $(el).parents('a');
	      		}
	      		if(el.length!=0){
      		  	      el = $(el);
      		  	      var href = el.attr('href');
      		  	      var modal = getModal(el, e, function(modal){
      		  		      	modal.title = el.attr('data-modal-title');

      		  		        $.ajax({
      		  		        	url: href
      		  		        }).done(function(ret){
      		  		        	modal.loading = false;
      		  		        	$(modal.$refs.body).html(ret);
      		  		        });
      		  	      });
	      		 }
	  	        
	      }
	      
	  });
	}

	modaltarget($('#app'));
});