package utilities;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnect {
	private static Connection conn_240, conn_mes;
	private static final String POSTGRES_DB_DRIVER = "org.postgresql.Driver";
	private static final String ORACLE_DB_DRIVER = "oracle.jdbc.driver.OracleDriver";

	public static Connection getConn_240(){
		try {
			if(conn_240 == null || conn_240.isClosed())
				connect240();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return conn_240;
	}

	private static void connect240() {
		try {
			Class.forName(POSTGRES_DB_DRIVER);
			conn_240 = DriverManager.getConnection("jdbc:postgresql://172.20.194.233:5432/GreenDC","ecoadm", "ev093qer");
			//conn_240 = DriverManager.getConnection("jdbc:postgresql://127.0.0.1:5432/ems3","ecoadm", "ev093qer");
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}

	public static void setConn_240(Connection conn_240) {
		DBConnect.conn_240 = conn_240;
	}

	public static Connection getConn_mes() {
		try {
			if(conn_mes == null || conn_mes.isClosed())
				connectmes();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return conn_mes;
	}

	private static void connectmes() {
		try{
			Class.forName(ORACLE_DB_DRIVER);			
		} catch (ClassNotFoundException e) {
			System.out.println(e.getMessage());
		}

		int trycount = 1;
		try {
			while (trycount <= 5 && (conn_mes == null || conn_mes.isClosed())){
				try{	
					conn_mes = DriverManager.getConnection("jdbc:oracle:thin:@localhost:1521:xe", "ecoadmin", "ev111qer");
					//conn_mes = DriverManager.getConnection("jdbc:oracle:thin:@//10.89.227.44:1522/F7MSDB_TAF","F07EVC_USER","F7EVC_128USR");
				} catch (SQLException e){
					System.out.println("Try " + trycount + ": " + e.getMessage());
				}
				trycount++;
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public static void setConn_mes(Connection conn_mes) {
		DBConnect.conn_mes = conn_mes;
	}

	
}
