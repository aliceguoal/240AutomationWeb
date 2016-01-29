function drawTrend(chiller, title, item, unit){
	$('.content-header > h1 > small').text(chiller + " " + title);
	$('.row').html('');
	clearInterval(repeat);
	jQuery.ajax({
		url: 'TrendServlet?chiller='+chiller+'&item='+item,
		success: function(json){
			var data = json.data;
			data.forEach(function(d) {
				d.time = d3.time.format("%Y-%m-%d %H:%M:%S").parse(d.time.substring(0,19));
				d.y = +d.y;
			});
//			if(json.avg != null)
//				addEntry(color(title), Math.round(+json.avg*100)/100, unit, 'Average '+title.substring(0, title.length - 6), '', null);
//			if(json.outlier_per != null)
//				addEntry(color(title+'outlier'), Math.round(+json.outlier_per*100)/100, '%', title.substring(0, title.length - 6)+' Outlier', '', null)
//			
			var margin = {top: 20, right: 50, bottom: 20, left: 70},
		    width = 960 - margin.left - margin.right,
		    height = 600 - margin.top - margin.bottom;
			
			var box = d3.select('.content').select('.row')
			.append('div').attr('class', 'col-md-12 col-sm-12 col-xs-12')
			.append('div').attr('class','box');
			box.append('div')
			.attr('class','box-header with-border')
			.append('h3')
			.attr('class','box-title')
			.attr('id', chiller + '_' + item)
			.text(title);
			var content = box.append('div')
			.attr('class','box-body')
			.append('div');
			
			var x = d3.time.scale()
			    .range([0, width]);
			x.domain([
			          d3.min(data, function(d) { return d.time; }),
			          d3.max(data, function(d) { return d.time; })
			]);
	
			var y = d3.scale.linear()
			    .range([height, 0]);
		
			y.domain([
			  	    d3.min(data, function(d) { return d.y; }),
			  	    d3.max(data, function(d) { return d.y; })
			]);
	
			var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom")
			.ticks(d3.time.hours, 1)
			.tickFormat(d3.time.format('%H:%M'));
	
			var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")
			.tickFormat(function(d){
				if(item == 'heatbalance')
					return Math.round(d * 100)+'%';
				else
					return d;
			});
	
//			var line = d3.svg.line()
//			    .x(function(d, i) { return x(d.time); })
//			    .y(function(d, i) { return y(d.y); });
	
	
			var svg = content.append("svg")
				.attr("xmlns","http://www.w3.org/2000/svg")
			    .attr("width", "100%")
			    .attr("height", "100%")
			    .attr("viewBox", "0 0 "+ (width + margin.left + margin.right) + " "+(height + margin.top + margin.bottom))
			  .append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
//			var chartBody = svg.append("g").attr("clip-path", "url(#clip)");
//	
//			chartBody.append("path")
//			.attr("class","line").attr("d", line(data))
//			.style("stroke", color(item));
			
			svg.append("g")         
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);
			svg.append("g")         
			.attr("class", "y axis")
			.call(yAxis);
			
			svg.selectAll('.dot').data(data).enter()
			.append("circle")
			.attr("r", 1.5)
			.attr("cx", function(d){ 
				return x(d.time)})
			.attr("cy", function(d){ return y(d.y)})
			.style("fill", color(title))
			.on('mouseover', function(d){
				svg.append('text').attr('class', 'popup')
				.attr('x',  x(d.time))
				.attr('y', y(d.y))
				.text(function(){
					if(item == 'heatbalance')
						return Math.round(d.y*10000)/100+'%';
					else
						return Math.round(d.y*100)/100;
					}
				);
			}).on('mouseleave', function(d){
				svg.select('.popup').remove();
			});
		}
	});
}
