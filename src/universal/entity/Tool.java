package universal.entity;

import java.util.ArrayList;

public class Tool {
	private String name;
	private boolean isReference;
	private ArrayList<Meter> meters;
	
	public Tool(String tool, boolean isRef){
		this.setName(tool);
		this.setReference(isRef);
		this.setMeters(new ArrayList<Meter>());
	}

	public ArrayList<Meter> getMeters() {
		return meters;
	}

	public void setMeters(ArrayList<Meter> meters) {
		this.meters = meters;
	}

	public boolean isReference() {
		return isReference;
	}

	public void setReference(boolean isReference) {
		this.isReference = isReference;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	public void getMeterDesc(){
		
	}
}
