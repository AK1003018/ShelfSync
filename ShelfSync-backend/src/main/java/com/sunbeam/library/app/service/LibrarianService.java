package com.sunbeam.library.app.service;

import com.sunbeam.library.app.dto.AddBookRequestDTO;
import com.sunbeam.library.app.dto.AddCopyRequestDTO;
import com.sunbeam.library.app.entity.Book;
import com.sunbeam.library.app.entity.BookCopy;
import com.sunbeam.library.app.entity.IssueRecord;
import com.sunbeam.library.app.entity.Member;
import com.sunbeam.library.app.entity.Payment;
import com.sunbeam.library.app.enums.BookStatus;
import com.sunbeam.library.app.enums.PaymentType;
import com.sunbeam.library.app.repository.BookCopyRepository;
import com.sunbeam.library.app.repository.BookRepository;
import com.sunbeam.library.app.repository.IssueRecordRepository;
import com.sunbeam.library.app.repository.MemberRepository;
import com.sunbeam.library.app.repository.PaymentRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
public class LibrarianService {

    @Autowired private MemberRepository memberRepository;
    @Autowired private BookRepository bookRepository;
    @Autowired private BookCopyRepository bookCopyRepository;
    @Autowired private IssueRecordRepository issueRecordRepository;
    @Autowired private PaymentRepository paymentRepository;

    private static final int LENDING_PERIOD_DAYS = 7;
    private static final BigDecimal FINE_PER_DAY = new BigDecimal("5.00");

    @Transactional
    public Book addBook(AddBookRequestDTO requestDTO) {
        Book book = new Book();
        book.setName(requestDTO.getName());
        book.setAuthor(requestDTO.getAuthor());
        book.setSubject(requestDTO.getSubject());
        book.setIsbn(requestDTO.getIsbn());
        book.setPrice(requestDTO.getPrice());
        return bookRepository.save(book);
    }

    @Transactional
    public List<BookCopy> addCopies(AddCopyRequestDTO requestDTO) {
        Book book = bookRepository.findById(requestDTO.getBookId())
                .orElseThrow(() -> new EntityNotFoundException("Book not found with ID: " + requestDTO.getBookId()));

        List<BookCopy> newCopies = new ArrayList<>();
        for (int i = 0; i < requestDTO.getNumberOfCopies(); i++) {
            BookCopy copy = new BookCopy();
            copy.setBook(book);
            copy.setRack(requestDTO.getRack());
            copy.setStatus(BookStatus.AVAILABLE);
            newCopies.add(copy);
        }

        return bookCopyRepository.saveAll(newCopies);
    }

    @Transactional
    public IssueRecord issueBook(long memberId, long copyId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new EntityNotFoundException("Member not found"));

        BookCopy copy = bookCopyRepository.findById(copyId)
                .orElseThrow(() -> new EntityNotFoundException("Book Copy not found"));

        // Rule 1: Check if copy is available
        if (copy.getStatus() != BookStatus.AVAILABLE) {
            throw new RuntimeException("Book copy is not available for issue.");
        }

        // Rule 2: Check if member is a paid user
        boolean isPaid = paymentRepository.findTopByMemberAndTypeOrderByDueDateDesc(member, PaymentType.MEMBERSHIP)
                .map(payment -> payment.getDueDate().isAfter(LocalDate.now()))
                .orElse(false);

        if (!isPaid) {
            throw new RuntimeException("Member has not paid the membership fee.");
        }

        // Process the issue
        copy.setStatus(BookStatus.ISSUED);
        bookCopyRepository.save(copy);

        IssueRecord issueRecord = new IssueRecord();
        issueRecord.setMember(member);
        issueRecord.setBookCopy(copy);
        issueRecord.setIssueDate(LocalDate.now());
        issueRecord.setDueDate(LocalDate.now().plusDays(LENDING_PERIOD_DAYS));

        return issueRecordRepository.save(issueRecord);
    }

    @Transactional
    public IssueRecord returnBook(long copyId) {
        BookCopy copy = bookCopyRepository.findById(copyId)
                .orElseThrow(() -> new EntityNotFoundException("Book Copy not found"));

        IssueRecord issueRecord = issueRecordRepository.findByBookCopyAndReturnDateIsNull(copy)
                .orElseThrow(() -> new RuntimeException("No active issue record found for this copy."));

        // Process the return
        copy.setStatus(BookStatus.AVAILABLE);
        bookCopyRepository.save(copy);
        
        issueRecord.setReturnDate(LocalDate.now());
        
        // Rule 3: Calculate and apply fine if overdue
        if (LocalDate.now().isAfter(issueRecord.getDueDate())) {
            long daysOverdue = ChronoUnit.DAYS.between(issueRecord.getDueDate(), LocalDate.now());
            BigDecimal fineAmount = FINE_PER_DAY.multiply(new BigDecimal(daysOverdue));
            issueRecord.setFine(fineAmount);

            // Assuming fine is collected on return, create a payment record
            Payment finePayment = new Payment();
            finePayment.setMember(issueRecord.getMember());
            finePayment.setAmount(fineAmount);
            finePayment.setType(PaymentType.FINE);
            finePayment.setTransactionTime(LocalDateTime.now());
            paymentRepository.save(finePayment);
        } else {
            issueRecord.setFine(BigDecimal.ZERO);
        }
        
        return issueRecordRepository.save(issueRecord);
    }
}