package com.example.aquarium.dto;

import java.util.Date;
import lombok.Data;

@Data
public class OrderDTO {
	private String ono;
	private String id;
	private int totalprice;
	private String ophone;
	private Date odate;
}
