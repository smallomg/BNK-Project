package com.example.aquarium.dto;

import java.util.Date;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SearchLogDTO {
	private String sid;

	@NotBlank(message = "검색어는 비어 있을 수 없습니다.")
	private String keyword;

	private Date today;

	private int count;
}
