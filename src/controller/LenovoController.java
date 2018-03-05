package controller;
import sdkimplement.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

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
				HttpSession session = request.getSession();
				String code = (String)session.getAttribute("code");
				if(code.equals(request.getParameter("code")))
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
				else
				{
					String json="{\"success\":\"2\"}";
					out.print(json);
					out.flush();
					out.close();
					cndb.CloseDatabase();
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
		int row = 0;
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
					sql = "Select * from usercart where username = "+"'"+Username+"'";
					try 
					{
						try
						{
							cndb.ConnectToDatabase();
						} catch (Exception e) 
						{
							e.printStackTrace();
						}
						ResultSet RS = cndb.SelectedSql(sql);
						RS.last();
						row = RS.getRow();
					} catch (SQLException e) 
					{
						e.printStackTrace();
					}
					cndb.CloseDatabase();
					String json="{\"success\":\"1\",\"username\":\""+ Username +"\",\"num\":\""+ row +"\"}";
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
	@RequestMapping(value="/mlogin", method = {RequestMethod.POST})
	public void mVerify(HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		Username = request.getParameter("Username");
		Password = request.getParameter("Password");
		PrintWriter out = response.getWriter();
		response.setContentType("text/html; charset=GB2312");
		request.setCharacterEncoding("utf-8");
		int row = 0;
		String sql = "Select * from AdmInfo where username = "+"'"+Username+"'";
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
					
					String json="{\"success\":\"1\",\"username\":\""+ Username +"\",\"pwd\":\"534\"}";
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
		request.setCharacterEncoding("UTF-8");
		response.setContentType("text/html; charset=UTF-8");
		String Json = request.getParameter("jsonstr");
		JSONObject jsonObj = JSONObject.fromObject(Json); 
		Username =jsonObj.getString("Username");
		PrintWriter out = response.getWriter();
		
		String sql = "Select ID, amount,name,email,postcode,address from usercart where username = "+"'"+Username+"'";
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
			rs.last();
			int row = rs.getRow();
			rs.first();
			String[] Id = new String[1000];
			String[] Amount =new String[1000];
			String[] Email = new String[1000];
			String[] Name =new String[1000];
			String[] Postcode =new String[1000];
			String[] Address =new String[1000];
			int i=0;
			Id[i]=rs.getString("ID");
			Amount[i]=rs.getString("amount");
			Name[i]=rs.getString("name");
			Email[i]=rs.getString("email");
			Postcode[i]=rs.getString("postcode");
			Address[i++]=rs.getString("address");
			while(rs.next())
			{
				Id[i]=rs.getString("ID");
				Amount[i]=rs.getString("amount");
				Name[i]=rs.getString("name");
				Email[i]=rs.getString("email");
				Postcode[i]=rs.getString("postcode");
				Address[i++]=rs.getString("address");
			}
			JSONArray array = new JSONArray();
			for(i=0;i<row;i++)
			{
				sql = "Select * from ProductInfo where id = "+"'"+Id[i]+"'";
				ResultSet RS = cndb.SelectedSql(sql);	  
				java.sql.ResultSetMetaData metaData = RS.getMetaData();  
				int columnCount = metaData.getColumnCount();
				while (RS.next()) 
				{  
					JSONObject JsonObj = new JSONObject();  
					for (int j = 1; j <= columnCount; j++)
					{  
						String columnName =metaData.getColumnLabel(j);  
						String value = RS.getString(columnName);  
						JsonObj.put(columnName, value);
					}
					JsonObj.put("amount", Amount[i]);
					JsonObj.put("name", Name[i]);
					JsonObj.put("email", Email[i]);
					JsonObj.put("postcode", Postcode[i]);	
					JsonObj.put("address", Address[i]);
					array.add(JsonObj);
				}
			}
			out.print(array.toString());
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
		response.setContentType("text/html; charset=utf-8");
		request.setCharacterEncoding("utf-8");
		String Json = request.getParameter("jsonstr");
		JSONObject jsonObj = JSONObject.fromObject(Json); 
		Username =jsonObj.getString("Username");
		String ProductId = jsonObj.getString("productid");
		String Id = jsonObj.getString("id");
		String amount = jsonObj.getString("num");
		String Name = jsonObj.getString("name");
		String Email = jsonObj.getString("email");
		String Address = jsonObj.getString("address");
		String Postcode = jsonObj.getString("postcode");
		PrintWriter out = response.getWriter();
		String sql = "Select * from UserCart where id = "+"'"+Id+"'";
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
//			       sql="update UserCart set amount=amount+"+"'"+amount+"' where username = "+"'"+Username+"' and id="+"'"+Id+"' and name="+"'"+Name+"' and email="+"'"+Email+"' and address="+"'"+Address+"' and postcode="+"'"+Postcode+"'";
//			       cndb.UpdateSQL(sql);
				cndb.CloseDatabase();
				String json="{\"success\":\"1\"}";
				out.print(json);
				out.flush();
				out.close();
			}
			else 
			{
				sql = "insert into UserCart(Username,productid,amount,id,name,email,address,postcode)values('" + Username + "','" + ProductId + "','" + amount + "','" + Id + "','" + Name + "','" + Email + "','" + Address+ "','" + Postcode + "')";
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
	
	@RequestMapping(value="/getproduct", method = {RequestMethod.POST})
	public void getproduct(HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		response.setContentType("text/html; charset=GB2312");
		request.setCharacterEncoding("utf-8");
		String Json = request.getParameter("jsonstr");
		JSONObject jsonObj = JSONObject.fromObject(Json); 
		String Pwd =jsonObj.getString("pwd");
		PrintWriter out = response.getWriter();
		System.out.print(Pwd);
		if(!Pwd.equals("534")){
				String json="{\"error\":\"1\"}";
				out.print(json);
				out.flush();
				out.close();
			}
		else 
		{
			String sql = "Select * from productinfo order by id";
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
					array.add(JsonObj);
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
	
	
	@RequestMapping(value="/deletecart", method = {RequestMethod.POST})
	public void DeleteCart(HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		response.setContentType("text/html; charset=GB2312");
		request.setCharacterEncoding("utf-8");
		String Json = request.getParameter("jsonstr");
		JSONObject jsonObj = JSONObject.fromObject(Json); 
		Username =jsonObj.getString("Username");
		String Id = jsonObj.getString("id");
		
		String sql = "Delete from UserCart where id = "+"'"+Id+"' and username = "+"'"+Username+"'";
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
	@RequestMapping(value="/updatecart", method = {RequestMethod.POST})
	public void UpdateCart(HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		response.setContentType("text/html; charset=utf-8");
		request.setCharacterEncoding("utf-8");
		String Json = request.getParameter("jsonstr");
		JSONObject jsonObj = JSONObject.fromObject(Json); 
		Username =jsonObj.getString("Username");
		String Id = jsonObj.getString("id");
		String Amount = jsonObj.getString("amount");
		PrintWriter out = response.getWriter();
		String sql = "update UserCart set amount ="+"'"+Amount+"'  where id = "+"'"+Id+"' and  username =" + "'"+Username+"'";
		System.out.print(sql);
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
	
	@RequestMapping(value="/getspecific", method = {RequestMethod.POST})
	public void GetInfo(HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		response.setContentType("text/html; charset=GB2312");
		request.setCharacterEncoding("utf-8");
		String Json = request.getParameter("jsonstr");
		JSONObject jsonObj = JSONObject.fromObject(Json); 
		String ProductId =jsonObj.getString("productid");
		PrintWriter out = response.getWriter();
		
		String sql = "Select * from productinfo where productid = "+"'"+ ProductId +"'";
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
				array.add(JsonObj);
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
	
	@RequestMapping(value="/changespecific", method = {RequestMethod.POST})
	public void ChangeInfo(HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		response.setContentType("text/html; charset=GB2312");
		request.setCharacterEncoding("utf-8");
		String Json = request.getParameter("jsonstr");
		JSONObject jsonObj = JSONObject.fromObject(Json); 
		String ProductId =jsonObj.getString("productid");
		String Id =jsonObj.getString("id");
		PrintWriter out = response.getWriter();
		
		String sql = "Select * from productinfo where productid = "+"'"+ ProductId +"'and id="+"'"+ Id +"' ";
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
				array.add(JsonObj);
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
	
	@RequestMapping(value="/postsearch", method = {RequestMethod.POST})
	public void Search(HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		response.setContentType("text/html; charset=GB2312");
		request.setCharacterEncoding("utf-8");
		PrintWriter out = response.getWriter();
		String Json = request.getParameter("jsonstr");	
		JSONArray JsonArray = JSONArray.fromObject(Json);
		String sql = "select * from productinfo where ";
		for(int i=0;i<JsonArray.size();i++)
		{
			JSONObject JsonObj = (JSONObject)JsonArray.opt(i);
			if(JsonObj.getString("category").equals("description"))
				sql =sql + JsonObj.getString("category")+" like '%"+JsonObj.getString("option")+"%' and ";
			else if(JsonObj.getString("category").equals("unitprice"))
				sql =sql + JsonObj.getString("category")+" >= "+JsonObj.getString("option").substring(0, JsonObj.getString("option").indexOf('-'))+" and " + JsonObj.getString("category")+" <= "+JsonObj.getString("option").substring(JsonObj.getString("option").indexOf('-')+1,JsonObj.getString("option").length()-1) + " and ";
			else
				sql =sql + JsonObj.getString("category")+" = '"+JsonObj.getString("option")+"' and ";	
		}
		sql = sql.substring(0, sql.length()-4);
		System.out.println(sql);
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
				array.add(JsonObj);
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
	
	
	
	@RequestMapping(value="/postinorder", method = {RequestMethod.POST})
	public void Searchinorder(HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		response.setContentType("text/html; charset=GB2312");
		request.setCharacterEncoding("utf-8");
		PrintWriter out = response.getWriter();
		String Json = request.getParameter("jsonstr");	
		JSONArray JsonArray = JSONArray.fromObject(Json);
		String sql = "select * from productinfo where ";
		for(int i=0;i<JsonArray.size();i++)
		{
			JSONObject JsonObj = (JSONObject)JsonArray.opt(i);
			if(JsonObj.getString("category").equals("description"))
				sql =sql + JsonObj.getString("category")+" like '%"+JsonObj.getString("option")+"%' and ";
			else if(JsonObj.getString("category").equals("unitprice"))
				sql =sql + JsonObj.getString("category")+" >= "+JsonObj.getString("option").substring(0, JsonObj.getString("option").indexOf('-'))+" and " + JsonObj.getString("category")+" <= "+JsonObj.getString("option").substring(JsonObj.getString("option").indexOf('-')+1,JsonObj.getString("option").length()-1) + " and ";
			else
				sql =sql + JsonObj.getString("category")+" = '"+JsonObj.getString("option")+"' and ";	
		}
		sql = sql.substring(0, sql.length()-4);
		sql=sql+" order by unitprice";
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
				array.add(JsonObj);
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
	
	@RequestMapping(value="/sms", method = {RequestMethod.POST})
	public void SMSSending (HttpServletRequest request, HttpServletResponse response)
	{
		String Json = request.getParameter("jsonstr");
		JSONObject jsonObj = JSONObject.fromObject(Json); 
		Username =jsonObj.getString("Username");
		String code = "";
		for (int i = 0 ; i < 4 ; i ++) 
			code = code + String.valueOf((int) Math.floor(Math.random() * 9 + 1));
		SDKimplement.SMS(Username,code);
		System.out.println(code);
		HttpSession session = request.getSession();
		session.setAttribute("code", code);             
		session.setMaxInactiveInterval(60);
	}
	
	@RequestMapping(value="/deleteproduct", method = {RequestMethod.POST})
	public void DeleteProduct(HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		response.setContentType("text/html; charset=GB2312");
		request.setCharacterEncoding("utf-8");
		String Json = request.getParameter("jsonstr");
		JSONObject jsonObj = JSONObject.fromObject(Json); 
		String Id = jsonObj.getString("id");
		
		String sql = "Delete from productinfo where id = "+"'"+Id+"'";
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
	
	@RequestMapping(value="/updateproduct", method = {RequestMethod.POST})
	public void UpdateProduct(HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		response.setContentType("text/html; charset=utf-8");
		request.setCharacterEncoding("utf-8");
		String Json = request.getParameter("jsonstr");
		JSONObject jsonObj = JSONObject.fromObject(Json); 
		String Id = jsonObj.getString("id");
		String Attr= jsonObj.getString("attr");
		String Cont=jsonObj.getString("cont");
		PrintWriter out = response.getWriter();
		String sql = "update Productinfo set "+Attr+" ="+"'"+Cont+"'  where id = "+"'"+Id+"'";
		System.out.print(sql);
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
	
	@RequestMapping(value="/addproduct", method = {RequestMethod.POST})
	public void AddProduct(HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		response.setContentType("text/html; charset=utf-8");
		request.setCharacterEncoding("utf-8");
		String Json = request.getParameter("jsonstr");
		JSONObject jsonObj = JSONObject.fromObject(Json); 
		String Id = jsonObj.getString("id");
		String Productname= jsonObj.getString("productname");
		String Productid=jsonObj.getString("productid");
		String Color=jsonObj.getString("color");
		String Cpu=jsonObj.getString("cpu");
		String Memory=jsonObj.getString("memory");
		String Harddisk=jsonObj.getString("harddisk");
		String Type=jsonObj.getString("type");
		String Size=jsonObj.getString("size");
		String Dpi=jsonObj.getString("dpi");
		String Unitprice=jsonObj.getString("unitprice");
		String Pic1=jsonObj.getString("pic1");
		String Pic2=jsonObj.getString("pic2");
		String Pic3=jsonObj.getString("pic3");
		String Pic4=jsonObj.getString("pic4");
		String Pic5=jsonObj.getString("pic5");
		String Description=jsonObj.getString("description");
		
		PrintWriter out = response.getWriter();
		String sql = "insert into Productinfo(id,productname,productid,color,cpu,memory,harddisk,type,size,dpi,pic1,pic2,pic3,pic4,pic5,unitprice,description)values('" + Id + "','" + Productname + "','" + Productid + "','" + Color+ "','" + Cpu+ "','" + Memory + "','" + Harddisk+ "','" + Type + "','" + Size + "','" + Dpi + "','" + Pic1 + "','" + Pic2 + "','" + Pic3 + "','" + Pic4 + "','" + Pic5 + "','" + Unitprice + "','" + Description + "')";
		System.out.print(sql);
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
	
}