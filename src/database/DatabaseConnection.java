package database;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
public class DatabaseConnection 
{
	private Connection con = null;
	private Statement stmt = null;
	private ResultSet rs = null;
	public void ConnectToDatabase() throws Exception
	{
		String url = "jdbc:mysql://localhost:3306/ldb";
		String username = "root";
		String password = "960618";
		Class.forName("org.gjt.mm.mysql.Driver").newInstance();
		con = DriverManager.getConnection(url, username, password);
	}
	public void CloseDatabase() throws SQLException 
	{
		if (rs != null)
		{
			rs.close();
			rs = null;
		}
		if (stmt != null)
		{
			stmt.close();
			stmt = null;
		}
		if (con != null)
		{
			con.close();
			con = null;
		}
	}
	public ResultSet SelectedSql(String sql) throws SQLException
	{
		if (sql == null || sql.equals(" "))
			return null;
		sql = sql.trim();
		stmt = con.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE,ResultSet.CONCUR_READ_ONLY);
		rs = stmt.executeQuery(sql);
		return rs;
	}
	public void UpdateSQL(String sql) throws SQLException
	{
		stmt = con.createStatement();
		stmt.executeUpdate(sql);
	}
}