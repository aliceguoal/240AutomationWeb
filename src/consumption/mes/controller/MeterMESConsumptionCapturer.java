package consumption.mes.controller;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.joda.time.DateTime;

import consumption.mes.entity.ConsumptionUnit;
import consumption.mes.entity.MeterMESConsumption;
import universal.entity.Meter;
import utilities.DBConnect;
import utilities.Utilities;

public class MeterMESConsumptionCapturer {
	private static final String table_prefix = "Combined_Meter_log_";
	public static MeterMESConsumption getConsumption(Meter meter, String start, String end){
		MeterMESConsumption meter_con = new MeterMESConsumption(meter);
		DateTime start_dt = Utilities.parseDateTime(start), end_dt = Utilities.parseDateTime(end);
		
		String table = Utilities.unionTable(table_prefix, start, end);
		String sql = "select mes, count(*), sum(total_kW)/60, avg(total_kW)/60 from " + table + " as a "
					+ " where a.ieee = '" + meter.getIeee() + "'"
					+ " and mes <> 'PRD-PROD'"
					+ " and time_stamp >= '" + Utilities.printDateTime(start_dt) + "' and time_stamp < '" + Utilities.printDateTime(end_dt.plusDays(1)) + "'"
					+ " group by mes";
		Connection conn = DBConnect.getConn_240();
		try {
			PreparedStatement stat = conn.prepareStatement(sql);
			ResultSet rs = stat.executeQuery();
			while(rs.next()){
				meter_con.getMes_consumption().put(rs.getString(1), new ConsumptionUnit(rs.getInt(2), rs.getDouble(3), rs.getDouble(4)));
				meter_con.setTotal_consumption(meter_con.getTotal_consumption() + rs.getDouble(3));
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return meter_con;
	}
}
