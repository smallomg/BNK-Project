package com.example.aquarium.dto;

import lombok.Data;
import java.util.Date;

@Data
public class QnaDTO {
	private String qno;
	private String id;
	private String qtitle;
	private String qcontent;
	private String qanswer;
	private Date qdate;
	private String qstatus;
	private String qtype;
}
