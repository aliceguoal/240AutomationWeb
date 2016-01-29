package universal.entity;

import java.util.ArrayList;
import java.util.Arrays;

public class ToolGroup {
	private String name;
	private ArrayList<Tool> tools;
	
	public ToolGroup(String toolgroup){
		this.setName(toolgroup);
		this.setTools(new ArrayList<Tool>());
	}

	public ArrayList<Tool> getTools() {
		return tools;
	}

	public void setTools(ArrayList<Tool> tools) {
		this.tools = tools;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Tool getToolByName(String name) {
		for(int i = 0; i < tools.size(); i++){
			if(tools.get(i).getName().equals(name))
				return tools.get(i);
		}
		return null;
	}

	public void sort(){
		String[] names = new String[tools.size()];
		for(int i = 0; i < tools.size(); i++)
			names[i] = tools.get(i).getName();
		Arrays.sort(names);
		
		ArrayList<Tool> sorted = new ArrayList<Tool>();
		for(int i = 0; i < tools.size(); i++)
			sorted.add(this.getToolByName(names[i]));
		tools = sorted;
	}
}
