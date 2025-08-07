package com.sunbeam.library.app.controller;

import com.sunbeam.library.app.dto.*;
import com.sunbeam.library.app.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/member")
@PreAuthorize("hasRole('MEMBER')")
@Tag(name = "Member Controller", description = "APIs for library members for self-service actions.")
public class MemberController {

    @Autowired
    private MemberService memberService;

    // --- DASHBOARD ENDPOINT ---
    @GetMapping("/dashboard")
    @Operation(summary = "Get all aggregated data for the member's dashboard", description = "Requires MEMBER role.")
    public ResponseEntity<MemberDashboardDTO> getDashboard(Principal principal) {
        return ResponseEntity.ok(memberService.getMemberDashboard(principal.getName()));
    }

    // --- SELF-SERVICE CART & BORROW ENDPOINTS ---
    @PostMapping("/cart/add/{copyId}")
    @Operation(summary = "Add a book copy to the member's cart", description = "Requires MEMBER role.")
    public ResponseEntity<CartItemDTO> addToCart(@PathVariable Long copyId, Principal principal) {
        System.out.println("-----------------------------------------------------------------------------");
        System.out.println("Copy ID: " + copyId);
        CartItemDTO cartItem = memberService.addToCart(principal.getName(), copyId);
        return new ResponseEntity<>(cartItem, HttpStatus.CREATED);
    }

    @GetMapping("/cart")
    @Operation(summary = "View all items in the member's cart", description = "Requires MEMBER role.")
    public ResponseEntity<List<CartItemDTO>> viewCart(Principal principal) {
        return ResponseEntity.ok(memberService.viewCart(principal.getName()));
    }

    @DeleteMapping("/cart/remove/{cartItemId}")
    @Operation(summary = "Remove an item from the member's cart", description = "Requires MEMBER role.")
    public ResponseEntity<Map<String, String>> removeFromCart(@PathVariable Long cartItemId, Principal principal) {
        memberService.removeFromCart(principal.getName(), cartItemId);
        return ResponseEntity.ok(Map.of("message", "Item removed from cart successfully."));
    }

    @PostMapping("/cart/checkout")
    @Operation(summary = "Checkout the cart, pay if needed, and borrow the books", description = "Requires MEMBER role.")
    public ResponseEntity<CheckoutResponseDTO> checkoutCart(Principal principal) {
        CheckoutResponseDTO response = memberService.checkoutAndBorrowFromCart(principal.getName());
        return ResponseEntity.ok(response);
    }

    // --- BOOK DISCOVERY ENDPOINTS ---
    @GetMapping("/books/search")
    @Operation(summary = "Search for books in the library catalog", description = "Requires MEMBER role.")
    public ResponseEntity<List<BookDTO>> searchBooks(@RequestParam String query) {
        return ResponseEntity.ok(memberService.searchBooks(query));
    }

    @GetMapping("/books/all")
    @Operation(summary = "Get a list of all book titles in the library", description = "Requires MEMBER role.")
    public ResponseEntity<List<BookDTO>> getAllBooks() {
        return ResponseEntity.ok(memberService.getAllBooks());
    }

    // --- PERSONAL ACCOUNT & HISTORY ENDPOINTS ---
    @GetMapping("/me/profile")
    @Operation(summary = "Get the profile of the logged-in member", description = "Requires MEMBER role.")
    public ResponseEntity<MemberProfileDTO> getMyProfile(Principal principal) {
        return ResponseEntity.ok(memberService.getMyProfile(principal.getName()));
    }

    @GetMapping("/me/borrowed-books")
    @Operation(summary = "Get the list of currently borrowed books for the logged-in member", description = "Requires MEMBER role.")
    public ResponseEntity<List<IssueRecordDTO>> getMyBorrowedBooks(Principal principal) {
        return ResponseEntity.ok(memberService.getMyBorrowedBooks(principal.getName()));
    }

    @GetMapping("/me/borrowing-history")
    @Operation(summary = "Get the full borrowing history for the logged-in member", description = "Requires MEMBER role.")
    public ResponseEntity<List<IssueRecordDTO>> getMyBorrowingHistory(Principal principal) {
        return ResponseEntity.ok(memberService.getMyBorrowingHistory(principal.getName()));
    }

    @GetMapping("/me/payment-history")
    @Operation(summary = "Get the full payment history for the logged-in member", description = "Requires MEMBER role.")
    public ResponseEntity<List<PaymentDTO>> getMyPaymentHistory(Principal principal) {
        return ResponseEntity.ok(memberService.getMyPaymentHistory(principal.getName()));
    }

    @PostMapping("/me/change-password")
    @Operation(summary = "Change the password for the logged-in member", description = "Requires MEMBER role.")
    public ResponseEntity<Map<String, String>> changeMyPassword(@Valid @RequestBody ChangePasswordDTO dto, Principal principal) {
        memberService.changeMyPassword(principal.getName(), dto.getOldPassword(), dto.getNewPassword());
        return ResponseEntity.ok(Map.of("message", "Password changed successfully."));
    }

    @GetMapping("/books/{bookId}/copies")
    @Operation(summary = "Get a list of available copies for a specific book", description = "Requires MEMBER role.")
    public ResponseEntity<List<BookCopyDTO>> getAvailableCopies(@PathVariable Long bookId) {
        return ResponseEntity.ok(memberService.getAvailableCopiesForBook(bookId));
    }
}