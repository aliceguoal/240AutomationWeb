package consumption.mes.entity;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

import consumption.mes.controller.ToolgroupMinPowerCapturer;
import universal.entity.ToolGroup;

public class ToolgroupMESConsumption {
	private ToolGroup toolgroup;
	private ArrayList<ToolMESConsumption> tools;
	private HashMap<String, ConsumptionUnit> mes_consumption; //ConsumptionUnit: count, consumption, avg_consumption, min_avg_consumption, waste
	private double total_waste, total_consumption;
	
	public ToolgroupMESConsumption(ToolGroup toolgroup){
		this.toolgroup = toolgroup;
		this.tools = new ArrayList<ToolMESConsumption>();
		this.mes_consumption = new HashMap<String, ConsumptionUnit>();
		total_waste = 0;
		total_consumption = 0;
	}
	
	public void consolidate(){
		// getting all mes statuses
		Set<String> mes = new HashSet<String>();
		for(int i = 0; i < tools.size(); i++){
			mes.addAll(tools.get(i).getMes_consumption().keySet());
		}
		
		//calculate count, consumption, min_avg_consumption for toolgroup in each status
		Iterator<String> mes_list = mes.iterator();
		while(mes_list.hasNext()){
			String status = mes_list.next();
			double consumption = 0, min_avg_consumption = ToolgroupMinPowerCapturer.getMinPower(this.toolgroup.getName(), status);
			boolean update = false;
			
			int count = 0;
			for(int i = 0; i < tools.size(); i++){
				if(tools.get(i).getMes_consumption().containsKey(status)){
					ConsumptionUnit cu = tools.get(i).getMes_consumption().get(status);
					count += cu.getCount();
					consumption += cu.getConsumption();
					if(min_avg_consumption == -1 || min_avg_consumption > cu.getAvg_consumption()){
						min_avg_consumption = cu.getAvg_consumption();
						update = true;
					}
				}
			}
			total_consumption += consumption;
			this.mes_consumption.put(status, new ConsumptionUnit(count, consumption, consumption/count, min_avg_consumption));
			if(update)
				ToolgroupMinPowerCapturer.renewMinPower(this.toolgroup.getName(), status, min_avg_consumption);
		}
		
		//calculate the waste for toolgroup&tool in each status
//		Iterator<String> mes_list2 = mes.iterator();
//		while(mes_list2.hasNext()){
//			String status = mes_list2.next();
//			
//			double min_avg_consumption = this.mes_consumption.get(status).getMin_avg_consumption();
//			double toolgroup_waste = 0;
//			
//			//calculate the waste of each tool under given mes status ('status')
//			for(int i = 0; i < tools.size(); i++){
//				if(tools.get(i).getMes_consumption().containsKey(status)){
//					ConsumptionUnit cu = tools.get(i).getMes_consumption().get(status);
//					cu.setWaste(cu.getCount() * (cu.getAvg_consumption() - min_avg_consumption));
//					toolgroup_waste += cu.getWaste();
//				}
//			}
//			this.mes_consumption.get(status).setWaste(toolgroup_waste);	
//			total_waste += toolgroup_waste;
//		}
		
		for(int i = 0; i < tools.size(); i++){
			ToolMESConsumption tool_con = this.tools.get(i);
			double tool_waste = 0;
			Iterator<String> mes_list2 = mes.iterator();
			while(mes_list2.hasNext()){
				String status = mes_list2.next();
				ConsumptionUnit toolgroup_cu = this.mes_consumption.get(status);
				if(tool_con.getMes_consumption().containsKey(status)){
					double min_avg_consumption = toolgroup_cu.getMin_avg_consumption();
					ConsumptionUnit cu = tool_con.getMes_consumption().get(status);
					cu.setWaste(cu.getCount() * (cu.getAvg_consumption() - min_avg_consumption));
					tool_waste += cu.getWaste();
					toolgroup_cu.setWaste(toolgroup_cu.getWaste() + cu.getWaste());
				}
			}
			tool_con.setTotal_waste(tool_waste);
			this.total_waste += tool_waste;
		}
	}
	
	public ToolGroup getToolgroup() {
		return toolgroup;
	}
	public void setToolgroup(ToolGroup toolgroup) {
		this.toolgroup = toolgroup;
	}
	public ArrayList<ToolMESConsumption> getTools() {
		return tools;
	}
	public void setTools(ArrayList<ToolMESConsumption> tools) {
		this.tools = tools;
	}
	public HashMap<String, ConsumptionUnit> getMes_consumption() {
		return mes_consumption;
	}
	public void setMes_consumption(HashMap<String, ConsumptionUnit> mes_consumption) {
		this.mes_consumption = mes_consumption;
	}
	public double getWaste() {
		return total_waste;
	}
	public void setWaste(double waste) {
		this.total_waste = waste;
	}

	public double getTotal_consumption() {
		return total_consumption;
	}

	public void setTotal_consumption(double total_consumption) {
		this.total_consumption = total_consumption;
	}

	public void print(String prefix) {
		String space = "----";
		System.out.println(prefix + "ToolGroup: " + this.toolgroup.getName() + " total consumption: " + this.total_consumption + " total waste: " + this.total_waste);
		
		Iterator<String> mes_list = this.mes_consumption.keySet().iterator();
		while(mes_list.hasNext()){
			String status = mes_list.next();
			System.out.println(prefix + space + status + ": ");
			System.out.println(prefix + space + space + "Count: " + mes_consumption.get(status).getCount());
			System.out.println(prefix + space + space + "Consumption: " + mes_consumption.get(status).getConsumption());
			System.out.println(prefix + space + space + "Average Consumption: " + mes_consumption.get(status).getAvg_consumption());
			System.out.println(prefix + space + space + "Minimum Average Consumption: " + mes_consumption.get(status).getMin_avg_consumption());
			System.out.println(prefix + space + space + "Waste: " + mes_consumption.get(status).getWaste());
		}
		System.out.println();
		
		for(int i = 0; i < this.tools.size(); i++){
			tools.get(i).print(prefix + "----");
			System.out.println();
		}
	}
}
