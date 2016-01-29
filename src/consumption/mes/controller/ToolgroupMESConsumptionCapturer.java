package consumption.mes.controller;

import consumption.mes.entity.ToolgroupMESConsumption;
import universal.entity.ToolGroup;

public class ToolgroupMESConsumptionCapturer {
	
	public static ToolgroupMESConsumption getConsumption(ToolGroup toolgroup, String start, String end){
		ToolgroupMESConsumption toolgroup_con = new ToolgroupMESConsumption(toolgroup);
		for(int i = 0; i < toolgroup.getTools().size(); i++)
			toolgroup_con.getTools().add(ToolMESConsumptionCapturer.getConsumption(toolgroup.getTools().get(i), start, end));
		toolgroup_con.consolidate();
		return toolgroup_con;
	}
}
