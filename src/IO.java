
import consumption.mes.controller.ModuleMESConsumptionCapturer;
import consumption.mes.controller.ToolgroupMESConsumptionCapturer;
import consumption.mes.entity.ModuleMESConsumption;
import consumption.mes.entity.ToolgroupMESConsumption;
import universal.entity.Map;
import universal.entity.Module;

public class IO {
	public static void main(String[] args){

		
		String start = "2015-12-01", end = "2015-12-06";
		Map map = FileLoader.getMap();
		//ModuleMESConsumption t = ModuleMESConsumptionCapturer.getConsumption(map.getModuleByName("DIFF"), start, end);
		ToolgroupMESConsumption t = ToolgroupMESConsumptionCapturer.getConsumption(map.getToolGroupByName("FTBM"), start, end);

		t.print("");
	}
}
