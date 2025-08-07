package com.sunbeam.library.app.repository;

import com.sunbeam.library.app.entity.Book;
import com.sunbeam.library.app.entity.BookCopy;
import com.sunbeam.library.app.enums.BookStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookCopyRepository extends JpaRepository<BookCopy, Long> {
    List<BookCopy> findByBook(Book book);
    long countByBookAndStatus(Book book, BookStatus status);
    List<BookCopy> findByBookAndStatus(Book book, BookStatus status);
}