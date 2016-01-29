//$('.messages-menu').on('click', function(){
//	$('.messages-menu .menu li').remove();
//	$.getJSON("ParameterServlet", function(data){
//		data.forEach(function (d) {
//		    var item =  $('<li>');
////		    item.append('<i class="fa fa-cog"></i>');
//		    item.append('<span class="config-name">'+d.name+'</span>');
//		    item.append('<input class="config-input" id="'+d.id+'" type="text" value="'+d.value+'"/>')
//		    item.append('<i title="" class="fa fa-exclamation-triangle text-yellow warning"></i')
//		    item.appendTo('.messages-menu .menu');
//		});
//		$('.config-input').on('click',function(e){
//			 e.stopPropagation();
//		})
//	})
//
//});
//
//$('.messages-menu .footer').on('click', function(e){
//	var items = [];
//	var pass = true;
//	$('.messages-menu .menu li').each(function(i, d){
//		var id = $(d).find('.config-input').attr('id');
//		var value = $(d).find('.config-input').val().trim();
//		
//		if(!jQuery.isNumeric(value)){
//			$(d).find('.warning').css('display','inline-block');
//			$(d).find('.warning').attr('title', 'The input should be numeric');
//			pass = false;
//		}else if(value <= 0){
//			$(d).find('.warning').css('display','inline-block');
//			$(d).find('.warning').attr('title', 'The input should be greater than 0');
//			pass = false;
//		}else{
//			$(d).find('.warning').css('display','none');
//			items.push({id: id, value: value});
//		}
//			
//	});
//	console.log(items);
//	if(pass){
//		$.ajax({
//	        url: "ParameterServlet",
//	        type: 'POST',
//	        dataType: 'json',
//	        data: JSON.stringify(items),
//	        contentType: 'application/json',
//	        mimeType: 'application/json',
//	 
//	        success: function (data) {
//	        	alert('success');
//	        },
//	        error:function(data,status,er) {
//	            if(data.status == 400){
//	            	alert(data.responseText);
//	            }else{
//	            	console.log(data.responseText);
//	            }
//	        }
//	    });
//	}else{
//		e.stopPropagation();
//	}
//})