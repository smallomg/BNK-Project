package com.example.aquarium.dto;

import lombok.Data;
import java.util.Date;

@Data
public class NoticeDTO {

	private String nid;
	private String ntitle;
	private String ncontent;
	private Date ndate;
}
