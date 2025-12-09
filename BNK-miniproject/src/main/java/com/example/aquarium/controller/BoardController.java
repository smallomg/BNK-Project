package com.example.aquarium.controller;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.example.aquarium.dto.FaqDTO;
import com.example.aquarium.dto.JoinDTO;
import com.example.aquarium.dto.NoticeDTO;
import com.example.aquarium.dto.QnaDTO;
import com.example.aquarium.dto.SearchLogDTO;
import com.example.aquarium.service.BoardService;
import com.example.aquarium.session.MemberSession;

@Controller
@RequestMapping("/board")
public class BoardController {

	@Autowired
	private BoardService boardService;
	@Autowired
	private MemberSession membersession;

	// qna 등록 폼 페이지
	@GetMapping("/qnaForm")
	public String qnaForm() {
		return "board/qnaForm"; // 폼 페이지로 이동
	}

	// qna 등록 처리
	@PostMapping("/qnaInsert")
	public String submitQna(QnaDTO qna, RedirectAttributes rttr) {

		// 로그인된 사용자의 아이디를 QnA에 설정
		// 위에 나중에 임의로 넣은 값을 빼고 return만 살리면 됨
		qna.setId(membersession.getId());

		// 기본값 설정
		// 사용자가 qna 등록한 순간 qstatust 대기 입력
		qna.setQstatus("대기");
		// 사용자가 qna 등록한 순간 qdate 현재 날짜 입력
		qna.setQdate(new Date());

		// 등록 처리
		boardService.insertQna(qna);

		rttr.addFlashAttribute("msg", "QNA 등록 완료!");

		// 등록 후 목록 페이지로 이동
		return "redirect:/board/qnaList/1";
	}

	// qna 페이지
	@GetMapping("/qnaList/{page}")
	public String qnaList(@PathVariable("page") int page, Model model, RedirectAttributes rttr) {

		if (!membersession.isLoggedIn() || membersession.getId() == null) {
			rttr.addFlashAttribute("msg","로그인 후 이용해주세요");
			return "redirect:/loginForm";
		}
		
		
		// 세션으로 받은 아이디를 목록 조회 해야함
		String userId = membersession.getId();

		int itemsPerPage = 5;

		int totalQna = boardService.getQnaCount(userId);
		int totalPages = (int) Math.ceil((double) totalQna / itemsPerPage);
		List<QnaDTO> qnaList = boardService.getQnaList(userId, page, itemsPerPage); // qna 목록 조회

		model.addAttribute("qnaList", qnaList);

		model.addAttribute("totalPages", totalPages); // ✅ 꼭 필요
		model.addAttribute("currentPage", page); // ✅ 꼭 필요

		return "board/qnaList";
	}

	// qnaList 페이지의 제목을 눌러 상세페이지 들어가는 용
	@GetMapping("/view")
	public String qnaDetail(@RequestParam("qno") String qno, Model model) {
		QnaDTO qna = boardService.getQnaByQno(qno); // qna 상세 조회
		model.addAttribute("qna", qna);
		return "board/qnaDetail";
	}

//	// faq 페이지
//	@GetMapping("/faqList")
//	public String faqList(Model model) {
//		List<FaqDTO> faqList = boardService.getFaqList();// faq 목록 조회
//		model.addAttribute("faqList", faqList);
//		return "board/faqList";
//	}

	
	@GetMapping("/noticeList")
	public String noticenomemberList() {
		return "board/noticeList/1";
	}
	
	@GetMapping("/service_center")
	public String service_centernomemberList() {
		return "board/service_center/1";
	}
	
	
	// notice 페이지
	@GetMapping("/noticeList/{page}")
	public String noticeList(@PathVariable("page") int page, Model model) {
		int itemsPerPage = 5;

		int totalNotices = boardService.getNoticeCount();
		int totalPages = (int) Math.ceil((double) totalNotices / itemsPerPage);

		List<NoticeDTO> noticeList = boardService.getNoticeList(page, itemsPerPage);

		model.addAttribute("noticeList", noticeList); // ✅ 꼭 필요
		model.addAttribute("totalPages", totalPages); // ✅ 꼭 필요
		model.addAttribute("currentPage", page); // ✅ 꼭 필요

		return "board/noticeList"; // ✅ 반드시 이 JSP와 연결되어 있어야 함
	}

	// 고객센터 페이지
	@GetMapping("/service_center/{page}")
	public String customerCenter(@PathVariable("page") int page, Model model) {
		// faq 목록

		// 수정사항
		int itemsPerPage = 5;

		int totalFaq = boardService.getFaqCount();
		int totalPages = (int) Math.ceil((double) totalFaq / itemsPerPage);

		List<FaqDTO> faqList = boardService.getFaqList(page, itemsPerPage);

		model.addAttribute("faqList", faqList);
		model.addAttribute("totalPages", totalPages); // ✅ 꼭 필요
		model.addAttribute("currentPage", page); // ✅ 꼭 필요

		// 수정사항
		// 사용자 qna 목록 조회하기 위해서 session에 있는 id 가져와야함
		String userId = membersession.getId();

		List<QnaDTO> qnaList = boardService.getQnaList(userId, page, itemsPerPage); // qna 목록 조회
		model.addAttribute("qnaList", qnaList);

		// 수정사항 인기 검색어 로그 목록
		List<SearchLogDTO> loglist = boardService.getLogList();

		model.addAttribute("loglist", loglist);

		return "board/service_center";
	}

}
