package com.sunbeam.library.app.controller;

import com.sunbeam.library.app.dto.AddBookRequestDTO;
import com.sunbeam.library.app.dto.AddCopyRequestDTO;
import com.sunbeam.library.app.dto.IssueRequestDTO;
import com.sunbeam.library.app.entity.Book;
import com.sunbeam.library.app.entity.BookCopy;
import com.sunbeam.library.app.entity.IssueRecord;
import com.sunbeam.library.app.service.LibrarianService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/librarian")
@PreAuthorize("hasRole('LIBRARIAN')")
public class LibrarianController {

    @Autowired
    private LibrarianService librarianService;

    @PostMapping("/books")
    @Operation(summary = "Add a new book title to the library catalog", description = "Requires LIBRARIAN role.")
    public ResponseEntity<Book> addBook(@Valid @RequestBody AddBookRequestDTO bookDTO) {
        Book newBook = librarianService.addBook(bookDTO);
        return new ResponseEntity<>(newBook, HttpStatus.CREATED);
    }

    @PostMapping("/copies")
    @Operation(summary = "Add one or more copies of an existing book", description = "Requires LIBRARIAN role.")
    public ResponseEntity<List<BookCopy>> addCopies(@Valid @RequestBody AddCopyRequestDTO copyDTO) {
        List<BookCopy> newCopies = librarianService.addCopies(copyDTO);
        return new ResponseEntity<>(newCopies, HttpStatus.CREATED);
    }

    @PostMapping("/issue")
    @Operation(summary = "Issue a book copy to a member", description = "Requires LIBRARIAN role.")
    public ResponseEntity<IssueRecord> issueBook(@RequestBody IssueRequestDTO issueRequest) {
        IssueRecord record = librarianService.issueBook(issueRequest.getMemberId(), issueRequest.getCopyId());
        return ResponseEntity.ok(record);
    }

    @PostMapping("/return/{copyId}")
    @Operation(summary = "Process the return of a book copy", description = "Requires LIBRARIAN role.")
    public ResponseEntity<IssueRecord> returnBook(@PathVariable Long copyId) {
        IssueRecord record = librarianService.returnBook(copyId);
        return ResponseEntity.ok(record);
    }
}