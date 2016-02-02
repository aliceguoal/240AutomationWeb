package consumption.mes.entity;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

import universal.entity.Map;

public class MapMESConsumption {
	private Map entity;
	private ArrayList<ModuleMESConsumption> children;
	public ArrayList<ModuleMESConsumption> getchildren() {
		return children;
	}

	public void setchildren(ArrayList<ModuleMESConsumption> children) {
		this.children = children;
	}

	private HashMap<String, ConsumptionUnit> mes_consumption; //ConsumptionUnit: consumption, waste
	private double total_consumption, total_waste;
	
	public MapMESConsumption (Map map){
		this.setMap(map);
		this.children = new ArrayList<ModuleMESConsumption>();
		this.mes_consumption = new HashMap<String, ConsumptionUnit>();
		setTotal_waste(0);
		setTotal_consumption(0);
	}
	
	public void consolidate() {
		Set<String> mes = new HashSet<String>();
		for(int i = 0; i < children.size(); i++){
			mes.addAll(children.get(i).getMes_consumption().keySet());
		}
		
		Iterator<String> mes_list = mes.iterator();
		while(mes_list.hasNext()){
			String status = mes_list.next();
			double consumption = 0, waste = 0;
			for(int i = 0; i < children.size(); i++){
				if(children.get(i).getMes_consumption().containsKey(status)){
					ConsumptionUnit cu = children.get(i).getMes_consumption().get(status);
					consumption += cu.getConsumption();
					waste += cu.getWaste();
				}
			}
			this.mes_consumption.put(status, new ConsumptionUnit(consumption, waste));
			setTotal_waste(getTotal_waste() + waste);
			setTotal_consumption(getTotal_consumption() + consumption);
		}
	}

	public double getTotal_consumption() {
		return total_consumption;
	}

	public void setTotal_consumption(double total_consumption) {
		this.total_consumption = total_consumption;
	}

	public double getTotal_waste() {
		return total_waste;
	}

	public void setTotal_waste(double total_waste) {
		this.total_waste = total_waste;
	}

	public Map getMap() {
		return entity;
	}

	public void setMap(Map map) {
		this.entity = map;
	}
}
