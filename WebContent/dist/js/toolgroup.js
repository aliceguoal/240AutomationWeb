function refreshToolGroup(name){
	console.log('toolgroup ' + name);
	$('.content-header > h1 > small').text(name);
	$('.row.waste').html('');
	$('.row.consumption').html('');
	
	$.getJSON('ToolGroupConsumptionServlet?toolgroup=' + name + '&range=' + start + " to " + end, function(data){
		var color = d3.scale.category10();
		var piemargin = {top: 20, right: 20, left: 20, bottom: 20};
	    var piesize = {width:500 - piemargin.left - piemargin.right,
	    			height:500 - piemargin.top - piemargin.bottom};
		var barmargin = {top: 20, right: 20, left: 20, bottom: 20};
	    var barsize = {width:500 - barmargin.left - barmargin.right,
	    			height:250 - barmargin.top - barmargin.bottom};
	    var r = Math.min(piesize.height, piesize.width)/2;
	    
	    var con_row = d3.select('.row.consumption'), waste_row = d3.select('.row.waste');
	    
	    buildConsumptionRow();
	    buildWasteRow();
	    function buildConsumptionRow(){
			var pieData = data.tools.map(function(d){
				return {name: d.tool.name, value: d.total_consumption}
			});
	
			var piesvg = con_row.append('div').attr('class','col-md-4 col-xs-12').append("svg")
					    .attr("xmlns","http://www.w3.org/2000/svg")
						.attr("width", "100%").attr("height", "100%")
						.attr("viewBox", "0 0 "+ (piesize.width + piemargin.top + piemargin.bottom) + " "+(piesize.height + piemargin.top + piemargin.bottom))
						.append("g")
						.attr("transform", "translate("+(r+piemargin.left)+","+(r+piemargin.top)+")"); 
			var barsvg = con_row.append('div').attr('class','col-md-8 col-xs-12').append("svg")
					    .attr("xmlns","http://www.w3.org/2000/svg")
						.attr("width", "100%").attr("height", "100%")
						.attr("viewBox", "0 0 "+ (barsize.width + barmargin.top + barmargin.bottom) + " "+(barsize.height + barmargin.top + barmargin.bottom))
						.append("g")
						.attr("transform", "translate(" + barmargin.left + "," + barmargin.top + ")"); 
			
			var label_height = (r-50)/(pieData.length+1); //r-50 is innerR, only take the middle half; +1 for total
			var start_y = - (r-50)/2;
			piesvg.selectAll("text").data(pieData).enter()
				.append("text")
				.attr('class', 'legend')
				.attr("text-anchor", "middle")
				.style("font-size", "200%")
				.attr('y', function(d,i){
					return start_y + (i+1) * label_height
				})
				.style('fill', function(d) { return color(d.name)})
				.style("alignment-baseline", "middle")
				.text(function(d){
					return d.name + ": " + Math.round(100*d.value)/100
				});
			piesvg.append("text")
				.attr("text-anchor", "middle")
				.attr('class', 'total')
				.style("font-size", "200%")
				.attr('y', start_y)
				.style("alignment-baseline", "middle")
				.text("Total: " + Math.round(100*data.total_consumption)/100);
			
			var arc = d3.svg.arc().outerRadius(r - 10).innerRadius(r - 50);
			var pie = d3.layout.pie().sort(null).value(function(d){ return d.value});
	
			piesvg.selectAll("path").data(pie(pieData)).enter()
				.append("path")
				.attr("class", "arc")
				.attr("d", arc)
				.each(function(d){this._current = d})
				.style("fill", function(d){
					return color(d.data.name)})
				.on("mouseover",function(d){
					var tool = null;
					data.tools.forEach(function(t){
						if(t.tool.name == d.data.name)
							tool = t;
					})
					var tempData = barData.map(function(v){
						return {name:v.name, value: tool.mes_consumption[v.name].consumption}});
					updateBar(tempData, color(d.data.name));
				})
				.on("mouseout", function(d){
					updateBar(barData, 'steelblue');
				});
	
			
			var keys = Object.keys(data.mes_consumption);
			var barData = [];
			
			for(var i in keys){
				barData.push({name: keys[i], value: data.mes_consumption[keys[i]].consumption});
			}
			var x = d3.scale.ordinal().rangeRoundBands([0, barsize.width], 0.1)
		    .domain(barData.map(function(d) { return d.name; }));
	
			barsvg.append("g").attr("class", "x axis")
			.attr("transform", "translate(0," + barsize.height + ")")
			.call(d3.svg.axis().scale(x).orient("bottom"));
			
			var y = d3.scale.linear().range([barsize.height, 0])
			    .domain([0, d3.max(barData, function(d) { 
			    	return d.value; })]);
			
			var bars = barsvg.selectAll(".bar").data(barData).enter();
			bars.append("rect").attr("class", "bar")
				.style('fill', 'steelblue')
			    .attr("x", function(d){ return x(d.name)})
			    .attr("y", function(d){ return y(d.value)})
			    .attr("width", x.rangeBand())
			    .attr("height", function(d){ return barsize.height - y(d.value)})
			    .on("mouseover", function(d){
			    	var tempData = data.tools.map(function(t){
			    		if(t.mes_consumption[d.name] == null)
			    			return {name: t.tool.name, value: 0};
		    			else
		    				return {name: t.tool.name, value: t.mes_consumption[d.name].consumption};
					});
			    	updatePie(tempData);
			    	d3.select(this).style("fill", "brown");
			    })
			    .on("mouseout", function(d){
			    	updatePie(pieData);
			    	d3.select(this).style("fill", "steelblue");
			    });
			bars.append("text").attr("class", "text")
			  .attr("x", function(d){ return x(d.name)+x.rangeBand()/2;})
			  .attr("y", function(d){return y(d.value)-5;})
			  .attr("text-anchor", "middle").text(function(d){ return d3.format(",")(Math.round(100*d.value)/100);});
		
			function updatePie(d){
				piesvg.selectAll("path").data(pie(d)).transition().duration(500).attrTween("d", function(a){
					var i = d3.interpolate(this._current, a);
					this._current = i(0);
					return function(t){ return arc(i(t))};
				});
				piesvg.selectAll(".legend").data(d).text(function(v){return v.name + ": " + Math.round(100*v.value)/100});
				
				var total = 0;
				d.forEach(function(v){
					total += v.value;
				})
				piesvg.select(".total").text("Total: " + Math.round(100*total)/100);
			}
			function updateBar(d, c){
		        y.domain([0, d3.max(d, function(v) { return v.value; })]);
	
		        var bars = barsvg.selectAll(".bar").data(d);
	
		        bars.transition().duration(500)
		            .attr("y", function(v) {
		            	return y(v.value); })
		            .attr("height", function(v) { return barsize.height - y(v.value); })
		            .style("fill", c);
	
		        // transition the frequency labels location and change value.
		        barsvg.selectAll(".text").data(d).transition().duration(500)
		            .text(function(v){ return d3.format(",")(Math.round(100*v.value)/100)})
		            .attr("y", function(v) {return y(v.value)-5; }); 
			}
	    }
	    
	    function buildWasteRow(){
			var pieData = data.tools.map(function(d){
				return {name: d.tool.name, value: d.total_waste}
			});

			var piesvg = waste_row.append('div').attr('class','col-md-4 col-xs-12').append("svg")
					    .attr("xmlns","http://www.w3.org/2000/svg")
						.attr("width", "100%").attr("height", "100%")
						.attr("viewBox", "0 0 "+ (piesize.width + piemargin.top + piemargin.bottom) + " "+(piesize.height + piemargin.top + piemargin.bottom))
						.append("g")
						.attr("transform", "translate("+(r+piemargin.left)+","+(r+piemargin.top)+")"); 
			var barsvg = waste_row.append('div').attr('class','col-md-8 col-xs-12').append("svg")
					    .attr("xmlns","http://www.w3.org/2000/svg")
						.attr("width", "100%").attr("height", "100%")
						.attr("viewBox", "0 0 "+ (barsize.width + barmargin.top + barmargin.bottom) + " "+(barsize.height + barmargin.top + barmargin.bottom))
						.append("g")
						.attr("transform", "translate(" + barmargin.left + "," + barmargin.top + ")"); 
			
			var label_height = (r-50)/(pieData.length+1); //r-50 is innerR, only take the middle half; +1 for total
			var start_y = - (r-50)/2;
			piesvg.selectAll("text").data(pieData).enter()
				.append("text")
				.attr('class', 'legend')
				.attr("text-anchor", "middle")
				.style("font-size", "200%")
				.attr('y', function(d,i){
					return start_y + (i+1) * label_height
				})
				.style('fill', function(d) { return color(d.name)})
				.style("alignment-baseline", "middle")
				.text(function(d){
					return d.name + ": " + Math.round(100*d.value)/100
				});
			piesvg.append("text")
				.attr("text-anchor", "middle")
				.attr('class', 'total')
				.style("font-size", "200%")
				.attr('y', start_y)
				.style("alignment-baseline", "middle")
				.text("Total: " + Math.round(100*data.total_waste)/100);
			
			var arc = d3.svg.arc().outerRadius(r - 10).innerRadius(r - 50);
			var pie = d3.layout.pie().sort(null).value(function(d){ return d.value});
	
			piesvg.selectAll("path").data(pie(pieData)).enter()
				.append("path")
				.attr("class", "arc")
				.attr("d", arc)
				.each(function(d){this._current = d})
				.style("fill", function(d){
					return color(d.data.name)})
				.on("mouseover",function(d){
					var tool = null;
					data.tools.forEach(function(t){
						if(t.tool.name == d.data.name)
							tool = t;
					})
					var tempData = barData.map(function(v){
						return {name:v.name, value: tool.mes_consumption[v.name].waste}});
					updateBar(tempData, color(d.data.name));
				})
				.on("mouseout", function(d){
					updateBar(barData, 'steelblue');
				});
	
			
			var keys = Object.keys(data.mes_consumption);
			var barData = [];
			
			for(var i in keys){
				barData.push({name: keys[i], value: data.mes_consumption[keys[i]].waste});
			}
			var x = d3.scale.ordinal().rangeRoundBands([0, barsize.width], 0.1)
		    .domain(barData.map(function(d) { return d.name; }));
	
			barsvg.append("g").attr("class", "x axis")
			.attr("transform", "translate(0," + barsize.height + ")")
			.call(d3.svg.axis().scale(x).orient("bottom"));
			
			var y = d3.scale.linear().range([barsize.height, 0])
			    .domain([0, d3.max(barData, function(d) { 
			    	return d.value; })]);
			
			var bars = barsvg.selectAll(".bar").data(barData).enter();
			bars.append("rect").attr("class", "bar")
				.style('fill', 'steelblue')
			    .attr("x", function(d){ return x(d.name)})
			    .attr("y", function(d){ return y(d.value)})
			    .attr("width", x.rangeBand())
			    .attr("height", function(d){ return barsize.height - y(d.value)})
			    .on("mouseover", function(d){
			    	var tempData = data.tools.map(function(t){
			    		if(t.mes_consumption[d.name] == null)
			    			return {name: t.tool.name, value: 0};
		    			else
		    				return {name: t.tool.name, value: t.mes_consumption[d.name].waste};
					});
			    	updatePie(tempData);
			    	d3.select(this).style("fill", "brown");
			    })
			    .on("mouseout", function(d){
			    	updatePie(pieData);
			    	d3.select(this).style("fill", "steelblue");
			    });
			bars.append("text").attr("class", "text")
			  .attr("x", function(d){ return x(d.name)+x.rangeBand()/2;})
			  .attr("y", function(d){return y(d.value)-5;})
			  .attr("text-anchor", "middle").text(function(d){ return d3.format(",")(Math.round(100*d.value)/100);});
		
			function updatePie(d){
				piesvg.selectAll("path").data(pie(d)).transition().duration(500).attrTween("d", function(a){
					var i = d3.interpolate(this._current, a);
					this._current = i(0);
					return function(t){ return arc(i(t))};
				});
				piesvg.selectAll(".legend").data(d).text(function(v){return v.name + ": " + Math.round(100*v.value)/100});
				
				var total = 0;
				d.forEach(function(v){
					total += v.value;
				})
				piesvg.select(".total").text("Total: " + Math.round(100*total)/100);
			}
			function updateBar(d, c){
		        y.domain([0, d3.max(d, function(v) { return v.value; })]);
	
		        var bars = barsvg.selectAll(".bar").data(d);
	
		        bars.transition().duration(500)
		            .attr("y", function(v) {
		            	return y(v.value); })
		            .attr("height", function(v) { return barsize.height - y(v.value); })
		            .style("fill", c);
	
		        // transition the frequency labels location and change value.
		        barsvg.selectAll(".text").data(d).transition().duration(500)
		            .text(function(v){ return d3.format(",")(Math.round(100*v.value)/100)})
		            .attr("y", function(v) {return y(v.value)-5; }); 
			}
	    }
	});


}
