package consumption.mes.controller;

import consumption.mes.entity.ModuleMESConsumption;
import universal.entity.Module;

public class ModuleMESConsumptionCapturer {
	public static ModuleMESConsumption getConsumption(Module module, String start, String end){
		ModuleMESConsumption module_con = new ModuleMESConsumption(module);
		for(int i = 0; i < module.getToolgroups().size(); i++)
			module_con.getToolgroups().add(ToolgroupMESConsumptionCapturer.getConsumption(module.getToolgroups().get(i), start, end));
		module_con.consolidate();
		return module_con;
	}
}
