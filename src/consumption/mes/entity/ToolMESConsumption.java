package consumption.mes.entity;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

import universal.entity.Tool;

public class ToolMESConsumption {
	private Tool tool;
	private ArrayList<MeterMESConsumption> meters;
	private double total_consumption, total_waste;
	private HashMap<String, ConsumptionUnit> mes_consumption; //ConsumptionUnit: count, consumption, avg_consumption, waste
	
	public ToolMESConsumption(Tool tool){
		this.setTool(tool);
		this.meters = new ArrayList<MeterMESConsumption>();
		this.setMes_consumption(new HashMap<String, ConsumptionUnit>());
		setTotal_consumption(0);
	}

	public Tool getTool() {
		return tool;
	}

	public void setTool(Tool tool) {
		this.tool = tool;
	}

	public HashMap<String, ConsumptionUnit> getMes_consumption() {
		return mes_consumption;
	}

	public void setMes_consumption(HashMap<String, ConsumptionUnit> mes_consumption) {
		this.mes_consumption = mes_consumption;
	}

	public ArrayList<MeterMESConsumption> getMeters() {
		return meters;
	}

	public void setMeters(ArrayList<MeterMESConsumption> meters) {
		this.meters = meters;
	}

	public void consolidate() {
		// getting all mes statuses
		Set<String> mes = new HashSet<String>();
		for(int i = 0; i < meters.size(); i++){
			mes.addAll(meters.get(i).getMes_consumption().keySet());
		}
		
		Iterator<String> mes_list = mes.iterator();
		while(mes_list.hasNext()){
			String status = mes_list.next();
			int count = 0;
			double consumption = 0;
			for(int i = 0; i < meters.size(); i++){
				if(meters.get(i).getMes_consumption().containsKey(status)){
					count += meters.get(i).getMes_consumption().get(status).getCount();
					consumption += meters.get(i).getMes_consumption().get(status).getConsumption();
				}
			}
			count = Math.round((float) count/meters.size());
			setTotal_consumption(getTotal_consumption() + consumption);
			this.mes_consumption.put(status, new ConsumptionUnit(count, consumption, consumption/count));
		}
	}

	public double getTotal_consumption() {
		return total_consumption;
	}

	public void setTotal_consumption(double total_consumption) {
		this.total_consumption = total_consumption;
	}

	public void print(String prefix) {
		String space = "----";
		System.out.println(prefix + "Tool: " + this.tool.getName() + " total consumption: " + this.total_consumption + " total waste: " + this.total_waste);
		
		Iterator<String> mes_list = this.mes_consumption.keySet().iterator();
		while(mes_list.hasNext()){
			String status = mes_list.next();
			System.out.println(prefix + space + status + ": ");
			System.out.println(prefix + space + space + "Count: " + mes_consumption.get(status).getCount());
			System.out.println(prefix + space + space + "Consumption: " + mes_consumption.get(status).getConsumption());
			System.out.println(prefix + space + space + "Average Consumption: " + mes_consumption.get(status).getAvg_consumption());
			System.out.println(prefix + space + space + "Waste: " + mes_consumption.get(status).getWaste());
		}
		System.out.println();
		
		for(int i = 0; i < this.meters.size(); i++){
			meters.get(i).print(prefix + "----");
			System.out.println();
		}
	}

	public double getTotal_waste() {
		return total_waste;
	}

	public void setTotal_waste(double total_waste) {
		this.total_waste = total_waste;
	}

	
}
