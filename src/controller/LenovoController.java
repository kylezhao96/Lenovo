package controller;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.mysql.jdbc.ResultSetMetaData;

import database.DatabaseConnection;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;;
@Controller
public class LenovoController 
{
	private String Username;
	private String Password;
	DatabaseConnection cndb = new DatabaseConnection();
	@RequestMapping(value = "/register", method = {RequestMethod.POST})
	public void Register(HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		Username = request.getParameter("Username");
		Password = request.getParameter("Password");
		PrintWriter out = response.getWriter();
		response.setContentType("text/html; charset=GB2312");
		request.setCharacterEncoding("utf-8");
		String sql = "Select * from UserInfo where username = "+"'"+Username+"'";
		try 
		{
			try
			{
				cndb.ConnectToDatabase();
			} catch (Exception e) 
			{
				e.printStackTrace();
			}
			ResultSet rs = cndb.SelectedSql(sql);
			if(rs.next())
			{
			        String json="{\"success\":\"0\"}";
					out.print(json);
					out.flush();
					out.close();
					cndb.CloseDatabase();
			}
			else 
			{
			    String json="{\"success\":\"1\"}";
				out.print(json);
				out.flush();
				out.close();
				cndb.CloseDatabase();
				sql = "insert into UserInfo(Username,Password)values('" + Username + "','" + Password + "')";
				try 
				{
					try
					{
						cndb.ConnectToDatabase();
					} catch (Exception e) 
					{
						e.printStackTrace();
					}
					cndb.UpdateSQL(sql);
					out.print("<script language='javaScript'> alert('Register Successfully !      ');</script>");
			        response.setHeader("refresh", "0;url=Login.jsp");
					cndb.CloseDatabase();
				} catch (SQLException e) 
				{
					e.printStackTrace();
				}
			}
		} catch (SQLException e) 
		{
			e.printStackTrace();
		}
	}
	@RequestMapping(value="/login", method = {RequestMethod.POST})
	public void Verify(HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		Username = request.getParameter("Username");
		Password = request.getParameter("Password");
		PrintWriter out = response.getWriter();
		response.setContentType("text/html; charset=GB2312");
		request.setCharacterEncoding("utf-8");
		String sql = "Select * from UserInfo where username = "+"'"+Username+"'";
		try 
		{
			try
			{
				cndb.ConnectToDatabase();
			} catch (Exception e) 
			{
				e.printStackTrace();
			}
			ResultSet rs = cndb.SelectedSql(sql);
			if(rs.next())
			{
				if(Password.equals(rs.getObject("password")))
				{
					String json="{\"success\":\"1\",\"username\":\"15689932430\",\"num\":\"1\"}";
					out.print(json);
					out.flush();
					out.close();
			    }
			    else
			    {
		
			        String json="{\"success\":\"2\"}";
					out.print(json);
					out.flush();
					out.close();
			    }
			}
			else 
			{
			
			    String json="{\"success\":\"3\"}";
				out.print(json);
				out.flush();
				out.close();
			}
			cndb.CloseDatabase();
		} catch (SQLException e) 
		{
			e.printStackTrace();
		}
	}
	@RequestMapping(value="/cart", method = {RequestMethod.POST})
	public void ListCart(HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		request.setCharacterEncoding("utf-8");
		String Json = request.getParameter("jsonstr");
		JSONObject jsonObj = JSONObject.fromObject(Json); 
		Username =jsonObj.getString("Username");
		System.out.println(Username);
		PrintWriter out = response.getWriter();
		response.setContentType("text/html; charset=GB2312");
		String sql = "Select ProductId, Amount from UserCart where username = "+"'"+Username+"'";
		try 
		{
			try
			{
				cndb.ConnectToDatabase();
			} catch (Exception e) 
			{
				e.printStackTrace();
			}
			ResultSet rs = cndb.SelectedSql(sql);
			String[] ProductId = new String[1000];
			String[] Amount =new String[1000];
			System.out.println(rs.getString("productid"));
			int i=0;
			while(rs.next())
			{
				ProductId[i]=rs.getString("ProductId");
				Amount[i++]=rs.getString("Amount");
			}
			JSONArray array = new JSONArray();
			for(i=0;i<rs.getRow();i++)
			{
				sql = "Select * from ProductInfo where ProductId = "+"'"+ProductId[i]+"'";
				ResultSet RS = cndb.SelectedSql(sql);	  
				java.sql.ResultSetMetaData metaData = RS.getMetaData();  
				int columnCount = metaData.getColumnCount();   
				while (RS.next()) 
				{  
					JSONObject JsonObj = new JSONObject();  
					for (int j = 1; i <= columnCount; j++)
					{  
						String columnName =metaData.getColumnLabel(j);  
						String value = rs.getString(columnName);  
						JsonObj.put(columnName, value);  
					}
					JsonObj.put("amount", Amount[i]);
					array.add(jsonObj);   
				}
			}
			System.out.println(array.toString());
			out.print("{'produtid':'12345678'}");
			out.flush();
			out.close();
			cndb.CloseDatabase();
		} catch (SQLException e) 
		{
			e.printStackTrace();
		}
	}
	@RequestMapping(value="/addcart", method = {RequestMethod.POST})
	public void AddCart(HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		String Json = request.getParameter("data");
		JSONObject jsonObj = JSONObject.fromObject(Json); 
		Username =jsonObj.getString("Username");
		String ProductName = jsonObj.getString("ProductName");
		String Specification = jsonObj.getString("Specification");
		String UnitPrice = jsonObj.getString("UnitPrice");
		String Amount = jsonObj.getString("Amount");
		PrintWriter out = response.getWriter();
		response.setContentType("text/html; charset=GB2312");
		request.setCharacterEncoding("utf-8");
		String sql = "Select * from UserCart where ProductName = "+"'"+ProductName+"'";
		try 
		{
			try
			{
				cndb.ConnectToDatabase();
			} catch (Exception e) 
			{
				e.printStackTrace();
			}
			ResultSet rs = cndb.SelectedSql(sql);
			if(rs.next())
			{
			       sql="update UserCart set Amount=Amount+1 where ProductName = "+"'"+ProductName+"'";
			       cndb.UpdateSQL(sql);
			}
			else 
			{
				sql = "insert into UserCart(Username,productname, specification, unitprice, amount)values('" + Username + "','" + ProductName + "','" + Specification + "','" + UnitPrice + "','" + Amount + "')";
				try 
				{
					try
					{
						cndb.ConnectToDatabase();
					} catch (Exception e) 
					{
						e.printStackTrace();
					}
					cndb.UpdateSQL(sql);
					cndb.CloseDatabase();
				} catch (SQLException e) 
				{
					e.printStackTrace();
				}
			}
		} catch (SQLException e) 
		{
			e.printStackTrace();
		}
	}
	@RequestMapping(value="/deletecart", method = {RequestMethod.POST})
	public void DeleteCart(HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		String Json = request.getParameter("data");
		JSONObject jsonObj = JSONObject.fromObject(Json); 
		Username =jsonObj.getString("Username");
		String ProductName = jsonObj.getString("ProductName");
		response.setContentType("text/html; charset=GB2312");
		request.setCharacterEncoding("utf-8");
		String sql = "Delete * from UserCart where ProductName = "+"'"+ProductName+"' and username = "+"'"+Username+"'";
		try 
		{
			try
			{
				cndb.ConnectToDatabase();
			} catch (Exception e) 
			{
				e.printStackTrace();
			}
		cndb.UpdateSQL(sql);		
		} catch (SQLException e) 
		{
			e.printStackTrace();
		}
	}
	@RequestMapping(value="/getspecific", method = {RequestMethod.POST})
	public void GetInfo(HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		String Json = request.getParameter("data");
		JSONObject jsonObj = JSONObject.fromObject(Json); 
		String ProductName =jsonObj.getString("ProductName");
		PrintWriter out = response.getWriter();
		response.setContentType("text/html; charset=GB2312");
		request.setCharacterEncoding("utf-8");
		String sql = "Select * where ProductName = "+"'"+ ProductName +"'";
		try 
		{
			try
			{
				cndb.ConnectToDatabase();
			} catch (Exception e) 
			{
				e.printStackTrace();
			}
			ResultSet rs = cndb.SelectedSql(sql);
			JSONArray array = new JSONArray();  
			java.sql.ResultSetMetaData metaData = rs.getMetaData();  
			int columnCount = metaData.getColumnCount();   
			while (rs.next()) 
			{  
				JSONObject JsonObj = new JSONObject();  
				for (int i = 1; i <= columnCount; i++)
				{  
					String columnName =metaData.getColumnLabel(i);  
					String value = rs.getString(columnName);  
					JsonObj.put(columnName, value);  
				}   
				array.add(jsonObj);   
			}  	   ;
			out.print(array.toString());
			out.flush();
			out.close();
			cndb.CloseDatabase();
		} catch (SQLException e) 
		{
			e.printStackTrace();
		}
	}
}