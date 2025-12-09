package com.example.aquarium.controller;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.example.aquarium.dto.AdminDTO;
import com.example.aquarium.dto.FaqDTO;
import com.example.aquarium.dto.NoticeDTO;
import com.example.aquarium.dto.QnaDTO;
import com.example.aquarium.service.BoardService;
import com.example.aquarium.session.AdminSession;

import oracle.jdbc.proxy.annotation.Post;

@Controller
@RequestMapping("/admin")
public class AdminBoardController {

	@Autowired
	private BoardService boardService;

	@Autowired
	private AdminSession adminSession;


	// 관리자 qna 목록
	@GetMapping("/qnaList")
	public String adminQnaList(Model model) {

		List<QnaDTO> qnaList = boardService.workList();
		model.addAttribute("qnaList", qnaList);

		List<QnaDTO> qnacompleteList = boardService.completeList();
		model.addAttribute("qnacompleteList", qnacompleteList);

		return "admin/qnaList";
	}

	// 관리자 qna 질문 폼 페이지
	@GetMapping("/answerForm")
	public String answerForm(@RequestParam("qno") String qno, Model model) {
		QnaDTO qna = boardService.getQnaByQno(qno);
		model.addAttribute("qna", qna);
		return "admin/answerForm";
	}

	// 관리자 qna 답변 등록 처리
	@PostMapping("/answerUpdate")
	public String answerSubmit(QnaDTO qna, RedirectAttributes rttr) {
		qna.setQstatus("완료");
		boardService.updateAnswer(qna);
		rttr.addFlashAttribute("answerupdateMsg", "답변 등록 완료!!");
		return "redirect:/admin/qnaList";
	}

	@GetMapping("/faqList")
	public String redirectFaqListFirstPage() {
	    return "redirect:/admin/faqList/1";
	}
	
	// 관리자용 faq 목록 페이지
	@GetMapping("/faqList/{page}")
	public String adminFaqList(@PathVariable("page") int page,Model model) {
		
		int itemsPerPage = 5;

		int totalFaq = boardService.getFaqCount();
		int totalPages = (int) Math.ceil((double) totalFaq / itemsPerPage);
		
		List<FaqDTO> faqList = boardService.getFaqList(page, itemsPerPage); // faq 목록 조회
		model.addAttribute("faqList", faqList);
		model.addAttribute("totalPages", totalPages); // ✅ 꼭 필요
		model.addAttribute("currentPage", page); // ✅ 꼭 필요
		return "admin/faqList";
	}

	// 관리자용 faq 등록 폼 페이지
	@GetMapping("/faqForm")
	public String faqForm() {
		return "admin/faqForm";
	}

	// faq 등록 처리
	@PostMapping("/faqInsert")
	public String faqInsert(FaqDTO faq, RedirectAttributes rttr) {

		boardService.insertFaq(faq);
		rttr.addFlashAttribute("faqinsertMsg", "FAQ 등록 완료!!");

		return "redirect:/admin/faqList";
	}

	// faq 삭제 처리
	@PostMapping("/faqDelete")
	public String faqDelete(@RequestParam("fno") String fno) {

		boardService.deleteFaq(fno);
		return "redirect:/admin/faqList";
	}
	@GetMapping("/noticeList")
	public String redirectNoticeListFirstPage() {
	    return "redirect:/admin/noticeList/1";
	}
	

	// notice 목록 페이지
	@GetMapping("/noticeList/{page}")
	public String noticeList(@PathVariable("page") int page, Model model) {
		int itemsPerPage = 5;

		int totalNotices = boardService.getNoticeCount();
		int totalPages = (int) Math.ceil((double) totalNotices / itemsPerPage);

		List<NoticeDTO> noticeList = boardService.getNoticeList(page, itemsPerPage);

		model.addAttribute("noticeList", noticeList); // ✅ 꼭 필요
		model.addAttribute("totalPages", totalPages); // ✅ 꼭 필요
		model.addAttribute("currentPage", page); // ✅ 꼭 필요

		return "admin/noticeList"; // ✅ 반드시 이 JSP와 연결되어 있어야 함
	}

	// notice 공지사항 등록 처리
	@PostMapping("/noticeInsert")
	public String noticeInsert(NoticeDTO notice, RedirectAttributes rttr) {

		notice.setNdate(new Date());
		boardService.insertNotice(notice);

		// 수정사항
		rttr.addFlashAttribute("noticeinsertMsg", "공지사항 등록 완료!");

		return "redirect:/admin/noticeList/1";

	}

	// notice 공지사항 폼 페이지
	@GetMapping("/noticeForm")
	public String noticeForm() {
		return "/admin/noticeForm";
	}

	// notice 공지사항 삭제 처리
	@PostMapping("/noticeDelete")
	public String noticeDelet(@RequestParam("nid") String nid) {
		boardService.deleteNotice(nid);
		return "redirect:/admin/noticeList/1";
	}

}
