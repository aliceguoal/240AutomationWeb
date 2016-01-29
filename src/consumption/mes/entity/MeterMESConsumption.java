package consumption.mes.entity;

import java.util.HashMap;
import java.util.Iterator;

import universal.entity.Meter;

public class MeterMESConsumption {
	private Meter meter;
	private double total_consumption;
	private HashMap<String, ConsumptionUnit> mes_consumption; //ConsumptionUnit: count, consumption, avg_consumption

	
	public MeterMESConsumption(Meter meter){
		this.setMeter(meter);
		this.setMes_consumption(new HashMap<String, ConsumptionUnit>());
		this.setTotal_consumption(0);
	}

	public HashMap<String, ConsumptionUnit> getMes_consumption() {
		return mes_consumption;
	}

	public void setMes_consumption(HashMap<String, ConsumptionUnit> mes_consumption) {
		this.mes_consumption = mes_consumption;
	}

	public Meter getMeter() {
		return meter;
	}

	public void setMeter(Meter meter) {
		this.meter = meter;
	}

	public double getTotal_consumption() {
		return total_consumption;
	}

	public void setTotal_consumption(double total_consumption) {
		this.total_consumption = total_consumption;
	}

	public void print(String prefix) {
		String space = "----";
		System.out.println(prefix + "Meter: " + this.meter.getIeee() + " total consumption: " + this.total_consumption);
		Iterator<String> mes_list = this.mes_consumption.keySet().iterator();
		while(mes_list.hasNext()){
			String status = mes_list.next();
			System.out.println(prefix + space + status + ": ");
			System.out.println(prefix + space + space + "Count: " + mes_consumption.get(status).getCount());
			System.out.println(prefix + space + space + "Consumption: " + mes_consumption.get(status).getConsumption());
			System.out.println(prefix + space + space + "Average Consumption: " + mes_consumption.get(status).getAvg_consumption());
		}
	}

}
