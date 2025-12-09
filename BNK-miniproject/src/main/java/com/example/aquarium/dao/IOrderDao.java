package com.example.aquarium.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.aquarium.dto.ItemDTO;
import com.example.aquarium.dto.OrderDTO;
import com.example.aquarium.dto.TicketDTO;

@Mapper
public interface IOrderDao {

    // 전체 이용권 조회
    List<TicketDTO> selectAllTickets();

    // 이용권 가격 조회
    int getTicketPrice(@Param("tno") String tno);

    // 주문 저장
    void insertOrder(OrderDTO order);

    // 주문 아이템 저장
    void insertItem(ItemDTO item);

    // 주문번호 마지막 번호 조회
    String getLastOrderNo();

    // 회원별 주문내역 조회 (조인)
    List<Map<String, Object>> selectOrderItemsByMemberId(@Param("id") String id);
}
