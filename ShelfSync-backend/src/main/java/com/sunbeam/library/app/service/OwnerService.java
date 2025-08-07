package com.sunbeam.library.app.service;

import com.sunbeam.library.app.dto.DashboardKpiDTO;
import com.sunbeam.library.app.entity.Book;
import com.sunbeam.library.app.repository.BookCopyRepository;
import com.sunbeam.library.app.repository.BookRepository;
import com.sunbeam.library.app.repository.IssueRecordRepository;
import com.sunbeam.library.app.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;

@Service
public class OwnerService {

    @Autowired private MemberRepository memberRepository;
    @Autowired private BookRepository bookRepository;
    @Autowired private BookCopyRepository bookCopyRepository;
    @Autowired private IssueRecordRepository issueRecordRepository;
    // PaymentRepository would be used for financial reports

    public DashboardKpiDTO getDashboardKpis() {
        long totalMembers = memberRepository.count();
        long totalBooks = bookRepository.count();
        long totalCopies = bookCopyRepository.count();
        long issuedCopies = issueRecordRepository.findAll().stream()
                .filter(ir -> ir.getReturnDate() == null)
                .count();

        // Calculate total asset value
        BigDecimal totalAssetValue = bookRepository.findAll().stream()
                .map(Book::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return DashboardKpiDTO.builder()
                .totalMembers(totalMembers)
                .totalBooks(totalBooks)
                .totalCopies(totalCopies)
                .issuedCopies(issuedCopies)
                .totalAssetValue(totalAssetValue)
                .build();
    }
    
    // In a real application, each report would have its own complex service method
    // For example: public FinancialReportDTO getFinancialReport(DateRange range) { ... }
}