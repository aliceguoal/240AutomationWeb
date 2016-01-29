package consumption.mes.entity;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

import universal.entity.Module;

public class ModuleMESConsumption {
	private Module module;
	private ArrayList<ToolgroupMESConsumption> toolgroups;
	private HashMap<String, ConsumptionUnit> mes_consumption; //ConsumptionUnit: consumption, waste
	
	public ModuleMESConsumption (Module module){
		this.module = module;
		this.toolgroups = new ArrayList<ToolgroupMESConsumption>();
		this.mes_consumption = new HashMap<String, ConsumptionUnit>();
		total_waste = 0;
		setTotal_consumption(0);
	}
	
	public void consolidate() {
		Set<String> mes = new HashSet<String>();
		for(int i = 0; i < toolgroups.size(); i++){
			mes.addAll(toolgroups.get(i).getMes_consumption().keySet());
		}
		
		Iterator<String> mes_list = mes.iterator();
		while(mes_list.hasNext()){
			String status = mes_list.next();
			double consumption = 0, waste = 0;
			for(int i = 0; i < toolgroups.size(); i++){
				if(toolgroups.get(i).getMes_consumption().containsKey(status)){
					ConsumptionUnit cu = toolgroups.get(i).getMes_consumption().get(status);
					consumption += cu.getConsumption();
					waste += cu.getWaste();
				}
			}
			this.mes_consumption.put(status, new ConsumptionUnit(consumption, waste));
			total_waste += waste;
			total_consumption += consumption;
		}
	}
	
	public Module getModule() {
		return module;
	}
	public void setModule(Module module) {
		this.module = module;
	}
	public ArrayList<ToolgroupMESConsumption> getToolgroups() {
		return toolgroups;
	}
	public void setToolgroups(ArrayList<ToolgroupMESConsumption> toolgroups) {
		this.toolgroups = toolgroups;
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
	public void setWaste(double total_waste) {
		this.total_waste = total_waste;
	}
	public double getTotal_consumption() {
		return total_consumption;
	}

	public void setTotal_consumption(double total_consumption) {
		this.total_consumption = total_consumption;
	}
	private double total_waste, total_consumption;

	public void print(String prefix) {
		String space = "----";
		System.out.println(prefix + "Module: " + this.module.getName() + " total consumption: " + this.total_consumption + " total waste: " + this.total_waste);
		
		Iterator<String> mes_list = this.mes_consumption.keySet().iterator();
		while(mes_list.hasNext()){
			String status = mes_list.next();
			System.out.println(prefix + space + status + ": ");
			System.out.println(prefix + space + space + "Consumption: " + mes_consumption.get(status).getConsumption());
			System.out.println(prefix + space + space + "Waste: " + mes_consumption.get(status).getWaste());
		}
		System.out.println();
		
		for(int i = 0; i < this.toolgroups.size(); i++){
			toolgroups.get(i).print(prefix + "----");
			System.out.println();
		}
	}
}
