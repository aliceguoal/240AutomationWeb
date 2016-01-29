package utilities;

import java.text.SimpleDateFormat;

import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

public class Utilities {
	private static DateTimeFormatter fm1 = DateTimeFormat.forPattern("yyyy-MM-dd");
	private static DateTimeFormatter fm2 = DateTimeFormat.forPattern("yyyy-MM-dd HH:mm:ss.SSS");
	private static DateTimeFormatter fm3 = DateTimeFormat.forPattern("yyyy-MM-dd HH:mm:ss");
	
	public static DateTime parseDateTime(String t){

		try {
			return fm1.parseDateTime(t);
		}catch (Exception e1){
			try{
				return fm2.parseDateTime(t);
			}catch (Exception e2){
				return fm3.parseDateTime(t);
			}
		}
	}
	
	public static String printDate(DateTime t){
		return fm1.print(t);
	}
	public static String printDateTime(DateTime t){
		return fm3.print(t);
	}
	public static String completeTable(String table_prefix, String time_stamp){
		return table_prefix + new SimpleDateFormat("yyyy_MM").format(Utilities.parseDateTime(time_stamp).toDate());
	}
	
	public static String unionTable(String table_prefix, String start, String end){
		DateTime start_dt = Utilities.parseDateTime(start), end_dt = Utilities.parseDateTime(end);
		if(start_dt.getYear() == end_dt.getYear() && start_dt.getMonthOfYear() == end_dt.getMonthOfYear())
			return "\"" + completeTable(table_prefix, start) + "\"";
		else{
			String union = "(";
			while(!(start_dt.getMonthOfYear() == end_dt.getMonthOfYear() && start_dt.getYear() == end_dt.getYear())){
				union += " (select * from \"" + Utilities.completeTable(table_prefix, Utilities.printDate(start_dt)) + "\") union ";
				start_dt = start_dt.plusMonths(1);
			}
			union += " (select * from \"" + Utilities.completeTable(table_prefix, Utilities.printDate(start_dt)) + "\"))";
			return union;
		}
	}
}
