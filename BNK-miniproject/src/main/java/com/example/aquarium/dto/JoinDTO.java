package com.example.aquarium.dto;

import lombok.Data;

@Data
public class JoinDTO {
    private String title;   // qtitle, ftitle, ntitle 공통 매핑
    private String content; // qcontent, fcontent, ncontent 공통 매핑
    private String source;  // 'QNA', 'FAQ', 'NOTICE' 출처 구분
}

