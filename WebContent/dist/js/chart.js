//var hosts = [];
var timestamps = [];
var hide = [];

//get hosts
if(typeof hosts == 'undefined' || hosts.length == 0){
	jQuery.ajax({
		url: root+'HostNameServlet',
		success: function(data){
			hosts = data.split(",");
		},
		async: false
	});
}

//get latest timestamp for each host
hosts.forEach(function(h){
	jQuery.ajax({
		url: root+'LatestDateServlet?host='+h,
		success: function(data){
			timestamps.push(d3.time.format("%Y-%m-%d %H:%M:%S").parse(data));
		},
		async: false
	});
	
});

var historyData = [];
//get the latest 10 min data for each host
hosts.forEach(function(h, i){
	var newTime = new Date(timestamps[i]);
	newTime.setMinutes(newTime.getMinutes()-10);
	jQuery.ajax({
		url: root+'QueryServlet?host='+h+'&timestamp='+newTime.toISOString().slice(0,10)+" "+newTime.toTimeString().slice(0,8)
			+"&yChoice="+yChoice+'&delta='+delta,
		success: function(data){
			  data.values.forEach(function(d) {
				  d.time = d3.time.format("%Y-%m-%d %H:%M:%S").parse(d.time);
				  if(yChoice == "mem_used")
					  d.y = +d.y/1024/1024;
			  });
			historyData.push(data);
		},
		async: false
	})
});

//set margins
var margin = {top: 20, right: 100, bottom: 50, left: 120},
    width = 960 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

//set range and domain for x axis and y axis
var x = d3.time.scale()
    .range([0, width]);
x.domain([
    	    d3.min(historyData, function(d) { return d3.min(d.values, function(v) { return v.time; }); }),
      	    d3.max(historyData, function(d) { return d3.max(d.values, function(v) { return v.time; }); })
]);

var y = d3.scale.linear()
    .range([height, 0]);
if(focusRack != null){
	var data = null;
	historyData.forEach(function(h){
		if(h.host == focusRack)
			data = h.values;
	})
	y.domain([
	          d3.min(data, function(d){return +d.y;}),
	          d3.max(data, function(d){return +d.y;})
	          ]);
}else
	y.domain([
	  	    d3.min(historyData, function(d) { return d3.min(d.values, function(v) { return +v.y; }); }),
	  	    d3.max(historyData, function(d) { return d3.max(d.values, function(v) { return +v.y; }); })
	]);

var xAxis = d3.svg.axis()
.scale(x)
.orient("bottom")
.ticks(d3.time.minutes, 1)
.tickFormat(d3.time.format('%H:%M'))
.tickSize(1)
.tickPadding(8);

var yAxis = d3.svg.axis()
.scale(y)
.orient("left").ticks(5)
.tickFormat(function(d){
	if(yChoice == "load_one")
		return Math.round(d*100)+'%';
	else
		return d;
});

var yAxisRight = d3.svg.axis().scale(y)
    .orient("right").tickFormat("").tickSize(0);

//color domain
var color = d3.scale.category10();
color.domain(hosts);

//set line function
var line = d3.svg.line()
    .x(function(d, i) { return x(d.time); })
    .y(function(d, i) { return y(d.y); });

//set zoom function
var zoom = d3.behavior.zoom()
	.x(x)
	.y(y)
	.scaleExtent([1, 4])
	.on("zoom", zoomed);


//set svg panel for charts
var svg = d3.select(position).select(".box-body").select(".row").append("svg")
	.attr("xmlns","http://www.w3.org/2000/svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", "0 0 "+ (width + margin.left + margin.right) + " "+(height + margin.top + margin.bottom))
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(zoom);

svg.append("rect")
.attr("width", width).attr("height", height)
.attr("class", "plot")
.on("mousemove", mousemove);

var clip = svg.append("clipPath")
.attr("id", "clip")
.append("rect")
.attr("x", 0)
.attr("y", 0)
.attr("width", width)
.attr("height", height);


//add lines
var chartBody = svg.selectAll(".group").data(historyData).enter()
.append("g").attr("clip-path", "url(#clip)");

chartBody.append("path")
.attr("id",function(d){return "line"+d.host;})
.attr("class","line").attr("d", function(d){
	return line(d.values);
})
.style("stroke", function(d) { return color(d.host); })
.style("display", function(d){
	if(focusRack != null && d.host != focusRack)
		return "none";
	else
		return null;
});

//add focuses to show hover value

var focus = svg.selectAll(".focus").data(historyData).enter()
.append("g")
.attr("class", "focus")
.attr("id", function(d){return "focus"+d.host;})
.style("opacity", 0)
.style("display", function(d){
	if(focusRack != null && d.host != focusRack)
		return "none";
	else
		return null;
})
.on("mouseover", function() { 
	d3.select(this).style("opacity", 1); })
.on("mouseout", function() {
	d3.select(this).style("opacity", 0); });

focus.append("circle")
.attr("r", 5)
.style("stroke-width", "4px");

focus.append("text")
.style("z-index", -1)
.attr("x", 9)
.attr("dy", ".35em");



//add axis
svg.append("g")         
.attr("class", "x axis")
.attr("transform", "translate(0," + height + ")")
.call(xAxis);
svg.append("g")         
.attr("class", "y axis")
.call(yAxis);

svg.append("g")
.attr("class", "y axis")
.attr("transform", "translate("+ width +",0)")
.call(yAxisRight);

svg.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left)
.attr("x", (0 - (height / 2)))
.attr("dy", "1em")
.style("text-anchor", "middle")
.text(yLabel);

svg.append("text")
.attr("x", width/2)
.attr("y", height + margin.bottom/2)
.attr("dy", "1em")
.style("text-anchor", "middle")
.text(xLabel);

//add legends
var legendSpace = (height-10)/(hosts.length+1);

svg.selectAll(".legend").data(hosts).enter().append("foreignObject")
.attr("x",width+10)
.attr("y",function(d,i){return (i+1)*legendSpace+10;})
.attr("width", margin.right-20)
.attr("height", legendSpace)
.append("xhtml:div")
.html(function(d,i){ 
	var checked = (focusRack == null || d == focusRack)?"checked":"";
	if(checked.length == 0)
		hide.push(d);
	return "<form style=\"color:"+color(d)+"\"><input type=checkbox "+checked+" id="+d+"> Server "+d.substring(5)+"</form>";})
.on("click", function(d, i){
    if(svg.select("#"+d).node().checked){
    	hide.splice(hide.indexOf(d), 1);
    	svg.select("#line"+d).style("display", null);
    	svg.select("#focus"+d).style("display", null);
    	if(hide.length == 0){
    		svg.select("#all").node().checked = true;
    	}
    }else{
    	svg.select("#all").node().checked = false;
    	svg.select("#line"+d).style("display", "none");
    	svg.select("#focus"+d).style("display", "none");
    	hide.push(d);
    }
    refreshData();
});
svg.append("foreignObject")
.attr("x",width+10)
.attr("y",10)
.attr("width", margin.right-20)
.attr("height", legendSpace)
.append("xhtml:div")
.style("fill", color)
.html(function(){
	var checked = (focusRack == null)?"checked":"";
	return "<form><input type=checkbox "+checked+" id=\"all\"> select all</form>"})
.on("click", function(){
    if(svg.select("#all").node().checked){
    	hide = [];
    	hosts.forEach(function(d){
	    	svg.select("#line"+d).style("display", null);
	    	svg.select("#focus"+d).style("display", null);
	    	svg.select("#"+d).node().checked = true;
    	});
    }else{
    	if(hide.length == 0){
        	hosts.forEach(function(d){
    	    	svg.select("#line"+d).style("display", "none");
    	    	svg.select("#focus"+d).style("display", "none");
    	    	svg.select("#"+d).node().checked = false;
    	    	hide.push(d);
        	});
    	}
    }
    refreshData();
});

function mousemove(){
	var bisectDate = d3.bisector(function(d) { return d.time;}).left;
	var x0 = x.invert(d3.mouse(this)[0]);
    var neighbour = [];
	d3.selectAll(".focus").each(function(d,i){
		var index = bisectDate(d.values, x0, 1);
		var p0 = d.values[index-1],
		p1 = d.values[index],
		p = x0 - p0.time > p1.time - x0 ? p1 : p0;
		var f = d3.select("#focus"+d.host);
		f.attr("transform", "translate(" + x(p.time) + "," + y(p.y) + ")");
		if(yChoice == "load_one")
			f.select("text").text(Math.round(p.y*100)+'%');
		else
			f.select("text").text(p.y);
		
	});
}

var inter = setInterval(function(){
	updateData();
}, 3000);

$(document).bind('keydown', "p", function(){
	if(inter != 0){
		clearInterval(inter);
		inter = 0;
		$('.chart-status').find('b').text("stopped");
	}else{
		inter = setInterval(function(){
			updateData()
		}, 3000);
		$('.chart-status').find('b').text("updating");
	} 
})

var oldScale = 1;
function zoomed() {
    refreshData();

    if (Math.abs(oldScale - d3.event.scale) > 1e-5) {
        oldScale = d3.event.scale;
        //svg.select(".y.axis").call(yAxis);
    }
}

function updateData() {
	var newOffset = 0;
	timestamps.forEach(function(t,i){
		var timeStr = t.toISOString().slice(0,10)+" "+t.toTimeString().slice(0,8)
		jQuery.ajax({
			url: root+"QueryServlet?timestamp="+timeStr+"&host="+hosts[i]+"&yChoice="+yChoice+'&delta='+delta,
			success: function(data){
				if(data.values.length > 0){
					newOffset = Math.max(newOffset, data.values.length);
					data.values.forEach(function(v){
						v.time = d3.time.format("%Y-%m-%d %H:%M:%S").parse(v.time);
						if(yChoice == "mem_used")
							v.y = +v.y/1024/1024;
						historyData[i].values.push(v);
					});
				}
			},
			async: false
		});
		timestamps[i] = new Date(historyData[i].values[historyData[i].values.length-1].time);
	});

	if(newOffset > 0){
		refreshData();
	}
}

function refreshData() {
    var graphData = [];
    var timeMax = d3.max(timestamps);
    var timeMin = new Date(timeMax);
    timeMin.setMinutes(timeMin.getMinutes()-10/oldScale);
    for(var i=0; i<historyData.length; i++){
    	var value = historyData[i].values;
    	var graph = [];
    	var loop = true;
    	for(var j=value.length-1; j >= 0&&loop; j--){
    		if(new Date(value[j].time) <= timeMax && new Date(value[j].time) >= timeMin)
    			graph.push(value[j]);
    		else
    			loop = false;
    	}
    	graph.reverse();
    	graphData.push(graph);
    }
    
    x.domain([timeMin, timeMax]);
    svg.select(".x.axis").call(xAxis);
    var yMin = -1, yMax = -1;
    graphData.forEach(function(d,i){
    	if(hide.indexOf(hosts[i]) == -1){
    		if(yMin == -1)
    			yMin = d3.min(d, function(v){return +v.y;});
    		else
    			yMin = d3.min([+yMin, +d3.min(d, function(v){return +v.y;})]);
    		
    		if(yMax == -1)
    			yMax = d3.max(d, function(v){return +v.y;});
    		else
    			yMax = d3.max([+yMax, +d3.max(d, function(v){return +v.y;})]);
    	}
    });
    y.domain([yMin, yMax]);
    
    svg.select(".y.axis").call(yAxis);

    d3.selectAll(".line").data(graphData)
    .attr("class", "line")
    .attr("d",line);
    
}

//var eData = [{"Parameters":"MPP_10", "Contribution": "47.15", "Portion":"0.1940", "Rank": 1},
//             {"Parameters":"MPP_13", "Contribution": "36.56", "Portion":"0.1505", "Rank": 2},
//             {"Parameters":"MPP_31", "Contribution": "32.48", "Portion":"0.1336", "Rank": 3},
//             {"Parameters":"MPP_12", "Contribution": "28.14", "Portion":"0.1159", "Rank": 4},
//             {"Parameters":"MPP_32", "Contribution": "25.07", "Portion":"0.1031", "Rank": 5},
//             {"Parameters":"MPP_35", "Contribution": "23.32", "Portion":"0.0960", "Rank": 6},
//             {"Parameters":"MPP_9", "Contribution": "19.88", "Portion":"0.0818", "Rank": 7},
//             {"Parameters":"MPP_34", "Contribution": "17.26", "Portion":"0.0710", "Rank": 8},
//             {"Parameters":"MPP_33", "Contribution": "13.11", "Portion":"0.0541", "Rank": 9}];

var table = d3.select(position).select(".box-body").select(".row").append("table").attr("class", "table")
.style("margin",'10px');
var header = table.append("thead").append("tr");
header.append("th").html("Parameters <i title=\"parameters\" class=\"fa fa-question-circle\"></i>");
header.append("th").html("Contribution <i title=\"contribution\" class=\"fa fa-question-circle\"></i>");
header.append("th").html("Portion <i title=\"portion\" class=\"fa fa-question-circle\"></i>");
header.append("th").html("Rank <i title=\"rank\" class=\"fa fa-question-circle\"></i>");


$('.fa-question-circle').hover(function(){
	var title = $(this).attr("title");
    $('<p class="tooltip"></p>')
    .text(title)
    .appendTo('body')
    .fadeIn('slow');
}, function(){
    $('.tooltip').remove();
});

var AnalysisData = [];
jQuery.ajax({
	url: root+'AnalysisDataServlet?table=raw',
	success: function(data){
		AnalysisData = data;
	},
	async: false
});


var tbody = table.append("tbody").selectAll("tr").data(AnalysisData).enter();
var row = tbody.append("tr");
row.append("td").text(function(d){return d.host.replace("MPP_R","Server ")})
.on('click',function(d){
//	var data = [{"Timestamp": "2015-08-11 08:16:00", "Temperature": 37, "CPU": 312311, "Power": 475, "PUE": 1.14},
//	            {"Timestamp": "2015-08-11 09:25:00", "Temperature": 30, "CPU": 54545, "Power": 216, "PUE": 1.18},
//	            {"Timestamp": "2015-08-11 12:29:00", "Temperature": 35, "CPU": 468735, "Power": 355, "PUE": 1.20},
//	            {"Timestamp": "2015-08-11 15:13:00", "Temperature": 32, "CPU": 179351, "Power": 468, "PUE": 1.22},
//	            {"Timestamp": "2015-08-11 15:48:00", "Temperature": 40, "CPU": 812255, "Power": 519, "PUE": 1.25}];
	
	jQuery.ajax({
		url: root+'AnalysisDataServlet?table=recommand',
		success: function(data){
			var popup = d3.select("#popup-table");
			popup.html("");
			popup.append("h3").text("Setup Recommendation");
			var table = popup.append("table").attr("class","table tablesorter");
			var header = table.append("thead").append("tr");
			header.append("th").text("Timestamp");
			header.append("th").text("Temperature");
			header.append("th").text("CPU");
			header.append("th").text("Power");
			header.append("th").text("PUE");
			var tbody = table.append("tbody").selectAll("tr").data(data).enter();
			var row = tbody.append("tr");
			row.append("td").text(function(d){return d.timestamp});
			row.append("td").text(function(d){return d.temp});
			row.append("td").text(function(d){return Math.round(d.cpu*100)+'%'});
			row.append("td").text(function(d){return d.power});
			row.append("td").text(function(d){return d.pue});
			
			$("#popup-table table").tablesorter();
			$.blockUI({message: $('#popup-table')});
			$('.blockOverlay').click($.unblockUI); 
		},
		async: false
	});

});
row.append("td").text(function(d){return d.contribution});
row.append("td").text(function(d){return d.portion});
row.append("td").text(function(d){return d.rank});
