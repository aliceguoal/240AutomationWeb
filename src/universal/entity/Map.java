package universal.entity;

import java.util.ArrayList;
import java.util.Arrays;

public class Map {
	private ArrayList<Module> modules;
	public Map(){
		this.setModules(new ArrayList<Module>());
	}
	
	public Module getModuleByName(String name){
		for(int i = 0; i < modules.size(); i++)
			if(modules.get(i).getName().equals(name))
				return modules.get(i);
		return null;
	}
	public ToolGroup getToolGroupByName(String name){
		for(int i = 0; i < modules.size(); i++){
			ToolGroup tg = modules.get(i).getToolGroupByName(name);
			if(tg != null)
				return tg;
		}
		return null;
	}
	public Tool getToolByName(String name){
		ToolGroup tg = this.getToolGroupByName(name.substring(0, 4));
		if(tg.getToolByName(name) != null)
			return tg.getToolByName(name);
		return null;
	}
	public ArrayList<Module> getModules() {
		return modules;
	}
	public void setModules(ArrayList<Module> modules) {
		this.modules = modules;
	}
	public void sort(){
		String[] names = new String[modules.size()];
		for(int i = 0; i < modules.size(); i++)
			names[i] = modules.get(i).getName();
		Arrays.sort(names);
		
		ArrayList<Module> sorted = new ArrayList<Module>();
		for(int i = 0; i < modules.size(); i++)
			sorted.add(this.getModuleByName(names[i]));
		modules = sorted;
		
		for(int i = 0; i < modules.size(); i++)
			modules.get(i).sort();
	}
}
