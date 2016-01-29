package consumption.mes.controller;

import consumption.mes.entity.MapMESConsumption;
import universal.entity.Map;

public class MapMESConsumptionCapturer {
	public static MapMESConsumption getConsumption(Map map, String start, String end){
		MapMESConsumption map_con = new MapMESConsumption(map);
		for(int i = 0; i < map.getModules().size(); i++)
			map_con.getModules().add(ModuleMESConsumptionCapturer.getConsumption(map.getModules().get(i), start, end));
		System.out.println("consolidate start");
		map_con.consolidate();
		System.out.println("consolidate end");
		return map_con;
	}
}
