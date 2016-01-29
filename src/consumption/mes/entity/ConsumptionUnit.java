package consumption.mes.entity;

public class ConsumptionUnit {
	private int count;
	private double consumption, avg_consumption, min_avg_consumption, waste;
	
	public ConsumptionUnit(int count, double consumption){
		this.setCount(count);
		this.setConsumption(consumption);
	}
	
	public ConsumptionUnit(int count, double consumption, double c2){
		this.setCount(count);
		this.setConsumption(consumption);
		this.setAvg_consumption(c2);
	}
	
	public ConsumptionUnit(int count, double consumption, double c2, double c3){
		this.setCount(count);
		this.setConsumption(consumption);
		this.setAvg_consumption(c2);
		this.setMin_avg_consumption(c3);
	}
	
	public ConsumptionUnit(double consumption, double waste){
		this.consumption = consumption;
		this.waste = waste;
	}

	public int getCount() {
		return count;
	}

	public void setCount(int count) {
		this.count = count;
	}

	public double getConsumption() {
		return consumption;
	}

	public void setConsumption(double consumption) {
		this.consumption = consumption;
	}

	public double getAvg_consumption() {
		return avg_consumption;
	}

	public void setAvg_consumption(double avg_consumption) {
		this.avg_consumption = avg_consumption;
	}

	public double getMin_avg_consumption() {
		return min_avg_consumption;
	}

	public void setMin_avg_consumption(double min_avg_consumption) {
		this.min_avg_consumption = min_avg_consumption;
	}

	public double getWaste() {
		return waste;
	}

	public void setWaste(double waste) {
		this.waste = waste;
	}
}
