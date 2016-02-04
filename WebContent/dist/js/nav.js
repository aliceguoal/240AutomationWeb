var start = '2015-12-01', end = '2015-12-06';
d3.json("map.json", function(json) {
	var modules = d3.select(".sidebar-menu").selectAll(".treeview").data(json.modules).enter().append("li").attr("class", "treeview");
	var module_level = modules.append('a').attr('href', '#');
	module_level.append("i").attr('class', 'fa fa-dashboard');
	module_level.append('span').attr('class', 'module').text(function(d){ return d.name;});
	module_level.append('i').attr('class', 'fa fa-angle-left pull-right');
	
	var toolgroup_level = modules.append('ul').attr('class', 'treeview-menu')
							.selectAll("li").data(function(d){return d.toolgroups}).enter()
							.append('li')
							.attr('class', 'treeview');
	toolgroup_level.append('a').attr('href','#');
	toolgroup_level.select('a').append("i").attr('class', 'fa fa-bars');
	toolgroup_level.select('a').append('span').attr('class', 'toolgroup').text(function(d){ return d.name;});
	toolgroup_level.select('a').append('i').attr('class', 'fa fa-angle-left pull-right');
	
	var tool_level = toolgroup_level.append('ul').attr('class', 'treeview-menu')
						.selectAll("li").data(function(d){return d.tools}).enter()
						.append('li')
						.attr('class', 'treeview');
	tool_level.append('a').attr('href','#');
	tool_level.select('a').append("i").attr('class', 'fa fa-circle-o');
	tool_level.select('a').append('span').attr('class', 'tool').text(function(d){ return d.name;});

	$(".treeview span").on('click', function (e) {
		var cls = $(this).attr('class'), name = $(this).text(); 
		e.stopPropagation();
		if(cls == 'module')
			refreshSummary('ModuleConsumptionServlet?module='+name+'&', name);
		else if(cls == 'toolgroup')
			refreshSummary('ToolGroupConsumptionServlet?toolgroup='+name+'&', name);
		
	});
	$.AdminLTE.tree('.sidebar');
});

refreshSummary('MapConsumptionServlet?', 'Map');



