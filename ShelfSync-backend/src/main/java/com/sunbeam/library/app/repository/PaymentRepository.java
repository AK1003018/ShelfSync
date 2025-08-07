package com.sunbeam.library.app.repository;

import com.sunbeam.library.app.entity.Member;
import com.sunbeam.library.app.entity.Payment;
import com.sunbeam.library.app.enums.PaymentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findTopByMemberAndTypeOrderByDueDateDesc(Member member, PaymentType type);
    List<Payment> findByMemberOrderByTransactionTimeDesc(Member member);
}