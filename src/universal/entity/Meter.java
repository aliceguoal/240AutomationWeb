package universal.entity;

public class Meter {
	private String ieee, device_desc;
	
	public Meter(String ieee){
		this.setIeee(ieee);
	}
	public Meter(String ieee, String device_desc){
		this.setIeee(ieee);
		this.setDevice_desc(device_desc);
	}
	public String getDevice_desc() {
		return device_desc;
	}
	public void setDevice_desc(String device_desc) {
		this.device_desc = device_desc;
	}
	public String getIeee() {
		return ieee;
	}
	public void setIeee(String ieee) {
		this.ieee = ieee;
	}

}
