package com.sunbeam.library.app.repository;

import com.sunbeam.library.app.entity.CartItem;
import com.sunbeam.library.app.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByMember(Member member);
    Optional<CartItem> findByBookCopyId(Long bookCopyId);
    void deleteByMember(Member member);
}