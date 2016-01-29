	var title = "Plant Daily Summary";
	var color = d3.scale.ordinal()
				.range(["#7cb5ec", "#f7a35c", "#90ee7e", "#7798BF",  "#eeaaee",
      "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"]);
	$('.content-header > h1 > small').text(title);
	var margin = {top: 20, right: 150, bottom: 80, left: 80},
    width = 960 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom,
    height1 = height/4, height2 = height - height1;
	
	var box = d3.select('.content').select('.row')
	.append('div').attr('class', 'col-md-12 col-sm-12 col-xs-12')
	.append('div').attr('class','box');
	var box_header = box.append('div')
					.attr('class','box-header with-border');
	box_header.append('h3')
			.attr('class','box-title')
			.attr('id', 'plantsummary')
			.text(title);
	box_header.append('div').attr("class", "date-picker")
				.style("display", "inline")
				.html(" DateRange: <input type=\"text\" id=\"daterange\"> <button id=\"datepickersubmit\" type=\"submit\">Submit</button>");
	$('#daterange').val(moment().add(-7, 'days').format('YYYY-MM-DD') + " to " + moment().add(-1, 'days').format('YYYY-MM-DD'));
	$('#daterange').dateRangePicker({
		endDate: moment().add(-1, 'days').format('YYYY-MM-DD'),
		showWeekNumbers: true,
		showShortcuts: true,
		shortcuts : 
		{
			'prev-days': [7, 10, 30],
			'prev': ['week','month','year']
		}
	});
	drawTrend($('#daterange').val());
	$('#datepickersubmit').click(function(){
		drawTrend($('#daterange').val());
	});
	
	function drawTrend(range){
		box.select(".box-body").remove();
		box.select(".table").remove();
		jQuery.ajax({
			url: 'DailySumTrendServlet?range='+range,
			success: function(data){
				var baseline = [0, 0, 0, 0, 0, 0];
				var tableData = [], weatherData = [];
				data.forEach(function(d) {
					d.group = [];
					var base = 0;
					
					if(baseline[0] == 0)
						tableData.push({date:d.date, total_pc: 0, CH_pc: 0, CHWPP_pc: 0, CWP_pc: 0, CT_pc: 0, ZP_AHM_pc:0});
					else
						tableData.push({date: d.date,
										total_pc: d.total_power_consumption/baseline[0] - 1,
						                CH_pc: d.CH_power_consumption/baseline[1] - 1,
						                CHWPP_pc: d.CHWPP_power_consumption/baseline[2] - 1,
						                CWP_pc: d.CWP_power_consumption/baseline[3] - 1,
						                CT_pc: d.CT_power_consumption/baseline[4] - 1,
						                ZP_AHM_pc: d.ZP_AHM_power_consumption/baseline[5] - 1
						});
					
					d.total_power_consumption = +d.total_power_consumption;
					d.total_power_consumption = Math.round(d.total_power_consumption*100)/100;
					baseline[0] = d.total_power_consumption;
					
					d.CH_power_consumption = +d.CH_power_consumption;
					d.CH_power_consumption = Math.round(d.CH_power_consumption*100)/100;
					d.group.push({name: "CH kwh", value: d.CH_power_consumption, base: base});
					base += d.CH_power_consumption;
					baseline[1] = d.CH_power_consumption;
					
					d.CHWPP_power_consumption = +d.CHWPP_power_consumption;
					d.CHWPP_power_consumption = Math.round(d.CHWPP_power_consumption*100)/100;
					d.group.push({name: "CHWPP kwh", value: d.CHWPP_power_consumption, base: base});
					base += d.CHWPP_power_consumption;
					baseline[2] = d.CHWPP_power_consumption;
					
					d.CWP_power_consumption = +d.CWP_power_consumption;
					d.CWP_power_consumption = Math.round(d.CWP_power_consumption*100)/100;
					d.group.push({name: "CWP kwh", value: d.CWP_power_consumption, base: base});
					base += d.CWP_power_consumption;
					baseline[3] = d.CWP_power_consumption;
					
					d.CT_power_consumption = +d.CT_power_consumption;
					d.CT_power_consumption = Math.round(d.CT_power_consumption*100)/100;
					d.group.push({name: "CT kwh", value: d.CT_power_consumption, base: base});
					base += d.CT_power_consumption;
					baseline[4] = d.CT_power_consumption;
					
					d.ZP_AHM_power_consumption = +d.ZP_AHM_power_consumption;
					d.ZP_AHM_power_consumption = Math.round(d.ZP_AHM_power_consumption*100)/100;
					d.group.push({name: "ZP&AHU kwh", value: d.ZP_AHM_power_consumption, base: base});
					base += d.ZP_AHM_power_consumption;
					baseline[5] = d.ZP_AHM_power_consumption;
					
					if(d.wetbulb != 0 || d.drybulb != 0)
						weatherData.push({date: d.date, wetbulb: d.wetbulb, drybulb: d.drybulb});
				});
				
				var content = box.append('div')
				.attr('class','box-body')
				.append('div');
				
				var x = d3.scale.ordinal()
				    .rangeRoundBands([0, width], .1);
				x.domain(data.map(function(d) { return d.date;}));
		
				var y1 = d3.scale.linear()
				    .range([height2, 0]);
			
				y1.domain([
				  	    0,
				  	    d3.max(data, function(d) { return d.total_power_consumption; })
				]);
				
				var y2 = d3.scale.linear()
						 .range([height1, 0]);
				
				y2.domain([d3.min(weatherData, function(d) { return Math.min(d.wetbulb, d.drybulb)}),
				           d3.max(weatherData, function(d) { return Math.max(d.wetbulb, d.drybulb)})]);
		
				var xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom");
		
				var yAxis1 = d3.svg.axis()
				.scale(y1)
				.orient("left");
				var yAxis2 = d3.svg.axis()
				.scale(y2)
				.orient("left");
		
		
				var svg = content.append("svg")
					.attr("xmlns","http://www.w3.org/2000/svg")
				    .attr("width", "100%")
				    .attr("height", "100%")
				    .attr("viewBox", "0 0 "+ (width + margin.left + margin.right) + " "+(height + margin.top + margin.bottom))
				  .append("g")
				    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
				//axis
				svg.append("g")         
					.attr("class", "x axis")
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis);
				if(data.length > 10){
					svg.select(".x.axis").selectAll("text")
					.style("text-anchor", "end")
		            .attr("dx", "-.8em")
		            .attr("dy", ".15em")
					.attr("transform", function(){if(data.length <= 10) return null; else return "rotate(-65)"});
				}

				svg.append("g") 
				.attr("transform", "translate(0," + height1 + ")")
				.attr("class", "y axis")
				.call(yAxis1);
				svg.append("g") 
				//.attr("transform", "translate(0," + height1 + ")")
				.attr("class", "y axis")
				.call(yAxis2);
				
				//yLabel
				svg.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", 0 - margin.left)
					.attr("x", (0 - (height1 / 2)))
					.attr("dy", "1em")
					.style("text-anchor", "middle")
					.text("Weather (℃)");
				svg.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", 0 - margin.left)
					.attr("x", (0 - height1 - (height2 / 2)))
					.attr("dy", "1em")
					.style("text-anchor", "middle")
					.text("Power Consumption (kWh)");
				
				//bar chart
				data.forEach(function(v){
					var display = "daily avg cop: " + Math.round(v.daily_cop * 100)/100 + "\n"
									+ "active time: " + v.active_time + " min \n"
									+ "saving: " + ((v.saving == -1)?"null":Math.round(v.saving * 100)/100 + " kWh") + "\n"
									+ "total power consumption: " + v.total_power_consumption + " kWh \n"
									+ "CH power consumption: " + v.CH_power_consumption + " kWh \n"
									+ "CHWPP power consumption: " + v.CHWPP_power_consumption + " kWh \n"
									+ "CWP power consumption: " + v.CWP_power_consumption + " kWh \n"
									+ "CT power consumption: " + v.CT_power_consumption + " kWh \n"
									+ "ZP&AHU power consumption: " + v.ZP_AHM_power_consumption + " kWh \n";
					var bar = svg.selectAll(".date"+v.date+".bar").data(v.group).enter();
					bar.append("rect")
						.attr("class", "date" + v.date + " bar")
						.attr("x", function(d) { 
							return x(v.date) + x.rangeBand()/6})
						.attr("width", x.rangeBand()/1.5)
						.attr("y", function(d) { 
							return y1(d.base + d.value) + height1})
						.attr("height", function(d) { return y1(d.base)- y1(d.value + d.base) })
						.style("fill", function(d) { 
							return color(d.name)})
						.append("title")
						.text(display);
				})
				var text = svg.selectAll(".total").data(data).enter();
				text.append("text").attr("class", "total")
					.attr("x", function(d){ return x(d.date) + x.rangeBand()/2})
					.attr("y", function(d){ return y1(d.total_power_consumption) - 10 + height1})
					.attr("dy", ".5em")
					.attr("text-anchor", "middle")
					.text(function(d) { return d.total_power_consumption});
				
				//line chart
				var line1 = d3.svg.line()
				.x(function(d) { return x(d.date) + x.rangeBand()/2})
				.y(function(d) { return y2(d. drybulb)});
				var line2 = d3.svg.line()
					.x(function(d) { return x(d.date) + x.rangeBand()/2})
					.y(function(d) { return y2(d. wetbulb)});
				svg.append("path").attr("class", "line")
					.attr("d", function(d){ return line1(weatherData)})
					.style("stroke", color("drybulb"));
				svg.append("path").attr("class", "line")
				.attr("d", function(d){ return line2(weatherData)})
				.style("stroke", color("wetbulb"));
				
				var labelgroup = svg.selectAll(".weather").data(weatherData).enter();
				labelgroup.append("text")
							.attr("class", "weather")
							.attr("x", function(d) { return x(d.date) + x.rangeBand()/2})
							.attr("y", function(d) { return y2(d.drybulb)})
							.attr("text-anchor", "middle")
							.style("fill", color("drybulb"))
							.text(function(d){
								return Math.round(d.drybulb*100)/100;
							});
				labelgroup.append("text")
							.attr("class", "weather")
							.attr("x", function(d) { return x(d.date) + x.rangeBand()/2})
							.attr("y", function(d) { return y2(d.wetbulb)})
							.attr("text-anchor", "middle")
							.style("fill", color("wetbulb"))
							.text(function(d){
								return Math.round(d.wetbulb*100)/100;
							});
			    var circlegroup = svg.selectAll("dot").data(weatherData).enter();
				circlegroup.append("circle")
					.attr("r", 1.5)
					.attr("cx", function(d){ 
						return x(d.date) + x.rangeBand()/2})
					.attr("cy", function(d){ return y2(d.drybulb)})
					.style("fill", color("drybulb"));
//					.on('mouseover', function(d){
//						svg.append('text').attr('class', 'popup')
//						.attr('x',  x(d.date) + x.rangeBand()/2)
//						.attr('y', y2(d.drybulb))
//						.text(function(){
//								return Math.round(d.drybulb*100)/100;
//						}
//						);
//					}).on('mouseleave', function(d){
//						svg.select('.popup').remove();
//					});
				circlegroup.append("circle")
				.attr("r", 1.5)
				.attr("cx", function(d){ 
					return x(d.date) + x.rangeBand()/2})
				.attr("cy", function(d){ return y2(d.wetbulb)})
				.style("fill", color("wetbulb"));
//				.on('mouseover', function(d){
//					svg.append('text').attr('class', 'popup')
//					.attr('x',  x(d.date) + x.rangeBand()/2)
//					.attr('y', y2(d.wetbulb))
//					.text(function(){
//							return Math.round(d.wetbulb*100)/100;
//					}
//					);
//				}).on('mouseleave', function(d){
//					svg.select('.popup').remove();
//				});
				
				//legends				
				var rec_width = 30, legend_margin = 10, legend_height = 20;
				svg.append("rect")
					.attr("class", "weather legend")
					.attr("x", width + legend_margin)
					.attr("y", legend_height)
					.attr("width", rec_width)
					.attr("height", 2)
					.style("fill", color("drybulb"));
				svg.append("rect")
					.attr("class", "weather legend")
					.attr("x", width + legend_margin)
					.attr("y", legend_height * 2)
					.attr("width", rec_width)
					.attr("height", 2)
					.style("fill", color("wetbulb"));
				svg.append("text")
					.attr("class", "weather legend text")
					.attr("x", width + legend_margin*2 + rec_width)
					.attr("y", 1 * legend_height)
					.attr("dominant-baseline", "central")
					.text("Dry Bulb");
				svg.append("text")
					.attr("class", "weather legend text")
					.attr("x", width + legend_margin*2 + rec_width)
					.attr("y", 2 * legend_height)
					.attr("dominant-baseline", "central")
					.text("Wet Bulb");
				
				var legends = svg.selectAll(".power.legend").data(data[0].group).enter();
				legends.append("rect").attr("class", "power legend")
						.attr("x", width + legend_margin)
						.attr("y", function(d, i){ return height1 + i * legend_height;})
						.attr("width", rec_width)
						.attr("height", legend_height)
						.style("fill", function(d){ return color(d.name)});
				legends.append("text").attr("class", "power legend text")
						.attr("x", width + legend_margin*2 + rec_width)
						.attr("y", function(d, i){ return height1 + (i+0.5) * legend_height;})
						.attr("dominant-baseline", "central")
						.text(function(d){ return d.name});
				
				var saving_explaination = "The daily saving comes from saving of every minute. In one specific minute, assuming the heat capacity generated is the same before and after our work, we can use the cop = heat capacity/power to calculate the power before our work and get the power gap. Accumulating the saving of every minute in a day, that is how daily saving is calculated.";
				d3.select(".box-body").append("p")
					.attr("class", "remark")
					.attr("title", saving_explaination)
					.style("margin-left", "16px")
					.html("<i>How do we calculate the savings</i> <i class=\"fa fa-question-circle\"></i>");
					
				
				
				//table
				var table = d3.select(".box-body").append("table").attr("class", "table")
							.style("margin", "10px");
				var header = table.append("thead").append("tr");
				header.append("th").text("Date");
				header.append("th").text("Total kWh");
				header.append("th").text("CH kWh");
				header.append("th").text("CHWPP kWh");
				header.append("th").text("CWP kWh");
				header.append("th").text("CT kWh");
				header.append("th").text("ZP&AHU kWh");
				
				var tbody = table.append("tbody").selectAll("tr").data(tableData).enter();
				var row = tbody.append("tr");
				row.append("td").text(function(d){ return d.date});
				row.append("td").text(function(d){ return Math.round(d.total_pc*10000)/100 + '%'})
								.style("color", function(d){ if(d.total_pc > 0) return 'red'; else if(d.total_pc < 0) return 'green'; else return; });
				row.append("td").text(function(d){ return Math.round(d.CH_pc*10000)/100 + '%'})
								.style("color", function(d){ if(d.CH_pc > 0) return 'red'; else if(d.CH_pc < 0) return 'green'; else return; });
				row.append("td").text(function(d){ return Math.round(d.CHWPP_pc*10000)/100 + '%'})
								.style("color", function(d){ if(d.CHWPP_pc > 0) return 'red'; else if(d.CHWPP_pc < 0) return 'green'; else return; });
				row.append("td").text(function(d){ return Math.round(d.CWP_pc*10000)/100 + '%'})
								.style("color", function(d){ if(d.CWP_pc > 0) return 'red'; else if(d.CWP_pc < 0) return 'green'; else return; });
				row.append("td").text(function(d){ return Math.round(d.CT_pc*10000)/100 + '%'})
								.style("color", function(d){ if(d.CT_pc > 0) return 'red'; else if(d.CT_pc < 0) return 'green'; else return; });
				row.append("td").text(function(d){ return Math.round(d.ZP_AHM_pc*10000)/100 + '%'})
								.style("color", function(d){ if(d.ZP_AHM_pc > 0) return 'red'; else if(d.ZP_AHM_pc < 0) return 'green'; else return; });
				
			}
		});
	}
