package consumption.mes.controller;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import utilities.DBConnect;

public class ToolgroupMinPowerCapturer {
	private static final String table = "ToolGroup_min_power";
	public static double getMinPower(String name, String status){
		String sql = "select power_min from \"" + table + "\" where toolgroup = '" + name + "' and status = '" + status + "'";
		Connection conn = DBConnect.getConn_240();
		
		try {
			PreparedStatement stat = conn.prepareStatement(sql);
			ResultSet rs = stat.executeQuery();
			if(rs.next())
				return rs.getDouble(1);
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return -1;
	}
	public static void renewMinPower(String name, String status, double minPower){
		String sql = "select * from \"" + table + "\" where toolgroup = '" + name + "' and status = '" + status + "'";
		Connection conn = DBConnect.getConn_240();
		try {
			PreparedStatement stat = conn.prepareStatement(sql);
			ResultSet rs = stat.executeQuery();
			if(rs.next())
				updateMinPower(name, status, minPower);
			else
				insertMinPower(name, status, minPower);
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	private static void updateMinPower(String name, String status, double minPower){
		String sql = "update \"" + table + "\" set power_min = " + minPower + " where toolgroup = '" + name + "' and status = '" + status + "'";
		Connection conn = DBConnect.getConn_240();
		
		try {
			PreparedStatement stat = conn.prepareStatement(sql);
			stat.executeUpdate();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	private static void insertMinPower(String name, String status, double minPower){
		String sql = "insert into \"" + table + "\" values('" + name + "', '" + status + "', " + minPower + ")";
		Connection conn = DBConnect.getConn_240();
		
		try {
			PreparedStatement stat = conn.prepareStatement(sql);
			stat.executeUpdate();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
