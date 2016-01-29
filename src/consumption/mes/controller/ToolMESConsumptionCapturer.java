package consumption.mes.controller;

import consumption.mes.entity.ToolMESConsumption;
import universal.entity.Tool;

public class ToolMESConsumptionCapturer {
	
	public static ToolMESConsumption getConsumption(Tool tool, String start, String end){
		ToolMESConsumption tool_con = new ToolMESConsumption(tool);
		for(int i = 0; i < tool.getMeters().size(); i++)
			tool_con.getMeters().add(MeterMESConsumptionCapturer.getConsumption(tool.getMeters().get(i), start, end));
		tool_con.consolidate();
		return tool_con;
	}
}
