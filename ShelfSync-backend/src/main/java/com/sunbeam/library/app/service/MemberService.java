package com.sunbeam.library.app.service;

import com.sunbeam.library.app.dto.*;
import com.sunbeam.library.app.entity.*;
import com.sunbeam.library.app.enums.BookStatus;
import com.sunbeam.library.app.enums.PaymentType;
import com.sunbeam.library.app.repository.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MemberService {

    @Autowired private BookRepository bookRepository;
    @Autowired private BookCopyRepository bookCopyRepository;
    @Autowired private MemberRepository memberRepository;
    @Autowired private IssueRecordRepository issueRecordRepository;
    @Autowired private PaymentRepository paymentRepository;
    @Autowired private CartItemRepository cartItemRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    private static final int LENDING_PERIOD_DAYS = 7;
    private static final BigDecimal MEMBERSHIP_FEE = new BigDecimal("500.00");
    private static final BigDecimal FINE_PER_DAY = new BigDecimal("5.00");

    private Member getMemberByEmail(String email) {
        return memberRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Member not found with email: " + email));
    }

    // --- MEMBER DASHBOARD ---
    public MemberDashboardDTO getMemberDashboard(String email) {
        Member member = getMemberByEmail(email);

        MemberProfileDTO profile = mapToMemberProfileDTO(member);

        List<IssueRecord> borrowingHistory = issueRecordRepository.findByMemberOrderByIssueDateDesc(member);
        List<IssueRecord> currentlyBorrowed = borrowingHistory.stream()
                .filter(record -> record.getReturnDate() == null)
                .collect(Collectors.toList());

        BigDecimal outstandingFines = currentlyBorrowed.stream()
                .filter(record -> record.getDueDate().isBefore(LocalDate.now()))
                .map(record -> {
                    long daysOverdue = ChronoUnit.DAYS.between(record.getDueDate(), LocalDate.now());
                    return FINE_PER_DAY.multiply(new BigDecimal(daysOverdue));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<IssueRecordDTO> recentActivity = borrowingHistory.stream()
                .limit(3)
                .map(this::mapToIssueRecordDTO)
                .collect(Collectors.toList());

        return MemberDashboardDTO.builder()
                .memberName(profile.getName())
                .isMembershipActive(profile.isMembershipActive())
                .membershipDueDate(profile.getMembershipDueDate())
                .currentlyBorrowedCount(currentlyBorrowed.size())
                .totalBooksReadCount(borrowingHistory.size())
                .outstandingFines(outstandingFines)
                .recentActivity(recentActivity)
                .build();
    }

    // --- CART MANAGEMENT ---
    @Transactional
    public CartItemDTO addToCart(String email, Long copyId) {
        Member member = getMemberByEmail(email);
        BookCopy copy = bookCopyRepository.findById(copyId)
                .orElseThrow(() -> new EntityNotFoundException("Book copy not found."));

        if (copy.getStatus() != BookStatus.AVAILABLE) {
            throw new RuntimeException("This book copy is not available.");
        }
        if (cartItemRepository.findByBookCopyId(copyId).isPresent()) {
            throw new RuntimeException("This book copy is already in someone's cart.");
        }

        CartItem cartItem = new CartItem();
        cartItem.setMember(member);
        cartItem.setBookCopy(copy);
        cartItem.setAddedAt(LocalDateTime.now());
        
        CartItem savedItem = cartItemRepository.save(cartItem);
        return mapToCartItemDTO(savedItem);
    }

    public List<CartItemDTO> viewCart(String email) {
        Member member = getMemberByEmail(email);
        return cartItemRepository.findByMember(member).stream()
                .map(this::mapToCartItemDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void removeFromCart(String email, Long cartItemId) {
        Member member = getMemberByEmail(email);
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new EntityNotFoundException("Cart item not found."));

        if (!cartItem.getMember().getId().equals(member.getId())) {
            throw new SecurityException("You are not authorized to remove this item.");
        }
        cartItemRepository.delete(cartItem);
    }

    // --- CHECKOUT AND BORROW ---
    @Transactional
    public CheckoutResponseDTO checkoutAndBorrowFromCart(String email) {
        Member member = getMemberByEmail(email);
        List<CartItem> cartItems = cartItemRepository.findByMember(member);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Your cart is empty.");
        }

        BigDecimal totalAmountToPay = BigDecimal.ZERO;
        String paymentDetails = "";

        Optional<Payment> lastMembershipPayment = paymentRepository.findTopByMemberAndTypeOrderByDueDateDesc(member, PaymentType.MEMBERSHIP);
        boolean isMembershipActive = lastMembershipPayment.map(p -> p.getDueDate().isAfter(LocalDate.now())).orElse(false);

        if (!isMembershipActive) {
            totalAmountToPay = totalAmountToPay.add(MEMBERSHIP_FEE);
            paymentDetails += "Membership Fee (₹" + MEMBERSHIP_FEE + ")";
            
            Payment membershipPayment = new Payment();
            membershipPayment.setMember(member);
            membershipPayment.setAmount(MEMBERSHIP_FEE);
            membershipPayment.setType(PaymentType.MEMBERSHIP);
            membershipPayment.setTransactionTime(LocalDateTime.now());
            membershipPayment.setDueDate(LocalDate.now().plusMonths(1));
            paymentRepository.save(membershipPayment);
        }

        List<IssueRecord> newIssues = new ArrayList<>();
        for (CartItem item : cartItems) {
            BookCopy copy = item.getBookCopy();
            if(copy.getStatus() != BookStatus.AVAILABLE) {
                throw new RuntimeException("Book '" + copy.getBook().getName() + "' (Copy ID: " + copy.getId() + ") is no longer available.");
            }
            copy.setStatus(BookStatus.ISSUED);
            bookCopyRepository.save(copy);
            
            IssueRecord issueRecord = new IssueRecord();
            issueRecord.setMember(member);
            issueRecord.setBookCopy(copy);
            issueRecord.setIssueDate(LocalDate.now());
            issueRecord.setDueDate(LocalDate.now().plusDays(LENDING_PERIOD_DAYS));
            issueRecord.setFine(BigDecimal.ZERO);
            newIssues.add(issueRecordRepository.save(issueRecord));
        }

        cartItemRepository.deleteByMember(member);

        List<IssueRecordDTO> borrowedBookDTOs = newIssues.stream().map(this::mapToIssueRecordDTO).collect(Collectors.toList());

        return CheckoutResponseDTO.builder()
                .status("Success! Books have been issued to your account.")
                .borrowedBooks(borrowedBookDTOs)
                .amountPaid(totalAmountToPay)
                .paymentDetails(paymentDetails.isEmpty() ? "No payment required. Membership is active." : paymentDetails)
                .build();
    }
    
    // --- BOOK DISCOVERY SERVICES ---
    public List<BookDTO> searchBooks(String query) {
        List<Book> books = bookRepository.searchBooks(query);
        return books.stream().map(this::mapToBookDTO).collect(Collectors.toList());
    }

    public List<BookDTO> getAllBooks() {
        List<Book> books = bookRepository.findAll();
        return books.stream().map(this::mapToBookDTO).collect(Collectors.toList());
    }
    
    // --- ACCOUNT & HISTORY SERVICES ---
    public List<IssueRecordDTO> getMyBorrowedBooks(String email) {
        Member member = getMemberByEmail(email);
        return issueRecordRepository.findByMemberAndReturnDateIsNull(member)
                .stream().map(this::mapToIssueRecordDTO).collect(Collectors.toList());
    }

    public List<IssueRecordDTO> getMyBorrowingHistory(String email) {
        Member member = getMemberByEmail(email);
        return issueRecordRepository.findByMemberOrderByIssueDateDesc(member)
                .stream().map(this::mapToIssueRecordDTO).collect(Collectors.toList());
    }

    public List<PaymentDTO> getMyPaymentHistory(String email) {
        Member member = getMemberByEmail(email);
        return paymentRepository.findByMemberOrderByTransactionTimeDesc(member)
                .stream().map(this::mapToPaymentDTO).collect(Collectors.toList());
    }
    
    public MemberProfileDTO getMyProfile(String email) {
        Member member = getMemberByEmail(email);
        return mapToMemberProfileDTO(member);
    }
    
    public void changeMyPassword(String email, String oldPassword, String newPassword) {
        Member member = getMemberByEmail(email);
        if (!passwordEncoder.matches(oldPassword, member.getPassword())) {
            throw new RuntimeException("Incorrect old password");
        }
        member.setPassword(passwordEncoder.encode(newPassword));
        memberRepository.save(member);
    }

    // --- PRIVATE MAPPERS ---
    private CartItemDTO mapToCartItemDTO(CartItem cartItem) {
        return CartItemDTO.builder()
                .cartItemId(cartItem.getId())
                .copyId(cartItem.getBookCopy().getId())
                .bookName(cartItem.getBookCopy().getBook().getName())
                .bookAuthor(cartItem.getBookCopy().getBook().getAuthor())
                .rack(cartItem.getBookCopy().getRack())
                .addedAt(cartItem.getAddedAt())
                .build();
    }

    private BookDTO mapToBookDTO(Book book) {
        BookDTO dto = new BookDTO();
        dto.setId(book.getId());
        dto.setName(book.getName());
        dto.setAuthor(book.getAuthor());
        dto.setSubject(book.getSubject());
        dto.setIsbn(book.getIsbn());
        dto.setPrice(book.getPrice());
        dto.setTotalCopies(book.getCopies().size());
        dto.setAvailableCopies(bookCopyRepository.countByBookAndStatus(book, BookStatus.AVAILABLE));
        return dto;
    }

    private IssueRecordDTO mapToIssueRecordDTO(IssueRecord record) {
        IssueRecordDTO dto = new IssueRecordDTO();
        dto.setId(record.getId());
        dto.setBookName(record.getBookCopy().getBook().getName());
        dto.setBookAuthor(record.getBookCopy().getBook().getAuthor());
        dto.setCopyId(record.getBookCopy().getId());
        dto.setIssueDate(record.getIssueDate());
        dto.setDueDate(record.getDueDate());
        dto.setReturnDate(record.getReturnDate());
        dto.setFine(record.getFine());
        return dto;
    }

    private PaymentDTO mapToPaymentDTO(Payment payment) {
        PaymentDTO dto = new PaymentDTO();
        dto.setId(payment.getId());
        dto.setAmount(payment.getAmount());
        dto.setType(payment.getType());
        dto.setTransactionTime(payment.getTransactionTime());
        dto.setDueDate(payment.getDueDate());
        return dto;
    }

    private MemberProfileDTO mapToMemberProfileDTO(Member member) {
        MemberProfileDTO dto = new MemberProfileDTO();
        dto.setId(member.getId());
        dto.setName(member.getName());
        dto.setEmail(member.getEmail());
        dto.setPhone(member.getPhone());
        
        paymentRepository.findTopByMemberAndTypeOrderByDueDateDesc(member, PaymentType.MEMBERSHIP)
                .ifPresent(p -> {
                    dto.setMembershipDueDate(p.getDueDate());
                    dto.setMembershipActive(p.getDueDate().isAfter(LocalDate.now()));
                });
        return dto;
    }

    public List<BookCopyDTO> getAvailableCopiesForBook(Long bookId) {
    Book book = bookRepository.findById(bookId)
            .orElseThrow(() -> new EntityNotFoundException("Book not found with ID: " + bookId));

    return bookCopyRepository.findByBookAndStatus(book, BookStatus.AVAILABLE)
            .stream()
            .map(this::mapToBookCopyDTO) // A new mapper is needed
            .collect(Collectors.toList());
    }

    // Add this new private mapper to the service
    private BookCopyDTO mapToBookCopyDTO(BookCopy copy) {
        BookCopyDTO dto = new BookCopyDTO();
        dto.setId(copy.getId());
        dto.setBookId(copy.getBook().getId());
        dto.setBookName(copy.getBook().getName());
        dto.setRack(copy.getRack());
        dto.setStatus(copy.getStatus());
        return dto;
    }
}